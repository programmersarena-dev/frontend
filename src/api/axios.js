import axios from "axios";

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
    const token = localStorage.getItem("ACCESS_TOKEN");
    // Ensure we aren't appending 'undefined' or empty strings
    if (token && token !== "undefined") {
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
          const { token } = response.data; // Fixed key matching backend signature ['token' => ...]

          if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest); // Retry original request cleanly
          }
        }
      } catch (refreshError) {
        // Clear state and force redirect only if refreshing completely fails
        localStorage.removeItem("ACCESS_TOKEN");

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
