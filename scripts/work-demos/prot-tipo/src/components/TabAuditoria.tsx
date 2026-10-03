import React from "react";
import { Sparkles, Info, ShieldAlert, Database, TrendingUp, BarChart2 } from "lucide-react";
import { motion } from "motion/react";
import { CaseAnalysis } from "../types";
import CaseSelector from "./CaseSelector";
import AlgorithmicPipelineInfographic from "./AlgorithmicPipelineInfographic";
import StateDecisionMatrix from "./StateDecisionMatrix";
import ExplainableTerm from "./ExplainableTerm";
import BiasHistoricalChart from "./BiasHistoricalChart";
import ReportAbuseForm from "./ReportAbuseForm";

interface Props {
  cases: CaseAnalysis[];
  activeCaseId: string | number | null;
  activeCase: CaseAnalysis | null;
  onSelectCase: (id: string | number) => void;
  activeStats: { opacity: number; vulnerability: number; didacticIndex: number };
}

export default function TabAuditoria({
  cases,
  activeCaseId,
  activeCase,
  onSelectCase,
  activeStats
}: Props) {
  return (
    <div className="space-y-8 animate-fadeIn" id="tab-auditoria-view">
      {/* Intro Banner */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider font-mono">
            <Sparkles size={12} />
            Seminário de Direito Administrativo Digital 2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display max-w-2xl leading-tight">
            A decisão estatal automatizada na mesa de julgamento.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-sans text-[14px]">
            O mesmo <ExplainableTerm term="erário">erário</ExplainableTerm> que edita os decretos de transparência pública, <ExplainableTerm term="lgpd">LGPD</ExplainableTerm> e devido rito de processo (Regulador) impõe sistemas algorítmicos herméticos contra o cidadão necessitado (Regulado). O <strong className="text-amber-400">Conselho de Contestação Algorítmica</strong> é uma proposta teórica materializada para devolver o <ExplainableTerm term="contraditório">contraditório</ExplainableTerm> à arena digital.
          </p>
        </div>
      </section>

      {/* Core Control / Selector */}
      <CaseSelector
        cases={cases}
        activeCaseId={activeCaseId}
        onSelectCase={onSelectCase}
      />

      {activeCase && (
        <div className="space-y-8 animate-fadeIn">

          {/* Interactive Decision Pipeline / Dynamic Visual Simulator */}
          <AlgorithmicPipelineInfographic activeCase={activeCase} />

          {/* Case Background & Context Card */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative shadow-inner">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                  Ato sob Contestação:
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-0.5">
                  {activeCase.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-950/80 text-red-400 border border-red-800/50 flex items-center gap-1.5 font-mono">
                  <ShieldAlert size={13} />
                  DECISÃO CONTESTADA · FICTÍCIA
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  Prot: {String(activeCase.id).toUpperCase().replace("_", "-")}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Info size={14} className="text-blue-400" />
                Narrativa fictícia do exercício:
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                {activeCase.context}
              </p>
            </div>
          </section>

          {/* Live Diagnostic Radial Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Gauge 1 */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:border-amber-500/40 hover:shadow-[0_4px_30px_rgba(245,158,11,0.04)] transition-all duration-300 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
              <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="44" cy="44" r="32" className="stroke-slate-950 fill-none" strokeWidth="5" />
                  <circle
                    cx="44"
                    cy="44"
                    r="32"
                    className="stroke-amber-400 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={(2 * Math.PI * 32) - (activeStats.didacticIndex / 100) * (2 * Math.PI * 32)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-slate-100 font-mono select-none">{activeStats.didacticIndex}/100</span>
                  <span className="text-[8px] text-amber-400 font-mono font-bold tracking-widest select-none uppercase">ÍNDICE</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 flex flex-col items-center sm:items-start w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Índice didático</span>
                  <span className="p-1 px-1.5 rounded text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold whitespace-nowrap">⚖️ ILUSTRATIVO</span>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans mt-0.5">
                  Escala pedagógica calculada com pesos fixos para explorar o cenário. Não estima chance de êxito ou anulação judicial.
                </p>
              </div>
            </div>

            {/* Gauge 2 */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:border-rose-500/40 hover:shadow-[0_4px_30px_rgba(239,68,68,0.04)] transition-all duration-300 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-3xl rounded-full pointer-events-none" />
              <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="44" cy="44" r="32" className="stroke-slate-950 fill-none" strokeWidth="5" />
                  <circle
                    cx="44"
                    cy="44"
                    r="32"
                    className="stroke-rose-500 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={(2 * Math.PI * 32) - (activeStats.opacity / 100) * (2 * Math.PI * 32)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-slate-100 font-mono select-none">{activeStats.opacity}/100</span>
                  <span className="text-[7.5px] text-rose-400 font-mono font-bold tracking-widest select-none uppercase">OPACO</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 flex flex-col items-center sm:items-start w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Opacidade</span>
                  <span className="p-1 px-1.5 rounded text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-bold whitespace-nowrap">⚫ CAIXA PRETA</span>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans mt-0.5">
                  Peso ilustrativo da opacidade no caso fictício, sem medição de um sistema ou órgão público.
                </p>
              </div>
            </div>

            {/* Gauge 3 */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:border-blue-500/40 hover:shadow-[0_4px_30px_rgba(59,130,246,0.04)] transition-all duration-300 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
              <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="44" cy="44" r="32" className="stroke-slate-950 fill-none" strokeWidth="5" />
                  <circle
                    cx="44"
                    cy="44"
                    r="32"
                    className="stroke-blue-400 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={(2 * Math.PI * 32) - (activeStats.vulnerability / 100) * (2 * Math.PI * 32)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-slate-100 font-mono select-none">{activeStats.vulnerability}/100</span>
                  <span className="text-[8px] text-blue-400 font-mono font-bold tracking-widest select-none uppercase">VIÉS</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 flex flex-col items-center sm:items-start w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Risco de Viés</span>
                  <span className="p-1 px-1.5 rounded text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold whitespace-nowrap">👥 DEVIATION</span>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans mt-0.5">
                  Peso ilustrativo atribuído a aspectos de vulnerabilidade no cenário, sem estatística empírica.
                </p>
              </div>
            </div>
          </div>

          {/* SENSATIONAL CODE DECISION MATRIX (State hidden rule analysis) */}
          <StateDecisionMatrix activeCase={activeCase} />

          {/* Double column grid statistical analyses */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column (5/12) */}
            <div className="lg:col-span-5 space-y-8">

              {/* Var Map */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 font-sans uppercase tracking-wider">
                  <Database size={16} className="text-blue-400" />
                  Mapa de Dados e Inconsistências
                </h3>

                <div className="space-y-3 text-xs">
                  {activeCase.dados && activeCase.dados.length > 0 ? (
                    activeCase.dados.map((d, index) => {
                      let statusColor = "bg-slate-800 text-slate-400 border-slate-700";
                      if (d.status === "ok") statusColor = "bg-emerald-950/60 text-emerald-400 border-emerald-900/50";
                      if (d.status === "warn") statusColor = "bg-amber-950/60 text-amber-400 border-amber-900/50";
                      if (d.status === "bad") statusColor = "bg-red-950/60 text-red-400 border-red-900/50";

                      return (
                        <div key={index} className="p-3 bg-slate-950/40 border border-slate-900 rounded-lg flex justify-between items-start gap-3">
                          <div>
                            <p className="font-semibold text-slate-200">{d.campo}</p>
                            <span className="text-[10px] text-slate-500 font-mono">Base citada no cenário: {d.fonte}</span>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-mono leading-tight border rounded-full ${statusColor} shrink-0`}>
                            {d.statusLabel}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-slate-500 italic">Nenhum mapeamento de variáveis estruturado.</p>
                  )}
                </div>
              </div>

              {/* Bias indicators */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 font-sans uppercase tracking-wider">
                  <TrendingUp size={16} className="text-rose-400" />
                  Pesos didáticos de viés · 0–100
                </h3>

                <div className="space-y-3.5 border-b border-slate-800 pb-5">
                  {activeCase.vieses && activeCase.vieses.length > 0 ? (
                    activeCase.vieses.map((v, index) => {
                      let fillAccent = "bg-blue-500";
                      if (v.nivel === "high") fillAccent = "bg-rose-500";
                      if (v.nivel === "med") fillAccent = "bg-amber-500";
                      if (v.nivel === "low") fillAccent = "bg-emerald-500";

                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300 font-medium">{v.label}</span>
                            <span className="font-mono text-slate-500 text-[11px]">{v.valor}/100</span>
                          </div>
                          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                            <div className={`h-full ${fillAccent} rounded-full transition-all duration-500`} style={{ width: `${v.valor}/100` }} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-slate-500 italic">Não há indicadores de viés computados.</p>
                  )}
                </div>

                <div className="pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5 font-bold">
                    <BarChart2 size={13} className="text-teal-400" strokeWidth={2.5} />
                    Histórico e Evolução por Município
                  </h4>
                  <BiasHistoricalChart />
                </div>
              </div>

            </div>

            {/* Right Column (7/12) */}
            <div className="lg:col-span-7 space-y-8">
              <ReportAbuseForm />
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
