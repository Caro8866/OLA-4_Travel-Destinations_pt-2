const form = document.querySelector("form");
const storedData = localStorage.getItem("formDataArray");
let formDataArray = [];

if (storedData) {
	formDataArray = JSON.parse(storedData);

	// Display or use the formDataArray as needed
	console.log("Form Data Array:", formDataArray);
} else {
	console.log("No form data found in local storage.");
}

function sendForm(event) {
	event.preventDefault();

	// Perform any validation or data processing here
	// For example, you can send data to a server using AJAX

	// Get the form data
	const formData = new FormData(event.target);

	// Convert the form data to an object
	const formObject = {};
	formData.forEach((value, key) => {
		formObject[key] = value;
	});

	formDataArray.push(formObject);

	// Store the form data in local storage
	localStorage.setItem("formDataArray", JSON.stringify(formDataArray));

	window.location.href = "destinations_page.html";
	form.reset();
}
