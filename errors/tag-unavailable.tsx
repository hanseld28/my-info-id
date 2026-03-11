import { StatusType } from '@/lib/types/tag';
import { Lock, ShieldAlert, Info } from 'lucide-react';
import Link from 'next/link';

interface TagUnavailableProps {
  status?: StatusType;
}

export default function tagUnavailable({ status }: TagUnavailableProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'blocked':
        return {
          icon: <Lock className="w-16 h-16 text-red-500 mb-4" />,
          title: 'Acesso Bloqueado',
          message: 'O proprietário desta tag ativou o modo de segurança. O perfil de emergência e os dados médicos estão temporariamente ocultos.',
          bgColor: 'bg-red-400',
          borderColor: 'border-red-500'
        };
      case 'inactive':
        return {
          icon: <ShieldAlert className="w-16 h-16 text-slate-400 mb-4" />,
          title: 'Tag Desativada',
          message: 'Esta tag Meu Info ID foi permanentemente desativada e não possui mais nenhum perfil de emergência vinculado a ela.',
          bgColor: 'bg-slate-300',
          borderColor: 'border-slate-300'
        };
      case 'pending_activation':
        return {
          icon: <Info className="w-16 h-16 text-amber-500 mb-4" />,
          title: 'Tag Não Ativada',
          message: 'Esta tag é nova e ainda não foi configurada por seu proprietário. Nenhum dado vital foi cadastrado.',
          bgColor: 'bg-amber-400',
          borderColor: 'border-amber-500'
        };
      default:
        return {
          icon: <Lock className="w-16 h-16 text-slate-400 mb-4" />,
          title: 'Perfil Indisponível',
          message: 'Não foi possível acessar as informações desta tag no momento.',
          bgColor: 'bg-slate-300',
          borderColor: 'border-slate-300'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 text-center relative">
        
        <div className={`h-32 w-full ${config.bgColor} ${config.borderColor} border-b flex items-end justify-center pb-6 absolute top-0 left-0`}>
        </div>

        <div className="relative z-10 pt-20 px-8 pb-10 flex flex-col items-center">
          <div className="bg-white p-2 rounded-full shadow-sm mb-2">
            {config.icon}
          </div>
          
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-3">
            {config.title}
          </h1>
          
          <p className="text-slate-600 leading-relaxed mb-8">
            {config.message}
          </p>

          <div className="w-full h-px bg-slate-100 mb-8"></div>

          <div className="space-y-4 w-full">
            <Link 
              href="/"
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Conhecer o Meu Info ID
            </Link>
            
            {status === 'pending_activation' && (
              <Link 
                href="/activate"
                className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-colors flex items-center justify-center"
              >
                É o dono? Ative a Tag aqui
              </Link>
            )}
          </div>
        </div>
        
      </div>

    </div>
  );
}