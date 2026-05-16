import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    localStorage.setItem('app_language', language);
    i18n.changeLanguage(language);
  };

  return (
    <div
      className="d-flex align-items-center"
      style={{
        gap: 6,
        padding: 4,
        borderRadius: 999,
        border: dark ? '1px solid var(--border-light)' : '1px solid rgba(255,255,255,0.12)',
        background: dark ? 'white' : 'rgba(255,255,255,0.06)',
      }}
    >
      {[
        { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
        { code: 'en', flag: '🇺🇸', label: 'English' },
      ].map((language) => {
        const active = i18n.language === language.code;
        return (
          <button
            key={language.code}
            type="button"
            title={language.label}
            aria-label={language.label}
            onClick={() => changeLanguage(language.code)}
            style={{
              width: 34,
              height: 28,
              borderRadius: 999,
              border: 'none',
              background: active ? 'var(--primary)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {language.flag}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
