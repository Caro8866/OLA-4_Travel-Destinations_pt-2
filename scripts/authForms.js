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

        const email = form.querySelector("#signup-email").value;
        const username = form.querySelector("#signup-username").value;
        const password = form.querySelector("#signup-passsword").value;
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
          }).then((res) => {
            console.log(res);
          });
        } else {
          console.log("FILL OUT THE FORM");
        }

        form.reset();
      });

    formContainer.appendChild(signupFormClone);
    signupButton.classList.add("active");
    loginButton.classList.remove("active");
  });

  loadLoginForm();
});
