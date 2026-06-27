import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "@/api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentLang, setCurrentLang] = useState("tk");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await axiosClient.get("/auth/me");

        if (response.data && response.data.id) {
          setUser(response.data);
          if (response.data.locale) {
            setCurrentLang(response.data.locale);
          }
        }
      } catch (error) {
        console.log("Guest session or expired token context.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, currentLang, setCurrentLang, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);