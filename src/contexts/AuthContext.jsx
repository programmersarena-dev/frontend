import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "@/api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentLang, setCurrentLang] = useState("tk");
  const [loading, setLoading] = useState(true);

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
        console.log("Guest session or expired token context.");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, currentLang, setCurrentLang, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);