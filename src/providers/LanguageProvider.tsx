'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { LangCode, SUPPORTED_LANGS, isRTL, langToFontClass } from '../lib/i18n';

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  showLangModal: boolean;
  setShowLangModal: (v: boolean) => void;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('hr');
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lang') as LangCode | null;
    if (saved && SUPPORTED_LANGS.find((l) => l.code === saved)) {
      setLangState(saved);
      applyLang(saved);
    } else {
      setShowLangModal(true);
      applyLang('hr');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setLang(l: LangCode) {
    localStorage.setItem('lang', l);
    setLangState(l);
    applyLang(l);
  }

  function applyLang(l: LangCode) {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = l;
      document.documentElement.dir = isRTL(l) ? 'rtl' : 'ltr';
      document.body.classList.remove('font-latin', 'font-arabic', 'font-bengali');
      document.body.classList.add(langToFontClass(l));
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, showLangModal, setShowLangModal }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}