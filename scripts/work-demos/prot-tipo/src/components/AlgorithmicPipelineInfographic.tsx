import React, { useState, useEffect } from "react";
import {
  Database,
  Shuffle,
  EyeOff,
  UserCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Fingerprint,
  Cpu,
  Shield,
  Search,
  Scale,
  Play,
  Square,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CaseAnalysis } from "../types";
import ExplainableTerm from "./ExplainableTerm";

interface PipelineStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  colorClass: string;
  bgColorClass: string;
  borderColorClass: string;
}

interface AlgorithmicPipelineInfographicProps {
  activeCase: CaseAnalysis;
}

export default function AlgorithmicPipelineInfographic({ activeCase }: AlgorithmicPipelineInfographicProps) {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Self-contained Web Audio API synthesize engine for interactive cues
  const playSound = (type: "click" | "success" | "alert") => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "alert") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  // Didactic constants animate fictional decision flows; they are not measured data.
  const getIntakeData = () => {
    switch (activeCase.id) {
      case "inss_rural":
        return {
          source: "Bancos do Gov Federal (CNIS, CadÚnico)",
          criteria: "Cruzamento cego de cadastros agrários estáticos vs. autodeclarações",
          flowDetail: "Falta de vistoria agrícola ou entrevista de campo.",
          vulnerability: "Agricultores e trabalhadoras informais sem sinal."
        };
      case "reconhecimento_facial":
        return {
          source: "Câmeras Urbanas de Videomonitoramento SSP",
          criteria: "Extração de vetores biométricos faciais de pedestres",
          flowDetail: "Resolução precária sob iluminação pública noturna.",
          vulnerability: "Pessoas negras ou pardas sub-representadas na base."
        };
      case "bolsa_familia":
        return {
          source: "Cadastro Único / Bases da Receita Federal",
          criteria: "Varredura automática de CPFs vinculados no mesmo logradouro",
          flowDetail: "Suposição automática de renda unificada em agregados independentes.",
          vulnerability: "Mães solo em moradias compartilhadas periféricas."
        };
      case "auxilio_negado":
        return {
          source: "Histórico antigo do FGTS / Caged e CNIS",
          criteria: "Registro sem baixa ou com CNPJ inativo há anos",
          flowDetail: "Suposição cega de emprego vigente ativo.",
          vulnerability: "Trabalhadores informais ou desempregados vulneráveis."
        };
      case "iptu_triplicado":
        return {
          source: "Cadastro imobiliário e cadastro de MEI do cenário",
          criteria: "Inferência de uso comercial pela existência de MEI no endereço",
          flowDetail: "Reclassificação sem verificação individualizada do uso do imóvel.",
          vulnerability: "Moradores que exercem atividade virtual em casa."
        };
      case "pente_fino_bpc":
        return {
          source: "eSocial e Cadastro Único do cenário",
          criteria: "Inferência de renda familiar compartilhada pela proximidade territorial",
          flowDetail: "Desconsideração de moradias e economias independentes.",
          vulnerability: "Pessoas com deficiência em moradias compartilhadas."
        };
      default:
        return {
          source: "Bases Governamentais e Cadastros",
          criteria: "Identificação automatizada e consultas federadas",
          flowDetail: "Cruzamento sem limpeza prévia de homônimos ou CPFs.",
          vulnerability: "Cidadãos comuns afetados por falhas de integração."
        };
    }
  };

  const intake = getIntakeData();

  const steps: PipelineStep[] = [
    {
      id: 1,
      title: "Ingestão de Dados",
      subtitle: "Fontes Indiretas",
      icon: <Database size={16} />,
      colorClass: "text-blue-400",
      bgColorClass: "bg-blue-500/10",
      borderColorClass: "border-blue-500/30"
    },
    {
      id: 2,
      title: "Processamento Opaco",
      subtitle: "Cruzamento Frio de Dados",
      icon: <Cpu size={16} />,
      colorClass: "text-rose-400",
      bgColorClass: "bg-rose-500/10",
      borderColorClass: "border-rose-500/30"
    },
    {
      id: 3,
      title: "Decisão Estatal Automatizada",
      subtitle: "Indeferimento Direto",
      icon: <EyeOff size={16} />,
      colorClass: "text-amber-400",
      bgColorClass: "bg-amber-500/10",
      borderColorClass: "border-amber-500/30"
    },
    {
      id: 4,
      title: "Conselho Interventor",
      subtitle: "Contraditório Ativo",
      icon: <Scale size={16} />,
      colorClass: "text-emerald-400",
      bgColorClass: "bg-emerald-500/10",
      borderColorClass: "border-emerald-500/30"
    }
  ];

  const getLogsForStep = (stepId: number) => {
    const time = new Date().toLocaleTimeString("pt-BR", { hour12: false });
    switch (stepId) {
      case 1:
        return [
          `[${time}] [INGESTÃO] Ingestão unilateral iniciada: ${intake.source}`,
          `[${time}] [INFRA_INFO] Coleta de CPFs federados sem higienização cadastral prévia.`
        ];
      case 2:
        return [
          `[${time}] [PROCESSAMENTO] Cruzamento frio de bases compatibilizadas pelo robô...`,
          `[${time}] [WARNING] Viés de Proxy ativo: ${intake.criteria}`
        ];
      case 3:
        return [
          `[${time}] [CRÍTICO] Indeferimento automático decretado via inteligência cadastral.`,
          `[${time}] [BLOCK] Exclusão sem contraditório prévio. Vulnerabilidade: ${intake.vulnerability}`
        ];
      case 4:
        return [
          `[${time}] [INTERVENÇÃO FICTÍCIA] Proposta acadêmica de esclarecimentos, revisão e contraditório.`,
          `[${time}] [SUCCESS] Conclusão fictícia: discutir revisão e garantias procedimentais.`
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSimulating) {
      playSound("success");
      setSimLogs([
        `[${new Date().toLocaleTimeString("pt-BR", { hour12: false })}] [SIMULAÇÃO LOCAL] Iniciando animação de um fluxo fictício...`,
        `[${new Date().toLocaleTimeString("pt-BR", { hour12: false })}] [CASO EM PAUTA] #${String(activeCase.id).toUpperCase()}`
      ]);
      setSelectedStep(1);

      let current = 1;
      const initialLogs = getLogsForStep(1);
      setSimLogs(prev => [...prev, ...initialLogs]);

      interval = setInterval(() => {
        current = current + 1;
        if (current <= 4) {
          setSelectedStep(current);
          if (current === 4) {
            playSound("success");
          } else {
            playSound("click");
          }
          const stepLogs = getLogsForStep(current);
          setSimLogs(prev => [...prev, ...stepLogs]);
        } else {
          setIsSimulating(false);
          if (interval) clearInterval(interval);
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, activeCase.id]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6" id="digital-decision-pipeline">

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-teal-400 flex items-center gap-1">
            <Layers size={11} />
            Fluxo fictício · animação local
          </span>
          <h3 className="text-sm font-bold text-white font-sans mt-0.5">
            Infográfico da Tomada de Decisão Algorítmica
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1">
            Explore um fluxo hipotético de decisão e as salvaguardas de contestação propostas pelo exercício.
          </p>
        </div>

        {/* Live Active Case Info Indicator & Simulation Control */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
            <span className="text-[10px] font-mono whitespace-nowrap text-slate-300">
              Foco Ativo: {activeCase.tag}
            </span>
          </div>

          <button
            onClick={() => {
              if (isSimulating) {
                setIsSimulating(false);
                playSound("alert");
              } else {
                setIsSimulating(true);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono border flex items-center justify-center gap-1.5 transition-all duration-300 ${
              isSimulating
                ? "bg-rose-950/40 hover:bg-rose-950/60 border-rose-500/35 text-rose-400"
                : "bg-emerald-950/40 hover:bg-emerald-950/60 border-emerald-500/35 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            }`}
            title="Iniciar animação do cenário fictício"
          >
            {isSimulating ? (
              <>
                <Square size={11} className="fill-rose-400 animate-pulse text-rose-400" />
                Interromper
              </>
            ) : (
              <>
                <Play size={11} className="fill-emerald-400 text-emerald-400" />
                Simular Rito
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Visual Flow Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step) => {
          const isSelected = selectedStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setSelectedStep(step.id)}
              className={`text-left p-3.5 rounded-xl border transition-all relative ${
                isSelected
                  ? `bg-slate-950 ${step.borderColorClass} ${step.colorClass} ring-1 ring-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]`
                  : "bg-slate-950/40 border-slate-850 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-1.5 rounded-lg ${step.bgColorClass} ${step.colorClass}`}>
                  {step.icon}
                </span>
                <span className="font-mono text-[9px] font-bold text-slate-500">
                  Etapa 0{step.id}
                </span>
              </div>
              <h4 className="text-[11.5px] font-bold text-white leading-snug font-sans">
                {step.title}
              </h4>
              <p className="text-[10px] text-slate-450 truncate mt-0.5 font-sans">
                {step.subtitle}
              </p>

              {/* Connected Arrow Indicators */}
              {step.id < 4 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-800">
                  <ArrowRight size={14} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Simulation Live Console Terminal */}
      {(isSimulating || simLogs.length > 0) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-slate-950 rounded-xl border border-slate-800/80 p-4 space-y-3 overflow-hidden shadow-inner font-sans"
        >
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-900 pb-2">
            <span className="flex items-center gap-1.5">
              <Terminal size={12} className="text-emerald-400 animate-pulse" />
              Console do Rito Automatizado (Simulação Sônica)
            </span>
            <span className="text-[9.5px] text-emerald-400 animate-pulse font-mono tracking-normal font-bold">
              ● ATIVO
            </span>
          </div>
          <div className="font-mono text-[10.5px] text-slate-300 space-y-2 max-h-40 overflow-y-auto scrollbar-thin select-all">
            {simLogs.map((log, index) => (
              <div key={index} className="leading-relaxed whitespace-pre-wrap flex items-start gap-1 p-0.5">
                <span className="text-slate-600 shrink-0 select-none">&gt;&gt;</span>
                <span className={
                  log.includes("[SUCCESS]") || log.includes("[INTERVENÇÃO]")
                    ? "text-emerald-400 font-bold"
                    : log.includes("[CRÍTICO]") || log.includes("[BLOCK]")
                      ? "text-rose-400"
                      : log.includes("[WARNING]")
                        ? "text-amber-400"
                        : "text-slate-350"
                }>
                  {log}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-1.5 text-[9px] font-mono text-slate-500 border-t border-slate-900">
            <span>Auditando ritos governamentais e defendendo direitos fundamentais.</span>
            <button
              onClick={() => {
                setSimLogs([]);
                setIsSimulating(false);
              }}
              className="text-slate-400 hover:text-white transition uppercase hover:underline text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
            >
              Limpar Logs
            </button>
          </div>
        </motion.div>
      )}

      {/* Active Phase Deep Dive Detail (Interactive Content Panel) */}
      <div className="bg-slate-950 rounded-xl p-5 border border-slate-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 blur-3xl rounded-full" />

        <AnimatePresence mode="wait">
          {selectedStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 text-xs font-sans"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono rounded">
                  Ingestão Unilateral de Dados
                </span>
                <span className="text-slate-500 text-[10px] font-mono">• Coleta Burocrática</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-250 font-sans">Mecanismo de Arrecadação:</h5>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Neste cenário fictício, o sistema cruza registros cadastrais sem mediação humana na triagem preliminar. O exercício discute os riscos dessa escolha para a identificação e a qualidade dos dados.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg space-y-2">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 block">Informação do Caso Ativo:</span>
                  <div className="space-y-1 text-[11px]">
                    <p className="text-slate-350">
                      <strong>Base de Origem:</strong> {intake.source}
                    </p>
                    <p className="text-slate-350">
                      <strong>Processo de Coleta:</strong> Correlacionamentos sem conferência fática individualizada.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Pipeline simulation mockup */}
              <div className="border border-slate-900 bg-slate-950 rounded-lg p-3 text-center space-y-2">
                <div className="flex items-center justify-around gap-2 text-slate-600 font-mono text-[9px]">
                  <span className="flex items-center gap-1 text-blue-400"><Database size={10} /> CNIS</span>
                  <span>➜</span>
                  <span className="flex items-center gap-1 text-slate-550"><Database size={10} /> Sisobi</span>
                  <span>➜</span>
                  <span className="flex items-center gap-1 text-blue-400"><Database size={10} /> CadÚnico</span>
                </div>
                <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500/50 w-2/3 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Status: Integração Automática de Registros Sem Revisão Humana</p>
              </div>
            </motion.div>
          )}

          {selectedStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 text-xs font-sans"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono rounded">
                  Filtragem com Viés de Proxy
                </span>
                <span className="text-slate-500 text-[10px] font-mono">• Abstração Estatística</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-250">A Falácia do Cruzamento Frio:</h5>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Sob pretexto de precisão, o robô opera o <ExplainableTerm term="viés de proxy" /> (associação estatística indireta). Transforma cadastros desatualizados do passado ou localizações geográficas genéricas em 'nexo causal definitivo'.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg space-y-2">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 block">Auditoria do Caso Ativo:</span>
                  <div className="space-y-1 text-[11px]">
                    <p className="text-slate-350">
                      <strong>Cálculo do Risco:</strong> {intake.criteria}
                    </p>
                    <p className="text-slate-350">
                      <strong>Margem de Erro Esperada:</strong> Elevada para populações agrário-informais ou de baixa letramento técnico.
                    </p>
                  </div>
                </div>
              </div>

              {/* Proxy illustration */}
              <div className="p-3 bg-rose-950/15 border border-rose-900/40 rounded-lg flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 font-bold block">ALGORITMO IGNOROU:</span>
                  <p className="text-[11px] text-slate-300 italic font-sans">
                    A declaração física real ou o contexto social geográfico vivo do indivíduo.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-rose-400 font-bold block">ERRO DE DETECÇÃO</span>
                  <span className="text-[10px] text-slate-500 font-mono">Risco Social Ativo</span>
                </div>
              </div>
            </motion.div>
          )}

          {selectedStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 text-xs font-sans"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono rounded">
                  Decisão Cega e Indeferimento Direto
                </span>
                <span className="text-slate-500 text-[10px] font-mono">• Exclusão Digital de Direitos</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-250">Gargalo sem Notícia Humana:</h5>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    A máquina comunica o indeferimento através de mensagens curtas de erro gélidas na plataforma (como 'Meu INSS' ou em notificações automáticas) sem oportunizar o envio fácil de esclarecimentos, descumprindo o <ExplainableTerm term="contraditório" />.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg space-y-2">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 block">Barreira Material Identificada:</span>
                  <div className="space-y-1 text-[11px]">
                    <p className="text-slate-350">
                      <strong>Vulnerabilidade Crítica:</strong> {intake.vulnerability}
                    </p>
                    <p className="text-slate-350">
                      <strong>Bloqueio Prático:</strong> {intake.flowDetail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-red-950 bg-red-950/10 rounded-lg p-3 flex gap-3 text-[11px]">
                <span className="p-1 px-2 h-fit bg-red-950 text-red-400 rounded-md border border-red-900 font-mono font-black shrink-0">
                  X
                </span>
                <div>
                  <h6 className="font-bold text-red-350">Vício de Devido Processo Administrativo</h6>
                  <p className="text-slate-400 mt-0.5 leading-normal">
                    Ausência completa de justificativa amparada à inteligibilidade humana. O interessado lida com um sistema hermético que não aceita correções humanas imediatas.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {selectedStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 text-xs font-sans"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono rounded">
                  Conselho Eletrônico / CCA Ativo
                </span>
                <span className="text-slate-500 text-[10px] font-mono">• Devolução do Contraditório</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-250">Contestabilidade e Salvaguarda:</h5>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    O <strong className="text-amber-400">Conselho de Contestação Algorítmica</strong> atua auditando todas as variáveis, gerando o parecer cruzado de especialistas, votando e emitindo o acórdão de nulidade jurídica para restabelecer os direitos violados.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg space-y-2">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 block">Emissão de Direitos:</span>
                  <div className="space-y-1 text-[11px]">
                    <p className="text-slate-350">
                      <strong>Peça Jurídica de Defesa:</strong> Minuta de Recurso Administrativo gratuita.
                    </p>
                    <p className="text-slate-350">
                      <strong>Proposta do exercício:</strong> Solicitar esclarecimentos e revisão conforme a legislação aplicável ao caso.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-emerald-950 bg-emerald-950/15 rounded-lg p-3 flex gap-2 text-[11px]">
                <Sparkles size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h6 className="font-bold text-emerald-300">Resitência Jurídica Cidadã</h6>
                  <p className="text-slate-400 mt-0.5 leading-normal">
                    Fustigue as barreiras robóticas. Navegue pelas fases 1, 2 e 3 do Colegiado Universitário ao lado, copie a minuta correspondente e exerça sua contestação de fato!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
