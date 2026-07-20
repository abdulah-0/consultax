import { RENTAL_INDIVIDUAL_SLABS, calculateTaxFromSlabs } from './rates';

export interface RentalIndividualResult {
  rentalIncomeAnnual: number;
  taxAnnual: number;
  taxMonthly: number;
}

/**
 * Calculates Rental Tax for Individuals according to PRD section 5.3 FBR slab rules
 */
export function calculateRentalIndividualTax(monthlyRentalIncome: number): RentalIndividualResult {
  const rentalIncomeAnnual = Math.max(0, monthlyRentalIncome) * 12;
  const taxAnnual = calculateTaxFromSlabs(rentalIncomeAnnual, RENTAL_INDIVIDUAL_SLABS);
  const taxMonthly = taxAnnual / 12;

  return {
    rentalIncomeAnnual,
    taxAnnual,
    taxMonthly,
  };
}
