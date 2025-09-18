'use client';

import { SUPPORTED_LANGS } from '../lib/i18n';
import { useLanguage } from '../providers/LanguageProvider';
import strings from '../locales/strings';

export default function LanguageModal() {
  const { lang, setLang, showLangModal, setShowLangModal } = useLanguage();
  if (!showLangModal) return null;
  const t = strings[lang];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">{t.chooseLanguage}</h2>
        <div className="grid grid-cols-2 gap-3">
          {SUPPORTED_LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code as any);
                setShowLangModal(false);
              }}
              className={`border rounded-lg px-4 py-2 hover:bg-gray-50 ${
                l.code === lang ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}