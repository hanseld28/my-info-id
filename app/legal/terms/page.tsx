import LegalLayout from '@/components/legal/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout 
      title="Termos de Uso" 
      subtitle="Regras da Plataforma" 
      lastUpdated="Fevereiro 2026"
    >
      <section>
        <div>
          <h2 className="text-lg font-black text-blue-800 uppercase mb-4 tracking-tight">1. Objeto do Serviço</h2>
          <p>O <strong>Meu Info ID</strong> fornece uma plataforma de armazenamento e exibição de dados de emergência via tecnologia NFC. O serviço visa facilitar o acesso a informações vitais por socorristas em situações de urgência.</p>
        </div>

        <div className="p-6 mt-4 bg-amber-50 rounded-4xl border border-amber-100 italic">
          <h2 className="text-lg font-black text-amber-800 uppercase mb-4 tracking-tight">2. Limitação de Responsabilidade (IMPORTANTE)</h2>
          <p className="text-sm">O Meu Info ID NÃO é um dispositivo médico, plano de saúde ou serviço de emergência.</p>
          <p className="text-sm mt-2 font-bold">Não garantimos:</p>
          <ul className="list-disc ml-5 mt-2 space-y-2 text-sm">
            <li>Que o socorrista identificará ou escaneará a tag em caso de acidente.</li>
            <li>A disponibilidade contínua do sistema (dependência de rede/internet).</li>
            <li>A veracidade das informações inseridas, sendo estas de total responsabilidade do usuário.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-black text-blue-800 uppercase mt-4 mb-4 tracking-tight">3. Uso de Hardware</h2>
          <p>A durabilidade da tag física depende do manuseio correto. O extravio ou dano físico da tag que impossibilite a leitura não é responsabilidade da plataforma.</p>
        </div>
      </section>
    </LegalLayout>
  );
}