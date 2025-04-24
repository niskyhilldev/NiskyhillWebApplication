class NavbarElement extends HTMLElement {
    constructor() {
        super();

        // Attach a shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        const styles = document.createElement('link');
        styles.setAttribute('rel', 'stylesheet');
        styles.setAttribute('href', './admin.css');

        const extraStyles = document.createElement('link');
        extraStyles.setAttribute('rel', 'stylesheet');
        extraStyles.setAttribute('href', './form.css');

        // Add the navbar structure
        shadow.innerHTML = `
            <div class="navbar">
                <div class="dropdown">
                   <a href="dashboard.html"><button>Home</button></a>
                </div>
                <div class="dropdown">
                    <button>Owners</button>
                    <div class="dropdown-content">
                        <a href="add_owner.html">Add Owner</a>
                        <a href="search_owner.html">Search Owner</a>
                    </div>
                </div>
                <div class="dropdown">
                    <button>Residents</button>
                    <div class="dropdown-content">
                        <a href="add_resident.html">Add Resident</a>
                        <a href="search_resident_name.html">Search Resident by Name</a>
                        <a href="search_resident_lot.html">Search Resident by Lot</a>
                    </div>
                </div>
                <div class="dropdown">
                    <button>Lots</button>
                    <div class="dropdown-content">
                        <a href="add_lot.html">Add Lot</a>
                        <a href="search_lot.html">Search Lot</a>
                    </div>
                </div>
                <div class="dropdown">
                    <button>Sections</button>
                    <div class="dropdown-content">
                        <a href="add_section.html">Add Section</a>
                        <a href="edit_section.html">Edit Section</a>
                    </div>
                </div>
                <div class="dropdown">
                    <button>Files</button>
                    <div class="dropdown-content">
                        <a href="add_file.html">Add File</a>
                        <a href="view_files_lot.html">View Files for Lot</a>
                    </div>
                </div>
            </div>
        `;

        shadow.appendChild(styles);
        shadow.appendChild(extraStyles);
    }
}
customElements.define('custom-navbar', NavbarElement);
