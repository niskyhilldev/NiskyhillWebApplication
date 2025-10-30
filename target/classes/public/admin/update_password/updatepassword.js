document.addEventListener("DOMContentLoaded", () => {

    API_BASE_URL = 'https://www.niskyhill.org';

    checkSessionAndSetRedirect()

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
                credentials: 'include',
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



/**
 * Calls /auth/user/status to get remaining token time and sets a timeout to redirect
 */
async function checkSessionAndSetRedirect() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/user/status`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            const remainingMs = data.timeRemaining;

            // If remaining time is already zero or negative, redirect immediately
            if (remainingMs <= 0) {
                window.location.href = '/login/login.html';
            } else {
                // Set timeout to redirect when token expires
                setTimeout(() => {
                    window.location.href = '/login/login.html';
                }, remainingMs);
            }
        } else {
            // API returned error (e.g., token invalid/expired)
            window.location.href = '/login/login.html';
        }
    } catch (err) {
        console.error("Error checking session status:", err);
        window.location.href = '/login/login.html';
    }
}


