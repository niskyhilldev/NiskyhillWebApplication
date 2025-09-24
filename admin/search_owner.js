function populateTable(filteredData){
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

function createPopup(details, rowId){
    let popupHTML = `
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

    const popupContainer = document.createElement("div");
    popupContainer.id = "popupContainer";
    popupContainer.innerHTML = popupHTML;
    document.body.appendChild(popupContainer);
}

function performOwnerSearch() {
    let lastName = document.getElementById("searchName").value.trim().toLowerCase();
    const data = [];
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