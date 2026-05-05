"use client";

import React, { useState, useRef, useEffect } from "react";
import { TooltipContent } from "@/lib/tooltipData";

interface InfoTooltipProps {
  content: TooltipContent;
}

export default function InfoTooltip({ content }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <span className="relative inline-flex">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full 
                   bg-gray-700/50 text-gray-500 hover:bg-blue-600/15 hover:text-blue-400
                   transition-colors duration-150 text-[10px] font-bold cursor-help"
        aria-label={`Info about ${content.title}`}
      >
        i
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          className="tooltip-enter absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72
                     bg-gray-900 border border-gray-700 rounded-lg shadow-lg shadow-black/50
                     p-4 pointer-events-auto"
        >
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 
                          border-r border-b border-gray-700 rotate-45" />

          <h4 className="text-sm font-semibold text-blue-400 mb-2">
            {content.title}
          </h4>

          <p className="text-xs text-gray-300 leading-relaxed mb-2">
            {content.description}
          </p>

          <div className="space-y-1.5">
            <div className="flex gap-2">
              <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider whitespace-nowrap mt-0.5">
                Typical
              </span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {content.typical}
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider whitespace-nowrap mt-0.5">
                Effect
              </span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {content.effect}
              </p>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
