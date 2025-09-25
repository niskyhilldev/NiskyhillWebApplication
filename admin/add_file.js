function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const downloadLink = document.getElementById("downloadLink");
        downloadLink.href = URL.createObjectURL(file);
        downloadLink.textContent = file.name;
        downloadLink.style.display = "block";
    }
}


document.getElementById('newFileForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // // Generate a new unique ID based on the highest existing key in data
    // const newId = Object.keys(plotsData).length > 0 
    //     ? Math.max(...Object.keys(plotsData).map(Number)) + 1 
    //     : 0;

    // // Get all the values from the form
    const section = document.getElementById('fileSectionId').value;
    const lot = document.getElementById('fileLotId').value;
    const partition = document.getElementById('filePartition').value;
    const record = document.getElementById('newFile').files[0];
    
    // // Add new entry to the data object
    // sections[newId] = {
    //     section: section,
    //     internmentRecord: record,
    // };

    
    // Clear the form fields
    document.getElementById('newFileForm').reset();
});