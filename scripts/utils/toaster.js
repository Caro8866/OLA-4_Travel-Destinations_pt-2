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
