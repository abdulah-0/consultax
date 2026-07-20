export interface RentalCompanyResult {
  rentalIncomeAnnual: number;
  taxAnnual: number;
  taxMonthly: number;
}

/**
 * Calculates Rental Tax for Companies according to PRD section 5.4 FBR flat-rate rule (15%)
 */
export function calculateRentalCompanyTax(monthlyRentalIncome: number): RentalCompanyResult {
  const rentalIncomeAnnual = Math.max(0, monthlyRentalIncome) * 12;
  const taxAnnual = rentalIncomeAnnual * 0.15;
  const taxMonthly = taxAnnual / 12;

  return {
    rentalIncomeAnnual,
    taxAnnual,
    taxMonthly,
  };
}
