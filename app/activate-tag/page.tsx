'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { maskPhone } from '@/lib/utils/general-utils';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function ActivatePage() {
  const router = useRouter();
  const [form, setForm] = useState({ code: '', name: '', phone: '', obs: '' });
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setForm({ ...form, phone: masked });
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch('/api/v1/tags/activate', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const activatedTag = await res.json();
      alert("Tag ativada com sucesso!");
      router.push(`/view-tag/${activatedTag.data.hash_url}`);
    } else {
      const err = await res.json();
      alert(err.error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {loading && <LoadingOverlay message="Ativando sua Tag..." />}
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Ativar Nova Tag</h1>
        <p className="text-gray-500 mb-6 text-sm">Insira o código de 8 dígitos impresso na sua embalagem.</p>
        
        <form onSubmit={handleActivate} className="space-y-4">
          <input
            required
            placeholder="Código de Ativação (Ex: A1B2C3D4)"
            className="w-full p-3 border rounded-lg font-mono uppercase"
            onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
          />
          <input
            required
            placeholder="Seu Nome Completo"
            className="w-full p-3 border rounded-lg"
            onChange={e => setForm({...form, name: e.target.value})}
          />
          <input
            required
            type="tel"
            placeholder="(99) 99999-9999"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={form.phone}
            onChange={handlePhoneChange}
          /> 
          <textarea
            placeholder="Observações importantes (médicas, avisos, etc)"
            className="w-full p-3 border rounded-lg h-32"
            onChange={e => setForm({...form, obs: e.target.value})}
          />
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Ativando...' : 'Ativar Minha Tag'}
          </button>
        </form>
      </div>
    </main>
  );
}