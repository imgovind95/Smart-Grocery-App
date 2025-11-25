// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// // Interceptor to add JWT token to requests
// api.interceptors.request.use((config) => {
//   const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//   if (userInfo && userInfo.token) {
//     config.headers.Authorization = `Bearer ${userInfo.token}`;
//   }
//   return config;
// });

// export default api;
import axios from 'axios';

// Create an axios instance
const api = axios.create({
  // This will use the VITE_API_URL from your .env.local file (or Vercel env vars)
  // If not set, it falls back to localhost for safety
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001', 
});

// Interceptor to add JWT token to requests automatically
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;