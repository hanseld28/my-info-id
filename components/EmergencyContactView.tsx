"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { EmergencyContact } from '@/lib/types/emergency-contact';
import ContactCard from './ContactCard';

interface EmergencyContactViewProps {
  contacts: EmergencyContact[]; 
}

export default function EmergencyContactView({ contacts }: EmergencyContactViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!contacts || contacts.length === 0) return null;

  const sortedContacts = [...contacts].sort((a, b) => 
    (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
  );

  const primaryContact = sortedContacts[0];
  const otherContacts = sortedContacts.slice(1);


  return (
    <div className="space-y-3 mt-6 mb-4">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
        Contatos de Emergência
      </h3>

      <ContactCard contact={primaryContact} isPrimary={true} />

      {otherContacts.length > 0 && (
        <div className="space-y-3">
          {isExpanded && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {otherContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} isPrimary={false} />
              ))}
            </div>
          )}

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 flex items-center justify-center cursor-pointer gap-2 text-xs font-black text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-tighter"
          >
            {isExpanded ? (
              <>Ver menos <ChevronUp size={14} /></>
            ) : (
              <>Ver mais {otherContacts.length} {otherContacts.length === 1 ? 'contato' : 'contatos'} <ChevronDown size={14} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}