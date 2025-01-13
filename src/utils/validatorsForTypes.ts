/* eslint-disable @typescript-eslint/no-explicit-any */

import { parse, isValid } from 'date-fns';

const isValidDate = (value: string): boolean => {
  // Check for the "Month Year" format (e.g., "January 2024" or "01/2024")
  const monthYearFormat = 'MM/yyyy'; // Or 'MMMM yyyy' for full month name
  
  // Try parsing the value as a "Month Year" format (MM/YYYY or Month YYYY)
  const parsedMonthYear = parse(value, monthYearFormat, new Date());
  if (isValid(parsedMonthYear)) {
    return true;
  }

  // Check for the "DD/MM/YYYY" format
  const dayMonthYearFormat = 'dd/MM/yyyy';
  const parsedDayMonthYear = parse(value, dayMonthYearFormat, new Date());
  if (isValid(parsedDayMonthYear)) {
    return true;
  }

  // If the value is a number (length < 6) like "5" or "12", treat it as a number, not a date
  if (!isNaN(Number(value)) && value.trim().length < 6) {
    return false;  // Treat these as numbers, not dates
  }

  // Fallback to the default date validation if needed
  return !isNaN(Date.parse(value)) && new Date(value).toString() !== 'Invalid Date';
};

// Function to detect if a string is a valid number, allowing for commas and decimals
const isValidNumber = (value: string) => {
  // Remove non-numeric characters (commas, spaces) and check if it's a valid number
  const cleanedValue = value.replace(/[^0-9.-]+/g, "");
  return !isNaN(cleanedValue as any) && cleanedValue !== "";
};

// Function to detect if a string is a boolean
const isValidBoolean = (value: string) => {
  const lowerValue = value.toLowerCase();
  return ["true", "false", "yes", "no"].includes(lowerValue);
};


export {isValidDate, isValidNumber , isValidBoolean}