"use client";

import React, { useEffect, useState } from "react";

interface EnergyFlowDiagramProps {
  powerKW: number;
  flowRate: number;
  isActive: boolean;
}

const stages = [
  { id: "reservoir", label: "Reservoir", icon: "💧", color: "#2563eb" },
  { id: "penstock", label: "Penstock", icon: "🔽", color: "#4f46e5" },
  { id: "turbine", label: "Turbine", icon: "⚙️", color: "#0891b2" },
  { id: "generator", label: "Generator", icon: "⚡", color: "#d97706" },
  { id: "grid", label: "Grid", icon: "🏭", color: "#059669" },
];

export default function EnergyFlowDiagram({ powerKW, flowRate, isActive }: EnergyFlowDiagramProps) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const speed = Math.max(400, 1200 - flowRate * 2);
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, speed);
    return () => clearInterval(interval);
  }, [isActive, flowRate]);

  const particleDuration = Math.max(1.5, 4 - (flowRate / 1000) * 2);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80 mb-6">
        <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        <h2 className="section-title">Energy Flow Diagram</h2>
        {isActive && (
          <span className="ml-auto flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        )}
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          {stages.map((stage, i) => (
            <React.Fragment key={stage.id}>
              <div className={`flex flex-col items-center gap-3 transition-all duration-500 ${
                activeStage === i && isActive ? "scale-105" : "scale-100"
              }`}>
                <div
                  className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl
                    transition-all duration-500 border ${
                    activeStage === i && isActive
                      ? "border-opacity-40"
                      : "bg-zinc-950 border-zinc-800"
                  }`}
                  style={{
                    backgroundColor: activeStage === i && isActive ? `${stage.color}15` : undefined,
                    borderColor: activeStage === i && isActive ? `${stage.color}40` : undefined,
                  }}
                >
                  {stage.icon}
                </div>
                <span className={`text-[10px] md:text-xs font-medium transition-colors duration-300 ${
                  activeStage === i && isActive ? "text-zinc-200" : "text-zinc-500"
                }`}>
                  {stage.label}
                </span>
              </div>

              {i < stages.length - 1 && (
                <div className="flex-1 relative h-8 flex items-center min-w-[20px]">
                  <div className="w-full h-[1px] bg-zinc-800" />
                  <div className="absolute right-0 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-zinc-700" />
                  {isActive && [0, 1, 2].map((p) => (
                    <div
                      key={p}
                      className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-0"
                      style={{
                        backgroundColor: stages[i].color,
                        animation: `flow-particle ${particleDuration}s linear ${p * (particleDuration / 3)}s infinite`,
                      }}
                    />
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-6 text-center">
          <span className="text-xs text-zinc-500 font-mono">
            Flow: {flowRate.toFixed(1)} m³/s → Power: {powerKW >= 1000 ? `${(powerKW/1000).toFixed(2)} MW` : `${powerKW.toFixed(1)} kW`}
          </span>
        </div>
      </div>
    </div>
  );
}
