'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { maskPhone } from '@/lib/utils/general-utils';
import LoadingOverlay from '@/components/LoadingOverlay';
import { TARGET_TYPE_LABELS } from '@/lib/utils/constants';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default function ManagePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [codeDigits, setCodeDigits] = useState(new Array(8).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    obs: '', 
    target_type: 'other' 
  });

  const handleCodeChange = (value: string, index: number) => {
    const val = value.toUpperCase().slice(-1);
    const newCode = [...codeDigits];
    newCode[index] = val;
    setCodeDigits(newCode);
    if (val && index < 7) inputRefs.current[index + 1]?.focus();
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
      for (let i = 0; i < 8; i++) { if (pastedData[i]) newCode[i] = pastedData[i]; }
      setCodeDigits(newCode);
      const nextIndex = Math.min(pastedData.length, 7);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const verifyAndFetch = useCallback(async () => {
    const securityCode = codeDigits.join("");
    if (securityCode.length !== 8) return;

    setLoading(true);
    try {
      
      const res = await fetch(`/api/v1/tags/verify-edit?hash=${params.hash}&code=${securityCode}`);
      
      if (res.ok) {
        const { data } = await res.json();
        
        setForm({
          name: data.full_name || '',
          phone: data.phone || '',
          obs: data.observations || '',
          target_type: data.target_type || 'other'
        });
        setStep(2);
      } else {
        const err = await res.json();
        alert(err.error || "Código de segurança incorreto.");
        setCodeDigits(new Array(8).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      alert("Erro ao validar acesso.");
    } finally {
      setLoading(false);
    }
  }, [codeDigits, params]);

  useEffect(() => {
    if (codeDigits.join("").length === 8) {
      verifyAndFetch();
    }
  }, [codeDigits, verifyAndFetch]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/v1/tags/update', {
      method: 'PATCH',
      body: JSON.stringify({
        hash: params.hash,
        security_code: codeDigits.join(""),
        updatedData: { 
          full_name: form.name, 
          phone: form.phone, 
          observations: form.obs
        }
      }),
    });

    if (res.ok) {
      alert("Dados atualizados!");
      router.push(`/view-tag/${params.hash}`);
    } else {
      const err = await res.json();
      alert(err.error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {loading && <LoadingOverlay message={step === 1 ? "Verificando permissão..." : "Salvando..."} />}

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-slate-800">
            {step === 1 ? "Acesso Restrito" : "Editar Informações"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {step === 1 
              ? "Insira o código de segurança para editar esta tag." 
              : `Editando a Tag <${params.hash}>`}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
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
                  className="w-full h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                />
              ))}
            </div>
            
            <div className="text-center text-slate-400 text-xs flex flex-row items-start gap-2">
              <Info size={16} /> 
              <span className="text-center text-xs text-slate-400 font-medium">
                O código de 8 dígitos está presente na embalagem da sua tag.
              </span>
            </div>
            
            <div className="flex items-center justify-center mt-8">
              <Link
                href={`/view-tag/${params.hash}`}
                className="p-4 bg-blue-600 text-white py-4 rounded-xl font-black text-sm hover:bg-blue-700 shadow-sm transition-all active:scale-95"
              >
                  Voltar para Tag
              </Link>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleUpdate} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Quem utilizará a Tag?</label>
                <select
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.target_type}
                  onChange={e => setForm({...form, target_type: e.target.value})}
                  disabled
                >
                  <option value="none" disabled hidden>Selecione uma opção</option>
                  {Object.entries(TARGET_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Nome</label>
                <input
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Telefone de Emergência</label>
                <input
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: maskPhone(e.target.value)})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Observações</label>
                <textarea
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-28 outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.obs}
                  onChange={e => setForm({...form, obs: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm hover:bg-blue-700 shadow-sm transition-all active:scale-95"
            >
              SALVAR ALTERAÇÕES
            </button>
          </form>
        )}
      </div>
    </main>
  );
}