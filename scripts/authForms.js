document.addEventListener("DOMContentLoaded", function () {
	const loginButton = document.querySelector(".headline:nth-child(1)");
	const signupButton = document.querySelector(".headline:nth-child(2)");

	const formContainer = document.getElementById("form_container");
	const loginFormTemplate = document.getElementById("login_form");
	const signupFormTemplate = document.getElementById("signup_form");

	function loadLoginForm() {
		formContainer.innerHTML = "";
		const loginFormClone = document.importNode(loginFormTemplate.content, true);
		const form = loginFormClone.querySelector("form");

		loginFormClone
			.getElementById("login-btn")
			.addEventListener("click", function (event) {
				event.preventDefault();
				form.reset();
			});

		formContainer.appendChild(loginFormClone);
		loginButton.classList.add("active");
		signupButton.classList.remove("active");
	}

	loginButton.addEventListener("click", loadLoginForm);

	signupButton.addEventListener("click", function () {
		formContainer.innerHTML = "";
		const signupFormClone = document.importNode(
			signupFormTemplate.content,
			true
		);
		const form = signupFormClone.querySelector("form");

		signupFormClone
			.getElementById("signup-btn")
			.addEventListener("click", function (event) {
				event.preventDefault();
				form.reset();
			});

		formContainer.appendChild(signupFormClone);
		signupButton.classList.add("active");
		loginButton.classList.remove("active");
	});

	loadLoginForm();
});
