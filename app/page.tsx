import FAQ from '@/components/FAQ';
import HowItWorks from '@/components/HowItWorks';
import Link from 'next/link';

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
          <Link 
            href="/activate-tag" 
            className="inline-flex justify-center items-center bg-white text-blue-700 px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-all shadow-xl hover:scale-105 active:scale-95 focus:ring-4 focus:ring-white/50 outline-none"
            aria-label="Ir para página de ativação de tag"
          >
            Ativar Minha Tag Agora
          </Link>
          <Link 
            href="#how-it-works" 
            className="inline-flex justify-center items-center bg-transparent border-2 border-white/40 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/10 hover:border-white transition-all focus:ring-4 focus:ring-white/30 outline-none"
          >
            Como Funciona?
          </Link>
        </nav>
      </section>

      <section id="beneficios" aria-label="Benefícios da Tag" className="py-20 px-6">
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

      <HowItWorks />
      
      <FAQ />

      <footer className="w-full py-12 px-6 border-t border-white/10 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-200 text-sm font-medium">
            &copy; {new Date().getFullYear()} <span className="text-white">Meu Info ID</span>. Todos os direitos reservados.
          </p>
          <p className="mt-2 text-blue-300/60 text-xs">
            Tecnologia NFC para segurança e conectividade.
          </p>
        </div>
      </footer>
    </main>
  );
}