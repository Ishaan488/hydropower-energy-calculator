"use client";

import React, { useRef, useState, useEffect } from "react";
import { HydroResult, formatNumber } from "@/lib/calculations";
import { TurbineInfo } from "@/lib/turbineData";

interface ExportButtonProps {
  head: number;
  flowRate: number;
  efficiency: number;
  result: HydroResult;
  turbine: TurbineInfo;
}

export default function ExportButton({ head, flowRate, efficiency, result, turbine }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimestamp(new Date().toLocaleString());
  }, [head, flowRate, efficiency]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      if (!reportRef.current) return;

      // Make the hidden report visible temporarily
      reportRef.current.style.display = "block";
      reportRef.current.style.position = "fixed";
      reportRef.current.style.left = "-9999px";
      reportRef.current.style.top = "0";

      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });

      reportRef.current.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`hydropower-report-${Date.now()}.pdf`);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const effPct = Math.round(efficiency * 100);

  return (
    <>
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-200 ${
          isExporting
            ? "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-wait"
            : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-zinc-600"
        }`}
      >
        {isExporting ? (
          <>
            <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export PDF
          </>
        )}
      </button>

      {/* Hidden report template for PDF generation */}
      <div ref={reportRef} style={{ display: "none", width: "800px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ padding: "48px", background: "#ffffff", color: "#18181b", minHeight: "1050px", position: "relative" }}>
          
          {/* Header */}
          <div style={{ borderBottom: "2px solid #e4e4e7", paddingBottom: "24px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#09090b", margin: "0 0 8px 0" }}>
                Hydropower Energy Report
              </h1>
              <p style={{ fontSize: "14px", color: "#71717a", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }}></span>
                Generated on {timestamp}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#3b82f6", letterSpacing: "1px" }}>HydroCalc Pro</div>
              <div style={{ fontSize: "10px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>Engineering Tool</div>
            </div>
          </div>

          {/* Core Formula */}
          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "24px", marginBottom: "32px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Calculation Methodology</div>
            <p style={{ fontSize: "24px", fontFamily: "monospace", color: "#0f172a", margin: "0 0 12px 0", fontWeight: "600" }}>
              P = η × ρ × g × h × Q
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "13px", color: "#475569", fontFamily: "monospace", background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
              <span>P = {effPct/100}</span>
              <span style={{ color: "#cbd5e1" }}>×</span>
              <span>1000 kg/m³</span>
              <span style={{ color: "#cbd5e1" }}>×</span>
              <span>9.81 m/s²</span>
              <span style={{ color: "#cbd5e1" }}>×</span>
              <span style={{ color: "#3b82f6", fontWeight: "600" }}>{head}m</span>
              <span style={{ color: "#cbd5e1" }}>×</span>
              <span style={{ color: "#3b82f6", fontWeight: "600" }}>{flowRate}m³/s</span>
              <span style={{ color: "#cbd5e1" }}>=</span>
              <span style={{ color: "#10b981", fontWeight: "700" }}>{formatNumber(result.powerW, 0)} W</span>
            </div>
          </div>

          {/* Data Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            
            {/* Input Parameters */}
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#09090b", marginBottom: "16px", borderBottom: "1px solid #f4f4f5", paddingBottom: "8px" }}>Site Parameters</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", color: "#71717a" }}>Head Height</td>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", textAlign: "right", fontWeight: "600", color: "#09090b" }}>{head} <span style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "400" }}>m</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", color: "#71717a" }}>Flow Rate</td>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", textAlign: "right", fontWeight: "600", color: "#09090b" }}>{flowRate} <span style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "400" }}>m³/s</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", color: "#71717a" }}>System Efficiency</td>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", textAlign: "right", fontWeight: "600", color: "#09090b" }}>{effPct}%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", color: "#71717a" }}>Recommended Turbine</td>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", textAlign: "right", fontWeight: "600", color: "#3b82f6" }}>{turbine.name}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Output Results */}
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#09090b", marginBottom: "16px", borderBottom: "1px solid #f4f4f5", paddingBottom: "8px" }}>Generation Estimates</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", color: "#71717a" }}>Power Output</td>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", textAlign: "right", fontWeight: "700", color: "#10b981", fontSize: "16px" }}>{formatNumber(result.powerKW)} <span style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "400" }}>kW</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", color: "#71717a" }}>Megawatt Scale</td>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", textAlign: "right", fontWeight: "600", color: "#09090b" }}>{formatNumber(result.powerMW, 3)} <span style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "400" }}>MW</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", color: "#71717a" }}>Energy per Day</td>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", textAlign: "right", fontWeight: "600", color: "#09090b" }}>{formatNumber(result.energyPerDayKWh)} <span style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "400" }}>kWh</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", color: "#71717a" }}>Energy per Year</td>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f4f4f5", textAlign: "right", fontWeight: "600", color: "#09090b" }}>{formatNumber(result.energyPerYearMWh)} <span style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "400" }}>MWh</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          {/* Classification Badge */}
          <div style={{ background: "#f4f4f5", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #8b5cf6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#71717a", fontWeight: "500", marginBottom: "4px" }}>Plant Classification</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#09090b" }}>{result.classification} Hydropower Plant</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ position: "absolute", bottom: "48px", left: "48px", right: "48px", borderTop: "1px solid #e4e4e7", paddingTop: "24px", display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: "11px", color: "#a1a1aa", margin: 0, maxWidth: "500px", lineHeight: "1.5" }}>
              <strong>Disclaimer:</strong> This is a theoretical calculation based on standard physics formulas. Actual power output will vary depending on site-specific conditions, pipe friction losses, seasonal water availability, and mechanical efficiency variations.
            </p>
            <p style={{ fontSize: "11px", color: "#d4d4d8", margin: 0, fontFamily: "monospace" }}>
              REF-{Date.now().toString().slice(-6)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
