import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, Trash2 } from "lucide-react";

const FICTIONAL_REPORTS = [
  { id: "exemplo-1", title: "Divergência cadastral", context: "Uma personagem fictícia encontra divergência de nome após alteração do estado civil. O exercício pergunta como oferecer correção e contestação acessíveis." },
  { id: "exemplo-2", title: "Alerta biométrico equivocado", context: "Um personagem fictício é confundido com outra pessoa pelo reconhecimento facial. O exercício discute verificação de identidade e limites de inferências automatizadas." },
];

export default function ReportAbuseForm() {
  const [reports, setReports] = useState<typeof FICTIONAL_REPORTS>([]);
  const [selected, setSelected] = useState(FICTIONAL_REPORTS[0].id);
  const [added, setAdded] = useState(false);

  const addExample = () => {
    const example = FICTIONAL_REPORTS.find(report => report.id === selected)!;
    setReports(current => current.some(report => report.id === example.id) ? current : [example, ...current]);
    setAdded(true);
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5" id="report-abuse-section">
      <div className="border-b border-slate-800 pb-3">
        <div className="text-amber-400 text-[10px] font-mono uppercase tracking-widest flex gap-2 items-center"><ShieldAlert size={14} /> Exercício de escuta social</div>
        <h3 className="text-sm font-bold text-white mt-1">Observatório simulado</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">Use apenas os exemplos fictícios abaixo. Esta demonstração mantém a lista na memória desta página: não envia denúncias, não anonimiza dados e não cria registros em banco público ou blockchain. A lista desaparece ao recarregar.</p>
      </div>
      <label className="block text-xs text-slate-300">
        Cenário fictício
        <select value={selected} onChange={event => { setSelected(event.target.value); setAdded(false); }} className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200">
          {FICTIONAL_REPORTS.map(report => <option key={report.id} value={report.id}>{report.title}</option>)}
        </select>
      </label>
      <button onClick={addExample} className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400">Adicionar exemplo à lista local</button>
      {added && <p role="status" className="text-emerald-400 text-xs flex gap-2 items-center"><CheckCircle2 size={14} /> Exemplo incluído nesta página.</p>}
      <div className="border-t border-slate-800 pt-4 space-y-3">
        <h4 className="text-xs font-mono text-slate-400">Exemplos na sessão ({reports.length})</h4>
        {reports.length === 0 && <p className="text-xs text-slate-500">Adicione um cenário para explorar a proposta.</p>}
        {reports.map(report => <article key={report.id} className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2">
          <div className="flex justify-between gap-3 items-start"><h5 className="font-semibold text-xs text-slate-200">{report.title} · fictício</h5><button aria-label={`Remover exemplo ${report.title}`} onClick={() => setReports(current => current.filter(item => item.id !== report.id))} className="text-slate-400 hover:text-rose-400"><Trash2 size={14} /></button></div>
          <p className="text-xs text-slate-400 leading-relaxed">{report.context}</p>
          <p className="text-[10px] font-mono text-slate-500">Identificador didático: {report.id}</p>
        </article>)}
      </div>
    </section>
  );
}
