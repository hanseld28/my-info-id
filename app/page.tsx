import FAQ from '@/components/FAQ';
import HowItWorks from '@/components/HowItWorks';
import Link from 'next/link';

const isProduction = process.env.NODE_ENV === 'production';

const SectionDivider = ({ flip }: { flip?: boolean }) => (
  <div className={`w-full overflow-hidden leading-0 ${flip ? 'rotate-180' : ''}`}>
    <svg className="relative block w-full h-15" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path 
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
        fill="#ffffff"
      />
    </svg>
  </div>
);

const NFCDivider = () => (
  <div className="relative w-full overflow-hidden bg-transparent h-25 -mb-px">
    <svg 
      className="absolute bottom-0 w-full h-full" 
      viewBox="0 0 1200 120" 
      preserveAspectRatio="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M0,120 C300,20 900,20 1200,120 Z" 
        fill="white" 
        fillOpacity="0.1"
      />
      <path 
        d="M0,120 C300,50 900,50 1200,120 Z" 
        fill="white" 
        fillOpacity="0.2"
      />
      <path 
        d="M0,120 C300,80 900,80 1200,120 Z" 
        fill="#f8fafc" 
      />
    </svg>
    
    {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-lg border-4 border-blue-50 text-blue-600 z-10">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12a10 10 0 0 1 10-10" opacity="0.3" />
        <path d="M7 12a5 5 0 0 1 5-5" opacity="0.6" />
        <path d="M12 12h.01" />
      </svg>
    </div> */}
  </div>
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-400 to-indigo-700 text-white selection:bg-white selection:text-blue-700">
      
      <section id="hero" className="flex flex-col items-center justify-center pt-10 pb-16 px-6 text-center">
        <header className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Informações importantes ao alcance de um toque.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Conecte-se e compartilhe dados importantes de forma instantânea com as Tags NFC inteligentes da <strong className="text-white">Meu Info ID</strong>.
          </p>
        </header>

        <nav aria-label="Ações principais" className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* <Link 
            href="/activate" 
            className="inline-flex justify-center items-center bg-white text-blue-700 px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-all shadow-xl hover:scale-105 active:scale-95 focus:ring-4 focus:ring-white/50 outline-none"
            aria-label="Ir para página de ativação de tag"
          >
            Ativar Minha Tag Agora
          </Link> */}
          <div className="relative inline-block">
            {isProduction && (
              <span className="absolute -top-3 -right-2 z-10 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-xl shadow-lg border-2 border-white uppercase tracking-tighter animate-bounce">
                Em breve
              </span>
            )}

            <Link 
              href={isProduction ? '#' : '/activate'} 
              className={`
                inline-flex justify-center items-center bg-white text-blue-700 px-10 py-4 rounded-full text-lg font-bold shadow-xl transition-all outline-none
                ${isProduction
                  ? 'opacity-80 cursor-not-allowed grayscale-[0.5]' 
                  : 'hover:bg-blue-50 hover:scale-105 active:scale-95 focus:ring-4 focus:ring-white/50'
                }
              `}
              aria-label="Ativação em breve"
            >
              Ativar Minha Tag Agora
            </Link>
          </div>
          <Link 
            href="#how-it-works" 
            className="inline-flex justify-center items-center bg-transparent border-2 border-white/40 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/10 hover:border-white transition-all focus:ring-4 focus:ring-white/30 outline-none"
          >
            Como Funciona?
          </Link>
        </nav>
      </section>

      <section id="beneficios" aria-label="Benefícios da Tag" className="py-10 px-6">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <article className="group bg-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span aria-hidden="true" className="text-3xl">⚡</span>
              Acesso Instantâneo
            </h2>
            <p className="text-blue-100 leading-relaxed">
              Apresente informações cruciais para qualquer pessoa com um simples toque no seu telemóvel, sem necessidade de apps.
            </p>
          </article>

          <article className="group bg-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span aria-hidden="true" className="text-3xl">🛡️</span>
              Dados Seguros
            </h2>
            <p className="text-blue-100 leading-relaxed">
              Você controla o que é compartilhado. Atualize suas informações a qualquer momento através do código de segurança único.
            </p>
          </article>

          <article className="group bg-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span aria-hidden="true" className="text-3xl">🏥</span>
              Uso em Emergências
            </h2>
            <p className="text-blue-100 leading-relaxed">
              Ideal para crianças, pets e idosos. Forneça contatos de emergência e avisos médicos para socorristas em segundos.
            </p>
          </article>
        </div>
      </section>
      
      <SectionDivider />

      <HowItWorks />
      
      <NFCDivider />

      <FAQ />
    </main>
  );
}