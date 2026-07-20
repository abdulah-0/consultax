import { calculateSalaryTax } from './salary';
import { calculateBusinessTax } from './business';
import { calculateRentalIndividualTax } from './rentalIndividual';
import { calculateRentalCompanyTax } from './rentalCompany';
import { formatPKR } from './format';

function assertEqual(actual: any, expected: any, message: string) {
  if (actual !== expected) {
    console.error(`FAIL: ${message}. Expected ${expected}, got ${actual}`);
    process.exit(1);
  } else {
    console.log(`PASS: ${message}`);
  }
}

console.log('Running tax calculator unit tests...');

// 1. Salary Tax Regression Test
const salaryRes = calculateSalaryTax({
  monthlyBasicPay: 65000,
  monthlyMedicalAllowance: 6000,
  monthlyGrossPay: 150000,
});
assertEqual(salaryRes.taxableIncomeAnnual, 1728000, 'Salary taxable income calculation');
assertEqual(salaryRes.taxAnnual, 64080, 'Salary annual tax calculation');
assertEqual(salaryRes.taxMonthly, 5340, 'Salary monthly tax calculation');
assertEqual(formatPKR(salaryRes.taxAnnual, false), 'PKR 64,080', 'Salary formatted annual tax');
assertEqual(formatPKR(salaryRes.taxMonthly, true), 'PKR 5,340', 'Salary formatted monthly tax');

// 2. Business Tax Regression Test
const businessRes = calculateBusinessTax(150000);
assertEqual(businessRes.incomeAnnual, 1800000, 'Business annual income calculation');
assertEqual(businessRes.taxAnnual, 230000, 'Business annual tax calculation');
assertEqual(formatPKR(businessRes.taxAnnual, false), 'PKR 230,000', 'Business formatted annual tax');
assertEqual(formatPKR(businessRes.taxMonthly, true), 'PKR 19,166.67', 'Business formatted monthly tax');

// 3. Rental Individual Tax Regression Test
const rentalIndRes = calculateRentalIndividualTax(150000);
assertEqual(rentalIndRes.rentalIncomeAnnual, 1800000, 'Rental individual annual income calculation');
assertEqual(rentalIndRes.taxAnnual, 135000, 'Rental individual annual tax calculation');
assertEqual(rentalIndRes.taxMonthly, 11250, 'Rental individual monthly tax calculation');
assertEqual(formatPKR(rentalIndRes.taxMonthly, true), 'PKR 11,250', 'Rental individual formatted monthly tax');

// 4. Rental Company Tax Regression Test
const rentalCompRes = calculateRentalCompanyTax(150000);
assertEqual(rentalCompRes.rentalIncomeAnnual, 1800000, 'Rental company annual income calculation');
assertEqual(rentalCompRes.taxAnnual, 270000, 'Rental company annual tax calculation');
assertEqual(rentalCompRes.taxMonthly, 22500, 'Rental company monthly tax calculation');
assertEqual(formatPKR(rentalCompRes.taxMonthly, true), 'PKR 22,500', 'Rental company formatted monthly tax');

// 5. Zero & Negative clamp tests
const zeroSalary = calculateSalaryTax({ monthlyBasicPay: -100, monthlyMedicalAllowance: -50, monthlyGrossPay: -500 });
assertEqual(zeroSalary.taxAnnual, 0, 'Negative salary input returns 0 tax');

const zeroBusiness = calculateBusinessTax(-1000);
assertEqual(zeroBusiness.taxAnnual, 0, 'Negative business input returns 0 tax');

console.log('All tests passed successfully!');
