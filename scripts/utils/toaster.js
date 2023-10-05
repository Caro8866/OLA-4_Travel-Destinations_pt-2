export function showToaster(type, message) {
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

// REQUIRED in HTML
// <section class="toaster-wrapper">

// </section>

// <template id="toaster-positive">
// <p class="toast toast-positive">TOAST MSG</p>
// </template>
// <template id="toaster-negative">
// <p class="toast toast-negative">TOAST MSG</p>
// </template>
