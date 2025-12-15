import axios from 'axios';

const api = axios.create({
  baseURL: '/.netlify/functions/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers['Authorization'] = `Bearer ${userInfo.token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response && (error.response.status === 401 || error.response.status === 403) && error.config.url !== '/auth/login') {

      localStorage.removeItem('userInfo');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;