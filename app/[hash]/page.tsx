import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { pendingTagActivation } from '@/errors/tag-error-templates';
import { TARGET_CONFIG } from '@/lib/utils/constants';
import { AlertOctagon, AlertTriangle, Droplet, MessageCircleMore, PhoneCall, ShieldCheck } from 'lucide-react';
import ShareLocation from '@/components/ShareLocation';
import Link from 'next/link';

interface ViewerProps {
  siteUrl: string;
  params: { hash: string };
}

const getData = async () => {
  const headersMap = await headers();

  const host = headersMap.get('host');
  const protocol = 'http';
  const siteUrl = `${protocol}://${host}`;

  return {
    siteUrl,
  };
};

export const generateMetadata = async ({ params }: ViewerProps): Promise<Metadata> =>{
  const { hash } = await params;
  return { title: `Informações da Tag - ${hash}` };
}


export default async function ViewerPage({ params }: ViewerProps) {
  const { hash } = await params;
  const { siteUrl } = await getData();

  const response = await fetch(`${siteUrl}/api/v1/tags/view/${hash}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    if (response.status === 403) {
      return pendingTagActivation();
    }

    return notFound();
  }

  const { data } = await response.json();

  const config = TARGET_CONFIG[data.target_type] || TARGET_CONFIG.other;
  const Icon = config.icon;
  
  const rawPhone = data.phone.replace(/\D/g, '');

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

          <h1 className="text-3xl font-black text-slate-800 mb-1">{data.full_name}</h1>
          <p className="text-slate-500 font-medium mb-6 italic">Informações de Emergência</p>

          {data.quick_instructions && (
            <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-center gap-3 text-left">
              <AlertTriangle className="text-amber-600 shrink-0" size={24} />
              <div>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Instrução Urgente</p>
                <p className="text-amber-900 font-bold leading-tight">{data.quick_instructions}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-8">

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

          <div className="p-6 space-y-6">
            <label className="text-xs flex justify-start mb-0 font-semibold text-gray-400 uppercase tracking-wider">Contato de Emergência</label>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-medium text-gray-800">{data.phone}</span>
              <a 
                href={`tel:${rawPhone}`}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-full shadow-lg transition duration-150 ease-in-out"
              >              
                <PhoneCall/>
              </a>
            </div>
          </div>

          {data.phone_secondary && (
            <div className="p-6 space-y-6">
              <label className="text-xs flex justify-start mb-0 font-semibold text-gray-400 uppercase tracking-wider">Contato Reserva</label>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-medium text-gray-800">{data.phone_secondary}</span>
                <a 
                  href={`tel:${data.phone_secondary.replace(/\D/g, '')}`}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-full shadow-lg transition duration-150 ease-in-out"
                >              
                  <PhoneCall/>
                </a>
              </div>
            </div>
          )}

          <div className="text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Observações</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {data.observations ? `"${data.observations}"` : "Nenhuma observação adicional fornecida."}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            Dados Acessíveis via Tag NFC
          </p>
        </div>
      </div>
      
      <a 
        href={`https://wa.me/${rawPhone}`} 
        target="_blank" 
        className="mt-6 flex items-center gap-2 text-green-600 font-semibold text-xs bg-white px-6 py-3 rounded-full shadow-xs border border-green-100"
      >
        <MessageCircleMore size={22} />
        <span>Contatar via WhatsApp</span>
      </a>

      {/* <ShareLocation 
        phone={data.phone} 
        ownerName={data.full_name} 
      /> */}

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