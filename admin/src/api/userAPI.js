//all API calls for users will reside here, then will be utilized in thier respective react functions

const API_BASE_URL = 'http://localhost:8080'; //Should update to env var
// for prod it should be const API_BASE_URL = 'https://niskyhill.org';

async function login(email, password){
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // include cookies for session
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    return await response.json();
}

async function logout(){
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Logout failed");
    }

    return await response.json();
}

async function changePassword(password){
    const response = await fetch(`${API_BASE_URL}/auth/password/update`, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({password,}),
    });

    if (!response.ok) {
        throw new Error("Password change failed");
    }

    return await response.json();
}

async function getCurrentUser(){
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    return await response.json();
}
export { login, logout, changePassword, getCurrentUser };
