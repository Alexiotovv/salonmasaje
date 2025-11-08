-- backend/db/schema.sql

-- CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- SERVICIOS (mínimo para poder mostrar historial de servicios recibidos)
CREATE TABLE IF NOT EXISTS servicios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  duracion_min INT CHECK (duracion_min > 0),
  precio NUMERIC(10,2) CHECK (precio >= 0),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- TURNOS (usados para historial de turnos y, cuando están completados, historial de servicios)
CREATE TABLE IF NOT EXISTS turnos (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES clientes(id) ON DELETE SET NULL,
  servicio_id INT REFERENCES servicios(id) ON DELETE SET NULL,
  fecha TIMESTAMP NOT NULL,
  estado VARCHAR(20) NOT NULL
    CHECK (estado IN ('pendiente','confirmado','cancelado','completado')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_turnos_cliente ON turnos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_turnos_estado  ON turnos(estado);
CREATE INDEX IF NOT EXISTS idx_turnos_fecha   ON turnos(fecha);
