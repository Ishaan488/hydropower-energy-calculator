"use client";

import React from "react";

interface EfficiencyBarProps {
  value: number;
}

export default function EfficiencyBar({ value }: EfficiencyBarProps) {
  const percentage = Math.round(value * 100);

  const getColor = (pct: number) => {
    if (pct >= 85) return { bar: "from-emerald-600 to-emerald-500", label: "text-emerald-400", status: "Excellent" };
    if (pct >= 75) return { bar: "from-blue-600 to-blue-500", label: "text-blue-400", status: "Good" };
    if (pct >= 65) return { bar: "from-amber-600 to-amber-500", label: "text-amber-400", status: "Moderate" };
    return { bar: "from-red-600 to-red-500", label: "text-red-400", status: "Low" };
  };

  const colors = getColor(percentage);
  const fillWidth = ((percentage - 50) / 45) * 100;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-xs font-medium ${colors.label}`}>{colors.status}</span>
        <span className="text-xs font-mono text-gray-500">{percentage}%</span>
      </div>

      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-gray-700">50%</span>
        <span className="text-[9px] text-gray-700">72%</span>
        <span className="text-[9px] text-gray-700">95%</span>
      </div>
    </div>
  );
}
