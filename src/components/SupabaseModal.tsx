import React, { useState, useEffect } from 'react';
import { X, Database, Check, AlertCircle, Copy, ExternalLink, Key, Globe } from 'lucide-react';
import { getStoredSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, testSupabaseConnection } from '../lib/supabase';
import { copyToClipboard } from '../lib/utils';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose, onConfigChanged }) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getStoredSupabaseConfig();
      setUrl(config.url);
      setAnonKey(config.anonKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveSupabaseConfig(url, anonKey);
    onConfigChanged();
    onClose();
  };

  const handleResetToDemo = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    onConfigChanged();
    onClose();
  };

  const handleTestConnection = async () => {
    if (!url || !anonKey) {
      setTestResult({ success: false, message: 'Harap isi URL dan Anon Key terlebih dahulu.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(url, anonKey);
    setTesting(false);
    setTestResult(res);
  };

  const handleCopySql = async () => {
    const sqlScript = `-- SQL SETUP FOR SUPABASE
CREATE TABLE IF NOT EXISTS public.images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT,
  public_url TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '1_day',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_images_token ON public.images (token);
CREATE INDEX IF NOT EXISTS idx_images_expires_at ON public.images (expires_at);

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert access" ON public.images FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Access for Images Bucket" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'images');
CREATE POLICY "Public Upload for Images Bucket" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'images');
`;
    await copyToClipboard(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base">
                Konfigurasi Database Supabase
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Hubungkan project Supabase Anda untuk penyimpanan cloud permanen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                Langkah Cepat Setup Supabase:
              </span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
              >
                <span>Buka Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>Salin skrip SQL skema tabel lalu jalankan di Supabase <strong>SQL Editor</strong>.</li>
              <li>Ambil <strong>Project URL</strong> dan <strong>Anon Public Key</strong> di menu <em>Settings &rarr; API</em>.</li>
              <li>Tempelkan ke form di bawah ini dan klik <strong>Simpan</strong>.</li>
            </ol>
            <button
              type="button"
              onClick={handleCopySql}
              className="mt-2 w-full py-1.5 px-3 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Skrip SQL Tersalin!' : 'Salin Skrip SQL Skema'}</span>
            </button>
          </div>

          {/* Input Project URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>Project URL</span>
            </label>
            <input
              type="url"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-hidden font-mono"
            />
          </div>

          {/* Input Anon Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-500" />
              <span>Anon Public Key</span>
            </label>
            <textarea
              rows={3}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-hidden font-mono resize-none"
            />
          </div>

          {/* Test connection output */}
          {testResult && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              testResult.success 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}>
              {testResult.success ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{testResult.message}</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDemo}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          >
            Gunakan Mode Demo Lokal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !url || !anonKey}
              className="px-3.5 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {testing ? 'Menguji...' : 'Uji Koneksi'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Simpan &amp; Hubungkan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
