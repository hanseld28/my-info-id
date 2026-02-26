'use client'
import { useState } from 'react';
import { Eye, EyeOff, Edit3, ExternalLink, Check, Copy } from 'lucide-react';
import Link from 'next/link';

export function TagActions({ tag }: { tag: { hash_url: string; security_code: string } }) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tag.security_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cód. Segurança</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-lg transition-colors group/copy"
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
            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
          >
            {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
        <Link 
          href={`/${tag.hash_url}`} 
          title="Ver página pública"
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
  );
}