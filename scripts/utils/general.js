import { checkLoginStatus } from "./check_login_status.js";

async function changeHeader() {
	const isLoggedIn = await checkLoginStatus();
	if (isLoggedIn) {
		document.querySelector("#sign-in").remove();
		document.querySelector("#sign-out").addEventListener("click", () => {
			fetch("http://localhost:3000/auth/logout", {
				method: "GET",
				credentials: "include",
			})
				.then((res) => res.ok && window.location.replace("/"))
				.catch((error) => console.error("Error:", error));
		});
	} else {
		document.querySelector("#sign-out").remove();
	}
}

changeHeader();
