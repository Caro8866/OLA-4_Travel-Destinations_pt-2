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
  console.log(destination);
  const template = document.getElementById("destination_card_template");
  const clone = document.importNode(template.content, true);
  const list = document.querySelector(".destinations_list");

  const cardCountry = clone.querySelector(".card_country");
  const card_arrival_date = clone.querySelector(".card_arrival_date");
  const card_departure_date = clone.querySelector(".card_departure_date");
  const cardLink = clone.querySelector(".card_link");
  const cardTitle = clone.querySelector(".card_title");
  const cardDescription = clone.querySelector(".card_description");

  cardCountry.textContent = destination.country;
  card_arrival_date.textContent = formatDate(destination["dateStart"]);
  card_departure_date.textContent = formatDate(destination["dateEnd"]);
  cardTitle.textContent = destination.name;
  cardDescription.textContent = destination.description;
  cardLink.href = destination.link;

  list.appendChild(clone);
}

// Use window.onload to ensure the code runs when the page is fully loaded
