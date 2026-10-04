import React, { useState, useMemo } from "react";
import {
  Calculator,
  AlertOctagon,
  HelpCircle,
  Scale,
  Zap,
  Info,
  Shield,
  Users,
  Terminal,
  Volume2,
  VolumeX,
  Flame,
  RotateCcw,
  UserCheck,
  Play,
  Share2,
  Lock,
  Compass,
  FileText,
  BadgeAlert,
  Sliders,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SimulationState {
  isRunning: boolean;
  progress: number;
  currentStep: string;
  result: string | null;
  soundEnabled: boolean;
}

export default function AlgorithmicSeverityCalculator() {
  // Key interactive control states
  const [opacityLevel, setOpacityLevel] = useState<number>(75); // 10% to 100%
  const [vulnerabilityIdx, setVulnerabilityIdx] = useState<number>(2); // 0 to 3
  const [audienceCount, setAudienceCount] = useState<number>(45050); // 1 to 250000
  const [humanReviewLevel, setHumanReviewLevel] = useState<number>(0); // 0 to 2

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showFormula, setShowFormula] = useState<boolean>(false);
  const [shakeScreen, setShakeScreen] = useState<boolean>(false);

  // Simulation parameters for judgment run
  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    progress: 0,
    currentStep: "",
    result: null,
    soundEnabled: true
  });

  // Self-contained, multi-interval, responsive synthesizer (No media files needed, completely web-native)
  const playSound = (type: "laser" | "alarm" | "success" | "tick" | "calculate") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === "tick") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "laser") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.2);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "alarm") {
        // High tension frequency wobble
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(300, now + 0.15);
        osc.frequency.linearRampToValueAtTime(180, now + 0.3);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "success") {
        // Harmonious chord
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.21); // C6
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.49);
        osc.start(now);
        osc.stop(now + 0.49);
      } else if (type === "calculate") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.linearRampToValueAtTime(680, now + 0.22);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {
      // Audio fallback safe
    }
  };

  // Humanized vulnerability scales with dynamic icons for perfect layouts
  const VULNERABILITY_LEVELS = [
    {
      label: "Cidadão Conectado",
      badge: "Baixo Impacto",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      desc: "Sujeito com assessoria jurídica célere própria, internet estável de alta velocidade e alto letramento eletrônico.",
      metricPenalty: 5,
      id: "vuln-0"
    },
    {
      label: "Consumidor Urbano",
      badge: "Instabilidade",
      badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      desc: "Cidadão comum com acesso básico a smartphones e redes públicas. Costuma aceitar termos sem entender os riscos.",
      metricPenalty: 15,
      id: "vuln-1"
    },
    {
      label: "Parcialmente Excluído",
      badge: "Nível Crítico",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      desc: "Residente em encostas ou comunidades rurais, sem sinal celular estável. Sem recursos para contratar patrono jurídico.",
      metricPenalty: 30,
      id: "vuln-2"
    },
    {
      label: "Extremo Vulnerável",
      badge: "Invisibilidade",
      badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      desc: "Idosos hipossuficientes, comunidades tradicionais, quilombolas ou analfabetos funcionais digitais completos.",
      metricPenalty: 45,
      id: "vuln-3"
    }
  ];

  // Safeguards implemented from administration
  const HUMAN_REVIEW_LEVELS = [
    {
      label: "Zero Controles (Vício Grave)",
      penalty: 35,
      desc: "Os sistemas decidem o indeferimento de lote seco. Nenhuma pessoa natural assina a ordem administrativa.",
      badge: "100% Autômato",
      badgeColor: "border-red-500/30 text-rose-400 bg-red-950/20"
    },
    {
      label: "Carimbo Cego (Homologação)",
      penalty: 15,
      desc: "Um servidor clica em massa para 'aceitar recomendações do robô' sem tempo de ler defesas ou documentos físicos.",
      badge: "Simulação Humana",
      badgeColor: "border-amber-500/30 text-amber-400 bg-amber-950/20"
    },
    {
      label: "Verificação Humana Real",
      penalty: -25,
      desc: "Auditores analisam detidamente as autodeclarações rurais ou certidões civis, permitindo emendas corretivas prévias.",
      badge: "Auditado",
      badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20"
    }
  ];

  // Pre-computations for real-time reactive stats
  const stats = useMemo(() => {
    // Math of Robocracy Level Index
    const opacityWeight = opacityLevel * 0.35; // max 35
    const vulnWeight = VULNERABILITY_LEVELS[vulnerabilityIdx].metricPenalty; // max 45
    const reviewWeight = HUMAN_REVIEW_LEVELS[humanReviewLevel].penalty; // max 35 (min -25)

    // Scale impact multiplier
    let audiencePenalty = 0;
    if (audienceCount > 150000) audiencePenalty = 15;
    else if (audienceCount > 50000) audiencePenalty = 10;
    else if (audienceCount > 10000) audiencePenalty = 5;

    let finalScore = opacityWeight + vulnWeight + reviewWeight + audiencePenalty;
    const robocracyIndex = Math.max(5, Math.min(100, Math.round(finalScore)));

    // Categorization
    let statusLabel = "NÍVEL I - COORDENAÇÃO PACÍFICA";
    let statusClass = "text-emerald-400 border-emerald-500/30 bg-emerald-950/40";
    let progressColor = "from-emerald-600 to-teal-400";
    let feedback = "Algoritmo de baixa agressão. Os filtros são claros e respeitam o canal de contestação humana.";

    if (robocracyIndex >= 85) {
      statusLabel = "NÍVEL IV - ABUSO ALGORÍTMICO CRÍTICO";
      statusClass = "text-rose-400 border-rose-500/40 bg-rose-950/70 animate-pulse";
      progressColor = "from-red-600 to-rose-400";
      feedback = "Abuso severo da burocracia digital! Os robôs estão bloqueando direitos sem notificação humana.";
    } else if (robocracyIndex >= 60) {
      statusLabel = "NÍVEL III - CAIXA PRETA HOSTIL";
      statusClass = "text-amber-400 border-amber-500/30 bg-amber-950/40";
      progressColor = "from-amber-600 to-amber-400";
      feedback = "Risco elevado. Falta de explicabilidade e descaso com falsos positivos cadastrais.";
    } else if (robocracyIndex >= 35) {
      statusLabel = "NÍVEL II - BUROCRACIA DIGITAL CONDESSENDE";
      statusClass = "text-blue-400 border-blue-500/30 bg-blue-950/40";
      progressColor = "from-blue-600 to-indigo-400";
      feedback = "Indícios de opacidade. Necessita monitoramento da ANPD e transparência de bases.";
    }

    // Days required for legal response
    const estimatedDmg = Math.round(robocracyIndex * 250 + (audienceCount * 0.4));

    return {
      robocracyIndex,
      statusLabel,
      statusClass,
      progressColor,
      feedback,
      estimatedDmg
    };
  }, [opacityLevel, vulnerabilityIdx, audienceCount, humanReviewLevel]);

  // Interactive slide triggers
  const executeOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacityLevel(Number(e.target.value));
    playSound("tick");
  };

  const executeAudienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudienceCount(Number(e.target.value));
    playSound("tick");
  };

  const executeVulnerabilityChange = (idx: number) => {
    setVulnerabilityIdx(idx);
    playSound("tick");
  };

  const executeHumanChange = (idx: number) => {
    setHumanReviewLevel(idx);
    playSound("tick");
  };

  // Run judicial simulation
  const startSimulation = () => {
    if (simulation.isRunning) return;
    playSound("laser");
    setShakeScreen(true);
    setTimeout(() => setShakeScreen(false), 200);

    setSimulation({
      isRunning: true,
      progress: 0,
      currentStep: "Analisando conformidade dos dados de treino...",
      result: null,
      soundEnabled: soundEnabled
    });

    const steps = [
      { p: 15, name: "Ilustrando questões de governança e proteção de dados..." },
      { p: 35, name: "Simulando inconsistências em bases cadastrais fictícias..." },
      { p: 55, name: "Testando incidência de homônimos e erros cadastrais fáticos..." },
      { p: 75, name: "Invocando o devido processo legal e rito do Art. 20, LGPD..." },
      { p: 90, name: "Aplicando os pesos didáticos do exercício..." },
      { p: 100, name: "Concluindo o exercício..." }
    ];

    let currentStepIdx = 0;

    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const step = steps[currentStepIdx];
        setSimulation(prev => ({
          ...prev,
          progress: step.p,
          currentStep: step.name
        }));
        playSound("tick");
        currentStepIdx++;
      } else {
        clearInterval(interval);

        let verdictText = "";
        if (stats.robocracyIndex >= 85) {
          verdictText = "HIPÓTESE DIDÁTICA DE RISCO ELEVADO: os pesos escolhidos tornam centrais a contestação, a qualidade dos dados e a explicação do ato. O exercício propõe examinar o procedimento e oferecer mediação humana, sem declarar nulidade ou fixar indenização em casos reais.";
          playSound("alarm");
        } else if (stats.robocracyIndex >= 60) {
          verdictText = "HIPÓTESE DIDÁTICA DE RISCO INTERMEDIÁRIO: o cenário sugere investigar fontes e pesos utilizados, mecanismos de contestação e avaliação de impacto. As conclusões são predefinidas e não concedem medidas jurídicas.";
          playSound("calculate");
        } else {
          verdictText = "HIPÓTESE DIDÁTICA DE RISCO MENOR: os pesos do exercício representam salvaguardas mais presentes. Isso não comprova legalidade do sistema, ausência de discriminação ou improcedência de pedidos.";
          playSound("success");
        }

        setSimulation(prev => ({
          ...prev,
          isRunning: false,
          result: verdictText
        }));
      }
    }, 400);
  };

  // Generate fancy segment dots representing LED graph bar meters
  const renderLedMeter = (value: number, colorType: "amber" | "rose") => {
    const barsCount = 20;
    const thresholdIndex = Math.round((value / 100) * barsCount);
    return (
      <div className="flex gap-1 justify-between items-center w-full font-mono mt-1">
        {Array.from({ length: barsCount }).map((_, i) => {
          const isActive = i < thresholdIndex;
          let color = "bg-slate-950/80 border border-slate-900/60";
          if (isActive) {
            if (colorType === "amber") {
              color = "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)] border border-amber-300/45";
            } else {
              color = "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] border border-rose-400/40";
            }
          }
          return (
            <div
              key={i}
              className={`h-3 flex-1 rounded-sm transition-all duration-300 ${color}`}
              title={`Segmento ${i + 1}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <section
      className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl relative transition-all duration-300 overflow-hidden ${
        shakeScreen ? "scale-[0.99] translate-y-1" : ""
      }`}
      id="algorithmic-severity-calculator"
    >
      {/* Visual cybertech grid backdrop decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(30,41,59,0.2),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      {/* Calculator Main Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black uppercase font-mono tracking-widest flex items-center gap-1.5 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Simulador Interativo
            </span>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline-block">/</span>
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Sliders size={12} className="text-amber-500/80" />
              Configure um cenário fictício
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1.5 font-display tracking-tight">
            Calculadora didática de risco algorítmico
          </h2>
          <p className="text-xs text-slate-450 mt-1 max-w-2xl leading-relaxed">
            Altere pesos hipotéticos de vulnerabilidade, opacidade e revisão para explorar um índice didático. A fórmula usa constantes escolhidas para o exercício; não prevê decisões judiciais, indenizações ou impacto real.
          </p>
        </div>

        {/* Audio CLI Sounds toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="px-3 py-1.5 bg-slate-950/60 border border-slate-800 hover:border-slate-705 text-[10px] font-mono font-bold tracking-wider rounded-xl text-slate-400 hover:text-white transition flex items-center gap-1"
          >
            <Info size={13} className="text-amber-500" />
            <span>Fórmula Matemática</span>
          </button>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSound("tick");
            }}
            className={`px-3 py-1.5 rounded-xl border text-[10px] uppercase font-mono tracking-wider font-extrabold transition flex items-center gap-1.5 ${
              soundEnabled
                ? "bg-slate-950 border-emerald-500/30 text-emerald-400 hover:text-white shadow-[0_0_10px_rgba(16,185,129,0.06)]"
                : "bg-slate-950/20 border-slate-800 text-slate-500"
            }`}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>Sons Retro</span>
          </button>
        </div>
      </div>

      {/* Accordion Math Details */}
      <AnimatePresence>
        {showFormula && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-4 bg-slate-950/90 rounded-2xl border border-amber-500/20 text-xs text-slate-400 leading-relaxed font-mono space-y-2 relative">
              <div className="absolute top-2 right-3 text-[10px] text-amber-500/50 uppercase font-bold">Equation-3B</div>
              <p className="font-bold text-slate-200">Pesos fictícios do exercício:</p>
              <p className="italic text-amber-500/90">
                Índice didático (0–100) = (Opacidade × 0.35) + (Vulnerabilidade) + (Penalidade Humana) + (Magnitude de Lote)
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 font-sans text-[11px] text-slate-400">
                <li><strong className="text-slate-300">Opacidade canônica:</strong> Reflete o mistério industrial do código-fonte e o silêncio da administração municipal (0 a 35 pontos).</li>
                <li><strong className="text-slate-300">Vulnerabilidade populacional:</strong> Pessoas sem advogados ou internet adequada sofrem isolamento digital amplificado (0 a 45 pontos).</li>
                <li><strong className="text-slate-300">Salvaguarda administrativa:</strong> Uma auditoria humana plena subtrai <strong className="text-teal-400">-25 pontos</strong>; a completa ausência humana adiciona <strong className="text-rose-400">+30 pontos</strong> de risco grave.</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch relative z-10">

        {/* Left column containing reactive handles (8 cells span) */}
        <div className="xl:col-span-7 space-y-5">

          {/* Knob 1: Opacity levels */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 relative overflow-hidden group space-y-3 shadow-lg">
            <div className="absolute top-0 right-0 h-10 w-10 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-205 font-extrabold flex items-center gap-1.5">
                <Shield size={14} className="text-amber-400" />
                1. Opacidade Algorítmica & Impedimento Técnico
              </label>
              <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]">
                {opacityLevel}/100 · didático
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              value={opacityLevel}
              onChange={executeOpacityChange}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all focus:outline-none"
            />

            {/* Real-time reactive Segmented led light meter graph */}
            {renderLedMeter(opacityLevel, "amber")}

            <div className="flex justify-between text-[9px] text-slate-500 font-mono tracking-wider pt-1">
              <span>CÓDIGO ABERTO</span>
              <span>EXPLICADO</span>
              <span>DIRETRIZ RESTRITA</span>
              <span>BLACK-BOX TOTAL</span>
            </div>
          </div>

          {/* Knob 2: Vuln Cards selectors */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3.5 shadow-lg">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-205 font-extrabold flex items-center gap-1.5">
                <Users size={14} className="text-sky-400" />
                2. Perfil Socioeconômico & Vulnerabilidade
              </label>
              <span className="text-[10px] text-slate-550 font-mono">SELECIONE UM PERFIL ABAIXO:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VULNERABILITY_LEVELS.map((vuln, vIdx) => {
                const isSelected = vulnerabilityIdx === vIdx;
                return (
                  <button
                    key={vuln.id}
                    onClick={() => executeVulnerabilityChange(vIdx)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between min-h-[110px] transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 border-sky-400/90 text-white shadow-[0_4px_16px_rgba(14,165,233,0.12)] scale-[1.01]"
                        : "bg-slate-950/20 border-slate-800/80 text-slate-400 hover:border-slate-800 hover:text-slate-350"
                    }`}
                  >
                    <div className="space-y-1.5 w-full">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className={vuln.badgeColor + " px-2 py-0.5 rounded border font-semibold font-mono"}>{vuln.badge}</span>
                        <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-sky-450 animate-ping" : "bg-slate-800"}`} />
                      </div>
                      <h4 className="text-[12px] font-black text-slate-200 mt-1 uppercase tracking-wider">
                        {vuln.label}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-450 leading-relaxed mt-2.5 line-clamp-2 block">
                      {vuln.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Knob 3: Population volume affected */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3 shadow-lg">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-205 font-extrabold flex items-center gap-1.5">
                <Flame size={14} className="text-rose-400 animate-pulse" />
                3. Magnitude de Escala (Cidadãos Afetados por Lote)
              </label>
              <span className="text-[11px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.1)]">
                {audienceCount.toLocaleString("pt-BR")} Alvos
              </span>
            </div>

            <input
              type="range"
              min="1000"
              max="250000"
              step="3000"
              value={audienceCount}
              onChange={executeAudienceChange}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500 transition-all focus:outline-none"
            />

            {/* Scale dynamic segments lights */}
            {renderLedMeter((audienceCount / 250000) * 100, "rose")}

            <div className="flex justify-between text-[9px] text-slate-500 font-mono tracking-wider pt-1">
              <span>CASO INDIVIDUAL</span>
              <span>LOTE MICRO-MUNICIPAL</span>
              <span>FILA REGIONAL SEVERA</span>
              <span>CONFLITO NACIONAL EXTENSO</span>
            </div>
          </div>

          {/* Knob 4: Human safeguard selectors */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3.5 shadow-lg">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-205 font-extrabold flex items-center gap-1.5">
                <UserCheck size={14} className="text-emerald-400" />
                4. Cautelas Existentes no Fluxo Operacional
              </label>
              <span className="text-[10px] text-slate-550 font-mono">GRAU DE REVISÃO HUMANA:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {HUMAN_REVIEW_LEVELS.map((review, rIdx) => {
                const isSelected = humanReviewLevel === rIdx;
                let activeRing = "border-rose-500/40 text-rose-300 bg-rose-950/20 shadow-[0_4px_14px_rgba(239,68,68,0.1)]";
                if (rIdx === 1) activeRing = "border-amber-500/40 text-amber-300 bg-amber-950/20 shadow-[0_4px_14px_rgba(245,158,11,0.1)]";
                if (rIdx === 2) activeRing = "border-emerald-500/40 text-emerald-300 bg-emerald-900/20 shadow-[0_4px_14px_rgba(16,185,129,0.1)]";

                return (
                  <button
                    key={review.label}
                    onClick={() => executeHumanChange(rIdx)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between min-h-[145px] transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `${activeRing} scale-[1.01]`
                        : "bg-slate-950/20 border-slate-800/80 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <div>
                      <span className="text-[8.5px] font-mono uppercase tracking-widest text-slate-500 block">Salvaguarda 0{rIdx + 1}</span>
                      <h4 className="text-[11px] font-extrabold text-slate-200 mt-1 tracking-tight leading-snug">
                        {review.label}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal mt-2.5 line-clamp-3">
                      {review.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right column: HUD control board & simulated outcome (5 cells span) */}
        <div className="xl:col-span-5 flex flex-col justify-between gap-5">

          {/* Simulated Retro CRT supercomputer screen */}
          <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between min-h-[360px] leading-normal font-mono text-xs">

            {/* Holographic scanlines effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.02),rgba(0,0,255,0.04))] bg-[size:100%_4px,4px_100%] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-amber-500/10 pointer-events-none animate-[scanline_8s_linear_infinite]" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/5 blur-3xl rounded-full" />

            <div className="space-y-4 relative z-10">

              {/* Header screen */}
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500/90 font-black flex items-center gap-1.5 animate-pulse">
                  <Terminal size={12} className="text-amber-500" />
                  PROT: TELEMETRY-AUDIT-EGOV-V3
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>

              {/* Dials values block */}
              <div className="grid grid-cols-2 gap-3.5 text-center font-mono">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 shadow-md">
                  <span className="text-[8.5px] font-mono tracking-wider uppercase text-slate-500 block">Índice didático</span>
                  <p className="text-4.5 text-3xl font-extrabold text-white mt-1">
                    {stats.robocracyIndex}/100
                  </p>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 shadow-md animate-pulse">
                  <span className="text-[8.5px] font-mono tracking-wider uppercase text-slate-500 block">Valor monetário fictício</span>
                  <p className="text-xl font-extrabold text-amber-400 mt-1.5 leading-none">
                    R$ {stats.estimatedDmg.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>

              {/* Dynamic 20 segment bar chart representing Risk level */}
              <div className="space-y-1 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                <div className="flex justify-between items-center text-[8.5px] uppercase tracking-wider text-slate-500">
                  <span>Espectro de Inércia Estatal</span>
                  <span className="text-amber-400 font-bold">Conselho Atemporal</span>
                </div>
                {renderLedMeter(stats.robocracyIndex, stats.robocracyIndex > 70 ? "rose" : "amber")}
              </div>

              {/* High-quality status classification badge */}
              <div className={`p-4 border rounded-xl leading-normal text-xs text-center space-y-1 font-mono transition-all duration-300 ${stats.statusClass}`}>
                <span className="text-[10px] uppercase font-bold tracking-widest block opacity-75">Classificação Sistêmica</span>
                <strong className="text-xs uppercase font-black font-sans tracking-wide block">{stats.statusLabel}</strong>
              </div>

              {/* Interactive micro logs display */}
              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 font-mono text-[10.5px] text-slate-400 space-y-1 leading-snug">
                <p className="flex justify-between">
                  <span className="text-slate-500">Explicabilidade / Transp.:</span>
                  <span className={opacityLevel > 70 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                    {opacityLevel > 70 ? "CAIXA PRETA CRÍTICA" : "MÈTRICAS EMBUTIDAS"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Contestação Humana:</span>
                  <span className={humanReviewLevel === 0 ? "text-rose-400 font-bold" : humanReviewLevel === 1 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                    {humanReviewLevel === 0 ? "NULA (Zero Callbacks)" : humanReviewLevel === 1 ? "HOMOLOGATÓRIA APENAS" : "DIRETRIZ ADEQUADA"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Cidadãos Bloqueados:</span>
                  <span className="text-slate-300 font-bold">{audienceCount.toLocaleString("pt-BR")}</span>
                </p>
                <p className="text-[10px] text-slate-500 leading-snug pt-2 border-t border-slate-800 mt-2 italic">
                  &gt; Configurações prontas para auditoria. Toque no botão para explorar a conclusão fictícia.
                </p>
              </div>

            </div>

            {/* Bottom active simulated button */}
            <div className="pt-4 mt-4 border-t border-slate-800 space-y-3 relative z-10">
              <button
                type="button"
                onClick={startSimulation}
                disabled={simulation.isRunning}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 font-mono font-black text-slate-950 rounded-xl shadow-[0_4px_14px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.35)] hover:scale-[1.01] transition-all disabled:opacity-50 text-xs tracking-wider flex items-center justify-center gap-2 select-none"
              >
                {simulation.isRunning ? (
                  <>
                    <span className="h-3 w-3 bg-slate-950 rounded-full animate-ping shrink-0" />
                    <span>ANIMANDO EXERCÍCIO ({simulation.progress}%) ...</span>
                  </>
                ) : (
                  <>
                    <Play size={13} fill="currentColor" />
                    <span>INICIAR EXERCÍCIO DIDÁTICO</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulated outcome sentence box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg min-h-[175px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {simulation.isRunning ? (
                <motion.div
                  key="simulating"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-6 space-y-3 font-mono text-xs text-slate-400"
                >
                  <ActivityPulse />
                  <p className="font-bold text-amber-500">{simulation.currentStep}</p>
                </motion.div>
              ) : simulation.result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-lg text-[9px] text-slate-500 font-mono">
                    <span className="hidden sm:inline-block font-black text-amber-500 flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-500" />
                      ✓ CONCLUSÃO FICTÍCIA · SEM EFEITO JURÍDICO
                    </span>
                    <button
                      onClick={() => {
                        setSimulation({ isRunning: false, progress: 0, currentStep: "", result: null, soundEnabled });
                        playSound("tick");
                      }}
                      className="flex items-center gap-1 ml-auto text-slate-400 hover:text-white transition font-bold"
                    >
                      <RotateCcw size={10} />
                      Zerar
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-xl leading-relaxed text-xs font-sans text-slate-205 italic border-l-4 border-amber-500 shadow-md">
                    "{simulation.result}"
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1">
                    <span>Simulação de contestabilidade</span>
                    <span>Fundamente: Art. 20 LGPD &amp; CF/88</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center py-6 text-slate-500 space-y-2"
                >
                  <Scale size={28} className="text-slate-700 mx-auto" strokeWidth={1.5} />
                  <p className="font-sans text-xs max-w-sm">
                    Preencha as variáveis de opacidade e vulnerabilidades populacionais e clique em <strong className="text-slate-400">Iniciar Exercício Didático</strong> para explorar uma conclusão predefinida.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </section>
  );
}

function ActivityPulse() {
  return (
    <div className="flex items-center gap-1 justify-center h-8">
      <div className="w-1.5 h-6 bg-amber-500 rounded animate-[pulse_0.6s_ease-in-out_infinite]" />
      <div className="w-1.5 h-4 bg-amber-500 rounded animate-[pulse_0.6s_ease-in-out_infinite_0.15s]" />
      <div className="w-1.5 h-8 bg-amber-500 rounded animate-[pulse_0.6s_ease-in-out_infinite_0.3s]" />
      <div className="w-1.5 h-3 bg-amber-500 rounded animate-[pulse_0.6s_ease-in-out_infinite_0.45s]" />
    </div>
  );
}
