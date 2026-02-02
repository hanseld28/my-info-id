import React from 'react';

interface HealthCardInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
  iconColor: string;
}

export default function HealthCardInput({ label, placeholder, value, onChange, icon, iconColor }: HealthCardInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
      
      <div className="relative group">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${iconColor} transition-transform group-focus-within:scale-110`}>
          {React.cloneElement(icon as React.ReactElement, { size: 20 } as unknown as React.ElementType)}
        </div>

        <input
          className="w-full p-4 pl-12 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700 placeholder:text-slate-300 transition-all"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};