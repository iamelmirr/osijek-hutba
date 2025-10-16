'use client';

import { useState, useEffect } from 'react';
import strings from '../../src/locales/strings';
import { useLanguage } from '../../src/providers/LanguageProvider';
import { supabaseClient } from '../../src/lib/supabaseClient';
import { LangCode } from '../../src/lib/i18n';

type HutbaRow = {
  id: string;
  published_at: string;
  title: Record<LangCode, string>;
};

export default function AdminPage() {
  const { lang } = useLanguage();
  const t = strings[lang];

  const [activeTab, setActiveTab] = useState<'publish' | 'manage'>('publish');

  // Publish tab state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'translating' | 'publishing' | 'done' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);

  // Manage tab state
  const [hutbas, setHutbas] = useState<HutbaRow[]>([]);
  const [loadingHutbas, setLoadingHutbas] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [managePassword, setManagePassword] = useState('');

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchHutbas();
    }
  }, [activeTab]);

  async function fetchHutbas() {
    setLoadingHutbas(true);
    try {
      const { data, error } = await supabaseClient
        .from('hutbas')
        .select('id, published_at, title')
        .order('published_at', { ascending: false });
      if (error) throw error;
      setHutbas(data as any);
    } catch (error) {
      console.error('Error fetching hutbas:', error);
    } finally {
      setLoadingHutbas(false);
    }
  }

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

  async function handleDelete(id: string) {
    if (!managePassword) {
      alert(t.adminPassword + ' required');
      return;
    }
    
    if (!confirm(t.confirmDelete)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/hutbas/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': managePassword
        }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Delete failed');
      }
      // Refresh list
      await fetchHutbas();
      setDeletingId(null);
    } catch (e: any) {
      alert(e.message || 'Error deleting');
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Admin</h1>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('publish')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'publish'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t.publishNew}
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'manage'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t.manageKhutbas}
        </button>
      </div>

      {/* Publish Tab */}
      {activeTab === 'publish' && (
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
      )}

      {/* Manage Tab */}
      {activeTab === 'manage' && (
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm mb-1">{t.adminPassword}</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={managePassword}
              onChange={(e) => setManagePassword(e.target.value)}
              placeholder={t.adminPassword}
            />
          </div>

          {loadingHutbas ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : hutbas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">{t.noKhutbas}</div>
          ) : (
            <div className="space-y-2">
              {hutbas.map((hutba) => (
                <div
                  key={hutba.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border rounded hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {hutba.title[lang] ?? hutba.title.hr}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(hutba.published_at).toLocaleDateString(lang, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(hutba.id)}
                    disabled={deletingId === hutba.id}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 disabled:opacity-50 whitespace-nowrap"
                  >
                    {deletingId === hutba.id ? t.deleting : t.delete}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}