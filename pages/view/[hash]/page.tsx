import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ViewerProps {
  params: { hash: string };
}

// Opcional: Gera títulos dinâmicos para a página
export async function generateMetadata({ params }: ViewerProps): Promise<Metadata> {
  return { title: `Informações da Tag - ${params.hash}` };
}

export default async function ViewerPage({ params }: ViewerProps) {
  // Chamada direta ao banco no Server Component (Padrão Next.js 14+)
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/view/${params.hash}`, {
    cache: 'no-store' // Garante que as informações estejam sempre atualizadas
  });

  if (!response.ok) {
    if (response.status === 404) notFound();
    return (
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <p className="text-red-500 font-medium">Esta tag ainda não está configurada ou não existe.</p>
      </div>
    );
  }

  const data = await response.json();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl overflow-hidden mt-10">
        {/* Cabeçalho */}
        <div className="bg-blue-600 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/50">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">{data.full_name}</h1>
          <p className="text-blue-100 text-sm italic">Informações de Contacto</p>
        </div>

        {/* Corpo das Informações */}
        <div className="p-6 space-y-6">
          {/* Telefone */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Telemóvel</label>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-medium text-gray-800">{data.phone}</span>
              <a 
                href={`tel:${data.phone}`}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-transform active:scale-95 shadow-md"
              >
                📞 Ligar
              </a>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Observações */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Observações Importantes</label>
            <div className="mt-2 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <p className="text-gray-700 leading-relaxed italic">
                "{data.observations || "Nenhuma observação adicional fornecida."}"
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            Tag Protegida por Sistema NFC
          </p>
        </div>
      </div>

      {/* Botão de WhatsApp (Opcional) */}
      <a 
        href={`https://wa.me/${data.phone.replace(/\D/g, '')}`} 
        target="_blank" 
        className="mt-6 flex items-center gap-2 text-green-600 font-semibold text-sm bg-white px-6 py-3 rounded-full shadow-sm border border-green-100"
      >
        <span>💬 Contactar via WhatsApp</span>
      </a>
    </div>
  );
}