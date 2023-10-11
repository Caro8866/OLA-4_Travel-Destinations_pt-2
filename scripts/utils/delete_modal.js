import { showToaster } from "./toaster.js";
import { formatDate } from "./format_date.js";

export function deleteModal(id, name, location) {
  const modalWrapper = document.querySelector(".modal-wrapper");
  const modalWindow = document.querySelector(".modal-window");
  const deleteButton = document.querySelector(".modal-window .btn-primary");
  const cancelButton = document.querySelector(".modal-window .btn-secondary");

  modalWrapper.classList.remove("hidden");
  cancelButton.addEventListener("click", () => {
    modalWrapper.classList.add("hidden");
  });

  modalWindow.querySelector("a").textContent = name;
  modalWindow.querySelector("a").href = `/update.html?id=${id}`;
  deleteButton.addEventListener("click", () => {
    fetch(`http://localhost:3000/destinations/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((resJSON) => {
        showToaster("positive", `Entry deleted successfully`);
        modalWrapper.classList.add("hidden");
        if (location === "destinations") {
          document.querySelector(".destinations_list").innerHTML = "";
          fetch("http://localhost:3000/destinations", {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((resJSON) => {
              if (resJSON.length) {
                resJSON.forEach((el) => displayData(el));
              } else {
                const list = document.querySelector(".destinations_list");
                const addDestinationsMessage = document.createElement("p");
                addDestinationsMessage.textContent =
                  "You have no destinations in you travel journal.";
                addDestinationsMessage.classList.add("no_destinations");
                list.appendChild(addDestinationsMessage);
              }
            });
        } else if (location === "destination") {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showToaster("negative", "Something went wrong, try again.");
      });
  });
}

function displayData(destination) {
  const template = document.querySelector("#destination_card_template");
  const clone = document.importNode(template.content, true);
  const list = document.querySelector(".destinations_list");

  const cardCountry = clone.querySelector(".card_country");
  const card_arrival_date = clone.querySelector(".card_arrival_date");
  const card_departure_date = clone.querySelector(".card_departure_date");
  const cardLink = clone.querySelector(".card_link");
  const cardTitle = clone.querySelector(".card_title");
  const cardDescription = clone.querySelector(".card_description");
  const cardImage = clone.querySelector(".card_image");
  const cardDate = clone.querySelector(".card_date");
  const editIcon = clone.querySelector(".edit_destination");
  const deleteIcon = clone.querySelector(".delete_destination");

  cardCountry.textContent = destination.country;
  cardTitle.textContent = destination.name;

  if (!destination["dateStart"] && !destination["dateEnd"]) {
    cardDate.textContent = "No travel dates were provided";
  } else if (destination["dateStart"] && destination["dateEnd"]) {
    cardDate.textContent = `${formatDate(
      destination["dateStart"]
    )} - ${formatDate(destination["dateEnd"])}`;
  } else {
    destination["dateStart"]
      ? (card_arrival_date.textContent = formatDate(destination["dateStart"]))
      : card_arrival_date.remove();

    destination["dateEnd"]
      ? (card_departure_date.textContent = formatDate(destination["dateEnd"]))
      : card_departure_date.remove();
  }

  destination.description
    ? (cardDescription.textContent = destination.description)
    : cardDescription.remove();

  destination.link ? (cardLink.href = destination.link) : cardLink.remove();

  destination.image && (cardImage.src = destination.image);

  editIcon.href = `/update.html?id=${destination._id}`;
  deleteIcon.addEventListener("click", () => {
    deleteModal(destination._id, destination.name, "destinations");
  });

  list.appendChild(clone);
}
