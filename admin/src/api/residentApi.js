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

    // retrieve backend response 
    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Failed to add resident");
    }

    return text;
}   

export const performResidentSearch = async(name) => {
    //Call the api to get all the residents based off the name entered and display them
    const queryParams = new URLSearchParams();
    if (name) queryParams.append("name", name);

        const response = await fetch(`${API_BASE_URL}/residents/search?${queryParams.toString()}`)

          if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No residents found matching searched name');
            } else if (response.status === 400) {
                throw new Error('Invalid search parameters');
            } else if (response.status === 500) {
                throw new Error('Server error occurred');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }

        const residents = await response.json();
        
        return residents;
            
}

export const deleteResident = async(id) => {
    //delete an entry from the db
    fetch(`${API_BASE_URL}/residents/delete/${id}`, {
        method: "DELETE",
        credentials: "include", // only required when localhosting
        })
        .then(response => response.text())
        .then(result => {
            console.log("Success:", result);
        })
        .catch(error => {
            window.alert("Error deleting resident" + error);
    });
}


//funtion to update the lid of a resident (will update all fields at once, but should only be used to update lid)
export const updateResident = async(updateDTO) => {
     const data = JSON.stringify(updateDTO);

     const response = await fetch(`${API_BASE_URL}/residents/update`,  {
        method:'PUT',
        credentials: "include", // only required when localhosting
        headers: {
            'Content-Type': 'application/json', // Indicate that the request body contains JSON data
        },
        body: data,
    })
    if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Resident with ID ${rid} not found`);
            } else if (response.status === 400) {
                throw new Error('Invalid Resident ID format');
            } else if (response.status === 500) {
                throw new Error('Server error occurred');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
    }
}

export { addResident };
