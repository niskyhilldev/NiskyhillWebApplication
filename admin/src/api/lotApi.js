//all API calls for lots will reside here, then will be utilized in thier respective react functions

const API_BASE_URL = 'http://localhost:8080';  //Should update to env var

//gets all sections, returning as list for population in jsx files
export const fetchSections = async() => {
    const response = await fetch(`${API_BASE_URL}/sections/all`)
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data; // array of section json
}

// get lots
async function fetchLots(){
    const response = await fetch(`${API_BASE_URL}/lots/all`)
    if (!response.ok) {
        throw new Error("Failed to fetch lots");
    }
    
    return response.json(); // array of lot json
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

    // retrieve backend response 
    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Failed to add lot");
    }

    return text;
}




//Currently Taken straight from old implementation


//Utilized in Lot search                      v Section name- Not id
export const performLotSearch = async(lot, section) => {
    //Call the api to get all the plots based off the section NAME and lot number

        // Build query string dynamically
        const queryParams = new URLSearchParams();
        if (section) queryParams.append("section", section);
        if (lot) queryParams.append("lot", lot);
        console.log(queryParams);



        const response = await fetch(`${API_BASE_URL}/lots/residents/search?${queryParams.toString()}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No lots found matching search criteria');
            } else if (response.status === 400) {
                throw new Error('Invalid search parameters');
            } else if (response.status === 500) {
                throw new Error('Server error occurred');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }

        const lots = await response.json();

        /**Original use */
        // // Example: store results and display them
        // plotResults = lots;
        // populateTable(lots, 'plots');
        return lots;
}

export const deleteLot = async(id) => {
    //delete an entry from the db
    fetch(`${API_BASE_URL}/lots/delete/${id}`, {
        method: "DELETE",
        credentials: "include", // only required when localhosting
        })
        .then(response => response.text())
        .then(result => {
            console.log("Success:", result);
        })
        .catch(error => {
            window.alert("Error deleting lot" + error);
    });
}


//Used in resident edit to edit the assigned lot to the resident
async function getLotInfo(section, lot, partition){
    //search for all information on a given plot (partition)
    try {
        // Build query string dynamically
        const queryParams = new URLSearchParams();
        if (section) queryParams.append("section", section);
        if (lot) queryParams.append("lot", lot);


        const response = await fetch(`${API_BASE_URL}/lots/residents/search?${queryParams.toString()}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No lots found matching search criteria');
            } else if (response.status === 400) {
                throw new Error('Invalid search parameters');
            } else if (response.status === 500) {
                throw new Error('Server error occurred');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }

        const lots = await response.json();
        for(let i = 0; i < lots.length; i++){
            if (lots[i]['lot'].descriptor === partition){
                return(lots[i]['lot']);
            }
        }

    } catch (error) {
        window.alert('Edit Error:', error);
    }
}

export const updateLot = async(updateDTO) => {
     const data = JSON.stringify(updateDTO);
      try {
        const response = await fetch(`${API_BASE_URL}/lots/update`,  {
            method:'PUT',
            credentials: "include", // only required when localhosting
            headers: {
                'Content-Type': 'application/json', // Indicate that the request body contains JSON data
            },
            body: data,
        })
        if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Resident with ID ${rowId} not found`);
                } else if (response.status === 400) {
                    throw new Error('Invalid Resident ID format');
                } else if (response.status === 500) {
                    throw new Error('Server error occurred');
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
        }
    } catch (error) {
        window.alert('Edit Error:', error);
    }
}


export { fetchLots, addLot, getLotInfo };
