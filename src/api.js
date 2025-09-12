import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Ensure this matches your backend server URL
  timeout: 15000, // 15-second timeout for slower connections
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for detailed error handling
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
      return Promise.reject(new Error('Request timed out. Please verify the server is running at http://localhost:3001.'));
    }
    if (!error.response) {
      // Attempt to ping the server to confirm availability
      try {
        await axios.get('http://localhost:3001/ping', { timeout: 5000 });
      } catch (pingError) {
        return Promise.reject(new Error('Network error. Server at http://localhost:3001 is unreachable. Please check your connection or server status.'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
