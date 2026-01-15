import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function Header() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="w-full bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Meu Info <span className="text-blue-600">ID</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link 
            href="/activate-tag" 
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
          >
            Ativar Tag
          </Link>

          {user ? (
            <LogoutButton />
          ) : (
            <Link 
              href="/login" 
              className="text-xs font-semibold bg-slate-100 text-slate-500 px-3 py-1.5 rounded uppercase tracking-wider hover:bg-slate-200"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}