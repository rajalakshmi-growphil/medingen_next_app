import axios from 'axios';
import Cookies from 'js-cookie';

export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'https://medingen.in/api/';

export const handleSignOut = () => {
  if (typeof window !== 'undefined') {
    Cookies.remove('jwt_token');
    Cookies.remove('customer_name');
    Cookies.remove('email');
    Cookies.remove('customer_id');
    Cookies.remove('location');
    Cookies.remove('cart_count');
    localStorage.removeItem('token');
    localStorage.removeItem('cartState');
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new Event('clearCart'));
  }
};

export const apiClient = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const message = error.response.data?.message || error.response.data?.error || '';
      if (message === 'Token is invalid' || message === 'Invalid token') {
        handleSignOut();
      }
    }
    return Promise.reject(error);
  }
);
