import { showToaster } from "./utils/toaster.js";

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

        const loginCred = form.querySelector("#login-email").value;
        const password = form.querySelector("#login-password").value;

        let processedInput;
        if (loginCred.length && password.length) {
          processedInput = {
            cred: loginCred,
            password: password,
          };
        } else {
          processedInput = null;
        }

        if (processedInput) {
          fetch("http://localhost:3000/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(processedInput),
            credentials: "include",
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.success === false) {
                showToaster("negative", "Incorrect credentials");
              } else {
                showToaster("positive", "Logged in!");
                console.log(res.token);
                form.reset();
                window.location.replace("/");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          showToaster("negative", "Fill out the login credentials");
        }
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

        const email = form.querySelector("#signup-email").value;
        const username = form.querySelector("#signup-username").value;
        const password = form.querySelector("#signup-password").value;
        let processedInput;

        if (username.length && email.length && password.length) {
          processedInput = {
            username: username,
            password: password,
            email: email,
          };
        } else {
          processedInput = null;
        }

        if (processedInput) {
          fetch("http://localhost:3000/auth/signup", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(processedInput),
            credentials: "include",
          })
            .then((res) => res.json())
            .then((resJSON) => {
              if (resJSON.success === false) {
                showToaster("negative", "Credentials already in use");
              } else {
                showToaster("positive", "Account created!");
                form.reset();
              }
            });
        } else {
          console.log("FILL OUT THE FORM");
          showToaster("negative", "Fill out the form fields");
        }
      });

    formContainer.appendChild(signupFormClone);
    signupButton.classList.add("active");
    loginButton.classList.remove("active");
  });

  loadLoginForm();
});
