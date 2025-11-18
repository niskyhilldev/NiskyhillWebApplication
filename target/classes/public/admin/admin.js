const data = {};
const plotsData = {};
let sections = [];

let currentRow;
let residentResults, lotResults, plotResults;

// const API_BASE_URL = 'https://www.niskyhill.org';
const rowsPerPage = 20;
const API_BASE_URL = 'https://www.niskyhill.org';

async function performResidentSearch() {
    //Call the api to get all the residents based off the name entered and display them
    let name = document.getElementById("searchResidentLast").value.trim().toLowerCase();
    const tableBody = document.getElementById("residentTableBody");
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">Loading...</td>
        </tr>
    `;
    try {
        const response = await fetch(`${API_BASE_URL}/residents/search?name=${name}`)
        if (!response.ok) {
                if (response.status === 404) {
                    const residents = [];
                    residentResults = residents;
                    populateTable(residents, 'residents');
                    return;
                } else if (response.status === 400) {
                    throw new Error('Invalid Resident ID format');
                } else if (response.status === 500) {
                    throw new Error('Server error occurred');
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
        }

        const residents = await response.json();
        console.log(residents);
        // statusDiv.innerHTML = '';
        //send call to display results with filtered data and name entered
        // displaySearchResults(residents, name);
        residentResults = residents;
        populateTable(residents, 'residents');
            
        //network error
        } catch (error) {
            window.alert('Search error:', error);
        }
}
async function performLotSearch() {
    //Call the api to get all the residents based off the lot/section entered and display them
    const section = document.getElementById("searchSectionRes").value.trim();
    const lot = document.getElementById("searchLotRes").value.trim();
    const tableBody = document.getElementById("resLotTableBody");
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">Loading...</td>
        </tr>
    `;
    try {
        // Build query string dynamically
        const queryParams = new URLSearchParams();
        if (section) queryParams.append("section", section);
        if (lot) queryParams.append("lot", lot);

        const response = await fetch(`${API_BASE_URL}/lots/residents/search?${queryParams.toString()}`);
    
        if (!response.ok) {
            if (response.status === 404) {
                const lots = [];
                lotsResults = lots;
                populateTable(lots, 'lots');
                return;
            } else if (response.status === 400) {
                throw new Error('Invalid search parameters');
            } else if (response.status === 500) {
                throw new Error('Server error occurred');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }

        const lots = await response.json();

        lotResults = lots;
        populateTable(lots, 'lots');

    } catch (error) {
        window.alert('Search error:', error);
    }
}
async function performLotSearch2() {
    //Call the api to get all the plots based off the name entered and display them
    const section = document.getElementById("searchSection").value.trim();
    const lot = document.getElementById("searchLotPlots").value.trim();

    const tableBody = document.getElementById("lotTableBody");
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">Loading...</td>
        </tr>
    `;

    try {
        // Build query string dynamically
        const queryParams = new URLSearchParams();
        if (section) queryParams.append("section", section);
        if (lot) queryParams.append("lot", lot);



        const response = await fetch(`${API_BASE_URL}/lots/residents/search?${queryParams.toString()}`);

        if (!response.ok) {
            if (response.status === 404) {
                // throw new Error('No lots found matching search criteria');
                populateTable([], 'plots');
                return;
            } else if (response.status === 400) {
                throw new Error('Invalid search parameters');
            } else if (response.status === 500) {
                throw new Error('Server error occurred');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }

        const lots = await response.json();

        // Example: store results and display them
        plotResults = lots;
        populateTable(lots, 'plots');

    } catch (error) {
        window.alert('Search error:', error);
    }
}
function populateTable(filteredData, type, page=1) {
    //Actually display the data passed in the corresponding table
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    let paginatedData = [];
    try{
        paginatedData = filteredData.slice(start, end);   
    }
    catch(error){
        paginatedData = filteredData;
    }
    
    if(type === 'residents'){
        const tableBody = document.getElementById("residentTableBody");
        tableBody.innerHTML = ""; // Clear previous content

        if (paginatedData.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6'>No results found</td></tr>";
            return;
        }

        paginatedData.forEach((entry, index) => {
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
        renderPagination(filteredData.length, page, document.getElementById("pagination"), filteredData, "residents");
    }
    else if(type === 'lots'){
        //residents based off lots
        const tableBody = document.getElementById("resLotTableBody");
        tableBody.innerHTML = ""; // Clear previous content

        // Flatten the data: one entry per resident
        const flattenedResidents = [];
        paginatedData.forEach(entry => {
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
        renderPagination(filteredData.length, page, document.getElementById("paginationResLots"), filteredData, "lots");

    }
    else if(type === 'plots'){
        //plots/lots
        const tableBody = document.getElementById("lotTableBody");
        tableBody.innerHTML = ""; // Clear previous content
        if (paginatedData.length === 0) {
            
            tableBody.innerHTML = "<tr><td colspan='4'>No results found</td></tr>";
            return;
        }

        paginatedData.forEach((entry, index) => {
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
        renderPagination(filteredData.length, page, document.getElementById("paginationLots"), filteredData, "plots");

    }
}
function renderPagination(totalRows, currentPage, paginationContainer, filteredData, type) {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    paginationContainer.innerHTML = "";

    // Only show pagination if more than one page
    if (totalPages <= 1) return;

    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            populateTable(filteredData, type, currentPage);;
        }
    };

    paginationContainer.appendChild(prevButton);

    //show page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;

        if (i === currentPage) {
            pageButton.classList.add("active");
            pageButton.disabled = true;
        }
        
        if (i === currentPage) pageButton.disabled = true;
        pageButton.onclick = () => {
            currentPage = i;
            populateTable(filteredData, type, currentPage);
        };
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            populateTable(filteredData, type, currentPage);
        }
    };

    paginationContainer.appendChild(nextButton);
}

async function viewMore(firstname, middleName, lastName, suffix, row, type) {
    //get all the data for a popup
    const rowId = parseInt(row, 10); // Ensure row is treated as a number
    let details; 
    id = 0;
    if(type === 'resident'){
        try {
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

            details = residents;
            id = residents.rid;
            
            //network error
        } catch (error) {
            console.error('Search error:', error);
        }
    }
    else if (type == 'plots'){
        try {            
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

            details = lots;
            id = lots.lid;
            
        //network error
        } catch (error) {
            window.alert('Search error:', error);
        }
    }
    else{
        return;
    }
    currentRow = document.getElementById(rowId);
    createPopup(details, rowId, type, id);
}
function closePopup() {
    //close out of the popup
    const popupContainer = document.getElementById("popupContainer");
    if (popupContainer) {
        popupContainer.remove();
    }
}
async function getLotInfo(section, lot, partition){
    //search for all information on a given plot (partition)
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
        window.alert('Search error:', error);
    }
}
function createPopup(details, rowId, type, id) {
    //Create the popup with the given information
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
    else if (type === 'plots') {
        popupHTML = `
        <div class="overlay" id="overlay" onclick="closePopup()"></div>
        <div class="popup" id="popup" data-row-id="${details.lid}">
            <h3>Details</h3>
            <label for="sectionNumber">Section:</label>
            <select id="sectionNumber" required disabled>
                <option value=${details.section.name || ''}>${details.section.name || ''}</option>
            </select>
            <label for="lotNumber">Lot Number:</label>
            <select id="lotNumber" required disabled>
                <option value=${details.number || ''}>${details.number || ''}</option>
            </select>
            <label>Lot Partition: <input type="text" id="lotPartition" disabled value="${details.descriptor || ''}"></label>

            <label>Owner: <input type="text" id="lotOwner" disabled value="${details.owner || ''}"></label>
            <button onclick="enableEditing()">Edit</button>
            <button onclick="saveChanges('plots')">Save</button>
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
        let url = `${API_BASE_URL}/lots/residents/search?section=${encodeURIComponent(sectionId)}`;
        fetch(url)
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
        fetch(`${API_BASE_URL}/lots/residents/search?section=${encodeURIComponent(sectionId)}&lot=${lotId}`)
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

            fetch(`${API_BASE_URL}/lots/residents/search?section=${encodeURIComponent(sectionId)}`)
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

        fetch(`${API_BASE_URL}/lots/residents/search?section=${encodeURIComponent(sectionId)}&lot=${lotId}`)
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
        const lotSelector = document.getElementById("lotNumber");
        const val = lotSelector.value;

        sections.forEach(section => {
            if(section.name !== sectionSelector.value){
                const option = document.createElement("option");
                option.value = section.name;
                option.textContent = section.name;
                sectionSelector.appendChild(option);
            }
            
        });
        let url = `${API_BASE_URL}/lots/residents/search?section=${encodeURIComponent(sectionSelector.value)}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
            data.forEach(lot => {
                const opt = document.createElement("option");
                opt.value = lot.lot.number;
                opt.textContent = lot.lot.number;
                lotSelector.appendChild(opt);
                if (lot.lot.number === val) {
                    opt.selected = true;
                }
            });
            lotSelector.disabled = false;
            // lotSelector.value = val;
            // lotSelector.textContent = val;
            })
            .catch(err => {
            console.error(err);
            lotSelector.innerHTML = '<option value="">Error loading lots</option>';
        });
    }
}
function enableEditing() {
    //enable fields in the form
    document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = false);
    const selector = document.getElementById("lotNumber");
    if (selector){
        selector.innerHTML = "";
        const loadingOption = document.createElement("option");
        loadingOption.textContent = "Loading...";
        loadingOption.disabled = true;
        loadingOption.selected = true;

        selector.appendChild(loadingOption);
    }
}
async function saveChanges(type) {
    //save changes to db and display
    if (type === 'residents'){
        document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = true);
        const rowId = popup.getAttribute("data-row-id"); // Get stored rowId
        const rid = popup.getAttribute("data-rid");
        const lotInfo = await getLotInfo(document.getElementById("sectionNumber").value, document.getElementById("lotNumber").value, document.getElementById("lotPortion").value) 
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
        if (resident.capsule === "Unknown"){
            resident.capsule = null;
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
            console.error('Put error:', error);
        }
    }
    else if (type === 'plots'){
        let oldLot = {};
        const rowId = popup.getAttribute("data-row-id"); // Get stored rowId

        try {            
            const response = await fetch(`${API_BASE_URL}/lots/find/${rowId}`)
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
            oldLot = lots;
            
        } catch (error) {
            // statusDiv.innerHTML = `Error searching: ${error.message}`;
            // resultsDiv.innerHTML = '';
            console.error('Search error:', error);
        }
        document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = true);
        const lot = {
            lid: rowId,
            number: document.getElementById('lotNumber').value,
            descriptor: document.getElementById('lotPartition').value,
            owner: document.getElementById('lotOwner').value,
            sid: getSectionId(document.getElementById('sectionNumber').value,)
        }
        const data = JSON.stringify(lot);
        try {
            const response = await fetch(`${API_BASE_URL}/lots/update`,  {
                method:'PUT',
                headers: {
                    'Content-Type': 'application/json', // Indicate that the request body contains JSON data
                },
                body: data,
            })
            if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Resident with ID ${rowId} not found`);
                    } else if (response.status === 400) {
                        throw new Error('Invalid Resident ID format');
                    } else if (response.status === 500) {
                        throw new Error('Server error occurred');
                    } else {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
            }

            const element = document.querySelectorAll(`tr[data-lid="${rowId}"]`)[0];
            element.innerHTML = `
                <td>${getSectionName(lot.sid) || ""}</td>
                <td>${lot.number || ""}</td>
                <td>${lot.descriptor || ""}</td>
                <td>
                    <button onclick="viewMore('${lot || ""}', '${lot.middleName || ""}', '${lot.lastName || ""}', '${lot.burialDate || ""}', '${lot.lid}', 'plots')">View More</button>
                    <button onclick="deleteEntry('${lot.lid}', 'plots')">Delete</button>
                </td>
            `;
            const responseData = await response.text();
        } catch (error) {
            console.error('Put error:', error);
        }
    }
}
document.getElementById('newResidentForm').addEventListener('submit', function(event) {
    //submit new resident form
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
    //submit new lot form
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
        sid: sectionId
    }



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
});
function deleteEntry(id, type) {
    //delete an entry from the db and display
    if(type === 'residents'){
        const confirmed = window.confirm("Are you sure you want to delete this resident?");
        if (!confirmed) return; // Stop execution if the user cancels
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
    else if(type === 'plots'){
        const confirmed = window.confirm("Are you sure you want to delete this lot? It will also delete all residents associated with it!");
        if (!confirmed) return; // Stop execution if the user cancels
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
function getSectionId(name){
    //get sid from section name
    for(let i = 0; i < sections.length; i++){
        if(sections[i]['name'] === name){
            return sections[i]['sid'];
        }
    }
    return null;
}
function getSectionName(id){
    //get name from sid
    for(let i = 0; i < sections.length; i++){
        if(sections[i]['sid'] === id){
            return sections[i]['name'];
        }
    }
    return null;
}

//Get sections and update dropdowns
fetch(API_BASE_URL + "/sections/all")
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then(data => {
    sections = data;
    const selectEl = document.getElementById("resCemSection");
    selectEl.innerHTML = '<option value="">Select a section</option>';
    data.forEach(section => {
      const option = document.createElement("option");
      option.value = section.name;
      option.textContent = section.name;
      selectEl.appendChild(option);
    });
    const selectEl2 = document.getElementById("sectionId");
    selectEl2.innerHTML = '<option value="">Select a section</option>';
    data.forEach(section => {
      const option = document.createElement("option");
      option.value = section.name;
      option.textContent = section.name;
      selectEl2.appendChild(option);
    });
    const selectEl3 = document.getElementById("searchSection");
    selectEl3.innerHTML = '<option value="">Select a section</option>';
    data.forEach(section => {
      const option = document.createElement("option");
      option.value = section.name;
      option.textContent = section.name;
      selectEl3.appendChild(option);
    });
    const selectEl4 = document.getElementById("searchSectionRes");
    selectEl4.innerHTML = '<option value="">Select a section</option>';
    data.forEach(section => {
      const option = document.createElement("option");
      option.value = section.name;
      option.textContent = section.name;
      selectEl4.appendChild(option);
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

  fetch(encodeURI(`${API_BASE_URL}/lots/residents/search?section=${encodeURIComponent(sectionId)}`))
    .then(res => res.json())
    .then(data => {
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

  fetch(`${API_BASE_URL}/lots/residents/search?section=${encodeURIComponent(sectionId)}&lot=${lotId}`)
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














// --------- Nav Bar and Session Tracking Logic------------------>

document.addEventListener("DOMContentLoaded", () => { 

    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileWrapper = document.getElementById('profileWrapper');
    const logoutBtn = document.getElementById('logoutBtn');
    const resetPasswordLink = document.getElementById('resetPasswordLink');
    const logoutError = document.getElementById('logoutErrorText');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userRole  = document.getElementById('userRole');


    // Track session timeout
    // checkSessionAndSetRedirect();

    // click on the Person Icon
    profileIcon.addEventListener('click', () => {
        logoutError.textContent = "";
        profileDropdown.style.display = 
        profileDropdown.style.display === 'block' ? 'none' : 'block';
        setCurrentUserInfo(userName, userEmail, userRole, logoutError)
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
        window.location.href = "/admin/update_password/updatepassword.html"; // redirect to the reset password page
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
    }
  } catch (err) {
    logoutError.textContent = "Error Logging Out";
  }
}


async function setCurrentUserInfo(userName, userEmail, userRole, logoutError){
    try {
        const response = await fetch(`${API_BASE_URL}/auth/user`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok){
            const data = await response.json();
            userName.textContent = `${data.firstName} ${data.lastName}`;
            userEmail.textContent = data.email;
            userRole.textContent = data.role;
        } else {
            logoutError.textContent = "Error Displaying User Information";
        }

    } catch (err) {
        logoutError.textContent = "Error Displaying User Information";
    }
}


/**
 * Calls /auth/user/status to get remaining token time and sets a timeout to redirect
 */
async function checkSessionAndSetRedirect() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/user/status`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            const remainingMs = data.timeRemaining;

            // If remaining time is already zero or negative, redirect immediately
            if (remainingMs <= 0) {
                window.location.href = '/login/login.html';
            } else {
                // Set timeout to redirect when token expires
                setTimeout(() => {
                    window.location.href = '/login/login.html';
                }, remainingMs);
            }
        } else {
            // API returned error (e.g., token invalid/expired)
            window.location.href = '/login/login.html';
        }
    } catch (err) {
        console.error("Error checking session status:", err);
        window.location.href = '/login/login.html';
    }
}


var lotModal = document.getElementById("addLotForm");
var lotBtn = document.getElementById("myBtn");
var lotCloseBtn = document.getElementById("closeLotFormBtn");

var residentModal = document.getElementById("addResidentForm");
var residentBtn = document.getElementById("showResidentFormBtn");
var residentBtn2 = document.getElementById("showResidentFormBtn2");
var residentCloseBtn = document.getElementById("closeResidentFormBtn");

lotBtn.onclick = function() {
  lotModal.style.display = "block";
}

lotCloseBtn.onclick = function() {
  document.getElementById('newLotForm').reset();
  lotModal.style.display = "none";
}

residentBtn.onclick = function() {
  residentModal.style.display = "block";
  residentBtn.style.display = "none";
}

residentBtn2.onclick = function() {
  residentModal.style.display = "block";
  residentBtn2.style.display = "none";
}

residentCloseBtn.onclick = function() {
  document.getElementById('newResidentForm').reset();
  residentModal.style.display = "none";
  residentBtn.style.display = "block";
  residentBtn2.style.display = "block";
}

window.onclick = function(event) {
  if (event.target == lotModal) {
    document.getElementById('newLotForm').reset();
    lotModal.style.display = "none";
  }
  if (event.target == residentModal) {
    document.getElementById('newResidentForm').reset();
    residentModal.style.display = "none";
    residentBtn.style.display = "block";
    residentBtn2.style.display = "block";
  }
}