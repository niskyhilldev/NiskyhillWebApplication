document.getElementById('newSectionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    

    // Get all the values from the form
    const section = document.getElementById('addSectionId').value;
    const record = document.getElementById('internmentRecord').files[0] ? document.getElementById('note').files[0].name : '';
    
    // Add new entry to the data object
    // sections[newId] = {
    //     section: section,
    //     internmentRecord: record,
    // };

    
    // Clear the form fields
    document.getElementById('newSectionForm').reset();
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const downloadLink = document.getElementById("downloadLink");
        downloadLink.href = URL.createObjectURL(file);
        downloadLink.textContent = file.name;
        downloadLink.style.display = "block";
    }
}