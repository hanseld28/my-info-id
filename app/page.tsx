import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-700 flex flex-col items-center justify-center text-white p-6">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Informações importantes ao alcance de um toque.
        </h1>
        <p className="mt-4 text-xl text-blue-200 max-w-2xl mx-auto">
          Conecte-se e compartilhe dados importantes de forma instantânea com as Tags NFC inteligentes.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-8 max-w-5xl text-center">
        <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/50 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-3">Acesso Instantâneo</h2>
          <p className="text-blue-100">
            Apresente informações cruciais para qualquer pessoa com um simples toque no seu telemóvel.
          </p>
        </div>
        <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/50 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-3">Dados Seguros e Privados</h2>
          <p className="text-blue-100">
            Você controla o que é compartilhado. Atualize suas informações a qualquer momento e com segurança.
          </p>
        </div>
        <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/50 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-3">Para Emergências e Conexões</h2>
          <p className="text-blue-100">
            Ideal para contatos de emergência, informações médicas ou simplesmente para expandir sua rede.
          </p>
        </div>
      </section>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link href="/activate-tag" className="bg-white text-blue-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-100 transition-colors shadow-lg">
            Ativar Minha Tag Agora
        </Link>
        <Link href="/learn-more" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-colors">
            Como Funciona?
        </Link>
      </div>

      <footer className="mt-20 text-blue-300 text-sm">
        &copy; {new Date().getFullYear()} My Info ID. Todos os direitos reservados.
      </footer>
    </div>
  );
}