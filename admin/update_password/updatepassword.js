document.addEventListener("DOMContentLoaded", () => {

    API_BASE_URL = 'http://localhost:8080';

    const form = document.getElementById("loginForm");
    const pass1 = document.getElementById("pass1");
    const pass2 = document.getElementById("pass2");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        errorMessage.textContent = "";
        errorMessage.style.color = "red";
        
        // Validate inputs
        if (pass1.value !== pass2.value) {
            errorMessage.textContent = "Passwords Must Match";
            return;
        }

        try {
            // Call the backend login API
            const response = await fetch(`${API_BASE_URL}/auth/password/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: pass2.value
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success - Redirect back to the admin age (after 1 second)
                errorMessage.style.color = "green";
                errorMessage.textContent = "Password Updated";

                setTimeout(() => {
                    window.location.href = "/admin/dashboard.html";
                },1000)

                setTimeout(() => { // set timeout to redirect back to login screen when token expires 
                    alert("Your session has expired. Please log in again.");
                    window.location.href = "/login/login.html";
                }, 8000);
                

            } else {
                // Login failed
                errorMessage.textContent = "Error Updating Password"
            }
        } catch (error) {
            console.error('Error Updating Password', error);
            errorMessage.textContent = "Error Updating Password";
        }
    });
});
