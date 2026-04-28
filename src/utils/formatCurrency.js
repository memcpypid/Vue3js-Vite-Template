/**
 * Format a number as IDR currency (e.g., 10000 -> 10.000)
 * @param {number|string} value
 * @returns {string}
 */
export const formatIDR = (value) => {
  if (value === null || value === undefined || value === "") return "";

  // Convert to number if it's a string
  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) return "";

  return new Intl.NumberFormat("id-ID").format(numberValue);
};

/**
 * Parse a formatted currency string back to a number
 * @param {string} value
 * @returns {number}
 */
export const parseCurrency = (value) => {
  if (!value) return 0;

  // Remove everything except numbers (handles dots as thousand separators)
  const cleanValue = value.toString().replace(/[^\d]/g, "");

  return cleanValue ? parseInt(cleanValue, 10) : 0;
};
