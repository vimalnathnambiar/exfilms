/**
 * Round the number of decimal places of a precision value.
 * @param {number} value Precision value
 * @param {number} precision Number of decimal places to round to
 * @returns {number} Value rounded to precision
 */
export function roundValue(value, precision) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}
