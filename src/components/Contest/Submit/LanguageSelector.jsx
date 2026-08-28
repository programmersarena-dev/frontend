import React, { useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function LanguageSelector({ acceptable_languages = [], language, setLanguage }) {
    const { __ } = useTranslation();

    // 1. Sync from localStorage on initial render if state is empty
    useEffect(() => {
        const savedLanguage = localStorage.getItem("selectedProgrammingLanguage");
        if (!language && savedLanguage && setLanguage) {
            setLanguage(savedLanguage);
        }
    }, [language, setLanguage]);

    const handleLanguageChange = (e) => {
        const value = e.target.value;
        setLanguage(value);
        localStorage.setItem("selectedProgrammingLanguage", value);
    };

    return (
        <>
            <label
                htmlFor="language"
                className="block mb-1.5 text-xs font-medium text-slate-600 uppercase tracking-wider"
            >
                {__("problem.lang") || "Programlama dili"}
            </label>
            <select
                id="language"
                name="language"
                value={language || ""}
                onChange={handleLanguageChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
            >
                {acceptable_languages.map((lang, index) => {
                    // 2. Normalize options whether 'lang' is a string or an object
                    const optValue = typeof lang === 'object' ? (lang.value || lang.id || lang.code) : lang;
                    const optLabel = typeof lang === 'object' ? (lang.label || lang.name) : lang;

                    return (
                        <option key={optValue || index} value={optValue}>
                            {optLabel}
                        </option>
                    );
                })}
            </select>
        </>
    );
}