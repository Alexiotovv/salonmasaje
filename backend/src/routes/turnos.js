//src/routes/turno.js
import express from 'express';
import pool from '../db/index.js';
import { notifyCreate, notifyCancel } from '../notifications/notify.js';
import names from '../config/names.js';
import { DateTime } from 'luxon';

// helper to return standardized error responses with Lima timestamp
function errRes(res, status, message, code = null) {
  const timestamp = DateTime.now().setZone('America/Lima').toISO();
  return res.status(status).json({ error: message, code, timestamp });
}

const router = express.Router();

// Helper to check overlapping appointments for a masajista
async function existeSolapamiento(masajista_id, startISO, endISO) {
  const q = `
    SELECT 1 FROM ${names.TURNOS}
    WHERE masajista_id = $1
      AND status = 'scheduled'
      AND NOT (end_time <= $2 OR start_time >= $3)
    LIMIT 1
  `;
  const r = await pool.query(q, [masajista_id, startISO, endISO]);
  return r.rows.length > 0;
}

// Helper: validar horario del salon (open_time, close_time, non_working_days)
async function validarHorarioSalon(startDT, endDT) {
  const r = await pool.query(`SELECT open_time, close_time, non_working_days FROM ${names.SALON_CONFIG} LIMIT 1`);
  if (!r.rows.length) return { ok: true };
  const cfg = r.rows[0];
  // non_working_days is stored as TEXT[]; check date string YYYY-MM-DD
  const dateStr = startDT.toISODate();
  if (cfg.non_working_days && Array.isArray(cfg.non_working_days) && cfg.non_working_days.includes(dateStr)) {
    return { ok: false, reason: 'Día no laborable' };
  }

  // Compare times in America/Lima
  const startTime = startDT.toFormat('HH:mm:ss');
  const endTime = endDT.toFormat('HH:mm:ss');
  const open = ('' + cfg.open_time).length === 5 ? ('' + cfg.open_time) + ':00' : '' + cfg.open_time;
  const close = ('' + cfg.close_time).length === 5 ? ('' + cfg.close_time) + ':00' : '' + cfg.close_time;

  if (startTime < open || endTime > close) {
    return { ok: false, reason: `Fuera de horario del salón (${open} - ${close})` };
  }

  return { ok: true };
}

// Helper: validar que el masajista tenga disponibilidad para el day/horario
async function validarDisponibilidadMasajista(masajista_id, startDT, endDT) {
  // weekday mapping: luxon weekday 1=Mon..7=Sun => migration uses 0=Sun..6=Sat
  const weekday = startDT.weekday % 7; // 1->1 .. 6->6, 7->0
  const startTime = startDT.toFormat('HH:mm:ss');
  const endTime = endDT.toFormat('HH:mm:ss');
  const q = `
    SELECT 1 FROM ${names.DISPONIBILIDADES}
    WHERE masajista_id = $1
      AND weekday = $2
      AND start_time <= $3
      AND end_time >= $4
    LIMIT 1
  `;
  const r = await pool.query(q, [masajista_id, weekday, startTime, endTime]);
  return r.rows.length > 0;
}

