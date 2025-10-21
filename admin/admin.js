const data = {
    "0": { lotOwnNumber: "123", lotOwnId: "Northern Half", sectionOwn: "1",lotNumber: "123", lotId: "Northern Half", section: "1", buriedFirst: "John", buriedMiddle: "Michael", buriedLast: "Doe", suffix:"Jr", dob: "1990-01-01", dod: "2020-06-15", vessel: "casket", owns: true },
    "1": { lotNumber: "456", lotId: "B", section: "2", buriedFirst: "Jane", buriedMiddle: "Elizabeth", buriedLast: "Smith", dob: "1985-02-10", dod: "2019-08-21", vessel: "urn", owns: false },
    "2": { lotOwnNumber: "456", lotOwnId: "B", sectionOwn: "2", organization: "Nisky Hill", owns: true },
    "3": { lotOwnNumber: "4", lotOwnId: "Northern Half", sectionOwn: "B", buriedFirst: "Matthew", buriedLast: "Bergin", owns: true}
};
const plotsData = {
    "0": { lotNumber: "123", section: "1", lotPartition: "Northern Half", owner: "John Doe" },
    "1": { lotNumber: "456", section: "2", lotPartition: "Southern Third", owner: "Jane Smith" },
    "2": { lotNumber: "789", section: "3", lotPartition: "Western Half of Northern Half", owner: "Nisky Hill Organization" },
    "3": { lotNumber: "101", section: "4", lotPartition: "Eastern Quarter", owner: "Alice Johnson" },
    "4": { lotNumber: "202", section: "5", lotPartition: "Southwestern Sixth", owner: "Robert Brown" },
    "5": { lotNumber: "303", section: "6", lotPartition: "Northern Third of Eastern Half", owner: "Emily Davis" }
};
let sections = [
    { name: "A", file: null },
    { name: "B", file: null },
    { name: "C", file: null }
];


let currentRow;
let ownerResults, burialResults, residentResults, lotResults, plotResults, plotPeopleResults;

API_BASE_URL = 'http://localhost:8080';

