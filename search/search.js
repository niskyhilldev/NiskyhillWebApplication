document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const resultsDiv = document.getElementById('searchResults');
    const statusDiv = document.getElementById('searchStatus');
    const API_BASE_URL = 'http://localhost:8080/residents';

    let currentPage = 1;
    const pageSize = 10; //show 10 per page
    let allResidents = [];

    const sectionFilter = document.getElementById('sectionFilter');
    const yearFilter = document.getElementById('yearFilter');

    sectionFilter.addEventListener('change', () => {
        currentPage = 1; //reset the page on each new search
        displaySearchResults();
    })

    yearFilter.addEventListener('input', () => {
        currentPage = 1; //reset the page on each new search
        displaySearchResults();
    });

    nameInput.addEventListener('input', () => {
        currentPage = 1; //reset the page on each new search
        debouncedSearch(nameInput.value);
    });

    async function searchResidents(name) {
        if (!name.trim()) {
            statusDiv.innerHTML = '';
            resultsDiv.innerHTML = '';
            allResidents = [];
            return;
        }

        statusDiv.innerHTML = 'Searching...';
        resultsDiv.innerHTML = '';

        try {
            const response = await fetch(`${API_BASE_URL}/search?name=${(name)}`);
            if (!response.ok) throw new Error(`Error while searching. Please try a different name or spelling.`);

            allResidents = await response.json(); //store ALL results
            statusDiv.innerHTML = '';
            displaySearchResults(); //display first page

        } catch (error) {
            console.error('Search error:', error);
        }
    }

    function displaySearchResults() {
        const selectedSection = sectionFilter.value;
        const selectedYear = yearFilter.value.trim();
        
        let filteredResidents = allResidents;
        
        if (selectedSection) {
            filteredResidents = filteredResidents.filter(r => r.sectionName === selectedSection);
        }
        
        if (selectedYear) {
            filteredResidents = filteredResidents.filter(r => {
                if (!r.burialDate) return false;
                const year = new Date(r.burialDate).getFullYear();
                return year.toString() === selectedYear;
            });
        }

        if (!filteredResidents || filteredResidents.length === 0) {
            resultsDiv.innerHTML = `
                <div style="text-align: center; color: #666; padding: 20px;">
                    <p>No residents found. Try updating the name or filter parameters.</p>
                </div>
            `;
            return;
        }

        const total = filteredResidents.length;
        const totalPages = Math.ceil(total / pageSize);
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const residents = filteredResidents.slice(start, end);

        let html = `<h2 style='margin: 0 20px 10px 20px;'>Search Results (${total} found)</h2>`;

        residents.forEach((resident) => {
            html += `
                <div class='resident-card' onclick="location.href='./profile/profile.html?id=${resident.rid}';"
                     style="border: 1px solid #ddd; padding: 15px; margin: 0 20px 10px 20px; border-radius: 5px; background-color: #f9f9f9; cursor: pointer; border-color: black;">
                    <h3>${formatName(resident)}</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div><strong>Burial Date:</strong> ${formatDate(resident.burialDate)}</div>
                        <div><strong>Section:</strong> ${resident.sectionName || ''}</div>
                        <div><strong>Resident ID:</strong> ${resident.rid || ''}</div>
                        <div><strong>Lot:</strong> ${resident.lotNumber || ''}</div>
                    </div>
                </div>
            `;
        });

        //pagination controls
        html += `<div style="text-align:center; margin:20px;">`;
        if (currentPage > 1) { //return to previous page
            html += `<button class="page-btn" onclick="changePage(${currentPage - 1})">Prev</button>`;
        }
        html += ` Page ${currentPage} of ${totalPages} `; //page counter
        if (currentPage < totalPages) { //go to next page
            html += `<button class="page-btn" onclick="changePage(${currentPage + 1})">Next</button>`;
        }
        html += `</div>`;

        resultsDiv.innerHTML = html;
    }

    //global for inline button onclick
    window.changePage = function(page) {
        currentPage = page;
        displaySearchResults();
    }

    function formatName(resident) {
        return [resident.firstName, resident.middleName, resident.lastName].filter(Boolean).join(' ');
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch {
            return dateStr;
        }
    }

    const debouncedSearch = debounce((name) => {
        searchResidents(name);
    }, 300);

    function debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
});