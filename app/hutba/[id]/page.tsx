'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabaseClient } from '../../../src/lib/supabaseClient';
import { LangCode } from '../../../src/lib/i18n';
import { useLanguage } from '../../../src/providers/LanguageProvider';
import strings from '../../../src/locales/strings';

type HutbaDetail = {
  id: string;
  published_at: string;
  title: Record<LangCode, string>;
  content: Record<LangCode, string>;
};

export default function HutbaPage({ params }: { params: { id: string } }) {
  const { lang } = useLanguage();
  const t = strings[lang];
  const [hutba, setHutba] = useState<HutbaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOne() {
      try {
        const { data, error } = await supabaseClient
          .from('hutbas')
          .select('id, published_at, title, content')
          .eq('id', params.id)
          .single();
        if (error) throw error;
        setHutba(data as any);
      } catch (error) {
        console.error('Error fetching hutba:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOne();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!hutba) {
    return <div className="text-center py-8">Hutba not found</div>;
  }

  const title = hutba.title[lang] ?? hutba.title.hr;
  const content = hutba.content[lang] ?? hutba.content.hr;

  return (
    <article className="prose max-w-none">
      <div className="text-sm text-gray-500">
        {new Date(hutba.published_at).toLocaleDateString(lang, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
      <h1 className="mt-1 text-3xl font-bold">{title}</h1>
      <div className="whitespace-pre-wrap mt-4 text-[1.05rem] leading-7">{content}</div>
      <div className="mt-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← {t.latestKhutbah}
        </Link>
      </div>
    </article>
  );
}