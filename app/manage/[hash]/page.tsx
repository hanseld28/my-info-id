'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import LoadingOverlay from '@/components/LoadingOverlay';
import { TARGET_TYPE_LABELS } from '@/lib/utils/constants';
import { ActivityIcon, AlertCircle, Info, Pill, Save, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import EmergencyContactManager from '@/components/EmergencyContactManager';
import { Contact } from '@/lib/types/emergency-contact';
import HealthCardInput from '@/components/inputs/HealthCardInput';
import BloodTypeInput from '@/components/inputs/BloodTypeInput';

export default function ManagePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [codeDigits, setCodeDigits] = useState(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({ 
    full_name: '',
    birth_date: '',
    weight_kg: 0,
    height_cm: 0,
    blood_type: '',
    medications: '',
    allergies: '',
    health_conditions: '',
    quick_instructions: '',
    observations: '',
    target_type: '',
    emergency_contacts: [] as Contact[]
  });

  const handleCodeChange = useCallback((value: string, index: number) => {
    const val = value.toUpperCase().slice(-1);
    const newCode = [...codeDigits];
    newCode[index] = val;
    setCodeDigits(newCode);
    
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [codeDigits]);

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
      for (let i = 0; i < 6; i++) { if (pastedData[i]) newCode[i] = pastedData[i]; }
      setCodeDigits(newCode);
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const verifyAndFetch = useCallback(async () => {
    const securityCode = codeDigits.join("");
    if (securityCode.length !== 6) return;
    setLoading(true);
    try {
      
      const res = await fetch(`/api/v1/tags/verify-edit?hash=${params.hash}&code=${securityCode}`);
      
      if (res.ok) {
        const { data } = await res.json();
        
        setForm({
          target_type: data.target_type || '',
          full_name: data.full_name || '',
          birth_date: data.birth_date || '',
          weight_kg: data.weight_kg || 0,
          height_cm: data.height_cm || 0,
          blood_type: data.blood_type || '',
          medications: data.medications || '',
          allergies: data.allergies || '',
          health_conditions: data.health_conditions || '',
          quick_instructions: data.quick_instructions || '',
          emergency_contacts: data.emergency_contacts || [],
          observations: data.observations || ''
        });
        setStep(2);
      } else {
        const err = await res.json();
        alert(err.error || "Código de segurança incorreto.");
        setCodeDigits(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      alert("Erro ao validar acesso.");
    } finally {
      setLoading(false);
    }
  }, [codeDigits, params]);

  useEffect(() => {
    console.log('searchParams', searchParams);
    if (searchParams.has('code') && searchParams.get('code')?.length === 6) {
      setCodeDigits(searchParams.get('code')!.toUpperCase().split(''));
    }
  }, [searchParams])

  useEffect(() => {
    if (codeDigits.join("").length === 6) {
      verifyAndFetch();
    }
  }, [codeDigits, verifyAndFetch]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (form.emergency_contacts.length === 0) {
      alert("Erro: Você precisa adicionar pelo menos um contato de emergência para que a tag seja útil.");
      return;
    }

    const isAllContactsFilled = form.emergency_contacts.every(
      c => c.name.trim() !== '' && c.phone.trim() !== ''
    );

    if (!isAllContactsFilled) {
      alert("Erro: Preencha todos os campos obrigatórios corretamente para os contatos adicionados.");
      return;
    }

    setLoading(true);

    const res = await fetch('/api/v1/tags/update', {
      method: 'PATCH',
      body: JSON.stringify({
        hash: params.hash,
        security_code: codeDigits.join(""),
        updatedData: {
          full_name: form.full_name, 
          birth_date: form.birth_date,
          weight_kg: form.weight_kg,
          height_cm: form.height_cm,
          blood_type: form.blood_type,
          medications: form.medications,
          allergies: form.allergies,
          health_conditions: form.health_conditions,
          quick_instructions: form.quick_instructions,
          observations: form.observations,
          emergency_contacts: form.emergency_contacts
        }
      }),
    });

    if (res.ok) {
      alert("Dados atualizados!");
      router.push(`/${params.hash}`);
    } else {
      const err = await res.json();
      alert(err.error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {loading && <LoadingOverlay message={step === 1 ? "Verificando permissão..." : "Salvando..."} />}

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 pb-16">
        
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
                O código de 6 caracteres está presente na embalagem da sua tag.
              </span>
            </div>
            
            <div className="flex items-center justify-center mt-8">
              <Link
                href={`/${params.hash}`}
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
                <label className="text-sm font-bold text-slate-700 ml-1">Tipo de Protegido</label>
                <input
                  disabled
                  className="w-full p-4 bg-slate-100 border border-slate-200 rounded-xl outline-none cursor-not-allowed"
                  value={form.target_type ? TARGET_TYPE_LABELS[form.target_type] : 'Desconhecido'}
                />
                <p className="text-[10px] text-slate-400 ml-1 italic font-medium">* Escolhido no momento da ativação ou da compra.</p>
              </div>

              <section className="space-y-4">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Identificação</h2>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Nome
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 invalid:focus:ring-red-500"
                    value={form.full_name}
                    onChange={e => setForm({...form, full_name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Data de Nascimento</label>
                  <input 
                    type="date"
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.birth_date}
                    onChange={e => setForm({...form, birth_date: e.target.value})}
                  />
                </div>
              </section>
            </div>

            <hr className="border-slate-100" />

            <EmergencyContactManager 
              contacts={form.emergency_contacts}
              onChange={(newContacts) => setForm({ ...form, emergency_contacts: newContacts })}
            />

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} />
                Segurança Avançada
              </h3>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Ação Imediata / Alerta</label>
                <input
                  placeholder="Ex: Sou diabético / Tenho medo de estranhos"
                  maxLength={50}
                  className="w-full p-4 bg-amber-50 border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-amber-900 placeholder:text-amber-400/60"
                  value={form.quick_instructions}
                  onChange={e => setForm({...form, quick_instructions: e.target.value})}
                />
                <p className="text-[10px] text-slate-400 ml-1 italic font-medium">* Aparece em destaque na página de visualização das informações da tag.</p>
              </div>

              <hr className="border-slate-100" />

              <section className="space-y-3">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Saúde e Alergias</h2>
        
                <div className="space-y-3">
                  <HealthCardInput 
                    label="Alergias"
                    placeholder="Ex: Penicilina, Amendoim..."
                    value={form.allergies}
                    onChange={val => setForm({...form, allergies: val})}
                    icon={<AlertCircle />}
                    iconColor="text-red-500"
                  />

                  <HealthCardInput 
                    label="Medicamentos"
                    placeholder="Ex: Insulina, Anti-hipertensivo..."
                    value={form.medications}
                    onChange={val => setForm({...form, medications: val})}
                    icon={<Pill />}
                    iconColor="text-blue-500"
                  />
                  <HealthCardInput 
                    label="Condições Médicas"
                    placeholder="Ex: Diabetes, Hipertensão..."
                    value={form.health_conditions}
                    onChange={value => setForm({...form, health_conditions: value})}
                    icon={<ActivityIcon />}
                    iconColor="text-violet-500"
                  />
                </div>
              </section>

              <hr className="border-slate-100" />

              <section className="space-y-3">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Informações Adicionais</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Peso (kg)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 pr-12 font-semibold text-slate-700"
                        value={form.weight_kg}
                        onChange={e => setForm({...form, weight_kg: Number(e.target.value)})}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold pointer-events-none">
                        kg
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Altura (cm)</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="000"
                        className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 pr-12 font-semibold text-slate-700"
                        value={form.height_cm}
                        onChange={e => setForm({...form, height_cm: Number(e.target.value)})}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold pointer-events-none">
                        cm
                      </span>
                    </div>
                  </div>
                </div>

                <BloodTypeInput
                  targetType={form.target_type}
                  value={form.blood_type}
                  onChange={(value) => setForm({...form, blood_type: value})}
                />
                
              </section>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Observações</label>
                <textarea
                  className="w-full p-4 border border-slate-200 rounded-xl h-28 outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.observations}
                  onChange={e => setForm({...form, observations: e.target.value})}
                  maxLength={1000}
                />
                <p className="text-[10px] text-amber-500 ml-1 italic font-bold">{form.observations?.length ? `${form.observations?.length}/1000` : '0/1000'}</p>
              </div>

            </div>

            <div className="fixed bottom-4 left-0 right-0  max-w-md w-full mx-auto">
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-5 cursor-pointer rounded-3xl font-black text-sm shadow-sm flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                <Save size={22} />
                SALVAR ALTERAÇÕES
              </button>
            </div>
            
          </form>
        )}
      </div>
    </main>
  );
}