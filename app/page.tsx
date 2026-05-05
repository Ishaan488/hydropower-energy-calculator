"use client";

import React, { useState, useMemo, useCallback } from "react";
import InputPanel from "@/components/InputPanel";
import OutputPanel from "@/components/OutputPanel";
import EnergyFlowDiagram from "@/components/EnergyFlowDiagram";
import ComparisonTable, { Scenario } from "@/components/ComparisonTable";
import RealWorldExamples from "@/components/RealWorldExamples";
import ExportButton from "@/components/ExportButton";
import { calculateHydropower } from "@/lib/calculations";
import { recommendTurbine } from "@/lib/turbineData";

export default function HomePage() {
  const [head, setHead] = useState(50);
  const [flowRate, setFlowRate] = useState(10);
  const [efficiency, setEfficiency] = useState(0.85);
  const [plantType, setPlantType] = useState("small");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [nextId, setNextId] = useState(1);

  const result = useMemo(
    () => calculateHydropower(head, flowRate, efficiency, plantType),
    [head, flowRate, efficiency, plantType]
  );
  const turbine = useMemo(() => recommendTurbine(head), [head]);

  const addScenario = useCallback(() => {
    if (scenarios.length >= 3) return;
    setScenarios((prev) => [...prev, { id: nextId, head, flowRate, efficiency, result }]);
    setNextId((prev) => prev + 1);
  }, [scenarios.length, nextId, head, flowRate, efficiency, result]);

  const removeScenario = useCallback((id: number) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <div className="relative min-h-screen z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-zinc-100 leading-none">
                  HydroCalc Pro
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-xs font-mono text-zinc-500">
                P = η × ρ × g × h × Q
              </div>
              <ExportButton head={head} flowRate={flowRate} efficiency={efficiency} result={result} turbine={turbine} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Formula bar */}
        <div className="glass-card px-6 py-4 flex flex-col sm:flex-row items-center justify-center text-sm font-mono text-zinc-500">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span>P = </span>
            <span className="text-zinc-300">η({Math.round(efficiency * 100)}%)</span>
            <span>×</span>
            <span className="text-zinc-300">ρ(1000)</span>
            <span>×</span>
            <span className="text-zinc-300">g(9.81)</span>
            <span>×</span>
            <span className="text-blue-400">h({head}m)</span>
            <span>×</span>
            <span className="text-blue-400">Q({flowRate}m³/s)</span>
            <span>=</span>
            <span className="text-emerald-400 font-bold text-base bg-emerald-500/10 px-2 py-0.5 rounded">
              {result.powerKW >= 1000 ? `${(result.powerKW / 1000).toFixed(2)} MW` : `${result.powerKW.toFixed(1)} kW`}
            </span>
          </div>
        </div>

        {/* Input + Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputPanel
            head={head} flowRate={flowRate} efficiency={efficiency} plantType={plantType} turbine={turbine}
            onHeadChange={setHead} onFlowRateChange={setFlowRate} onEfficiencyChange={setEfficiency} onPlantTypeChange={setPlantType}
          />
          <OutputPanel result={result} efficiency={efficiency} />
        </div>

        {/* Energy Flow Diagram */}
        <EnergyFlowDiagram powerKW={result.powerKW} flowRate={flowRate} isActive={result.powerKW > 0} />

        {/* Comparison + Benchmarks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComparisonTable scenarios={scenarios} onRemove={removeScenario} onAdd={addScenario} canAdd={scenarios.length < 3} />
          <RealWorldExamples currentPowerMW={result.powerMW} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-3 text-xs text-zinc-500">
            <span>Theoretical calculations only. Actual output depends on site conditions.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
