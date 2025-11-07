import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AppointmentForm from './AppointmentForm';
import './CalendarView.css';

const CalendarView = () => {
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      title: 'Ana García - Juan Pérez\nMasaje Relajante - $50 (60 min)\nPrecio: $50',
      start: '2024-10-15T10:00:00',
      end: '2024-10-15T11:00:00',
      extendedProps: {
        client: 'Juan Pérez',
        masseuse: 'Ana García',
        service: 'Masaje Relajante - $50 (60 min)',
        status: 'confirmed'
      }
    },
    {
      id: '2',
      title: 'Carlos Rodríguez - María López\nMasaje Deportivo - $70 (90 min)\nPrecio: $70',
      start: '2024-10-16T14:00:00',
      end: '2024-10-16T15:30:00',
      extendedProps: {
        client: 'María López',
        masseuse: 'Carlos Rodríguez',
        service: 'Masaje Deportivo - $70 (90 min)',
        status: 'confirmed'
      }
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setSelectedAppointment(null);
    setShowForm(true);
  };

  const handleEventClick = (arg) => {
    const appointment = appointments.find(apt => apt.id === arg.event.id);
    setSelectedAppointment(appointment);
    setSelectedDate(null);
    setShowForm(true);
  };

  const handleFormSubmit = (appointmentData) => {
    // Extract price from service string (e.g., "Masaje Relajante - $50 (60 min)" -> "$50")
    const priceMatch = appointmentData.service.match(/\$(\d+)/);
    const price = priceMatch ? priceMatch[1] : '0';

    if (selectedAppointment) {
      // Edit existing appointment
      setAppointments(appointments.map(apt =>
        apt.id === selectedAppointment.id
          ? {
              ...apt,
              title: `${appointmentData.masseuse} - ${appointmentData.client}\n${appointmentData.service}\nPrecio: $${price}`,
              start: appointmentData.start,
              end: appointmentData.end,
              extendedProps: appointmentData
            }
          : apt
      ));
    } else {
      // Add new appointment
      const newAppointment = {
        id: Date.now().toString(),
        title: `${appointmentData.masseuse} - ${appointmentData.client}\n${appointmentData.service}\nPrecio: $${price}`,
        start: appointmentData.start,
        end: appointmentData.end,
        extendedProps: appointmentData
      };
      setAppointments([...appointments, newAppointment]);
    }
    setShowForm(false);
  };

  const handleCancelAppointment = (appointmentId) => {
    setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    setShowForm(false);
  };

  const handleEditAppointment = (appointmentId) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    setSelectedAppointment(appointment);
    setSelectedDate(null);
    setShowForm(true);
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este turno?')) {
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    }
  };

  // Filter appointments based on search term
  const filteredAppointments = useMemo(() => {
    if (!searchTerm) return appointments;
    return appointments.filter(appointment =>
      appointment.extendedProps.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.extendedProps.masseuse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.extendedProps.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [appointments, searchTerm]);

  const renderEventContent = (eventInfo) => {
    const appointment = eventInfo.event.extendedProps;
    const priceMatch = appointment.service.match(/\$(\d+)/);
    const price = priceMatch ? priceMatch[1] : '0';
    const startTime = new Date(eventInfo.event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const endTime = new Date(eventInfo.event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    return (
      <div className="calendar-event-content">
        <div className="event-header">
          <strong>{appointment.masseuse} - {appointment.client}</strong>
        </div>
        <div className="event-details">
          <div><strong>Servicio:</strong> {appointment.service}</div>
          <div><strong>Hora:</strong> {startTime} - {endTime}</div>
          <div><strong>Precio:</strong> ${price}</div>
          <div><strong>Estado:</strong> {appointment.status === 'confirmed' ? 'Confirmado' : appointment.status === 'pending' ? 'Pendiente' : 'Cancelado'}</div>
        </div>
        <div className="event-actions">
          <button
            className="event-btn-edit"
            onClick={(e) => {
              e.stopPropagation();
              handleEditAppointment(eventInfo.event.id);
            }}
            title="Editar turno"
          >
            ✏️
          </button>
          <button
            className="event-btn-delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAppointment(eventInfo.event.id);
            }}
            title="Eliminar turno"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <h1>Agenda de Turnos - Gatitas Senatinas</h1>
      <div className="calendar-actions">
        <button className="btn-create" onClick={() => setShowForm(true)}>
          Nuevo Turno
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por cliente, masajista o servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      <div className="calendar-and-list">
        <div className="calendar-section">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="timeGridWeek"
            events={appointments}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="auto"
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
              startTime: '08:00',
              endTime: '20:00',
            }}
          />
        </div>

        <div className="appointments-sidebar">
          <h2>Turnos Registrados</h2>
          {filteredAppointments.length === 0 ? (
            <p>No hay turnos registrados.</p>
          ) : (
            <div className="appointments-list">
              {filteredAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-details">
                    <h4>{appointment.extendedProps.masseuse} - {appointment.extendedProps.client}</h4>
                    <p><strong>Servicio:</strong> {appointment.extendedProps.service}</p>
                    <p><strong>Fecha:</strong> {new Date(appointment.start).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {new Date(appointment.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(appointment.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    <p><strong>Estado:</strong> <span className={`status-${appointment.extendedProps.status}`}>{appointment.extendedProps.status === 'confirmed' ? 'Confirmado' : appointment.extendedProps.status === 'pending' ? 'Pendiente' : 'Cancelado'}</span></p>
                  </div>
                  <div className="appointment-actions">
                    <button className="btn-edit" onClick={() => handleEditAppointment(appointment.id)}>
                      Actualizar
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteAppointment(appointment.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <AppointmentForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          onDelete={selectedAppointment ? () => handleCancelAppointment(selectedAppointment.id) : null}
          initialData={selectedAppointment ? {
            ...selectedAppointment.extendedProps,
            start: selectedAppointment.start,
            end: selectedAppointment.end
          } : { start: selectedDate }}
        />
      )}
    </div>
  );
};

export default CalendarView;
