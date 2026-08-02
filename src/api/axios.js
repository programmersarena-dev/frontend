import axios from "axios";

const TOKEN_STORAGE_KEY = "ACCESS_TOKEN";
const LEGACY_TOKEN_STORAGE_KEY = "TOKEN";

export const getStoredToken = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY);
  return token && token !== "undefined" ? token : null;
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(LEGACY_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(LEGACY_TOKEN_STORAGE_KEY);
  }
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_TOKEN_STORAGE_KEY);
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
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    // Safeguard: Do not try to refresh if the /me call fails as a deliberate guest
    // or if the refresh endpoint itself returns a 401.
    const isRefreshRequest = originalRequest.url.includes("/auth/refresh");

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        // Use a clean relative fallback instance request utilizing the existing baseURL config
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`, // Fixed path alignment matching v1 prefix
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          const token = response.data?.token || response.data?.access_token || response.data?.accessToken;

          if (token) {
            setStoredToken(token);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest); // Retry original request cleanly
          }
        }
      } catch (refreshError) {
        // Clear state and force redirect only if refreshing completely fails
        clearStoredToken();

        // Only redirect if we are not already on the login page to avoid infinite reloading
        // if (window.location.pathname !== "/login") {
        //   window.location.href = "/login";
        // }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
