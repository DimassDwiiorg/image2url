import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Calendar, 
  HardDrive, 
  ArrowLeft, 
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { fetchImageByToken } from '../lib/storage';
import type { ImageRecord } from '../lib/storage';
import { formatBytes, getRemainingTime, copyToClipboard } from '../lib/utils';
import type { RemainingTime } from '../lib/utils';
import { Cool404Page } from './Cool404Page';

export const ImageViewPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<ImageRecord | null>(null);
  const [status, setStatus] = useState<'valid' | 'expired' | 'not_found'>('valid');
  const [remaining, setRemaining] = useState<RemainingTime | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!token) {
        setStatus('not_found');
        setLoading(false);
        return;
      }

      try {
        const result = await fetchImageByToken(token);
        if (!isMounted) return;

        setStatus(result.status);
        if (result.image) {
          setRecord(result.image);
          setRemaining(getRemainingTime(result.image.expires_at));
        }
      } catch (e) {
        console.error('Error fetching image:', e);
        if (isMounted) setStatus('not_found');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Live countdown timer ticking every second
  useEffect(() => {
    if (!record || status !== 'valid') return;

    const timer = setInterval(() => {
      const rem = getRemainingTime(record.expires_at);
      setRemaining(rem);
      if (rem.isExpired) {
        setStatus('expired');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [record, status]);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    if (!record) return;
    const a = document.createElement('a');
    a.href = record.public_url;
    a.download = record.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-400 mb-3" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Memuat gambar &amp; memverifikasi masa aktif link...
        </p>
      </div>
    );
  }

  // Jika sudah habis waktu atau tidak ditemukan -> Tampilkan Halaman 404 yang Keren!
  if (status === 'expired' || status === 'not_found') {
    return (
      <Cool404Page 
        reason={status} 
        duration={record?.duration === '1_day' ? '1 Hari' : record?.duration === '1_week' ? '1 Minggu' : '1 Bulan'}
      />
    );
  }

  if (!record) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Gambar Lain</span>
        </Link>

        {/* Live Expiry Countdown Badge */}
        {remaining && !remaining.isExpired && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Kedaluwarsa dalam: <strong className="font-mono">{remaining.formatted}</strong></span>
          </div>
        )}
      </div>

      {/* Main Image Viewer Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Image Preview Canvas */}
        <div className="w-full bg-slate-950/5 dark:bg-slate-950/40 p-4 sm:p-8 flex items-center justify-center min-h-[350px] max-h-[600px] overflow-hidden">
          <img
            src={record.public_url}
            alt={record.file_name}
            className="max-h-[500px] w-auto max-w-full object-contain rounded-xl shadow-md transition-transform hover:scale-[1.01]"
          />
        </div>

        {/* Info & Action Bar */}
        <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate max-w-md">
                {record.file_name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5" />
                  {formatBytes(record.file_size)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Diunggah: {new Date(record.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Privasi Terjamin
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Tersalin!' : 'Salin Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Gambar</span>
              </button>
            </div>
          </div>

          {/* Long URL Link Display */}
          <div className="mt-4 space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Direct Access Link (URL Panjang):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-700 dark:text-slate-300 outline-hidden select-all"
              />
              <a
                href={record.public_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka Gambar Asli Langsung"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
