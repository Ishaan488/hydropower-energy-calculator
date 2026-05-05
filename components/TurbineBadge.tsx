"use client";

import React from "react";
import { TurbineInfo } from "@/lib/turbineData";

interface TurbineBadgeProps {
  turbine: TurbineInfo;
}

function TurbineIcon({ type, color }: { type: string; color: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all duration-500"
    >
      {type === "pelton" && (
        <>
          <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="1" opacity="0.2" />
          <circle cx="24" cy="24" r="3.5" fill={color} opacity="0.6" />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 24 + 13 * Math.cos(rad);
            const y = 24 + 13 * Math.sin(rad);
            return (
              <g key={i} transform={`translate(${x}, ${y}) rotate(${angle})`}>
                <path d="M-4,-2.5 Q0,-5.5 4,-2.5 Q2.5,0 4,2.5 Q0,4 -4,2.5 Q-2.5,0 -4,-2.5Z"
                  fill={color} opacity="0.5" />
              </g>
            );
          })}
        </>
      )}
      {type === "francis" && (
        <>
          <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="1" opacity="0.2" />
          <circle cx="24" cy="24" r="3.5" fill={color} opacity="0.6" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 24 + 5 * Math.cos(rad);
            const y1 = 24 + 5 * Math.sin(rad);
            const x2 = 24 + 15 * Math.cos(rad);
            const y2 = 24 + 15 * Math.sin(rad);
            const cx1 = 24 + 10 * Math.cos(rad + 0.4);
            const cy1 = 24 + 10 * Math.sin(rad + 0.4);
            return (
              <path key={i} d={`M${x1},${y1} Q${cx1},${cy1} ${x2},${y2}`}
                stroke={color} strokeWidth="1.5" fill="none" opacity="0.45" />
            );
          })}
        </>
      )}
      {type === "kaplan" && (
        <>
          <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="1" opacity="0.2" />
          <circle cx="24" cy="24" r="4" fill={color} opacity="0.6" />
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 24 + 5 * Math.cos(rad);
            const y1 = 24 + 5 * Math.sin(rad);
            const x2 = 24 + 16 * Math.cos(rad);
            const y2 = 24 + 16 * Math.sin(rad);
            const cx1 = 24 + 11 * Math.cos(rad + 0.5);
            const cy1 = 24 + 11 * Math.sin(rad + 0.5);
            const cx2 = 24 + 11 * Math.cos(rad - 0.3);
            const cy2 = 24 + 11 * Math.sin(rad - 0.3);
            return (
              <path key={i} d={`M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`}
                stroke={color} strokeWidth="2" fill="none" opacity="0.45" strokeLinecap="round" />
            );
          })}
        </>
      )}
    </svg>
  );
}

export default function TurbineBadge({ turbine }: TurbineBadgeProps) {
  return (
    <div className={`glass-card p-4 ${turbine.bgColor} ${turbine.borderColor} transition-all duration-500`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-14 h-14 rounded-lg ${turbine.bgColor} border ${turbine.borderColor}
                      flex items-center justify-center`}>
          <TurbineIcon type={turbine.type} color={turbine.color} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-200">{turbine.name}</h3>
            <span className={`badge ${turbine.bgColor} ${turbine.borderColor} text-[9px]`}
              style={{ color: turbine.color }}>
              {turbine.headCategory}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-2">
            {turbine.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {turbine.characteristics.map((char, i) => (
              <span key={i} className="text-[9px] font-medium px-2 py-0.5 rounded bg-gray-800 text-gray-500 border border-gray-700/50">
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
