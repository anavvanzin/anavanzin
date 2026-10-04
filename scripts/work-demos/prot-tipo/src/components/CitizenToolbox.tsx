import React, { useState } from "react";
import ExplainableTerm from "./ExplainableTerm";
import {
  ShieldCheck,
  HelpCircle,
  FileText,
  UserCheck,
  Database,
  Check,
  Copy,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  Fingerprint,
  Users,
  AlertCircle
} from "lucide-react";

interface DiagnosticOption {
  id: string;
  category: string;
  scenario: string;
  explanation: string;
  howToProve: string;
  laiQuestions: string[];
  lgpdRight: string;
}

const DIAGNOSTICS: DiagnosticOption[] = [
  {
    id: "inss",
    category: "Benefícios Previdenciários (INSS)",
    scenario: "Negativa de aposentadoria rural em segundos",
    explanation: "O algoritmo SABI-Prev cruzou sua base de dados com o CNIS e encontrou uma contribuição urbana rápida (por exemplo, 30 dias de trabalho há anos). Ele assumiu automaticamente que você não é trabalhador rural em tempo integral.",
    howToProve: "Reúna notas fiscais de venda de produtor rural, certidões de casamento/batismo indicando profissão agrícola e autodeclaração confirmada por testemunhas no sindicato rural.",
    laiQuestions: [
      "Quais bases de dados exatas foram cruzadas para decretar o vínculo urbano?",
      "Qual foi a margem de ponderação (peso) atribuída ao período rural contra o urbano?",
      "Existe relatório de auditoria humana presencial antes do corte?"
    ],
    lgpdRight: "Artigo 20 da LGPD garante seu direito de obter informações claras e inteligíveis sobre os critérios e os procedimentos utilizados para a decisão automatizada."
  },
  {
    id: "iptu",
    category: "Tributação Municipal (IPTU)",
    scenario: "Reclassificação de IPTU residencial para comercial",
    explanation: "A prefeitura identificou um registro de MEI de serviços virtuais (por exemplo, consultoria ou informática) vinculado ao seu endereço residencial e alterou automaticamente sua alíquota de residencial para comercial sem realizar auditoria local.",
    howToProve: "Apresente cópias de faturas de telefone/energia comprovando uso normal de moradia e declare sob as penas da lei que a atividade empresarial é exclusivamente virtual, sem circulação de público ou carga.",
    laiQuestions: [
      "Quais parâmetros do robô tributário classificam um endereço virtual de MEI como estabelecimento físico?",
      "Houve vistoria in loco realizada por Auditor Fiscal antes da alteração cadastral?"
    ],
    lgpdRight: "Direito de solicitar revisão de decisões tomadas unicamente com base em tratamento automatizado de dados pessoais que afetem seus interesses (art. 20, caput, LGPD). O texto vigente não exige pessoa natural; essa salvaguarda é proposta do exercício."
  },
  {
    id: "bpc",
    category: "Assistência Social (BPC/LOAS)",
    scenario: "Suspensão automática por conta de energia / eSocial de parentes",
    explanation: "Cruzou-se o consumo elétrico residencial ou o eSocial de familiares que residem no mesmo terreno (mas em casas independentes), presumindo que a renda de sua família é superior ao limite de 1/4 do salário mínimo.",
    howToProve: "Apresente cópia de contas de luz separadas, declaração de moradia separada (mesmo lote com entradas distintas) e notas de despesas médicas e farmácia que consomem sua renda familiar real.",
    laiQuestions: [
      "Qual algoritmo de geocodificação ou critério espacial assumiu que moradores de casas distintas formam um único agregado familiar?",
      "Qual o limiar de consumo de energia que desqualifica a vulnerabilidade no sistema assistencial?"
    ],
    lgpdRight: "Direito à retificação de dados incorretos e desatualizados (Art. 18, inciso III da LGPD) impedindo cruzamentos frios com dados de terceiros."
  },
  {
    id: "facial",
    category: "Segurança Pública / Reconhecimento Facial",
    scenario: "Falso positivo em monitoramento urbano",
    explanation: "A câmera de alta resolução no espaço público calculou uma similaridade facial de, por exemplo, 89% com uma foto antiga e desatualizada de um banco de dados de procurados devido a iluminação adversa e sombras.",
    howToProve: "Comprovação de geolocalização no momento de crimes passados (extratos bancários, faturamento corporativo, cartões de metrô) e laudo pericial apontando discrepâncias anatômicas de sua face versus o mandado.",
    laiQuestions: [
      "Qual a taxa histórica de falso-positivo de gênero e etnia do modelo de reconhecimento facial utilizado?",
      "Qual a métrica de limiar (threshold) mínimo configurada para emitir o alerta de detenção policial?"
    ],
    lgpdRight: "No tratamento exclusivamente voltado à segurança pública ou investigação penal, incide a exceção do art. 4º, III, da LGPD. O exercício discute explicabilidade e garantias constitucionais sem presumir aplicação direta do art. 20."
  }
];

