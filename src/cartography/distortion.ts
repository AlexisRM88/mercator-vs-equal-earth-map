/**
 * Mathematical distortion formulas and comparative data between Mercator and Equal Earth.
 */

export interface DistortionMetrics {
  latitude: number;
  mercatorInflationFactor: number; // e.g., 4.0 for 4x
  mercatorInflationPercent: number; // e.g., +300%
  equalEarthInflationFactor: number; // strictly 1.0
  equalEarthInflationPercent: number; // strictly 0%
}

/**
 * Calculates the local area inflation factor for the Mercator projection
 * based on latitude (in degrees).
 * Formula: Area scale factor = sec^2(phi) = 1 / cos^2(phi)
 */
export function calculateMercatorDistortion(latDegrees: number): DistortionMetrics {
  // Clamp latitude to [-85, 85] to prevent division by zero at poles
  const clampedLat = Math.max(-85, Math.min(85, latDegrees));
  const rad = (clampedLat * Math.PI) / 180;
  const cosLat = Math.cos(rad);
  const factor = 1 / (cosLat * cosLat);
  const percent = (factor - 1) * 100;

  return {
    latitude: clampedLat,
    mercatorInflationFactor: Number(factor.toFixed(2)),
    mercatorInflationPercent: Math.round(percent),
    equalEarthInflationFactor: 1.0,
    equalEarthInflationPercent: 0,
  };
}

export interface TerritoryComparison {
  id: string;
  nameKey: string;
  actualAreaKm2: number; // in km²
  actualAreaSqMi: number; // in sq miles
  centroidLat: number;
  centroidLon: number;
  highlightCoordinates?: [number, number];
}

export const COMPARISON_TERRITORIES: Record<string, TerritoryComparison> = {
  greenland: {
    id: 'greenland',
    nameKey: 'greenland',
    actualAreaKm2: 2166086,
    actualAreaSqMi: 836330,
    centroidLat: 72.0,
    centroidLon: -40.0,
  },
  africa: {
    id: 'africa',
    nameKey: 'africa',
    actualAreaKm2: 30370000,
    actualAreaSqMi: 11730000,
    centroidLat: 1.0,
    centroidLon: 17.0,
  },
  alaska: {
    id: 'alaska',
    nameKey: 'alaska',
    actualAreaKm2: 1717856,
    actualAreaSqMi: 663268,
    centroidLat: 64.0,
    centroidLon: -152.0,
  },
  brazil: {
    id: 'brazil',
    nameKey: 'brazil',
    actualAreaKm2: 8515767,
    actualAreaSqMi: 3287957,
    centroidLat: -14.0,
    centroidLon: -51.0,
  },
  europe: {
    id: 'europe',
    nameKey: 'europe',
    actualAreaKm2: 10180000,
    actualAreaSqMi: 3930000,
    centroidLat: 54.0,
    centroidLon: 25.0,
  },
  south_america: {
    id: 'south_america',
    nameKey: 'south_america',
    actualAreaKm2: 17840000,
    actualAreaSqMi: 6890000,
    centroidLat: -15.0,
    centroidLon: -60.0,
  },
  antarctica: {
    id: 'antarctica',
    nameKey: 'antarctica',
    actualAreaKm2: 14200000,
    actualAreaSqMi: 5480000,
    centroidLat: -78.0,
    centroidLon: 0.0,
  },
  australia: {
    id: 'australia',
    nameKey: 'australia',
    actualAreaKm2: 7692024,
    actualAreaSqMi: 2969907,
    centroidLat: -25.0,
    centroidLon: 133.0,
  },
  canada: {
    id: 'canada',
    nameKey: 'canada',
    actualAreaKm2: 9984670,
    actualAreaSqMi: 3855100,
    centroidLat: 60.0,
    centroidLon: -96.0,
  },
  india: {
    id: 'india',
    nameKey: 'india',
    actualAreaKm2: 3287263,
    actualAreaSqMi: 1269219,
    centroidLat: 20.0,
    centroidLon: 78.0,
  },
  mexico: {
    id: 'mexico',
    nameKey: 'mexico',
    actualAreaKm2: 1964375,
    actualAreaSqMi: 758449,
    centroidLat: 23.0,
    centroidLon: -102.0,
  },
  russia: {
    id: 'russia',
    nameKey: 'russia',
    actualAreaKm2: 17098242,
    actualAreaSqMi: 6601668,
    centroidLat: 61.0,
    centroidLon: 105.0,
  },
};

export interface ComparativePair {
  id: string;
  titleKey: string;
  territoryA: TerritoryComparison;
  territoryB: TerritoryComparison;
  mercatorVisualPerceptionKey: string;
  trueScientificRatioKey: string;
  ratioMultiplier: number;
}

export const COMPARATIVE_PAIRS: ComparativePair[] = [
  {
    id: 'greenland-africa',
    titleKey: 'pair_greenland_africa_title',
    territoryA: COMPARISON_TERRITORIES.greenland,
    territoryB: COMPARISON_TERRITORIES.africa,
    mercatorVisualPerceptionKey: 'pair_greenland_africa_mercator',
    trueScientificRatioKey: 'pair_greenland_africa_truth',
    ratioMultiplier: 14.02,
  },
  {
    id: 'alaska-brazil',
    titleKey: 'pair_alaska_brazil_title',
    territoryA: COMPARISON_TERRITORIES.alaska,
    territoryB: COMPARISON_TERRITORIES.brazil,
    mercatorVisualPerceptionKey: 'pair_alaska_brazil_mercator',
    trueScientificRatioKey: 'pair_alaska_brazil_truth',
    ratioMultiplier: 4.96,
  },
  {
    id: 'europe-south-america',
    titleKey: 'pair_europe_south_america_title',
    territoryA: COMPARISON_TERRITORIES.europe,
    territoryB: COMPARISON_TERRITORIES.south_america,
    mercatorVisualPerceptionKey: 'pair_europe_south_america_mercator',
    trueScientificRatioKey: 'pair_europe_south_america_truth',
    ratioMultiplier: 1.75,
  },
  {
    id: 'antarctica-reality',
    titleKey: 'pair_antarctica_title',
    territoryA: COMPARISON_TERRITORIES.antarctica,
    territoryB: COMPARISON_TERRITORIES.russia,
    mercatorVisualPerceptionKey: 'pair_antarctica_mercator',
    trueScientificRatioKey: 'pair_antarctica_truth',
    ratioMultiplier: 0.83,
  },
];
