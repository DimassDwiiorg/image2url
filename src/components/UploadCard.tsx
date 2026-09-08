import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Clock, AlertCircle, Loader2 } from 'lucide-react';
import type { ExpiryDuration } from '../lib/utils';

interface UploadCardProps {
  onFileSelect: (file: File, duration: ExpiryDuration) => Promise<void>;
  isUploading: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({ onFileSelect, isUploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [duration, setDuration] = useState<ExpiryDuration>('1_day');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  const handleValidateAndUpload = async (file: File) => {
    setErrorMessage(null);

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Format file tidak didukung. Harap pilih JPG, PNG, atau WEBP.');
      return;
    }

    if (file.size > maxSizeBytes) {
      setErrorMessage('Ukuran file melebihi batas maksimum 10MB.');
      return;
    }

    try {
      await onFileSelect(file, duration);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan saat mengunggah gambar.');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleValidateAndUpload(file);
    }
  };

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleValidateAndUpload(file);
      // Reset input value so same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      
      {/* Expiration Duration Selector (Clean Segmented Pills) */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>Masa Aktif Tautan (Expiration):</span>
        </div>

        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/60 shadow-xs">
          <button
            type="button"
            onClick={() => setDuration('1_day')}
            disabled={isUploading}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              duration === '1_day'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            1 Hari
          </button>
          <button
            type="button"
            onClick={() => setDuration('1_week')}
            disabled={isUploading}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              duration === '1_week'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            1 Minggu
          </button>
          <button
            type="button"
            onClick={() => setDuration('1_month')}
            disabled={isUploading}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              duration === '1_month'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            1 Bulan
          </button>
        </div>
      </div>

      {/* Main Upload Box (Matching Reference Image) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 rounded-2xl md:rounded-3xl p-8 sm:p-12 transition-all text-center ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-md scale-[1.01]'
            : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Mengunggah gambar...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Menyiapkan URL panjang dan mengatur masa aktif {duration === '1_day' ? '1 hari' : duration === '1_week' ? '1 minggu' : '1 bulan'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            
            {/* Blue Cloud Icon with Up Arrow (Reference Image Style) */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-blue-500 dark:text-blue-400 mb-3 sm:mb-4">
              <UploadCloud className="w-14 h-14 sm:w-16 sm:h-16 stroke-[1.6]" />
            </div>

            {/* Drag & Drop Text */}
            <p className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200">
              Drag & drop your image here
            </p>

            {/* Or Text */}
            <span className="text-xs text-slate-400 dark:text-slate-500 my-2 font-medium">
              or
            </span>

            {/* Choose File Button (Reference Image Vibrant Blue Button) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 px-7 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer transform active:scale-95"
            >
              Choose File
            </button>

            {/* Supported Formats */}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-5 font-normal">
              Supports JPG, PNG, WEBP (Max 10MB)
            </p>
          </div>
        )}

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

    </div>
  );
};
