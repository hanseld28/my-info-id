import { TAG_STATUS_CONFIG, TARGET_CONFIG, TARGET_TYPE_LABELS } from '@/lib/utils/constants';
import { TagActions } from './TagActions';
import { Tag } from 'lucide-react';
import { StatusType, TagBasicData } from '@/lib/types/tag';
import { useCallback, useState } from 'react';
export default function OwnerTagCard({ tag: initialTag }: { tag: TagBasicData }) {
  const [tagData, setTagData] = useState(initialTag);

  const handleStatusChange = useCallback((novoStatus: StatusType) => {
    setTagData({
      ...tagData,
      status: novoStatus
    });
  }, []);

  return (
    <div 
      key={tagData.hash_url}
      className="relative bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 ${tagData?.target_type && TARGET_CONFIG[tagData.target_type]?.color || 'text-slate-400 bg-slate-50'} rounded-3xl flex items-center justify-center shadow-inner`}>
          <Tag size={28} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 text-lg leading-tight">
            {tagData.tag_data?.full_name || 'Usuário sem nome'}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold ${tagData?.target_type && TARGET_CONFIG[tagData.target_type]?.color || 'text-slate-400 bg-slate-50'} font-mono px-1.5 py-0.5 rounded`}>
              {tagData.target_type ? TARGET_TYPE_LABELS[tagData.target_type] : 'Tipo não definido'}
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              tagData.status ? TAG_STATUS_CONFIG[tagData.status].color : ''
            }`}>
              {tagData.status ? TAG_STATUS_CONFIG[tagData.status].label : '-'}
            </span>
          </div>
        </div>
      </div>

      <TagActions
        tag={tagData}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}