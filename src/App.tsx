import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ImageViewPage } from './pages/ImageViewPage';
import { Cool404Page } from './pages/Cool404Page';
import { SupabaseModal } from './components/SupabaseModal';
import { HowItWorksModal, FAQModal } from './components/InfoModals';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('imgurl_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [, setConfigKey] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('imgurl_dark_mode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleConfigChanged = () => {
    setConfigKey(prev => prev + 1);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-blue-500 selection:text-white">
        
        {/* Top Navigation */}
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
          onOpenHowItWorks={() => setHowItWorksOpen(true)}
          onOpenFeatures={() => {
            const el = document.getElementById('features');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              setHowItWorksOpen(true);
            }
          }}
          onOpenFAQ={() => setFaqOpen(true)}
        />

        {/* Main Content View */}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/v/:token" element={<ImageViewPage />} />
            <Route path="/404" element={<Cool404Page reason="not_found" />} />
            <Route path="*" element={<Cool404Page reason="not_found" />} />
          </Routes>
        </main>

        {/* Footer (Developed by Dimas) */}
        <Footer />

        {/* Supabase Connection Modal */}
        <SupabaseModal
          isOpen={supabaseModalOpen}
          onClose={() => setSupabaseModalOpen(false)}
          onConfigChanged={handleConfigChanged}
        />

        {/* Informational Modals */}
        <HowItWorksModal
          isOpen={howItWorksOpen}
          onClose={() => setHowItWorksOpen(false)}
        />
        <FAQModal
          isOpen={faqOpen}
          onClose={() => setFaqOpen(false)}
        />

      </div>
    </BrowserRouter>
  );
}

export default App;
