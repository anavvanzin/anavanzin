import React, { useState } from "react";
import {
  BookHeart,
  Search,
  HelpCircle,
  Check,
  Sparkles,
  Award,
  Info,
  Scale,
  MessageSquareReply,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GlossaryItem {
  term: string;
  juridiques: string; // The complex definition
  simplified: string; // Simple citizen explanation
  relevance: string; // Practical usage or why it matters
  category: "Garantia Constitucional" | "Proteção de Dados" | "Erro do Robô" | "Gestão Pública";
}

const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: "Contraditório Prévio",
    juridiques: "Princípio constitucional instrumental clássico assecuratório do direito de manifestação e influência prévia do administrado na formação da convicção da autoridade judicante.",
    simplified: "É o direito de conhecer os fundamentos de uma decisão e apresentar sua versão e seus documentos, conforme o procedimento aplicável.",
    relevance: "Neste seminário, defendemos salvaguardas de manifestação antes de decisões restritivas. A validade de um corte ou de uma multa depende da análise do procedimento e das normas do caso concreto.",
    category: "Garantia Constitucional"
  },
  {
    term: "Artigo 20 da LGPD",
    juridiques: "Dispositivo normativo que outorga ao titular o direito de postular a revisão de decisões tomadas unicamente com base em tratamento automatizado de dados que afetem seus interesses.",
    simplified: "Você pode solicitar revisão de uma decisão baseada unicamente em tratamento automatizado de seus dados pessoais que afete seus interesses. A lei vigente não exige expressamente que a revisão seja feita por pessoa natural.",
    relevance: "O §1º prevê informações claras sobre critérios e procedimentos, respeitados os segredos comercial e industrial. Se esses segredos fundamentarem a negativa de informação, o §2º permite auditoria pela ANPD para verificar discriminação. A intervenção humana é uma salvaguarda defendida neste trabalho.",
    category: "Proteção de Dados"
  },
  {
    term: "Viés de Proxy (Associação Indireta)",
    juridiques: "Divergência sistêmica decorrente de inferência indireta fundamentada em correlações estatísticas espúrias aplicadas como representações (proxies) em bases de dados terceirizadas.",
    simplified: "É quando o robô usa um dado indireto (como o CEP do seu bairro, ou os bens de quem é dono do terreno onde você mora) para assumir bobagens sobre a sua renda real.",
    relevance: "Reconhecer uma associação indireta ajuda a formular perguntas sobre a pertinência dos dados. A presença de uma proxy, por si só, não prova discriminação.",
    category: "Erro do Robô"
  },
  {
    term: "Notícia Humana",
    juridiques: "Proposta ética de mediação e acolhimento na comunicação de decisões estatais restritivas, discutida a partir da dignidade humana.",
    simplified: "É a defesa de que decisões difíceis sejam comunicadas de forma respeitosa e compreensível, com acesso a ajuda humana quando necessário.",
    relevance: "Fustiga o descaso com idosos e analfabetos digitais que sofrem de angústia e pânico ao receberem negativas sem entenderem o porquê.",
    category: "Garantia Constitucional"
  },
  {
    term: "Litigância Reversa",
    juridiques: "Fenômeno de ineficiência burocrática caracterizado pelo aumento de demandas recursais judiciais e custos operacionais devido à recalcitrância e robotização abusiva na triagem em lote.",
    simplified: "É a hipótese de que economizar na análise inicial pode gerar mais recursos e processos judiciais quando a automação erra.",
    relevance: "Permite discutir custos de contestação e qualidade do atendimento. Este protótipo não mede custos nem demonstra economia ou aumento de despesas.",
    category: "Gestão Pública"
  },
  {
    term: "Ampla Defesa",
    juridiques: "Garantia irrestrita da faculdade de produção ampla e exaustiva de elementos de prova lícita, contraditas e justificação a fim de elidir presunções unilaterais do ente público.",
    simplified: "O seu direito pleno de usar qualquer prova legal (testemunhas, fotos, carimbos, recibos antigos, faturas de luz) para destruir mentiras geradas por cruzamento errado de dados automáticos.",
    relevance: "Ao recorrer, anexe cartas de sindicatos, vizinhos e notas antigas. O Estado não pode asfixiar essas provas manuais alegando que elas não estão em 'formatos de sistema'.",
    category: "Garantia Constitucional"
  },
  {
    term: "Acórdão e Súmula Vinculante",
    juridiques: "Acórdão é uma decisão colegiada. Súmula vinculante é um enunciado aprovado pelo STF nos termos do art. 103-A da Constituição, com efeitos próprios; os conceitos não são equivalentes.",
    simplified: "Uma decisão de um grupo de julgadores não vira automaticamente uma regra geral obrigatória. Recursos e efeitos dependem do órgão e do procedimento.",
    relevance: "A Fase 3 deste conselho simulado produz apenas um parecer didático, sem força vinculante, certificação ou efeitos jurídicos.",
    category: "Gestão Pública"
  },
  {
    term: "Erário",
    juridiques: "Conjunto de recursos financeiros, patrimônio público e receitas orçamentárias de propriedade do tesouro estatal de um ente soberano ou federativo.",
    simplified: "O dinheiro do povo que é administrado pelo governo. É o cofre público financiado pelos impostos que você paga diariamente.",
    relevance: "Explicar que robôs defeituosos causam rombo financeiro no erário devido a indenizações por danos morais ajuda a conscientizar a gestão fiscal sobre riscos de IA.",
    category: "Gestão Pública"
  }
];

