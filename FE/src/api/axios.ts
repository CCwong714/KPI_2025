/* eslint-disable @typescript-eslint/no-explicit-any */
import { STORAGE_KEYS } from '@/constants/storageKeys';
import type { InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

export const serverApi = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    requiresAuth: true,
  },
  withCredentials: true,
});

serverApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const requiresAuth = config.headers?.requiresAuth;
    const accessToken = sessionStorage.getItem(STORAGE_KEYS.accessToken);

    if (requiresAuth && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

serverApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      window.sessionStorage.clear();
      window.localStorage.clear();
      window.location.href = `http://${window.location.host}/login`;
    }
    return Promise.reject(error);
  }
);
