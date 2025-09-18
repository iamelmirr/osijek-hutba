'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabaseClient } from '../src/lib/supabaseClient';
import HutbaCard, { HutbaRow } from '../src/components/HutbaCard';
import { useLanguage } from '../src/providers/LanguageProvider';
import strings from '../src/locales/strings';

export default function HomePage() {
  const { lang } = useLanguage();
  const t = strings[lang];
  const [data, setData] = useState<HutbaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHutbas() {
      try {
        const { data, error } = await supabaseClient
          .from('hutbas')
          .select('id, published_at, title')
          .order('published_at', { ascending: false })
          .limit(6);
        if (error) throw error;
        setData(data as any);
      } catch (error) {
        console.error('Error fetching hutbas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHutbas();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const [latest, ...rest] = data;

  return (
    <div className="space-y-6">
      {latest && (
        <section className="border rounded-xl p-5 bg-gray-50">
          <div className="text-sm text-gray-500">{t.latestKhutbah}</div>
          <Link href={`/hutba/${latest.id}`} className="block mt-2">
            <h2 className="text-2xl font-semibold">{latest.title[lang] ?? latest.title.hr}</h2>
          </Link>
          <div className="mt-3">
            <Link href={`/hutba/${latest.id}`} className="text-blue-600 hover:underline">
              {t.readMore}
            </Link>
          </div>
        </section>
      )}
      <section className="grid sm:grid-cols-2 gap-4">
        {rest.map((h) => (
          <HutbaCard key={h.id} hutba={h} lang={lang} />
        ))}
      </section>
      <div className="pt-2">
        <Link
          href="/archive"
          className="inline-block border rounded px-4 py-2 hover:bg-gray-50 text-sm"
        >
          {t.archive}
        </Link>
      </div>
    </div>
  );
}