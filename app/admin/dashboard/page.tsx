'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [quantity, setQuantity] = useState(1);
  const [generatedTags, setGeneratedTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch('/api/v1/tags/generate', {
      method: 'POST',
      body: JSON.stringify({ quantity })
    });
    const data = await res.json();
    if (data.success) {
      setGeneratedTags([...data.tags, ...generatedTags]);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Painel Admin - Gerador de Tags</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8 flex items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantidade de Tags</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 block w-32 border rounded-md p-2"
          />
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Gerando...' : 'Gerar Novas Tags'}
        </button>
      </div>

      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hash (URL)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código de Ativação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {generatedTags.map((tag) => (
              <tr key={tag.id}>
                <td className="px-6 py-4 font-mono text-sm text-blue-600">/view/{tag.hash_url}</td>
                <td className="px-6 py-4 font-bold text-sm tracking-widest">{tag.activation_code}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${tag.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {tag.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}