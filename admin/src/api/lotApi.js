//all API calls for lots will reside here, then will be utilized in thier respective react functions

const API_BASE_URL = 'http://localhost:8080';  //Should update to env var

//gets all sections, returning as list for population in jsx files
async function fetchSections(){
    const response = await fetch(`${API_BASE_URL}/sections/all`)
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    return data; // array of section json
}

// post request to add lot
async function addLot(payload){
    const response = await fetch(`${API_BASE_URL}/lots/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // include cookies for session
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to add lot");
    }

    return await response.text();
}


export { fetchSections, addLot };