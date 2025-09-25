document.getElementById('newLotForm').addEventListener('submit', function(event) {
    event.preventDefault();


    // Get all the values from the form
    const lotNumber = document.getElementById('addLotNumber').value;
    const lotPortion = document.getElementById('addLotPortion').value;
    const section = document.getElementById('sectionId').value;
    const ownerFirst = document.getElementById('ownerFirst').value;
    const ownerMiddle = document.getElementById('ownerMiddle').value;
    const ownerLast = document.getElementById('ownerLast').value;
    
    // Add new entry to the data object
    // plotsData[newId] = {
    //     lotNumber: lotNumber,
    //     lotPartition: lotPortion,
    //     section: section,
    //     owner: `${ownerFirst || ""} ${ownerMiddle || ""} ${ownerLast || ""}`,
    //     internmentRecord: record,
    // };

    
    // Clear the form fields
    document.getElementById('newLotForm').reset();
});