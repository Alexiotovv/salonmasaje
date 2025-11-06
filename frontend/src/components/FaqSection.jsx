import React from 'react';

// Estilos básicos
const faqStyles = {
  maxWidth: '500px',
  margin: '2rem auto',
  padding: '1rem',
  borderTop: '2px solid #eee',
};

export const FaqSection = () => {
  return (
    <section style={faqStyles}>
      <h2>Preguntas Frecuentes (FAQ)</h2>
      
      <div>
        <h4>¿Cómo puedo agendar un turno?</h4>
        <p>Puedes agendar un turno yendo a la sección "Agenda" y seleccionando un masajista, servicio y horario disponible.</p>
      </div>

      <div>
        <h4>¿Puedo cancelar un turno?</h4>
        <p>Sí, puedes cancelar tus turnos desde tu perfil de cliente con al menos 24 horas de anticipación.</p>
      </div>

      <div>
        <h4>¿Qué métodos de pago aceptan?</h4>
        <p>Aceptamos pagos en efectivo, tarjeta de crédito y débito en el salón.</p>
      </div>

    </section>
  );
};