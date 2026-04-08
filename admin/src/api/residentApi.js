//all API calls for residents will reside here, then will be utilized in thier respective react functions

const API_BASE_URL = 'http://localhost:8080'; //Should update to env var


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



