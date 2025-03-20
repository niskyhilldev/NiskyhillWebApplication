const data = {
    "0": { lotNumber: "123", lotPortion: "A", section: "1", buriedFirst: "John", buriedMiddle: "Michael", buriedLast: "Doe", dob: "1990-01-01", dod: "2020-06-15", vessel: "casket", owns: true },
    "1": { lotNumber: "456", lotPortion: "B", section: "2", buriedFirst: "Jane", buriedMiddle: "Elizabeth", buriedLast: "Smith", dob: "1985-02-10", dod: "2019-08-21", vessel: "urn", owns: false }
};
let currentRow;

function viewMore(firstname, middleName, lastName, row) {
    const details = data[row];
    console.log(details);
    currentRow = document.getElementById(row);
    if (details) {
        document.getElementById("lotNumber").value = details.lotNumber;
        document.getElementById("lotPortion").value = details.lotPortion;
        document.getElementById("section").value = details.section;
        document.getElementById("buriedFirst").value = details.buriedFirst;
        document.getElementById("buriedMiddle").value = details.buriedMiddle;
        document.getElementById("buriedLast").value = details.buriedLast;
        document.getElementById("dob").value = details.dob;
        document.getElementById("dod").value = details.dod;
        document.getElementById("vessel").value = details.vessel;
        document.getElementById("owns").checked = details.owns;
    }
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}
function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
function enableEditing() {
    document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = false);
}
function saveChanges() {
    document.querySelectorAll(".popup input, .popup select").forEach(field => field.disabled = true);
    if (currentRow) {
        currentRow.querySelector(".first-name").textContent = document.getElementById("buriedFirst").value;
        currentRow.querySelector(".middle-name").textContent = document.getElementById("buriedMiddle").value;
        currentRow.querySelector(".last-name").textContent = document.getElementById("buriedLast").value;
    }
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
document.getElementById("searchFirst").addEventListener("input", filterTable);
document.getElementById("searchMiddle").addEventListener("input", filterTable);
document.getElementById("searchLast").addEventListener("input", filterTable);

function toggleForm() {
    const form = document.getElementById('addEntryForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

document.getElementById('newEntryForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get all the values from the form
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const lotNumber = document.getElementById('lotNum').value;
    const lotPortion = document.getElementById('portion').value;
    const section = document.getElementById('cemSection').value;
    const buriedFirst = document.getElementById('buriedFirst').value;
    const buriedMiddle = document.getElementById('buriedMiddle').value;
    const buriedLast = document.getElementById('buriedLast').value;
    const dob = document.getElementById('dofb').value;
    const dod = document.getElementById('dofd').value;
    const vessel = document.getElementById('vesselType').value;
    const owns = document.getElementById('owner').checked;
    const notes = document.getElementById('note').files[0] ? document.getElementById('note').files[0].name : '';
    
    // Create the new row with all the details
    const tableBody = document.getElementById('tableBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td class="first-name">${firstName}</td>
        <td class="middle-name">${middleName}</td>
        <td class="last-name">${lastName}</td>
        <td><button onclick="viewMore('${firstName}', '${middleName}', '${lastName}', '${tableBody.rows.length}')">View More</button></td>
    `;
    tableBody.appendChild(newRow);
    data[tableBody.rows.length-1] = {
        lotNumber: document.getElementById('lotNumber').value,
        lotPortion: document.getElementById('lotPortion').value,
        section: document.getElementById('section').value,
        buriedFirst: document.getElementById('buriedFirst').value,
        buriedMiddle: document.getElementById('buriedMiddle').value,
        buriedLast: document.getElementById('buriedLast').value,
        dob: document.getElementById('dob').value,
        dod: document.getElementById('dod').value,
        vessel: document.getElementById('vessel').value,
        owns: document.getElementById('owns').checked
    };
    
    // Clear the form fields
    document.getElementById('firstName').value = '';
    document.getElementById('middleName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('lotNum').value = '';
    document.getElementById('portion').value = '';
    document.getElementById('cemSection').value = '';
    document.getElementById('buriedFirst').value = '';
    document.getElementById('buriedMiddle').value = '';
    document.getElementById('buriedLast').value = '';
    document.getElementById('dofb').value = '';
    document.getElementById('dofd').value = '';
    document.getElementById('vesselType').value = 'urn';
    document.getElementById('owner').checked = false;
    document.getElementById('note').value = '';
    
    toggleForm(); // Hide the form after submission
});
