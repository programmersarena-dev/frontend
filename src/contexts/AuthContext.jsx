import { createContext, useContext, useState, useEffect } from "react";
import axiosClient, { clearStoredToken, getStoredToken, setStoredToken } from "@/api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userToken, _setUserToken] = useState(getStoredToken() || "");
  const [currentLang, setCurrentLang] = useState("tk");
  const [loading, setLoading] = useState(true);

  const setUserToken = (token) => {
    setStoredToken(token);
    _setUserToken(token);
  };

  const logout = (ev) => {
    ev.preventDefault();
    axiosClient
      .post("/auth/logout")
      .then(() => {
        setCurrentUser(null);
        setUserToken(null);
        clearStoredToken();
        navigate("/");
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
    const fetchUserActivity = () => {
      if (currentUser) axiosClient.post("/auth/activity");
    };
    fetchUserActivity();
    const intervalId = setInterval(fetchUserActivity, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout, userToken, setUserToken, currentLang, setCurrentLang, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);