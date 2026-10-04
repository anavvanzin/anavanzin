import React from "react";
import { Users, Info, FileCheck, Copy, Check, Scale, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CaseAnalysis } from "../types";
import { BOARD_PERSONAS } from "../data";
import HandwrittenSignature from "./HandwrittenSignature";
import ExplainableTerm from "./ExplainableTerm";

interface Props {
  activeCase: CaseAnalysis | null;
  sessionPhase: 1 | 2 | 3;
  setSessionPhase: (phase: 1 | 2 | 3) => void;
  activeCounselorId: string;
  setActiveCounselorId: (id: string) => void;
  endorsedOpinions: Record<string, boolean>;
  toggleEndorsement: (personId: string) => void;
  activeDocTab: "recurso" | "lai";
  setActiveDocTab: (tab: "recurso" | "lai") => void;
  handleCopyText: (text: string) => void;
  copiedText: boolean;
  onGoToAuditoria: () => void;
}

export default function TabDeliberacao({
  activeCase,
  sessionPhase,
  setSessionPhase,
  activeCounselorId,
  setActiveCounselorId,
  endorsedOpinions,
  toggleEndorsement,
  activeDocTab,
  setActiveDocTab,
  handleCopyText,
  copiedText,
  onGoToAuditoria
}: Props) {
  if (!activeCase) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3" id="tab-deliberacao-fallback">
        <Users size={32} className="text-slate-600 mx-auto" />
        <h4 className="text-sm font-bold text-white font-mono uppercase">Nenhum Caso Selecionado</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Por favor, escolha um caso no <strong>Painel de Auditoria (Aba 1)</strong> primeiro para iniciar as deliberações simuladas.
        </p>
        <button
          onClick={onGoToAuditoria}
          className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-mono font-bold rounded-lg hover:bg-amber-400 transition cursor-pointer font-bold"
        >
          Ir para Auditoria
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-xs" id="tab-deliberacao-view">

      {/* Deliberative Council Roundtable Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

        {/* Session Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-mono text-[10px] uppercase font-bold tracking-widest">
              <Users size={12} />
              Colegiado fictício · exercício acadêmico
            </div>
            <h3 className="text-base font-bold text-white font-sans mt-0.5 uppercase tracking-wider">
              Deliberações Simuladas
            </h3>
          </div>

          {/* Stage selector (Phases) */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto shrink-0 font-mono text-[10px]">
            <button
              onClick={() => setSessionPhase(1)}
              className={`px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer ${sessionPhase === 1 ? "bg-amber-500 text-slate-950 font-bold animate-pulse" : "text-slate-400 hover:text-slate-100"}`}
            >
              1. Pareceres
            </button>
            <button
              onClick={() => setSessionPhase(2)}
              className={`px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer ${sessionPhase === 2 ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-100"}`}
            >
              2. Cruzada
            </button>
            <button
              onClick={() => setSessionPhase(3)}
              className={`px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer ${sessionPhase === 3 ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-100"}`}
            >
              3. Acórdão
            </button>
          </div>
        </div>

        {/* Rendering Active Phase inside tab */}
        <div className="p-6 text-xs">
          {sessionPhase === 1 && (
            <div className="space-y-6">
              <div className="p-3.5 bg-blue-950/20 border border-blue-900/30 text-blue-300 rounded-lg text-xs leading-relaxed flex gap-2.5 font-mono">
                <Info size={16} className="shrink-0 mt-0.5 text-blue-400" />
                <span>Fase d'Assentada: Interaja com o Colegiado abaixo. Clique nas cadeiras da Mesa de Deliberação para inspecionar os pareceres predefinidos e simular concordância com seus argumentos.</span>
              </div>

              {/* Interactive Roundtable Visual Console */}
              <div className="relative p-5 bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/85 rounded-2xl overflow-hidden shadow-inner">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500/5 blur-3xl rounded-full pointer-events-none" />

                {/* Section Title */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                    Mesa Consultiva de Votação (Clique p/ Selecionar Conselheiro)
                  </span>
                  <span className="text-[9.5px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800/50">
                    Quórum: 4/4 Conselheiros Ativos
                  </span>
                </div>

                {/* Chambers layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
                  {BOARD_PERSONAS.map((person) => {
                    const isSelected = activeCounselorId === person.id;
                    const isSubscribed = endorsedOpinions[person.id];

                    let themeColor = "border-emerald-500/40 text-emerald-400 bg-emerald-950/20";
                    if (person.id === "clara_santos") themeColor = "border-blue-500/40 text-blue-400 bg-blue-950/20";
                    if (person.id === "ricardo_hahn") themeColor = "border-amber-500/40 text-amber-400 bg-amber-950/20";
                    if (person.id === "arnaldo_rocha") themeColor = "border-rose-500/40 text-rose-400 bg-rose-950/20";

                    return (
                      <button
                        key={person.id}
                        onClick={() => setActiveCounselorId(person.id)}
                        className={`p-3 rounded-xl border transition-all duration-300 text-left relative flex flex-col justify-between h-32 select-none cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 ring-2 ring-amber-500/60 shadow-[0_4px_20px_rgba(245,158,11,0.1)] border-amber-500/80 scale-[1.02]"
                            : "bg-slate-950/50 border-slate-900 hover:border-slate-800 hover:bg-slate-950/90"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                        )}

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{person.avatar}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-mono font-bold uppercase tracking-wider ${themeColor}`}>
                              Assento {person.id === "lucas_mendes" ? "01" : person.id === "clara_santos" ? "02" : person.id === "ricardo_hahn" ? "03" : "04"}
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-slate-100 font-sans tracking-tight block truncate">
                            {person.name}
                          </h4>
                          <p className="text-[9px] text-slate-400 font-mono tracking-tight leading-normal h-6 line-clamp-2">
                            {person.role}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[8px] font-mono">
                          <span className="text-slate-500">Voto Concluído</span>
                          {isSubscribed ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                              ✓ CONCORDÂNCIA SIMULADA
                            </span>
                          ) : (
                            <span className="text-amber-500/70">CLIQUE P/ PARECER</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Desktop roundtable decorations */}
                <div className="hidden md:flex justify-stretch items-center gap-1.5 mt-5 px-10">
                  <div className="h-[1.5px] bg-gradient-to-r from-transparent to-slate-800 flex-1" />
                  <div className="p-1 px-3 bg-slate-950 border border-slate-800 rounded-full text-[8.5px] text-slate-400 font-mono tracking-wider text-center flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Mesa de Deliberações do Supremo Colegiado
                  </div>
                  <div className="h-[1.5px] bg-gradient-to-l from-transparent to-slate-800 flex-1" />
                </div>
              </div>

              {/* Counselor Dossier Frame */}
              {(() => {
                const activePerson = BOARD_PERSONAS.find(p => p.id === activeCounselorId) || BOARD_PERSONAS[0];
                const isSubscribed = endorsedOpinions[activePerson.id];
                const opKeys = {
                  lucas_mendes: activeCase.personas.defensoria,
                  clara_santos: activeCase.personas.cientista,
                  ricardo_hahn: activeCase.personas.admin,
                  arnaldo_rocha: activeCase.personas.cidadao
                };
                const opinionText = opKeys[activePerson.id as keyof typeof opKeys] || "Nenhum parecer disponível.";

                let deptTitle = "PERSONA FICTÍCIA · PERSPECTIVA DE DEFESA DE DIREITOS";
                let dossierSeal = "⚖️ DEMO-1";
                let signatureName = "Lucas Mendes de Oliveira Salles";
                let sealColor = "border-emerald-500/30 text-emerald-400 bg-emerald-950/25";

                if (activePerson.id === "clara_santos") {
                  deptTitle = "PERSONA FICTÍCIA · PERSPECTIVA DE CIÊNCIA DE DADOS";
                  dossierSeal = "📊 LAB-AUDIT";
                  signatureName = "Profª Dra. Clara Heloísa Santos";
                  sealColor = "border-blue-500/30 text-blue-400 bg-blue-950/25";
                } else if (activePerson.id === "ricardo_hahn") {
                  deptTitle = "PERSONA FICTÍCIA · PERSPECTIVA DE GESTÃO PÚBLICA";
                  dossierSeal = "🏢 SGP-LEG";
                  signatureName = "Dr. Ricardo Guilherme Hahn";
                  sealColor = "border-amber-500/30 text-amber-400 bg-amber-950/25";
                } else if (activePerson.id === "arnaldo_rocha") {
                  deptTitle = "PERSONA FICTÍCIA · PERSPECTIVA CIDADÃ";
                  dossierSeal = "👥 SOC-CIV";
                  signatureName = "Conselheiro Arnaldo Alves da Rocha";
                  sealColor = "border-rose-500/30 text-rose-450 bg-rose-950/25";
                }

                return (
                  <motion.div
                    key={activePerson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute -bottom-12 -right-12 text-slate-800/10 text-[110px] select-none font-bold font-mono">
                      ASSENTADA
                    </div>

                    <div className="border-b border-slate-800 pb-5 mb-5 relative z-10">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                        Documento didático • Parecer predefinido
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1.5 pb-2">
                        <div>
                          <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-widest font-black block">
                            {deptTitle}
                          </span>
                          <h4 className="text-sm font-extrabold text-white mt-1">
                            PARECER TÉCNICO-ADMINISTRATIVO • ID {activePerson.id.toUpperCase()}-26
                          </h4>
                        </div>
                        <span className={`self-start sm:self-auto px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${sealColor}`}>
                          {dossierSeal}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                      <div className="space-y-4 md:col-span-1 border-r border-slate-800/80 pr-4 md:block hidden font-mono text-[10px] text-slate-400">
                        <div className="space-y-1">
                          <span className="text-slate-500 block uppercase">Eixo Temático:</span>
                          <span className="text-slate-300 font-sans leading-normal block font-semibold">{activePerson.axis}</span>
                        </div>
                        <div className="space-y-1 pt-3 border-t border-slate-950">
                          <span className="text-slate-500 block uppercase">Tese Defendida:</span>
                          <span className="text-slate-300 font-sans leading-normal block">Prevalência do letramento e dignidade humana contra a burocracia do robô opaco.</span>
                        </div>
                      </div>

                      <div className="md:col-span-3 space-y-4">
                        <div className="bg-slate-950/40 border border-slate-950 rounded-xl p-4 border-l-2 border-amber-500">
                          <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium whitespace-pre-line italic">
                            "{opinionText}"
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-950 text-[10.5px]">
                          <div className="space-y-0.5">
                            <span className="text-slate-500 font-mono text-[9px] block">Referências acadêmicas evocadas no exercício:</span>
                            <span className="text-slate-300 font-sans max-w-sm block leading-relaxed">
                              Fundamenta-se em estudos acadêmicos correlacionados a <strong className="text-slate-200 font-medium">{activePerson.reference}</strong>.
                            </span>
                          </div>

                          {/* Action button to endorse opinion with gold neon signature */}
                          <button
                            onClick={() => toggleEndorsement(activePerson.id)}
                            className={`px-3.5 py-2 rounded-lg font-mono font-bold text-[11px] select-none transition-all duration-300 shrink-0 flex items-center gap-1.5 border border-l-2 cursor-pointer ${
                              isSubscribed
                                ? "bg-amber-500/10 text-amber-500 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-95"
                                : "bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500/70 hover:text-white"
                            }`}
                          >
                            {isSubscribed ? (
                              <>
                                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                                CONCORDÂNCIA SIMULADA
                              </>
                            ) : (
                              <>
                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                SIMULAR CONCORDÂNCIA
                              </>
                            )}
                          </button>
                        </div>

                        {/* Golden Neon Digital Handwritten Signature Animation Block */}
                        <div className="flex flex-col items-end pt-3 border-t border-slate-950/50 space-y-2">
                          {isSubscribed ? (
                            <div className="flex flex-col items-end space-y-1">
                              <HandwrittenSignature counselorId={activePerson.id} />
                              <span className="text-[12px] text-amber-400 font-serif font-bold italic block tracking-wide text-right drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]">
                                {signatureName} (personagem fictício · concordância local)
                              </span>
                            </div>
                          ) : (
                            <span className="text-[13px] text-teal-400 font-serif font-semibold italic opacity-85 block">
                              {signatureName}
                            </span>
                          )}
                          <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider block text-right select-none">
                            ASSINATURA FICTÍCIA · RECURSO GRÁFICO DO EXERCÍCIO
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </div>
          )}

          {sessionPhase === 2 && (
            <div className="space-y-6">
              <div className="p-3 bg-amber-950/20 border border-amber-900/30 text-amber-300 rounded-lg text-xs leading-relaxed flex gap-2 font-mono">
                <Info size={16} className="shrink-0 mt-0.5" />
                <span>Fase 2: Votação anônima cruzada simulada. Conselheiros definem quem melhor salvaguardou a dignidade do indivíduo.</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
                  Ranking Consolidado da Sessão
                </h4>

                <div className="space-y-2 font-sans text-xs">
                  {activeCase.rankings && activeCase.rankings.length > 0 ? (
                    activeCase.rankings.map((rank, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-900/30 border border-slate-900 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <span className="h-6 w-6 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold font-mono text-xs flex items-center justify-center">
                            #{rank.pos}
                          </span>
                          <div>
                            <p className="font-semibold text-slate-300">{rank.name}</p>
                            <p className="text-[10px] text-slate-500 italic mt-0.5">{rank.comment}</p>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-1 rounded">
                          Nota ilustrativa: {rank.score}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">Ranking em elaboração.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/30 border border-slate-900 rounded-xl text-xs space-y-2">
                  <span className="text-[9px] font-mono uppercase font-bold text-emerald-400">Dr. Lucas mendes avalia:</span>
                  <p className="text-slate-400 italic font-serif">
                    "O parecer de Dados (Clara) traz precisão fática preciosa, mas o de Gestão (Ricardo) arrisca rebaixar direitos por teses utilitaristas de escala fiscal, o que rejeito."
                  </p>
                </div>
                <div className="p-4 bg-slate-950/30 border border-slate-900 rounded-xl text-xs space-y-2">
                  <span className="text-[9px] font-mono uppercase font-bold text-blue-400">Profª Clara santos avalia:</span>
                  <p className="text-slate-400 italic font-serif">
                    "O parecer jurídico (Lucas) consubstancia perfeitamente o vício do contraditório, embora eu reforce que a ausência de vistoria valida a falha na qualidade de dados de treino."
                  </p>
                </div>
              </div>
            </div>
          )}

          {sessionPhase === 3 && (
            <div className="space-y-6">
              <div className="text-center py-4 border-b border-slate-800">
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest block font-bold">
                  Tribunal de Contestabilidade Algorítmica
                </span>
                <h4 className="text-xl font-serif text-white mt-1">
                  <ExplainableTerm term="acórdão">Acórdão</ExplainableTerm> de Julgamento Coletivo
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">
                  Documento fictício · Sem efeito jurídico
                </span>
              </div>

              <div className="space-y-5 text-xs font-sans text-slate-300">

                <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-lg border border-slate-900">
                  <h5 className="font-mono uppercase text-amber-500 text-[10px] font-bold tracking-widest">
                    1. Síntese do Julgado
                  </h5>
                  <p className="text-slate-300 leading-relaxed font-sans mt-0.5">
                    {activeCase.final.sintese}
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-mono uppercase text-slate-400 text-[10px] font-bold tracking-widest">
                    2. Consenso Técnico-Jurídico
                  </h5>
                  <p className="text-slate-400 leading-relaxed mt-0.5">
                    {activeCase.final.consenso}
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-mono uppercase text-slate-400 text-[10px] font-bold tracking-widest">
                    3. Dissenso no Colegiado
                  </h5>
                  <p className="text-slate-400 leading-relaxed mt-0.5">
                    {activeCase.final.dissenso}
                  </p>
                </div>

                <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-lg border border-slate-900">
                  <h5 className="font-mono uppercase text-slate-400 text-[10px] font-bold tracking-widest flex items-center gap-1">
                    4. <ExplainableTerm term="dogmática">Fundamentação e Dogmática Jurídica</ExplainableTerm>
                  </h5>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs mt-1">
                    {activeCase.final.fundamentacao}
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-mono uppercase text-amber-500 text-[10px] font-bold tracking-widest">
                    5. Dispositivo & Recomendações
                  </h5>
                  <div className="text-slate-300 space-y-2 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-900 mt-1">
                    {activeCase.final.recomendacao.split('\n').map((bullet, bIdx) => (
                      <p key={bIdx} className="flex items-start gap-1.5 leading-relaxed text-slate-300">
                        <span className="text-amber-500 mt-1 shrink-0">▸</span>
                        <span>{bullet.trim()}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-red-950/25 border-l-4 border-red-500 text-red-300 rounded-r-lg">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase font-bold text-red-400">
                    <ShieldAlert size={16} />
                    alerta de conformidade estatal
                  </div>
                  <p className="mt-1 font-serif text-slate-400 leading-relaxed text-xs">
                    {activeCase.final.alerta}
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* Minutas de Resistência / Technical Appeals Drafting */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <FileCheck size={18} className="text-amber-400" />
              Minutas de Resistência Administrativa
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Minutas ilustrativas dos casos fictícios. O uso em um caso concreto depende de revisão jurídica e da legislação aplicável.
            </p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto font-mono text-[9px]">
            <button
              onClick={() => setActiveDocTab("recurso")}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${activeDocTab === "recurso" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold" : "text-slate-500 hover:text-slate-300"}`}
            >
              Recurso Anulando Falso Positivo
            </button>
            <button
              onClick={() => setActiveDocTab("lai")}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${activeDocTab === "lai" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold" : "text-slate-500 hover:text-slate-300"}`}
            >
              Requisição de Algoritmo (LAI)
            </button>
          </div>
        </div>

        <div className="space-y-3 pb-2">
          <div className="flex justify-between items-center bg-slate-950 px-4 py-2 border-t border-x border-slate-800 rounded-t-xl text-[10px] text-slate-500 font-mono">
            <span>{activeDocTab === "recurso" ? "RECURSO-ANULACAO-DRAFT.txt" : "SOLICITACAO-LAI-DRAFT.txt"}</span>
            <button
              onClick={() => handleCopyText(activeDocTab === "recurso" ? activeCase.final.minutaRecurso : activeCase.final.pedidoLAI)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700 hover:text-white rounded transition text-[10.5px] cursor-pointer font-bold font-mono"
            >
              {copiedText ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copiar Minuta</span>
                </>
              )}
            </button>
          </div>

          <div className="font-mono text-[10px] bg-slate-950 text-slate-300 p-5 rounded-b-xl border-b border-x border-slate-800 h-[220px] overflow-y-auto leading-relaxed whitespace-pre-line select-all scrollbar-thin">
            {activeDocTab === "recurso" ? activeCase.final.minutaRecurso : activeCase.final.pedidoLAI}
          </div>
        </div>
      </div>

    </div>
  );
}
