'use client';

import { createSupabaseComponentClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createSupabaseComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh(); 
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs font-semibold text-red-500 px-3 py-1.5 rounded uppercase tracking-wider hover:bg-red-500 hover:text-white"
    >
      Sair
    </button>
  );
}