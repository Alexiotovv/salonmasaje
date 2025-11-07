import React from 'react';
import { ContactForm } from '../components/ContactForm';
import { FaqSection } from '../components/FaqSection';

export const ContactPage = () => {
  return (
    <div>
      <h1>Soporte y Contacto</h1>
      <p>¿Tienes dudas? ¡Escríbenos o revisa nuestras preguntas frecuentes!</p>
      
      <ContactForm />
      <FaqSection />
    </div>
  );
};