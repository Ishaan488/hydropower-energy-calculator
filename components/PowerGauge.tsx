"use client";

import React, { useMemo, useState, useEffect } from "react";

interface PowerGaugeProps {
  powerKW: number;
  efficiency: number;
}

export default function PowerGauge({ powerKW, efficiency }: PowerGaugeProps) {
  // Calculate max possible power at 100% efficiency for the current head/flow
  const maxPossibleKW = powerKW > 0 && efficiency > 0 ? powerKW / efficiency : 0;
  
  const getDynamicScale = (val: number) => {
    if (val <= 0) return 10;
    const order = Math.floor(Math.log10(val));
    const power = Math.pow(10, order);
    const normalized = val / power; // Between 1 and 10

    if (normalized <= 1.0001) return power;
    if (normalized <= 2) return 2 * power;
    if (normalized <= 5) return 5 * power;
    return 10 * power;
  };

  const maxKW = getDynamicScale(maxPossibleKW);
  
  // Linear scale strictly relative to the current site setup
  const ratio = Math.min(Math.max(powerKW / maxKW, 0), 1);
  const effPct = efficiency * 100;

  // Arc geometry
  const cx = 150, cy = 130, r = 100;
  const startAngleDeg = 270; // 270 deg with the -90 offset means 180 rad (left)
  const sweepDeg = 180; // simple half-circle to the right

  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const polarToXY = (angleDeg: number, radius: number) => ({
    x: cx + radius * Math.cos(toRad(angleDeg)),
    y: cy + radius * Math.sin(toRad(angleDeg)),
  });

  const arcStart = polarToXY(startAngleDeg, r);
  const arcEnd = polarToXY(startAngleDeg + sweepDeg, r);
  const bgArcPath = `M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 0 1 ${arcEnd.x} ${arcEnd.y}`;

  const totalArcLen = (sweepDeg / 360) * 2 * Math.PI * r;
  const filledLen = totalArcLen * ratio;
  const gapLen = totalArcLen - filledLen;

  const getColor = () => {
    if (effPct >= 85) return "#10b981"; // emerald-500
    if (effPct >= 75) return "#3b82f6"; // blue-500
    if (effPct >= 65) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };
  const color = getColor();

  const displayValue = powerKW >= 1000
    ? `${(powerKW / 1000).toFixed(2)}`
    : powerKW >= 1
      ? `${powerKW.toFixed(1)}`
      : `${powerKW.toFixed(3)}`;
  const displayUnit = powerKW >= 1000 ? "MW" : "kW";

  return (
    <div className="flex flex-col items-center">
      <svg width="300" height="150" viewBox="0 0 300 150" className="overflow-visible">
        {/* Background track */}
        <path d={bgArcPath} fill="none" stroke="#27272a" strokeWidth="16" strokeLinecap="round" />

        {/* Filled track */}
        <path
          d={bgArcPath}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          style={{ strokeDasharray: `${filledLen} ${gapLen}` }}
        />

        {/* Min/Max Labels */}
        <text x={cx - r - 10} y={cy + 20} textAnchor="middle" className="fill-zinc-600 font-mono text-[10px]">
          0
        </text>
        <text x={cx + r + 10} y={cy + 20} textAnchor="middle" className="fill-zinc-600 font-mono text-[10px]">
          {maxKW >= 1000000 ? `${+(maxKW / 1000000).toFixed(1)}GW` : maxKW >= 1000 ? `${+(maxKW / 1000).toFixed(1)}MW` : `${+maxKW.toFixed(1)}kW`}
        </text>

        {/* Center text */}
        <text x={cx} y={cy - 25} textAnchor="middle" className="font-mono font-medium fill-zinc-100" style={{ fontSize: "36px" }}>
          {displayValue}
        </text>
        <text x={cx} y={cy - 5} textAnchor="middle" className="font-mono fill-zinc-500" style={{ fontSize: "14px", letterSpacing: "1px" }}>
          {displayUnit}
        </text>
      </svg>
    </div>
  );
}
