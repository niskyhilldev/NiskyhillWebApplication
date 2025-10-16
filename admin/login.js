function setCookie(name, value, minutes) {
    let expires = "";
    if (minutes) {
        let date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Add secure flags for production
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
}

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
      errorMessage.textContent = "Both fields are required.";
      return;
    }

    try {
      // Call your backend login API
      const response = await fetch('http://localhost:8080/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value.trim(),
          password: password.value
        })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Success - store token in cookie
        errorMessage.style.color = "green";
        errorMessage.textContent = "Login successful!";
        
        // Store token (expires in 30 minutes, or use data.expiresIn from backend)
        setCookie('adminToken', data.token, 30);
        
        setTimeout(() => {
          window.location.href = "dashboard.html"; 
        }, 1500);
      } else {
        // Login failed
        errorMessage.textContent = data.message || "Invalid username or password.";
      }
    } catch (error) {
      console.error('Login error:', error);
      errorMessage.textContent = "An error occurred. Please try again.";
    }
  });
});