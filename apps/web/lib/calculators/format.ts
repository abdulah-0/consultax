/**
 * Formats a numeric value into a PKR currency string with thousands separators.
 * - No decimal places for annual figures.
 * - 2 decimal places only where the monthly division produces a fraction (e.g. 19,166.67).
 */
export function formatPKR(amount: number, isMonthly: boolean = false): string {
  // Clamp negative numbers to 0
  const value = Math.max(0, amount);
  
  // Check if value has a fractional part (only check for monthly figures)
  const hasFraction = isMonthly && value % 1 !== 0;

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  });

  return 'PKR ' + formatter.format(value);
}
