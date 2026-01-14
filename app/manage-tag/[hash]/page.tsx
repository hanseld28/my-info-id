'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function ManagePage() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [data, setData] = useState({ name: '', phone: '', obs: '' });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/v1/tags/update', {
      method: 'PATCH',
      body: JSON.stringify({
        hash: params.hash,
        activation_code: code.toUpperCase(),
        updatedData: { name: data.name, phone: data.phone, observations: data.obs }
      }),
    });

    if (res.ok) {
      alert("Informações atualizadas!");
    } else {
      const err = await res.json();
      alert(err.error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Gerenciar Tag</h1>
          <p className="text-sm text-slate-500 italic">ID da Tag: {params.hash}</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <label className="block text-xs font-bold text-amber-700 uppercase mb-1">
              Confirmação de Segurança
            </label>
            <input
              required
              placeholder="Digite o código de 8 dígitos"
              className="w-full p-2 border border-amber-200 rounded uppercase font-mono shadow-sm"
              onChange={e => setCode(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <input
              required
              placeholder="Novo Nome"
              className="w-full p-3 border rounded-lg shadow-sm"
              onChange={e => setData({...data, name: e.target.value})}
            />
            <input
              required
              placeholder="Novo Telefone"
              className="w-full p-3 border rounded-lg shadow-sm"
              onChange={e => setData({...data, phone: e.target.value})}
            />
            <textarea
              placeholder="Novas Observações"
              className="w-full p-3 border rounded-lg h-32 shadow-sm"
              onChange={e => setData({...data, obs: e.target.value})}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 transition-all"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </main>
  );
}