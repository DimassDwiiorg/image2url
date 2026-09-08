import React from 'react';
import { Link2, Heart, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          
          {/* Brand & Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Link2 className="w-3.5 h-3.5 -rotate-45" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">ImgURL</span>
            <span>&copy; {new Date().getFullYear()} Semua Hak Dilindungi.</span>
          </div>

          {/* User Specific Footer Requirement: "developed by dimas" */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 font-medium text-slate-700 dark:text-slate-300">
            <Code2 className="w-3.5 h-3.5 text-blue-500" />
            <span>developed by <strong className="text-blue-600 dark:text-blue-400 font-bold">dimas</strong></span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline ml-0.5" />
          </div>

          {/* Quick Info */}
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <span>Supabase Storage & Database</span>
            <span>&bull;</span>
            <span>Auto Expiration</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
