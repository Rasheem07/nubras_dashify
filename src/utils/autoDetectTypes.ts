import { isValidBoolean, isValidDate, isValidNumber } from "./validatorsForTypes";

// Function to automatically detect and convert types based on the first valid value in each column
export const autoDetectAndConvertTypes = (headers: string[], data: string[][]) => {
  const types = headers.map((_, i) => {
    const firstValidValue = data.find(row => row[i] && row[i].trim() !== '')?.[i];

    if (firstValidValue === undefined) return 'string'; // Default to string if no value is found

    // Check for valid date
    if (isValidDate(firstValidValue)) return 'date';

    // Check for valid number (after date check)
    if (isValidNumber(firstValidValue)) return 'number';

    // Check for valid boolean
    if (isValidBoolean(firstValidValue)) return 'boolean';

    return 'string'; // Default to string if no match
  });

  return types;
};
