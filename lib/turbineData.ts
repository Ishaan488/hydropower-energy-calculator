/**
 * Turbine recommendation engine
 * Recommends turbine type based on head height
 */

export type TurbineType = "pelton" | "francis" | "kaplan";

export interface TurbineInfo {
  type: TurbineType;
  name: string;
  headCategory: string;
  headRange: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  characteristics: string[];
}

const turbineDatabase: Record<TurbineType, TurbineInfo> = {
  pelton: {
    type: "pelton",
    name: "Pelton Turbine",
    headCategory: "High Head",
    headRange: "> 100 m",
    description:
      "An impulse turbine with cup-shaped buckets that converts kinetic energy of high-velocity water jets into rotational energy. Ideal for high head, low flow applications.",
    color: "#2563eb",
    bgColor: "bg-blue-500/8",
    borderColor: "border-blue-500/20",
    glowColor: "",
    characteristics: [
      "Impulse turbine",
      "85-92% efficiency",
      "High head, low flow",
      "Simple maintenance",
    ],
  },
  francis: {
    type: "francis",
    name: "Francis Turbine",
    headCategory: "Medium Head",
    headRange: "30 – 100 m",
    description:
      "A reaction turbine where water flows radially inward and exits axially. The most widely used turbine type in the world, suitable for a wide range of conditions.",
    color: "#0891b2",
    bgColor: "bg-cyan-500/8",
    borderColor: "border-cyan-500/20",
    glowColor: "",
    characteristics: [
      "Reaction turbine",
      "90-95% efficiency",
      "Medium head & flow",
      "Most versatile",
    ],
  },
  kaplan: {
    type: "kaplan",
    name: "Kaplan Turbine",
    headCategory: "Low Head",
    headRange: "< 30 m",
    description:
      "A propeller-type reaction turbine with adjustable blades that operate efficiently at low heads and high flow rates. Ideal for run-of-river installations.",
    color: "#0d9488",
    bgColor: "bg-teal-500/8",
    borderColor: "border-teal-500/20",
    glowColor: "",
    characteristics: [
      "Propeller turbine",
      "88-93% efficiency",
      "Low head, high flow",
      "Adjustable blades",
    ],
  },
};

/**
 * Recommend turbine type based on head height
 */
export function recommendTurbine(head: number): TurbineInfo {
  if (head > 100) return turbineDatabase.pelton;
  if (head >= 30) return turbineDatabase.francis;
  return turbineDatabase.kaplan;
}

export { turbineDatabase };
