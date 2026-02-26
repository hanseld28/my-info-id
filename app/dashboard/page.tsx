'use client';

import { Suspense } from 'react';
import DashboardContentManager from '@/components/DashboardContentManager';

export default function DashboardPage() {

  return (
      <Suspense fallback={
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="text-slate-400 animate-pulse font-black text-xs tracking-widest">
            CARREGANDO...
          </div>
        </main>
      }>
        <DashboardContentManager />
      </Suspense>
    );
}