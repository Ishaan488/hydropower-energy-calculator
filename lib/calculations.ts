/**
 * Hydropower calculation engine
 * Core formula: P = eta x rho x g x h x Q
 */

// Physical constants
export const RHO = 1000; // Water density (kg/m^3)
export const G = 9.81; // Gravitational acceleration (m/s^2)
export type CapacityFactorPlantType = "large" | "small" | "mini" | "micro";

export const CAPACITY_FACTOR_MAP: Record<
  CapacityFactorPlantType,
  { defaultValue: number; range: string }
> = {
  large: { defaultValue: 0.45, range: "40-50%" },
  small: { defaultValue: 0.38, range: "30-45%" },
  mini: { defaultValue: 0.32, range: "25-40%" },
  micro: { defaultValue: 0.28, range: "20-35%" },
};

export type PlantClassification = "Pico" | "Micro" | "Mini" | "Large";

export interface HydroResult {
  powerW: number;
  powerKW: number;
  powerMW: number;
  capacityFactor: number;
  capacityFactorRange: string;
  energyPerDayKWh: number;
  energyPerYearMWh: number;
  energyPerDayAtCapacityFactorKWh: number;
  energyPerYearAtCapacityFactorMWh: number;
  classification: PlantClassification;
}

/**
 * Calculate hydropower output
 * @param h - Head height in meters (1-1000)
 * @param Q - Flow rate in m^3/s (0.1-5000)
 * @param eta - Turbine efficiency as decimal (0.50-0.95)
 */
export function calculateHydropower(
  h: number,
  Q: number,
  eta: number,
  plantType: string = "small"
): HydroResult {
  const powerW = eta * RHO * G * h * Q;
  const powerKW = powerW / 1000;
  const powerMW = powerW / 1_000_000;

  const energyPerDayKWh = powerKW * 24;
  const energyPerYearMWh = powerMW * 8760;
  const { defaultValue: capacityFactor, range: capacityFactorRange } =
    getCapacityFactorMeta(plantType);
  const energyPerDayAtCapacityFactorKWh = energyPerDayKWh * capacityFactor;
  const energyPerYearAtCapacityFactorMWh = energyPerYearMWh * capacityFactor;

  return {
    powerW,
    powerKW,
    powerMW,
    capacityFactor,
    capacityFactorRange,
    energyPerDayKWh,
    energyPerYearMWh,
    energyPerDayAtCapacityFactorKWh,
    energyPerYearAtCapacityFactorMWh,
    classification: classifyPlant(powerKW),
  };
}

export function getCapacityFactorMeta(plantType: string): {
  defaultValue: number;
  range: string;
} {
  if (plantType === "large" || plantType === "small" || plantType === "mini" || plantType === "micro") {
    return CAPACITY_FACTOR_MAP[plantType];
  }
  if (plantType === "medium" || plantType === "mega") {
    return CAPACITY_FACTOR_MAP.large;
  }
  return CAPACITY_FACTOR_MAP.small;
}

/**
 * Classify plant based on power output in kW
 */
export function classifyPlant(powerKW: number): PlantClassification {
  if (powerKW < 5) return "Pico";
  if (powerKW < 100) return "Micro";
  if (powerKW < 10_000) return "Mini";
  return "Large";
}

/**
 * Get classification color for UI badges
 */
export function getClassificationColor(
  classification: PlantClassification
): { bg: string; text: string; border: string; glow: string } {
  switch (classification) {
    case "Pico":
      return {
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        border: "border-purple-500/20",
        glow: "",
      };
    case "Micro":
      return {
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        border: "border-sky-500/20",
        glow: "",
      };
    case "Mini":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
        glow: "",
      };
    case "Large":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/20",
        glow: "",
      };
  }
}

/**
 * Format number with appropriate precision and commas
 */
export function formatNumber(
  value: number,
  maxDecimals: number = 2
): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(maxDecimals) + "M";
  }
  if (value >= 1000) {
    return value.toLocaleString("en-US", {
      maximumFractionDigits: maxDecimals,
    });
  }
  if (value < 0.01 && value > 0) {
    return value.toExponential(2);
  }
  return value.toFixed(maxDecimals);
}

/** Plant type flow rate hints */
export const plantTypeHints: Record<
  string,
  { label: string; flowRange: string; description: string }
> = {
  micro: {
    label: "Micro",
    flowRange: "0.1 - 5 m^3/s",
    description: "Small streams, rural electrification",
  },
  mini: {
    label: "Mini",
    flowRange: "5 - 50 m^3/s",
    description: "Small rivers, community power",
  },
  small: {
    label: "Small",
    flowRange: "50 - 500 m^3/s",
    description: "Medium rivers, industrial use",
  },
  large: {
    label: "Large",
    flowRange: "500 - 5000 m^3/s",
    description: "Major rivers, grid-scale power",
  },
};
