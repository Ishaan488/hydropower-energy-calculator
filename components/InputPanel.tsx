"use client";

import React from "react";
import InfoTooltip from "./InfoTooltip";
import EfficiencyBar from "./EfficiencyBar";
import TurbineBadge from "./TurbineBadge";
import { tooltips } from "@/lib/tooltipData";
import { plantTypeHints } from "@/lib/calculations";
import { TurbineInfo } from "@/lib/turbineData";

interface InputPanelProps {
  head: number;
  flowRate: number;
  efficiency: number;
  plantType: string;
  turbine: TurbineInfo;
  onHeadChange: (v: number) => void;
  onFlowRateChange: (v: number) => void;
  onEfficiencyChange: (v: number) => void;
  onPlantTypeChange: (v: string) => void;
}

export default function InputPanel({
  head, flowRate, efficiency, plantType, turbine,
  onHeadChange, onFlowRateChange, onEfficiencyChange, onPlantTypeChange,
}: InputPanelProps) {
  const currentHint = plantTypeHints[plantType];
  const headPct = ((head - 1) / 999) * 100;
  const effPct = ((efficiency * 100 - 50) / 45) * 100;

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80">
        <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h2 className="section-title">Input Parameters</h2>
      </div>

      {/* Head */}
      <div className="space-y-3">
        <label className="label-text" htmlFor="head-input">
          Head Height (h) <InfoTooltip content={tooltips.head} />
        </label>
        <div className="relative">
          <input id="head-input" type="number" min={1} max={1000} step={1} value={head}
            onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) onHeadChange(Math.max(1, Math.min(1000, v))); }}
            className="input-field pr-12" placeholder="Enter head height..." />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">m</span>
        </div>
        <input type="range" min={1} max={1000} step={1} value={head}
          onChange={(e) => onHeadChange(parseFloat(e.target.value))}
          style={{ background: `linear-gradient(to right, #3b82f6 ${headPct}%, #27272a ${headPct}%)` }} />
        <div className="flex justify-between">
          <span className="text-[10px] text-zinc-500">1 m</span>
          <span className="text-[10px] text-zinc-500">1000 m</span>
        </div>
      </div>

      {/* Flow Rate */}
      <div className="space-y-3">
        <label className="label-text" htmlFor="flow-input">
          Flow Rate (Q) <InfoTooltip content={tooltips.flowRate} />
        </label>
        <div className="relative">
          <input id="flow-input" type="number" min={0.1} max={5000} step={0.1} value={flowRate}
            onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) onFlowRateChange(Math.max(0.1, Math.min(5000, v))); }}
            className="input-field pr-16" placeholder="Enter flow rate..." />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">m³/s</span>
        </div>
        {currentHint && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-blue-400 font-medium">Suggested range:</span>
            <span className="text-[10px] text-zinc-400 font-mono">{currentHint.flowRange}</span>
          </div>
        )}
      </div>

      {/* Efficiency */}
      <div className="space-y-3">
        <label className="label-text flex justify-between" htmlFor="eff-slider">
          <span>Turbine Efficiency (η) <InfoTooltip content={tooltips.efficiency} /></span>
          <span className="text-zinc-200 font-mono">{Math.round(efficiency * 100)}%</span>
        </label>
        <input id="eff-slider" type="range" min={50} max={95} step={1}
          value={Math.round(efficiency * 100)}
          onChange={(e) => onEfficiencyChange(parseInt(e.target.value) / 100)}
          style={{ background: `linear-gradient(to right, #3b82f6 ${effPct}%, #27272a ${effPct}%)` }} />
        <div className="flex justify-between">
          <span className="text-[10px] text-zinc-500">50%</span>
          <span className="text-[10px] text-zinc-500">95%</span>
        </div>
      </div>

      {/* Plant Type */}
      <div className="space-y-3">
        <label className="label-text" htmlFor="plant-type">
          Plant Type <InfoTooltip content={tooltips.plantType} />
        </label>
        <select id="plant-type" value={plantType} onChange={(e) => onPlantTypeChange(e.target.value)} className="input-field cursor-pointer">
          <option value="micro">Micro (Max 100 kW)</option>
          <option value="mini">Mini (Max 1 MW)</option>
          <option value="small">Small (Max 10 MW)</option>
          <option value="medium">Medium (Max 100 MW)</option>
          <option value="large">Large (Max 1,000 MW)</option>
          <option value="mega">Mega (Max 50 GW)</option>
        </select>
      </div>

      {/* Turbine Recommendation */}
      <div className="pt-2">
        <div className="label-text mb-3">
          Auto Turbine Recommendation <InfoTooltip content={tooltips.turbine} />
        </div>
        <TurbineBadge turbine={turbine} />
      </div>
    </div>
  );
}
