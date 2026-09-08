import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UploadCard } from '../components/UploadCard';
import { ResultBar } from '../components/ResultBar';
import { FeatureGrid } from '../components/FeatureGrid';
import { uploadImage } from '../lib/storage';
import type { ImageRecord } from '../lib/storage';
import type { ExpiryDuration } from '../lib/utils';

export const HomePage: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ImageRecord | null>(null);

  const handleFileSelect = async (file: File, duration: ExpiryDuration) => {
    setIsUploading(true);
    try {
      const { record } = await uploadImage(file, duration);
      setCurrentRecord(record);

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#6366f1', '#10b981', '#f59e0b'],
        });
      } catch {
        // Confetti is decorative, silent catch if canvas not ready
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setCurrentRecord(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-20 text-center">
      
      {/* Top Badge: "Fast • Simple • Free" (Exact from Reference Image) */}
      <div className="inline-flex items-center justify-center mb-6">
        <div className="px-4 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide">
          <span>Fast</span>
          <span className="mx-2 text-blue-300 dark:text-blue-600">&bull;</span>
          <span>Simple</span>
          <span className="mx-2 text-blue-300 dark:text-blue-600">&bull;</span>
          <span>Free</span>
        </div>
      </div>

      {/* Main Headline: "Image to URL" (Exact from Reference Image) */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
        Image to URL
      </h1>

      {/* Subtitle (Exact from Reference Image) */}
      <div className="max-w-xl mx-auto text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed mb-10">
        <p>Upload your image and get a direct URL in seconds.</p>
        <p>Perfect for sharing, embedding, or using in your projects.</p>
      </div>

      {/* Upload Zone Card */}
      <UploadCard
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
      />

      {/* Result URL Input Bar */}
      <ResultBar
        currentRecord={currentRecord}
        onReset={handleReset}
      />

      {/* 4 Feature Highlights Columns (Exact from Reference Image) */}
      <div id="features">
        <FeatureGrid />
      </div>

    </div>
  );
};
