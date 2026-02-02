import { Droplet, ChevronDown } from 'lucide-react';
import { BLOOD_TYPE_HUMAN_LIST, TARGET_TYPE_HUMAN_LIST } from '@/lib/utils/constants';

interface BloodTypeInputProps {
  targetType: string;
  value: string;
  onChange: (value: string) => void;
}

export default function BloodTypeInput({ targetType, value, onChange }: BloodTypeInputProps) {
  const isHuman = TARGET_TYPE_HUMAN_LIST.includes(targetType);
  const showManualInput = !isHuman || (value && !BLOOD_TYPE_HUMAN_LIST.includes(value)) || value === 'Outro';

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-sm font-bold text-slate-700 ml-1">Tipo Sanguíneo</label>
      
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 transition-transform group-focus-within:scale-110">
          <Droplet size={20} fill="currentColor" className="opacity-80" />
        </div>

        {isHuman && !showManualInput ? (
          <>
            <select
              value={BLOOD_TYPE_HUMAN_LIST.includes(value) ? value : (value ? 'Outro' : '')}
              onChange={(e) => {
                const val = e.target.value;
                onChange(val === 'Outro' ? '' : val);
              }}
              className="w-full p-4 pl-12 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700 appearance-none cursor-pointer transition-all"
            >
              <option value="">Não informado / Não sei</option>
              {BLOOD_TYPE_HUMAN_LIST.map(t => <option key={t} value={t}>{t}</option>)}
              <option value="Outro">Outro (especificar)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown size={18} />
            </div>
          </>
        ) : (
          <input
            type="text"
            placeholder={isHuman ? "Especifique o tipo" : "Ex: DEA 1.1, Tipo A..."}
            maxLength={15}
            value={value === 'Outro' ? '' : value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            autoFocus={value === 'Outro'}
            className="w-full p-4 pl-12 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 uppercase font-medium text-slate-700 placeholder:text-slate-300 transition-all"
          />
        )}
      </div>
    </div>
  );
}