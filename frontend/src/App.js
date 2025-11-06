import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // <-- IMPORTA
import './App.css';
import { ContactPage } from './pages/ContactPage'; // <-- IMPORTA TU PÁGINA

// (Puedes crear una página 'HomePage' para la ruta '/')
const HomePage = () => <div><h1>Bienvenido al Salón de Masajes</h1><p>Esta es la página principal.</p></div>;

function App() {
  return (
    <div className="App">
      
      {/* 1. Menú de Navegación Básico */}
      <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Inicio</Link>
        <Link to="/contacto">Contacto y Soporte</Link> {/* <-- ENLACE A TU PÁGINA */}
      </nav>

      {/* 2. Definición de las Rutas */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contacto" element={<ContactPage />} /> {/* <-- TU RUTA */}
        {/* Aquí tus compañeros agregarán sus propias rutas */}
      </Routes>

    </div>
  );
}

export default App;