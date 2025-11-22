import api from './api_service';

// Obtener todos los clientes
export const getClientes = async () => {
  try {
    const res = await api.get('/clientes');
    return res.data;
  } catch (err) {
    console.error('Error al obtener los clientes:', err);
    throw err;
  }
};
