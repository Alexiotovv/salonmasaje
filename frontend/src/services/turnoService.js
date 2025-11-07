export const getTurnosByClienteId = async (clienteId) => {
  try {
    const response = await fetch(`/api/turnos/cliente/${clienteId}`);
    if (!response.ok) {
      throw new Error('Error al obtener los turnos del cliente');
    }
    const data = await response.json();
    return data;
    } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  } 
};