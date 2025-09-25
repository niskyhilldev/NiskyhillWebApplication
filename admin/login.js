function setCookie(name,value,minutes) {
    let expires = "";
    if (minutes) {
          console.log(minutes)

        let date = new Date();
        date.setTime(date.getTime() + (minutes*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    console.log(document.cookie)
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    console.log(document.cookie)
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent page refresh

    if (username.value.trim() === "" || password.value.trim() === "") {
      errorMessage.textContent = "⚠️ Both fields are required.";
      return;
    }

    // if (password.value.length < 6) {
    //   errorMessage.textContent = "⚠️ Password must be at least 6 characters.";
    //   return;
    // }

    // For demo purposes only
    if (username.value === "admin" && password.value === "password123") {
      errorMessage.style.color = "green";
      errorMessage.textContent = "✅ Login successful!";
      setCookie('loginCookie', "testval", 30);

      setTimeout(() => {
        window.location.href = "dashboard.html"; 
      }, 1500);
    } else {
      errorMessage.style.color = "red";
      errorMessage.textContent = "❌ Invalid username or password.";
    }
  });
});
