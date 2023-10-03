export function deleteModal(id, name) {
  const modalWrapper = document.querySelector(".modal-wrapper");
  const modalWindow = document.querySelector(".modal-window");
  const deleteButton = document.querySelector(".modal-window .btn-primary");
  const cancelButton = document.querySelector(".modal-window .btn-secondary");

  console.log(id);

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
      })
      .catch((error) => {
        console.error("Error:", error);
        showToaster("negative", "Something went wrong, try again.");
      });
  });
}
