import { WifiOff, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline - Meu Info ID',
};

export default function OfflineFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
        <WifiOff className="w-16 h-16 text-slate-400 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Sem conexão com a internet
        </h1>
        
        <p className="text-slate-600 mb-6">
          Você está offline. As páginas e perfis de emergência que você já acessou continuam disponíveis no seu dispositivo, mas não é possível carregar novos dados no momento.
        </p>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start text-sm text-left">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
          <p>Se você é um socorrista, verifique se o seu dispositivo móvel está no modo avião ou tente reconectar à rede para baixar o prontuário completo.</p>
        </div>
      </div>
    </div>
  );
}