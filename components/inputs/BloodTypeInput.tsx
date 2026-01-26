import { BLOOD_TYPE_HUMAN_LIST, TARGET_TYPE_HUMAN_LIST } from '@/lib/utils/constants';

interface BloodTypeInputProps {
  targetType: string;
  value: string;
  onChange: (value: string) => void;
}

export default function BloodTypeInput({ targetType, value, onChange }: BloodTypeInputProps) {
  const isHuman = TARGET_TYPE_HUMAN_LIST.includes(targetType);
  
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-700">Tipo Sanguíneo</label>
      
      {isHuman ? (
        <select
          value={BLOOD_TYPE_HUMAN_LIST.includes(value) ? value : (value ? 'Outro' : '')}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === 'Outro' ? '' : val);
          }}
          className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Não informado / Não sei</option>
          {BLOOD_TYPE_HUMAN_LIST.map(t => <option key={t} value={t}>{t}</option>)}
          <option value="Outro">Outro (especificar)</option>
        </select>
      ) : null}

      {(!isHuman || (value && !BLOOD_TYPE_HUMAN_LIST.includes(value))) && (
        <input
          type="text"
          placeholder={isHuman ? "Especifique o tipo" : "Ex: DEA 1.1, Tipo A..."}
          maxLength={15}
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 uppercase transition-all"
        />
      )}
    </div>
  );
};