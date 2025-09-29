document.addEventListener('DOMContentLoaded', () => {
    let searchParams = new URLSearchParams(window.location.search);
    let userID = searchParams.get("id")  //search the URL for the team ID
    const API_BASE_URL = 'http://localhost:8080/residents/find'
    fetchResident();

    
    async function fetchResident() {
        try{
            const response = await fetch(`${API_BASE_URL}/${userID}`)
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

            const resident = await response.json();
            displayResident(resident)


        }catch(err){
            console.log('Error fetching resident:', err);
        }
    }

    function displayResident(resident){

        const name = (resident.firstName || '') + ' ' + (resident.middleName || '') + ' ' + (resident.lastName || '')
        const formattedDate = formatDate(resident.burialDate)

        document.getElementById("name").innerHTML = name
        document.getElementById("burialDate").innerHTML = (formattedDate || 'Not available')
        document.getElementById("section").innerHTML = (resident.lot.section.name || 'Not available')
        document.getElementById("lot").innerHTML = (resident.lot.number || 'Not available')
        document.getElementById("lotOwner").innerHTML = (resident.lot.owner || 'Not available')
        document.getElementById("lotDescriptor").innerHTML = (resident.lot.descriptor || 'Not available')
        document.getElementById("residentID").innerHTML = (resident.rid || 'Not available')
    }
    
        // Helper function to format dates
    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch {
            return dateStr;
        }
    }


});
