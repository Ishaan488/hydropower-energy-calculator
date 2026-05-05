import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HydroCalc Pro — Hydropower Energy Calculator",
  description:
    "Interactive hydropower energy calculator. Compute power output, energy generation, and get turbine recommendations using P = η × ρ × g × h × Q.",
  keywords: [
    "hydropower",
    "energy calculator",
    "turbine",
    "renewable energy",
    "pelton",
    "francis",
    "kaplan",
    "power generation",
  ],
  openGraph: {
    title: "HydroCalc Pro — Hydropower Energy Calculator",
    description: "Calculate hydropower plant output with real-time visualizations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-zinc-950 text-zinc-200 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
