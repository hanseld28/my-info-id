'use client';
import { Mail, MessageCircle } from 'lucide-react';

export default function ContactChannels() {
  const whatsappCode = "H75FPNUNCH6EB1";
  const emailAddress = "suporte@meuinfoid.com.br";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto mt-8">
      <a 
        href={`https://wa.me/message/${whatsappCode}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-4xl hover:border-green-100 hover:bg-green-50/30 transition-all group"
      >
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
          <MessageCircle size={24} />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp</p>
          <p className="text-xs font-semibold text-slate-700">Falar com Suporte</p>
        </div>
      </a>

      <a 
        href={`mailto:${emailAddress}`}
        className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-4xl hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
      >
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
          <Mail size={24} />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</p>
          <p className="text-xs font-semibold text-slate-700">Envie uma mensagem</p>
        </div>
      </a>
    </div>
  );
}