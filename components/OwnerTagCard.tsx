import { TAG_STATUS_TYPE_MAP, TARGET_CONFIG, TARGET_TYPE_LABELS } from '@/lib/utils/constants';
import { TagActions } from './TagActions';
import { Tag } from 'lucide-react';
import { TagBasicData } from '@/lib/types/tag';
export default function OwnerTagCard({ tag }: { tag: TagBasicData }) {
  return (
    <div 
      key={tag.hash_url}
      className="relative bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 ${tag?.target_type && TARGET_CONFIG[tag.target_type]?.color || 'text-slate-400 bg-slate-50'} rounded-3xl flex items-center justify-center shadow-inner`}>
          <Tag size={28} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 text-lg leading-tight">
            {tag.tag_data?.full_name || 'Usuário sem nome'}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold ${tag?.target_type && TARGET_CONFIG[tag.target_type]?.color || 'text-slate-400 bg-slate-50'} font-mono px-1.5 py-0.5 rounded`}>
              {tag.target_type ? TARGET_TYPE_LABELS[tag.target_type] : 'Tipo não definido'}
            </span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              tag.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {tag.status ? TAG_STATUS_TYPE_MAP[tag.status] : '-'}
            </span>
          </div>
        </div>
      </div>

      <TagActions tag={tag} />
    </div>
  );
}