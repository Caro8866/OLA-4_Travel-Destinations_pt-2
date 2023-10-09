export async function checkLoginStatus() {
	return await fetch("http://localhost:3000/auth/protected", {
	  method: "GET",
	  credentials: "include", // Include cookies in the request
	})
	  .then((response) => {
		if (response.ok) {
		  return true;
		} else {
		  return false;
		}
	  })
	  .catch((error) => {
		console.error("Error checking login status:", error);
		return false;
	  });
  }