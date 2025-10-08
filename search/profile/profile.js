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
  let sectionLayers = null;
  let pinLayer;
  let currentStartMarker = null;
  let currentPlotMarker  = null;

  // ===== Map init =====
  function initMap() {
    if (map) return;

    const mapEl = document.getElementById('profile-map');
    if (!mapEl) return;

    map = L.map('profile-map', { crs: L.CRS.Simple, minZoom: -2, zoomSnap: 0.5 });

    const bounds = [[0, 0], [1000, 2000]];
    L.imageOverlay('map-1.png', bounds).addTo(map);
    map.fitBounds(bounds);
    map.setView([300, 1000], map.getZoom() + 2);

    function fixMapSizeSoon(){ setTimeout(() => map.invalidateSize(), 200); }
    map.whenReady(fixMapSizeSoon);
    window.addEventListener('resize', fixMapSizeSoon);

    pinLayer = L.layerGroup().addTo(map);

    if (window.NiskySections) {
      sectionLayers = window.NiskySections();
    }

    window.graveLocations = window.graveLocations || {
      "Section I Plot 12": { coords: [332, 846], name: "Section I Plot 12", dates: "Section I", section: "I" }
    };

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
    s = s.replace(/^section\s+/i, '');
    s = s.replace(/[\s-]+/g, '');
    return s.toUpperCase();
  }

  function clearAllSectionLayers() {
    if (!map || !sectionLayers) return;
    Object.values(sectionLayers).forEach(({route, outline}) => {
      try { if (route) map.removeLayer(route); } catch(e){}
      try { if (outline) map.removeLayer(outline); } catch(e){}
    });
  }

  function showStartMarker(code) {
    if (!pinLayer) return;
    const entry = sectionLayers?.[code];
    if (!entry) return;

    const bounds = entry.outline?.getBounds?.();
    if (!bounds) return;

    const startLL = bounds.getNorthWest();
    if (currentStartMarker) pinLayer.removeLayer(currentStartMarker);
    currentStartMarker = L.marker([startLL.lat, startLL.lng]).bindPopup(`Start of Section ${code}`);
    pinLayer.addLayer(currentStartMarker);
  }

  function showPlotMarker(coords, labelHtml) {
    if (!pinLayer || !coords) return;
    if (currentPlotMarker) pinLayer.removeLayer(currentPlotMarker);
    currentPlotMarker = L.marker(coords).bindPopup(labelHtml || 'Plot');
    pinLayer.addLayer(currentPlotMarker);
    currentPlotMarker.openPopup();
  }

  function highlightSection(code) {
    if (!map || !sectionLayers || !code) return;
    clearAllSectionLayers();
    const entry = sectionLayers[code];
    if (!entry) return;

    if (entry.route) entry.route.addTo(map);
    if (entry.outline) entry.outline.addTo(map);
    showStartMarker(code);
  }

  function focusTargetByKey(key) {
    if (!map) return false;
    const dict = window.graveLocations || {};
    let d = dict[key];
    if (!d) {
      const matchKey = Object.keys(dict).find(k => k.toLowerCase() === key.toLowerCase());
      if (matchKey) d = dict[matchKey];
    }
    if (!d) return false;

    showPlotMarker(d.coords, `<b>${d.name || key}</b>`);
    map.setView(d.coords, map.getZoom());
    if (d.section) highlightSection(normalizeSection(d.section));
    return true;
  }

  function focusFromContext() {
    if (!map) return;
    if (qParam && focusTargetByKey(qParam)) return;
    if (!Number.isNaN(latParam) && !Number.isNaN(lngParam)) {
      showPlotMarker([latParam, lngParam], 'Selected location');
      map.setView([latParam, lngParam], map.getZoom());
      return;
    }

    const sectionTxt = (document.getElementById('section')?.textContent || '').trim();
    const lotTxt = (document.getElementById('lot')?.textContent || '').trim();
    const norm = normalizeSection(sectionTxt);
    if (norm) highlightSection(norm);
    if (norm && lotTxt) {
      const key = `Section ${norm} Plot ${lotTxt}`;
      focusTargetByKey(key);
    }
  }

  // ===== Data fetch and render =====
  if (!userID) {
    initMap();
    setTimeout(focusFromContext, 150);
  } else {
    fetchResident();
  }

  async function fetchResident() {
    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(userID)}`);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      const resident = await response.json();
      displayResident(resident);
    } catch (err) {
      console.error('Error fetching resident:', err);
      initMap();
      setTimeout(focusFromContext, 150);
    }
  }

  function displayResident(resident) {
    const name = [resident.firstName, resident.middleName, resident.lastName].filter(Boolean).join(' ');
    const formattedDate = formatDate(resident.burialDate);
    const lot = resident?.lot || {};
    const sectionName = lot?.section?.name;
    const lotNumber = lot?.number;

    const x = lot?.mapXCord ?? null;
    const y = lot?.mapYCord ?? null;
    const plotCoords = (x != null && y != null) ? [y, x] : null;

    document.getElementById("name").textContent = name || 'Not available';
    document.getElementById("burialDate").textContent = formattedDate || 'Not available';
    document.getElementById("section").textContent = sectionName || 'Not available';
    document.getElementById("lot").textContent = lotNumber ?? 'Not available';
    document.getElementById("lotOwner").textContent = lot?.owner || 'Not available';
    document.getElementById("lotDescriptor").textContent = lot?.descriptor || 'Not available';
    document.getElementById("residentID").textContent = resident?.rid || 'Not available';

    initMap();
    setTimeout(() => {
      if (sectionName) highlightSection(normalizeSection(sectionName));
      if (plotCoords) {
        showPlotMarker(plotCoords, `<b>${name}</b><br>Plot ${lotNumber}`);
        map.setView(plotCoords, map.getZoom());
      } else {
        const key = `Section ${normalizeSection(sectionName)} Plot ${lotNumber}`;
        focusTargetByKey(key);
      }
    }, 150);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }
});
