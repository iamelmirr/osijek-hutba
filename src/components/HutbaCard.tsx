import { LangCode } from '../lib/i18n';

export type HutbaRow = {
  id: string;
  published_at: string;
  title: Record<LangCode, string>;
};

export default function HutbaCard({ hutba, lang }: { hutba: HutbaRow; lang: LangCode }) {
  const title = hutba.title[lang] ?? hutba.title.hr;
  const date = new Date(hutba.published_at);
  const dateStr = date.toLocaleDateString(lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <a href={`/hutba/${hutba.id}`} className="block border rounded-lg p-4 hover:bg-gray-50">
      <div className="text-xs text-gray-500">{dateStr}</div>
      <div className="text-base font-medium mt-1">{title}</div>
    </a>
  );
}