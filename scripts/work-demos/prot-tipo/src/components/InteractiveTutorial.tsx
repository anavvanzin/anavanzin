import React, { useState } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Layers,
  Scale,
  FileText,
  UserCheck,
  Database,
  HelpCircle,
  Play
} from "lucide-react";

interface InteractiveTutorialProps {
  sessionPhase: 1 | 2 | 3;
  setSessionPhase: (phase: 1 | 2 | 3) => void;
  scrollToAnchor: (id: string) => void;
}

interface Step {
  title: string;
  badge: string;
  description: string;
  highlights: string;
  targetId: string;
  actionText?: string;
  onEnter?: () => void;
}

export default function InteractiveTutorial({
  sessionPhase,
  setSessionPhase,
  scrollToAnchor
}: InteractiveTutorialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      title: "1. Seleção de Caso de Impacto",
      badge: "Início",
      description: "Comece selecionando um ato administrativo em auditoria. Use o campo de busca recente ou selecione o caso principal 'INSS — Aposentadoria Rural' (ícone de pasta jurídica). Esta versão pública usa apenas casos fictícios e pareceres predefinidos.",
      highlights: "Filtre por título, tag ou contexto no painel de seleção.",
      targetId: "case-selector-module",
      actionText: "Ir para Seleção"
    },
    {
      title: "2. Fase de Pareceres (Fase 1)",
      badge: "Tribunal - Fase 1",
      description: "Quatro personagens fictícios representam perspectivas de defesa de direitos, ciência de dados, gestão e cidadania. Seus pareceres predefinidos ilustram um debate acadêmico.",
      highlights: "Mostra a argumentação do contraditório prévio.",
      targetId: "case-selector-module",
      onEnter: () => setSessionPhase(1),
      actionText: "Mudar para Fase 1"
    },
    {
      title: "3. Avaliações Cruzadas (Fase 2)",
      badge: "Tribunal - Fase 2",
      description: "Personagens fictícios ilustram diferentes perspectivas e avaliações predefinidas. As notas são didáticas; nenhum conselho oficial ou modelo de IA está sendo consultado.",
      highlights: "Simulação de ranqueamento dos juízes.",
      targetId: "case-selector-module",
      onEnter: () => setSessionPhase(2),
      actionText: "Mudar para Fase 2"
    },
    {
      title: "4. Emissão do Acórdão Coletivo (Fase 3)",
      badge: "Tribunal - Fase 3",
      description: "A terceira fase apresenta uma síntese predefinida do caso fictício, com consensos, dissensos e propostas. O documento não tem efeito jurídico nem constitui súmula vinculante.",
      highlights: "Leitura de minutas fictícias para estudo.",
      targetId: "case-selector-module",
      onEnter: () => setSessionPhase(3),
      actionText: "Mudar para Fase 3"
    },
    {
      title: "5. Kit de Contestação Cidadã (Citizen Toolbox)",
      badge: "Empoderamento Ativo",
      description: "Por fim, o cidadão não fica desamparado. Com o Citizen Toolbox, você pode simular desvios estatais, entender contraprovas necessárias para fustigar decisões automáticas e gerar de forma interativa requerimentos com o Artigo 20 da LGPD para explorar o direito de solicitar revisão. A intervenção humana é uma proposta do exercício, não exigência textual do art. 20.",
      highlights: "Permite redigir petições de esclarecimento técnico.",
      targetId: "citizen-toolbox",
      actionText: "Ir para o Kit do Cidadão"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const step = steps[nextStep];
      if (step.onEnter) {
        step.onEnter();
      }

    } else {
      setIsOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const step = steps[prevStep];
      if (step.onEnter) {
        step.onEnter();
      }

    }
  };

  const startTutorial = () => {
    setIsOpen(true);
    setCurrentStep(0);
    const step = steps[0];
    if (step.onEnter) {
      step.onEnter();
    }

  };

  return (
    <>
      {/* Trigger floating button */}
      <button
        onClick={startTutorial}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 font-bold font-sans text-xs transition duration-300 transform hover:scale-105"
        id="btn-tutorial-trigger"
        title="Guiar pelo sistema de Direito Administrativo Digital"
      >
        <Sparkles size={14} className="animate-spin duration-1000" />
        Guia Passo a Passo
      </button>

      {/* Tutorial Overlay Card */}
      {isOpen && (
        <div role="dialog" aria-modal="true" aria-label="Guia de exploração do protótipo" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/30 rounded-2xl w-full max-w-lg shadow-2xl shadow-amber-500/10 overflow-hidden font-sans relative">

            {/* Modal glow decorator */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full pointer-events-none" />

            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <Scale size={14} />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Tutorial: Direito Administrativo Digital
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Aprenda a fustigar a opacidade de algoritmos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Fechar guia"
                className="text-slate-400 hover:text-white transition duration-150"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest font-mono rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  {steps[currentStep].badge}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Passo {currentStep + 1} de {steps.length}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                  {steps[currentStep].title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {steps[currentStep].description}
                </p>
              </div>

              {/* Informative highlighter tag */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Dica de Contestabilidade:</span>
                <p className="text-xs text-amber-500 font-mono">
                  💡 {steps[currentStep].highlights}
                </p>
              </div>

              {/* Visual mini-progress bar */}
              <div className="flex gap-1.5 pt-2">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      idx === currentStep ? "bg-amber-500" : idx < currentStep ? "bg-amber-500/50" : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Footer with action controls */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft size={14} />
                Anterior
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] text-slate-400 hover:text-white underline font-mono px-2 py-1"
                >
                  Fechar guia
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition"
                >
                  {currentStep === steps.length - 1 ? "Concluir" : "Entendi, Avançar"}
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
