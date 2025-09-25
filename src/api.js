const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://wings-cafe-3-nlcg.onrender.com';

const api = axios.create({
  baseURL: `${SERVER_URL}/api`, // <-- include /api prefix
});

