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
const sections = [
    { name: "A", file: null },
    { name: "B", file: null },
    { name: "C", file: null }
];


let currentRow;
let ownerResults, burialResults, residentResults, lotResults, plotResults, plotPeopleResults;

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
    API_BASE_URL = 'http://localhost:8080/residents';
    let name = document.getElementById("searchResidentLast").value.trim().toLowerCase();

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
        // statusDiv.innerHTML = '';
        //send call to display results with filtered data and name entered
        // displaySearchResults(residents, name);
        console.log(residents)
        residentResults = residents;
        populateTable(residents, 'residents');
            
            //network error
        } catch (error) {
            statusDiv.innerHTML = `Error searching: ${error.message}`;
            resultsDiv.innerHTML = '';
            console.error('Search error:', error);
        }
}
function performLotSearch() {
    let section = document.getElementById("searchSection").value.trim().toLowerCase();
    let lot = document.getElementById("searchLot").value.trim().toLowerCase();

    let results = Object.values(data).filter(entry => {
        if (section && lot && entry.section && entry.section.toLowerCase() === section && entry.lotNumber && entry.lotNumber.toLowerCase() === lot) {
            return true;
        }
        if (section && lot && entry.sectionOwn && entry.sectionOwn.toLowerCase() === section && entry.lotOwnNumber && entry.lotOwnNumber.toLowerCase() === lot) {
            return true;
        }
        return false;
    });

    if (results.length > 0) {
        console.log("Search Results:", results);
    } else {
        console.log("No matching results found.");
    }
    lotResults = results;
    populateTable(results, 'lots');
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

            row.innerHTML = `
                <td>${entry.firstName || ""}</td>
                <td>${entry.middleName || ""}</td>
                <td>${entry.lastName || ""}</td>
                <td>${entry.burialDate || ""}</td>
                <td>
                    <button onclick="viewMore('${entry.firstName || ""}', '${entry.middleName || ""}', '${entry.lastName || ""}', '${index}', 'resident')">View More</button>
                    <button onclick="deleteEntry('${index}', 'residents')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    else if(type === 'lots'){
        const tableBody = document.getElementById("lotTableBody");
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
                <td>
                    <button onclick="viewMore('${entry.buriedFirst || ""}', '${entry.buriedMiddle || ""}', '${entry.buriedLast || ""}', '${index}', 'lots')">View More</button>
                    <button onclick="deleteEntry('${index}', 'lots')">Delete</button>
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
        const tableBody = document.getElementById("plotTableBody");
        tableBody.innerHTML = ""; // Clear previous content

        if (filteredData.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='4'>No results found</td></tr>";
            return;
        }

        filteredData.forEach((entry, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${entry.lot.sectionName || ""}</td>
                <td>${entry.lot.number || ""}</td>
                <td>${entry.lot.descriptor || ""}</td>
                <td>
                    <button onclick="viewMore('${entry.firstName || ""}', '${entry.middleName || ""}', '${entry.lastName || ""}', '${entry.suffix || ""}', '${index}', 'plots')">View More</button>
                    <button onclick="deleteEntry('${index}', 'plots')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function viewMore(firstname, middleName, lastName, suffix, row, type) {
    const rowId = parseInt(row, 10); // Ensure row is treated as a number
    let details; 
    if(type === 'resident'){
        details = residentResults[rowId];
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
        details = {
            "lotNumber": plotResults[rowId].lot.number, 
            "section": plotResults[rowId].lot.sectionName, 
            "lotPartition": plotResults[rowId].lot.descriptor, 
            "owner": `${plotResults[rowId].firstName || ''} ${plotResults[rowId].middleName || ''} ${plotResults[rowId].lastName || ''}`
        }
    }
    else if(type === 'burial'){
        details = burialResults[rowId];
    }
    else{
        return;
    }
    currentRow = document.getElementById(rowId);
    createPopup(details, rowId, type);
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    if (popupContainer) {
        popupContainer.remove();
    }
}
function createPopup(details, rowId, type) {
    //Remove existing popup if it exists
    closePopup();
    let popupHTML;
    if(type === 'resident'){
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
            <label>Suffix: <input type="text" id="suffix" disabled value="${details.suffix || ''}"></label>
            <label>Date of Birth: <input type="date" id="dob" disabled value="${details.dob || ''}"></label>
            <label>Date of Death: <input type="date" id="dod" disabled value="${details.dod || ''}"></label>
            <label>Vessel: 
                <select id="vessel" disabled>
                    <option value="urn" ${details.vessel === 'urn' ? 'selected' : ''}>Urn</option>
                    <option value="casket" ${details.vessel === 'casket' ? 'selected' : ''}>Casket</option>
                </select>
            </label>
            <label>Public: <input type="checkbox" id="public" disabled ${details.valid ? 'checked' : ''}></label>
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
        popupHTML = `
        <div class="overlay" id="overlay" onclick="closePopup()"></div>
        <div class="popup" id="popup" data-row-id="${rowId}">
            <h3>Details</h3>
            <label>Lot Number: <input type="text" id="lotNumber" disabled value="${details.lotNumber || ''}"></label>
            <label>Lot Partition: <input type="text" id="lotPartition" disabled value="${details.lotPartition || ''}"></label>
            <label>Section: <input type="text" id="section" disabled value="${details.section || ''}"></label>
            <label>Owner: <input type="text" id="lotOwner" disabled value="${details.owner || ''}"></label>
            <label>Internment Records: <input type="file" id="internmentRecords" disabled onchange="handleFileUpload(event)">
                <a id="downloadLink" style="display:none;" download>Download File</a>
            </label>
            <button onclick="viewPlots('${details.section || ''}', '${details.lotNumber || ''}', '${details.lotPartition || ''}')">View Plots</button>
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
}
function enableEditing() {
    document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = false);
}
function saveChanges(type) {
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
        if (residentResults[rowId]){
            residentResults[rowId].lotNumber = document.getElementById("lotNumber").value;
            residentResults[rowId].lotId = document.getElementById("lotPortion").value;
            residentResults[rowId].section = document.getElementById("section").value;
            residentResults[rowId].buriedFirst = document.getElementById("buriedFirst").value;
            residentResults[rowId].buriedMiddle = document.getElementById("buriedMiddle").value;
            residentResults[rowId].buriedLast = document.getElementById("buriedLast").value;
            residentResults[rowId].suffix = document.getElementById("suffix").value;
            residentResults[rowId].dob = document.getElementById("dob").value;
            residentResults[rowId].dod = document.getElementById("dod").value;
            residentResults[rowId].vessel = document.getElementById("vessel").value;
            residentResults[rowId].organization = document.getElementById("org").value;
            residentResults[rowId].valid = document.getElementById("public").checked;
        }
        console.log(document.getElementById("public").checked);
        populateTable(residentResults, 'residents'); 
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



document.getElementById('newOwnerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Generate a new unique ID based on the highest existing key in data
    const newId = Object.keys(data).length > 0 
        ? Math.max(...Object.keys(data).map(Number)) + 1 
        : 0;

    // Get all the values from the form
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const lotNumber = document.getElementById('lotNum').value;
    const lotPortion = document.getElementById('portion').value;
    const section = document.getElementById('cemSection').value;
    const notes = document.getElementById('note').files[0] ? document.getElementById('note').files[0].name : '';
    const organization = document.getElementById('organization').value;
    
    // Add new entry to the data object
    data[newId] = {
        lotOwnNumber: lotNumber,
        lotOwnId: lotPortion,
        sectionOwn: section,
        buriedFirst: firstName,
        buriedMiddle: middleName,
        buriedLast: lastName,
        owns: true,
        notes: notes,
        organization: organization
    };

    
    // Clear the form fields
    document.getElementById('newOwnerForm').reset();

    toggleForm(); // Hide the form after submission
});
document.getElementById('newResidentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Generate a new unique ID based on the highest existing key in data
    const newId = Object.keys(data).length > 0 
        ? Math.max(...Object.keys(data).map(Number)) + 1 
        : 0;

    // Get all the values from the form
    const firstName = document.getElementById('fName').value;
    const middleName = document.getElementById('mName').value;
    const lastName = document.getElementById('lName').value;
    const lotNumber = document.getElementById('resLotNum').value;
    const lotPortion = document.getElementById('resPortion').value;
    const section = document.getElementById('resCemSection').value;
    // const notes = document.getElementById('resNote').files[0] ? document.getElementById('note').files[0].name : '';
    const organization = document.getElementById('resOrganization').value;
    const dob = document.getElementById('dofb').value;
    const dod = document.getElementById('dofd').value;
    const vessel = document.getElementById('vesselType').value;
    const valid = document.getElementById('valid').checked;
    
    // Add new entry to the data object
    data[newId] = {
        lotNumber: lotNumber,
        lotId: lotPortion,
        section: section,
        buriedFirst: firstName,
        buriedMiddle: middleName,
        buriedLast: lastName,
        dob: dob,
        dod: dod,
        vessel: vessel,
        valid: valid,
        owns: false,
        // notes: notes,
        organization: organization
    };

    
    // Clear the form fields
    document.getElementById('newResidentForm').reset();

    toggleResForm(); // Hide the form after submission
});
document.getElementById('newLotForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Generate a new unique ID based on the highest existing key in data
    const newId = Object.keys(plotsData).length > 0 
        ? Math.max(...Object.keys(plotsData).map(Number)) + 1 
        : 0;

    // Get all the values from the form
    const lotNumber = document.getElementById('addLotNumber').value;
    const lotPortion = document.getElementById('addLotPortion').value;
    const section = document.getElementById('sectionId').value;
    const ownerFirst = document.getElementById('ownerFirst').value;
    const ownerMiddle = document.getElementById('ownerMiddle').value;
    const ownerLast = document.getElementById('ownerLast').value;
    const record = document.getElementById('record').files[0] ? document.getElementById('note').files[0].name : '';
    
    // Add new entry to the data object
    plotsData[newId] = {
        lotNumber: lotNumber,
        lotPartition: lotPortion,
        section: section,
        owner: `${ownerFirst || ""} ${ownerMiddle || ""} ${ownerLast || ""}`,
        internmentRecord: record,
    };

    
    // Clear the form fields
    document.getElementById('newLotForm').reset();

    toggleLotForm(); // Hide the form after submission
});
document.getElementById('newSectionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Generate a new unique ID based on the highest existing key in data
    const newId = Object.keys(plotsData).length > 0 
        ? Math.max(...Object.keys(plotsData).map(Number)) + 1 
        : 0;

    // Get all the values from the form
    const section = document.getElementById('addSectionId').value;
    const record = document.getElementById('record').files[0] ? document.getElementById('note').files[0].name : '';
    
    // Add new entry to the data object
    sections[newId] = {
        section: section,
        internmentRecord: record,
    };

    
    // Clear the form fields
    document.getElementById('newSectionForm').reset();

    toggleSectionForm(); // Hide the form after submission
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

    toggleFileForm(); // Hide the form after submission
});



function deleteEntry(id, type) {
    if(type === 'residents'){
        residentResults[id] = null;
        populateTable(residentResults, 'residents');
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
        plotResults[id] = null;
        populateTable(plotResults, 'plots');
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