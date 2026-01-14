import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { pendingTagActivation } from '@/errors/tag-error-templates';

interface ViewerProps {
  siteUrl: string;
  params: { hash: string };
}

const getData = async () => {
  const headersMap = await headers();

  const host = headersMap.get('host');
  const protocol = 'http';
  const siteUrl = `${protocol}://${host}`;

  return {
    siteUrl,
  };
};

export const generateMetadata = async ({ params }: ViewerProps): Promise<Metadata> =>{
  const { hash } = await params;
  return { title: `Informações da Tag - ${hash}` };
}


export default async function ViewerPage({ params }: ViewerProps) {
  const { hash } = await params;
  const { siteUrl } = await getData();

  const response = await fetch(`${siteUrl}/api/v1/tags/view/${hash}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    if (response.status === 403) {
      return pendingTagActivation();
    }

    return notFound();
  }

  const [data] = await response.json();

  const rawPhone = data.phone.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl overflow-hidden mt-10">
        {/* Cabeçalho */}
        <div className="bg-blue-400 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/50">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">{data.full_name}</h1>
          <p className="text-blue-100 text-sm italic">Informações de Contato</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Telefone</label>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-medium text-gray-800">{data.phone}</span>
              <a 
                href={`tel:${rawPhone}`}
                className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-transform active:scale-95 shadow-md"
              >
                📞 Ligar
              </a>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Observações Importantes</label>
            <div className="mt-2 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <p className="text-gray-700 leading-relaxed italic">
                {data.observations ? `"${data.observations}"` : "Nenhuma observação adicional fornecida."}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            Tag Protegida por Sistema NFC
          </p>
        </div>
      </div>

      <a 
        href={`https://wa.me/${data.phone?.replace(/\D/g, '')}`} 
        target="_blank" 
        className="mt-6 flex items-center gap-2 text-green-600 font-semibold text-sm bg-white px-6 py-3 rounded-full shadow-sm border border-green-100"
      >
        <span>💬 Contatar via WhatsApp</span>
      </a>
    </div>
  );
}