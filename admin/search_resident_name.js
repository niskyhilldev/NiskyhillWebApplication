function performResidentSearch() {
    let lastName = document.getElementById("searchResidentLast").value.trim().toLowerCase();
    const data = [];
    let results = Object.values(data).filter(entry => {
        if (lastName && entry.buriedLast && entry.buriedLast.toLowerCase() === lastName && entry.dod) {
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

function populateTable(filteredData){
    const tableBody = document.getElementById("residentTableBody");
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
                <button onclick="viewMore('${entry.buriedFirst || ""}', '${entry.buriedMiddle || ""}', '${entry.buriedLast || ""}', '${index}', 'resident')">View More</button>
                <button onclick="deleteEntry('${index}', 'residents')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    if (popupContainer) {
        popupContainer.remove();
    }
}

function createPopup(details, rowId){
    closePopup();
    let popupHTML;
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

    // Create a container div and insert the popup HTML
    const popupContainer = document.createElement("div");
    popupContainer.id = "popupContainer";
    popupContainer.innerHTML = popupHTML;
    document.body.appendChild(popupContainer);
}

function enableEditing() {
    document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = false);
}