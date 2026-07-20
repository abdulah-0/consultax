import { SALARY_SLABS, calculateTaxFromSlabs } from './rates';

export interface SalaryInput {
  monthlyBasicPay: number;
  monthlyMedicalAllowance: number;
  monthlyGrossPay: number;
}

export interface CalculationResult {
  taxableIncomeAnnual: number;
  taxAnnual: number;
  taxMonthly: number;
}

/**
 * Calculates Salary Tax according to PRD section 5.1 FBR slab rules
 */
export function calculateSalaryTax(input: SalaryInput): CalculationResult {
  const { monthlyBasicPay, monthlyMedicalAllowance, monthlyGrossPay } = input;

  const annualBasicPay = Math.max(0, monthlyBasicPay) * 12;
  const annualMedicalAllowance = Math.max(0, monthlyMedicalAllowance) * 12;
  const annualGrossPay = Math.max(0, monthlyGrossPay) * 12;

  // Exemption: Medical allowance up to 10% of basic pay is exempt
  const tenPctOfBasic = annualBasicPay * 0.10;
  const exemptMedicalAllowance = Math.min(tenPctOfBasic, annualMedicalAllowance);

  // Taxable income is Gross Pay minus exempt Medical Allowance
  const taxableIncomeAnnual = Math.max(0, annualGrossPay - exemptMedicalAllowance);
  const taxAnnual = calculateTaxFromSlabs(taxableIncomeAnnual, SALARY_SLABS);
  const taxMonthly = taxAnnual / 12;

  return {
    taxableIncomeAnnual,
    taxAnnual,
    taxMonthly,
  };
}
