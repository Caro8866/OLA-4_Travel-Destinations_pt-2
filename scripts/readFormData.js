// Function to retrieve and display data from local storage
function readFormData() {
  const storedData = localStorage.getItem("formDataArray");
  if (storedData) {
    formDataArray = JSON.parse(storedData);

    formDataArray.forEach((travelDestination) => {
      displayData(travelDestination);
    });

    // Display or use the formDataArray as needed
    console.log("Form Data Array:", formDataArray);
  } else {
    console.log("No form data found in local storage.");
  }
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

function displayData(travelDestination) {
  const template = document.getElementById("destination_card_template");
  const clone = document.importNode(template.content, true);
  const list = document.querySelector(".destinations_list");

  const cardCountry = clone.querySelector(".card_country");
  const card_arrival_date = clone.querySelector(".card_arrival_date");
  const card_departure_date = clone.querySelector(".card_departure_date");
  const cardLink = clone.querySelector(".card_link");
  const cardTitle = clone.querySelector(".card_title");
  const cardDescription = clone.querySelector(".card_description");

  cardCountry.textContent = travelDestination.country;
  card_arrival_date.textContent = formatDate(travelDestination["arrival-date"]);
  card_departure_date.textContent = formatDate(
    travelDestination["departure-date"]
  );
  cardTitle.textContent = travelDestination.title;
  cardDescription.textContent = travelDestination.description;
  cardLink.href = travelDestination.link;

  list.appendChild(clone);
}

// Use window.onload to ensure the code runs when the page is fully loaded
window.addEventListener("load", readFormData);
