import { Link } from "react-router-dom";
import { LegalDocumentLayout } from "../components/LegalDocumentLayout";

export function TermsOfUsePage() {
  return (
    <LegalDocumentLayout title="Termos de uso">
      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          1. Aceitação
        </h2>
        <p>
          Ao aceder ou utilizar os serviços do Blupa e os respetivos canais
          digitais, declara que leu e compreende estes Termos de uso. Se não
          concordar, não deve utilizar o serviço.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          2. Serviço
        </h2>
        <p>
          O Blupa é um clube de benefícios que disponibiliza vantagens,
          descontos e ofertas junto de parceiros. As condições específicas de
          cada benefício (validade, elegibilidade, limitações) prevalecem quando
          indicadas na própria oferta ou na comunicação da marca parceira.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          3. Conta e dados
        </h2>
        <p>
          Compromete-se a fornecer informações verdadeiras e a manter a sua
          conta segura. O tratamento de dados pessoais está descrito na{" "}
          <Link
            to="/politica-de-privacidade"
            className="font-semibold text-[#1D3B6E] underline underline-offset-2"
          >
            Política de Privacidade
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          4. Conduta e uso aceitável
        </h2>
        <p>
          É proibido utilizar o serviço para fins ilícitos, para fraudar
          benefícios ou para interferir no funcionamento dos sistemas. Reservamo-nos
          o direito de suspender ou encerrar o acesso em caso de violação destes
          termos ou da lei aplicável.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          5. Alterações
        </h2>
        <p>
          Podemos atualizar estes Termos de uso. A data da última revisão consta
          no topo desta página. O uso continuado após alterações constitui
          aceitação dos novos termos, salvo disposição legal em contrário.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-lg font-bold text-[#1A141F]">
          6. Contacto
        </h2>
        <p>
          Para questões sobre estes termos, utilize os contactos indicados no
          site ou na área de apoio ao cliente do Grupo Paco / Blupa.
        </p>
      </section>
    </LegalDocumentLayout>
  );
}
