import { createContext, useContext, useState } from "react";
import en from "../lang/en.json";
import tm from "../lang/tk.json";
import ru from "../lang/ru.json";
import axiosClient, { clearStoredToken, getStoredToken, setStoredToken } from "@/api/axios";

const StateContext = createContext({
  currentUser: {},
  userToken: null,
  toast: {
    message: null,
    show: false,
  },
  setCurrentUser: () => { },
  setUserToken: () => { },
});

export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [userToken, _setUserToken] = useState(getStoredToken() || "");
  const [lang, setLang] = useState('tm');
  const translations = { en, tm, ru };
  const [toast, setToast] = useState({ message: "", show: false });

  const setUserToken = (token) => {
    setStoredToken(token);
    _setUserToken(token);
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[lang];
    for (const k of keys) {
      value = value[k];
      if (!value) return key;
    }
    return value;
  };

  const showToast = (message) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: "", show: false });
    }, 5000);
  };

  const logout = (ev) => {
    ev.preventDefault();
    axiosClient
      .post("/logout")
      .then(() => {
        setCurrentUser(null);
        setUserToken(null);
        clearStoredToken();
        // navigate("/");
      });
  };

  return (
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userToken,
        setUserToken,
        lang,
        setLang,
        t,
        toast,
        setToast,
        showToast,
        logout,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
