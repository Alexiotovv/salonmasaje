import React, { useState, useEffect } from 'react';
import './AppointmentForm.css';

const AppointmentForm = ({ onSubmit, onCancel, onDelete, initialData }) => {
  const [formData, setFormData] = useState({
    client: '',
    masseuse: '',
    service: '',
    start: '',
    end: '',
    status: 'confirmed'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        client: initialData.client || '',
        masseuse: initialData.masseuse || '',
        service: initialData.service || '',
        start: initialData.start ? new Date(initialData.start).toISOString().slice(0, 16) : '',
        end: initialData.end ? new Date(initialData.end).toISOString().slice(0, 16) : '',
        status: initialData.status || 'confirmed'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.client || !formData.masseuse || !formData.service || !formData.start) {
      alert('Por favor complete todos los campos requeridos.');
      return;
    }
    onSubmit(formData);
  };

  const calculateEndTime = (startTime, service) => {
    const start = new Date(startTime);
    let duration = 60; // default 60 minutes

    switch (service) {
      case 'Casual con condon':
        duration = 60;
        break;
      case 'Casual con besos y abrazos':
        duration = 90;
        break;
      case 'Fetiches':
        duration = 120;
        break;
      case 'Baile, oral y anal':
        duration = 110;
        break;
      case 'Full anal sin condon(Incluye Sida)':
        duration = 80;
        break;
      default:
        duration = 60;
    }

    const end = new Date(start.getTime() + duration * 60000);
    return end.toISOString().slice(0, 16);
  };

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setFormData(prev => ({
      ...prev,
      service,
      end: prev.start ? calculateEndTime(prev.start, service) : ''
    }));
  };

  const handleStartChange = (e) => {
    const start = e.target.value;
    setFormData(prev => ({
      ...prev,
      start,
      end: prev.service ? calculateEndTime(start, prev.service) : ''
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Editar Turno' : 'Nuevo Turno'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="client">Cliente:</label>
            <input
              type="text"
              id="client"
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="form-group">
            <label htmlFor="masseuse">Nombre del Masajista:</label>
            <input
              type="text"
              id="masseuse"
              name="masseuse"
              value={formData.masseuse}
              onChange={handleChange}
              required
              placeholder="Ingrese el nombre del masajista"
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Tipo de Masaje:</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleServiceChange}
              required
            >
              <option value="">Seleccionar tipo de masaje</option>
              <option value="Casual con condon">Casual con condon - $60 (60 min)</option>
              <option value="Casual con besos y abrazos">Casual con besos y abrazos - $90 (90 min)</option>
              <option value="Fetiches">Fetiches - $120 (75 min)</option>
              <option value="Baile, oral y anal">Baile, oral y anal - $110 (45 min)</option>
              <option value="Full anal sin condon(Incluye Sida)">Full anal sin condon(Incluye Sida) - $80 (90 min)</option>
              <option value="Trio + beso de un negro">Trio + beso de un negro - $60 (60 min)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="start">Fecha y Hora de Inicio:</label>
            <input
              type="datetime-local"
              id="start"
              name="start"
              value={formData.start}
              onChange={handleStartChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end">Fecha y Hora de Fin:</label>
            <input
              type="datetime-local"
              id="end"
              name="end"
              value={formData.end}
              onChange={handleChange}
              required
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="confirmed">Confirmado</option>
              <option value="pending">Pendiente</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {initialData ? 'Actualizar' : 'Crear'} Turno
            </button>
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancelar
            </button>
            {onDelete && (
              <button type="button" onClick={onDelete} className="btn-delete">
                Eliminar Turno
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
