'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lgpd-consent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('lgpd-consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-6 md:right-6 z-200 animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-5 md:p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto ring-1 ring-slate-900/5">
        <div className="flex items-center gap-4 text-slate-700">
          <div className="hidden md:flex w-12 h-12 bg-blue-600/10 text-blue-600 rounded-full items-center justify-center shrink-0">
            <Cookie size={24} />
          </div>
          <p className="text-xs md:text-sm font-medium leading-relaxed">
            <span className="font-black uppercase text-[10px] text-blue-600 block mb-1 tracking-widest">Privacidade & Cookies</span>
            Para sua segurança, utilizamos cookies para otimizar a plataforma. Ao navegar, você concorda com nossos 
            <Link href="/legal/terms" className="text-blue-600 font-bold hover:underline mx-1">Termos de Uso</Link>e 
            <Link href="/legal/privacy" className="text-blue-600 font-bold hover:underline"> Política de Privacidade (LGPD)</Link>.
          </p>
        </div>
        
        <button 
          onClick={accept}
          className="w-full md:w-auto bg-white border-2 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
        >
          Aceitar e Continuar
        </button>
      </div>
    </div>
  );
}