// src/api.js
import axios from 'axios';

// Use environment variable for production, fallback to localhost in development
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';

console.log('🟡 API Base URL:', SERVER_URL); // Helps confirm the correct URL in deployment

// Create axios instance
const api = axios.create({
  baseURL: SERVER_URL,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global response interceptor for error handling
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config || {};

    console.error('🚨 API Error:', {
      url: config.url,
      method: config.method,
      data: config.data,
      message: error.message,
      status: error.response?.status,
      responseData: error.response?.data,
      timestamp: new Date().toISOString(),
    });

    // Timeout error
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(
        new Error(`Request timed out. Please verify the server is running at ${SERVER_URL}.`)
      );
    }

    // No response from server (likely CORS, network, or wrong server URL)
    if (!error.response) {
      try {
        // Try to ping the server to check if it's reachable
        await axios.get(`${SERVER_URL}/ping`, { timeout: 5000 });
      } catch (pingError) {
        return Promise.reject(
          new Error(
            `Network error: Server at ${SERVER_URL} is unreachable.\nPlease check:\n- Server is deployed and running\n- CORS is configured correctly\n- Environment variable is set properly in Vercel`
          )
        );
      }
    }

    // Pass all other errors
    return Promise.reject(error);
  }
);

export default api;

