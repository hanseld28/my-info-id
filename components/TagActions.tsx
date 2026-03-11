'use client'
import { useState } from 'react';
import { Eye, EyeOff, Edit3, ExternalLink, Check, Copy, Lock, Unlock, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { StatusType } from '@/lib/types/tag';

const REASON_OPTIONS = [
  { value: 'LOST', label: 'Perdi a tag' },
  { value: 'STOLEN', label: 'Fui roubado/furtado' },
  { value: 'PRIVACY', label: 'Quero ocultar meus dados temporariamente' },
  { value: 'OTHER', label: 'Outro motivo' },
];

export function TagActions({
  tag,
  onStatusChange
}: {
  tag: { hash_url: string; security_code: string; status: string };
  onStatusChange?: (newStatus: StatusType) => void;
}) {
  const router = useRouter();
  
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const [status, setStatus] = useState(tag.status);
  const [isToggling, setIsToggling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reasonCode, setReasonCode] = useState(REASON_OPTIONS[0].value);
  const [justification, setJustification] = useState('');

  const isBlocked = status === 'blocked';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tag.security_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const executeToggle = async (overrideReason?: string, overrideJustification?: string | null) => {
    setIsToggling(true);
    try {
      const response = await fetch('/api/v1/tags/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hashUrl: tag.hash_url,
          securityCode: tag.security_code,
          currentStatus: status,
          reasonCode: overrideReason || reasonCode,
          justificationText: overrideJustification !== undefined ? overrideJustification : (reasonCode === 'OTHER' ? justification : null),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro na requisição');

      setStatus(data.newStatus);

      if (onStatusChange) {
        onStatusChange(data.newStatus);
      }

      toast.success(
        data.newStatus === 'blocked' 
          ? 'Tag bloqueada com sucesso.' 
          : 'Tag reativada com sucesso.'
      );
      
      setShowModal(false);
      setJustification('');
      setReasonCode(REASON_OPTIONS[0].value);

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro desconhecido');
      }
    } finally {
      setIsToggling(false);
    }
  };

  const handleActionClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cód. Segurança</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-2 py-1 cursor-pointer rounded-lg transition-colors group/copy"
              title="Clique para copiar"
            >
              <code className="text-sm font-mono font-bold text-slate-600">
                {showCode ? tag.security_code : '••••••'}
              </code>
              {copied ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <Copy size={14} className="text-slate-300 group-hover/copy:text-blue-500 transition-colors" />
              )}
            </button>
            
            <button 
              onClick={() => setShowCode(!showCode)}
              className="p-1 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
            >
              {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
          
          <button
            onClick={handleActionClick}
            disabled={isToggling}
            title={isBlocked ? "Desbloquear Tag" : "Bloquear Tag"}
            className={`group p-2 rounded-full transition-all flex items-center justify-center cursor-pointer ${
              isBlocked 
                ? 'text-red-500 hover:bg-emerald-50 hover:text-emerald-600 bg-red-50/50' 
                : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
            } disabled:opacity-50`}
          >
            {isToggling ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isBlocked ? (
              <>
                <Lock size={18} className="block group-hover:hidden" />
                <Unlock size={18} className="hidden group-hover:block" />
              </>
            ) : (
              <>
                <Unlock size={18} className="block group-hover:hidden" />
                <Lock size={18} className="hidden group-hover:block" />
              </>
            )}
          </button>

          <Link 
            href={`/${tag.hash_url}`} 
            title="Ver página pública"
            target="_blank"
            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
          >
            <ExternalLink size={18} />
          </Link>

          <Link 
            href={`/manage/${tag.hash_url}?code=${tag.security_code}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            Editar <Edit3 size={14} />
          </Link>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className={`flex items-center gap-3 mb-4 ${isBlocked ? 'text-emerald-600' : 'text-red-600'}`}>
                <div className={`p-2 rounded-full ${isBlocked ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  {isBlocked ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  {isBlocked ? 'Desbloquear Tag' : 'Bloquear Tag'}
                </h3>
              </div>
              
              <p className="text-slate-600 text-sm mb-6">
                {isBlocked 
                  ? 'Ao confirmar, o seu perfil de emergência voltará a ficar publicamente acessível para socorristas e médicos em caso de leitura desta tag.'
                  : 'Ao bloquear esta tag, o seu perfil de emergência deixará de ficar acessível caso alguém a escaneie. Por qual motivo você está bloqueando?'
                }
              </p>

              {!isBlocked && (
                <>
                  <select 
                    className="w-full p-3 border border-slate-200 bg-slate-50 text-slate-800 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all cursor-pointer"
                    value={reasonCode}
                    onChange={(e) => setReasonCode(e.target.value)}
                  >
                    {REASON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
    
                  {reasonCode === 'OTHER' && (
                    <textarea
                      placeholder="Descreva o motivo (opcional)"
                      className="w-full p-3 border border-slate-200 bg-slate-50 text-slate-800 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all resize-none h-24"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      maxLength={150}
                    />
                  )}
                </>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <button 
                  onClick={() => setShowModal(false)}
                  disabled={isToggling}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => isBlocked ? executeToggle('UNBLOCKED_BY_USER', null) : executeToggle()}
                  disabled={isToggling}
                  className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer ${
                    isBlocked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isToggling 
                    ? <Loader2 size={16} className="animate-spin" /> 
                    : isBlocked ? 'Confirmar Desbloqueio' : 'Confirmar Bloqueio'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}