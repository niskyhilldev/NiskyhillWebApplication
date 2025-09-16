document.addEventListener('DOMContentLoaded', () => {
    let searchParams = new URLSearchParams(window.location.search);
    let userID = searchParams.get("id")  //search the URL for the team ID

    document.getElementById("userID").innerHTML = userID

});
