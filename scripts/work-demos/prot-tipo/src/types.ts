export interface DataPoint {
  campo: string;
  fonte: string;
  status: "ok" | "warn" | "bad";
  statusLabel: string;
}

export interface BiasIndicator {
  label: string;
  valor: number;
  nivel: "low" | "med" | "high";
}

export interface PersonaOpinions {
  defensoria: string;
  cientista: string;
  admin: string;
  cidadao: string;
}

export interface PersonaDetail {
  id: string;
  name: string;
  role: string;
  avatar: string;
  reference: string;
  axis: string;
  color: string;
}

export interface RankingItem {
  pos: number;
  name: string;
  score: string;
  votes: number;
  comment: string;
}

export interface FinalDecision {
  sintese: string;
  consenso: string;
  dissenso: string;
  fundamentacao: string;
  recomendacao: string;
  alerta: string;
  minutaRecurso: string;
  pedidoLAI: string;
}

export interface CaseAnalysis {
  id: string | number;
  title: string;
  desc: string;
  tag: string;
  context: string;
  dados: DataPoint[];
  vieses: BiasIndicator[];
  personas: PersonaOpinions;
  rankings: RankingItem[];
  final: FinalDecision;
}
