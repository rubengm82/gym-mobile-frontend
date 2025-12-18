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

// Login
export const login = async (mail, password) => {
  try {
    const res = await api.post('/login', { mail, password });
    return res.data;
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    throw err;
  }
};

// Logout
export const logout = async () => {
  try {
    const res = await api.post('/logout');
    return res.data;
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
    throw err;
  }
};
