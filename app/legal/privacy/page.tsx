import LegalLayout from '@/components/legal/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout 
      title="Privacidade" 
      subtitle="Transparência LGPD" 
      lastUpdated="Fevereiro 2026"
    >
      <section>
        <div>
          <h2 className="text-lg font-black text-blue-800 uppercase mb-4 tracking-tight">1. Coleta de Dados Sensíveis</h2>
          <p>De acordo com o Art. 5º, II da LGPD, o Meu Info ID processa dados de saúde (tipo sanguíneo, alergias, condições médicas). Ao preencher seu perfil, você fornece <strong>consentimento explícito</strong> para que esses dados sejam exibidos publicamente a qualquer pessoa que realize a leitura física da sua tag.</p>
        </div>

        <div>
          <h2 className="text-lg font-black text-blue-800 uppercase mt-4 mb-4 tracking-tight">2. Finalidade</h2>
          <p>Os dados são coletados exclusivamente para fins de <strong>proteção da vida</strong> e auxílio em primeiros socorros. Não compartilhamos seus dados médicos com seguradoras ou terceiros para fins comerciais.</p>
        </div>

        <div>
          <h2 className="text-lg font-black text-blue-800 uppercase mt-4 mb-4 tracking-tight">3. Seus Direitos</h2>
          <p>Você pode, a qualquer momento:</p>
          <ul className="list-disc ml-5 mt-2 space-y-2">
            <li>Alterar ou excluir seus dados médicos através da dashboard.</li>
            <li>Revogar o acesso à tag, tornando o link de visualização inativo.</li>
            <li>Solicitar a exclusão definitiva da sua conta e todos os registros associados.</li>
          </ul>
        </div>
      </section>
    </LegalLayout>
  );
}