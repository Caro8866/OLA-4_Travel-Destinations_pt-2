// Function to retrieve and display data from local storage
window.addEventListener("load", fetchData);

function fetchData() {
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
}

function formatDate(inputDate) {
  const date = new Date(inputDate);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);
  const formattedDate = `${parts[2].value} ${parts[0].value}, ${parts[4].value}`;
  return formattedDate;
}

function displayData(destination) {
  const template = document.getElementById("destination_card_template");
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

  list.appendChild(clone);
}
