import { validateNonEmpty, validateURL, validateDates, validateImage, validateCountry } from "./utils/validate_helpers.js";
import { imageToBase64 } from "./utils/image_converter.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".add-destination-form");
  const errorMessage = document.querySelector(".error-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";

    const country = document.querySelector("#country").value;
    const title = document.querySelector("#title").value;
    const link = document.querySelector("#link").value;
    const arrivalDate = document.querySelector("#arrival-date").value;
    const departureDate = document.querySelector("#departure-date").value;
    const description = document.querySelector("#description").value;
    const image = document.querySelector("#image").files[0];

    if (!validateNonEmpty(country)) {
      errorMessage.textContent = "Country is required.";
      return;
    }

    const isValidCountry = await validateCountry(country);
    if (!isValidCountry) {
      errorMessage.textContent = "Country is not valid or recognized.";
      return;
    }

    if (!validateNonEmpty(title)) {
      errorMessage.textContent = "Title is required.";
      return;
    }

    if (!validateURL(link)) {
      errorMessage.textContent = "Link is not a valid URL.";
      return;
    }

    if (!validateDates(arrivalDate, departureDate)) {
      errorMessage.textContent = "Departure date should be after or the same as the arrival date.";
      return;
    }

    if (!validateImage(image)) {
      errorMessage.textContent = "Image format should be .jpg, .jpeg or .png";
      return;
    }

    function base64ToImage(base64) {
      const image = new Image();
      image.src = base64;
      return image;
    }

    let base64 = null; // Define it outside the conditional check

    if (image) {
      try {
        base64 = await imageToBase64(image);
        const convertedImage = base64ToImage(base64);
        console.log(convertedImage);
      } catch (error) {
        console.error("Error converting image to Base64:", error);
        return; // If there's an error converting, you might want to stop the whole function
      }
    }

    const processedInput = {
      country: country.trim(),
      title: title.trim(),
      link: link.trim(),
      arrivalDate: arrivalDate,
      departureDate: departureDate,
      description: description.trim(),
      image: base64,
    };

    console.log(processedInput);
    // Reset form after submission
    form.reset();
  });
});
