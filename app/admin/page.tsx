'use client';

import { useState } from 'react';
import strings from '../../src/locales/strings';
import { useLanguage } from '../../src/providers/LanguageProvider';

export default function AdminPage() {
  const { lang } = useLanguage();
  const t = strings[lang];

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'translating' | 'publishing' | 'done' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus('translating');

    try {
      const res = await fetch('/api/hutbas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({ title_hr: title, content_hr: content })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Request failed');
      }
      setStatus('done');
      setTitle('');
      setContent('');
      setPassword('');
      setTimeout(() => {
        window.location.href = '/';
      }, 1200);
    } catch (e: any) {
      setStatus('error');
      setError(e.message || 'Error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Admin</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">{t.title}</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">{t.content}</label>
          <textarea
            className="w-full border rounded px-3 py-2 h-56"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">{t.adminPassword}</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={status === 'translating' || status === 'publishing'}
            className="border rounded px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            {t.publish}
          </button>
          {status === 'translating' && <span className="text-sm text-gray-600">{t.translating}</span>}
          {status === 'publishing' && <span className="text-sm text-gray-600">{t.publishing}</span>}
          {status === 'done' && <span className="text-sm text-green-600">{t.published}</span>}
          {status === 'error' && (
            <span className="text-sm text-red-600">
              {t.tryAgain} {error ? `(${error})` : null}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}