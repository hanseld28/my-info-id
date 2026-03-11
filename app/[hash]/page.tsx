import { Metadata } from 'next';
import { TARGET_CONFIG } from '@/lib/utils/constants';
import { Activity, AlertCircle, AlertOctagon, AlertTriangle, Droplet, Pill, Ruler, ShieldCheck, Weight } from 'lucide-react';
import Link from 'next/link';
import { calculateAge } from '@/lib/utils/date-utils';
import { EmergencyContact } from '@/lib/types/emergency-contact';
import HealthCard from '@/components/HealthCard';
import EmergencyContactView from '@/components/EmergencyContactView';
import { getBaseUrl } from '@/lib/utils/get-url';
import tagUnavailable from '@/errors/tag-unavailable';

const BASE_URL = getBaseUrl();

interface ViewerProps {
  params: Promise<{ hash: string }>;
}

export const generateMetadata = async ({ params }: ViewerProps): Promise<Metadata> =>{
  const { hash } = await params;

  const safeHash = hash.toUpperCase();

  return { 
    title: 'Tag - Acesso Público',
    description: `Visualize as informações da tag NFC ${safeHash}.`,
    metadataBase: new URL(BASE_URL),
    openGraph: {
      title: 'Tag - Acesso Público',
      description: `Visualize as informações da tag NFC ${safeHash}.`
    }
  };
}

export default async function ViewerPage({ params }: ViewerProps) {
  const { hash } = await params;

  const response = await fetch(`${BASE_URL}/api/v1/tags/view/${hash}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    if (response.status === 403) {
      return tagUnavailable({ status: 'pending_activation' });
    }

    return tagUnavailable({});
  }

  const { data } = await response.json();

  if (['blocked', 'inactive'].includes(data.status)) {
    return tagUnavailable({ status: data.status });
  }

  const config = TARGET_CONFIG[data.target_type] || TARGET_CONFIG.other;
  const Icon = config.icon;
  
  const age = data.birth_date ? calculateAge(data.birth_date) : null;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        
        <div className={`h-24 w-full ${config.color.split(' ')[0]} flex items-center justify-center`}>
           <div className={`p-4 rounded-full bg-white shadow-sm`}>
              <Icon size={40} className={config.color.split(' ')[1]} />
             </div>
        </div>

        <div className="p-8 pt-12 text-center relative">
          <span className={`absolute top-4 right-4 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${config.color}`}>
            {config.label}
          </span>

          <div className="text-center">
            <h1 className="text-3xl font-black text-slate-800 mb-1">
              {data.full_name}{age && <span className="text-slate-400 ml-2">({age})</span>}
            </h1>
          </div>

          <p className="text-slate-500 font-medium mb-6 italic">Informações de Emergência</p>

          {data.quick_instructions && (
            <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-center gap-3 text-left">
              <AlertTriangle className="text-amber-600 shrink-0" size={24} />
              <div>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Instrução / Aviso Importante</p>
                <p className="text-amber-900 font-bold leading-tight">{data.quick_instructions}</p>
              </div>
            </div>
          )}


          {(data.weight_kg || data.height_cm || data.blood_type) && (
            <div className="grid grid-cols-2 gap-4 mb-2">

              {(data.weight_kg || data.height_cm) && (
                <>
                  {data.weight_kg && (
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                      <div className="w-8 h-8 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mb-2">
                        <Weight size={18} fill="currentColor" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peso</p>
                      <span className="font-black leading-tight text-xl text-slate-800">
                        {data.weight_kg}kg
                      </span>
                    </div>
                  )}
                  {data.height_cm && (
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                      <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-2">
                        <Ruler size={18} fill="currentColor" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Altura</p>
                      <span className="font-black leading-tight text-xl text-slate-800">
                        {data.height_cm / 100}m
                      </span>
                    </div>
                  )}
                </>
              )}

              {data.blood_type && (
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
                    <Droplet size={18} fill="currentColor" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo Sanguíneo</p>
                  <span className={`font-black leading-tight ${
                    data.blood_type?.length > 4 ? 'text-sm' : 'text-xl'
                  } text-slate-800`}>
                    {data.blood_type || '---'}
                  </span>
                </div>
              )}

              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proteção</p>
                <span className="font-black text-emerald-600 text-sm uppercase">Ativa</span>
              </div>
            </div>
          )}

          <hr className="border-slate-100 mt-6" />

          <EmergencyContactView
            contacts={data.emergency_contacts as EmergencyContact[]}
          />

          <hr className="border-slate-100 py-1" />

          <div className="space-y-4 mt-4 w-full">  
            {data.allergies && (
              <HealthCard 
                title="Alergias"
                content={data.allergies}
                icon={<AlertCircle fill="currentColor" className="opacity-20" />}
                iconBgColor="bg-red-50"
                iconColor="text-red-500"
              />
            )}
            {data.medications && (
              <HealthCard 
                title="Medicamentos"
                content={data.medications}
                icon={<Pill />}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-500"
              />
            )}
            {data.health_conditions && (
              <HealthCard 
                title="Condições Médicas"
                content={data.health_conditions}
                icon={<Activity />}
                iconBgColor="bg-violet-50"
                iconColor="text-violet-500"
              />
            )}
          </div>

          <hr className="border-slate-100 mt-6 py-3" />

          <div className="text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Observações</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {data.observations ? `"${data.observations}"` : "Nenhuma observação adicional fornecida."}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            Informações Acessíveis via Tag NFC
          </p>
        </div>
      </div>
      
      <div className="max-w-md w-full flex justify-center mt-6 mb-2">
        <Link 
          href={`/manage/${hash}`}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
        >
          <AlertOctagon size={12} />
          É o dono desta Tag? Gerencie aqui.
        </Link>
      </div>

    </main>

  );
}