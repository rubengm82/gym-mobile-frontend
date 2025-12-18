import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // tu ruta de Laravel Serve + /api
  timeout: 5000,
});

// Función para establecer el token de autenticación
api.setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
