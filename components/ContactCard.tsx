import { EmergencyContact } from '@/lib/types/emergency-contact';
import { RelationshipDisplay } from '@/lib/utils/constants';
import { Asterisk, MessageCircleMore, Phone, Star } from 'lucide-react';

interface ContactViewProps {
  contact: EmergencyContact;
  isPrimary: boolean;
}

export default function ContactCard({ contact, isPrimary }: ContactViewProps) {
    const cleanPhone = contact.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}`;
    const telUrl = `tel:${cleanPhone}`;

    return (
      <div className="relative p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all overflow-hidden">
        <div
          className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl ${
            isPrimary ? 'bg-red-500' : 'bg-slate-300'
          }`}
        />

        <div className={`flex items-center justify-between ${isPrimary ? 'pl-2' : ''}`}>
          <div className="flex flex-col max-w-[55%]">
            <div className="flex items-center gap-1.5 mb-0.5">
              {isPrimary ? (
                <Star size={14} className="text-red-500 shrink-0" fill="currentColor" />
              ) : (
                <Asterisk size={16} className="text-slate-400 shrink-0" />
              )}
              <span className={`font-black leading-tight truncate text-slate-800 ${isPrimary ? 'text-lg' : 'text-base'}`}>
                {contact.name}
              </span>
            </div>
            <span className="text-[10px] font-black flex justify-start uppercase tracking-widest text-slate-500">
              {RelationshipDisplay[contact.relationship] || 'Contato'}
              {isPrimary && <span className="text-red-500 ml-1.5">• PRINCIPAL</span>}
            </span>
          </div>

          <div className="flex gap-2">
            <a 
              href={whatsappUrl}
              target="_blank"
              className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl transition-all active:scale-90 hover:bg-emerald-100"
            >
              <MessageCircleMore size={22} fill="currentColor" />
            </a>
            
            <a 
              href={telUrl}
              className="p-3 bg-blue-50 text-blue-600 rounded-2xl transition-all active:scale-90 hover:bg-blue-100"
            >
              <Phone size={22} fill="currentColor" />
            </a>
          </div>
        </div>
      </div>
    );
  };
