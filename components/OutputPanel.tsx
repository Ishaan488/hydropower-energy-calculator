"use client";

import React from "react";
import InfoTooltip from "./InfoTooltip";
import PowerGauge from "./PowerGauge";
import { HydroResult, formatNumber } from "@/lib/calculations";
import { tooltips } from "@/lib/tooltipData";

interface OutputPanelProps {
  result: HydroResult;
  efficiency: number;
}

export default function OutputPanel({ result, efficiency }: OutputPanelProps) {
  return (
    <div className="glass-card p-6 space-y-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80">
        <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <h2 className="section-title">Output Results</h2>
        <span className="ml-auto bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs font-medium border border-zinc-700">
          {result.classification}
        </span>
      </div>

      {/* Gauge */}
      <div className="flex-1 flex flex-col justify-center py-4">
        <PowerGauge powerKW={result.powerKW} efficiency={efficiency} />
      </div>

      {/* Power outputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-950 rounded-lg p-4 text-center border border-zinc-800/80">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Kilowatts</div>
          <div className="font-mono text-xl font-medium text-emerald-400">
            {formatNumber(result.powerKW)}
            <span className="text-xs text-emerald-500/50 ml-1">kW</span>
          </div>
        </div>
        <div className="bg-zinc-950 rounded-lg p-4 text-center border border-zinc-800/80">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Megawatts</div>
          <div className="font-mono text-xl font-medium text-emerald-400">
            {formatNumber(result.powerMW, 3)}
            <span className="text-xs text-emerald-500/50 ml-1">MW</span>
          </div>
        </div>
      </div>

      {/* Capacity & realistic annual energy */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-950 rounded-lg p-4 text-center border border-zinc-800/80">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-1 flex items-center justify-center gap-1.5">
            <span>Capacity Factor</span>
            <InfoTooltip content={tooltips.capacityFactorCard} />
          </div>
          <div className="font-mono text-xl font-medium text-amber-400">
            {Math.round(result.capacityFactor * 100)}
            <span className="text-xs text-amber-500/60 ml-1">%</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Typical: {result.capacityFactorRange}</div>
        </div>

        <div className="bg-zinc-950 rounded-lg p-4 text-center border border-zinc-800/80">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-1 flex items-center justify-center gap-1.5">
            <span>Actual Energy/Year</span>
            <InfoTooltip content={tooltips.actualEnergyYearly} />
          </div>
          <div className="font-mono text-xl font-medium text-cyan-400">
            {formatNumber(result.energyPerYearAtCapacityFactorMWh)}
            <span className="text-xs text-cyan-500/60 ml-1">MWh</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">MWh/year (realistic)</div>
        </div>
      </div>

      {/* Energy outputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col bg-zinc-950 rounded-lg p-4 border border-zinc-800/80">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs text-zinc-400 font-medium">Energy / Day</span>
            <InfoTooltip content={tooltips.energyDaily} />
          </div>
          <div className="mt-auto">
            <span className="font-mono text-lg font-medium text-blue-400">
              {formatNumber(result.energyPerDayKWh)}
            </span>
            <span className="text-[10px] text-zinc-500 ml-1">kWh</span>
          </div>
        </div>

        <div className="flex flex-col bg-zinc-950 rounded-lg p-4 border border-zinc-800/80">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs text-zinc-400 font-medium">Energy / Year</span>
            <InfoTooltip content={tooltips.energyYearly} />
          </div>
          <div className="mt-auto">
            <span className="font-mono text-lg font-medium text-blue-400">
              {formatNumber(result.energyPerYearMWh)}
            </span>
            <span className="text-[10px] text-zinc-500 ml-1">MWh</span>
          </div>
        </div>
      </div>
    </div>
  );
}
