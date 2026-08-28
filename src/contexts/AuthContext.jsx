import { createContext, useContext, useState, useEffect } from "react";
import axiosClient, { clearStoredToken, getStoredToken, getStoredTokenExpiry, setStoredToken } from "@/api/axios";

const AUTH_LOCAL_STORAGE_KEY = "selectedLanguage";

const getStoredLanguage = () => {
  try {
    const stored = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
    return stored && ["en", "ru", "tk"].includes(stored) ? stored : "tk";
  } catch {
    return "tk";
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userToken, _setUserToken] = useState(getStoredToken() || "");
  const [currentLang, setCurrentLang] = useState(getStoredLanguage);
  const [loading, setLoading] = useState(true);

  const setUserToken = (token, expiresAt = null) => {
    setStoredToken(token, expiresAt);
    _setUserToken(token);
  };

  const logout = (ev) => {
    ev.preventDefault();
    setLoading(true);
    axiosClient
      .post("/auth/logout")
      .then(() => {
        setCurrentUser(null);
        setUserToken(null);
        clearStoredToken();
        window.location.href = "/login";
      })
      .catch(() => {
        setCurrentUser(null);
        setUserToken(null);
        clearStoredToken();
        window.location.href = "/login";
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await axiosClient.get("/auth/me");

        if (response.data && response.data.id) {
          setCurrentUser(response.data);
          if (response.data.locale) {
            setCurrentLang(response.data.locale);
            localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, response.data.locale);
          }
        }
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    const handleRefreshFailed = () => {
      setCurrentUser(null);
      setUserToken(null);
      clearStoredToken();
      setLoading(false);
      window.location.href = "/login";
    };

    const handleTokenRefreshed = (event) => {
      _setUserToken(event.detail.token);
    };

    window.addEventListener("auth-refresh-failed", handleRefreshFailed);
    window.addEventListener("auth-token-refreshed", handleTokenRefreshed);
    return () => {
      window.removeEventListener("auth-refresh-failed", handleRefreshFailed);
      window.removeEventListener("auth-token-refreshed", handleTokenRefreshed);
    };
  }, []);

  useEffect(() => {
    const fetchUserActivity = () => {
      if (currentUser) axiosClient.post("/auth/activity");
    };
    fetchUserActivity();
    const intervalId = setInterval(fetchUserActivity, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const refreshTokenIfNeeded = async () => {
      const expiry = getStoredTokenExpiry();
      if (!expiry) return;

      const expiresAt = new Date(expiry).getTime();
      const now = Date.now();
      const twoMinutes = 2 * 60 * 1000;

      if (expiresAt <= now + twoMinutes) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
            {},
            { withCredentials: true }
          );
          if (response.data?.token) {
            const newExpiresAt = response.data?.token_expires_at || response.data?.expires_at;
            setStoredToken(response.data.token, newExpiresAt);
            _setUserToken(response.data.token);
            window.dispatchEvent(new CustomEvent("auth-token-refreshed", { detail: { token: response.data.token, expiresAt: newExpiresAt } }));
          }
        } catch (error) {
          console.error("Proactive token refresh failed:", error);
        }
      }
    };

    refreshTokenIfNeeded();
    const intervalId = setInterval(refreshTokenIfNeeded, 30000);
    return () => clearInterval(intervalId);
  }, [currentUser]);

  useEffect(() => {
    const syncTokenFromStorage = () => {
      const stored = getStoredToken();
      if (stored !== userToken) {
        _setUserToken(stored);
      }
    };

    window.addEventListener("storage", syncTokenFromStorage);
    return () => window.removeEventListener("storage", syncTokenFromStorage);
  }, [userToken]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout, userToken, setUserToken, currentLang, setCurrentLang, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);