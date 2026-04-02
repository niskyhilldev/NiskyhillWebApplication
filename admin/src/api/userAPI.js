//all API calls for users will reside here, then will be utilized in thier respective react functions

const API_BASE_URL = 'http://localhost:8080'; //Should update to env var

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

export { login };
