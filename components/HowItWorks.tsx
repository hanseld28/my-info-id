export default function HowItWorks() {
  const steps = [
    { icon: "⚡", title: "Adquira sua Tag", desc: "Receba sua tag física NFC em formato de chaveiro com tecnologia Meu Info ID." },
    { icon: "📱", title: "Aproxime e Ative", desc: "Encoste seu celular na tag e use o código de segurança exclusivo para ativar a tag e cadastrar seus dados." },
    { icon: "📝", title: "Personalize", desc: "Insira contatos de emergência, alergias ou avisos importantes. Altere quando quiser!" },
    { icon: "🛡️", title: "Proteção Pronta", desc: "Agora, qualquer pessoa que aproximar o celular da tag verá suas informações e poderá ajudar." }
  ];

  return (
    <section id="how-it-works" className="w-full py-24">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">Como Funciona?</h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-16 text-lg opacity-90">
          A segurança de quem você ama a apenas um toque de distância. Sem aplicativos, sem baterias e sem complicações.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl hover:bg-white/15 transition-all group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{step.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-blue-50/80 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}