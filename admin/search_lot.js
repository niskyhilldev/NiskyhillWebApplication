function performLotSearch() {
    let section = document.getElementById("searchSection").value.trim().toLowerCase();
    let lot = document.getElementById("searchLot").value.trim().toLowerCase();

    // let results = Object.values(data).filter(entry => {
    //     if (section && lot && entry.section && entry.section.toLowerCase() === section && entry.lotNumber && entry.lotNumber.toLowerCase() === lot) {
    //         return true;
    //     }
    //     if (section && lot && entry.sectionOwn && entry.sectionOwn.toLowerCase() === section && entry.lotOwnNumber && entry.lotOwnNumber.toLowerCase() === lot) {
    //         return true;
    //     }
    //     return false;
    // });

    let results = [];

    if (results.length > 0) {
        console.log("Search Results:", results);
    } else {
        console.log("No matching results found.");
    }
    lotResults = results;
    populateTable(results);
}

function createPopup(details){
    let popupHTML = '';
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
    const popupContainer = document.createElement("div");
    popupContainer.id = "popupContainer";
    popupContainer.innerHTML = popupHTML;
    document.body.appendChild(popupContainer);
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    if (popupContainer) {
        popupContainer.remove();
    }
}

function enableEditing() {
    document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = false);
}
function saveChanges(type) {
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
    populateTable(lotResults); 
        
}
function populateTable(filteredData){
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

function saveChanges(){
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
function enableEditing() {
    document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = false);
}