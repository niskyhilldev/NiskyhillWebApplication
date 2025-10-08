document.addEventListener('DOMContentLoaded', () => {
  // ===== URL params / API base =====
  const searchParams = new URLSearchParams(window.location.search);
  const userID  = searchParams.get("id");
  const qParam  = searchParams.get("q");
  const latParam = parseFloat(searchParams.get("lat"));
  const lngParam = parseFloat(searchParams.get("lng"));
  const API_BASE_URL = 'http://localhost:8080/residents/find';

  // ===== Map state =====
  let map;
  let graveMarkers = {};
  let sectionLayers = null;  // filled by sections.js
  let pinLayer;              // holds dynamic pins for start + plot
  let currentStartMarker = null;
  let currentPlotMarker  = null;

  // ===== Map init =====
  function initMap() {
    if (map) return; // prevent double init

    const mapEl = document.getElementById('profile-map');
    if (!mapEl) return;

    map = L.map('profile-map', { crs: L.CRS.Simple, minZoom: -2, zoomSnap: 0.5 });

    const bounds = [[0, 0], [1000, 2000]];
    L.imageOverlay('map-1.png', bounds).addTo(map); // PNG lives next to profile.html
    map.fitBounds(bounds);
    map.setView([300, 1000], map.getZoom() + 2);

    function fixMapSizeSoon(){ setTimeout(() => map.invalidateSize(), 200); }
    map.whenReady(fixMapSizeSoon);
    window.addEventListener('resize', fixMapSizeSoon);

 
    // Build section layer catalog from sections.js
    if (window.NiskySections) {
      sectionLayers = window.NiskySections(); // { 'I': {route, outline}, ... }
    }

    // Optional inline dataset for quick manual checks
    window.graveLocations = window.graveLocations || {
      "Section I Plot 12": { coords: [332, 846], name: "Section I Plot 12", dates: "Section I", section: "I" }
    };

    // Prebuild dataset markers
    graveMarkers = {};
    Object.keys(window.graveLocations).forEach(k => {
      const d = window.graveLocations[k];
      const marker = L.marker(d.coords).bindPopup(`<b>${d.name || k}</b>${d.dates ? `<br>${d.dates}` : ''}`);
      graveMarkers[k] = marker;
      if (d.name && d.name !== k) graveMarkers[d.name] = marker;
    });
  }

  // ===== Utils =====
  function normalizeSection(raw) {
    if (!raw) return '';
    let s = String(raw).trim();
    s = s.replace(/^section\s+/i, ''); // drop leading "Section "
    s = s.replace(/[\s-]+/g, '');      // remove spaces/hyphens
    return s.toUpperCase();            // I, A1, 4, K, ...
  }

  function clearAllSectionLayers() {
    if (!map || !sectionLayers) return;
    Object.values(sectionLayers).forEach(({route, outline}) => {
      try { if (route)   map.removeLayer(route); }   catch(e){}
      try { if (outline) map.removeLayer(outline); } catch(e){}
    });
  }

  // Find a good "start" point for a section’s route
  function getRouteStartLatLng(code) {
    if (!sectionLayers) return null;
    const entry = sectionLayers[code];
    if (!entry || !entry.route || !entry.route.getLatLngs) return null;

    let pts = entry.route.getLatLngs();
    if (Array.isArray(pts) && Array.isArray(pts[0]) && pts[0].lat === undefined) {
      pts = pts[0]; // handle multi-rings
    }
    const first = Array.isArray(pts) ? pts[0] : null;
    if (!first) return null;
    return [first.lat, first.lng];
  }

 

  function showPlotMarker(coords, labelHtml) {
  if (!map || !coords) return;
  
  // Remove old plot marker if it exists
  if (currentPlotMarker) {
    try { map.removeLayer(currentPlotMarker); } catch(e){}
  }
  
  // Simple Leaflet syntax: create marker, add to map, bind popup
  currentPlotMarker = L.marker(coords).addTo(map).bindPopup(labelHtml || 'Plot');
  currentPlotMarker.openPopup();
}
  function highlightSection(code) {
    if (!map || !sectionLayers || !code) return;
    clearAllSectionLayers();
    const entry = sectionLayers[code];
    if (!entry) return;

    if (entry.route)   entry.route.addTo(map);
    if (entry.outline) entry.outline.addTo(map);


    // Optional fade-in if you added CSS for .fade-in
    const rEl = entry.route?.getElement?.();   if (rEl) rEl.classList.add('fade-in');
    const oEl = entry.outline?.getElement?.(); if (oEl) oEl.classList.add('fade-in');
  }

  function parseSectionFromKey(key) {
    if (!key) return '';
    const m = key.match(/section\s+([A-Za-z0-9\s-]+)/i);
    if (!m) return '';
    return normalizeSection(m[1]);
  }

  // Read plot coords from resident payload (supports camelCase or snake_case)
// Read plot coords from resident payload (supports camelCase or snake_case)
//for exampel john hein is "mapXCord":399,"mapYCord":895," and id 2685
function extractPlotCoords(resident) {
  const lot = resident?.lot;
  if (!lot) return null;

  // Simple check for mapXCord and mapYCord
  if (lot.mapXCord != null && lot.mapYCord != null) {
    return [lot.mapYCord, lot.mapXCord]; // [lat(y), lng(x)]
  }

  return null;
}

  // Case-insensitive lookup into the inline dataset; adds plot pin, keeps start pin
  function focusTargetByKey(key){
    if (!map) return false;
    const dict = window.graveLocations || {};
    let actualKey = key;
    let d = dict[actualKey];

    if (!d) {
      const lower = key.toLowerCase();
      const matchKey = Object.keys(dict).find(k => k.toLowerCase() === lower);
      if (matchKey) { actualKey = matchKey; d = dict[matchKey]; }
    }
    if (!d) return false;

    const label = `<b>${d.name || actualKey}</b>${d.dates ? `<br>${d.dates}` : ''}`;
    showPlotMarker(d.coords, label);
    map.setView(d.coords, map.getZoom());

    const code = d.section ? normalizeSection(d.section) : parseSectionFromKey(actualKey);
    if (code) highlightSection(code);
    return true;
  }



  function focusFromContext() {
    if (!map) return;

    // ?q=Section I Plot 12
    if (qParam) {
      const maybeSection = parseSectionFromKey(qParam);
      if (maybeSection) highlightSection(maybeSection);
      if (focusTargetByKey(qParam)) return;
    }

    // ?lat=...&lng=...
    if (!Number.isNaN(latParam) && !Number.isNaN(lngParam)) {
      showPlotMarker([latParam, lngParam], 'Selected location');
      map.setView([latParam, lngParam], map.getZoom());
      return;
    }

    // DOM fields: Section + Lot
    const sectionTxt = (document.getElementById('section')?.textContent || '').trim();
    const lotTxt     = (document.getElementById('lot')?.textContent || '').trim();
    const norm = normalizeSection(sectionTxt);
    if (norm) highlightSection(norm);

    if (norm && lotTxt) {
      const key = `Section ${norm} Plot ${lotTxt}`;
      if (focusTargetByKey(key)) return;
    }
  }

  // ===== Data fetch and render =====
  if (!userID) {
    // No id: just init the map and try to focus from URL/DOM context
    initMap();
    setTimeout(focusFromContext, 150);
  } else {
    fetchResident();
  }

  async function fetchResident() {
    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(userID || '')}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error(`Resident with ID ${userID} not found`);
        if (response.status === 400) throw new Error('Invalid Resident ID format');
        if (response.status === 500) throw new Error('Server error occurred');
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const resident = await response.json();
      displayResident(resident);
    } catch (err) {
      console.log('Error fetching resident:', err);
      initMap();
      setTimeout(focusFromContext, 150);
    }
  }

  function displayResident(resident){
    const name = [resident.firstName, resident.middleName, resident.lastName].filter(Boolean).join(' ');
    const formattedDate = formatDate(resident.burialDate);

    const lot = resident?.lot || {};
    const sectionName = lot?.section?.name;
    const lotNumber   = lot?.number;

    document.getElementById("name").textContent          = name || 'Not available';
    document.getElementById("burialDate").textContent    = formattedDate || 'Not available';
    document.getElementById("section").textContent       = sectionName || 'Not available';
    document.getElementById("lot").textContent           = (lotNumber ?? 'Not available');
    document.getElementById("lotOwner").textContent      = lot?.owner || 'Not available';
    document.getElementById("lotDescriptor").textContent = lot?.descriptor || 'Not available';
    document.getElementById("residentID").textContent    = resident?.rid || 'Not available';

    initMap();
    setTimeout(() => {
      // 1) Highlight section (adds start pin)
      if (sectionName) highlightSection(normalizeSection(sectionName));

      // 2) Exact plot from backend coords
      const plotCoords = extractPlotCoords(resident);
      console.log('Extracted plot coords:', plotCoords); // Debug line
      if (plotCoords) {
        const label = `<b>${name || 'Plot'}</b>${formattedDate ? `<br>${formattedDate}` : ''}`;
        showPlotMarker(plotCoords, label);
        map.setView(plotCoords, map.getZoom());
        return; // Done: we have precise coords
      }

      // 3) Fallback: try inline dataset key
      if (sectionName && lotNumber != null) {
        const key = `Section ${normalizeSection(sectionName)} Plot ${lotNumber}`;
        if (!focusTargetByKey(key)) {
          // 4) Last resort: drop pin at section center
          const code = normalizeSection(sectionName);
          const center = sectionLayers?.[code]?.outline?.getBounds?.().getCenter?.();
          if (center) showPlotMarker([center.lat, center.lng], `Section ${code} (center)`);
        }
      } else {
        // Or rely on URL/DOM context
        focusFromContext();
      }
    }, 150);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  }
});
