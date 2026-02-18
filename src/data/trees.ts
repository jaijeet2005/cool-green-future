export interface TreeSpecies {
  id: string;
  name: string;
  scientificName: string;
  coolingCapacity: number; // °C reduction per mature tree (radius ~10m)
  pollutionAbsorption: number; // 1-10 scale
  apiScore: number; // Anticipated Performance Index 1-100
  waterRequirement: "low" | "medium" | "high";
  growthRate: "slow" | "medium" | "fast";
  maxHeight: number; // meters
  canopySpread: number; // meters diameter
  nativeRegions: string[]; // climate zones
  co2Absorption: number; // kg/year
  description: string;
}

export const treeSpecies: TreeSpecies[] = [
  {
    id: "neem",
    name: "Neem",
    scientificName: "Azadirachta indica",
    coolingCapacity: 1.8,
    pollutionAbsorption: 8,
    apiScore: 82,
    waterRequirement: "low",
    growthRate: "fast",
    maxHeight: 20,
    canopySpread: 12,
    nativeRegions: ["tropical", "semi-arid", "arid", "subtropical"],
    co2Absorption: 48,
    description: "Hardy, drought-resistant tree excellent for urban environments. Strong pollution tolerance.",
  },
  {
    id: "peepal",
    name: "Peepal",
    scientificName: "Ficus religiosa",
    coolingCapacity: 2.2,
    pollutionAbsorption: 9,
    apiScore: 91,
    waterRequirement: "medium",
    growthRate: "fast",
    maxHeight: 30,
    canopySpread: 18,
    nativeRegions: ["tropical", "subtropical", "semi-arid"],
    co2Absorption: 60,
    description: "One of the best oxygen producers. Releases oxygen 24/7 due to CAM photosynthesis at night.",
  },
  {
    id: "banyan",
    name: "Banyan",
    scientificName: "Ficus benghalensis",
    coolingCapacity: 2.5,
    pollutionAbsorption: 8,
    apiScore: 87,
    waterRequirement: "medium",
    growthRate: "medium",
    maxHeight: 25,
    canopySpread: 25,
    nativeRegions: ["tropical", "subtropical"],
    co2Absorption: 55,
    description: "Massive canopy spread providing exceptional shade. India's national tree.",
  },
  {
    id: "ashoka",
    name: "Ashoka",
    scientificName: "Saraca asoca",
    coolingCapacity: 1.2,
    pollutionAbsorption: 6,
    apiScore: 68,
    waterRequirement: "medium",
    growthRate: "slow",
    maxHeight: 10,
    canopySpread: 6,
    nativeRegions: ["tropical", "subtropical"],
    co2Absorption: 22,
    description: "Compact columnar shape ideal for road dividers and narrow spaces.",
  },
  {
    id: "gulmohar",
    name: "Gulmohar",
    scientificName: "Delonix regia",
    coolingCapacity: 1.9,
    pollutionAbsorption: 7,
    apiScore: 75,
    waterRequirement: "low",
    growthRate: "fast",
    maxHeight: 15,
    canopySpread: 14,
    nativeRegions: ["tropical", "semi-arid"],
    co2Absorption: 35,
    description: "Wide umbrella-shaped canopy with beautiful red flowers. Excellent shade tree.",
  },
  {
    id: "arjuna",
    name: "Arjuna",
    scientificName: "Terminalia arjuna",
    coolingCapacity: 1.6,
    pollutionAbsorption: 7,
    apiScore: 78,
    waterRequirement: "medium",
    growthRate: "medium",
    maxHeight: 25,
    canopySpread: 12,
    nativeRegions: ["tropical", "subtropical", "semi-arid"],
    co2Absorption: 42,
    description: "Large evergreen tree with medicinal bark. Grows well near water bodies.",
  },
  {
    id: "jamun",
    name: "Jamun",
    scientificName: "Syzygium cumini",
    coolingCapacity: 1.5,
    pollutionAbsorption: 7,
    apiScore: 74,
    waterRequirement: "medium",
    growthRate: "medium",
    maxHeight: 20,
    canopySpread: 10,
    nativeRegions: ["tropical", "subtropical"],
    co2Absorption: 38,
    description: "Dense canopy provides excellent shade. Fruit-bearing tree popular in urban areas.",
  },
  {
    id: "karanj",
    name: "Karanj",
    scientificName: "Millettia pinnata",
    coolingCapacity: 1.4,
    pollutionAbsorption: 8,
    apiScore: 80,
    waterRequirement: "low",
    growthRate: "fast",
    maxHeight: 18,
    canopySpread: 10,
    nativeRegions: ["tropical", "semi-arid", "arid"],
    co2Absorption: 35,
    description: "Highly pollution-tolerant. Used in biodiesel production. Thrives in poor soil.",
  },
  {
    id: "mahua",
    name: "Mahua",
    scientificName: "Madhuca longifolia",
    coolingCapacity: 1.7,
    pollutionAbsorption: 6,
    apiScore: 72,
    waterRequirement: "low",
    growthRate: "slow",
    maxHeight: 20,
    canopySpread: 14,
    nativeRegions: ["tropical", "semi-arid", "arid"],
    co2Absorption: 40,
    description: "Drought-resistant with dense canopy. Important for tribal communities.",
  },
  {
    id: "kadamba",
    name: "Kadamba",
    scientificName: "Neolamarckia cadamba",
    coolingCapacity: 1.3,
    pollutionAbsorption: 5,
    apiScore: 65,
    waterRequirement: "high",
    growthRate: "fast",
    maxHeight: 25,
    canopySpread: 12,
    nativeRegions: ["tropical", "subtropical"],
    co2Absorption: 45,
    description: "One of the fastest-growing Indian trees. Fragrant flowers attract pollinators.",
  },
  {
    id: "kachnar",
    name: "Kachnar",
    scientificName: "Bauhinia variegata",
    coolingCapacity: 1.1,
    pollutionAbsorption: 6,
    apiScore: 70,
    waterRequirement: "low",
    growthRate: "medium",
    maxHeight: 12,
    canopySpread: 8,
    nativeRegions: ["tropical", "subtropical", "semi-arid", "temperate"],
    co2Absorption: 25,
    description: "Ornamental tree with orchid-like flowers. Tolerates varied climatic conditions.",
  },
  {
    id: "palash",
    name: "Palash",
    scientificName: "Butea monosperma",
    coolingCapacity: 1.0,
    pollutionAbsorption: 5,
    apiScore: 62,
    waterRequirement: "low",
    growthRate: "slow",
    maxHeight: 15,
    canopySpread: 10,
    nativeRegions: ["tropical", "semi-arid", "arid"],
    co2Absorption: 28,
    description: "Flame of the forest. Extremely drought-resistant. Fixes nitrogen in soil.",
  },
  {
    id: "amla",
    name: "Amla",
    scientificName: "Phyllanthus emblica",
    coolingCapacity: 1.0,
    pollutionAbsorption: 5,
    apiScore: 64,
    waterRequirement: "low",
    growthRate: "medium",
    maxHeight: 12,
    canopySpread: 8,
    nativeRegions: ["tropical", "subtropical", "semi-arid", "arid"],
    co2Absorption: 22,
    description: "Medicinal fruit tree. Hardy and adaptable across diverse Indian climates.",
  },
  {
    id: "teak",
    name: "Teak",
    scientificName: "Tectona grandis",
    coolingCapacity: 1.4,
    pollutionAbsorption: 6,
    apiScore: 69,
    waterRequirement: "medium",
    growthRate: "medium",
    maxHeight: 30,
    canopySpread: 12,
    nativeRegions: ["tropical", "subtropical"],
    co2Absorption: 38,
    description: "Valuable timber tree with large leaves providing good shade cover.",
  },
  {
    id: "sheesham",
    name: "Sheesham",
    scientificName: "Dalbergia sissoo",
    coolingCapacity: 1.6,
    pollutionAbsorption: 7,
    apiScore: 76,
    waterRequirement: "medium",
    growthRate: "fast",
    maxHeight: 25,
    canopySpread: 12,
    nativeRegions: ["subtropical", "semi-arid", "temperate"],
    co2Absorption: 42,
    description: "Fast-growing nitrogen-fixing tree. Excellent for northern Indian cities.",
  },
  {
    id: "khejri",
    name: "Khejri",
    scientificName: "Prosopis cineraria",
    coolingCapacity: 0.8,
    pollutionAbsorption: 5,
    apiScore: 71,
    waterRequirement: "low",
    growthRate: "slow",
    maxHeight: 12,
    canopySpread: 8,
    nativeRegions: ["arid", "semi-arid"],
    co2Absorption: 18,
    description: "State tree of Rajasthan. Survives extreme drought. Improves desert soil.",
  },
];

export function getTreesForClimate(climate: string): TreeSpecies[] {
  return treeSpecies.filter((t) => t.nativeRegions.includes(climate));
}

export function calculatePlantationImpact(trees: { species: TreeSpecies; count: number }[]) {
  let totalTempReduction = 0;
  let totalAQIReduction = 0;
  let totalAPIScore = 0;
  let totalCO2 = 0;
  let totalTrees = 0;

  trees.forEach(({ species, count }) => {
    totalTrees += count;
    totalTempReduction += species.coolingCapacity * count * 0.05; // diminishing returns
    totalAQIReduction += species.pollutionAbsorption * count * 1.2;
    totalAPIScore += species.apiScore * count;
    totalCO2 += species.co2Absorption * count;
  });

  return {
    tempReduction: Math.min(totalTempReduction, 8), // cap at 8°C
    aqiReduction: Math.min(totalAQIReduction, 200), // cap at 200 points
    avgAPIScore: totalTrees > 0 ? Math.round(totalAPIScore / totalTrees) : 0,
    totalCO2Absorption: totalCO2,
    totalTrees,
  };
}
