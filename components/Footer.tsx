import { Instagram, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col items-center">

        <p className="text-slate-400 text-[13px] font-medium tracking-wide">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-slate-900 font-semibold">Meu Info ID</span>. 
          Todos os direitos reservados.
        </p>
        
        <div className="mt-2 flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
          </span>
          <p className="text-slate-400 text-[9px] uppercase tracking-wide">
            Tecnologia <span className="text-blue-600/80">NFC</span> para segurança e conectividade
          </p>
        </div>

        <div className="mt-6 flex items-center gap-6">
          <a href="https://instagram.com/meuinfoid" target="_blank" className="text-slate-300 hover:text-pink-500 transition-colors">
            <Instagram size={18} />
          </a>
          <a href="https://wa.me/5511999999999" target="_blank" className="text-slate-300 hover:text-green-500 transition-colors">
            <MessageCircle size={18} />
          </a>
          <a href="mailto:suporte@meuinfoid.com.br" className="text-slate-300 hover:text-blue-500 transition-colors">
            <Mail size={18} />
          </a>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <Link
            href="/legal/terms"
            className="text-slate-300 hover:underline hover:text-slate-500 text-[10px] font-medium transition-colors"
            target="_blank"
          >
            Termos de Uso
          </Link>
          <Link
            href="/legal/privacy"
            className="text-slate-300 hover:underline hover:text-slate-500 text-[10px] font-medium transition-colors"
            target="_blank"
          >
            Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}