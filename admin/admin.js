const data = {
    "0": { lotNumber: "123", lotPortion: "A", section: "1", buriedFirst: "John", buriedMiddle: "Michael", buriedLast: "Doe", dob: "1990-01-01", dod: "2020-06-15", vessel: "casket", owns: true },
    "1": { lotNumber: "456", lotPortion: "B", section: "2", buriedFirst: "Jane", buriedMiddle: "Elizabeth", buriedLast: "Smith", dob: "1985-02-10", dod: "2019-08-21", vessel: "urn", owns: false },
    "2": { organization: "Heritage Trust", owns: true }
};
let currentRow;
let ownerResults;

function performOwnerSearch() {
    let lastName = document.getElementById("searchLast").value.trim().toLowerCase();
    let organization = document.getElementById("searchOrg").value.trim().toLowerCase();

    let results = Object.values(data).filter(entry => {
        if (lastName && entry.buriedLast && entry.buriedLast.toLowerCase() === lastName) {
            return true;
        }
        if (organization && entry.organization && entry.organization.toLowerCase() === organization) {
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
    populateTable(results);
}
function populateTable(filteredData) {
    const tableBody = document.getElementById("tableBody");
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
                <button onclick="viewMore('${entry.buriedFirst || ""}', '${entry.buriedMiddle || ""}', '${entry.buriedLast || ""}', '${index}')">View More</button>
                <button onclick="deleteEntry('${index}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function viewMore(firstname, middleName, lastName, row) {
    const rowId = parseInt(row, 10); // Ensure row is treated as a number
    const details = ownerResults[rowId];
    currentRow = document.getElementById(rowId);
    createPopup(details, rowId);
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    if (popupContainer) {
        popupContainer.remove();
    }
}
function createPopup(details, rowId) {
    // Remove existing popup if it exists
    closePopup();

    // Generate the popup HTML dynamically
    const popupHTML = `
        <div class="overlay" id="overlay" onclick="closePopup()"></div>
        <div class="popup" id="popup" data-row-id="${rowId}">
            <h3>Details</h3>
            <label>Lot Number: <input type="text" id="lotNumber" disabled value="${details.lotNumber || ''}"></label>
            <label>Lot Portion: <input type="text" id="lotPortion" disabled value="${details.lotPortion || ''}"></label>
            <label>Section: <input type="text" id="section" disabled value="${details.section || ''}"></label>
            <label>First Name: <input type="text" id="buriedFirst" disabled value="${details.buriedFirst || ''}"></label>
            <label>Middle Name: <input type="text" id="buriedMiddle" disabled value="${details.buriedMiddle || ''}"></label>
            <label>Last Name: <input type="text" id="buriedLast" disabled value="${details.buriedLast || ''}"></label>
            <label>Organization: <input type="text" id="organization" disabled value="${details.organization || ''}"></label>
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
            <button onclick="saveChanges()">Save</button>
            <button onclick="closePopup()">Close</button>
        </div>
    `;

    // Create a container div and insert the popup HTML
    const popupContainer = document.createElement("div");
    popupContainer.id = "popupContainer";
    popupContainer.innerHTML = popupHTML;
    document.body.appendChild(popupContainer);
    console.log(popupContainer)
}
function enableEditing() {
    document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = false);
}
function saveChanges() {
    document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = true);
    const rowId = popup.getAttribute("data-row-id"); // Get stored rowId
    if (ownerResults[rowId]){
        ownerResults[rowId].lotNumber = document.getElementById("lotNumber").value;
        ownerResults[rowId].lotPortion = document.getElementById("lotPortion").value;
        ownerResults[rowId].section = document.getElementById("section").value;
        ownerResults[rowId].buriedFirst = document.getElementById("buriedFirst").value;
        ownerResults[rowId].buriedMiddle = document.getElementById("buriedMiddle").value;
        ownerResults[rowId].buriedLast = document.getElementById("buriedLast").value;
        ownerResults[rowId].dob = document.getElementById("dob").value;
        ownerResults[rowId].dod = document.getElementById("dod").value;
        ownerResults[rowId].vessel = document.getElementById("vessel").value;
        ownerResults[rowId].owns = document.getElementById("owns").checked;
    }
    populateTable(ownerResults);    
}
function filterTable() {
    let searchFirst = document.getElementById("searchFirst").value.toLowerCase();
    let searchMiddle = document.getElementById("searchMiddle").value.toLowerCase();
    let searchLast = document.getElementById("searchLast").value.toLowerCase();
    let rows = document.querySelectorAll("#tableBody tr");
    rows.forEach(row => {
        let first = row.cells[0].innerText.toLowerCase();
        let middle = row.cells[1].innerText.toLowerCase();
        let last = row.cells[2].innerText.toLowerCase();
        row.style.display = (first.includes(searchFirst) && middle.includes(searchMiddle) && last.includes(searchLast)) ? "" : "none";
    });
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
        lotPortion: lotPortion,
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

    console.log(data);
    
    // Clear the form fields
    document.getElementById('newEntryForm').reset();

    toggleForm(); // Hide the form after submission
});

function deleteEntry(id) {
    ownerResults[id] = null;
    populateTable(ownerResults);
}