import { validateNonEmpty, validateURL, validateDates, validateImage, validateCountry } from "./utils/validate_helpers.js";
import { imageToBase64, compressImage } from "./utils/image_helpers.js";
import countries from "../utils/countries.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".update-destination-form");
  const countrySelect = document.querySelector("#country");

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  fetch(`http://localhost:3000/destinations/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      populateForm(data);
    })
    .catch((error) => console.error("Error:", error));

  let isCountryValid, isNameValid, isLinkValid, isDateValid, isImageValid;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const country = document.querySelector("#country").value;
    const name = document.querySelector("#title").value;
    const link = document.querySelector("#link").value;
    const dateStart = document.querySelector("#arrival-date").value;
    const dateEnd = document.querySelector("#departure-date").value;
    const description = document.querySelector("#description").value;
    const image = document.querySelector("#image").value;

    const updatedData = {
      country,
      name,
      link,
      dateStart,
      dateEnd,
      description,
      image,
    };

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
        const compressedImage = await compressImage(image);
        base64 = await imageToBase64(compressedImage);
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
      updateDestination(id, updatedData);
    }
  });
});

function populateForm(destination) {
  const countrySelect = document.querySelector("#country");
  for (const option of countrySelect.options) {
    if (option.value === destination.country) {
      option.selected = true;
      break;
    }
  }
  document.querySelector("#title").value = destination.name;
  document.querySelector("#link").value = destination.link;
  document.querySelector("#arrival-date").value = new Date(destination.dateStart).toISOString().split("T")[0];
  document.querySelector("#departure-date").value = new Date(destination.dateEnd).toISOString().split("T")[0];

  document.querySelector("#description").value = destination.description;
  document.querySelector("#current-image").src = destination.image;
}

function updateDestination(id, updatedData) {
  fetch(`http://localhost:3000/destinations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((resJSON) => {
      console.log(resJSON);
      showToaster("positive", `Entry updated successfully`);
    })
    .catch((error) => {
      console.error("Error:", error);
      showToaster("negative", "Something went wrong, try again.");
    });
}

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
