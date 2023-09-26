import { validateNonEmpty, validateURL, validateDates, validateImage, validateCountry } from "./utils/validate_helpers.js";
import { imageToBase64, compressImage } from "./utils/image_helpers.js";
import countries from "../utils/countries.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".add-destination-form");
  const countrySelect = document.querySelector("#country");

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  let isCountryValid, isNameValid, isLinkValid, isDateValid, isImageValid;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const country = document.querySelector("#country").value;
    const name = document.querySelector("#title").value;
    const link = document.querySelector("#link").value;
    const dateStart = document.querySelector("#arrival-date").value;
    const dateEnd = document.querySelector("#departure-date").value;
    const description = document.querySelector("#description").value;
    const image = document.querySelector("#image").files[0];

    const isValidCountry = validateCountry(country, countries);
    if (!validateNonEmpty(country)) {
      isCountryValid = false;
      showToaster("negative", "Country is required.");
      return;
    } else if (!isValidCountry) {
      isCountryValid = false;
      showToaster("negative", "Country is not valid or recognized.");
      return;
    } else {
      isCountryValid = true;
    }

    if (!validateNonEmpty(name)) {
      isNameValid = false;
      showToaster("negative", "Title is required.");
      return;
    } else {
      isNameValid = true;
    }

    if (link.length && !validateURL(link)) {
      isLinkValid = false;
      showToaster("negative", "Link is not a valid URL.");
      return;
    } else {
      isLinkValid = true;
    }

    if (dateStart && dateEnd && !validateDates(dateStart, dateEnd)) {
      isDateValid = false;
      showToaster("negative", "Departure date should be after or the same as the arrival date.");
      return;
    } else {
      isDateValid = true;
    }

    if (image && !validateImage(image)) {
      showToaster("negative", "Image format should be .jpg, .jpeg or .png");
      return;
    }

    function base64ToImage(base64) {
      const image = new Image();
      image.src = base64;
      return image;
    }

    let base64;

    if (image) {
      try {
        console.log(image.size, "before compression");
        // image compression
        const compressedImage = await compressImage(image);
        console.log(compressedImage.size, "after compression");
        // Convert compressed image to base64
        base64 = await imageToBase64(compressedImage);
        console.log(base64, "after compression");

        isImageValid = true;
      } catch (error) {
        console.error("Error converting image to Base64:", error);
        isImageValid = false;
        return;
      }
    } else {
      base64 = "";
      isImageValid = true;
    }

    let processedInput = {
      country: country.trim(),
      name: name.trim(),
      link: link.trim(),
      dateStart: dateStart,
      dateEnd: dateEnd,
      description: description.trim(),
      image: base64,
    };

    if (isCountryValid && isNameValid && isDateValid && isLinkValid && isImageValid) {
      fetch("http://localhost:3000/destinations", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(processedInput),
      })
        .then((res) => res.json())
        .then((resJSON) => {
          form.reset();
          console.log(resJSON.insertedID);
          showToaster("positive", `Entry created successfully`);
        })
        .catch((err) => {
          console.log(err);
          showToaster("negative", "Something went wrong, try again.");
        });
    }
  });
});

function showToaster(type, message) {
  const parent = document.querySelector(".toaster-wrapper");
  const template = document.querySelector(`#toaster-${type}`);
  const clone = document.importNode(template.content, true);
  clone.querySelector("p").textContent = `${message}`;
  parent.appendChild(clone);
  setTimeout(() => {
    parent.querySelector("p:last-of-type").classList.add("show-toast");
  }, 10);
  setTimeout(() => {
    parent.querySelector("p:last-of-type").classList.remove("show-toast");
  }, 4000);
  setTimeout(() => {
    parent.querySelector("p:last-of-type").remove();
  }, 4800);
}
