import MagicLinkLogin from '@/components/MagicLinkLogin';


export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-black text-slate-800 mb-6 text-center">Entrar na Minha Conta</h1>
        <MagicLinkLogin />
      </div>
    </main>
  );
}