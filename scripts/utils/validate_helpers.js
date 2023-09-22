// validate_helper.js

// Validates if input is non-empty and contains non-whitespace characters.
export function validateNonEmpty(value) {
  return value && value.trim() !== "";
}

// Validates a URL.
export function validateURL(url) {
  return (
    url.includes("https://www.google.com/maps/") || url.includes("http://www.google.com/maps/") || url.includes("https://google.com/maps/") || url.includes("http://google.com/maps/") || url.includes("http://google.com/maps/search/") || url === ""
  );
}

// Validates the date relationship.
export function validateDates(arrival, departure) {
  if (!arrival || !departure) return true;
  return new Date(arrival) <= new Date(departure);
}

// Validates image extension.
export function validateImage(file) {
  if (!file) return true;
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
  const ext = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
  return allowedExtensions.includes("." + ext);
}

// Validates if the country exists in the given list.
export async function validateCountry(country) {
  try {
    const response = await fetch("../../utils/countries.json");
    const countriesObj = await response.json();
    return countriesObj.countries.includes(country);
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return false;
  }
}
