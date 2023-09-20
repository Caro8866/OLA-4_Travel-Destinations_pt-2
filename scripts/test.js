// add.js

import { validateNonEmpty, validateURL, validateDates, validateImage } from "./validate_helper.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".add-destination-form");
  const errorMessage = document.querySelector(".error-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorMessage.textContent = "";

    const country = form["country"].value;
    const title = form["title"].value;
    const link = form["link"].value;
    const arrival = form["arrival-date"].value;
    const departure = form["departure-date"].value;
    const image = form["image"].files[0];

    if (!validateDates(arrival, departure)) {
      errorMessage.textContent = "Departure date should be after or the same as the arrival date.";
      return;
    }

    if (!validateImage(image)) {
      errorMessage.textContent = "Image format should be .jpg, .jpeg or .png";
      return;
    }

    // If all validations passed, you can proceed to process the data for database posting.
    // e.g., send it via AJAX, fetch API, etc.
  });
});
