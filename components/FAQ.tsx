export default function FAQ() {
  const faqs = [
    {
      question: "Preciso de bateria ou carregar a Tag?",
      answer: "Não. A tecnologia NFC funciona por indução, sendo alimentada pelo próprio telemóvel que faz a leitura. É uma solução passiva que dura anos."
    },
    {
      question: "Funciona em qualquer telemóvel?",
      answer: "Funciona em todos os iPhones (modelo 7 ou superior) e na grande maioria dos dispositivos Android modernos que possuem NFC."
    },
    {
      question: "É seguro? Alguém pode roubar os meus dados?",
      answer: "A Tag apenas armazena um link encriptado. Os dados pessoais ficam seguros no nosso servidor e só podem ser alterados por quem possui o código de segurança de 8 dígitos."
    },
    {
      question: "Preciso instalar alguma aplicação (App)?",
      answer: "Não! Esse é o grande diferencial. Basta aproximar o celular e a página com as informações abre-se instantaneamente no navegador padrão do dispositivo."
    },
    {
      question: "Posso alterar as informações depois de ativar?",
      answer: "Sim, pode alterar o nome, telefone e observações as vezes que quiser através do portal de gestão, sem qualquer custo adicional."
    }
  ];

  return (
    <section className="w-full py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">Dúvidas Frequentes</h2>
          <p className="text-blue-100 text-lg opacity-90">Tudo o que precisa de saber sobre o Meu Info ID.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm open:bg-white/10 transition-all overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-white">
                {faq.question}
                <span className="text-blue-300 group-open:rotate-180 transition-transform font-bold">
                  ↓
                </span>
              </summary>
              <div className="p-6 pt-0 text-blue-50/90 leading-relaxed bg-black/10">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}