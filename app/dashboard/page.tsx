'use client';
import { Plus, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TagBasicData } from '@/lib/types/tag';
import LoadingOverlay from '@/components/LoadingOverlay';
import BindTagModal from '@/components/BindTagModal';
import OwnerTagCard from '@/components/OwnerTagCard';

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
            className=" bg-green-600 text-white py-4 p-4 mt-4 rounded-xl font-black text-xs hover:bg-green-700 shadow-lg shadow-emerald-100 flex items-center gap-2 disabled:opacity-50 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} /> Nova Ativação
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
            <OwnerTagCard
              key={tag.hash_url}
              tag={tag}
            />
          ))}
        </div>
      </main>
    </div>
  );
}