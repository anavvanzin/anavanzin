import React, { useState } from "react";
import { CaseAnalysis } from "../types";
import { FolderGit, CheckCircle, Search } from "lucide-react";

interface CaseSelectorProps {
  cases: CaseAnalysis[];
  activeCaseId: string | number | null;
  onSelectCase: (caseId: string | number) => void;
}

export default function CaseSelector({ cases, activeCaseId, onSelectCase }: CaseSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCases = cases.filter(c => [c.title, c.tag, c.context].join(" ").toLowerCase().includes(searchTerm.toLowerCase().trim()));

  return (
    <section className="space-y-4" id="case-selector-module">
      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-display uppercase tracking-wider">
          <FolderGit size={16} className="text-amber-400" /> Casos didáticos em discussão
        </h2>
        <p className="text-xs text-slate-400 mt-2">Selecione um dos cenários fictícios. As instituições citadas contextualizam o exercício; as narrativas não documentam acontecimentos verificados.</p>
      </div>
      <label className="relative block max-w-md">
        <span className="text-xs text-slate-400 block mb-2">Filtrar casos predefinidos</span>
        <Search size={14} className="absolute left-3 bottom-3 text-slate-500" />
        <input type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Título, tema ou contexto" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-xs text-slate-200 focus:ring-1 focus:ring-amber-500" />
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCases.map(c => (
          <button key={c.id} onClick={() => onSelectCase(c.id)} aria-pressed={c.id === activeCaseId} className={`text-left p-4 border rounded-xl transition flex flex-col gap-2 ${c.id === activeCaseId ? "bg-amber-950/20 border-amber-500 text-slate-100" : "bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-600"}`}>
            <span className="text-[10px] font-mono uppercase text-amber-400 flex gap-2 items-center">{c.tag} · fictício {c.id === activeCaseId && <CheckCircle size={12} />}</span>
            <span className="text-sm font-semibold">{c.title}</span>
            <span className="text-xs text-slate-400 leading-relaxed">{c.desc}</span>
          </button>
        ))}
      </div>
      {filteredCases.length === 0 && <p className="text-sm text-slate-400">Nenhum caso corresponde ao filtro.</p>}
    </section>
  );
}
