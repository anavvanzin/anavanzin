import React from "react";
import { ShieldCheck, Scale, FileText } from "lucide-react";
import logo from "../assets/images/cca_flat_logo_1779693923324.png";

interface HeaderProps {
  onShowFundamentos: () => void;
}

export default function Header({ onShowFundamentos }: HeaderProps) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md text-slate-100 border-b border-slate-800/80 shadow-xl sticky top-0 z-30 relative overflow-hidden" id="main-header">
      {/* Decorative Federal Banner */}
      <div className="h-1 w-full bg-gradient-to-r from-green-600 via-yellow-400 to-blue-600" />

      <div className="max-w-7xl mx-auto px-4 py-4.5 sm:px-6 lg:px-8 flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left gap-4">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3.5">
          <img
            src={logo}
            alt="Logo do Conselho de Contestação Algorítmica"
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-cover border border-slate-700/60 shadow-md transition-transform hover:scale-105 duration-200"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-wide lg:tracking-widest text-white leading-relaxed lg:leading-[1.8] font-display">
                Conselho de Contestação Algorítmica
              </h1>
              <span className="px-2.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full uppercase tracking-wider font-mono">
                Contestabilidade Cidadã
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              Auditoria de Decisões Estatais Automatizadas · Direitos Fundamentais (Art. 5º, LV & LGPD Art. 20)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-center md:self-auto font-mono text-xs">
          <button
            onClick={onShowFundamentos}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-750/80 shadow-md transition duration-150 active:scale-95 whitespace-nowrap"
          >
            <Scale size={14} className="text-amber-500" />
            <span>Fundamentos Jurídicos</span>
          </button>
        </div>
      </div>
    </header>
  );
}
