import { createContext, useContext, useState } from "react";
import en from "../lang/en.json";
import tm from "../lang/tk.json";
import ru from "../lang/ru.json";
import axiosClient from "@/api/axios";

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
  const [userToken, _setUserToken] = useState(
    localStorage.getItem("TOKEN") || ""
  );
  const [lang, setLang] = useState('tm');
  const translations = { en, tm, ru };
  const [toast, setToast] = useState({ message: "", show: false });

  const setUserToken = (token) => {
    if (token) {
      localStorage.setItem("TOKEN", token);
    } else {
      localStorage.removeItem("TOKEN");
    }
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
