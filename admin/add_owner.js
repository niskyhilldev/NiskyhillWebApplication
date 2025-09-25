document.getElementById('newOwnerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    

    // Get all the values from the form
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const lotNumber = document.getElementById('lotNum').value;
    const lotPortion = document.getElementById('portion').value;
    const section = document.getElementById('cemSection').value;
    // const notes = document.getElementById('note').files[0] ? document.getElementById('note').files[0].name : '';
    const organization = document.getElementById('organization').value;
    
    // Add new entry to the data object
    // data[newId] = {
    //     lotOwnNumber: lotNumber,
    //     lotOwnId: lotPortion,
    //     sectionOwn: section,
    //     buriedFirst: firstName,
    //     buriedMiddle: middleName,
    //     buriedLast: lastName,
    //     owns: true,
    //     notes: notes,
    //     organization: organization
    // };

    
    // Clear the form fields
    document.getElementById('newOwnerForm').reset();
});