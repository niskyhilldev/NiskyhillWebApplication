const data = {
    "0": { lotNumber: "123", lotId: "Northern Half", section: "1", buriedFirst: "John", buriedMiddle: "Michael", buriedLast: "Doe", dob: "1990-01-01", dod: "2020-06-15", vessel: "casket", owns: true },
    "1": { lotNumber: "456", lotId: "B", section: "2", buriedFirst: "Jane", buriedMiddle: "Elizabeth", buriedLast: "Smith", dob: "1985-02-10", dod: "2019-08-21", vessel: "urn", owns: false },
    "2": { lotNumber: "456", lotId: "B", section: "2", organization: "Nisky Hill", owns: true }
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
let ownerResults, residentResults, lotResults, plotResults, plotPeopleResults;

function performOwnerSearch() {
    let lastName = document.getElementById("searchLast").value.trim().toLowerCase();
    let organization = document.getElementById("searchOrg").value.trim().toLowerCase();

    let results = Object.values(data).filter(entry => {
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
    ownerResults = results;
    populateTable(results, 'owners');
}
function performResidentSearch() {
    let lastName = document.getElementById("searchResidentLast").value.trim().toLowerCase();
    let organization = document.getElementById("searchResidentOrg").value.trim().toLowerCase();

    let results = Object.values(data).filter(entry => {
        if(lastName && organization){
            if(entry.buriedLast && entry.buriedLast.toLowerCase() === lastName && entry.dod && entry.organization && entry.organization.toLowerCase() === organization){
                return true;
            }
            return false;
        }
        if (lastName && entry.buriedLast && entry.buriedLast.toLowerCase() === lastName && entry.dod) {
            return true;
        }
        if (organization && entry.organization && entry.organization.toLowerCase() === organization && entry.dod) {
            return true;
        }
        return false;
    });

    if (results.length > 0) {
        console.log("Search Results:", results);
    } else {
        console.log("No matching results found.");
    }
    residentResults = results;
    populateTable(results, 'residents');
}
function performLotSearch() {
    let section = document.getElementById("searchSection").value.trim().toLowerCase();
    let lot = document.getElementById("searchLot").value.trim().toLowerCase();

    let results = Object.values(data).filter(entry => {
        if (section && lot && entry.section && entry.section.toLowerCase() === section && entry.lotNumber && entry.lotNumber.toLowerCase() === lot) {
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

    let results = Object.values(plotsData).filter(entry => {
        if (section && lot && entry.section && entry.section.toLowerCase() === section && entry.lotNumber && entry.lotNumber.toLowerCase() === lot) {
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
}
function populateTable(filteredData, type) {
    if(type === 'owners'){
        const tableBody = document.getElementById("ownerTableBody");
        tableBody.innerHTML = ""; // Clear previous content

        if (filteredData.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5'>No results found</td></tr>";
            return;
        }

        filteredData.forEach((entry, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${entry.buriedFirst || ""}</td>
                <td>${entry.buriedMiddle || ""}</td>
                <td>${entry.buriedLast || ""}</td>
                <td>${entry.organization || ""}</td>
                <td>
                    <button onclick="viewMore('${entry.buriedFirst || ""}', '${entry.buriedMiddle || ""}', '${entry.buriedLast || ""}', '${index}', 'owners')">View More</button>
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
            tableBody.innerHTML = "<tr><td colspan='5'>No results found</td></tr>";
            return;
        }

        filteredData.forEach((entry, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${entry.buriedFirst || ""}</td>
                <td>${entry.buriedMiddle || ""}</td>
                <td>${entry.buriedLast || ""}</td>
                <td>${entry.organization || ""}</td>
                <td>
                    <button onclick="viewMore('${entry.buriedFirst || ""}', '${entry.buriedMiddle || ""}', '${entry.buriedLast || ""}', '${index}', 'resident')">View More</button>
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
            tableBody.innerHTML = "<tr><td colspan='5'>No results found</td></tr>";
            return;
        }

        filteredData.forEach((entry, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${entry.buriedFirst || ""}</td>
                <td>${entry.buriedMiddle || ""}</td>
                <td>${entry.buriedLast || ""}</td>
                <td>${entry.organization || ""}</td>
                <td>
                    <button onclick="viewMore('${entry.buriedFirst || ""}', '${entry.buriedMiddle || ""}', '${entry.buriedLast || ""}', '${index}', 'lots')">View More</button>
                    <button onclick="deleteEntry('${index}', 'lots')">Delete</button>
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
                <td>${entry.section || ""}</td>
                <td>${entry.lotNumber || ""}</td>
                <td>${entry.lotPartition || ""}</td>
                <td>
                    <button onclick="viewMore('${entry.buriedFirst || ""}', '${entry.buriedMiddle || ""}', '${entry.buriedLast || ""}', '${index}', 'plots')">View More</button>
                    <button onclick="deleteEntry('${index}', 'plots')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function viewMore(firstname, middleName, lastName, row, type) {
    const rowId = parseInt(row, 10); // Ensure row is treated as a number
    let details; 
    if(type === 'resident'){
        details = residentResults[rowId];
    }
    else if(type == 'owners') {
        details = ownerResults[rowId];
    }
    else if (type == 'lots'){
        details = lotResults[rowId];
    }
    else if (type == 'plots'){
        details = plotResults[rowId];
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
            <label>Owns: <input type="checkbox" id="owns" disabled ${details.owns ? 'checked' : ''}></label>
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
            <label>Lot Number: <input type="text" id="lotNumber" disabled value="${details.lotNumber || ''}"></label>
            <label>Lot Portion: <input type="text" id="lotPortion" disabled value="${details.lotId || ''}"></label>
            <label>Section: <input type="text" id="section" disabled value="${details.section || ''}"></label>
            <label>First Name: <input type="text" id="buriedFirst" disabled value="${details.buriedFirst || ''}"></label>
            <label>Middle Name: <input type="text" id="buriedMiddle" disabled value="${details.buriedMiddle || ''}"></label>
            <label>Last Name: <input type="text" id="buriedLast" disabled value="${details.buriedLast || ''}"></label>
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
        if(details.owns && !details.dod){
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
                <label>Owns: <input type="checkbox" id="owns" disabled ${details.owns ? 'checked' : ''}></label>
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
            ownerResults[rowId].lotNumber = document.getElementById("lotNumber").value;
            ownerResults[rowId].lotId = document.getElementById("lotPortion").value;
            ownerResults[rowId].section = document.getElementById("section").value;
            ownerResults[rowId].buriedFirst = document.getElementById("buriedFirst").value;
            ownerResults[rowId].buriedMiddle = document.getElementById("buriedMiddle").value;
            ownerResults[rowId].buriedLast = document.getElementById("buriedLast").value;
            ownerResults[rowId].dob = document.getElementById("dob").value;
            ownerResults[rowId].dod = document.getElementById("dod").value;
            ownerResults[rowId].vessel = document.getElementById("vessel").value;
            ownerResults[rowId].organization = document.getElementById("org").value;
            ownerResults[rowId].owns = document.getElementById("owns").checked;
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
            residentResults[rowId].dob = document.getElementById("dob").value;
            residentResults[rowId].dod = document.getElementById("dod").value;
            residentResults[rowId].vessel = document.getElementById("vessel").value;
            residentResults[rowId].organization = document.getElementById("org").value;
            residentResults[rowId].owns = document.getElementById("owns").checked;
        }
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
            lotResults[rowId].dob = document.getElementById("dob").value;
            lotResults[rowId].dod = document.getElementById("dod").value;
            lotResults[rowId].vessel = document.getElementById("vessel").value;
            lotResults[rowId].organization = document.getElementById("org").value;
            lotResults[rowId].owns = document.getElementById("owns").checked;
        }
        populateTable(lotResults, 'lots'); 
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
    const form = document.getElementById('addEntryForm');
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

document.getElementById('newEntryForm').addEventListener('submit', function(event) {
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
    const dob = document.getElementById('dofb').value;
    const dod = document.getElementById('dofd').value;
    const vessel = document.getElementById('vesselType').value;
    const owns = document.getElementById('owner').checked;
    const notes = document.getElementById('note').files[0] ? document.getElementById('note').files[0].name : '';
    const organization = document.getElementById('organization').value;
    
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
        owns: owns,
        notes: notes,
        organization: organization
    };

    
    // Clear the form fields
    document.getElementById('newEntryForm').reset();

    toggleForm(); // Hide the form after submission
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
    const editor = document.getElementById("sectionEditor");
    editor.style.display = "none";
}
