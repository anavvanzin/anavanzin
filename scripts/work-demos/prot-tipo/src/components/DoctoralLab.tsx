import React, { useState } from "react";
import {
  ShieldAlert,
  Layers,
  Sliders,
  BookOpen,
  UserCheck,
  Users,
  FileText,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Check,
  Info,
  Scale,
  Eye,
  Lock,
  AlertTriangle,
  FileSignature
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ExplainableTerm from "./ExplainableTerm";

interface PathologicalScenario {
  id: "syri" | "robodebt" | "nudging" | "assimetria";
  title: string;
  badge: string;
  origin: string;
  sourceTech: string;
  legalDamage: string;
  challenge: string;
  remedyAction: string;
  indicatorField: string;
  impactLabel: string;
}

const SCENARIOS: PathologicalScenario[] = [
  {
    id: "syri",
    title: "Caso SyRI (Holanda - Vigilância em Massa)",
    badge: "🔴 ALTA DISCRIMINAÇÃO",
    origin: "Cruzamento invasivo e cego de bases fiscais, trabalhistas e habitacionais de bairros desfavorecidos para gerar scores secretos de propensas fraudes assistenciais.",
    sourceTech: "Perfilamento preditivo de grupos vulneráveis com base em dados de utilidades públicas e geolocalização residencial.",
    legalDamage: "Devastação aos princípios constitucionais da Impessoalidade, Privacidade, Isonomia e Desvio Crítico de Finalidade na coleta de dados públicos de treino.",
    challenge: "Como administrador, audite as matrizes de cruzamento para bloquear perfilamentos abusivos que tratem a hipossuficiência econômica como sinônimo de fraude.",
    remedyAction: "Desvincular bases fiscais externas de bancos municipais e suspender pontuações preditivas baseadas em geolocalização.",
    indicatorField: "Grau de Vigilância Oculta",
    impactLabel: "Escore de Suspeição Populacional"
  },
  {
    id: "robodebt",
    title: "Caso Robodebt (Austrália - Inversão do Ônus)",
    badge: "⚫ CRUELDADE FISCAL",
    origin: "Computação centralizada de rendimento médio que disparava notificações automatizadas brutas exigindo estornos de benefícios de necessitados.",
    sourceTech: "Uso de médias de renda anual para inferir renda em períodos de avaliação, em substituição à apuração individual.",
    legalDamage: "O exercício discute cobrança de dívida presumida, suficiência da prova e dificuldade de contestação; não transpõe automaticamente regras brasileiras ao caso australiano.",
    challenge: "Desmonte a lógica de cálculo estandarizada do robô e crie um canal seguro de contestamento que paralise os débitos antes do bloqueio definitivo.",
    remedyAction: "Proposta didática: verificar individualmente os dados e oferecer canais acessíveis para contestar uma cobrança antes de sua execução.",
    indicatorField: "Taxa de Falso Positivo",
    impactLabel: "Nível de Intimações Coletivas"
  },
  {
    id: "nudging",
    title: "Engenharia de Comportamento ('Nudging' Estatal)",
    badge: "🟡 INDUÇÃO SUTIL",
    origin: "Envio de micro-notificações preventivas, alertas de advertência e mensagens intimidadoras em tempo real buscando inducção ao encerramento voluntário do caso.",
    sourceTech: "Disparadores automáticos de mensagens no appGov baseados em técnicas de persuasão e design manipulativo de escolhas (coerção velada).",
    legalDamage: "Criação de sanção ou encargo informal sem o ato público motivador, fustigando o devido processo legal sob a justificativa de eficiência.",
    challenge: "Neutralize os impulsionadores comportamentais invasivos que violam o espaço de reflexão de defesa e a paridade de armas do hipossuficiente.",
    remedyAction: "Determinar que alertas coercitivos tragam obrigatoriamente botões neutros e fáceis de recusa, sem indução à desistência de direitos.",
    indicatorField: "Desvio do Consentimento",
    impactLabel: "Taxa de Autofiscalização Forçada"
  },
  {
    id: "assimetria",
    title: "Assimetria de Defesa e Barreiras Técnicas",
    badge: "🔵 ASSIMETRIA BRUTA",
    origin: "Imposição de portais, jargões matemáticos incompreensíveis e ferramentas de robôs de resposta automática que dificultam sobremaneira a ampla contestação.",
    sourceTech: "Interface fechada e isolamento contra canais analógicos e humanos, forçando contraprovas estatísticas que o cidadão não sabe manusear.",
    legalDamage: "Completa negação da paridade de armas e exclusão digital estrutural contrária ao Art. 5º da Carta Magna e à Lei do Processo Administrativo.",
    challenge: "Traduza os termos da máquina e as matrizes que justificam o impedimento do cidadão, simplificando os botões de ação.",
    remedyAction: "Prover acesso em língua natural simplificada e disponibilizar assistentes humanos para preencher petições de revisão fática.",
    indicatorField: "Fator de Exclusão Digital",
    impactLabel: "Barreira Contenciosa do Cidadão"
  }
];

export default function DoctoralLab() {
  const [activeScenarioId, setActiveScenarioId] = useState<"syri" | "robodebt" | "nudging" | "assimetria">("syri");
  const [remediesApplied, setRemediesApplied] = useState<Record<string, boolean>>({});

  // Weights / Sliders for Algorithmic Power Abuses
  const [secretScale, setSecretScale] = useState<number>(75); // Proprietary code secret vs publicity
  const [engineerDiscretion, setEngineerDiscretion] = useState<number>(60); // Private developers policy-making hidden in mathematics

  // Due due process by design switches
  const [concepcaoExAnteActive, setConcepcaoExAnteActive] = useState<boolean>(false);
  const [processamentoConcomitanteActive, setProcessamentoConcomitanteActive] = useState<boolean>(false);
  const [decisaoExPostActive, setDecisaoExPostActive] = useState<boolean>(false);

  // PL 2338/2023 AIA Sandbox states
  const [selectedAiaSector, setSelectedAiaSector] = useState<string>("assistencial");
  const [interactiveMapeamento, setInteractiveMapeamento] = useState<boolean>(false);
  const [interactiveAtenuacao, setInteractiveAtenuacao] = useState<boolean>(false);
  const [interactiveConsulta, setInteractiveConsulta] = useState<boolean>(false);
  const [aiaReportGenerated, setAiaReportGenerated] = useState<boolean>(false);

  const currentScenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];
  const isRemedyActive = remediesApplied[activeScenarioId] || false;

  // Calculte dynamic indices based on user input
  const calculatedSindicability = Math.max(10, 100 - Math.round((secretScale * 0.6) + (engineerDiscretion * 0.4)));
  const desvioDePoderProbability = Math.min(100, Math.round((secretScale * 0.4) + (engineerDiscretion * 0.6)));

  const handleToggleRemedy = () => {
    setRemediesApplied(prev => ({
      ...prev,
      [activeScenarioId]: !prev[activeScenarioId]
    }));
  };

  // Dynamic values based on remedy status
  const getScenarioValues = () => {
    let base = 85;
    if (activeScenarioId === "syri") base = 88;
    if (activeScenarioId === "robodebt") base = 92;
    if (activeScenarioId === "nudging") base = 74;
    if (activeScenarioId === "assimetria") base = 80;

    return isRemedyActive ? base - 55 : base;
  };

  const getEfeitoBolaDeNeve = () => {
    let score = 95;
    if (concepcaoExAnteActive) score -= 30;
    if (processamentoConcomitanteActive) score -= 30;
    if (decisaoExPostActive) score -= 30;
    return Math.max(5, score);
  };

  return (
    <section className="space-y-8 mt-8" id="doctoral-research-lab">
      {/* Title block detailing the Academic Breakthrough */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest font-mono">
              ★ Módulo Prático de Doutorado
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight flex items-center gap-2">
              <Scale className="text-purple-400" size={24} />
              DISPOSITIVO CRÍTICO: Laboratório de Decisão Algorítmica Complexa
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Exercício acadêmico sobre patologias da decisão algorítmica e salvaguardas de contestação. Os controles usam constantes ilustrativas: seus índices de 0 a 100 não são medições, probabilidades ou resultados de pesquisa. A AIA é um roteiro inspirado no <strong>PL 2338/2023</strong>, ainda em tramitação, sem certificação ou efeito jurídico.
            </p>
            <p className="text-[11px] text-slate-400 max-w-3xl leading-relaxed">
              Fontes: <a className="underline" href="https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2487262" target="_blank" rel="noreferrer">tramitação oficial do PL 2338/2023</a>; <a className="underline" href="https://robodebt.royalcommission.gov.au/publications/report" target="_blank" rel="noreferrer">relatório oficial sobre Robodebt</a>; <a className="underline" href="https://uitspraken.rechtspraak.nl/details?id=ECLI:NL:RBDHA:2020:1878" target="_blank" rel="noreferrer">decisão judicial sobre SyRI</a>. As soluções do exercício são propostas pedagógicas.
            </p>
          </div>
          <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-44 text-center">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Índice Didático</span>
            <span className="text-2xl font-black text-white font-mono mt-0.5">{getEfeitoBolaDeNeve()}/100</span>
            <span className="text-[9px] text-slate-500 font-mono mt-0.5">Vulnerabilidade Simulada</span>
          </div>
        </div>

        {/* SECTION 1: AUTOMAÇÃO SIMPLES VS COMPLEXA (GRAPHICAL COMPARATOR) */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 space-y-3">
              <span className="inline-block p-1 px-2.5 bg-slate-950 text-slate-400 font-mono uppercase text-[9px] tracking-widest rounded border border-slate-850">
                Análise de Modelagem
              </span>
              <h3 className="text-sm font-bold text-white font-display">
                Ruptura Axiológica: Automação Simples vs. Decisão Autónoma
              </h3>
              <p className="text-xs text-slate-400 leading-normal">
                O seminário discute a diferença entre execução de regras previamente definidas e modelos preditivos que classificam situações. Escolhas de dados, parâmetros e desenho podem incorporar valorações; sua legitimidade exige exame do contexto, da competência e das garantias aplicáveis.
              </p>
            </div>

            {/* Micro-flows comparative interactive graph */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/80 space-y-3 relative overflow-hidden group">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">A. Automação Linear Simples</span>
                  <span className="p-1 px-1.5 bg-sky-500/10 border border-sky-500/20 rounded text-[8px] font-mono text-sky-400 font-bold">VINCULADO (ESTÁTICA)</span>
                </div>
                {/* Visual flowchart diagram */}
                <div className="flex items-center justify-around text-center py-4 text-[10px]">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono w-20">
                    Dado Bruto
                  </div>
                  <ArrowRight size={14} className="text-slate-700" />
                  <div className="p-2 bg-slate-900 rounded border border-sky-550/20 text-sky-300 font-mono w-20">
                    IF/THEN Rígido
                  </div>
                  <ArrowRight size={14} className="text-slate-700" />
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-slate-500 w-20">
                    Soma Direta
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  Decisão puramente parametrizada. Operação mecânica de atos em que não há margem subjetiva de valoração, dispensando complexidades.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/30 space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-xl pointer-events-none" />
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">B. Decisão Algorítmica Autónoma</span>
                  <span className="p-1 px-1.5 bg-purple-500/10 border border-purple-500/20 rounded text-[8px] font-mono text-purple-400 font-bold">PREDITIVA (AUTÔNOMA)</span>
                </div>
                {/* Visual neural network representation */}
                <div className="flex items-center justify-around text-center py-3 text-[10px]">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono w-20">
                    Bases Massivas
                  </div>
                  <ArrowRight size={14} className="text-purple-600 animate-pulse" />
                  <div className="p-1 px-2 bg-purple-950/30 rounded border border-purple-555/40 text-purple-300 font-mono w-20 flex flex-col justify-center text-[9px] gap-0.5">
                    <span>Rede Neural</span>
                    <span className="text-[8px] text-purple-400 font-bold font-mono">Pesos Variáveis</span>
                  </div>
                  <ArrowRight size={14} className="text-purple-600 animate-pulse" />
                  <div className="p-2 bg-slate-950 rounded border border-purple-500/20 font-mono text-purple-300 font-bold w-20">
                    Inocência/Culpa
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  Avaliação preditiva que cria perfis, classifica condutas de cidadãos e reconfigura implicitamente regras de políticas sociais por código.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PATOLOGIAS INTERATIVAS CONTROL ROOM (SyRI & Robodebt Simulation) */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="space-y-4">
            <span className="inline-block p-1 px-2.5 bg-slate-950 text-slate-400 font-mono uppercase text-[9px] tracking-widest rounded border border-slate-850">
              Mesa Crítica De Crises
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <h3 className="text-sm font-bold text-white font-display">
                Módulo Prático: Auditoria de Patologias da Governança Algorítmica
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Selecione uma patologia abaixo para gerenciar como auditor</span>
            </div>

            {/* Visual scenario toggler tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SCENARIOS.map((scen) => {
                const isActive = activeScenarioId === scen.id;
                let activeColor = "border-purple-500 text-purple-400 font-bold bg-purple-950/20";
                if (!isActive) activeColor = "border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-950/40";

                return (
                  <button
                    key={scen.id}
                    onClick={() => setActiveScenarioId(scen.id)}
                    className={`p-3 rounded-xl border font-mono text-xs transition duration-200 text-left ${activeColor}`}
                  >
                    <div className="text-[9px] text-slate-500 mb-1">{scen.badge}</div>
                    <span className="block truncate font-bold text-slate-200">{scen.id.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>

            {/* Active pathology simulated visual environment */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-900 relative">

              {/* Micro telemetry gauge */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-900 pb-5 lg:pb-0 lg:pr-5">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold mb-3">
                  Índice Ilustrativo de Risco
                </span>

                {/* Visual gauge donut */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="48" className="stroke-slate-900 fill-none" strokeWidth="6" />
                    <circle
                      cx="64"
                      cy="64"
                      r="48"
                      className={`fill-none transition-all duration-1000 ease-out ${isRemedyActive ? "stroke-emerald-500" : "stroke-rose-500"}`}
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={(2 * Math.PI * 48) - (getScenarioValues() / 100) * (2 * Math.PI * 48)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className={`text-2xl font-black font-mono leading-none ${isRemedyActive ? "text-emerald-400" : "text-rose-400 animate-pulse"}`}>
                      {getScenarioValues()}/100
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest block mt-1">
                      {currentScenario.indicatorField}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {currentScenario.impactLabel}
                  </span>
                  <p className="text-[11px] text-slate-500 max-w-[200px] leading-tight font-sans">
                    {isRemedyActive
                      ? "O índice didático diminui ao selecionar a salvaguarda. Não representa eficácia medida."
                      : "Cenário didático para discutir riscos aos direitos. Não representa diagnóstico de um sistema real."}
                  </p>
                </div>
              </div>

              {/* Explanatory texts in structured judicial format */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <h4 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      {currentScenario.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-1 italic">
                    Contexto do Exercício: {currentScenario.origin}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/40 inline-block font-bold">
                      Patologia Jusadministrativa Correlacionada
                    </span>
                    <p className="text-slate-350 font-sans text-xs">
                      {currentScenario.legalDamage}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-purple-400 font-bold block">
                      Desafio Proposto ao Auditor Doutorando:
                    </span>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {currentScenario.challenge}
                    </p>
                  </div>
                </div>

                {/* Remedy interaction button */}
                <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Info size={14} className="text-purple-400 shrink-0" />
                    <span className="text-[10px] font-mono text-slate-500">
                      Dispositivo Sindicável do Aluno:
                    </span>
                  </div>

                  <button
                    onClick={handleToggleRemedy}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition duration-200 select-none flex items-center gap-2 border ${
                      isRemedyActive
                        ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/80"
                        : "bg-purple-500 text-white border-purple-400 hover:bg-purple-600 shadow-[0_4px_15px_rgba(168,85,247,0.2)]"
                    }`}
                  >
                    {isRemedyActive ? (
                      <>
                        <Check size={14} />
                        REMEDIO DE SALVAGUARDA ATIVO (CONSTITUCIONALIZADO)
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} className="animate-spin-slow" />
                        DESLOCAR REMÉDIO CENSOR: {currentScenario.remedyAction.toUpperCase()}
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* SECTION 3: DESVIO DE PODER SILENCIOSO & SEGREDO COMERCIAL (SLIDERS) */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* Range adjustments */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="inline-block p-1 px-2.5 bg-slate-950 text-slate-400 font-mono uppercase text-[9px] tracking-widest rounded border border-slate-850">
                  Desvio Oculto de Finalidade
                </span>
                <h3 className="text-sm font-bold text-white font-display">
                  Auditoria de Desvio de Poder Algorítmico & Discricionariedade Técnica
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Use os controles abaixo para simular as tensões regulatórias da contratação pública de IA. Quanto maior o monopólio da tecnologia de empresas terceirizadas ou a opacidade protegida pelo segredo comercial, menor é o controle sob desvios de finalidade e preferências invisíveis embutidas nas linhas de programação.
                </p>
              </div>

              {/* Slider 1 */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Lock size={12} className="text-amber-500 animate-pulse" />
                    Garantia de Segredo Industrial/Comercial vs. Publicidade:
                  </span>
                  <span className="text-amber-400 font-bold">{secretScale}/100 Opacidade Simulada</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={secretScale}
                  onChange={(e) => setSecretScale(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>TRANS-TRANSPARENTE (LINDB)</span>
                  <span>CAIXA-PRETA ABSOLUTA</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Sliders size={12} className="text-purple-400" />
                    Discricionariedade Política do Desenvolvedor Terceirizado:
                  </span>
                  <span className="text-purple-400 font-bold">{engineerDiscretion}/100 Valoração Simulada</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={engineerDiscretion}
                  onChange={(e) => setEngineerDiscretion(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>REGRAS MERAMENTE LEGAIS</span>
                  <span>PESOS SUBJETIVOS PRIVADOS</span>
                </div>
              </div>
            </div>

            {/* Simulated output meters reflecting the risk index */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/50 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />

              {/* Sindicability metric */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-900/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[8.5px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    Índice Didático de Controle
                  </span>
                  <h4 className="text-3xl font-black font-mono tracking-tight text-white mt-1">
                    {calculatedSindicability}/100
                  </h4>
                </div>
                <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                  {calculatedSindicability > 60
                    ? "✓ No modelo didático, a menor opacidade facilita a contestação."
                    : "✕ No modelo didático, maior opacidade dificulta a contestação. Segredo comercial não torna a decisão imune a controle."}
                </p>
                <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${calculatedSindicability}%` }} />
                </div>
              </div>

              {/* Abusement potential metric */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-900/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[8.5px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    Índice Didático de Risco
                  </span>
                  <h4 className={`text-3xl font-black font-mono tracking-tight mt-1 transition-all ${desvioDePoderProbability > 60 ? "text-rose-400" : "text-emerald-400"}`}>
                    {desvioDePoderProbability}/100
                  </h4>
                </div>
                <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                  {desvioDePoderProbability > 60
                    ? "🚨 O exercício ilustra maior risco de valorações pouco transparentes."
                    : "✓ O exercício ilustra menor risco. Este índice não atesta conformidade legal nem ausência de discriminação."}
                </p>
                <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${desvioDePoderProbability}%` }} />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* SECTION 4: DEVIDO PROCESSO TECNOLOGICO BY DESIGN TIMELINE */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="inline-block p-1 px-2.5 bg-slate-950 text-slate-400 font-mono uppercase text-[9px] tracking-widest rounded border border-slate-850">
                Garantia Temporal Integrada
              </span>
              <h3 className="text-sm font-bold text-white font-display">
                Devido Processo Tecnológico "by Design": Prontidão contra o Viés de Automação
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A confiança excessiva em uma recomendação automática pode reduzir o escrutínio humano. O seminário propõe integrar explicações e canais de contestação em diferentes fases do desenvolvimento e uso de um sistema, em vez de depender apenas de uma assinatura ao final.
              </p>
            </div>

            {/* Interactive Timeline layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

              {/* Connecting line */}
              <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[1.5px] bg-slate-850 z-0 pointer-events-none" />

              {/* Phase Ex Ante */}
              <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-850 space-y-3 relative z-10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-mono text-purple-400 font-black tracking-widest block uppercase">
                      1. MODELAGEM (EX ANTE)
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${concepcaoExAnteActive ? "bg-emerald-400 animate-pulse" : "bg-slate-800"}`} />
                  </div>
                  <h4 className="text-xs font-bold text-white font-sans">
                    Fase de Concepção e Regras
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-2 leading-relaxed">
                    Proposta de documentar critérios, fontes de dados e limites do modelo, observadas as normas de transparência, sigilo e proteção de dados.
                  </p>
                  <p className="text-[10px] text-slate-500 italic mt-1 font-mono">
                    Salvaguarda acadêmica de concepção
                  </p>
                </div>

                <button
                  onClick={() => setConcepcaoExAnteActive(!concepcaoExAnteActive)}
                  className={`w-full py-1.5 px-3 border rounded-lg text-[10px] font-mono font-bold mt-4 select-none text-center transition ${
                    concepcaoExAnteActive
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/50"
                      : "bg-slate-900 text-slate-450 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {concepcaoExAnteActive ? "✓ SALVAGUARDA SIMULADA" : "SIMULAR TRANSPARÊNCIA"}
                </button>
              </div>

              {/* Phase Concomitante */}
              <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-850 space-y-3 relative z-10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-mono text-purple-400 font-black tracking-widest block uppercase">
                      2. PROCESSAMENTO (CONCOMITANTE)
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${processamentoConcomitanteActive ? "bg-emerald-400 animate-pulse" : "bg-slate-800"}`} />
                  </div>
                  <h4 className="text-xs font-bold text-white font-sans">
                    Fase de Cálculo e Prova
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-2 leading-relaxed">
                    Proposta de informar critérios e procedimentos de forma compreensível e facilitar a correção de dados e a contestação.
                  </p>
                  <p className="text-[10px] text-slate-500 italic mt-1 font-mono">
                    LGPD, art. 20: revisão e informações; intervenção humana proposta
                  </p>
                </div>

                <button
                  onClick={() => setProcessamentoConcomitanteActive(!processamentoConcomitanteActive)}
                  className={`w-full py-1.5 px-3 border rounded-lg text-[10px] font-mono font-bold mt-4 select-none text-center transition ${
                    processamentoConcomitanteActive
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/50"
                      : "bg-slate-900 text-slate-450 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {processamentoConcomitanteActive ? "✓ RELATÓRIO HABILITADO" : "PROGRAMAR EXPLICAÇÃO"}
                </button>
              </div>

              {/* Phase Ex Post */}
              <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-850 space-y-3 relative z-10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-mono text-purple-400 font-black tracking-widest block uppercase">
                      3. RECURSO (EX POST)
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${decisaoExPostActive ? "bg-emerald-400 animate-pulse" : "bg-slate-800"}`} />
                  </div>
                  <h4 className="text-xs font-bold text-white font-sans">
                    Fase de Decisão e Desconexão
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-2 leading-relaxed">
                    Motivação robusta em vernáculo simples e fornecimento de uma "Exit Door" - porta de saída imediata para mediação fática humana.
                  </p>
                  <p className="text-[10px] text-slate-500 italic mt-1 font-mono">
                    Lei 14.129/2021, art. 14: atendimento presencial; Lei 9.784/1999, art. 50: motivação
                  </p>
                </div>

                <button
                  onClick={() => setDecisaoExPostActive(!decisaoExPostActive)}
                  className={`w-full py-1.5 px-3 border rounded-lg text-[10px] font-mono font-bold mt-4 select-none text-center transition ${
                    decisaoExPostActive
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/50"
                      : "bg-slate-900 text-slate-450 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {decisaoExPostActive ? "✓ EXIT DOOR ATIVADA" : "PROGRAMAR ESCAPE HUMANO"}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* SECTION 5: SIMULAÇÃO PL 2338/2023 - AVALIAÇÃO DE IMPACTO ALGORÍTMICO (AIA) WIZARD */}
        <div className="pt-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="inline-block p-1 px-2.5 bg-slate-950 text-slate-400 font-mono uppercase text-[9px] tracking-widest rounded border border-slate-850">
                Exercício de Avaliação de Impacto
              </span>
              <h3 className="text-sm font-bold text-white font-display">
                Simulador de Inteligência Artificial de Alto Risco & AIA (PL 2338/2023)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                O debate legislativo do PL 2338/2023 inclui avaliação de impacto e governança de sistemas de IA. Este roteiro simplificado permite discutir <strong>riscos aos direitos fundamentais</strong> em setores fictícios. Não reproduz integralmente o projeto, não substitui avaliação real e não autoriza implantação de um sistema.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Target deployment settings */}
              <div className="lg:col-span-5 space-y-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block font-bold">
                  Parâmetros de Alvo Algorítmico Público
                </span>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">Setor/Finalidade da Ferramenta Estatal:</label>
                  <select
                    value={selectedAiaSector}
                    onChange={(e) => {
                      setSelectedAiaSector(e.target.value);
                      setAiaReportGenerated(false);
                    }}
                    className="w-full bg-slate-900 text-xs text-slate-200 border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-purple-500 font-sans"
                  >
                    <option value="assistencial">Concessão de Subsídios Assistenciais (Ex: Bolsa Família)</option>
                    <option value="concursos">Recrutamento/Seleção para Concursos Públicos</option>
                    <option value="fisco">Auditoria e Cobrança Fiscal Automatizada</option>
                    <option value="penal">Mapeamento Predictivo e Investigação Penal</option>
                    <option value="transito">Multas e Suspensão de Carteira por Padrão de Câmeras</option>
                  </select>
                </div>

                {/* Substantive Checklist items representing PL 2338 requirements */}
                <div className="space-y-3 pt-2">
                  <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Etapas de Auditoria da AIA:
                  </span>

                  <button
                    onClick={() => {
                      setInteractiveMapeamento(!interactiveMapeamento);
                      setAiaReportGenerated(false);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition select-none flex items-center justify-between ${
                      interactiveMapeamento
                        ? "bg-slate-900 border-purple-500/50 text-purple-300"
                        : "bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="p-1 rounded font-mono font-bold bg-slate-950 text-purple-400 border border-slate-800">1</span>
                      <span className="font-sans font-medium text-[11px]">Mapeamento de Direitos Fundamentais</span>
                    </div>
                    {interactiveMapeamento ? <Check size={14} className="text-purple-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />}
                  </button>

                  <button
                    onClick={() => {
                      setInteractiveAtenuacao(!interactiveAtenuacao);
                      setAiaReportGenerated(false);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition select-none flex items-center justify-between ${
                      interactiveAtenuacao
                        ? "bg-slate-900 border-purple-500/50 text-purple-300"
                        : "bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="p-1 rounded font-mono font-bold bg-slate-950 text-purple-400 border border-slate-800">2</span>
                      <span className="font-sans font-medium text-[11px]">Definição de Medidas de Atenuação</span>
                    </div>
                    {interactiveAtenuacao ? <Check size={14} className="text-purple-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />}
                  </button>

                  <button
                    onClick={() => {
                      setInteractiveConsulta(!interactiveConsulta);
                      setAiaReportGenerated(false);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition select-none flex items-center justify-between ${
                      interactiveConsulta
                        ? "bg-slate-900 border-purple-500/50 text-purple-300"
                        : "bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="p-1 rounded font-mono font-bold bg-slate-950 text-purple-400 border border-slate-800">3</span>
                      <span className="font-sans font-medium text-[11px]">Consulta e Audiência Pública Prévia</span>
                    </div>
                    {interactiveConsulta ? <Check size={14} className="text-purple-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />}
                  </button>
                </div>

                <button
                  onClick={() => setAiaReportGenerated(true)}
                  disabled={!interactiveMapeamento && !interactiveAtenuacao && !interactiveConsulta}
                  className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold transition select-none flex items-center justify-center gap-2 ${
                    interactiveMapeamento || interactiveAtenuacao || interactiveConsulta
                      ? "bg-purple-500 text-white hover:bg-purple-600 border border-purple-400"
                      : "bg-slate-900 text-slate-400 border-slate-850 cursor-not-allowed"
                  }`}
                >
                  <FileSignature size={15} />
                  GERAR ROTEIRO DIDÁTICO
                </button>
              </div>

              {/* Dynamic Report output screen based on AIA parameters */}
              <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-850 p-4.5 flex flex-col justify-between space-y-4">
                {aiaReportGenerated ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-mono text-[9px] uppercase text-purple-400 font-bold block">
                        Rascunho Didático de Avaliação de Impacto
                      </span>
                      <span className="p-1 px-1.5 bg-emerald-950 border border-emerald-900 rounded text-[8px] text-emerald-400 font-mono font-bold leading-none">
                        SEM CERTIFICAÇÃO
                      </span>
                    </div>

                    <div className="space-y-3 font-sans text-xs max-h-[220px] overflow-y-auto pr-1">
                      <p className="font-bold text-slate-100">
                        Exercício do conselho fictício — não é avaliação de órgão público ou universidade
                      </p>

                      <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
                        As etapas selecionadas sugerem perguntas para um sistema hipotético do setor de <strong className="text-slate-200 uppercase font-mono text-[10px]">{selectedAiaSector}</strong>. Nenhuma auditoria ou consulta foi realizada por este protótipo:
                      </p>

                      <ul className="space-y-2 border-l-2 border-slate-800 pl-3 italic text-slate-300 font-sans text-[11px] leading-relaxed">
                        {interactiveMapeamento && (
                          <li>
                            <strong>Impacto de Isonomia:</strong> Identificar riscos de discriminação, grupos afetados e limitações dos dados. Definir como esses riscos poderão ser avaliados com evidências.
                          </li>
                        )}
                        {interactiveAtenuacao && (
                          <li>
                            <strong>Medidas de Atenuação:</strong> Planejar controles, registros auditáveis e canais de contestação. Justificar limites de acesso a informações e avaliar se as medidas funcionam.
                          </li>
                        )}
                        {interactiveConsulta && (
                          <li>
                            <strong>Participação:</strong> Planejar formas acessíveis de ouvir pessoas afetadas e documentar as contribuições. Este exercício não realiza audiência pública nem pressupõe prazo legal de 45 dias.
                          </li>
                        )}
                      </ul>

                      <p className="text-[10px] text-slate-450 leading-relaxed font-mono">
                        Próximo passo hipotético: reunir evidências e verificar obrigações vigentes com responsáveis técnicos e jurídicos. A seleção de etapas nesta tela não demonstra conformidade nem legitima um deploy.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-right">
                      <span className="text-[8.5px] text-purple-400/80 font-mono">
                        Identificador local do exercício: #AIA-{selectedAiaSector.toUpperCase()}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-full min-h-[170px] space-y-2.5 select-none">
                    <ShieldAlert size={36} className="text-slate-700 animate-pulse" />
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                        Aguardando Compilação de Filtros
                      </span>
                      <p className="text-[10px] text-slate-500 max-w-sm leading-normal">
                        Selecione etapas para gerar um roteiro de discussão. O resultado é didático e não constitui parecer técnico oficial, certificação ou autorização.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
