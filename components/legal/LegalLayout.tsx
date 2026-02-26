'use client';
import { ReactNode } from 'react';
import ContactChannels from '../ContactChannels';

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  lastUpdated: string;
}

export default function LegalLayout({ children, title, subtitle, lastUpdated }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-blue-100">
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-16 border-l-4 border-blue-600 pl-6 md:pl-8">
          <p className="text-blue-600 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2">
            {subtitle}
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            {title}
          </h1>
          <p className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
            Atualizado em: {lastUpdated}
          </p>
        </header>

        <article className="prose prose-slate max-w-none 
          prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black
          prose-h2:text-xl prose-h2:text-slate-800 prose-h2:mt-12
          prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-base
          prose-strong:text-slate-900 prose-strong:font-black
          prose-li:text-slate-600">
          {children}
        </article>

        <footer className="mt-20 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Dúvidas sobre sua privacidade?
          </p>
          <ContactChannels />
        </footer>
      </main>
    </div>
  );
}