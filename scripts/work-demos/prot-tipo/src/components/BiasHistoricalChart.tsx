import React, { useState } from "react";
import {
  TrendingUp,
  HelpCircle,
  MapPin,
  Sparkles,
  BarChart2,
  Globe
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import ExplainableTerm from "./ExplainableTerm";

type BiasMode = "informalidade" | "letramento" | "racial" | "genero";

interface BiasTab {
  id: BiasMode;
  label: string;
  icon: string;
  desc: string;
  termReference: string;
}

const BIAS_TABS: BiasTab[] = [
  {
    id: "informalidade",
    label: "Informalidade Agrária",
    icon: "🌾",
    desc: "Cruzamento frio de dados ignorando o trabalho informal do campo.",
    termReference: "viés de proxy"
  },
  {
    id: "letramento",
    label: "Letramento Digital",
    icon: "👵",
    desc: "Exercício sobre barreiras digitais enfrentadas por idosos sem assistência.",
    termReference: "notícia humana"
  },
  {
    id: "racial",
    label: "Viés Racial / Biometria",
    icon: "👤",
    desc: "Exercício sobre falsos positivos em reconhecimento facial.",
    termReference: "falso positivo"
  },
  {
    id: "genero",
    label: "Igualdade / Família Solo",
    icon: "👩",
    desc: "Exercício sobre divergências cadastrais em famílias monoparentais.",
    termReference: "contraditório"
  }
];

const ILLUSTRATIVE_DATA: Record<BiasMode, Array<{
  ano: string;
  "Salvador (BA)": number;
  "Recife (PE)": number;
  "Brasília (DF)": number;
  "São Paulo (SP)": number;
  "Juazeiro (CE)": number;
}>> = {
  informalidade: [
    { ano: "2022", "Salvador (BA)": 45, "Recife (PE)": 48, "Brasília (DF)": 30, "São Paulo (SP)": 25, "Juazeiro (CE)": 72 },
    { ano: "2023", "Salvador (BA)": 52, "Recife (PE)": 55, "Brasília (DF)": 35, "São Paulo (SP)": 28, "Juazeiro (CE)": 78 },
    { ano: "2024", "Salvador (BA)": 60, "Recife (PE)": 64, "Brasília (DF)": 42, "São Paulo (SP)": 32, "Juazeiro (CE)": 84 },
    { ano: "2025", "Salvador (BA)": 68, "Recife (PE)": 72, "Brasília (DF)": 48, "São Paulo (SP)": 38, "Juazeiro (CE)": 89 },
    { ano: "2026", "Salvador (BA)": 75, "Recife (PE)": 80, "Brasília (DF)": 55, "São Paulo (SP)": 42, "Juazeiro (CE)": 92 }
  ],
  letramento: [
    { ano: "2022", "Salvador (BA)": 60, "Recife (PE)": 65, "Brasília (DF)": 40, "São Paulo (SP)": 35, "Juazeiro (CE)": 78 },
    { ano: "2023", "Salvador (BA)": 68, "Recife (PE)": 70, "Brasília (DF)": 44, "São Paulo (SP)": 38, "Juazeiro (CE)": 81 },
    { ano: "2024", "Salvador (BA)": 72, "Recife (PE)": 75, "Brasília (DF)": 50, "São Paulo (SP)": 42, "Juazeiro (CE)": 83 },
    { ano: "2025", "Salvador (BA)": 79, "Recife (PE)": 82, "Brasília (DF)": 56, "São Paulo (SP)": 48, "Juazeiro (CE)": 86 },
    { ano: "2026", "Salvador (BA)": 84, "Recife (PE)": 88, "Brasília (DF)": 62, "São Paulo (SP)": 52, "Juazeiro (CE)": 89 }
  ],
  racial: [
    { ano: "2022", "Salvador (BA)": 82, "Recife (PE)": 74, "Brasília (DF)": 55, "São Paulo (SP)": 60, "Juazeiro (CE)": 45 },
    { ano: "2023", "Salvador (BA)": 85, "Recife (PE)": 78, "Brasília (DF)": 58, "São Paulo (SP)": 63, "Juazeiro (CE)": 48 },
    { ano: "2024", "Salvador (BA)": 89, "Recife (PE)": 82, "Brasília (DF)": 62, "São Paulo (SP)": 68, "Juazeiro (CE)": 52 },
    { ano: "2025", "Salvador (BA)": 92, "Recife (PE)": 86, "Brasília (DF)": 65, "São Paulo (SP)": 74, "Juazeiro (CE)": 55 },
    { ano: "2026", "Salvador (BA)": 94, "Recife (PE)": 90, "Brasília (DF)": 70, "São Paulo (SP)": 80, "Juazeiro (CE)": 58 }
  ],
  genero: [
    { ano: "2022", "Salvador (BA)": 50, "Recife (PE)": 48, "Brasília (DF)": 42, "São Paulo (SP)": 40, "Juazeiro (CE)": 60 },
    { ano: "2023", "Salvador (BA)": 55, "Recife (PE)": 53, "Brasília (DF)": 46, "São Paulo (SP)": 43, "Juazeiro (CE)": 65 },
    { ano: "2024", "Salvador (BA)": 62, "Recife (PE)": 60, "Brasília (DF)": 52, "São Paulo (SP)": 48, "Juazeiro (CE)": 71 },
    { ano: "2025", "Salvador (BA)": 70, "Recife (PE)": 67, "Brasília (DF)": 58, "São Paulo (SP)": 53, "Juazeiro (CE)": 78 },
    { ano: "2026", "Salvador (BA)": 78, "Recife (PE)": 75, "Brasília (DF)": 64, "São Paulo (SP)": 58, "Juazeiro (CE)": 84 }
  ]
};

// Colors associated with each city curve
const CITY_COLORS = {
  "Salvador (BA)": { stroke: "#f59e0b", label: "Salvador" },  // Amber focus
  "Recife (PE)": { stroke: "#38bdf8", label: "Recife" },      // Light Blue
  "Brasília (DF)": { stroke: "#10b981", label: "Brasília" },  // Emerald
  "São Paulo (SP)": { stroke: "#a855f7", label: "São Paulo" },// Purple
  "Juazeiro (CE)": { stroke: "#ec4899", label: "Juazeiro" }   // Pink
};

export default function BiasHistoricalChart() {
  const [activeTab, setActiveTab] = useState<BiasMode>("informalidade");

  const currentTab = BIAS_TABS.find(t => t.id === activeTab) || BIAS_TABS[0];
  const chartData = ILLUSTRATIVE_DATA[activeTab];

  // Custom formatted tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-2xl font-sans text-xs">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2">Ano do cenário: {label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between gap-6">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: entry.stroke }}
                  />
                  {entry.name}
                </span>
                <span className="font-mono font-bold text-slate-100">{entry.value}/100</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 mt-4 space-y-4">
      {/* Selector Tabs Header */}
      <div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 flex items-center gap-1">
          <Globe size={10} className="text-teal-500" />
          Série fictícia · escala didática 0–100
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2">
          {BIAS_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1.5 px-2.5 rounded-lg text-left transition text-xs flex flex-col justify-between h-14 border ${
                  isActive
                    ? "bg-slate-900 border-teal-500/50 text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.05)]"
                    : "bg-slate-950/60 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-slate-200 hover:border-slate-850"
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="font-semibold block truncate text-[11px] mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description & Link to Glossary */}
      <div className="bg-slate-950 border border-slate-900/80 rounded-lg p-2.5 text-[11px]">
        <p className="text-slate-400 leading-relaxed font-sans">
          <strong>Tema do exercício:</strong> {currentTab.desc} Relacionado ao conceito de{" "}
          <ExplainableTerm term={currentTab.termReference} />.
        </p>
      </div>

      {/* Recharts Component Container */}
      <div className="h-68 w-full mt-2 relative -ml-4" id="historical-bias-recharts">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="salvadorGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            <XAxis
              dataKey="ano"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />

            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickFormatter={(val) => `${val}`}
              domain={[0, 100]}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
              formatter={(value) => <span className="text-slate-400 font-sans">{value}</span>}
            />

            <Line
              type="monotone"
              dataKey="Salvador (BA)"
              stroke={CITY_COLORS["Salvador (BA)"].stroke}
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
              dot={{ r: 2 }}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="Recife (PE)"
              stroke={CITY_COLORS["Recife (PE)"].stroke}
              strokeWidth={1.5}
              dot={{ r: 1 }}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="Brasília (DF)"
              stroke={CITY_COLORS["Brasília (DF)"].stroke}
              strokeWidth={1.5}
              dot={{ r: 1 }}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="São Paulo (SP)"
              stroke={CITY_COLORS["São Paulo (SP)"].stroke}
              strokeWidth={1.5}
              dot={{ r: 1 }}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="Juazeiro (CE)"
              stroke={CITY_COLORS["Juazeiro (CE)"].stroke}
              strokeWidth={1.5}
              dot={{ r: 1 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-2 bg-slate-950/20 px-1">
        <span>Dados fictícios criados para a interface</span>
        <span className="text-teal-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
          Ilustração didática
        </span>
      </div>
    </div>
  );
}
