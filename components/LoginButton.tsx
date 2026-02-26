'use client';

import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    router.push('/login');
    router.refresh(); 
  };

  return (
    <button
      onClick={handleLogin}
      className="text-xs font-semibold text-blue-500 px-3 py-1.5 rounded cursor-pointer uppercase tracking-wider hover:bg-blue-500 hover:text-white"
    >
      Entrar      
    </button>
  );
}