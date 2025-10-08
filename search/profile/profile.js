document.addEventListener('DOMContentLoaded', () => {
  // ===== URL params / API base =====
  const searchParams = new URLSearchParams(window.location.search);
  const userID = searchParams.get("id");
  const API_BASE_URL = 'http://localhost:8080/residents/find';

  // ===== Map state =====
  let map;
  let currentPlotMarker = null;

  // ===== Map Initialization =====
  function initMap() {
    if (map) return; // prevent reinitialization

    const mapEl = document.getElementById('profile-map');
    if (!mapEl) {
      console.error("No #profile-map element found in HTML.");
      return;
    }

    // Leaflet setup with cemetery image overlay
    map = L.map('profile-map', { 
      crs: L.CRS.Simple, 
      minZoom: -2, 
      zoomSnap: 0.5 
    });

    const bounds = [[0, 0], [1000, 2000]]; // adjust if your map is different
    L.imageOverlay('map-1.png', bounds).addTo(map);
    map.fitBounds(bounds);
    map.setView([300, 1000], map.getZoom() + 2);

    function fixMapSize() { 
      setTimeout(() => map.invalidateSize(), 300); 
    }
    map.whenReady(fixMapSize);
    window.addEventListener('resize', fixMapSize);
  }

  // ===== Fetch Resident Info =====
  async function fetchResident() {
    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(userID)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resident = await response.json();
      displayResident(resident);
    } catch (err) {
      console.error("Error fetching resident data:", err);
      initMap(); // still show map even if fetch fails
    }
  }

  // ===== Display Resident Info and Plot Marker =====
  function displayResident(resident) {
    const name = [resident.firstName, resident.middleName, resident.lastName]
      .filter(Boolean)
      .join(' ');
    const formattedDate = formatDate(resident.burialDate);

    const lot = resident?.lot || {};
    const sectionName = lot?.section?.name || "—";
    const lotNumber = lot?.number || "—";
    const lotOwner = lot?.owner || "—";
    const lotDescriptor = lot?.descriptor || "—";
    const residentID = resident?.rid || "—";

    // Update text fields in the profile
    document.getElementById("name").textContent = name || "Not available";
    document.getElementById("burialDate").textContent = formattedDate || "Not available";
    document.getElementById("section").textContent = sectionName;
    document.getElementById("lot").textContent = lotNumber;
    document.getElementById("lotOwner").textContent = lotOwner;
    document.getElementById("lotDescriptor").textContent = lotDescriptor;
    document.getElementById("residentID").textContent = residentID;

    // Initialize map if needed
    initMap();

    // ===== Get coordinates from backend =====
    const x = lot?.mapXCord ?? null;
    const y = lot?.mapYCord ?? null;
    const coords = (x != null && y != null) ? [y, x] : null; // Leaflet expects [lat(y), lng(x)]

    // ===== Drop a marker if coords exist =====
    if (coords) {
      if (currentPlotMarker) map.removeLayer(currentPlotMarker);
      currentPlotMarker = L.marker(coords)
        .addTo(map)
        .bindPopup(`
          <b>${name}</b><br>
          Section ${sectionName}, Plot ${lotNumber}<br>
          Owner: ${lotOwner}
        `)
        .openPopup();
      map.setView(coords, map.getZoom());
    } else {
      console.warn("No coordinates found for this resident.");
      map.setView([300, 1000], map.getZoom());
    }
  }

  // ===== Helper: Format Burial Date =====
  function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime())
        ? dateStr
        : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    } catch {
      return dateStr;
    }
  }

  // ===== Start Execution =====
  if (userID) {
    fetchResident();
  } else {
    console.warn("No resident ID found in URL.");
    initMap();
  }
});
