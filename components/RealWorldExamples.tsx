"use client";

import React from "react";

interface RealWorldExamplesProps {
  currentPowerMW: number;
}

const examples = [
  { name: "Pico Home Unit", location: "Rural Installation", capacity: 0.003, color: "#7c3aed" },
  { name: "Micro Village", location: "Community Plant", capacity: 0.05, color: "#2563eb" },
  { name: "Bhadra Dam", location: "Karnataka, India", capacity: 39.2, color: "#0891b2" },
  { name: "Nagarjuna Sagar", location: "Telangana, India", capacity: 816, color: "#0d9488" },
  { name: "Tehri Dam", location: "Uttarakhand, India", capacity: 1000, color: "#059669" },
  { name: "Bhakra Nangal", location: "Himachal, India", capacity: 1325, color: "#4f46e5" },
  { name: "Itaipu Dam", location: "Brazil/Paraguay", capacity: 14000, color: "#d97706" },
  { name: "Three Gorges", location: "Hubei, China", capacity: 22500, color: "#dc2626" },
];

export default function RealWorldExamples({ currentPowerMW }: RealWorldExamplesProps) {
  const maxCapacity = 22500;

  const getBarWidth = (capacity: number) => {
    const logMax = Math.log10(maxCapacity);
    const logVal = Math.log10(Math.max(capacity, 0.001));
    return Math.max(2, ((logVal + 3) / (logMax + 3)) * 100);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80 mb-6">
        <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2v20M2 12h20" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <h2 className="section-title">Real World Benchmarks</h2>
      </div>

      <div className="space-y-3">
        {examples.map((ex) => {
          const width = getBarWidth(ex.capacity);
          const isNearby = currentPowerMW > 0 && Math.abs(Math.log10(Math.max(currentPowerMW, 0.001)) - Math.log10(ex.capacity)) < 0.5;

          return (
            <div key={ex.name} className="group relative">
              <div className="flex items-center gap-3">
                <div className="w-28 flex-shrink-0">
                  <div className={`text-[11px] font-medium ${isNearby ? "text-zinc-200" : "text-zinc-400"} truncate`}>
                    {ex.name}
                  </div>
                  <div className="text-[9px] text-zinc-500 truncate">{ex.location}</div>
                </div>

                <div className="flex-1 relative h-2.5">
                  <div className="absolute inset-0 bg-zinc-900 rounded-full" />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out opacity-80"
                    style={{
                      width: `${width}%`,
                      backgroundColor: ex.color,
                    }}
                  />
                </div>

                <div className="w-16 text-right flex-shrink-0">
                  <span className="text-[11px] font-mono font-medium text-zinc-300">
                    {ex.capacity >= 1000 ? `${(ex.capacity / 1000).toFixed(1)}` : ex.capacity >= 1 ? ex.capacity.toFixed(0) : ex.capacity.toFixed(3)}
                  </span>
                  <span className="text-[9px] text-zinc-500 ml-0.5">
                    {ex.capacity >= 1000 ? "GW" : "MW"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {currentPowerMW > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-28 flex-shrink-0">
                <div className="text-[11px] font-semibold text-emerald-400">Your Plant</div>
                <div className="text-[9px] text-zinc-500">Current calc</div>
              </div>
              <div className="flex-1 relative h-2.5">
                <div className="absolute inset-0 bg-zinc-900 rounded-full" />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${getBarWidth(currentPowerMW)}%` }}
                />
              </div>
              <div className="w-16 text-right flex-shrink-0">
                <span className="text-[11px] font-mono font-semibold text-emerald-400">
                  {currentPowerMW >= 1000 ? `${(currentPowerMW / 1000).toFixed(1)}` : currentPowerMW >= 1 ? currentPowerMW.toFixed(2) : currentPowerMW.toFixed(4)}
                </span>
                <span className="text-[9px] text-zinc-500 ml-0.5">
                  {currentPowerMW >= 1000 ? "GW" : "MW"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
