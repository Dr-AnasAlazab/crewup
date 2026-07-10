/** @format */

// Turns "433333" into "$433,333"
export const formatCurrency = (value: string | number) => {
  if (value === undefined || value === null || value === "") return "";

  // Strip everything except numbers
  const numberString = value.toString().replace(/\D/g, "");
  if (!numberString) return "";

  // Format with commas and add the dollar sign
  return `$${Intl.NumberFormat("en-US").format(parseInt(numberString, 10))}`;
};

// Turns "$433,333" back into "433333" so you can keep raw values if needed
export const parseCurrencyToNumber = (value: string) => {
  const numberString = value.replace(/\D/g, "");
  return numberString ? parseInt(numberString, 10) : "";
};
