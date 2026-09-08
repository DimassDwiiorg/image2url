import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link2, Sun, Moon, Database } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSupabaseModal: () => void;
  onOpenHowItWorks: () => void;
  onOpenFeatures: () => void;
  onOpenFAQ: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSupabaseModal,
  onOpenHowItWorks,
  onOpenFeatures,
  onOpenFAQ,
}) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const hasSupabase = isSupabaseConfigured();

  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
            <Link2 className="w-5 h-5 -rotate-45" strokeWidth={2.4} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            ImgURL
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            to="/"
            className={`relative py-1 transition-colors ${
              isHome 
                ? 'text-slate-900 dark:text-white font-semibold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-0.5 after:bg-blue-600 after:rounded-full' 
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home
          </Link>
          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={onOpenFeatures}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            type="button"
            onClick={onOpenFAQ}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-3">
          {/* Supabase Status Pill */}
          <button
            onClick={onOpenSupabaseModal}
            title={hasSupabase ? "Supabase Terhubung (Klik untuk ubah)" : "Mode Demo Lokal (Klik untuk sambungkan Supabase)"}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
              hasSupabase 
                ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' 
                : 'border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{hasSupabase ? 'Supabase' : 'Demo Mode'}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${hasSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {darkMode ? (
              <Moon className="w-5 h-5 text-blue-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
          </button>

          {/* Sign In Button (Reference UI Style) */}
          <button
            onClick={() => alert("Fitur akun dan autentikasi telah disiapkan. Saat ini Anda dapat langsung mengunggah gambar tanpa perlu login!")}
            className="px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all shadow-xs cursor-pointer"
          >
            Sign In
          </button>
        </div>

      </div>
    </header>
  );
};
