const data = {
    "0": { lotNumber: "123", lotPortion: "A", section: "1", buriedFirst: "John", buriedMiddle: "Michael", buriedLast: "Doe", dob: "1990-01-01", dod: "2020-06-15", vessel: "casket", owns: true },
    "1": { lotNumber: "456", lotPortion: "B", section: "2", buriedFirst: "Jane", buriedMiddle: "Elizabeth", buriedLast: "Smith", dob: "1985-02-10", dod: "2019-08-21", vessel: "urn", owns: false }
};
let currentRow;

function viewMore(firstname, middleName, lastName, row) {
    const details = data[row];
    currentRow = document.getElementById(row);
    console.log(currentRow);
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