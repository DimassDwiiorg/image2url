import React from 'react';
import { X, UploadCloud, Clock, Link2, ShieldCheck, HelpCircle } from 'lucide-react';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Unggah Gambar Anda',
      description: 'Tarik dan letakkan gambar Anda ke kotak dropzone atau klik "Choose File". Mendukung format JPG, PNG, dan WEBP hingga ukuran 10MB.',
      icon: UploadCloud,
    },
    {
      step: '02',
      title: 'Tentukan Masa Aktif Tautan',
      description: 'Pilih masa aktif link: 1 Hari (24 jam), 1 Minggu (7 hari), atau 1 Bulan (30 hari). Anda memiliki kontrol penuh atas durasi akses gambar Anda.',
      icon: Clock,
    },
    {
      step: '03',
      title: 'Dapatkan URL Panjang & Bagikan',
      description: 'Sistem akan menghasilkan URL unik yang panjang dan aman. Klik "Copy" dan bagikan kepada siapa pun yang Anda inginkan.',
      icon: Link2,
    },
    {
      step: '04',
      title: 'Otomatis Expired & Halaman 404 Keren',
      description: 'Begitu masa aktif link tercapai, link gambar akan dinonaktifkan secara otomatis dan mengarahkan pengunjung ke halaman 404 keren.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">
            Cara Kerja ImgURL
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm shrink-0 border border-blue-100 dark:border-blue-900/40">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                      LANGKAH {s.step}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mt-0.5">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
          >
            Mengerti &amp; Tutup
          </button>
        </div>

      </div>
    </div>
  );
};

export const FAQModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      q: 'Apa yang terjadi setelah masa aktif tautan gambar habis?',
      a: 'Ketika durasi waktu yang Anda tentukan (1 hari, 1 minggu, atau 1 bulan) telah terlampaui, siapapun yang membuka tautan tersebut akan diarahkan ke Halaman 404 Keren yang memberitahukan bahwa link sudah kedaluwarsa demi privasi.',
    },
    {
      q: 'Mengapa format URL yang dihasilkan panjang?',
      a: 'URL panjang dibuat menggunakan token kriptografi acak berkeamanan tinggi sehingga link tidak dapat ditebak secara acak oleh pihak lain (unpredictable & tamper-resistant).',
    },
    {
      q: 'Apakah gambar disimpan di cloud Supabase?',
      a: 'Ya! ImgURL terintegrasi langsung dengan Supabase Storage dan Database PostgreSQL. Anda juga dapat menghubungkan database Supabase Anda sendiri dengan mudah melalui tombol status di navbar.',
    },
    {
      q: 'Berapa batasan ukuran file yang bisa diunggah?',
      a: 'Maksimum ukuran gambar adalah 10MB dengan format JPG, JPEG, PNG, dan WEBP.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Frequently Asked Questions (FAQ)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                {faq.q}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
          >
            Tutup FAQ
          </button>
        </div>

      </div>
    </div>
  );
};
