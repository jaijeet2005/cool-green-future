/**
 * 10-year growth projection model for tree species.
 * Uses sigmoid growth curves and diminishing returns for environmental impact.
 */

import { TreeSpecies } from "./trees";

export interface YearlyProjection {
  year: number;
  canopyRadius: number; // meters
  height: number; // meters
  coolingImpact: number; // °C reduction
  aqiReduction: number; // AQI points
  co2Absorbed: number; // cumulative kg
  survivalProbability: number; // 0-1
}

const growthRateMultiplier: Record<string, number> = {
  slow: 0.6,
  medium: 1.0,
  fast: 1.4,
};

/**
 * Calculate a sigmoid growth curve value (0-1) for a given year.
 */
function sigmoidGrowth(year: number, rate: number): number {
  const midpoint = 5 / rate; // faster trees reach midpoint sooner
  return 1 / (1 + Math.exp(-rate * (year - midpoint)));
}

/**
 * Project tree growth and environmental impact over 10 years.
 */
export function projectTreeGrowth(
  species: TreeSpecies,
  count: number,
  climateMatch: boolean = true
): YearlyProjection[] {
  const rate = growthRateMultiplier[species.growthRate] ?? 1.0;
  const survivalBase = climateMatch ? 0.95 : 0.75;
  const projections: YearlyProjection[] = [];

  let cumulativeCO2 = 0;

  for (let year = 0; year <= 10; year++) {
    const growth = sigmoidGrowth(year, rate * 0.5);
    const maturity = Math.min(growth * 1.2, 1); // cap at 100%

    const canopyRadius = (species.canopySpread / 2) * maturity;
    const height = species.maxHeight * maturity;

    // Environmental impact scales with canopy area (pi*r^2) and count
    const canopyArea = Math.PI * canopyRadius * canopyRadius * count;
    const coolingImpact = species.coolingCapacity * maturity * count * 0.05;
    const aqiReduction = species.pollutionAbsorption * maturity * count * 1.2;

    // CO2 absorption increases with maturity
    const yearCO2 = species.co2Absorption * maturity * count;
    cumulativeCO2 += yearCO2;

    // Survival decreases slightly each year
    const survivalProbability = Math.max(
      survivalBase * Math.pow(0.995, year) - (climateMatch ? 0 : 0.02 * year),
      0.4
    );

    projections.push({
      year,
      canopyRadius: +canopyRadius.toFixed(1),
      height: +height.toFixed(1),
      coolingImpact: +Math.min(coolingImpact, 8).toFixed(2),
      aqiReduction: +Math.min(aqiReduction, 200).toFixed(1),
      co2Absorbed: Math.round(cumulativeCO2),
      survivalProbability: +survivalProbability.toFixed(2),
    });
  }

  return projections;
}

/**
 * Aggregate growth projections for multiple species.
 */
export function projectPlantationGrowth(
  trees: { species: TreeSpecies; count: number }[],
  climateMatch: boolean = true
): YearlyProjection[] {
  if (trees.length === 0) return [];

  const allProjections = trees.map((t) =>
    projectTreeGrowth(t.species, t.count, climateMatch)
  );

  return Array.from({ length: 11 }, (_, year) => {
    const yearData = allProjections.map((p) => p[year]);
    return {
      year,
      canopyRadius: +yearData.reduce((s, d) => s + d.canopyRadius, 0).toFixed(1),
      height: +Math.max(...yearData.map((d) => d.height)).toFixed(1),
      coolingImpact: +Math.min(yearData.reduce((s, d) => s + d.coolingImpact, 0), 8).toFixed(2),
      aqiReduction: +Math.min(yearData.reduce((s, d) => s + d.aqiReduction, 0), 200).toFixed(1),
      co2Absorbed: yearData.reduce((s, d) => s + d.co2Absorbed, 0),
      survivalProbability: +(yearData.reduce((s, d) => s + d.survivalProbability, 0) / yearData.length).toFixed(2),
    };
  });
}