export default function CitizenToolbox() {
  const [selectedDiagId, setSelectedDiagId] = useState(DIAGNOSTICS[0].id);
  const [searchWord, setSearchWord] = useState("");

  // Custom draft state
  const userName = "Pessoa Fictícia do Exercício";
  const targetOrg = "Órgão do Cenário Didático";
  const protocolNum = "EXEMPLO-001";
  const [customDraftCopied, setCustomDraftCopied] = useState(false);

  const selectedDiag = DIAGNOSTICS.find(d => d.id === selectedDiagId) || DIAGNOSTICS[0];

  const handleGenerateDraft = () => {
    const nome = userName.trim() || "[Seu Nome Completo]";
    const orgao = targetOrg.trim() || "[Nome do Órgão Público]";
    const protocolo = protocolNum.trim() || "[Número do Protocolo ou Benefício]";

    return `EXEMPLO DIDÁTICO · REQUERIMENTO DE EXPLICAÇÃO E REVISÃO (ART. 20, LGPD)

AO: ENCARREGADO DE PROTEÇÃO DE DADOS (DPO) / OUVIDORIA
ÓRGÃO: ${orgao}

Assunto: Pedido de Explicação Detalhada e Revisão de Decisão Automatizada
Ref: Protocolo/Processo nº ${protocolo}

Eu, ${nome}, abaixo assinado, venho por meio deste, com fulcro no Artigo 20 da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), solicitar formalmente:

1. EXPLICAÇÃO DOS CRITÉRIOS E PARÂMETROS: Que este órgão informe, em linguagem clara, simples e compreensível, quais foram os critérios, variáveis, pesos e cruzamentos automatizados de dados utilizados para determinar o indeferimento/bloqueio no meu caso concreto.
2. PEDIDO DE REVISÃO: Solicita-se a revisão da decisão automatizada que afeta os interesses do titular (art. 20, caput). Neste exercício propõe-se a intervenção humana como salvaguarda; o caput não exige literalmente revisão por pessoa natural.
3. ACESSO AOS DADOS: Cópia integral do relatório técnico gerado pelo sistema informatizado que fundamentou a referida conclusão automatizada.

Aguardo resposta no prazo legal.

Atenciosamente,
____________________________________________
${nome}
Minuta fictícia gerada localmente para estudo; sem submissão a órgão público.`;
  };

  const copyCustomDraft = () => {
    navigator.clipboard.writeText(handleGenerateDraft());
    setCustomDraftCopied(true);
    setTimeout(() => setCustomDraftCopied(false), 2000);
  };

  const filteredDiagnostics = DIAGNOSTICS.filter(d =>
    d.category.toLowerCase().includes(searchWord.toLowerCase()) ||
    d.scenario.toLowerCase().includes(searchWord.toLowerCase()) ||
    d.explanation.toLowerCase().includes(searchWord.toLowerCase())
  );

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mt-8" id="citizen-toolbox">

      {/* Tab Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-500/10 via-slate-950 to-blue-500/5 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest font-mono">
              <Sparkles size={12} className="text-amber-500" />
              Recurso Prático ao Administrado
            </span>
            <h2 className="text-lg font-bold text-white mt-1.5 font-sans">
              Kit de Defesa e Entendimento do Cidadão
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Não fique às cegas. Ferramentas interativas para decifrar, auditar e recorrer de decisões sistêmicas do governo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">Base Legal:</span>
            <span className="px-2.5 py-1 text-[10px] font-mono rounded bg-slate-950 text-slate-300 border border-slate-800">
              <ExplainableTerm term="lgpd">Art. 20 LGPD</ExplainableTerm> + Lei de Acesso à Informação
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">

        {/* Left Column: Diagnostics Selection (5 cols) */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-800 p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Search size={14} className="text-blue-400" />
              1. Escolha um cenário didático:
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Explore cenários hipotéticos de inconsistência para discutir garantias procedimentais.
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar problema..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-3 pr-8 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            />
            {searchWord && (
              <button
                onClick={() => setSearchWord("")}
                className="absolute right-2 top-2 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredDiagnostics.map((d) => {
              const isSelected = d.id === selectedDiagId;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDiagId(d.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col gap-1 ${
                    isSelected
                      ? "bg-amber-950/20 border-amber-500 text-slate-100 shadow-md shadow-amber-500/5"
                      : "bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className={`text-[9px] font-mono uppercase tracking-wider font-bold ${isSelected ? "text-amber-500" : "text-slate-500"}`}>
                    {d.category}
                  </span>
                  <span className="font-semibold text-slate-200">{d.scenario}</span>
                </button>
              );
            })}
            {filteredDiagnostics.length === 0 && (
              <p className="text-slate-600 italic text-center py-4">Nenhum cenário correspondente.</p>
            )}
          </div>

          {/* Sopa de letrinhas (Glossary summary) */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <BookOpen size={13} className="text-amber-500" />
              Decodificador de Siglas do Governo:
            </h4>
            <div className="space-y-2 font-sans text-[11px] leading-relaxed">
              <p className="text-slate-400">
                <span className="font-mono text-slate-200 font-bold bg-slate-950 px-1 py-0.5 rounded mr-1">CNIS</span>
                Cadastro de trabalho e salários. Muitas vezes tem contratos antigos sem termo de término (em aberto).
              </p>
              <p className="text-slate-400">
                <span className="font-mono text-slate-200 font-bold bg-slate-950 px-1 py-0.5 rounded mr-1">eSocial</span>
                Sistema onde empresas declaram domésticas e empregados. Robôs cruzam e assumem endereço misto.
              </p>
              <p className="text-slate-400">
                <span className="font-mono text-amber-450 font-bold bg-slate-950 px-1 py-0.5 rounded mr-1">LAI</span>
                <ExplainableTerm term="LAI" customDefinition="Lei de Acesso à Informação (Lei nº 12.527/11). Permite que qualquer cidadão exija dados inteligíveis sobre como o robô do governo foi programado e os relatórios de erros.">Lei de Acesso à Informação</ExplainableTerm> para levantar provas de auditoria algorítmica.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Diagnostic & Draft Generator (7 cols) */}
        <div className="lg:col-span-7 p-6 space-y-6">

          {/* Section 1: Algorithmic Logic & How to Contest */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-900 pb-3 flex justify-between items-start gap-3">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Mapeamento Técnico de Decisão</span>
                <h4 className="text-sm font-bold text-white font-sans mt-0.5">{selectedDiag.scenario}</h4>
              </div>
              <span className="px-2.5 py-0.5 text-[9px] font-mono text-blue-400 bg-blue-950/50 border border-blue-900/60 rounded">
                AUDITORIA DE LÓGICA
              </span>
            </div>

            <div className="space-y-3.5 text-xs font-sans leading-relaxed">
              <div className="space-y-1">
                <p className="text-slate-400 font-semibold uppercase font-mono text-[10px] tracking-wider text-slate-500">Lógica e Vício Sistêmico Comum:</p>
                <p className="text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-900">
                  {selectedDiag.explanation}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-slate-400 font-semibold uppercase font-mono text-[10px] tracking-wider text-slate-500">Como provar o erro (Contraprova fática):</p>
                <p className="text-slate-300">
                  {selectedDiag.howToProve}
                </p>
              </div>

              <div className="p-3.5 bg-amber-950/15 border border-amber-900/40 rounded-lg text-amber-300 text-[11px] leading-relaxed">
                <p className="font-mono text-amber-500 uppercase font-bold text-[9px] tracking-wider duration-150">Seu Amparo pela LGPD:</p>
                <p className="mt-1 font-serif text-slate-400">
                  {selectedDiag.lgpdRight}
                </p>
              </div>

              {/* LAI questions to copy */}
              <div className="space-y-2">
                <p className="text-slate-400 font-semibold uppercase font-mono text-[10px] tracking-wider text-slate-500">Perguntas Cruciais para fazer via LAI (Lei de Acesso à Informação):</p>
                <div className="space-y-1.5 text-[11px] font-mono">
                  {selectedDiag.laiQuestions.map((q, idx) => (
                    <div key={idx} className="flex gap-2 p-2 bg-slate-950 border border-slate-900 rounded text-slate-300 items-start">
                      <span className="text-amber-500 font-bold">#0{idx+1}</span>
                      <p className="leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Custom Request Generator under Art 20 of LGPD */}
          <div className="bg-slate-950/20 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Fingerprint size={14} className="text-amber-400" />
                2. Gerador de Requerimento Administrativo (Art. 20 - LGPD):
              </h4>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Explore uma minuta com dados fictícios predefinidos. Não insira dados pessoais. O texto é didático e requer revisão para uso em casos concretos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 font-mono text-[10px]">NOME FICTÍCIO:</label>
                <input
                  type="text"
                  value={userName}
                  readOnly aria-label="Nome fictício predefinido"
                  placeholder="Ex: Maria da Silva"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-mono text-[10px]">ÓRGÃO DO EXERCÍCIO:</label>
                <input
                  type="text"
                  value={targetOrg}
                  readOnly aria-label="Órgão fictício predefinido"
                  placeholder="Ex: INSS"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-mono text-[10px]">PROTOCOLO FICTÍCIO:</label>
                <input
                  type="text"
                  value={protocolNum}
                  readOnly aria-label="Protocolo fictício predefinido"
                  placeholder="Ex: 531-TRX-2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Render and copy output */}
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-950 px-3 py-1.5 border-t border-x border-slate-800 rounded-t-lg text-[10px] text-slate-500 font-mono">
                <span>PETICAO-ART20-LGPD.txt</span>
                <button
                  onClick={copyCustomDraft}
                  className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-white rounded transition text-[10px]"
                >
                  {customDraftCopied ? (
                    <>
                      <Check size={11} className="text-emerald-400 font-bold" />
                      <span className="text-emerald-400 font-bold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Copiar Petição</span>
                    </>
                  )}
                </button>
              </div>

              <div className="font-mono text-[11px] bg-slate-950 text-slate-400 p-4 rounded-b-lg border-b border-x border-slate-800 h-[100px] overflow-y-auto leading-normal whitespace-pre select-all scrollbar-thin">
                {handleGenerateDraft()}
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