function performOwnerSearch() {
    let lastName = document.getElementById("searchName").value.trim().toLowerCase();

    let results = Object.values(data).filter(entry => {
        fetch('http://localhost:8080/owners/all',
            {
                method: 'GET',
                body: JSON.stringify(data)
            }
        )
        .then(response => response.json())
        .then(serverData => {
            let results = Object.values(serverData).filter(entry => {
                
                return true;
            });

            if (results.length > 0) {
                console.log("Search Results:", results);
            } else {
                console.log("No matching results found.");
            }
            ownerResults = results;
            populateTable(results, 'owners');
        })
        .catch(error => {
            console.error("Error fetching lots:", error);
        });
        
    });
}
function performBurialSearch() {
    let lastName = document.getElementById("searchOwnLast").value.trim().toLowerCase();
    let organization = document.getElementById("searchOwnOrg").value.trim().toLowerCase();

    let results = Object.values(data).filter(entry => {
        if(entry.dob){
            return false;
        }
        if(lastName && organization){
            if(entry.buriedLast && entry.buriedLast.toLowerCase() === lastName && entry.dod && entry.organization && entry.organization.toLowerCase() === organization){
                return true;
            }
            return false;
        }
        if (lastName && entry.buriedLast && entry.buriedLast.toLowerCase() === lastName && entry.owns) {
            return true;
        }
        if (organization && entry.organization && entry.organization.toLowerCase() === organization && entry.owns) {
            return true;
        }
        return false;
    });

    if (results.length > 0) {
        console.log("Search Results:", results);
    } else {
        console.log("No matching results found.");
    }
    burialResults = results;
    populateTable(results, 'burial');
}
async function performResidentSearch() {
    let name = document.getElementById("searchResidentLast").value.trim().toLowerCase();

    try {
        const response = await fetch(`${API_BASE_URL}/residents/search?name=${name}`)
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
        // statusDiv.innerHTML = '';
        //send call to display results with filtered data and name entered
        // displaySearchResults(residents, name);
        console.log(residents)
        residentResults = residents;
        populateTable(residents, 'residents');
            
            //network error
        } catch (error) {
            // statusDiv.innerHTML = `Error searching: ${error.message}`;
            // resultsDiv.innerHTML = '';
            console.error('Search error:', error);
        }
}
async function performLotSearch() {
    const section = document.getElementById("searchSectionRes").value.trim();
    const lot = document.getElementById("searchLotRes").value.trim();

    try {
        // Build query string dynamically
        const queryParams = new URLSearchParams();
        if (section) queryParams.append("section", section);
        if (lot) queryParams.append("lot", lot);

        console.log(section)


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
        console.log(lots);

        // Example: store results and display them
        lotResults = lots;
        populateTable(lots, 'lots');

    } catch (error) {
        // statusDiv.innerHTML = `Error searching: ${error.message}`;
        const tableBody = document.getElementById("resLotTableBody");

        // Clear any previous rows
        tableBody.innerHTML = "";

        // Create a row
        const row = document.createElement("tr");

        // Create a single cell that spans all columns
        const cell = document.createElement("td");
        cell.colSpan = tableBody.parentElement.querySelector("thead tr").children.length; // span all columns
        cell.textContent = "No results found";
        cell.style.textAlign = "center"; // optional: center the text

        // Append the cell to the row, and row to the table body
        row.appendChild(cell);
        tableBody.appendChild(row);
        console.error('Search error:', error);
    }
}
async function performLotSearch2() {
    const section = document.getElementById("searchSection").value.trim();
    const lot = document.getElementById("searchLotPlots").value.trim();

    try {
        // Build query string dynamically
        const queryParams = new URLSearchParams();
        if (section) queryParams.append("section", section);
        if (lot) queryParams.append("lot", lot);

        console.log(section)


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
        console.log(lots);

        // Example: store results and display them
        plotResults = lots;
        populateTable(lots, 'plots');

    } catch (error) {
        // statusDiv.innerHTML = `Error searching: ${error.message}`;
        const tableBody = document.getElementById("resLotTableBody");

        // Clear any previous rows
        tableBody.innerHTML = "";

        // Create a row
        const row = document.createElement("tr");

        // Create a single cell that spans all columns
        const cell = document.createElement("td");
        cell.colSpan = tableBody.parentElement.querySelector("thead tr").children.length; // span all columns
        cell.textContent = "No results found";
        cell.style.textAlign = "center"; // optional: center the text

        // Append the cell to the row, and row to the table body
        row.appendChild(cell);
        tableBody.appendChild(row);
        console.error('Search error:', error);
    }
}
function performPlotSearch() {
    let section = document.getElementById("searchSectionPlots").value.trim().toLowerCase();
    let lot = document.getElementById("searchLotPlots").value.trim().toLowerCase();

    fetch('http://localhost:8080/owners/all')
        .then(response => response.json())
        .then(serverData => {
            console.log(serverData[0])
            let results = Object.values(serverData).filter(entry => {
                if (section && lot && entry.lot.sectionName && entry.lot.sectionName.toLowerCase() === section && entry.lot.number && entry.lot.number.toLowerCase() === lot) {
                    return true;
                }
                return false;
            });

            if (results.length > 0) {
                console.log("Search Results:", results);
            } else {
                console.log("No matching results found.");
            }
            plotResults = results;
            populateTable(results, 'plots');
        })
        .catch(error => {
            console.error("Error fetching lots:", error);
        });
}
function populateTable(filteredData, type) {
    if(type === 'owners'){
        const tableBody = document.getElementById("ownerTableBody");
        tableBody.innerHTML = ""; // Clear previous content

        if (filteredData.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6'>No results found</td></tr>";
            return;
        }

        filteredData.forEach((entry, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${entry.lastName || ""}</td>
                <td>${entry.middleName || ""}</td>
                <td>${entry.lastName || ""}</td>
                <td>${entry.suffix || ""}</td>
                <td>${entry.organization || ""}</td>
                <td>
                    <button onclick="viewMore('${entry.lastName || ""}', '${entry.middleName || ""}', '${entry.lastName || ""}', '${entry.suffix || ""}', '${index}', 'owners')">View More</button>
                    <button onclick="deleteEntry('${index}', 'owners')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    else if(type === 'residents'){
        const tableBody = document.getElementById("residentTableBody");
        tableBody.innerHTML = ""; // Clear previous content

        if (filteredData.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6'>No results found</td></tr>";
            return;
        }

        filteredData.forEach((entry, index) => {
            console.log(entry['firstName'])
            const row = document.createElement("tr");
            row.dataset.rid = entry.rid; 

            row.innerHTML = `
                <td>${entry.firstName || ""}</td>
                <td>${entry.middleName || ""}</td>
                <td>${entry.lastName || ""}</td>
                <td>${entry.burialDate || ""}</td>
                <td>
                    <button onclick="viewMore('${entry.firstName || ""}', '${entry.middleName || ""}', '${entry.lastName || ""}', '${entry.burialDate}', '${entry.rid}', 'resident')">View More</button>
                    <button onclick="deleteEntry('${entry.rid}', 'residents')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    else if(type === 'lots'){
        const tableBody = document.getElementById("resLotTableBody");
        tableBody.innerHTML = ""; // Clear previous content

        // Flatten the data: one entry per resident
        const flattenedResidents = [];
        filteredData.forEach(entry => {
            const lot = entry.lot; // if you need lot info later
            entry.residents.forEach(resident => {
                flattenedResidents.push({
                    ...resident,
                    lotInfo: lot // optional, store lot if needed
                });
            });
        });

        if (flattenedResidents.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6'>No results found</td></tr>";
            return;
        }

        // Populate table
        flattenedResidents.forEach((resident, index) => {
            console.log(resident)
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${resident.firstName || ""}</td>
                <td>${resident.middleName || ""}</td>
                <td>${resident.lastName || ""}</td>
                <td>${resident.burialDate || ""}</td>
                <td>${resident.lotInfo.section.name || ""}</td>
                <td>${resident.lotInfo.number || ""}</td>
                <td>${resident.lotInfo.descriptor || ""}</td>
                <td>
                    <button onclick="viewMore('${resident.firstName || ""}', '${resident.middleName || ""}', '${resident.lastName || ""}', '${resident.burialDate || ""}', '${resident.rid}', 'resident')">View More</button>
                    <button onclick="deleteEntry('${index}', 'residents')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

    }
    if(type === 'burial'){
        const tableBody = document.getElementById("burialTableBody");
        tableBody.innerHTML = ""; // Clear previous content

        if (filteredData.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6'>No results found</td></tr>";
            return;
        }

        filteredData.forEach((entry, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${entry.buriedFirst || ""}</td>
                <td>${entry.buriedMiddle || ""}</td>
                <td>${entry.buriedLast || ""}</td>
                <td>${entry.suffix || ""}</td>
                <td>${entry.organization || ""}</td>
                <td>
                    <button onclick="viewMore('${entry.buriedFirst || ""}', '${entry.buriedMiddle || ""}', '${entry.buriedLast || ""}', '${index}', 'burial')">Bury</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    else if(type === 'plots'){
        const tableBody = document.getElementById("lotTableBody");
        tableBody.innerHTML = ""; // Clear previous content

        if (filteredData.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='4'>No results found</td></tr>";
            return;
        }

        filteredData.forEach((entry, index) => {
            console.log(entry)
            const row = document.createElement("tr");
            row.dataset.lid = entry.lot.lid; 

            row.innerHTML = `
                <td>${entry.lot.section.name || ""}</td>
                <td>${entry.lot.number || ""}</td>
                <td>${entry.lot.descriptor || ""}</td>
                <td>
                    <button onclick="viewMore('${entry || ""}', '${entry.middleName || ""}', '${entry.lastName || ""}', '${entry.burialDate || ""}', '${entry.lot.lid}', 'plots')">View More</button>
                    <button onclick="deleteEntry('${entry.lot.lid}', 'plots')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

async function viewMore(firstname, middleName, lastName, suffix, row, type) {
    const rowId = parseInt(row, 10); // Ensure row is treated as a number
    let details; 
    id = 0;
    if(type === 'resident'){
        // details = residentResults[rowId];
        try {
            console.log(row)
            const response = await fetch(`${API_BASE_URL}/residents/find/${row}`)
            if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Resident with ID ${residentResults[rowId].rid} not found`);
                    } else if (response.status === 400) {
                        throw new Error('Invalid Resident ID format');
                    } else if (response.status === 500) {
                        throw new Error('Server error occurred');
                    } else {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
            }

            const residents = await response.json();
            // statusDiv.innerHTML = '';
            //send call to display results with filtered data and name entered
            // displaySearchResults(residents, name);
            console.log(residents)
            // residentResults = residents;
            details = residents;
            id = residents.rid;
            
            //network error
        } catch (error) {
            // statusDiv.innerHTML = `Error searching: ${error.message}`;
            // resultsDiv.innerHTML = '';
            console.error('Search error:', error);
        }
    }
    else if(type == 'owners') {
        console.log(ownerResults)
        details = {
            "lotOwnNumber": ownerResults[rowId].lot.number, 
            "sectionOwn": ownerResults[rowId].lot.sectionName, 
            "lotOwnId": ownerResults[rowId].lot.descriptor, 
            "firstName": ownerResults[rowId].firstName,
            "middleName": ownerResults[rowId].middleName,
            "lastName": ownerResults[rowId].lastName,
            "suffix": ownerResults[rowId].suffix,
            "organization": ownerResults[rowId].organization
        }
    }
    else if (type == 'lots'){
        details = lotResults[rowId];
    }
    else if (type == 'plots'){
        try {
            console.log(row)
            
            const response = await fetch(`${API_BASE_URL}/lots/find/${row}`)
            if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Resident with ID ${residentResults[rowId].rid} not found`);
                    } else if (response.status === 400) {
                        throw new Error('Invalid Resident ID format');
                    } else if (response.status === 500) {
                        throw new Error('Server error occurred');
                    } else {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
            }

            const lots = await response.json();
            // statusDiv.innerHTML = '';
            //send call to display results with filtered data and name entered
            // displaySearchResults(residents, name);
            console.log(lots)
            // residentResults = residents;
            details = lots;
            id = lots.lid;
            
            //network error
            
        } catch (error) {
            // statusDiv.innerHTML = `Error searching: ${error.message}`;
            // resultsDiv.innerHTML = '';
            console.error('Search error:', error);
        }
    }
    else if(type === 'burial'){
        details = burialResults[rowId];
    }
    else{
        return;
    }
    currentRow = document.getElementById(rowId);
    createPopup(details, rowId, type, id);
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    if (popupContainer) {
        popupContainer.remove();
    }
}
async function getLotInfo(section, lot, partition){
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
        console.error('Search error:', error);
    }
}
function createPopup(details, rowId, type, id) {
    //Remove existing popup if it exists
    closePopup();
    let popupHTML;
    if(type === 'resident'){
        popupHTML = `
        <div class="overlay" id="overlay" onclick="closePopup()"></div>
        <div class="popup" id="popup" data-row-id="${rowId}" data-rid="${id}">
            <h3>Details</h3>
            <label for="sectionNumber">Section:</label>
            <select id="sectionNumber" required>
                <option value=${details.lot.section.name || ''}>${details.lot.section.name || ''}</option>
            </select>
            <label for="lotNumber">Lot Number:</label>
            <select id="lotNumber" required>
                <option value=${details.lot.number || ''}>${details.lot.number || ''}</option>
            </select>

            <label for="lotPortion">Lot Portion:</label>
            <select id="lotPortion" required>
                <option value=${details.lot.descriptor || ''}>${details.lot.descriptor || ''}</option>
            </select>
            <label>First Name: <input type="text" id="buriedFirst" disabled value="${details.firstName || ''}"></label>
            <label>Middle Name: <input type="text" id="buriedMiddle" disabled value="${details.middleName || ''}"></label>
            <label>Last Name: <input type="text" id="buriedLast" disabled value="${details.lastName || ''}"></label>
            <label>Date of Birth: <input type="date" id="dob" disabled value="${details.birthDate || ''}"></label>
            <label>Burial Date: <input type="date" id="burialDate" disabled value="${details.burialDate || ''}"></label>
            <label>Date of Death: <input type="date" id="dod" disabled value="${details.deathDate || ''}"></label>
            <label>Vessel: 
                <select id="vessel" disabled>
                    <option value="urn" ${details.capsule === 'urn' ? 'selected' : ''}>Urn</option>
                    <option value="casket" ${details.capsule === 'casket' ? 'selected' : ''}>Casket</option>
                    <option value="Unknown" ${details.capsule !== 'casket' && details.capsule !== 'urn' ? 'selected' : ''}>Unknown</option>
                </select>
            </label>
            <label>Marker: <input type="checkbox" id="marker" disabled ${details.marker ? 'checked' : ''}></label>
            <label>Foundation: <input type="checkbox" id="foundation" disabled ${details.foundation ? 'checked' : ''}></label>
            <label>Public: <input type="checkbox" id="public" disabled ${details.publicViewable ? 'checked' : ''}></label>
            <button onclick="enableEditing()">Edit</button>
            <button onclick="saveChanges('residents')">Save</button>
            <button onclick="closePopup()">Close</button>
        </div>
    `;
    }
    else if (type === 'owners'){
        popupHTML = `
        <div class="overlay" id="overlay" onclick="closePopup()"></div>
        <div class="popup" id="popup" data-row-id="${rowId}">
            <h3>Details</h3>
            <label>Lot Number: <input type="text" id="lotNumber" disabled value="${details.lotOwnNumber || ''}"></label>
            <label>Lot Portion: <input type="text" id="lotPortion" disabled value="${details.lotOwnId || ''}"></label>
            <label>Section: <input type="text" id="section" disabled value="${details.sectionOwn || ''}"></label>
            <label>First Name: <input type="text" id="buriedFirst" disabled value="${details.firstName || ''}"></label>
            <label>Middle Name: <input type="text" id="buriedMiddle" disabled value="${details.middleName || ''}"></label>
            <label>Last Name: <input type="text" id="buriedLast" disabled value="${details.lastName || ''}"></label>
            <label>Suffix: <input type="text" id="suffix" disabled value="${details.suffix || ''}"></label>
            <label>Organization: <input type="text" id="org" disabled value="${details.organization || ''}"></label>
            <label>
                Notes: <input type="file" id="notes" disabled onchange="handleFileUpload(event)">
                <a id="downloadLink" style="display:none;" download>Download File</a>
            </label>
            <button onclick="enableEditing()">Edit</button>
            <button onclick="saveChanges('owners')">Save</button>
            <button onclick="closePopup()">Close</button>
        </div>
        `;
    }
    else if (type === 'lots'){
        if(details.owns && !details.dod){ //owner
            popupHTML = `
            <div class="overlay" id="overlay" onclick="closePopup()"></div>
            <div class="popup" id="popup" data-row-id="${rowId}">
                <h3>Details</h3>
                <label>Lot Number: <input type="text" id="lotOwnNumber" disabled value="${details.lotOwnNumber || ''}"></label>
                <label>Lot Portion: <input type="text" id="lotOwnPortion" disabled value="${details.lotOwnId || ''}"></label>
                <label>Section: <input type="text" id="sectionOwn" disabled value="${details.sectionOwn || ''}"></label>
                <label>First Name: <input type="text" id="buriedFirst" disabled value="${details.buriedFirst || ''}"></label>
                <label>Middle Name: <input type="text" id="buriedMiddle" disabled value="${details.buriedMiddle || ''}"></label>
                <label>Last Name: <input type="text" id="buriedLast" disabled value="${details.buriedLast || ''}"></label>
                <label>Suffix: <input type="text" id="suffix" disabled value="${details.suffix || ''}"></label>
                <label>
                    Notes: <input type="file" id="notes" disabled onchange="handleFileUpload(event)">
                    <a id="downloadLink" style="display:none;" download>Download File</a>
                </label>
                <button onclick="enableEditing()">Edit</button>
                <button onclick="saveChanges('lots')">Save</button>
                <button onclick="closePopup()">Close</button>
            </div>
            `;
        }
        else if (details.owns){ //owner and resident
            popupHTML = `
            <div class="overlay" id="overlay" onclick="closePopup()"></div>
            <div class="popup" id="popup" data-row-id="${rowId}">
                <h3>Details</h3>
                <label>Lot Number: <input type="text" id="lotNumber" disabled value="${details.lotNumber || ''}"></label>
                <label>Lot Portion: <input type="text" id="lotPortion" disabled value="${details.lotId || ''}"></label>
                <label>Section: <input type="text" id="section" disabled value="${details.section || ''}"></label>
                <label>Owned Lot Number: <input type="text" id="lotOwnNumber" disabled value="${details.lotOwnNumber || ''}"></label>
                <label>Owned Lot Portion: <input type="text" id="lotOwnPortion" disabled value="${details.lotOwnId || ''}"></label>
                <label>Owned Section: <input type="text" id="sectionOwn" disabled value="${details.sectionOwn || ''}"></label>
                <label>First Name: <input type="text" id="buriedFirst" disabled value="${details.buriedFirst || ''}"></label>
                <label>Middle Name: <input type="text" id="buriedMiddle" disabled value="${details.buriedMiddle || ''}"></label>
                <label>Last Name: <input type="text" id="buriedLast" disabled value="${details.buriedLast || ''}"></label>
                <label>Suffix: <input type="text" id="suffix" disabled value="${details.suffix || ''}"></label>
                <label>Organization: <input type="text" id="org" disabled value="${details.organization || ''}"></label>
                <label>Date of Birth: <input type="date" id="dob" disabled value="${details.dob || ''}"></label>
                <label>Date of Death: <input type="date" id="dod" disabled value="${details.dod || ''}"></label>
                <label>Vessel: 
                    <select id="vessel" disabled>
                        <option value="urn" ${details.vessel === 'urn' ? 'selected' : ''}>Urn</option>
                        <option value="casket" ${details.vessel === 'casket' ? 'selected' : ''}>Casket</option>
                    </select>
                </label>
                <label>
                    Notes: <input type="file" id="notes" disabled onchange="handleFileUpload(event)">
                    <a id="downloadLink" style="display:none;" download>Download File</a>
                </label>
                <button onclick="enableEditing()">Edit</button>
                <button onclick="saveChanges('lots')">Save</button>
                <button onclick="closePopup()">Close</button>
            </div>
            `;
        }
        else{
            popupHTML = `
            <div class="overlay" id="overlay" onclick="closePopup()"></div>
            <div class="popup" id="popup" data-row-id="${rowId}">
                <h3>Details</h3>
                <label>Lot Number: <input type="text" id="lotNumber" disabled value="${details.lotNumber || ''}"></label>
                <label>Lot Portion: <input type="text" id="lotPortion" disabled value="${details.lotId || ''}"></label>
                <label>Section: <input type="text" id="section" disabled value="${details.section || ''}"></label>
                <label>First Name: <input type="text" id="buriedFirst" disabled value="${details.buriedFirst || ''}"></label>
                <label>Middle Name: <input type="text" id="buriedMiddle" disabled value="${details.buriedMiddle || ''}"></label>
                <label>Last Name: <input type="text" id="buriedLast" disabled value="${details.buriedLast || ''}"></label>
                <label>Organization: <input type="text" id="org" disabled value="${details.organization || ''}"></label>
                <label>Date of Birth: <input type="date" id="dob" disabled value="${details.dob || ''}"></label>
                <label>Date of Death: <input type="date" id="dod" disabled value="${details.dod || ''}"></label>
                <label>Vessel: 
                    <select id="vessel" disabled>
                        <option value="urn" ${details.vessel === 'urn' ? 'selected' : ''}>Urn</option>
                        <option value="casket" ${details.vessel === 'casket' ? 'selected' : ''}>Casket</option>
                    </select>
                </label>
                <label>
                    Notes: <input type="file" id="notes" disabled onchange="handleFileUpload(event)">
                    <a id="downloadLink" style="display:none;" download>Download File</a>
                </label>
                <button onclick="enableEditing()">Edit</button>
                <button onclick="saveChanges('lots')">Save</button>
                <button onclick="closePopup()">Close</button>
            </div>
            `;
        }
    }
    else if (type === 'plots') {
        console.log(details);
        popupHTML = `
        <div class="overlay" id="overlay" onclick="closePopup()"></div>
        <div class="popup" id="popup" data-row-id="${details.lid}">
            <h3>Details</h3>
            <label for="sectionNumber">Section:</label>
            <select id="sectionNumber" required disabled>
                <option value=${details.section.name || ''}>${details.section.name || ''}</option>
            </select>
            <label>Lot Number: <input type="text" id="lotNumber" disabled value="${details.number || ''}"></label>
            <label>Lot Partition: <input type="text" id="lotPartition" disabled value="${details.descriptor || ''}"></label>
            <label>Owner: <input type="text" id="lotOwner" disabled value="${details.owner || ''}"></label>
                <a id="downloadLink" style="display:none;" download>Download File</a>
            </label>
            <button onclick="viewPlots('${details.section || ''}', '${details.number || ''}', '${details.descriptor || ''}')">View Plots</button>
            <button onclick="enableEditing()">Edit</button>
            <button onclick="saveChanges('plots')">Save</button>
            <button onclick="closePopup()">Close</button>
        </div>
        `;
    }
    else if (type === 'burial') {
        popupHTML = `
        <div class="overlay" id="overlay" onclick="closePopup()"></div>
        <div class="popup" id="popup" data-row-id="${rowId}">
            <h3>Details</h3>
            <label>Lot Number: <input type="text" id="lotNumber" value="${details.lotNumber || ''}"></label>
            <label>Lot Partition: <input type="text" id="lotPartition" value="${details.lotPartition || ''}"></label>
            <label>Section: <input type="text" id="section" value="${details.section || ''}"></label>
            <label>Date of Birth: <input type="date" id="dob" value="${details.dob || ''}"></label>
            <label>Date of Death: <input type="date" id="dod" value="${details.dod || ''}"></label>
            <label>Vessel: 
                <select id="vessel">
                    <option value="urn" ${details.vessel === 'urn' ? 'selected' : ''}>Urn</option>
                    <option value="casket" ${details.vessel === 'casket' ? 'selected' : ''}>Casket</option>
                </select>
            </label>
            <label>Internment Records: <input type="file" id="internmentRecords" onchange="handleFileUpload(event)">
                <a id="downloadLink" style="display:none;" download>Download File</a>
            </label>
            <button onclick="saveChanges('burial')">Save</button>
            <button onclick="closePopup()">Cancel</button>
        </div>
        `;
    }
    else if (type === 'plotPeople') {
        const peopleList = [];
    
        Object.values(details).forEach(person => {
            if (person.buriedFirst && person.buriedLast) {
                peopleList.push(`${person.buriedFirst} ${person.buriedMiddle || ""} ${person.buriedLast}`.trim());
            }
        });
    
        if (peopleList.length === 0) {
            peopleList.push('No records available');
        }
    
        popupHTML = `
        <div class="overlay" id="overlay" onclick="closePopup()"></div>
        <div class="popup" id="popup" data-row-id="${rowId}">
            <h3>People in Lot</h3>
            <p>${peopleList.join('<br>')}</p>
            <button onclick="closePopup()">Close</button>
        </div>
        `;
    }
    
    

    // Create a container div and insert the popup HTML
    const popupContainer = document.createElement("div");
    popupContainer.id = "popupContainer";
    popupContainer.innerHTML = popupHTML;
    document.body.appendChild(popupContainer);

    if(type == 'resident'){
        const sectionSelector = document.getElementById("sectionNumber");
        const lotSelector = document.getElementById("lotNumber");
        const portionSelector = document.getElementById("lotPortion");
        let sectionId = sectionSelector.value;
        let lotId = lotSelector.value;
        //Get sections and update dropdowns
        fetch(API_BASE_URL + "/sections/all")
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            // selesectionSelectorctEl.innerHTML = '<option value="">Select a section</option>';
            data.forEach(section => {
                if(section.name !== sectionSelector.value){
                    const option = document.createElement("option");
                    option.value = section.name;
                    option.textContent = section.name;
                    sectionSelector.appendChild(option);
                }
                
            });
        })
        .catch(error => {
            console.error("Error fetching sections:", error);
            selectEl.innerHTML = '<option value="">Error loading sections</option>';
        });
        fetch(`${API_BASE_URL}/lots/residents/search?section=${sectionId}`)
                .then(res => res.json())
                .then(data => {
                data.forEach(lot => {
                    if(lot.lot.number !== lotSelector.value){
                        const opt = document.createElement("option");
                        opt.value = lot.lot.number;
                        opt.textContent = lot.lot.number;
                        lotSelector.appendChild(opt);
                    }
                });
                lotSelector.disabled = false;
                })
                .catch(err => {
                console.error(err);
                lotSelector.innerHTML = '<option value="">Error loading lots</option>';
                });
        fetch(`${API_BASE_URL}/lots/residents/search?section=${sectionId}&lot=${lotId}`)
            .then(res => res.json())
            .then(data => {
            data.forEach(portion => {
                if(portion.lot.descriptor !== portionSelector.value){
                    const opt = document.createElement("option");
                    opt.value = portion.lot.descriptor;
                    opt.textContent = portion.lot.descriptor;
                    opt.setAttribute('data-lid', portion.lot.lid);
                    portionSelector.appendChild(opt);
                }
            });
            portionSelector.disabled = false;
            })
            .catch(err => {
                console.error(err);
                portionSelector.innerHTML = '<option value="">Error loading portions</option>';
            });
        sectionSelector.addEventListener("change", () => {
            const sectionId = sectionSelector.value;
            lotSelector.innerHTML = '<option value="">Loading lots...</option>';
            lotSelector.disabled = true;
            portionSelector.innerHTML = '<option value="">Select a lot first</option>';
            portionSelector.disabled = true;

            if (!sectionId) {
                lotSelect.innerHTML = '<option value="">Select a section first</option>';
                return;
            }

            fetch(`${API_BASE_URL}/lots/residents/search?section=${sectionId}`)
                .then(res => res.json())
                .then(data => {
                lotSelector.innerHTML = '<option value="">Select a lot</option>';
                data.forEach(lot => {
                    const opt = document.createElement("option");
                    opt.value = lot.lot.number;
                    opt.textContent = lot.lot.number;
                    lotSelector.appendChild(opt);
                });
                lotSelector.disabled = false;
                })
                .catch(err => {
                console.error(err);
                lotSelector.innerHTML = '<option value="">Error loading lots</option>';
                });
        });

        // --- When Lot Changes, Load Portions ---
        lotSelector.addEventListener("change", () => {
        const lotId = lotSelector.value;
        const sectionId = sectionSelector.value;
        portionSelector.innerHTML = '<option value="">Loading portions...</option>';
        portionSelector.disabled = true;

        if (!lotId) {
            portionSelect.innerHTML = '<option value="">Select a lot first</option>';
            return;
        }

        fetch(`${API_BASE_URL}/lots/residents/search?section=${sectionId}&lot=${lotId}`)
            .then(res => res.json())
            .then(data => {
            portionSelector.innerHTML = '<option value="">Select a portion</option>';
            data.forEach(portion => {
                const opt = document.createElement("option");
                opt.value = portion.lot.descriptor;
                opt.textContent = portion.lot.descriptor;
                opt.setAttribute('data-lid', portion.lot.lid);
                portionSelector.appendChild(opt);
            });
            portionSelector.disabled = false;
            })
            .catch(err => {
                console.error(err);
                portionSelector.innerHTML = '<option value="">Error loading portions</option>';
            });
        });
    }
    else if (type === 'plots'){
        const sectionSelector = document.getElementById("sectionNumber");

        sections.forEach(section => {
            if(section.name !== sectionSelector.value){
                const option = document.createElement("option");
                option.value = section.name;
                option.textContent = section.name;
                sectionSelector.appendChild(option);
            }
            
        });
    }
}
function enableEditing() {
    document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = false);
}
async function saveChanges(type) {
    if(type === 'owners'){
        document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = true);
        const rowId = popup.getAttribute("data-row-id"); // Get stored rowId
        if (ownerResults[rowId]){
            ownerResults[rowId].lotOwnNumber = document.getElementById("lotNumber").value;
            ownerResults[rowId].lotOwnId = document.getElementById("lotPortion").value;
            ownerResults[rowId].sectionOwn = document.getElementById("section").value;
            ownerResults[rowId].buriedFirst = document.getElementById("buriedFirst").value;
            ownerResults[rowId].buriedMiddle = document.getElementById("buriedMiddle").value;
            ownerResults[rowId].buriedLast = document.getElementById("buriedLast").value;
            ownerResults[rowId].suffix = document.getElementById("suffix").value;
            ownerResults[rowId].organization = document.getElementById("org").value;
        }
        populateTable(ownerResults, 'owners');
    }
    else if (type === 'residents'){
        document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = true);
        const rowId = popup.getAttribute("data-row-id"); // Get stored rowId
        const rid = popup.getAttribute("data-rid");
        const lotInfo = await getLotInfo(document.getElementById("section").value, document.getElementById("lotNumber").value, document.getElementById("lotPortion").value) 
        resident = {
            'rid': rid,
            "firstName": document.getElementById("buriedFirst").value,
            "middleName": document.getElementById("buriedMiddle").value,
            "lastName": document.getElementById("buriedLast").value,
            "birthDate": document.getElementById("dob").value,
            "burialDate": document.getElementById("dod").value,
            "deathDate": document.getElementById("burialDate").value,
            "capsule": document.getElementById("vessel").value,
            "marker": false,
            "foundation": false,
            "publicViewable": document.getElementById("public").checked,
            "lid": lotInfo.lid
        }
        const data = JSON.stringify(resident);
        try {
            const response = await fetch(`${API_BASE_URL}/residents/update`,  {
                method:'PUT',
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

            const element = document.querySelectorAll(`tr[data-rid="${rid}"]`)[0];
            element.innerHTML = `
                <td>${resident.firstName || ""}</td>
                <td>${resident.middleName || ""}</td>
                <td>${resident.lastName || ""}</td>
                <td>${resident.burialDate || ""}</td>
                <td>
                    <button onclick="viewMore('${resident.firstName || ""}', '${resident.middleName || ""}', '${resident.lastName || ""}', '${resident.burialDate}', '${resident.rid}', 'resident')">View More</button>
                    <button onclick="deleteEntry('${rid}', 'residents')">Delete</button>
                </td>
            `;
            const responseData = await response.text();
        } catch (error) {
            // statusDiv.innerHTML = `Error searching: ${error.message}`;
            // resultsDiv.innerHTML = '';
            console.error('Put error:', error);
        }
    }
    else if (type === 'lots'){
        document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = true);
        const rowId = popup.getAttribute("data-row-id"); // Get stored rowId
        if (lotResults[rowId]){
            lotResults[rowId].lotNumber = document.getElementById("lotNumber").value;
            lotResults[rowId].lotId = document.getElementById("lotPortion").value;
            lotResults[rowId].section = document.getElementById("section").value;
            lotResults[rowId].buriedFirst = document.getElementById("buriedFirst").value;
            lotResults[rowId].buriedMiddle = document.getElementById("buriedMiddle").value;
            lotResults[rowId].buriedLast = document.getElementById("buriedLast").value;
            lotResults[rowId].suffix = document.getElementById("suffix").value;
            if(document.getElementById("dob")){ //resident
                lotResults[rowId].dob = document.getElementById("dob").value;
                lotResults[rowId].dod = document.getElementById("dod").value;
                lotResults[rowId].vessel = document.getElementById("vessel").value;
            }
            lotResults[rowId].organization = document.getElementById("org").value;
            if(document.getElementById("owns")){
                lotResults[rowId].lotOwnNumber = document.getElementById("lotOwnNumber").value;
                lotResults[rowId].lotOwnId = document.getElementById("lotOwnPortion").value;
                lotResults[rowId].sectionOwn = document.getElementById("sectionOwn").value;
            }
        }
        populateTable(lotResults, 'lots'); 
    }
    else if (type === 'burial'){
        document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = true);
        const rowId = popup.getAttribute("data-row-id"); // Get stored rowId
        if (burialResults[rowId]){
            burialResults[rowId].lotNumber = document.getElementById("lotNumber").value;
            burialResults[rowId].lotId = document.getElementById("lotPartition").value;
            burialResults[rowId].section = document.getElementById("section").value;
            burialResults[rowId].dob = document.getElementById("dob").value;
            burialResults[rowId].dod = document.getElementById("dod").value;
            burialResults[rowId].vessel = document.getElementById("vessel").value;
            //propogate to data
            for (const key in data) {
                const entry = data[key];
                if (entry.buriedFirst === burialResults[rowId].buriedFirst &&
                        entry.buriedLast === burialResults[rowId].buriedLast) {
                            entry.lotNumber = document.getElementById("lotNumber").value;
                            entry.lotId = document.getElementById("lotPartition").value;
                            entry.section = document.getElementById("section").value;
                            entry.dob = document.getElementById("dob").value;
                            entry.dod = document.getElementById("dod").value;
                            entry.vessel = document.getElementById("vessel").value;
                            break;
                }
            }
        }
        window.alert(`Successfully buried ${burialResults[rowId].buriedFirst} ${burialResults[rowId].buriedLast}`);
        closePopup();
    }
    else if (type === 'plots'){
        document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = true);
        const rowId = popup.getAttribute("data-row-id"); // Get stored rowId
        if (plotResults[rowId]){
            plotResults[rowId].lotNumber = document.getElementById("lotNumber").value;
            plotResults[rowId].section = document.getElementById("section").value;
            plotResults[rowId].lotPartition = document.getElementById("lotPartition").value;
            plotResults[rowId].owner = document.getElementById("lotOwner").value;
        }
        populateTable(plotResults, 'plots'); 
    }
        
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const downloadLink = document.getElementById("downloadLink");
        downloadLink.href = URL.createObjectURL(file);
        downloadLink.textContent = file.name;
        downloadLink.style.display = "block";
    }
}

