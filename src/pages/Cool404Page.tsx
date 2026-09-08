import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, UploadCloud, Clock, AlertTriangle } from 'lucide-react';

interface Cool404PageProps {
  reason?: 'expired' | 'not_found';
  expiredDate?: string;
  duration?: string;
}

export const Cool404Page: React.FC<Cool404PageProps> = ({
  reason = 'expired',
  expiredDate,
  duration,
}) => {
  const isExpired = reason === 'expired';

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Cool Futuristic Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[300px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute -top-10 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Main Glass Card Container */}
      <div className="w-full max-w-xl text-center relative z-10">
        
        {/* Floating Animated Badge / Icon */}
        <div className="inline-flex items-center justify-center mb-6 animate-float">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[2px] shadow-2xl shadow-blue-500/25">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center">
                {isExpired ? (
                  <Clock className="w-11 h-11 text-blue-600 dark:text-blue-400" strokeWidth={1.8} />
                ) : (
                  <ShieldAlert className="w-11 h-11 text-amber-500 dark:text-amber-400" strokeWidth={1.8} />
                )}
              </div>
            </div>

            {/* Glowing Status Dot */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white dark:border-slate-900"></span>
            </span>
          </div>
        </div>

        {/* Big 404 with Gradient Typography */}
        <div className="relative mb-2 select-none">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-slate-900 via-slate-700 to-slate-400 dark:from-white dark:via-slate-200 dark:to-slate-600 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 blur-sm">
            <span className="text-8xl sm:text-9xl font-black tracking-tighter text-blue-500">
              404
            </span>
          </div>
        </div>

        {/* Dynamic Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-4 shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>
            {isExpired ? 'Tautan Gambar Telah Kedaluwarsa' : 'Gambar Tidak Ditemukan'}
          </span>
        </div>

        {/* Heading and Description */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
          {isExpired 
            ? 'Masa Berlaku Link Telah Habis'
            : 'Halaman Gambar Hilang di Ruang Angkasa'}
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
          {isExpired ? (
            <>
              Tautan gambar ini telah melampaui batas waktu aktif{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {duration ? `(${duration})` : '(1 hari / 1 minggu / 1 bulan)'}
              </span>{' '}
              yang diatur oleh pengunggah. Demi privasi dan keamanan data, gambar telah dinonaktifkan secara otomatis.
            </>
          ) : (
            'Tautan yang Anda tuju salah, tidak terdaftar di sistem, atau gambar telah dihapus oleh pengunggah.'
          )}
        </p>

        {/* Info Card Box */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md text-xs text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-left space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-medium">Status Akses:</span>
            <span className="font-bold text-rose-500 dark:text-rose-400">Expired (Mati)</span>
          </div>
          {expiredDate && (
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-medium">Waktu Berakhir:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{expiredDate}</span>
            </div>
          )}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-medium">Protokol Keamanan:</span>
            <span className="text-slate-700 dark:text-slate-300 font-mono">Auto-Expire TTL</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Platform:</span>
            <span className="text-slate-700 dark:text-slate-300">ImgURL by Dimas</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Unggah Gambar Baru</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

      </div>

    </div>
  );
};
