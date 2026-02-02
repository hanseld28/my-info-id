import Link from 'next/link';

export const pendingTagActivation = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Tag pendente de ativação</h2>
        <p className="text-gray-600 mb-6">
          Ops! Parece que sua tag NFC que ainda não foi ativada. Clique no botão abaixo para ativá-la.
        </p>
        
        <div className="space-y-4">
          <Link href="/activate" className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Ativar Minha Tag
          </Link>
          <Link href="/contact" className="block w-full text-blue-600 border border-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Precisa de Ajuda? Contate-nos
          </Link>
        </div>
      </div>
    </div>
  );
}