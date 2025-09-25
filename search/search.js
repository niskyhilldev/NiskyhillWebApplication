document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
        
    nameInput.addEventListener('input', () => {
        debouncedSearch(nameInput.value);
    });
    // Base URL for your API
    const API_BASE_URL = 'http://localhost:8080/residents';

    //debounce function so constant calls aren't made
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    
    //function to search for residents by name (later replace with api call)
    async function searchResidents(name) {
        const statusDiv = document.getElementById('searchStatus');
        const resultsDiv = document.getElementById('searchResults');
        
        //nothing is in text box
        if (!name.trim()) {
            statusDiv.innerHTML = '';
            resultsDiv.innerHTML = '';
            return;
        }
        
        statusDiv.innerHTML = 'Searching...';
        resultsDiv.innerHTML = '';
        
        try {
            const response = await fetch(`${API_BASE_URL}/search?name=${name}`)
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

            const residents = await response.json();
            statusDiv.innerHTML = '';
            //send call to display results with filtered data and name entered
            displaySearchResults(residents, name);
            
            //network error
        } catch (error) {
            statusDiv.innerHTML = `Error searching: ${error.message}`;
            resultsDiv.innerHTML = '';
            console.error('Search error:', error);
        }
    }

    //function to display search results
    function displaySearchResults(residents, name) {
        const resultsDiv = document.getElementById('searchResults');
        
        //case where there is no data or no matching results
        if (!residents || residents.length === 0) {
            resultsDiv.innerHTML = `
                <div style="text-align: center; color: #666; padding: 20px;">
                    <p>No residents found${name ? ` for "${name}"` : ''}.</p>
                    <p>Try adjusting your search terms or check the spelling.</p>
                </div>
            `;
            return;
        }
        
        //add in a new block for each new resident that has a matching name
        let html = `<h2 style='margin: 0 20px 10px 20px;'>Search Results (${residents.length} found)</h2>`;
        
        residents.forEach((resident) => {
            html += `
                <div class='resident-card' onclick="location.href='./profile/profile.html?id=${resident.rid}';" style="border: 1px solid #ddd; padding: 15px; margin: 0 20px 10px 20px; border-radius: 5px; background-color: #f9f9f9; cursor: pointer; border-color: black;">
                    
                    <h3 style="margin: 0 0 8px 0; color: #333; font-size: 1.2em;">${formatName(resident)}</h3>              

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div><strong>Death Date:</strong> ${formatDate(resident.burialDate)}</div>
                        <div><strong>Section:</strong> ${resident.sectionName || ''}</div>
                        <div><strong>Resident ID:</strong> ${resident.rid || ''}</div>
                        <div><strong>Lot:</strong> ${resident.lotNumber || ''}</div>
                    </div>
                </div>
            `;
        });
        
        resultsDiv.innerHTML = html;
    }


    // Helper function to format resident name
    function formatName(resident) {
        const parts = [];
        if (resident.firstName) parts.push(resident.firstName);
        if (resident.middleName) parts.push(resident.middleName);
        if (resident.lastName) parts.push(resident.lastName);
        return parts.join(' ');
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

    //debounced search function that searches for names once input has changed
    const debouncedSearch = debounce((name) => {
        searchResidents(name);
    }, 300);

})
