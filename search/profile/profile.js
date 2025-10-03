document.addEventListener('DOMContentLoaded', () => {
  // ====== URL params / API base ======
  const searchParams = new URLSearchParams(window.location.search);
  const userID = searchParams.get("id");          // /profile.html?id=123
  const qParam = searchParams.get("q");           // optional: /profile.html?q=Section I Plot 12
  const latParam = parseFloat(searchParams.get("lat"));
  const lngParam = parseFloat(searchParams.get("lng"));
  const API_BASE_URL = 'http://localhost:8080/residents/find';

  // ====== MAP SETUP (same CRS + overlay as your map page) ======
  // Make sure profile.html has: <div id="profile-map"></div>
  let map;
  let graveMarkers = {};

  function initMap() {
    const mapEl = document.getElementById('profile-map');
    if (!mapEl) return; // allow page to work without map div

    map = L.map('profile-map', { crs: L.CRS.Simple, minZoom: -2, zoomSnap: 0.5 });

    // Keep these in sync with your map layout
    const bounds = [[0, 0], [1000, 2000]];
    // TODO: adjust overlay path relative to profile.html location
    L.imageOverlay('map-1.png', bounds).addTo(map); 
    map.fitBounds(bounds);
    map.setView([300, 1000], map.getZoom() + 2);

    // handle size after layout
    function fixMapSizeSoon(){ setTimeout(() => map.invalidateSize(), 200); }
    map.whenReady(fixMapSizeSoon);
    window.addEventListener('resize', fixMapSizeSoon);

    // If you load a shared dataset file, define it as window.graveLocations = { ... }
    // Otherwise, this tiny example keeps the code robust.
    window.graveLocations = window.graveLocations || {
      "Section I Plot 12": { coords: [332, 846], name: "Section I Plot 12", dates: "Section I", section: "I" }
      // Add more or include a shared grave-data.js file instead
    };

    // Prepare markers
    graveMarkers = {};
    Object.keys(window.graveLocations).forEach(k => {
      const d = window.graveLocations[k];
      graveMarkers[k] = L.marker(d.coords).bindPopup(
        `<b>${d.name}</b>${d.dates ? `<br>${d.dates}` : ''}`
      );
    });
  }

  // Focus a marker by key (name in graveLocations)
  function focusTargetByKey(key){
    if (!map) return false;
    const d = window.graveLocations && window.graveLocations[key];
    if (!d) return false;

    // remove any existing markers so the highlight stands out
    Object.values(graveMarkers).forEach(m => { try { map.removeLayer(m); } catch(_){} });

    graveMarkers[key].addTo(map);
    map.setView(d.coords, map.getZoom());
    graveMarkers[key].openPopup();
    return true;
  }

  // Focus from URL (q or lat/lng) or from DOM fields (Section + Lot)
  function focusFromContext() {
    if (!map) return;

    // 1) explicit query key
    if (qParam && focusTargetByKey(qParam)) return;

    // 2) explicit coordinates
    if (!Number.isNaN(latParam) && !Number.isNaN(lngParam)) {
      L.marker([latParam, lngParam]).addTo(map).bindPopup('Selected location').openPopup();
      map.setView([latParam, lngParam], map.getZoom());
      return;
    }

    // 3) Section + Lot -> "Section X Plot Y"
    const section = (document.getElementById('section')?.textContent || '').trim();
    const lot     = (document.getElementById('lot')?.textContent || '').trim();
    if (section && lot) {
      const key = `Section ${section} Plot ${lot}`;
      if (focusTargetByKey(key)) return;
    }

    // fallback: keep full view
  }

  // ====== DATA FETCH ======
  fetchResident();

  async function fetchResident() {
    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(userID || '')}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Resident with ID ${userID} not found`);
        } else if (response.status === 400) {
          throw new Error('Invalid Resident ID format');
        } else if (response.status === 500) {
          throw new Error('Server error occurred');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      const resident = await response.json();
      displayResident(resident);
    } catch (err) {
      console.log('Error fetching resident:', err);
      // Still initialize map so the page doesn’t look broken
      initMap();
      // Try focusing from URL if provided
      setTimeout(focusFromContext, 150);
    }
  }

  function displayResident(resident){
    const name = [resident.firstName, resident.middleName, resident.lastName]
                  .filter(Boolean).join(' ');
    const formattedDate = formatDate(resident.burialDate);

    // Defensive optional chaining for nested lot data
    const lot = resident?.lot || {};
    const sectionName = lot?.section?.name;
    const lotNumber   = lot?.number;

    document.getElementById("name").textContent         = name || 'Not available';
    document.getElementById("burialDate").textContent   = formattedDate || 'Not available';
    document.getElementById("section").textContent      = sectionName || 'Not available';
    document.getElementById("lot").textContent          = lotNumber ?? 'Not available';
    document.getElementById("lotOwner").textContent     = lot?.owner || 'Not available';
    document.getElementById("lotDescriptor").textContent= lot?.descriptor || 'Not available';
    document.getElementById("residentID").textContent   = resident?.rid || 'Not available';

    // Init map (once DOM has content) and focus based on context
    initMap();
    // Give the browser a tick to paint the map box and then zoom/focus
    setTimeout(focusFromContext, 150);
  }

  // Helper: format date nicely
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      // Guard against invalid date
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }
});
