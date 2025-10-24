document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        errorMessage.textContent = "";
        errorMessage.style.color = "red";
        
        // Validate inputs
        if (username.value.trim() === "" || password.value.trim() === "") {
            errorMessage.textContent = "Username & Password Required";
            return;
        }

        try {
            // Call the backend login API
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username.value.trim(),
                    password: password.value
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success - Redirect back to the admin age (after 1 second)
                errorMessage.style.color = "green";
                errorMessage.textContent = "Login Successfull";

                setTimeout(() => {
                    window.location.href = "/admin/dashboard.html";
                },1000)

                setTimeout(() => { // set timeout to redirect back to login screen when token expires 
                    alert("Your session has expired. Please log in again.");
                    window.location.href = "/login/login.html";
                }, 8000);
                

            } else {
                // Login failed
                errorMessage.textContent = "Invalid Credentials";
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = "Error Logging In";
        }
    });
});
