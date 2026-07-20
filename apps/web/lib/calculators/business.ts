import { BUSINESS_SLABS, calculateTaxFromSlabs } from './rates';

export interface BusinessResult {
  incomeAnnual: number;
  taxAnnual: number;
  taxMonthly: number;
}

/**
 * Calculates Business/Non-Salary Tax according to PRD section 5.2 FBR slab rules
 */
export function calculateBusinessTax(monthlyIncome: number): BusinessResult {
  const incomeAnnual = Math.max(0, monthlyIncome) * 12;
  const taxAnnual = calculateTaxFromSlabs(incomeAnnual, BUSINESS_SLABS);
  const taxMonthly = taxAnnual / 12;

  return {
    incomeAnnual,
    taxAnnual,
    taxMonthly,
  };
}
