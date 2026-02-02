import { LucideIcon } from 'lucide-react';
import React from 'react';

interface HealthCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export default function HealthCard({ title, content, icon, iconBgColor = "bg-slate-50", iconColor = "text-slate-500" }: HealthCardProps) {
  return (
<div className="w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:border-slate-200">
      <div className={`w-10 h-10 ${iconBgColor} ${iconColor} rounded-full flex items-center justify-center shrink-0`}>
        {React.cloneElement(icon as React.ReactElement, { size: 20 } as unknown as LucideIcon)}
      </div>

      <div className="flex flex-col text-left overflow-hidden">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          {title}
        </p>
        <span className="font-black text-slate-800 leading-tight break-word">
          {content || 'Não informado'}
        </span>
      </div>
    </div>
  );
};