// POST / -> crear turno
router.post('/', async (req, res) => {
  try {
    const { client_id, masajista_id, servicio_id, start_time } = req.body;
    if (!client_id || !masajista_id || !servicio_id || !start_time) {
      return errRes(res, 400, 'Faltan campos requeridos', 'MISSING_FIELDS');
    }

    // obtener duración del servicio (usa mapeo de columnas/tablas)
    const svc = await pool.query(`SELECT ${names.SERVICE_DURATION_COL} FROM ${names.SERVICIOS} WHERE id=$1`, [servicio_id]);
    if (!svc.rows.length) return errRes(res, 404, 'Servicio no encontrado', 'SERVICE_NOT_FOUND');
    const duration = svc.rows[0][names.SERVICE_DURATION_COL];

    // parse start_time using Luxon and convert to America/Lima
    const startDT = DateTime.fromISO(start_time, { setZone: true }).setZone('America/Lima');
    if (!startDT.isValid) return errRes(res, 400, 'start_time inválido', 'INVALID_START_TIME');
    const endDT = startDT.plus({ minutes: duration });

    const startISO = startDT.toUTC().toISO({ suppressMilliseconds: true });
    const endISO = endDT.toUTC().toISO({ suppressMilliseconds: true });

    // validar masajista (usa mapeo de tablas/columnas)
    const m = await pool.query(`SELECT ${names.MASAJISTA_ACTIVE_COL} FROM ${names.MASAJISTAS} WHERE id=$1`, [masajista_id]);
    if (!m.rows.length) return errRes(res, 404, 'Masajista no encontrado', 'MASAJISTA_NOT_FOUND');
    if (m.rows[0][names.MASAJISTA_ACTIVE_COL] === false) return errRes(res, 400, 'Masajista inactivo', 'MASAJISTA_INACTIVO');

    // validar horario del salon (pasar DateTime en Lima)
    const salonCheck = await validarHorarioSalon(startDT, endDT);
    if (!salonCheck.ok) return errRes(res, 400, salonCheck.reason, 'SALON_CLOSED');

    // validar disponibilidad del masajista
    const disponible = await validarDisponibilidadMasajista(masajista_id, startDT, endDT);
    if (!disponible) return errRes(res, 400, 'Masajista no disponible en ese horario', 'MASAJISTA_NO_DISPONIBLE');

    // comprobar solapamiento
    if (await existeSolapamiento(masajista_id, startISO, endISO)) {
      return errRes(res, 409, 'Horario no disponible: solapa con otro turno', 'SOLAPAMIENTO');
    }

    // insertar turno
    const ins = await pool.query(
      `INSERT INTO ${names.TURNOS} (client_id, masajista_id, servicio_id, start_time, end_time, status, created_at)
       VALUES ($1,$2,$3,$4,$5,'scheduled',NOW()) RETURNING *`,
      [client_id, masajista_id, servicio_id, startISO, endISO]
    );

    const nuevo = ins.rows[0];
    // simple notification (console log) - replace with real provider later
    try { notifyCreate(nuevo); } catch (e) { console.error('notifyCreate failed', e); }
    return res.status(201).json({ data: nuevo, timestamp: DateTime.now().setZone('America/Lima').toISO() });
  } catch (err) {
    console.error(err);
    return errRes(res, 500, 'Error del servidor', 'SERVER_ERROR');
  }
});

// GET / -> listar turnos (filtros: masajista_id, client_id, date YYYY-MM-DD)
router.get('/', async (req, res) => {
  try {
    const { masajista_id, client_id, date } = req.query;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (masajista_id) { conditions.push(`masajista_id = $${idx++}`); params.push(masajista_id); }
    if (client_id)    { conditions.push(`client_id = $${idx++}`); params.push(client_id); }
    if (date) {
      // interpret the date as in America/Lima, convert range to UTC for DB stored timestamps
      const dayStart = DateTime.fromISO(date, { zone: 'America/Lima' }).startOf('day');
      const dayEnd = dayStart.endOf('day');
      const from = dayStart.toUTC().toISO({ suppressMilliseconds: true });
      const to = dayEnd.toUTC().toISO({ suppressMilliseconds: true });
      conditions.push(`start_time >= $${idx} AND start_time <= $${idx+1}`);
      params.push(from, to);
      idx += 2;
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const q = `SELECT * FROM ${names.TURNOS} ${where} ORDER BY start_time ASC LIMIT 500`;
    const r = await pool.query(q, params);
    return res.json({ data: r.rows, timestamp: DateTime.now().setZone('America/Lima').toISO() });
  } catch (err) {
    console.error(err);
    return errRes(res, 500, 'Error del servidor', 'SERVER_ERROR');
  }
});

// GET /:id -> detalle
router.get('/:id', async (req, res) => {
  try {
    const r = await pool.query(`SELECT * FROM ${names.TURNOS} WHERE id=$1`, [req.params.id]);
    if (!r.rows.length) return errRes(res, 404, 'Turno no encontrado', 'TURNO_NOT_FOUND');
    return res.json({ data: r.rows[0], timestamp: DateTime.now().setZone('America/Lima').toISO() });
  } catch (err) {
    console.error(err);
    return errRes(res, 500, 'Error del servidor', 'SERVER_ERROR');
  }
});

// PATCH /:id/cancel -> cancelar turno
router.patch('/:id/cancel', async (req, res) => {
  try {
    const r = await pool.query(`SELECT * FROM ${names.TURNOS} WHERE id=$1`, [req.params.id]);
    if (!r.rows.length) return errRes(res, 404, 'Turno no encontrado', 'TURNO_NOT_FOUND');
    const turno = r.rows[0];
    if (turno.status === 'cancelled') return errRes(res, 400, 'Turno ya cancelado', 'TURNO_ALREADY_CANCELLED');

    const u = await pool.query(`UPDATE ${names.TURNOS} SET status='cancelled' WHERE id=$1 RETURNING *`, [req.params.id]);
    try { notifyCancel(u.rows[0]); } catch (e) { console.error('notifyCancel failed', e); }
    return res.json({ data: u.rows[0], timestamp: DateTime.now().setZone('America/Lima').toISO() });
  } catch (err) {
    console.error(err);
    return errRes(res, 500, 'Error del servidor', 'SERVER_ERROR');
  }
});

export default router;
