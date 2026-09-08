import React, { useState } from 'react';
import { Link2, Copy, Check, ExternalLink, RefreshCw, Calendar, Sparkles } from 'lucide-react';
import { copyToClipboard } from '../lib/utils';
import type { ImageRecord } from '../lib/storage';

interface ResultBarProps {
  currentRecord: ImageRecord | null;
  onReset: () => void;
}

export const ResultBar: React.FC<ResultBarProps> = ({ currentRecord, onReset }) => {
  const [copied, setCopied] = useState(false);

  // Buat URL panjang sesuai permintaan: "url nya kasih yang panjang"
  const generatedUrl = currentRecord
    ? `${window.location.origin}/v/${currentRecord.token}`
    : '';

  const handleCopy = async () => {
    if (!generatedUrl) return;
    const success = await copyToClipboard(generatedUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatExpiryDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 space-y-3">
      
      {/* Result Input Bar (Matching Reference Image) */}
      <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 shadow-xs transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/40">
        
        {/* Left Link Icon */}
        <div className="text-slate-400 dark:text-slate-500 mr-3 shrink-0">
          <Link2 className="w-4 h-4 -rotate-45" />
        </div>

        {/* Input displaying Long URL or Placeholder */}
        <input
          type="text"
          readOnly
          value={generatedUrl}
          placeholder="Your image URL will appear here..."
          className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden font-mono tracking-tight select-all truncate"
        />

        {/* Copy Button (Right side, reference style) */}
        <button
          type="button"
          onClick={handleCopy}
          disabled={!generatedUrl}
          className={`ml-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
            !generatedUrl
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : copied
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer active:scale-95'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Additional Feedback & Actions when URL is generated */}
      {currentRecord && (
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                URL Panjang Berhasil Dibuat!
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                <Calendar className="w-3 h-3 text-blue-500" />
                <span>Kedaluwarsa pada: <strong className="text-slate-700 dark:text-slate-300">{formatExpiryDate(currentRecord.expires_at)}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={generatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors shadow-xs"
            >
              <span>Buka Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Unggah Lagi</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
