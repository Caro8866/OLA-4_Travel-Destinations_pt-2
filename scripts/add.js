import { validateNonEmpty, validateURL, validateDates, validateImage, validateCountry } from "./utils/validate_helpers.js";
import { imageToBase64 } from "./utils/image_converter.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".add-destination-form");
  const errorMessage = document.querySelector(".error-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";

    const country = document.querySelector("#country").value;
    const name = document.querySelector("#title").value;
    const link = document.querySelector("#link").value;
    const dateStart = document.querySelector("#arrival-date").value;
    const dateEnd = document.querySelector("#departure-date").value;
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

    if (!validateNonEmpty(name)) {
      errorMessage.textContent = "Title is required.";
      return;
    }

    if (!validateURL(link)) {
      errorMessage.textContent = "Link is not a valid URL.";
      return;
    }

    if (!validateDates(dateStart, dateEnd)) {
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

    let base64 = null;

    if (image) {
      try {
        base64 = await imageToBase64(image);
        const convertedImage = base64ToImage(base64);
        console.log(convertedImage);
      } catch (error) {
        console.error("Error converting image to Base64:", error);
        return;
      }
    }

    const processedInput = {
      country: country.trim(),
      name: name.trim(),
      link: link.trim(),
      dateStart: dateStart,
      dateEnd: dateEnd,
      description: description.trim(),
      image: base64,
    };

    console.log(processedInput);
    form.reset();
  });
});
