// src/pages/Admin/Clientes/ClienteProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { clienteMock } from '../../../mocks/clienteMock';
import { turnosMock } from '../../../mocks/turnosMock';
import { formatFecha } from '../../../utils/formatters';

const ClienteProfile = () => {
  const { clienteId } = useParams(); // por si decides simular varios IDs
  const [cliente, setCliente] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [loading] = useState(false);

  useEffect(() => {
    // Simulamos una "carga" asíncrona (opcional: usa setTimeout si quieres efecto de loading)
    setCliente(clienteMock);
    setTurnos(turnosMock);
  }, [clienteId]);

  if (!cliente) return <div>Cargando...</div>;

  return (
    <div className="cliente-profile-page" style={{ padding: '20px' }}>
      <h2>👤 Perfil de Cliente</h2>
      
      <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', textAlign: 'left', marginBottom: '24px' }}>
        <p><strong>Nombre:</strong> {cliente.nombre}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
        <p><strong>Email:</strong> {cliente.email}</p>
        <p><strong>Dirección:</strong> {cliente.direccion}</p>
        <p><strong>Registrado:</strong> {formatFecha(cliente.fechaRegistro)}</p>
      </div>

      <h3>📅 Historial de Turnos ({turnos.length})</h3>
      {turnos.length === 0 ? (
        <p>No hay turnos registrados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Fecha</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Servicio</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Masajista</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Estado</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatFecha(turno.fechaHora)}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{turno.servicio.nombre}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{turno.masajista.nombre}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{turno.estado}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>${turno.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClienteProfile;