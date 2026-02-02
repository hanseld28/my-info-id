import { Plus, Phone, User, Users, ChevronDown, AlertCircle, Star, ChevronUp, Trash } from 'lucide-react';
import { Contact, ContactRelationship } from '@/lib/types/emergency-contact';
import { RelationshipDisplay } from '@/lib/utils/constants';
import { maskPhone } from '@/lib/utils/general-utils';
import { useCallback, useMemo, useState } from 'react';

interface Props {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
}

export default function EmergencyContactManager({ contacts, onChange }: Props) {
  
  const [expandedIndices, setExpandedIndices] = useState<number[]>(contacts.length === 0 ? [0] : []);

  const toggleExpand = (index: number) => {
    setExpandedIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const addContact = useCallback(() => {
    const newIndex = contacts.length;
    onChange([...contacts, { name: '', phone: '', is_primary: contacts.length === 0 }]);
    setExpandedIndices(prev => [...prev, newIndex]);
  }, [contacts, onChange]);

  const removeContact = useCallback((index: number) => {
    onChange(contacts.filter((_, i) => i !== index));
  }, [contacts, onChange]);

  const updateContact = useCallback((index: number, field: keyof Contact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    onChange(newContacts);
  }, [contacts, onChange]);

  const setPrimary = useCallback((index: number) => {
    const newContacts = contacts.map((c, i) => ({
      ...c,
      is_primary: i === index
    }));
    onChange(newContacts);
  }, [contacts, onChange]);

  const addedContactsCount = useMemo(() => (
    contacts.filter(contact => (
      contact 
      && contact?.name 
      && contact?.phone 
      && contact?.relationship
    )).length
  ), [contacts]);

  const isFirstContactFilled = useMemo(() => (
    contacts.length > 0
    && contacts[0].name.trim() !== ''
    && contacts[0].phone.trim() !== ''
  ), [contacts]);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-700">Contatos de Emergência</h3>
        <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wider">
          {addedContactsCount} {addedContactsCount === 1 ? 'Adicionado' : 'Adicionados'}
        </span>
      </div>

      {(!isFirstContactFilled) && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-xs font-medium">
            É obrigatório adicionar e preencher pelo menos um contato para ativar sua tag.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {contacts.map((contact, index) => {
          const isExpanded = expandedIndices.includes(index);
          
          return (
            <div key={index} className="relative bg-white border border-slate-100 rounded-3xl overflow-hidden transition-all shadow-sm">
              
              <div 
                onClick={() => toggleExpand(index)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${contact.is_primary ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'}`}>
                    {contact.is_primary ? <Star size={18} fill="currentColor" /> : <User size={18} />}
                  </div>
                  
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-bold text-slate-700 truncate text-sm">
                      {contact.name || 'Novo Contato'}
                    </span>
                    {!isExpanded && (
                      <span className="text-xs text-slate-400 truncate">
                        {contact.phone || 'Sem telefone'} • {RelationshipDisplay[contact.relationship as ContactRelationship] || 'Sem parentesco'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleExpand(index);
                    }}
                    className="p-2 text-slate-400 cursor-pointer hover:bg-slate-100 rounded-full transition-colors"
                  > 
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 pt-2 border-t border-slate-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setPrimary(index)}
                      className={`text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5
                        ${contact.is_primary 
                          ? 'bg-amber-50 border-amber-200 text-amber-600' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-amber-200 hover:text-amber-500'}`}
                    >
                      <Star size={12} fill={contact.is_primary ? "currentColor" : "none"} />
                      {contact.is_primary ? 'CONTATO PRINCIPAL' : 'DEFINIR COMO PRINCIPAL'}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-1">
                      Nome Completo                    
                      <span className="text-red-500"> *</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <User size={18} />
                      </div>
                      <input 
                        required
                        placeholder="Nome do contato" 
                        className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 transition-all"
                        value={contact.name}
                        onChange={e => updateContact(index, 'name', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-1">
                      Telefone                    
                      <span className="text-red-500"> *</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Phone size={18} />
                      </div>
                      <input 
                        required
                        placeholder="(00) 00000-0000" 
                        className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 transition-all"
                        value={contact.phone}
                        onChange={e => updateContact(index, 'phone', maskPhone(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-1">Relação</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Users size={18} />
                      </div>
                      <select 
                        className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 appearance-none transition-all"
                        value={contact.relationship}
                        onChange={e => updateContact(index, 'relationship', e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {Object.entries(RelationshipDisplay).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-center">
                    <button 
                      type="button"
                      onClick={() => removeContact(index)}
                      className="text-xs font-bold text-red-400 hover:text-red-600 cursor-pointer flex items-center gap-1 p-2 transition-colors"
                    >
                      <Trash size={14} /> Remover este contato
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button 
        onClick={addContact}
        type="button"
        className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 cursor-pointer rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50/50 transition-all"
      >
        <Plus size={18} /> ADICIONAR NOVO CONTATO
      </button>
    </div>
  );
}