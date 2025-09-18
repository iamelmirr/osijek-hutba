'use client';

import { useLanguage } from '../providers/LanguageProvider';
import strings from '../locales/strings';

export default function Header() {
  const { lang, setShowLangModal } = useLanguage();
  const t = strings[lang];

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-lg font-semibold">Džemat Osijek</a>
        <nav className="flex items-center gap-3">
          <a href="/archive" className="text-sm text-gray-700 hover:text-black">{t.archive}</a>
          <a href="/admin" className="text-sm text-gray-700 hover:text-black">Admin</a>
          <button
            onClick={() => setShowLangModal(true)}
            className="text-sm border rounded px-3 py-1 hover:bg-gray-50"
          >
            {t.language}
          </button>
        </nav>
      </div>
    </header>
  );
}