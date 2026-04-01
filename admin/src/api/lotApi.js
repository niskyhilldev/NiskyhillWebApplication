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




export default fetchSections;
