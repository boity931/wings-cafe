import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://wings-cafe-3-nlcg.onrender.com/api'
    : 'http://localhost:10000/api',
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;
