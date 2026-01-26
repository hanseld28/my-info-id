'use client';
import { useState, useRef, useEffect } from 'react';
import { maskPhone } from '@/lib/utils/general-utils';
import LoadingOverlay from '@/components/LoadingOverlay';
import { TARGET_TYPE_LABELS } from '@/lib/utils/constants';
import { Tag } from '@/lib/types/tag';
import { Check, Eye, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ActivatePage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [codeDigits, setCodeDigits] = useState(new Array(8).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({ target_type: 'none', name: '', phone: '', obs: '' });

  const [tag, setTag] = useState<Tag | null>(null);

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
      const { data: activatedTag } = await res.json();
      setTag(activatedTag);
      setLoading(false);
    } else {
      const err = await res.json();
      alert(err.error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {loading && <LoadingOverlay message={step === 1 ? "Validando..." : "Ativando..."} />}
      
      {tag?.status === 'active' && (
        <div className="max-w-md w-full min-h-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <Check size={40} strokeWidth={3} />
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 mb-2">Tag Ativada!</h2>
          <p className="text-slate-500 mb-8">
            Sua tag já está funcionando. Agora, que tal deixá-la 100% segura com informações extras?
          </p>

          <div className="w-full space-y-3">
            <Link
              href={`/manage/${tag?.hash_url}?code=${tag?.security_code}`}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all shadow-xs"
            >
              <PlusCircle size={16} />
              COMPLETAR PERFIL AGORA
            </Link>

            <Link
              href={`/${tag?.hash_url}`}
              className="flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all"
            >
              <Eye size={16} />
              Ver como ficou
            </Link>
          </div>

          <p className="mt-8 text-xs text-slate-400">
            Você poderá editar estas informações sempre que quiser usando seu código de segurança.
          </p>
        </div>
      )}
      {tag === null && (
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 min-h-100 flex flex-col justify-center">
          
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
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.target_type}
                    onChange={e => setForm({...form, target_type: e.target.value})}
                  >
                    <option value="none" disabled hidden>Selecione uma opção</option>
                    {Object.entries(TARGET_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-red-500 ml-1 font-bold">* Lembre-se: Esta informação não poderá ser alterada mais tarde.</p>

                </div>

                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Nome do Protegido</label>
                  <input
                    id="name"
                    required
                    placeholder="Ex: Nome da Criança, Idoso, Pet etc."
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: maskPhone(e.target.value)})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="obs" className="text-sm font-bold text-slate-700 ml-1">Observações</label>
                  <textarea
                    id="obs"
                    placeholder="Ex: Alérgico a Penicilina, Tipo Sanguíneo A+..."
                    className="w-full p-4 border border-slate-200 rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={e => setForm({...form, obs: e.target.value})}
                    maxLength={1000}
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
      )}
    </main>
  );
}