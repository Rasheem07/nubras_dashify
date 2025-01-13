export const convertValueBasedOnType = (value: string, type: string) => {

  if (type === "number") {
    const cleanedValue = value.replace(/[^0-9.-]+/g, ""); // Clean non-numeric characters
    return cleanedValue === "" || isNaN(Number(cleanedValue)) ? null : Number(cleanedValue); // Convert to number or null
  } else if (type === "boolean") {
    return ["true", "yes"].includes(value.toLowerCase()) ? true : value.toLowerCase() === "false" || value.toLowerCase() === "no" ? false : null;
  } else if (type === "date") {
    // Handle "DD/MM/YYYY" format
    if (!value || value.trim() === "") return null; // Return null for empty strings

    const dateParts = value.split("/");
    if (dateParts.length === 3) {
      const [day, month, year] = dateParts.map(Number);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const parsedDate = new Date(year, month - 1, day); // JS Date months are 0-indexed
        return isNaN(parsedDate.getTime()) ? null : parsedDate; // Validate the date
      }
    }

    // Fallback to default Date parsing
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return value === "" ? null : value; // Default to null for empty strings, otherwise return string
};
