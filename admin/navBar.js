// --------- Nav Bar and Session Tracking Logic------------------>

document.addEventListener("DOMContentLoaded", () => { 
    const API_BASE_URL = 'http://localhost:8080';

    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileWrapper = document.getElementById('profileWrapper');
    const logoutBtn = document.getElementById('logoutBtn');
    const resetPasswordLink = document.getElementById('resetPasswordLink');
    const logoutError = document.getElementById('logoutErrorText');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userRole  = document.getElementById('userRole');

    // click on the Person Icon
    profileIcon.addEventListener('click', () => {
        logoutError.textContent = "";
        profileDropdown.style.display = 
        profileDropdown.style.display === 'block' ? 'none' : 'block';
        setCurrentUserInfo(userName, userEmail, userRole, logoutError)
    });

    // Click off the person icon
    document.addEventListener('click', (e) => {
        if (!profileWrapper.contains(e.target)) {
            profileDropdown.style.display = 'none';
        }
    });

    // click the logout button
    logoutBtn.addEventListener('click', () => {
        handleLogout(logoutError);
    });

    // click the reset password text
    resetPasswordLink.addEventListener('click', (e) => {
        window.location.href = "/admin/update_password/updatepassword.html"; // redirect to the reset password page
    });
});

async function handleLogout(logoutError) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, { 
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      window.location.href = './admin/dashboard.html'; // redirect after successful logout
    } else {
      logoutError.textContent = "Error Logging Out";
    }
  } catch (err) {
    logoutError.textContent = "Error Logging Out";
  }
}


async function setCurrentUserInfo(userName, userEmail, userRole, logoutError){
    try {
        const response = await fetch(`${API_BASE_URL}/auth/user`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok){
            const data = await response.json();
            userName.textContent = `${data.firstName} ${data.lastName}`;
            userEmail.textContent = data.email;
            userRole.textContent = data.role;
        } else {
            logoutError.textContent = "Error Displaying User Information";
        }

    } catch (err) {
        logoutError.textContent = "Error Displaying User Information";
    }
}
