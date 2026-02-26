'use client';
import { useEffect } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import SecurityCodeInput from './SecurityCodeInput';
import { StatusType } from '@/lib/types/tag';

interface SecurityCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { valid: boolean, code: string, status: StatusType }) => void;
}

export default function SecurityCodeModal({ isOpen, onClose, onSuccess }: SecurityCodeModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') e.preventDefault();
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" 
      />

      <div 
        className="relative bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-4xl border border-amber-100 mb-8">
          <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-600 rounded-full">
            <AlertCircle size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-amber-800 leading-tight">
              Validação Necessária
            </h2>
            <p className="text-[11px] text-amber-700/80 font-medium leading-relaxed">
              Não encontramos produtos ativos. Use o código da sua tag para prosseguir.
            </p>
          </div>
        </div>

        <div className="py-2">
          <SecurityCodeInput
            onSuccess={onSuccess}
          />
        </div>

        <div className="mt-8 text-center animate-in fade-in slide-in-from-top-2 duration-700 delay-300">
          <button
            onClick={onClose}
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all py-2 px-6 rounded-full hover:bg-blue-50"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer">
              Voltar para o e-mail
            </span>
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex gap-1.5">
            <div className="w-1 h-1 rounded-full bg-slate-100" />
            <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}