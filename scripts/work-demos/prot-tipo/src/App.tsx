import React, { useState, useEffect, lazy, Suspense } from "react";
import Header from "./components/Header";
import AlgorithmicBackground from "./components/AlgorithmicBackground";
import TabAuditoria from "./components/TabAuditoria";
const TabDeliberacao = lazy(() => import("./components/TabDeliberacao"));
const TabSimulacao = lazy(() => import("./components/TabSimulacao"));
const TabFundamentos = lazy(() => import("./components/TabFundamentos"));
import LatinGlossary from "./components/LatinGlossary";
import { motion, AnimatePresence } from "motion/react";
import { CaseAnalysis } from "./types";
import { STANDARD_CASES } from "./data";
import {
  Database,
  Users,
  Scale,
  Info,
  Cpu,
  Layers,
  Moon,
  Sun
} from "lucide-react";

export default function App() {
  const cases: CaseAnalysis[] = STANDARD_CASES;
  const [activeCaseId, setActiveCaseId] = useState<string | number | null>("inss_rural");

  // Current main navigation tab: "auditoria" | "deliberacao" | "simulacao" | "fundamentos"
  const [activeMainTab, setActiveMainTab] = useState<"auditoria" | "deliberacao" | "simulacao" | "fundamentos">("auditoria");

  // Current session phase: 1 (Pareceres), 2 (Avaliações Cruzadas), 3 (Acórdão Final)
  const [sessionPhase, setSessionPhase] = useState<1 | 2 | 3>(1);
  const [activeCounselorId, setActiveCounselorId] = useState<string>("lucas_mendes");
  const [endorsedOpinions, setEndorsedOpinions] = useState<Record<string, boolean>>({});

  // Custom generated document view: "recurso" | "lai"
  const [activeDocTab, setActiveDocTab] = useState<"recurso" | "lai">("recurso");
  const [copiedText, setCopiedText] = useState(false);

  const [theme, setTheme] = useState<"noturno" | "diurno">("noturno");

  useEffect(() => {
    if (theme === "diurno") {
      document.documentElement.classList.add("theme-diurno");
    } else {
      document.documentElement.classList.remove("theme-diurno");
    }
  }, [theme]);

  // Smooth scroll helper
  const scrollToAnchor = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Toggle citizen co-signing endorsements
  const toggleEndorsement = (personId: string) => {
    setEndorsedOpinions((prev) => ({
      ...prev,
      [personId]: !prev[personId]
    }));
  };

  // Handle case switching
  const handleSelectCase = (id: string | number) => {
    setActiveCaseId(id);
  };

  // Only prewritten fictional cases are available in the public static artifact.
  const activeCase = cases.find((c) => c.id === activeCaseId) || null;

  // Calculadora de pesos aproximados para visualizações rápidas
  const calculateStats = (c: CaseAnalysis) => {
    if (!c || !c.vieses) return { opacity: 0, vulnerability: 0, didacticIndex: 0 };
    const avgBias = c.vieses.reduce((acc, v) => acc + v.valor, 0) / (c.vieses.length || 1);
    const opac = c.id === "inss_rural" ? 95 : c.id === "bolsa_familia" ? 88 : c.id === "iptu_triplicado" ? 74 : 65;
    const didacticIndex = Math.min(100, Math.round((avgBias + opac) / 2 + 10));
    return {
      opacity: opac,
      vulnerability: Math.round(avgBias),
      didacticIndex
    };
  };

  const activeStats = activeCase ? calculateStats(activeCase) : { opacity: 0, vulnerability: 0, didacticIndex: 0 };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">

      {/* Structural matrix particle background */}
      <AlgorithmicBackground />

      {/* Styled Top Logo & Security Status Header */}
      <Header onShowFundamentos={() => setActiveMainTab("fundamentos")} />

      {/* Primary tabbed portal interface */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 relative z-10 pb-24">
        <aside className="rounded-xl border border-amber-500/30 bg-slate-900 p-4 text-sm text-slate-300 leading-relaxed" aria-label="Sobre a demonstração">
          <strong className="text-amber-400">Protótipo acadêmico · demonstração local.</strong>{" "}
          Casos e personagens fictícios, pareceres predefinidos e índices didáticos. Explore mecanismos de contestação sem inserir dados pessoais.
          <details className="mt-2 text-xs text-slate-400">
            <summary className="cursor-pointer text-amber-300">Sobre esta demonstração</summary>
            <p className="mt-2">Os textos não constituem decisões oficiais, previsões jurídicas ou resultados empíricos. Esta versão não recebe relatos pessoais e não consulta serviços de IA. Na experiência original, uma chamada ao Gemini simula quatro vozes; isso não equivale a quatro modelos independentes.</p>
          </details>
          <nav className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-mono" aria-label="Trabalhos relacionados">
            <a href="/trabalhos" className="text-amber-300 underline">← Voltar aos trabalhos</a>
            <a href="/seminario8-dever-poder/" className="text-amber-300 underline">Apresentações do seminário</a>
            <a href="/algoritmo-em-disputa/" className="text-amber-300 underline">Adaptação jurídica do llm-council</a>
            <a href="https://github.com/anavvanzin/prot-tipo" className="text-amber-300 underline" target="_blank" rel="noopener noreferrer">Código original</a>
          </nav>
        </aside>

        {/* Sticky Mobile-Friendly Segmented Control Bar */}
        <div className="sticky top-4 z-40 bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-2 sm:p-2.5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex flex-wrap gap-3 items-center justify-between transition-all">
          <div className="flex items-center gap-2 pl-2 shrink-0">
            <Scale className="text-amber-500 w-5 h-5 animate-pulse drop-shadow-md" />
            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-slate-300 uppercase hidden lg:inline">
              RITO CCA-26
            </span>
          </div>

          <div className="flex overflow-x-auto scrollbar-thin bg-slate-950 p-1 rounded-xl border border-slate-800/80 shadow-inner flex-1 md:flex-none">
            <button
              onClick={() => setActiveMainTab("auditoria")}
              className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                activeMainTab === "auditoria"
                  ? "bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]"
                  : "text-slate-400 hover:text-amber-400 hover:bg-slate-900/80"
              }`}
            >
              <Database size={14} />
              <span>1. AUDITORIA</span>
            </button>

            <button
              onClick={() => setActiveMainTab("deliberacao")}
              className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                activeMainTab === "deliberacao"
                  ? "bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]"
                  : "text-slate-400 hover:text-amber-400 hover:bg-slate-900/80"
              }`}
            >
              <Users size={14} />
              <span>2. DELIBERAÇÃO</span>
            </button>

            <button
              onClick={() => setActiveMainTab("simulacao")}
              className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                activeMainTab === "simulacao"
                  ? "bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]"
                  : "text-slate-400 hover:text-amber-400 hover:bg-slate-900/80"
              }`}
            >
              <Layers size={14} />
              <span>3. SIMULAÇÃO</span>
            </button>

            <button
              onClick={() => setActiveMainTab("fundamentos")}
              className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                activeMainTab === "fundamentos"
                  ? "bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]"
                  : "text-slate-400 hover:text-amber-400 hover:bg-slate-900/80"
              }`}
            >
              <Info size={14} />
              <span>4. DOUTRINA</span>
            </button>
          </div>

          <div className="pr-1 flex items-center gap-2 shrink-0">
            <button
              onClick={() => setTheme(theme === 'noturno' ? 'diurno' : 'noturno')}
              className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors"
              title={theme === 'noturno' ? "Mudar para Modo Diurno" : "Mudar para Modo Noturno"}
            >
              {theme === 'noturno' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <span className="hidden md:flex p-1.5 px-3 rounded text-[10px] sm:text-[11px] font-mono bg-slate-950/80 text-amber-400 border border-amber-500/30 font-bold select-none drop-shadow-sm items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              DEMO LOCAL
            </span>
          </div>
        </div>

        {/* Tab Render Conditionals with Smooth transitions */}
        <Suspense fallback={<p role="status" className="text-sm text-slate-400">Carregando demonstração…</p>}>
        <AnimatePresence mode="wait">
          {activeMainTab === "auditoria" && (
            <motion.div
              key="auditoria"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <TabAuditoria
                cases={cases}
                activeCaseId={activeCaseId}
                activeCase={activeCase}
                onSelectCase={handleSelectCase}
                activeStats={activeStats}
              />
            </motion.div>
          )}

          {activeMainTab === "deliberacao" && (
            <motion.div
              key="deliberacao"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <TabDeliberacao
                activeCase={activeCase}
                sessionPhase={sessionPhase}
                setSessionPhase={setSessionPhase}
                activeCounselorId={activeCounselorId}
                setActiveCounselorId={setActiveCounselorId}
                endorsedOpinions={endorsedOpinions}
                toggleEndorsement={toggleEndorsement}
                activeDocTab={activeDocTab}
                setActiveDocTab={setActiveDocTab}
                handleCopyText={handleCopyText}
                copiedText={copiedText}
                onGoToAuditoria={() => setActiveMainTab("auditoria")}
              />
            </motion.div>
          )}

          {activeMainTab === "simulacao" && (
            <motion.div
              key="simulacao"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <TabSimulacao />
            </motion.div>
          )}

          {activeMainTab === "fundamentos" && (
            <motion.div
              key="fundamentos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <TabFundamentos
                sessionPhase={sessionPhase}
                setSessionPhase={setSessionPhase}
                scrollToAnchor={scrollToAnchor}
              />
            </motion.div>
          )}
        </AnimatePresence>
        </Suspense>

      </main>

      {/* Cybernetic Floating Latin Glossary widget placed globally */}
      <LatinGlossary />

      {/* Academic Citation Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-xs text-slate-500 font-mono relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
          <p className="leading-relaxed">
            © 2026 Conselho de Contestação Algorítmica · Seminário VIII PPGD/UFSC.
          </p>
          <p className="mt-2 sm:mt-0 italic">
            Co-Apresentação: Ana Vitória Vanzin & Vinícius Oliveira.
          </p>
        </div>
      </footer>

    </div>
  );
}
