export type LangCode = 'hr' | 'en' | 'ar' | 'sq' | 'bn' | 'ur';

export const SUPPORTED_LANGS: { code: LangCode; name: string }[] = [
  { code: 'hr', name: 'Hrvatski' },
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'sq', name: 'Shqip' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ur', name: 'اردو' }
];

export function isRTL(lang: LangCode) {
  return lang === 'ar' || lang === 'ur';
}

export function langToFontClass(lang: LangCode) {
  if (lang === 'bn') return 'font-bengali';
  if (lang === 'ar' || lang === 'ur') return 'font-arabic';
  return 'font-latin';
}