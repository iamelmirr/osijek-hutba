'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '../../src/lib/supabaseClient';
import HutbaCard, { HutbaRow } from '../../src/components/HutbaCard';
import { useLanguage } from '../../src/providers/LanguageProvider';

export default function ArchivePage() {
  const { lang } = useLanguage();
  const [data, setData] = useState<HutbaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const { data, error } = await supabaseClient
          .from('hutbas')
          .select('id, published_at, title')
          .order('published_at', { ascending: false });
        if (error) throw error;
        setData(data as any);
      } catch (error) {
        console.error('Error fetching hutbas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {data.map((h) => (
        <HutbaCard key={h.id} hutba={h} lang={lang} />
      ))}
    </div>
  );
}