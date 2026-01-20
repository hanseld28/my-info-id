'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { maskPhone } from '@/lib/utils/general-utils';
import LoadingOverlay from '@/components/LoadingOverlay';
import { TARGET_TYPE_LABELS } from '@/lib/utils/constants';

export default function ActivatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [codeDigits, setCodeDigits] = useState(new Array(8).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({ target_type: 'none', name: '', phone: '', obs: '' });

  const handleCodeChange = (value: string, index: number) => {
    const val = value.toUpperCase().slice(-1);
    const newCode = [...codeDigits];
    newCode[index] = val;
    setCodeDigits(newCode);

    if (val && index < 7) {
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
      
      for (let i = 0; i < 8; i++) {
        if (pastedData[i]) {
          newCode[i] = pastedData[i];
        }
      }
      
      setCodeDigits(newCode);

      const nextIndex = Math.min(pastedData.length, 7);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  useEffect(() => {
    const fullCode = codeDigits.join("");
    if (fullCode.length === 8) {
      verifyAndNext(fullCode);
    }
  }, [codeDigits]);

  const verifyAndNext = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/tags/verify?code=${code}`);
      if (res.ok) {
        setStep(2);
      } else {
        const err = await res.json();
        alert(err.error || "Código inválido ou já utilizado.");
        setCodeDigits(new Array(8).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (_error) {
      alert("Não foi possível validar o código no momento. Tente novamente mais tarde.");
      setCodeDigits(new Array(8).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const finalData = { ...form, code: codeDigits.join("") };

    const res = await fetch('/api/v1/tags/activate', {
      method: 'POST',
      body: JSON.stringify(finalData),
    });

    if (res.ok) {
      const activatedTag = await res.json();
      router.push(`/view-tag/${activatedTag.data.hash_url}`);
    } else {
      const err = await res.json();
      alert(err.error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {loading && <LoadingOverlay message={step === 1 ? "Validando..." : "Ativando..."} />}
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 min-h-[400px] flex flex-col justify-center">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Passo 1 de 2</span>
              <h1 className="text-2xl font-black text-slate-800 mt-4 mb-2">Validar Tag</h1>
              <p className="text-slate-500 text-sm">Digite os 8 caracteres do código de segurança presente na embalagem da sua da sua tag física.</p>
            </div>

            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  autoFocus={index === 0}
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-full h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                />
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleActivate} className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
            <div className="text-center mb-6">
               <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Passo 2 de 2</span>
               <h1 className="text-2xl font-black text-slate-800 mt-4 mb-2">Dados da Tag</h1>
               <p className="text-slate-500 text-sm">Informações que aparecerão ao escanear.</p>
            </div>

            <div className="space-y-4">

              <div className="space-y-1.5">
                <label htmlFor="target_type" className="text-sm font-bold text-slate-700 ml-1">Quem utilizará esta Tag?</label>
                <select
                  id="target_type"
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  value={form.target_type}
                  onChange={e => setForm({...form, target_type: e.target.value})}
                >
                  <option value="none" disabled hidden>Selecione uma opção</option>
                  {Object.entries(TARGET_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Nome do Protegido</label>
                <input
                  id="name"
                  required
                  placeholder="Ex: Nome da Criança, Idoso, Pet etc."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-sm font-bold text-slate-700 ml-1">Telefone de Emergência</label>
                <input
                  id="phone"
                  required
                  type="tel"
                  placeholder="(00) 00000-0000"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: maskPhone(e.target.value)})}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="obs" className="text-sm font-bold text-slate-700 ml-1">Informações Médicas / Avisos</label>
                <textarea
                  id="obs"
                  placeholder="Ex: Alérgico a Penicilina, Tipo Sanguíneo A+..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onChange={e => setForm({...form, obs: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                CONCLUIR ATIVAÇÃO
              </button>
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600"
              >
                Voltar
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}