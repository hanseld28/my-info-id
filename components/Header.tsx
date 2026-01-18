import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import Image from 'next/image';

export default async function Header() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="w-full bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        <Link href="/" className="flex items-center group transition-transform hover:scale-105">
          <Image 
            src="/logo.svg" 
            alt="Meu Info ID Logo" 
            width={100}
            height={40} 
            className="h-13 w-auto object-contain"
            priority 
          />
        </Link>

        <nav className="flex items-center gap-4">
          <Link 
            href="/activate-tag" 
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
          >
            Ativar Tag
          </Link>

          {user ? (<LogoutButton />) : (<></>)}
          
        </nav>
      </div>
    </header>
  );
}