import axios from 'axios';

// Vite uses import.meta.env to access environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

export default api;