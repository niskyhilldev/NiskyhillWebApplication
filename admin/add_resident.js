document.getElementById('newResidentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get all the values from the form
    const firstName = document.getElementById('fName').value;
    const middleName = document.getElementById('mName').value;
    const lastName = document.getElementById('lName').value;
    const lotNumber = document.getElementById('resLotNum').value;
    const lotPortion = document.getElementById('resPortion').value;
    const section = document.getElementById('resCemSection').value;
    // const notes = document.getElementById('resNote').files[0] ? document.getElementById('note').files[0].name : '';
    const dob = document.getElementById('dofb').value;
    const dod = document.getElementById('dofd').value;
    const vessel = document.getElementById('vesselType').value;
    const valid = document.getElementById('valid').checked;
    
    // Add new entry to the data object
    // data[newId] = {
    //     lotNumber: lotNumber,
    //     lotId: lotPortion,
    //     section: section,
    //     buriedFirst: firstName,
    //     buriedMiddle: middleName,
    //     buriedLast: lastName,
    //     dob: dob,
    //     dod: dod,
    //     vessel: vessel,
    //     valid: valid,
    //     owns: false,
    //     // notes: notes,
    //     organization: organization
    // };

    
    // Clear the form fields
    document.getElementById('newResidentForm').reset();

});