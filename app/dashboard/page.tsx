'use client';
import { Plus, CreditCard, Tag, X } from 'lucide-react';
import Link from 'next/link';
import { TagActions } from '@/components/TagActions';
import { TAG_STATUS_TYPE_MAP, TARGET_CONFIG, TARGET_TYPE_LABELS } from '@/lib/utils/constants';
import { useEffect, useState } from 'react';
import { TagBasicData } from '@/lib/types/tag';
import LoadingOverlay from '@/components/LoadingOverlay';
import BindTagModal from '@/components/BindTagModal';

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [userTags, setUserTags] = useState<TagBasicData[]>([]);

  const getTagsByLoggedOwner = async () => {
    const res = await fetch(`/api/v1/tags/logged-owner`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return [];
    }

    return res.json();
  }
  
  const refreshTags = async () => {
    setLoading(true);
    setLoadingMessage('Carregando suas tags...');

    const tags = await getTagsByLoggedOwner();

    setUserTags(tags);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingMessage('Carregando suas tags...');

      const tags = await getTagsByLoggedOwner();

      setUserTags(tags);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  

  return (
    <div className="p-2 max-w-5xl mx-auto">
      {loading && <LoadingOverlay message={loadingMessage} />}

      <header className="bg-white border-b border-slate-100 px-6 py-8">
        <h1 className="text-2xl font-black text-slate-800">Minhas Tags</h1>
        <p className="text-slate-500 text-sm">Gerencie suas proteções ativas.</p>

        <div className="flex items-center justify-start grid-cols-2 gap-4">
          <BindTagModal onSuccess={refreshTags} />
          <Link 
            href="/activate"
            className=" bg-green-600 text-white py-4 p-4 mt-4 rounded-xl font-black text-sm hover:bg-green-700 shadow-lg shadow-emerald-100 flex items-center gap-2 disabled:opacity-50 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} /> Nova Tag
          </Link>
        </div>
      </header>


      <main className="p-6 space-y-4">
        {userTags?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-4xl border border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-slate-300" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Nenhuma tag ativa ainda.</p>
            <Link 
              href="/activate"
              className="mt-4 inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest"
            >
              Ativar nova tag <Plus size={14} />
            </Link>
          </div>
        )}

        <div className="grid gap-4">
          {userTags?.map((tag) => (
            <div 
              key={tag.hash_url}
              className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
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
          ))}
        </div>
      </main>
    </div>
  );
}