import axios from 'axios';

// Create a custom axios instance
const api = axios.create({
  // The proxy in package.json will handle the base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers['Authorization'] = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && (error.response.status === 401 || error.response.status === 403) && error.config.url !== '/auth/login') {
      // Token is expired or invalid
      localStorage.removeItem('userInfo'); // Clear the bad token
      // Redirect to login page. This causes a full page refresh, clearing all state.
      window.location.href = '/login';
    }
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);

export default api;