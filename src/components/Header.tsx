'use client';

import Link from 'next/link';
import { useLanguage } from '../providers/LanguageProvider';
import strings from '../locales/strings';

export default function Header() {
  const { lang, setShowLangModal } = useLanguage();
  const t = strings[lang];

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">Džemat Osijek</Link>
        <nav className="flex items-center gap-3">
          <Link href="/archive" className="text-sm text-gray-700 hover:text-black">{t.archive}</Link>
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