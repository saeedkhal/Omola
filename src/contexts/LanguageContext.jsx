import React, { createContext, useContext, useState, useEffect } from 'react';
import arTranslations from '../locales/ar.json';
import enTranslations from '../locales/en.json';

const translations = {
  ar: arTranslations,
  en: enTranslations
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  const { language, t, changeLanguage, availableLanguages } = context;
  return { language, t, changeLanguage, availableLanguages };
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, default to Arabic
    // const savedLanguage = localStorage.getItem('language');
    // if (savedLanguage && translations[savedLanguage]) {
    //   return savedLanguage;
    // }
    
    // Always default to Arabic
    return 'ar';
  });

  const [isRTL, setIsRTL] = useState(language === 'ar');

  useEffect(() => {
    localStorage.setItem('language', language);
    setIsRTL(language === 'ar');
    
    // Update document direction and lang
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    if (typeof value === 'string') {
      // Simple parameter replacement
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }
    
    return value || key;
  };

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const value = {
    language,
    isRTL,
    t,
    changeLanguage,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
