
import axios from 'axios';


const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: SERVER_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.response.use(
  response => response,
  async error => {
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      message: error.message,
      status: error.response?.status,
      responseData: error.response?.data,
      timestamp: new Date().toISOString(),
    });

  
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error(`Request timed out. Please verify the server is running at ${SERVER_URL}.`));
    }

    if (!error.response) {
      
      try {
        await axios.get(`${SERVER_URL}/ping`, { timeout: 5000 });
      } catch (pingError) {
        return Promise.reject(new Error(`Network error. Server at ${SERVER_URL} is unreachable. Please check your connection or server status.`));
      }
    }

    return Promise.reject(error);
  }
);

export default api;
