import React, { useState } from "react";
import {
  Cpu,
  Eye,
  EyeOff,
  Terminal,
  ShieldAlert,
  Coins,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Braces
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CaseAnalysis } from "../types";

interface Props {
  activeCase: CaseAnalysis;
}

export default function StateDecisionMatrix({ activeCase }: Props) {
  const [isMasked, setIsMasked] = useState(true);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDecrypt = () => {
    setIsDecrypting(true);
    setTimeout(() => {
      setIsMasked(false);
      setIsDecrypting(false);
    }, 1500);
  };

  const handleEncrypt = () => {
    setIsMasked(true);
  };

  // Select custom pseudo-code and JSON metadata depending on case
  const getCaseCode = (caseId: string | number) => {
    switch (caseId) {
      case "inss_rural":
        return {
          paramsJson: `{
  "orgao_emissor": "DATAPREV / INSS",
  "algoritmo_modelo": "Previdencia-Social-Automatica-v2.6",
  "parametros": {
    "CNIS_cruzamento": "fuzzy_strict_mode",
    "requisito_assinatura_digital": "obrigatório_com_govbr_prata_ouro",
    "peso_autodeclaração_rural": 0.00, // VIOLAÇÃO: peso zero para o cidadão
    "erro_cadastral_tratamento": "REJEICAO_DIRETA",
    "notificacao_previa_usuario": false // VIOLAÇÃO: nega o contraditório
  },
  "proxies_geograficos": {
    "limiar_periferia_car_km": 15,
    "veiculo_proprietario_terra": "INFERE_TRABALHO_URBANO_IMEDIATO"
  }
}`,
          pseudoCode: `function avaliarBeneficioAgro(agricultor) {
  // Ignora solenemente o rito de Justificação Manual preliminar
  const temAssinaturaOuroPrata = agricultor.nivelGovBr === "Ouro" || agricultor.nivelGovBr === "Prata";

  if (!temAssinaturaOuroPrata) {
    return REJEITAR_AUTOMATICAMENTE("Analfabetismo Digital / Sem Gov.br de elite");
  }

  // ALERTA DE VIÉS DE PROXY: proprietário da terra tem carro na cidade?
  // Infere-se automaticamente que a camponesa não é lavradora
  const proprietarioTerraCNIS = cnis.procurarDonoGeral(agricultor.numCAR);
  if (proprietarioTerraCNIS.carrosRegistrados.length > 0) {
    log("Proxy detetado: proprietário possui bem suburbano. Inferindo atividade urbana.");
    return INFERIR_ATIVIDADE_URBANA_E_CANCELAR_BENEFICIO();
  }

  // Nenhuma revisão humana acionada
  return DESCONSIDERAR_AUTODECLARACAO_E_DEFERIR_INDEFERIMENTO();
}`,
          violations: [
            "Desconsideração absoluta da Autodeclaração Física assinalando atividade camponesa.",
            "Viés de Proxy correlacionando bens do dono da terra rural ao histórico da trabalhadora informada.",
            "Ausência de oportunidade para esclarecer a divergência; o procedimento aplicável deve ser verificado no caso concreto."
          ]
        };
      case "bolsa_familia":
        return {
          paramsJson: `{
  "orgao_emissor": "MINISTERIO_DO_DESENVOLVIMENTO_SOCIAL",
  "base_triagem": "eSocial+RAIS+Cadastro_Unico_Frio",
  "parametros": {
    "cruzamento_nominal_grafomimico": "strict_exact_match_only",
    "atualizacao_segunda_via_delay_tolerancia_meses": 0,
    "peso_declaracao_mae_solo": 0.15,
    "presuncao_fraude_automatico": "BLOQUEIO_IMEDIATO_ALIMENTAR"
  }
}`,
          pseudoCode: `function triagemBolsaFamilia(cadastroFamilia) {
  const cpfStatus = receitaFederal.verificarNomeCivil(cadastroFamilia.mae.cpf);

  // Se o prenome ou sobrenome após divórcio possuir discrepância em uma letra sequer
  if (cadastroFamilia.mae.nomeCadUnico !== cpfStatus.nomeOficialReceita) {
    log("DISCREPÂNCIA GRAFÓNICA DETETADA. TRIGGER: PRESUNÇÃO DE INCONSISTÊNCIA.");

    // VIOLA LITERAMENTE O CONTRADITÓRIO MÍNIMO:
    // Corta o sustento de imediato sem notificar no CRAS
    return EXCLUIR_BENEFICIARIO_EM_LOTE_E_BLOQUEAR_VERBA();
  }

  // Presunção de omissão de renda para mães informais divorciadas
  return MANTER_ATIVO();
}`,
          violations: [
            "Trigger de bloqueio direto por mero divórcio e disparidade de sobrenome civil residual.",
            "Inexistência de trigger de alerta ao invés de cancelamento para valores assistenciais fundamentais.",
            "Total ausência de 'callback' para agendamento assistencial prévio no CRAS ou canais comunitários."
          ]
        };
      case "iptu_triplicado":
        return {
          paramsJson: `{
  "orgao_emissor": "SECRETARIA_MUNICIPAL_DE_FINANCAS_PREFEITURA",
  "triagem_inteligente": "Projeto-Predial-IA-Arrecadacao",
  "parametros": {
    "cruzamento_receita_cnpj_mei_ativo": "infere_estabelecimento_comercial",
    "isencao_aliquota_residencial_cadastro": "REMOVER_IMEDIATAMENTE",
    "verificacao_individualizada": false, // RISCO DIDÁTICO: inferência sem prova suficiente
    "notificacao_tributaria_previa_contribuinte": false
  }
}`,
          pseudoCode: `function recalcularImovelArrecadacao(contribuinte) {
  const possuiMeiAtivoNoEndereco = cnpj.buscarMEIEmLocalidade(contribuinte.enderecoIPTU);

  if (possuiMeiAtivoNoEndereco) {
    log("MEI detetado no endereço. Inferindo reclassificação comercial cega e majoração.");
    // Duplica ou triplica a base de cálculo sem vistoria presencial do auditor fiscal
    contribuinte.aliquotaIPTU = contribuinte.aliquotaIPTU * 3.0;
    contribuinte.enquadramentoSetorial = "MISTO_COMERCIAL_ARRECADACAO";

    // Lança a dívida suplementar na calada do lote fiscal noturno
    return LANCAR_IPTU_SUPLEMENTAR_CEGO_SEM_NOTIFICAR();
  }
}`,
          violations: [
            "Ausência sistemática de vistoria fiscal presencial antes de reclassificar uso de imóvel residencial.",
            "Utilização de endereço de MEI prestador de serviços puramente virtuais como proxy de comércio físico.",
            "Falta de motivação e de informação sobre impugnação no cenário; não demonstra, por si só, violação de anterioridade tributária."
          ]
        };
      default:
        return {
          paramsJson: `{
  "orgao_emissor": "AUTONOMO_SISTEMA_ESTATAL",
  "parametros": {
    "canal_de_revisao": false,
    "notificacao_contraditório_previo": false
  }
}`,
          pseudoCode: `function processarCasoCidadao(peticionario) {
  if (peticionario.inconsistenciaCadastral) {
    return REJEITAR_AUTOMATICAMENTE_SEM_REVISÃO_HUMANA();
  }
}`,
          violations: [
            "Ausência de canal para solicitar revisão, direito previsto no art. 20 da LGPD quando aplicável. O texto vigente não exige expressamente pessoa natural.",
            "Subordinação de garantias constitucionais por pressa burocrática econômica maquinal."
          ]
        };
    }
  };

  const caseCode = getCaseCode(activeCase.id);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden" id="state-decision-matrix-card">
      {/* Decorative cyber backdrop grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-35" />

      {/* Dynamic light indicator glowing at top */}
      <div className={`absolute top-0 left-0 right-0 h-[2.5px] transition-colors duration-500 ${isMasked ? "bg-red-500/80 shadow-[0_1px_12px_rgba(239,68,68,0.7)]" : "bg-emerald-500/80 shadow-[0_1px_12px_rgba(16,185,129,0.7)]"}`} />

      <div className="relative z-10 flex flex-col space-y-4">

        {/* Top bar description */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu size={16} className={isMasked ? "text-red-500" : "text-emerald-400"} />
            <div>
              <span className="text-[9px] font-mono uppercase bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-bold block w-fit">
                MATRIZ DIDÁTICA DE DECISÃO (PSEUDOCÓDIGO)
              </span>
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono mt-0.5">
                Regras Fictícias para Discutir Opacidade
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMasked ? (
              <span className="px-2 py-0.5 rounded text-[8.5px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/25 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                ⚫ BLACK-BOX OMITIDA
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[8.5px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                🟢 EXEMPLO REVELADO
              </span>
            )}
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-normal font-sans">
          O pseudocódigo abaixo é fictício e não é executado. Ele ilustra associações de dados e riscos de contestação; não representa código extraído de servidores de órgãos públicos.
        </p>

        {/* Double-terminal side by side on desktop, grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* JSON Parameters Box */}
          <div className="flex flex-col space-y-1">
            <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
              <Braces size={11} className="text-blue-400" />
              1. PESOS DA VARIÁVEL (JSON CONFIG)
            </span>
            <div className="relative font-mono text-[10.5px] bg-slate-950 rounded-xl p-4.5 border border-slate-850 h-[190px] overflow-y-auto leading-relaxed scrollbar-thin flex flex-col justify-between">

              <AnimatePresence mode="wait">
                {isMasked ? (
                  <motion.div
                    key="masked-json"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-center items-center h-full text-center space-y-2 select-none"
                  >
                    <Terminal size={18} className="text-slate-700" />
                    <samp className="text-red-500/50 text-[9px] uppercase tracking-widest font-bold">
                      [PARÂMETROS CRITICAMENTE MASCARADOS]
                    </samp>
                    <p className="text-[10px] text-slate-600 max-w-xs leading-normal">
                      Neste cenário fictício, os parâmetros ficam ocultos para ilustrar a dificuldade de contestação.
                    </p>
                  </motion.div>
                ) : (
                  <motion.pre
                    key="unmasked-json"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-blue-300 font-mono whitespace-pre text-[9.5px] leading-tight select-all selection:bg-amber-500/30"
                  >
                    {caseCode.paramsJson}
                  </motion.pre>
                )}
              </AnimatePresence>

              {/* Blurred noise layer */}
              {isMasked && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[6.5px] rounded-xl border border-slate-850 flex items-center justify-center pointer-events-none" />
              )}
            </div>
          </div>

          {/* Logic Loop Box */}
          <div className="flex flex-col space-y-1">
            <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
              <Terminal size={11} className="text-amber-500" />
              2. CRITÉRIO DECISÓRIO (LOGLoop.js)
            </span>
            <div className="relative font-mono text-[10.5px] bg-slate-950 rounded-xl p-4.5 border border-slate-850 h-[190px] overflow-y-auto leading-relaxed scrollbar-thin">

              <AnimatePresence mode="wait">
                {isMasked ? (
                  <motion.div
                    key="masked-code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-center items-center h-full text-center space-y-2 select-none"
                  >
                    <ShieldAlert size={18} className="text-slate-700" />
                    <samp className="text-red-500/50 text-[9px] uppercase tracking-widest font-bold">
                      [ALGORITMO OCULTO DE EXCLUSÃO]
                    </samp>
                    <p className="text-[10px] text-slate-600 max-w-xs leading-normal">
                      Algoritmo obscuro proprietário sem supervisão por autoridade de competência humana declarada.
                    </p>
                  </motion.div>
                ) : (
                  <motion.pre
                    key="unmasked-code"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-amber-300 font-mono whitespace-pre text-[9px] leading-snug select-all selection:bg-amber-500/30"
                  >
                    {caseCode.pseudoCode}
                  </motion.pre>
                )}
              </AnimatePresence>

              {/* Blurred noise layer */}
              {isMasked && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[6.5px] rounded-xl border border-slate-850 flex items-center justify-center pointer-events-none" />
              )}
            </div>
          </div>

        </div>

        {/* Action Button & Decryption feedback info */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-3 border-t border-slate-800">

          {/* Legend / Violation notice when decrypted */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {isMasked ? (
                <motion.div
                  key="masked-legend"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-slate-500 text-[10px] bg-slate-950/30 p-2.5 rounded-lg border border-slate-900/50"
                >
                  <AlertTriangle size={13} className="text-slate-600 animate-pulse shrink-0" />
                  <span className="font-sans leading-normal">
                    Revele o pseudocódigo para discutir riscos e formular perguntas. Não se trata de código de um órgão público nem de auditoria de um sistema real.
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="unmasked-legend"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-950/20 border border-red-900/40 rounded-lg p-2.5 space-y-1.5"
                >
                  <span className="text-[9.5px] font-mono text-center font-bold text-red-400 block tracking-widest uppercase flex items-center gap-1">
                    ⚠️ RISCOS ILUSTRADOS NO PSEUDOCÓDIGO:
                  </span>
                  <ul className="list-disc pl-4 text-[10px] text-slate-300 space-y-1 font-sans leading-relaxed">
                    {caseCode.violations.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle audit button */}
          <div className="shrink-0 flex items-center">
            {isMasked ? (
              <button
                onClick={handleDecrypt}
                disabled={isDecrypting}
                className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/30 text-slate-950 font-mono font-bold text-[10.5px] tracking-wider transition-all duration-300 shadow-[0_4px_15px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_22px_rgba(245,158,11,0.35)] hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 select-none shrink-0"
              >
                {isDecrypting ? (
                  <>
                    <RefreshCw size={13} className="animate-spin text-slate-950" />
                    <span>REVELANDO EXEMPLO...</span>
                  </>
                ) : (
                  <>
                    <Eye size={13} className="text-slate-950" />
                    <span>REVELAR PSEUDOCÓDIGO DIDÁTICO</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleEncrypt}
                className="w-full md:w-auto px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-850 hover:text-white text-slate-400 border border-slate-800 font-mono font-bold text-[10.5px] tracking-normal transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 select-none shrink-0"
              >
                <EyeOff size={13} />
                <span>MASCARAR AUDITORIA</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
