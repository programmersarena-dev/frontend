import axios from "axios";

const TOKEN_STORAGE_KEY = "ACCESS_TOKEN";
const LEGACY_TOKEN_STORAGE_KEY = "TOKEN";
const TOKEN_EXPIRES_AT_KEY = "ACCESS_TOKEN_EXPIRES_AT";

export const getStoredToken = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY);
  return token && token !== "undefined" ? token : null;
};

export const getStoredTokenExpiry = () => {
  const expiry = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
  return expiry && expiry !== "undefined" ? expiry : null;
};

export const isTokenExpired = (expiry) => {
  if (!expiry) return false;
  return new Date(expiry).getTime() <= Date.now();
};

export const setStoredToken = (token, expiresAt = null) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(LEGACY_TOKEN_STORAGE_KEY, token);
    if (expiresAt) {
      localStorage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt);
    }
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(LEGACY_TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  }
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
};

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const isRefreshRequest = config.url.includes("/auth/refresh");

    if (isRefreshRequest) {
      return config;
    }

    const token = getStoredToken();
    const expiry = getStoredTokenExpiry();

    if (token && expiry && isTokenExpired(expiry)) {
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const isRefreshRequest = originalRequest.url.includes("/auth/refresh");

    if (error.response.status === 401 && !originalRequest._retry && !isRefreshRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          const token = response.data?.token || response.data?.access_token || response.data?.accessToken;

          if (token) {
            const expiresAt = response.data?.token_expires_at || response.data?.expires_at;
            setStoredToken(token, expiresAt);
            axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            processQueue(null, token);
            return axiosClient(originalRequest);
          }
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearStoredToken();
        delete axiosClient.defaults.headers.common['Authorization'];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
