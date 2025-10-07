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
  let sectionLayers = null; // filled by sections.js
  let pinLayer;                 // holds dynamic pins for start + plot
  let currentStartMarker = null;
  let currentPlotMarker  = null;

  // ===== Map init =====
  function initMap() {
    if (map) return; // prevent double init

    const mapEl = document.getElementById('profile-map');
    if (!mapEl) return;

    map = L.map('profile-map', { crs: L.CRS.Simple, minZoom: -2, zoomSnap: 0.5 });

    const bounds = [[0, 0], [1000, 2000]];
    L.imageOverlay('map-1.png', bounds).addTo(map);   // png is in same folder as profile.html
    map.fitBounds(bounds);
    map.setView([300, 1000], map.getZoom() + 2);

    function fixMapSizeSoon(){ setTimeout(() => map.invalidateSize(), 200); }
    map.whenReady(fixMapSizeSoon);
    window.addEventListener('resize', fixMapSizeSoon);

    // OPTIONAL: click-to-capture coords when mapping new plots
    // map.on('click', (e) => {
    //   const { lat, lng } = e.latlng;
    //   console.log(`Clicked coords: [${lat.toFixed(0)}, ${lng.toFixed(0)}]`);
    // });

    // layer to manage our pins (start + plot) together
    pinLayer = L.layerGroup().addTo(map);

    // OPTIONAL: permanent site entrance marker
    // L.marker([478, 882]).addTo(map).bindPopup("Main Entrance");

    // Build section layer catalog from sections.js
    if (window.NiskySections) {
      sectionLayers = window.NiskySections(); // { 'I': {route, outline}, ... }
    }

    // Optional inline dataset (use grave-data.js for full set)
    window.graveLocations = window.graveLocations || {
      "Section I Plot 12": { coords: [332, 846], name: "Section I Plot 12", dates: "Section I", section: "I" }
    };

    // Prepare reusable markers (key by both the exact key and the display name, if different)
    graveMarkers = {};
    Object.keys(window.graveLocations).forEach(k => {
      const d = window.graveLocations[k];
      const marker = L.marker(d.coords).bindPopup(`<b>${d.name || k}</b>${d.dates ? `<br>${d.dates}` : ''}`);
      graveMarkers[k] = marker;
      if (d.name && d.name !== k) {
        graveMarkers[d.name] = marker; // second handle for lookup
      }
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

  function getRouteStartLatLng(code) {
    if (!sectionLayers) return null;
    const entry = sectionLayers[code];
    if (!entry || !entry.route || !entry.route.getLatLngs) return null;

    let pts = entry.route.getLatLngs();
    // If polyline has multiple rings (unlikely here), use the first
    if (Array.isArray(pts) && Array.isArray(pts[0]) && pts[0].lat === undefined) {
      pts = pts[0];
    }
    const first = Array.isArray(pts) ? pts[0] : null;
    if (!first) return null;
    return [first.lat, first.lng];
  }

  function showStartMarker(code) {
    if (!pinLayer) return;
    let startLL = getRouteStartLatLng(code);

    // fallback: NW corner of outline if route missing
    if (!startLL && sectionLayers?.[code]?.outline?.getBounds) {
      const nw = sectionLayers[code].outline.getBounds().getNorthWest();
      startLL = [nw.lat, nw.lng];
    }
    if (!startLL) return;

    if (currentStartMarker) {
      try { pinLayer.removeLayer(currentStartMarker); } catch(e){}
    }
    currentStartMarker = L.marker(startLL).bindPopup(`Start of Section ${code}`);
    pinLayer.addLayer(currentStartMarker);
  }

  function showPlotMarker(coords, labelHtml) {
    if (!pinLayer || !coords) return;
    if (currentPlotMarker) {
      try { pinLayer.removeLayer(currentPlotMarker); } catch(e){}
    }
    currentPlotMarker = L.marker(coords).bindPopup(labelHtml || 'Plot');
    pinLayer.addLayer(currentPlotMarker);
    currentPlotMarker.openPopup();
  }

  function highlightSection(code) {
    if (!map || !sectionLayers || !code) return;
    clearAllSectionLayers();
    const entry = sectionLayers[code];
    if (!entry) return;

    if (entry.route)   entry.route.addTo(map);
    if (entry.outline) entry.outline.addTo(map);

    // NEW: add a start/entrance pin for this section
    showStartMarker(code);

    // Optional fade-in (if you added the CSS)
    const rEl = entry.route?.getElement?.();   if (rEl) rEl.classList.add('fade-in');
    const oEl = entry.outline?.getElement?.(); if (oEl) oEl.classList.add('fade-in');
  }

  function parseSectionFromKey(key) {
    if (!key) return '';
    // Handles "Section I Plot 12", "Section A 1 Plot 7", etc.
    const m = key.match(/section\s+([A-Za-z0-9\s-]+)/i);
    if (!m) return '';
    return normalizeSection(m[1]);
  }

  // Case-insensitive plot focus; adds plot pin (keeps start pin)
  function focusTargetByKey(key){
    if (!map) return false;
    const dict = window.graveLocations || {};
    let actualKey = key;
    let d = dict[actualKey];

    if (!d) {
      const lower = key.toLowerCase();
      const matchKey = Object.keys(dict).find(k => k.toLowerCase() === lower);
      if (matchKey) {
        actualKey = matchKey;
        d = dict[matchKey];
      }
    }
    if (!d) return false;

    const label = `<b>${d.name || actualKey}</b>${d.dates ? `<br>${d.dates}` : ''}`;

    // Drop/replace the plot pin only (leave the start pin intact)
    showPlotMarker(d.coords, label);

    // Center map on the plot
    map.setView(d.coords, map.getZoom());

    // Highlight the section too
    const code = d.section ? normalizeSection(d.section) : parseSectionFromKey(actualKey);
    if (code) highlightSection(code);

    return true;
  }

  function focusFromContext() {
    if (!map) return;

    // 1) explicit query key (?q=Section I Plot 12)
    if (qParam) {
      const maybeSection = parseSectionFromKey(qParam);
      if (maybeSection) highlightSection(maybeSection);
      if (focusTargetByKey(qParam)) return;
    }

    // 2) explicit coordinates (?lat=...&lng=...)
    if (!Number.isNaN(latParam) && !Number.isNaN(lngParam)) {
      if (currentPlotMarker) { try { pinLayer.removeLayer(currentPlotMarker); } catch(e){} }
      currentPlotMarker = L.marker([latParam, lngParam]).bindPopup('Selected location');
      pinLayer.addLayer(currentPlotMarker);
      currentPlotMarker.openPopup();
      map.setView([latParam, lngParam], map.getZoom());
      return;
    }

    // 3) DOM fields: Section + Lot -> highlight + try plot key
    const sectionTxt = (document.getElementById('section')?.textContent || '').trim();
    const lotTxt     = (document.getElementById('lot')?.textContent || '').trim();
    const norm = normalizeSection(sectionTxt);
    if (norm) highlightSection(norm);

    if (norm && lotTxt) {
      const key = `Section ${norm} Plot ${lotTxt}`;
      if (focusTargetByKey(key)) return;
    }
  }

  // ====== DEV BLOCKS (comment/uncomment to use while testing) ======

  // --- DEV 1: Show sections without backend ---
  // if (true) { // ← set to false or comment this whole block to disable
  //   initMap(); // build the map
  //   if (window.NiskySections && !sectionLayers) sectionLayers = window.NiskySections();
  //   if (sectionLayers) {
  //     // OPTION A: draw ALL sections (routes + outlines)
  //     Object.values(sectionLayers).forEach(({ route, outline }) => {
  //       if (outline) outline.addTo(map);
  //       if (route)   route.addTo(map);
  //     });
  //
  //     // OPTION B: draw only specific sections
  //     // ['I','A1','F','4','K'].forEach(code => {
  //     //   const e = sectionLayers[code.toUpperCase()];
  //     //   if (!e) return;
  //     //   if (e.outline) e.outline.addTo(map);
  //     //   if (e.route)   e.route.addTo(map);
  //     // });
  //   }
  //   return; // skip the API while testing
  // }

  // --- DEV 2: Simulate a search result (section + plot) ---
  // if (true) { // ← set to false or comment to disable
  //   initMap(); // build the map (uses map-1.png)
  //   // Example 1: Section I, Plot 12
  //   devTestSearch('I', 12);
  //
  //   // Example 2: Section A1, Plot 7
  //   // devTestSearch('A1', 7);
  //
  //   // Example 3: Section F only (no plot in graveLocations yet)
  //   // devTestSearch('F', null);
  //
  //   return; // skip the API while testing
  // }

  function devTestSearch(sectionCode, lotNumber, fallbackCoords = null) {
    initMap();
    if (window.NiskySections && !sectionLayers) sectionLayers = window.NiskySections();

    const norm = normalizeSection(sectionCode);

    // Update the on-page fields so you can visually confirm
    if (document.getElementById('section')) document.getElementById('section').textContent = norm || '—';
    if (document.getElementById('lot'))     document.getElementById('lot').textContent     = (lotNumber ?? '—');

    // Highlight the section outline/route (places start pin too)
    highlightSection(norm);

    // Try exact plot via graveLocations
    if (lotNumber != null) {
      const key = `Section ${norm} Plot ${lotNumber}`;
      if (focusTargetByKey(key)) return; // dataset had the plot
    }

    // Otherwise drop a pin at the section center (or fallback coords)
    let coords = fallbackCoords;
    if (!coords && sectionLayers?.[norm]?.outline) {
      const center = sectionLayers[norm].outline.getBounds().getCenter();
      coords = [center.lat, center.lng];
    }
    if (!coords) coords = [300, 1000]; // last-resort center

    showPlotMarker(coords, lotNumber != null
      ? `Section ${norm} Plot ${lotNumber} (test)`
      : `Section ${norm} (test)`
    );
    map.setView(coords, map.getZoom());
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
      // Highlight section (adds start pin)
      if (sectionName) highlightSection(normalizeSection(sectionName));

      // Try to focus exact plot via dataset (adds/updates plot pin)
      if (sectionName && lotNumber != null) {
        const key = `Section ${normalizeSection(sectionName)} Plot ${lotNumber}`;
        if (!focusTargetByKey(key)) {
          // If no exact plot in dataset, we at least keep the section highlighted
        }
      } else {
        // Otherwise try context (q=..., lat/lng, etc.)
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
