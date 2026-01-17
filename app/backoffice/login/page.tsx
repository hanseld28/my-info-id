'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseComponentClient } from '@/lib/supabase/client';

export default function BackofficeLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseComponentClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Erro no login: " + error.message);
    } else {
      router.push('/backoffice/panel');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Acesso Backoffice</h1>
        <input 
          type="email" placeholder="E-mail" 
          className="w-full p-3 border rounded mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Senha" 
          className="w-full p-3 border rounded mb-6 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setPassword(e.target.value)}
        />
        <button disabled={loading} className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-900 transition-all">
          {loading ? 'Autenticando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}