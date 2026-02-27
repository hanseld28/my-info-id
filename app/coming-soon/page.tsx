'use client';
import { Smartphone, Lock, ShieldCheck } from 'lucide-react';

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full shadow-sm">
            <Lock size={16} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ambiente Protegido</span>
          </div>
        </div>

        <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
          Quase pronto...
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed mb-10">
          O <span className="text-blue-600 font-bold">Meu Info ID</span> está passando pelos últimos ajustes de segurança antes do lançamento oficial.
        </p>

        <div className="grid gap-4 text-left mb-10">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-slate-50 p-3 rounded-xl text-blue-600">
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 text-sm">Tecnologia NFC</h3>
              <p className="text-xs text-slate-400">Sincronização física instantânea.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-slate-50 p-3 rounded-xl text-emerald-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 text-sm">Segurança de Dados</h3>
              <p className="text-xs text-slate-400">Proteção total via criptografia.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Acompanhe as novidades
          </p>
          <a 
            href="https://www.meuinfoid.com.br" 
            className="text-blue-600 font-black text-sm hover:underline"
          >
            www.meuinfoid.com.br
          </a>
        </div>
      </div>
    </main>
  );
}