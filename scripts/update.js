import {
  validateNonEmpty,
  validateURL,
  validateDates,
  validateCountry,
} from "./utils/validate_helpers.js";
import { imageToBase64, compressImage } from "./utils/image_helpers.js";
import countries from "../utils/countries.js";
import { showToaster } from "./utils/toaster.js";
import { deleteModal } from "./utils/delete_modal.js";
import { checkLoginStatus } from "./utils/check_login_status.js";

function fetchAndPopulate(id) {
  fetch(`http://localhost:3000/destinations/${id}`, {credentials: "include"})
    .then((response) => response.json())
    .then((data) => {
      populateForm(data);
    })
    .catch((error) => console.error("Error:", error));
}


document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = await checkLoginStatus();
  !isLoggedIn && window.location.replace("/");

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

  fetchAndPopulate(id);
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
      showToaster(
        "negative",
        "Departure date should be after or the same as the arrival date."
      );
      return;
    } else {
      isDateValid = true;
    }
    
    let base64;

    if (image && image !== document.querySelector("#current-image")) {
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
      // base64 = document.querySelector("#current-image").src;
      base64 = document.querySelector("#current-image");
      isImageValid = true;
    }

    const updatedData = {
      country: country.trim(),
      name: name.trim(),
      link: link.trim(),
      dateStart: dateStart,
      dateEnd: dateEnd,
      description: description.trim(),
      image: base64,
    };
    console.log(updatedData);

    if (
      isCountryValid &&
      isNameValid &&
      isDateValid &&
      isLinkValid &&
      isImageValid
    ) {
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
  document.querySelector("#arrival-date").value = destination.dateStart ? new Date(
    destination.dateStart
  )
    .toISOString()
    .split("T")[0] : "";
  document.querySelector("#departure-date").value = destination.dateEnd ? new Date(
    destination.dateEnd
  )
    .toISOString()
    .split("T")[0] : "";

  document.querySelector("#description").value = destination.description;
  document.querySelector("#current-image").src = destination.image ? destination.image : "placeholder.jpg";

  document
    .querySelector(".form_header span")
    .addEventListener("click", () =>
      deleteModal(destination._id, destination.name, "destination")
    );
}

function updateDestination(id, updatedData) {
  fetch(`http://localhost:3000/destinations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
    credentials: "include",
  })
    .then((response) => response.json())
    .then((resJSON) => {
      showToaster("positive", `Entry updated successfully`);
      fetchAndPopulate(id);
    })
    .catch((error) => {
      console.error("Error:", error);
      showToaster("negative", "Something went wrong, try again.");
    });
}
