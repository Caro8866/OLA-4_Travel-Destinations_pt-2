import { showToaster } from "./toaster.js";

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
