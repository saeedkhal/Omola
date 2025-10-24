import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, changeLanguage, availableLanguages } = useTranslation();

  const languageNames = {
    ar: 'العربية',
    en: 'English'
  };

  // Ensure availableLanguages is defined and is an array
  const languages = availableLanguages || ['ar', 'en'];

  // Don't render if we don't have the necessary data yet
  if (!languages || !Array.isArray(languages)) {
    return (
      <div className="flex items-center space-x-2">
        <Globe size={16} className="text-gray-600" />
        <div className="px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* <Globe size={16} className="text-gray-600" /> */}
      {/* <select
        value={language || 'ar'}
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {languageNames[lang] || lang}
          </option>
        ))}
      </select> */}
    </div>
  );
};

export default LanguageSwitcher;
