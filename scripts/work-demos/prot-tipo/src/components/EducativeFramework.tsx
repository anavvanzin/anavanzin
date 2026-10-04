import React, { useState } from "react";
import { BookOpen, User, Eye, Sparkles, MessageCircleCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ExplainableTerm from "./ExplainableTerm";

export default function EducativeFramework() {
  const [comunicacaoModo, setComunicacaoModo] = useState<"gelido" | "humano">("gelido");

  return (
    <div className="space-y-8 mt-8">
      <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl" id="doc-framework">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Camada Propedêutica: Educação para o Cidadão
            </h2>
            <p className="text-xs text-slate-400">
              Aprenda sobre seus direitos básicos contra abusos de inteligências artificiais estatais.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Literacia Algorítmica Panel */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-display">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full inline-block" />
              1. Literacia Algorítmica: Você sabe que foi um robô?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Nos casos fictícios deste seminário, benefícios são afetados por decisões automatizadas. Para discutir a <ExplainableTerm term="ampla defesa">ampla defesa</ExplainableTerm>, é preciso compreender quais dados e critérios foram usados e quais canais de contestação existem.
            </p>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider mb-2">
                Diferença entre Transparência e Inteligibilidade:
              </h4>
              <div className="space-y-3 font-sans text-xs">
                <div className="flex gap-2.5 items-start">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <p className="text-slate-400 leading-normal text-[11px]">
                    <strong className="text-slate-300">Apenas Transparência:</strong> O governo publica o código do sistema no Github ou planilhas com milhões de linhas. O cidadão vulnerável continua sem entender seu caso.
                  </p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-emerald-405 font-bold shrink-0">✓</span>
                  <p className="text-slate-300 leading-normal text-[11px]">
                    <strong className="text-white">Inteligibilidade Real:</strong> O governo explica em português simples, livre de termos técnicos, <span className="italic text-amber-400">quais dados exatos</span> usou, <span className="italic text-amber-400">qual regra</span> aplicou e <span className="italic text-amber-400">como</span> mudar a resposta.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Direito à Notícia Humana Panel */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-display">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full inline-block" />
              2. Notícia Humana para Vulneráveis — Proposta do Seminário
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Uma notificação incompreensível pode gerar desamparo. O seminário defende a <ExplainableTerm term="notícia humana">notícia humana</ExplainableTerm> como forma de comunicar e mediar decisões difíceis com clareza e acolhimento. A Lei 14.129/2021, art. 14, preserva o atendimento presencial; não estabelece uma garantia automática de reversão do benefício.
            </p>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              <div className="flex border-b border-slate-800 bg-slate-950/80">
                <button
                  onClick={() => setComunicacaoModo("gelido")}
                  className={`flex-1 py-2 text-xs font-mono font-bold transition-all duration-200 ${comunicacaoModo === "gelido" ? "bg-rose-955/20 text-rose-400 border-b-2 border-rose-500" : "text-slate-500 hover:text-slate-300"}`}
                >
                  Comunicação Gélida (Robô)
                </button>
                <button
                  onClick={() => setComunicacaoModo("humano")}
                  className={`flex-1 py-2 text-xs font-mono font-bold transition-all duration-200 ${comunicacaoModo === "humano" ? "bg-emerald-955/20 text-emerald-400 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300"}`}
                >
                  Cuidado da Notícia Humana
                </button>
              </div>

              <div className="p-4 min-h-[110px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {comunicacaoModo === "gelido" ? (
                    <motion.div
                      key="gelido"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-1 text-xs"
                    >
                      <div className="flex items-center gap-2 text-red-600 font-mono font-bold uppercase tracking-wider text-[10px]">
                        <MessageCircleCode size={14} className="text-rose-500" />
                        SISTEMA :: ERROR_403_INCONSISTENCY
                      </div>
                      <p className="font-mono text-slate-450 mt-1">
                        "STATUS: BLOQUEADO. Seu benefício foi excluído por INCONSISTÊNCIA CADASTRAL no banco de dados CNIS/eSocial. Faça nova tentativa em 45 dias se discordar."
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="humano"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-1.5 text-xs text-slate-300"
                    >
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <User size={14} className="text-emerald-400" />
                        Acomodação Humana pela Assistência Social (CRAS)
                      </div>
                      <p className="italic text-slate-300 leading-relaxed font-sans text-[11px]">
                        "Dona Maria, neste exemplo fictício encontramos uma divergência de sobrenome entre os cadastros. <strong>Vamos ajudar a conferir os dados</strong>, explicar quais documentos podem esclarecer a situação e indicar como solicitar revisão. O resultado depende da análise e das regras do benefício."
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
