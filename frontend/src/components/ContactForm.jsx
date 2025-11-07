import React, { useState } from 'react';

// Estilos básicos (puedes moverlos a un archivo .css luego)
const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '500px',
  margin: '2rem auto',
  gap: '1rem',
};

const inputStyles = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const buttonStyles = {
  padding: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};


export const ContactForm = () => {
  // Estados para guardar lo que el usuario escribe
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    
    // Tu tarea dice que el foco es la UI,
    // así que por ahora solo mostramos una alerta.
    alert(`Mensaje enviado por: ${nombre} (${email})`);
    
    // Aquí es donde te conectarías al backend en el futuro
  };

  return (
    <form style={formStyles} onSubmit={handleSubmit}>
      <h3>Formulario de Contacto</h3>
      
      <input 
        type="text" 
        placeholder="Tu Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        style={inputStyles}
      />
      
      <input 
        type="email" 
        placeholder="Tu Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={inputStyles}
      />
      
      <input 
        type="text" 
        placeholder="Asunto"
        value={asunto}
        onChange={(e) => setAsunto(e.target.value)}
        required
        style={inputStyles}
      />
      
      <textarea 
        placeholder="Tu Mensaje"
        rows="5"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        required
        style={inputStyles}
      ></textarea>
      
      <button type="submit" style={buttonStyles}>
        Enviar Mensaje
      </button>
    </form>
  );
};