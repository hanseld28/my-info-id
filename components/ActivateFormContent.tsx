'use client';
import { useState, useRef, useEffect } from 'react';
import LoadingOverlay from '@/components/LoadingOverlay';
import { TARGET_TYPE_LABELS } from '@/lib/utils/constants';
import { Tag } from '@/lib/types/tag';
import { Check, Eye, Lightbulb, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import EmergencyContactManager from '@/components/EmergencyContactManager';
import { Contact } from '@/lib/types/emergency-contact';
import { useSearchParams } from 'next/navigation';

export default function ActivateFormContent() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [codeDigits, setCodeDigits] = useState(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const [form, setForm] = useState({
    target_type: 'none',
    full_name: '',
    emergency_contacts: [] as Contact[],
    observations: ''
  });

  const [tag, setTag] = useState<Tag | null>(null);

  useEffect(() => {
    if (searchParams.has('code') && searchParams.get('code')?.length === 6) {
      setCodeDigits(searchParams.get('code')!.toUpperCase().split(''));
    }
  }, [searchParams])

  const handleCodeChange = (value: string, index: number) => {
    const val = value.toUpperCase().slice(-1);
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
        if (pastedData[i]) {
          newCode[i] = pastedData[i];
        }
      }
      
      setCodeDigits(newCode);

      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  useEffect(() => {
    const fullCode = codeDigits.join("");
    if (fullCode.length === 6) {
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
        setCodeDigits(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      alert("Não foi possível validar o código no momento. Tente novamente mais tarde.");
      setCodeDigits(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      return alert("Você precisa aceitar os termos para ativar a tag e utilizar nossos serviços.");
    }

    const data = {
      ...form,
      code: codeDigits.join(""),
      terms_accepted: termsAccepted
    };

    if (data.emergency_contacts.length === 0) {
      alert("Adicione pelo menos um contato de emergência!");
      return;
    }
    
    setLoading(true);

    const res = await fetch('/api/v1/tags/activate', {
      method: 'POST',
      body: JSON.stringify(data),
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
            Você poderá editar estas informações sempre que quiser utilizando o código de segurança da tag ou vinculando-a a uma conta de usuário.
          </p>
        </div>
      )}
      {tag === null && (
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 min-h-100 flex flex-col justify-center">
          
          {step === 1 && (
            <>
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                  <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Passo 1 de 2</span>
                  <h1 className="text-2xl font-black text-slate-800 mt-4 mb-2">Validar Tag</h1>
                  <p className="text-slate-500 text-sm">Digite os 6 caracteres do código de segurança presente na embalagem da sua da sua tag física.</p>
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
            </>
          )}

          

          {step === 2 && (
            <form onSubmit={handleActivate} className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <div className="text-center mb-6">
                <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Passo 2 de 2</span>
                <h1 className="text-2xl font-black text-slate-800 mt-4 mb-2">Configuração Rápida</h1>
                <p className="text-slate-500 text-sm">Dados essenciais para sua Tag começar a funcionar.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="target_type" className="text-sm font-bold text-slate-700 ml-1">
                    Quem utilizará esta Tag?
                    <span className="text-red-500"> *</span>
                  </label>
                  <select
                    id="target_type"
                    required
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                    value={form.target_type}
                    onChange={e => setForm({...form, target_type: e.target.value})}
                  >
                    <option value="none" disabled hidden>Selecione uma opção</option>
                    {Object.entries(TARGET_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-red-500 ml-1 font-bold italic">* Esta informação não poderá ser alterada mais tarde.</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">
                    Nome
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    id="name"
                    required
                    placeholder="Ex: João Silva, Totó, etc."
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                    value={form.full_name}
                    onChange={e => setForm({...form, full_name: e.target.value})}
                  />
                </div>

                <div className="pt-2">
                  <EmergencyContactManager 
                    contacts={form.emergency_contacts}
                    onChange={(contacts) => setForm({...form, emergency_contacts: contacts})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="observations" className="text-sm font-bold text-slate-700 ml-1">Observações</label>
                  <textarea
                    id="observations"
                    placeholder="Ex: Alérgico a penicilina, diabético..."
                    className="w-full p-4 border border-slate-200 rounded-xl h-28 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 resize-none"
                    value={form.observations}
                    onChange={e => setForm({...form, observations: e.target.value})}
                    maxLength={1000}
                  />
                </div>

                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
                  <p className="text-[11px] text-blue-600 font-medium text-center leading-relaxed">
                    <Lightbulb size={16} className="inline mr-1"/>
                    <strong>Dica:</strong> Após ativar, você poderá complementar o cadastro com informações adicionais, tipo sanguíneo, medicamentos e muito mais!
                  </p>
                </div>

                <div className="flex items-start gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 transition-all hover:bg-blue-50">
                  <div className="relative flex items-center shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      id="lgpd"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-blue-200 bg-white 
                                checked:bg-blue-600 checked:border-blue-600 transition-all duration-200
                                focus:outline-none focus:ring-4 focus:ring-blue-100"
                    />
                    <svg
                      className="absolute h-3.5 w-3.5 ml-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>

                  <label htmlFor="lgpd" className="text-[11px] md:text-xs text-blue-900/80 leading-relaxed cursor-pointer select-none">
                    Autorizo a <strong>exibição pública</strong> dos meus dados de saúde para fins de emergência e declaro que li e aceito os 
                    <Link
                      href="/legal/terms"
                      className="text-blue-700 font-bold hover:underline mx-1"
                      target="_blank"
                    >
                      Termos de Uso
                    </Link> 
                    e a 
                    <Link
                      href="/legal/privacy"
                      className="text-blue-700 font-bold hover:underline ml-1"
                      target="_blank"
                    >
                      Política de Privacidade
                    </Link>.
                  </label>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading || !termsAccepted}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
                  >
                    CONCLUIR ATIVAÇÃO
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-600"
                  >
                    VOLTAR
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </main>
  );
}