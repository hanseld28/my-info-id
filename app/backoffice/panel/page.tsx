'use client';
import { useState, useEffect } from 'react';
import LoadingOverlay from '@/components/LoadingOverlay';
import { formatDateTime } from '@/lib/utils/date-utils';
import Link from 'next/link';
import TagQRCode from '@/components/TagQRCode';
import { TAG_STATUS_TYPE_MAP, TARGET_CONFIG, TARGET_TYPE_LABELS } from '@/lib/utils/constants';
import { Tag } from '@/lib/types/tag';
import { Cpu } from 'lucide-react';
import { getBaseUrl } from '@/lib/utils/get-url';

export default function BackofficePanelPage() {
  const [quantity, setQuantity] = useState(1);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    fetchTags(filter);
  }, [filter]);

  const fetchTags = async (params: string) => {
    setLoading(true);
    setLoadingMessage('Buscando tags...');
    try {
      const res = await fetch(`/api/v1/tags/list?filter=${params}`);
      const data = await res.json();
      if (!data.error) setAllTags(data);
    } finally {
      setLoading(false);
    }
  };

  const generateNfcUrl = (scanToken: string) => {
    const baseUrl = getBaseUrl();   
    return `${baseUrl}/s/${scanToken}`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingMessage('Gerando novas tags e códigos...');
    try {
      const res = await fetch('/api/v1/tags/generate', {
        method: 'POST',
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      if (data.success) {
        fetchTags(filter);
      }
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "URL_Hash", "Codigo_Ativacao", "Status", "Data_Criacao\n"];
    const rows = allTags.map(tag => [
      tag.id,
    `${getBaseUrl()}/${tag.hash_url}`,
      tag.security_code,
      tag.status ? TAG_STATUS_TYPE_MAP[tag.status] : '-',
      `${formatDateTime(tag.created_at).split(', ')[0]} ${formatDateTime(tag.created_at).split(', ')[1]}`
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tags_nfc_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {loading && <LoadingOverlay message={loadingMessage} />}

      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Painel Admin</h1>
          <p className="text-slate-500">Gestão de produção</p>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={allTags.length === 0}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm font-medium"
        >
          📥 Exportar Planilha (.csv)
        </button>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex items-end gap-4">
        <div className="flex-1 max-w-50">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Qtd. para Produção</label>
          <input 
            type="number" 
            min="1"
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button 
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          Gerar Tags
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {['all', 'pending', 'active'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Ativadas'}
            </button>
          ))}
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {allTags.length} Itens encontrados
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo de Tag</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acesso Público (URL)</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Código de Segurança</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {allTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium ${tag.target_type && TARGET_CONFIG[tag.target_type]?.color || 'bg-slate-100 text-slate-600'} px-2 py-1 rounded-full`}>
                      {tag.target_type && TARGET_TYPE_LABELS[tag.target_type] || 'Não definido'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/${tag.hash_url}`} 
                      target="_blank"
                      className="text-sm font-mono text-blue-600 hover:text-blue-800"
                    >
                      /{tag.hash_url}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700 tracking-widest uppercase">
                    {tag.security_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700 font-medium">
                      {formatDateTime(tag.created_at).split(', ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {formatDateTime(tag.created_at).split(', ')[1]}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 text-[10px] font-black rounded border ${
                      tag.status === 'pending' 
                      ? 'bg-amber-50 text-amber-600 border-amber-200' 
                      : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}>
                      {tag.status ? TAG_STATUS_TYPE_MAP[tag.status] : '-'}
                    </span>
                  </td>
                  <td className="flex items-center grid-cols-2 gap-1 px-6 py-4 text-right">
                    <TagQRCode 
                      hash={tag.hash_url} 
                      id={tag.id} 
                    />
                    <button 
                      onClick={() => navigator.clipboard.writeText(generateNfcUrl(tag.scan_token))}
                      className="flex items-center text-xs cursor-pointer text-slate-500 bg-slate-100 p-2 rounded-full shadow-sm hover:bg-blue-100 hover:text-blue-500 transition-colors"
                      title='Copiar Link de Gravação (NFC)'
                    >
                      <Cpu size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}