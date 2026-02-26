'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ShieldCheck, Loader2, Link } from 'lucide-react';

interface Props {
  securityCode?: string;
  onSuccess: () => void;
}

export default function BindTagModal({ securityCode, onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBinding, setIsBinding] = useState(false);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (securityCode && securityCode?.length === 6) {
      setIsOpen(true);
      
      setTimeout(() => {
        setCodeDigits(securityCode!.toUpperCase().split(''));
      
        if (inputRefs.current) {
          inputRefs.current[inputRefs?.current.length - 1]?.focus();
        }
      }, 300);
    }
  }, [securityCode])

  const handleCodeChange = (value: string, index: number) => {
    const val = value.toUpperCase().slice(-1).replace(/[^A-Z0-9]/g, '');
    const newCode = [...codeDigits];
    newCode[index] = val;
    setCodeDigits(newCode);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pastedData.length >= 1) {
      const newCode = [...codeDigits];
      for (let i = 0; i < 6; i++) {
        if (pastedData[i]) newCode[i] = pastedData[i];
      }
      setCodeDigits(newCode);
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleClose = useCallback(async () => {
    setIsOpen(false);
    setCodeDigits(['', '', '', '', '', '']);
  }, []);

  const handleSubmit = useCallback(async () => {
    const fullCode = codeDigits.join('');
    if (fullCode.length < 6) return;

    setIsBinding(true);
    try {
      const res = await fetch('/api/v1/tags/bind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ securityCode: fullCode }),
      });

      if (res.ok) {
        setIsOpen(false);
        setCodeDigits(['', '', '', '', '', '']);
        onSuccess();
      } else {
        const error = await res.json();
        alert(error.error || 'Código inválido.');
        setCodeDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      alert('Erro na ligação ao servidor.');
    } finally {
      setIsBinding(false);
    }
  }, [codeDigits, onSuccess]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-end gap-2 bg-blue-600 text-white mt-4 py-4 p-4 rounded-xl font-black text-xs hover:bg-blue-700 shadow-sm shadow-blue-100 disabled:opacity-50 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
      >
        <Link size={16} /> Vincular Existente
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Vincular Nova Tag</h3>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Introduza o código de 6 dígitos que se encontra na embalagem da sua tag física.
              </p>
            </div>

            <div className="flex justify-between gap-2 mb-8" onPaste={handlePaste}>
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  autoFocus={index === 0}
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full h-16 text-center text-2xl font-black border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all bg-slate-50 uppercase"
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isBinding || codeDigits.some(d => d === '')}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isBinding ? <Loader2 className="animate-spin" size={18} /> : 'Confirmar Vinculação'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}