export default function LegalGlossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const categories = ["Todos", "Garantia Constitucional", "Proteção de Dados", "Erro do Robô", "Gestão Pública"];

  const filteredItems = GLOSSARY_ITEMS.filter(item => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.juridiques.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.simplified.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === "Todos" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mt-8" id="legal-glossary">
      {/* Banner */}
      <div className="p-6 bg-gradient-to-r from-teal-500/10 via-slate-950 to-amber-500/5 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-widest font-mono">
              <BookHeart size={12} className="text-teal-400" />
              Juridiquês Descomplicado
            </span>
            <h2 className="text-base font-bold text-white mt-1.5 font-display flex items-center gap-2">
              Dicionário do Cidadão contra o Silêncio do Robô
            </h2>
            <p className="text-xs text-slate-400">
              Traduza termos técnicos do seminário em perguntas e possibilidades de contestação. As explicações são didáticas e dependem do caso concreto.
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              Textos oficiais: <a className="underline" href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noreferrer">LGPD</a>, <a className="underline" href="https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14129.htm" target="_blank" rel="noreferrer">Lei do Governo Digital</a> e <a className="underline" href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm" target="_blank" rel="noreferrer">Constituição Federal</a>.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-500 font-mono block">Direito de Compreensão</span>
            <span className="text-teal-400 font-mono text-[11px] font-semibold">Art. 5º da CF/88 (Informação)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="p-6 border-b border-slate-800/60 bg-slate-950/40 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Pesquisar termo jurídico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          </div>

          <div className="md:col-span-8 flex flex-wrap gap-1.5 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 text-[11px] rounded transition-all font-sans ${
                  activeCategory === cat
                    ? "bg-teal-950/80 text-teal-300 border border-teal-700/60 font-semibold"
                    : "bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Translated Terms */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item, idx) => {
            const isExpanded = expandedTerm === item.term;
            return (
              <div
                key={idx}
                className="bg-slate-950/40 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Category & Title */}
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-teal-400/80 font-bold font-mono">Item #{idx+1}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-display">
                      <Scale size={14} className="text-teal-400" />
                      {item.term}
                    </h3>
                  </div>

                  {/* Dual columns translation */}
                  <div className="space-y-2 text-xs">
                    {/* Juridiquês */}
                    <div className="p-2.5 bg-rose-950/5 border border-rose-900/10 rounded-lg">
                      <span className="text-[9px] font-mono text-rose-450 uppercase block font-bold tracking-wider">Como o Estado escreve (Juridiquês):</span>
                      <p className="italic text-slate-500 mt-0.5 text-[11px] leading-relaxed">
                        "{item.juridiques}"
                      </p>
                    </div>

                    {/* Simplified Translation */}
                    <div className="p-3 bg-teal-950/15 border border-teal-900/30 rounded-lg">
                      <span className="text-[9px] font-mono text-teal-500 uppercase flex items-center gap-1 font-bold tracking-wider">
                        <Sparkles size={10} />
                        Língua do Cidadão (Tradução Simples):
                      </span>
                      <p className="font-sans text-teal-100 text-[11.5px] leading-relaxed font-medium mt-1">
                        {item.simplified}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Practical Advice (collapsible or persistent indicator) */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px]">
                  <button
                    onClick={() => setExpandedTerm(isExpanded ? null : item.term)}
                    className="w-full text-left flex justify-between items-center text-slate-400 hover:text-white transition duration-150 font-mono text-[10px]"
                  >
                    <span className="flex items-center gap-1">
                      <Info size={11} className="text-amber-500" />
                      COMO USAR ISSO NO SEU CASO PRÁTICO?
                    </span>
                    <span className="text-teal-400 font-bold">{isExpanded ? "[Ocultar]" : "[Ver Dica]"}</span>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-2 bg-slate-950/80 border border-slate-900 rounded p-3 text-amber-200 line-normal"
                      >
                        <p className="leading-relaxed font-sans text-[11px]">
                          <strong>🔥 Consignação Prática:</strong> {item.relevance}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <p className="text-slate-500 text-center py-8 italic font-sans">Nenhum termo técnico correpondente à sua busca.</p>
        )}
      </div>

      {/* Helpful banner */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-mono">Pautado em Tavares, Bitencourt, Cristóvam e Molinaro (Direito Administrativo Digital)</span>
        <a
          href="#doc-framework"
          className="hover:text-teal-405 group inline-flex items-center gap-1 text-teal-400 underline"
        >
          Ir para Literacia Algorítmica
          <ArrowRight size={11} className="group-hover:translate-x-0.5 transition" />
        </a>
      </div>
    </section>
  );
}