function toggleForm() {
    const form = document.getElementById('addOwnerForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}
function toggleResForm() {
    const form = document.getElementById('addResidentForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}
function toggleLotForm() {
    const form = document.getElementById('addLotForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}
function toggleSectionForm() {
    const form = document.getElementById('addSectionForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}
function toggleFileForm() {
    const form = document.getElementById('addFileForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}



document.getElementById('newResidentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
   
    const portion = document.getElementById('resPortion')

    newResident = {
        firstName: document.getElementById('fName').value,
        middleName: document.getElementById('mName').value,
        lastName: document.getElementById('lName').value,
        birthDate: document.getElementById('dofb').value,
        burialDate: document.getElementById('burialDate').value,
        deathDate: document.getElementById('dofd').value,
        capsule: document.getElementById('vesselType').value,
        marker: document.getElementById('marker').checked,
        foundation: document.getElementById('foundation').checked,
        publicViewable: document.getElementById('valid').checked,
        lid: portion.options[portion.selectedIndex].getAttribute("data-lid")
    }

    console.log(newResident)


    fetch(`${API_BASE_URL}/residents/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newResident) 
        })
        .then(response => response.text())
        .then(result => {
            console.log("Success:", result);
        })
        .catch(error => {
            console.error("Error:", error);
        }
    );

    
    // Clear the form fields
    document.getElementById('newResidentForm').reset();

    document.getElementById("addResidentForm").style.display = "none";   // hide form
    document.getElementById("showResidentFormBtn").style.display = "block";    // show +
});
document.getElementById('newLotForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
   
    // const sectionId = sections[document.getElementById('sectionId').value]
    const sectionName = document.getElementById('sectionId').value;
    let sectionId = null;
    for(let i = 0; i < sections.length; i++){
        if (sections[i]['name'] === sectionName){
            sectionId = sections[i]['sid'];
            break;
        }
    }

    newLot = {
        number: document.getElementById('addLotNumber').value,
        descriptor: document.getElementById('addLotPortion').value,
        owner: document.getElementById('ownerFirst').value,
        mapXCord: null,
        mapYCord: null,
        sid: sectionId
    }

    console.log(newLot)


    fetch(`${API_BASE_URL}/lots/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newLot) 
        })
        .then(response => response.text())
        .then(result => {
            console.log("Success:", result);
        })
        .catch(error => {
            console.error("Error:", error);
        }
    );


    
    // Clear the form fields
    document.getElementById('newLotForm').reset();

    document.getElementById("addLotForm").style.display = "none";   // hide form
    document.getElementById("showLotFormBtn").style.display = "block";    // show +
});
document.getElementById('newFileForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // // Generate a new unique ID based on the highest existing key in data
    // const newId = Object.keys(plotsData).length > 0 
    //     ? Math.max(...Object.keys(plotsData).map(Number)) + 1 
    //     : 0;

    // // Get all the values from the form
    // const section = document.getElementById('addSectionId').value;
    // const record = document.getElementById('record').files[0] ? document.getElementById('note').files[0].name : '';
    
    // // Add new entry to the data object
    // sections[newId] = {
    //     section: section,
    //     internmentRecord: record,
    // };

    
    // Clear the form fields
    document.getElementById('newFileForm').reset();

    document.getElementById("addFileForm").style.display = "none";   // hide form
    document.getElementById("showFileFormBtn").style.display = "block";  //show +
});

document.getElementById("showLotFormBtn").addEventListener("click", () => {
    document.getElementById("addLotForm").style.display = "block";   // show form
    document.getElementById("showLotFormBtn").style.display = "none";    // hide +
});
document.getElementById("showResidentFormBtn").addEventListener("click", () => {
    document.getElementById("addResidentForm").style.display = "block";   // show form
    document.getElementById("showResidentFormBtn").style.display = "none";    // hide +
});
document.getElementById("showFileFormBtn").addEventListener("click", () => {
    document.getElementById("addFileForm").style.display = "block";   // show form
    document.getElementById("showFileFormBtn").style.display = "none";    // hide +
});


function deleteEntry(id, type) {
    if(type === 'residents'){
        fetch(`${API_BASE_URL}/residents/delete/${id}`, {
            method: "DELETE",
            })
            .then(response => response.text())
            .then(result => {
                console.log("Success:", result);
            })
            .catch(error => {
                window.alert("Error deleting resident" + error);
        });
        const row = document.querySelector(`tr[data-rid="${id}"]`);
        row.remove();
    }
    else if(type === 'owners'){
        ownerResults[id] = null;
        populateTable(ownerResults, 'owners');
    }
    else if(type === 'lots'){
        lotResults[id] = null;
        populateTable(lotResults, 'lots');
    }
    else if(type === 'plots'){
        fetch(`${API_BASE_URL}/lots/delete/${id}`, {
            method: "DELETE",
            })
            .then(response => response.text())
            .then(result => {
                console.log("Success:", result);
            })
            .catch(error => {
                window.alert("Error deleting resident" + error);
        });
        const row = document.querySelector(`tr[data-lid="${id}"]`);
        row.remove();
    }
}
function viewPlots(section, lotNumber, lotPartition){
    let results = Object.values(data).filter(entry => {
        console.log(entry);
        
        if (section && lotNumber && lotPartition && entry.section && entry.section.toLowerCase() === section.toLowerCase() 
        && entry.lotNumber && entry.lotNumber.toLowerCase() === lotNumber.toLowerCase() 
        && entry.lotId && entry.lotId.toLowerCase() === lotPartition.toLowerCase()) {
            return true;
        }
        return false;
    });

    if (results.length > 0) {
        console.log("Search Results:", results);
    } else {
        console.log("No matching results found.");
    }
    plotPeopleResults = results;
    createPopup(results, 0, 'plotPeople');
}
function showEditor() {
    const editor = document.getElementById("sectionEditor");
    editor.style.display = "block";

    const tableBody = document.getElementById("sectionTableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    sections.forEach((section, index) => {
        const row = document.createElement("tr");

        // Editable section name
        const nameCell = document.createElement("td");
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = section.name;
        nameInput.oninput = (e) => sections[index].name = e.target.value;
        nameCell.appendChild(nameInput);

        // File upload
        const fileCell = document.createElement("td");
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.onchange = (e) => sections[index].file = e.target.files[0];
        fileCell.appendChild(fileInput);

        row.appendChild(nameCell);
        row.appendChild(fileCell);
        tableBody.appendChild(row);
    });
}

function saveSections() {
    const tableBody = document.getElementById("sectionTableBody");
    
    // Clear existing rows to update them
    tableBody.innerHTML = "";

    sections.forEach((section) => {
        const row = document.createElement("tr");

        // Non-editable section name
        const nameCell = document.createElement("td");
        nameCell.textContent = section.name;

        // Non-editable file information
        const fileCell = document.createElement("td");
        fileCell.textContent = section.file ? section.file.name : "No file available";

        row.appendChild(nameCell);
        row.appendChild(fileCell);
        tableBody.appendChild(row);
    });
}

function performFileSearch() {
    const fileTableBody = document.getElementById("fileTableBody");
    
    // Clear existing table content
    fileTableBody.innerHTML = "";

    // Temporary file data
    const tempFiles = [
        { partition: "Northern Half", name: "File1.pdf", action: "Download" },
        { partition: "Southern Half", name: "File2.docx", action: "Download" }
    ];

    // Populate the table with temporary files
    tempFiles.forEach(file => {
        const row = document.createElement("tr");

        const fileCell = document.createElement("td");
        fileCell.textContent = file.name;

        const partitionCell = document.createElement("td");
        partitionCell.textContent = file.partition;

        const actionCell = document.createElement("td");
        const actionButton = document.createElement("button");
        actionButton.textContent = file.action;
        actionButton.onclick = () => alert(`Downloading ${file.name}`);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.marginLeft = "10px"; 
        deleteButton.onclick = (event) => {
            const rowIndex = event.target.parentNode.parentNode.rowIndex; // Get row index
            document.querySelector("table").deleteRow(rowIndex); // Delete row from the table
        };

        actionCell.appendChild(actionButton);
        actionCell.appendChild(deleteButton);
        row.appendChild(partitionCell);
        row.appendChild(fileCell);
        row.appendChild(actionCell);

        fileTableBody.appendChild(row);
    });
}


//Get sections and update dropdowns
fetch(API_BASE_URL + "/sections/all")
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then(data => {
    sections = data;
    selectEl = document.getElementById("resCemSection");
    selectEl.innerHTML = '<option value="">Select a section</option>';
    data.forEach(section => {
      const option = document.createElement("option");
      option.value = section.name;
      option.textContent = section.name;
      selectEl.appendChild(option);
    });
    selectEl2 = document.getElementById("sectionId");
    selectEl2.innerHTML = '<option value="">Select a section</option>';
    data.forEach(section => {
      const option = document.createElement("option");
      option.value = section.name;
      option.textContent = section.name;
      selectEl2.appendChild(option);
    });
  })
  .catch(error => {
    console.error("Error fetching sections:", error);
    selectEl.innerHTML = '<option value="">Error loading sections</option>';
  });

  // --- When Section Changes, Load Lots --
const sectionSelect = document.getElementById("resCemSection");
const lotSelect = document.getElementById("resLotNum");
const portionSelect = document.getElementById("resPortion");
sectionSelect.addEventListener("change", () => {
  const sectionId = sectionSelect.value;
  lotSelect.innerHTML = '<option value="">Loading lots...</option>';
  lotSelect.disabled = true;
  portionSelect.innerHTML = '<option value="">Select a lot first</option>';
  portionSelect.disabled = true;

  if (!sectionId) {
    lotSelect.innerHTML = '<option value="">Select a section first</option>';
    return;
  }

  fetch(`${API_BASE_URL}/lots/residents/search?section=${sectionId}`)
    .then(res => res.json())
    .then(data => {
        // console.log(data)
      lotSelect.innerHTML = '<option value="">Select a lot</option>';
      data.forEach(lot => {
        const opt = document.createElement("option");
        opt.value = lot.lot.number;
        opt.textContent = lot.lot.number;
        lotSelect.appendChild(opt);
      });
      lotSelect.disabled = false;
    })
    .catch(err => {
      console.error(err);
      lotSelect.innerHTML = '<option value="">Error loading lots</option>';
    });
});

// --- When Lot Changes, Load Portions ---
lotSelect.addEventListener("change", () => {
  const lotId = lotSelect.value;
  const sectionId = sectionSelect.value;
  portionSelect.innerHTML = '<option value="">Loading portions...</option>';
  portionSelect.disabled = true;

  if (!lotId) {
    portionSelect.innerHTML = '<option value="">Select a lot first</option>';
    return;
  }

  fetch(`${API_BASE_URL}/lots/residents/search?section=${sectionId}&lot=${lotId}`)
    .then(res => res.json())
    .then(data => {
      portionSelect.innerHTML = '<option value="">Select a portion</option>';
      data.forEach(portion => {
        const opt = document.createElement("option");
        opt.value = portion.lot.descriptor;
        opt.textContent = portion.lot.descriptor;
        opt.setAttribute('data-lid', portion.lot.lid);
        portionSelect.appendChild(opt);
      });
      portionSelect.disabled = false;
    })
    .catch(err => {
      console.error(err);
      portionSelect.innerHTML = '<option value="">Error loading portions</option>';
    });
});

document.getElementById("closeResidentFormBtn").addEventListener("click", function () {
    document.getElementById("addResidentForm").style.display = "none";
    document.getElementById('showResidentFormBtn').style.display = "block";
});





// --------- Nav Bar Session Tracking Logic------------------>

document.addEventListener("DOMContentLoaded", () => { 
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileWrapper = document.getElementById('profileWrapper');
    const logoutBtn = document.getElementById('logoutBtn');
    const resetPasswordLink = document.getElementById('resetPasswordLink');
    const logoutError = document.getElementById('logoutErrorText');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userRole  = document.getElementById('role');

    // click on the Person Icon
    profileIcon.addEventListener('click', () => {
        logoutError.textContent = "";
        profileDropdown.style.display =
        profileDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Click off the person icon
    document.addEventListener('click', (e) => {
        if (!profileWrapper.contains(e.target)) {
            profileDropdown.style.display = 'none';
        }
    });

    // click the logout button
    logoutBtn.addEventListener('click', () => {
        handleLogout(logoutError);
    });

    // click the reset password text
    resetPasswordLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent navigation
    });
});

async function handleLogout(logoutError) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, { 
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      window.location.href = './admin/dashboard.html'; // redirect after successful logout
    } else {
      logoutError.textContent = "Error Logging Out";
      const errorData = await response.json();
    }
  } catch (err) {
    logoutError.textContent = "Error Logging Out";
  }
}
