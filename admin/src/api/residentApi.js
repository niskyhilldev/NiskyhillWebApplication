//all API calls for residents will reside here, then will be utilized in thier respective react functions

const API_BASE_URL = 'http://localhost:8080'; //Should update to env var

// post request to add resident
async function addResident(payload){
    const response = await fetch(`${API_BASE_URL}/residents/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // include cookies for session
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to add resident");
    }

    return response.text();
}

export { addResident };
