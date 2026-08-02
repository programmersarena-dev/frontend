import React, { createContext, useContext, useState, useEffect } from "react";
import enTranslations from "@/lang/en.json";
import ruTranslations from "@/lang/ru.json";
import tkTranslations from "@/lang/tk.json";
import { useAuth } from "@/contexts/AuthContext";

const TranslationContext = createContext();

const dictionaries = {
  en: enTranslations,
  ru: ruTranslations,
  tk: tkTranslations,
};

export const TranslationProvider = ({ children }) => {
  const { currentLang } = useAuth();

  const __ = (key) => {
    const currentDictionary = dictionaries[currentLang] || dictionaries["tk"];
    return key.split('.').reduce((o, i) => (o && o[i] !== undefined ? o[i] : undefined), currentDictionary) || key;
  };

  return (
    <TranslationContext.Provider value={{ __ }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);