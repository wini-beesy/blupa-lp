import { LegalDocumentLayout } from "../components/LegalDocumentLayout";

export function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout title="Política de Privacidade">
      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          1. Responsável pelo tratamento
        </h2>
        <p>
          Esta política descreve como são tratados os dados pessoais no âmbito do
          Blupa e dos respetivos formulários e canais digitais. O responsável
          pelo tratamento é a entidade que opera o serviço Blupa no âmbito do
          Grupo Paco, conforme indicado nos contactos oficiais do site.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          2. Dados que podemos recolher
        </h2>
        <p>
          Dependendo da sua interação, podemos tratar, entre outros: dados de
          identificação e contacto (nome, e-mail, telefone), documento de
          identificação quando exigido por lei ou pelo serviço, dados de
          utilização e comunicações com o suporte.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          3. Finalidades e bases legais
        </h2>
        <p>
          Utilizamos os dados para prestar o serviço do clube de benefícios,
          gerir a sua conta, cumprir obrigações legais, comunicar sobre o
          serviço e, quando aplicável com base no seu consentimento ou interesse
          legítimo, enviar informações comerciais nos termos da lei aplicável.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          4. Conservação
        </h2>
        <p>
          Conservamos os dados pelo tempo necessário às finalidades descritas e
          às obrigações legais, após o que podem ser anonimizados ou eliminados,
          salvo imposição legal de arquivo.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          5. Partilha com terceiros
        </h2>
        <p>
          Podemos partilhar dados com prestadores que nos auxiliam na operação
          do serviço (por exemplo alojamento ou comunicações), sempre no limite do
          necessário e com salvaguardas contratuais. Benefícios junto de parceiros
          podem exigir dados mínimos para validação da oferta, conforme informado
          em cada caso.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          6. Os seus direitos (LGPD)
        </h2>
        <p>
          Nos termos da Lei Geral de Proteção de Dados (Lei n.º 13.709/2018),
          pode solicitar confirmação de tratamento, acesso, correção, anonimização,
          eliminação, portabilidade e informações sobre partilhas e decisões
          automatizadas, entre outros direitos previstos na lei.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          7. Cookies e tecnologias semelhantes
        </h2>
        <p>
          O site pode utilizar cookies ou tecnologias equivalentes para
          funcionamento, segurança e métricas. No primeiro acesso, é apresentado
          um aviso para escolher «Apenas necessários» ou «Aceitar todos»; a sua
          preferência fica registada (incluindo cookie de primeira parte
          <span className="whitespace-nowrap"> «blupa_consent»</span>) e pode ser
          alterada ao limpar dados do site ou quando disponibilizarmos um centro
          de preferências.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          8. Alterações e contacto
        </h2>
        <p>
          Esta política pode ser atualizada; a data no topo desta página indica a
          última revisão. Para exercer direitos ou esclarecimentos sobre
          privacidade, utilize os contactos oficiais divulgados no site do Blupa /
          Grupo Paco.
        </p>
      </section>
    </LegalDocumentLayout>
  );
}
