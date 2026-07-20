export interface Slab {
  upTo: number | null; // null for no upper bound (infinity)
  base: number;
  rate: number;
  prevThreshold: number;
}

export const SALARY_SLABS: Slab[] = [
  { upTo: 600000, base: 0, rate: 0.00, prevThreshold: 0 },
  { upTo: 1200000, base: 0, rate: 0.01, prevThreshold: 600000 },
  { upTo: 2200000, base: 6000, rate: 0.11, prevThreshold: 1200000 },
  { upTo: 3200000, base: 116000, rate: 0.20, prevThreshold: 2200000 },
  { upTo: 4100000, base: 316000, rate: 0.25, prevThreshold: 3200000 },
  { upTo: 5600000, base: 541000, rate: 0.29, prevThreshold: 4100000 },
  { upTo: 7000000, base: 976000, rate: 0.32, prevThreshold: 5600000 },
  { upTo: null, base: 1424000, rate: 0.35, prevThreshold: 7000000 },
];

export const BUSINESS_SLABS: Slab[] = [
  { upTo: 600000, base: 0, rate: 0.00, prevThreshold: 0 },
  { upTo: 1200000, base: 0, rate: 0.15, prevThreshold: 600000 },
  { upTo: 1600000, base: 90000, rate: 0.20, prevThreshold: 1200000 },
  { upTo: 3200000, base: 170000, rate: 0.30, prevThreshold: 1600000 },
  { upTo: 5600000, base: 650000, rate: 0.40, prevThreshold: 3200000 },
  { upTo: null, base: 1610000, rate: 0.45, prevThreshold: 5600000 },
];

export const RENTAL_INDIVIDUAL_SLABS: Slab[] = [
  { upTo: 300000, base: 0, rate: 0.00, prevThreshold: 0 },
  { upTo: 600000, base: 0, rate: 0.05, prevThreshold: 300000 },
  { upTo: 2000000, base: 15000, rate: 0.10, prevThreshold: 600000 },
  { upTo: null, base: 155000, rate: 0.25, prevThreshold: 2000000 },
];

/**
 * Calculates annual tax liability based on slab tables.
 * Clamps input and intermediate values to 0.
 */
export function calculateTaxFromSlabs(income: number, slabs: Slab[]): number {
  const taxableIncome = Math.max(0, income);
  if (taxableIncome === 0) return 0;

  for (const slab of slabs) {
    if (slab.upTo === null || taxableIncome <= slab.upTo) {
      const calculated = slab.base + (taxableIncome - slab.prevThreshold) * slab.rate;
      return Math.max(0, calculated);
    }
  }
  return 0;
}
