import React from "react";
import CitizenToolbox from "./CitizenToolbox";
import AlgorithmicSeverityCalculator from "./AlgorithmicSeverityCalculator";
import DoctoralLab from "./DoctoralLab";

export default function TabSimulacao() {
  return (
    <div className="space-y-8 animate-fadeIn" id="tab-simulacao-view">
      {/* Citizen Defenses Interactive Toolbox */}
      <CitizenToolbox />

      {/* Interactive Severity Assessment Calculator Wrapper */}
      <div className="w-full">
        <AlgorithmicSeverityCalculator />
      </div>

      {/* Advanced Research Doctoral & State Crisis Bureau Simulator */}
      <DoctoralLab />
    </div>
  );
}
