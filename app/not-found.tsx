import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Página Não Encontrada</h2>
        <p className="text-gray-600 mb-6">
          Ops! Parece que você encontrou um link quebrado ou uma tag NFC que ainda não foi ativada.
        </p>
        
        <div className="space-y-4">
          <Link href="/activate" className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Ativar Minha Tag
          </Link>
          <Link href="/" className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              Voltar para o Início
          </Link>
          {/* <Link href="/contact" className="block w-full text-blue-600 border border-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Precisa de Ajuda? Contate-nos
          </Link> */}
        </div>
      </div>
    </div>
  );
}