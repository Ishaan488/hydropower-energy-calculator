"use client";

import React from "react";
import { HydroResult, formatNumber, getClassificationColor } from "@/lib/calculations";
import { recommendTurbine } from "@/lib/turbineData";

export interface Scenario {
  id: number;
  head: number;
  flowRate: number;
  efficiency: number;
  result: HydroResult;
}

interface ComparisonTableProps {
  scenarios: Scenario[];
  onRemove: (id: number) => void;
  onAdd: () => void;
  canAdd: boolean;
}

export default function ComparisonTable({ scenarios, onRemove, onAdd, canAdd }: ComparisonTableProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80 mb-6">
        <div className="w-8 h-8 rounded bg-violet-500/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>
        <h2 className="section-title">Scenario Comparison</h2>
        <button
          onClick={onAdd}
          disabled={!canAdd}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${canAdd
              ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              : "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Current ({scenarios.length}/3)
        </button>
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-3 opacity-30">📊</div>
          <p className="text-sm text-zinc-500">No scenarios saved yet</p>
          <p className="text-[10px] text-zinc-600 mt-1">Click &quot;Add Current&quot; to save the current configuration</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/80">
                <th className="text-left py-2 px-3 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Parameter</th>
                {scenarios.map((s, i) => (
                  <th key={s.id} className="text-center py-2 px-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
                        Scenario {i + 1}
                      </span>
                      <button
                        onClick={() => onRemove(s.id)}
                        className="w-5 h-5 rounded bg-zinc-800 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center text-[12px] transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              <Row label="Head (m)" values={scenarios.map(s => `${s.head} m`)} best={findBest(scenarios.map(s => s.head))} />
              <Row label="Flow (m³/s)" values={scenarios.map(s => `${s.flowRate} m³/s`)} best={findBest(scenarios.map(s => s.flowRate))} />
              <Row label="Efficiency" values={scenarios.map(s => `${Math.round(s.efficiency * 100)}%`)} best={findBest(scenarios.map(s => s.efficiency))} />
              <Row label="Turbine" values={scenarios.map(s => recommendTurbine(s.head).name)} />
              <Row label="Power (kW)" values={scenarios.map(s => formatNumber(s.result.powerKW))} best={findBest(scenarios.map(s => s.result.powerKW))} highlight />
              <Row label="Power (MW)" values={scenarios.map(s => formatNumber(s.result.powerMW, 3))} best={findBest(scenarios.map(s => s.result.powerMW))} />
              <Row label="Energy/day" values={scenarios.map(s => `${formatNumber(s.result.energyPerDayKWh)} kWh`)} best={findBest(scenarios.map(s => s.result.energyPerDayKWh))} />
              <Row label="Energy/year" values={scenarios.map(s => `${formatNumber(s.result.energyPerYearMWh)} MWh`)} best={findBest(scenarios.map(s => s.result.energyPerYearMWh))} />
              <tr>
                <td className="py-2 px-3 text-[10px] text-zinc-500 font-medium">Class</td>
                {scenarios.map((s) => (
                  <td key={s.id} className="py-2 px-3 text-center">
                    <span className="text-[10px] font-medium text-zinc-300">
                      {s.result.classification}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, values, best, highlight }: { label: string; values: string[]; best?: number; highlight?: boolean }) {
  return (
    <tr>
      <td className="py-2 px-3 text-[10px] text-zinc-500 font-medium">{label}</td>
      {values.map((v, i) => (
        <td key={i} className={`py-2 px-3 text-center font-mono text-xs ${best === i ? (highlight ? "text-blue-400 font-semibold" : "text-emerald-400 font-medium") : "text-zinc-400"
          }`}>
          {v}
          {best === i && <span className="ml-1 text-[8px] text-zinc-600">★</span>}
        </td>
      ))}
    </tr>
  );
}

function findBest(values: number[]): number | undefined {
  if (values.length < 2) return undefined;
  return values.indexOf(Math.max(...values));
}
