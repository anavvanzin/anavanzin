import React from "react";
import { Scale } from "lucide-react";
import InteractiveTutorial from "./InteractiveTutorial";
import LegalGlossary from "./LegalGlossary";
import EducativeFramework from "./EducativeFramework";

interface Props {
  sessionPhase: number;
  setSessionPhase: (phase: 1 | 2 | 3) => void;
  scrollToAnchor: (id: string) => void;
}

export default function TabFundamentos({ sessionPhase, setSessionPhase, scrollToAnchor }: Props) {
  return (
    <div className="space-y-8 animate-fadeIn text-xs" id="tab-fundamentos-view">

      {/* Interactive Step-by-Step Walkthrough Guide */}
      <InteractiveTutorial
        sessionPhase={sessionPhase as 1 | 2 | 3}
        setSessionPhase={setSessionPhase}
        scrollToAnchor={scrollToAnchor}
      />

      {/* Traditional Legal Glossary (Comprehensive Law Dictionary) */}
      <LegalGlossary />

      {/* Scholastic and Academic Theories of Due Process */}
      <EducativeFramework />

      {/* Unified Democratic Tension / open government impact section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4 mb-4">
          <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
            <Scale size={20} className="text-amber-500" />
            Tensão Democrática Constitucional: Eixo de Governo Aberto
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            A subversão das premissas públicas de tecnologia pelo pseudo-dogma da velocidade econômica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-normal">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
              Eficiência Administrativa
            </h4>
            <p className="text-slate-400 leading-relaxed font-sans">
              O processamento digital pode reduzir filas e uso de papel. Sem acompanhamento, transparência e canais de contestação, também pode produzir isolamento e dificultar o exercício de garantias processuais.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
            <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest font-mono">
              Dignidade & Exclusão Digital
            </h4>
            <p className="text-slate-400 leading-relaxed font-sans">
              Portais que exigem conectividade ou equipamentos inacessíveis podem excluir pessoas de baixa renda e moradores de áreas rurais. A Lei 14.129/2021, art. 14, preserva o direito ao atendimento presencial na prestação digital de serviços públicos.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest font-mono">
              O Custo da Litigância Reversa
            </h4>
            <p className="text-slate-400 leading-relaxed font-sans">
              A automação sem salvaguardas pode ampliar contestações administrativas e judiciais, transferindo custos de triagem para outras instituições. Esta é uma hipótese de governança discutida no seminário; o protótipo não mede despesas nem demonstra um multiplicador de custos.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
