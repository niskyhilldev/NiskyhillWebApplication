document.addEventListener('DOMContentLoaded', () => {
  // ===== URL params / API base =====
  const searchParams = new URLSearchParams(window.location.search);
  const userID  = searchParams.get("id");
  const qParam  = searchParams.get("q");
  const latParam = parseFloat(searchParams.get("lat"));
  const lngParam = parseFloat(searchParams.get("lng"));
  const API_BASE_URL = 'https://niskyhillcemetery-23a1ead2d9b1.herokuapp.com';

  // ===== Map state =====
  let map;
  let graveMarkers = {};
  let sectionLayers = null;  // filled by sections.js
  let currentPlotMarker  = null;

  // ===== Map init =====
  function initMap() {
    if (map) return; // prevent double init

    const mapEl = document.getElementById('profile-map');
    if (!mapEl) return;

  map = L.map('profile-map', { 
    crs: L.CRS.Simple, 
    minZoom: 0, 
    maxZoom: 2,
    zoomSnap: 0.5,
    maxBounds: [[0, 0], [1000, 2000]],  // Restrict panning to image bounds
    maxBoundsViscosity: 1.0  // Makes the boundary hard (1.0) vs soft (0.0)
  });
    const bounds = [[0, 0], [1000, 2000]];
    L.imageOverlay('map-1.png', bounds).addTo(map); // PNG lives next to profile.html
    map.fitBounds(bounds);
    map.setView([375, 850], map.getZoom() + .75);

    //for mobile adjustment
  


      L.marker([478, 882]).addTo(map).bindPopup("Main Entrance");

    function fixMapSizeSoon(){ setTimeout(() => map.invalidateSize(), 200); }
    map.whenReady(fixMapSizeSoon);
    window.addEventListener('resize', fixMapSizeSoon);

    map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    console.log(`Clicked at: [${lat.toFixed(0)}, ${lng.toFixed(0)}]`);
  });

    // ===== DEBUG: Show all sections (comment out when not needed) =====
  // Show ALL sections:
  // Build section layer catalog from sections.js
  if (window.NiskySections) {
    sectionLayers = window.NiskySections();
  }

  // ===== DEBUG: Show all sections (comment out when not needed) =====
  // Show ALL sections:
  //  Object.values(sectionLayers || {}).forEach(({route, outline}) => { if(route) route.addTo(map); if(outline) outline.addTo(map); });
  
  // Show SPECIFIC section (change 'D' to whatever section you want to test):
  // if(sectionLayers?.['D5']) { const s = sectionLayers['D5']; if(s.route) s.route.addTo(map); if(s.outline) s.outline.addTo(map); }
  // ====

 
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
  if (!entry) {
    console.log('Section not found:', code);
    return;
  }
  console.log(`Section ${code}:`, { hasRoute: !!entry.route, hasOutline: !!entry.outline });
  if (entry.route) {
    entry.route.addTo(map);
    console.log(`Route displayed for section ${code}`);
  }
  
  if (entry.outline) entry.outline.addTo(map);

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
    return [lot.mapXCord, lot.mapYCord]; // [lat(y), lng(x)]
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
      const response = await fetch(`${API_BASE_URL}/residents/find/${encodeURIComponent(userID || '')}`);
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



//     // ===== DEBUG: Visualize raw plot coordinates =====
//   // Toggle ON/OFF by commenting this block
//   if (typeof L !== 'undefined' && map) {
// const debugPoints = [
//   [427,1419],[424,1420],[420,1421],[415,1423],[411,1424],[406,1425],[402,1427],[399,1428],[389,1431],[385,1432],
//   [380,1432],[375,1432],[371,1432],[367,1432],[362,1431],[357,1432],[353,1431],[352,1438],[356,1438],[361,1438],
//   [367,1439],[370,1438],[375,1438],[381,1438],[384,1438],[390,1438],[401,1434],[404,1433],[409,1431],[413,1431],
//   [417,1429],[421,1427],[426,1427],[430,1425],[432,1430],[428,1431],[423,1432],[419,1434],[415,1435],[411,1436],
//   [406,1438],[403,1438],[389,1443],[384,1444],[380,1443],[376,1443],[370,1443],[366,1443],[361,1444],[356,1443],
//   [352,1443],[352,1449],[357,1450],[361,1450],[366,1450],[369,1450],[375,1450],[380,1450],[384,1450],[389,1450],
//   [405,1445],[408,1444],[413,1443],[417,1441],[421,1440],[426,1438],[430,1437],[434,1435],[435,1440],[432,1441],
//   [428,1443],[424,1445],[419,1446],[415,1447],[411,1448],[407,1450],[389,1455],[384,1456],[380,1455],[375,1455],
//   [370,1456],[366,1455],[362,1455],[356,1455],[352,1455],[352,1463],[356,1462],[361,1463],[366,1463],[371,1463],
//   [375,1462],[380,1463],[384,1463],[388,1463],[397,1461],[400,1460],[404,1458],[409,1457],[413,1456],[418,1454],
//   [422,1453],[426,1451],[431,1450],[435,1449],[438,1447],[440,1452],[437,1453],[432,1455],[427,1456],[424,1457],
//   [419,1459],[415,1460],[411,1461],[407,1463],[402,1465],[399,1465],[388,1467],[384,1468],[380,1468],[375,1468],
//   [370,1467],[366,1468],[362,1468],[357,1468],[352,1467],[352,1474],[356,1474],[361,1474],[366,1474],[370,1474],
//   [375,1474],[380,1474],[384,1474],[389,1474],[401,1472],[405,1471],[409,1469],[413,1468],[417,1467],[422,1465],
//   [426,1464],[429,1463],[435,1461],[439,1460],[443,1459],[445,1463],[441,1465],[436,1466],[431,1468],[428,1469],
//   [424,1470],[419,1471],[415,1472],[411,1473],[406,1475],[403,1477],[388,1479],[385,1479],[380,1479],[376,1478],
//   [370,1479],[366,1479],[362,1479],[356,1479],[352,1479],[351,1486],[356,1485],[361,1485],[366,1486],[370,1485],
//   [376,1485],[380,1486],[384,1485],[388,1486],[405,1483],[409,1482],[414,1480],[418,1480],[421,1478],[426,1477],
//   [430,1475],[434,1474],[439,1473],[443,1471],[447,1470],[449,1474],[445,1476],[441,1477],[436,1479],[432,1480],
//   [428,1481],[423,1483],[419,1484],[415,1485],[411,1487],[407,1488],[388,1491],[384,1491],[381,1491],[376,1491],
//   [370,1491],[366,1491],[361,1491],[356,1491],[352,1491],[355,1506],[362,1504],[369,1502],[373,1501],[377,1501],
//   [381,1500],[388,1499],[409,1494],[413,1493],[417,1492],[422,1490],[426,1489],[430,1487],[435,1486],[438,1485],
//   [443,1483],[448,1482],[451,1480],[453,1485],[449,1486],[444,1488],[439,1489],[436,1490],[432,1492],[427,1493],
//   [423,1495],[419,1496],[415,1498],[411,1498],[391,1505],[388,1506],[384,1507],[379,1508],[375,1508],[371,1510],
//   [366,1510],[361,1512],[357,1512],[358,1517],[363,1516],[366,1515],[371,1514],[377,1513],[380,1512],[384,1511],
//   [389,1510],[393,1510],[414,1506],[417,1505],[420,1504],[425,1503],[429,1503],[433,1502],[438,1501],[443,1500],
//   [447,1499],[451,1498],[454,1497],[455,1502],[452,1503],[448,1504],[444,1505],[440,1506],[435,1506],[431,1507],
//   [426,1508],[421,1510],[418,1510],[415,1511],[410,1512],[405,1512],[401,1514],[395,1516],[391,1517],[387,1518],
//   [382,1519],[378,1520],[373,1521],[368,1522],[364,1522],[360,1523],[360,1528],[365,1527],[370,1526],[374,1525],
//   [379,1525],[383,1524],[388,1523],[392,1522],[396,1520],[402,1519],[406,1519],[411,1519],[416,1517],[420,1516],
//   [423,1515],[427,1514],[432,1513],[436,1513],[440,1512],[445,1511],[450,1510],[453,1509],[457,1508],[457,1513],
//   [454,1514],[450,1515],[447,1516],[442,1517],[437,1518],[434,1518],[428,1520],[424,1520],[420,1521],[417,1522],
//   [412,1523],[407,1524],[403,1525],[398,1527],[394,1529],[389,1529],[384,1530],[381,1531],[376,1532],[370,1533],
//   [367,1534],[362,1535],[363,1540],[368,1539],[372,1538],[377,1537],[382,1536],[386,1535],[390,1534],[395,1533],
//   [399,1532],[405,1531],[408,1531],[413,1530],[418,1528],[422,1528],[425,1527],[431,1526],[435,1525],[439,1525],
//   [444,1523],[448,1522],[452,1521],[455,1521],[459,1520],[460,1525],[457,1525],[453,1527],[449,1527],[444,1528],
//   [439,1530],[436,1530],[431,1531],[427,1532],[423,1533],[419,1533],[415,1534],[410,1535],[406,1536],[401,1540],
//   [397,1541],[392,1542],[388,1543],[383,1544],[379,1545],[374,1546],[370,1546],[366,1547],[367,1552],[371,1551],[375,1551],[380,1549],[385,1549],[389,1548],[394,1547],[398,1546],[402,1545],[408,1543],
// [411,1542],[416,1541],[421,1540],[425,1539],[428,1538],[433,1537],[438,1536],[442,1536],[446,1534],[451,1533],
// [455,1533],[458,1532],[462,1531],[463,1536],[460,1537],[456,1538],[452,1539],[447,1539],[443,1541],[439,1541],
// [434,1542],[429,1543],[426,1544],[422,1545],[417,1546],[413,1547],[409,1548],[403,1552],[399,1553],[394,1554],
// [390,1555],[386,1555],[381,1556],[377,1557],[373,1558],[368,1559],[369,1564],[374,1563],[378,1562],[383,1561],
// [387,1560],[392,1559],[396,1558],[401,1557],[404,1557],[411,1554],[414,1553],[419,1552],[424,1551],[428,1550],
// [431,1550],[436,1549],[441,1548],[444,1547],[449,1546],[454,1545],[457,1544],[461,1543],[465,1543],[466,1548],
// [462,1548],[459,1549],[455,1550],[450,1551],[445,1552],[441,1553],[436,1554],[432,1555],[429,1555],[425,1556],
// [420,1557],[416,1557],[411,1559],[406,1563],[402,1564],[397,1565],[393,1566],[389,1567],[385,1567],[380,1568],
// [375,1570],[371,1570], [372,1575],[377,1574],[381,1573],[385,1572],[390,1571],[393,1570],[398,1569],[403,1569],[407,1568],[414,1566],
// [418,1565],[423,1564],[426,1563],[430,1563],[434,1562],[439,1561],[442,1560],[446,1559],[450,1559],[455,1558],
// [460,1556],[461,1562],[456,1563],[452,1564],[447,1565],[443,1565],[440,1566],[435,1567],[432,1568],[428,1569],
// [423,1569],[418,1571],[414,1571],[408,1574],[405,1575],[400,1576],[395,1577],[392,1578],[386,1579],[382,1580],
// [377,1581],[374,1581],[375,1587],[379,1585],[383,1584],[388,1583],[393,1582],[397,1581],[401,1581],[406,1580],
// [410,1579],[419,1590],[422,1589],[427,1588],[433,1587],[436,1586],[440,1585],[444,1584],[448,1583],[451,1583],[449,1589],
// [445,1590],[441,1591],[437,1591],[433,1592],[428,1593],[424,1594],[420,1595],[414,1598],[410,1598],[405,1600],
// [401,1600],[397,1601],[392,1602],[387,1603],[383,1603],[380,1604],[385,1608],[388,1607],[394,1606],[399,1605],
// [402,1605],[407,1604],[411,1603],[415,1602],[422,1601],[425,1600],[430,1598],[435,1598],[439,1597]
// ];

//     // Optional styling for debug dots
//     const redIcon = L.divIcon({
//       className: 'debug-dot',
//       html: '<div style="width:6px;height:6px;background:red;border-radius:50%;"></div>',
//       iconSize: [6,6]
//     });

//     debugPoints.forEach((coords, i) => {
//       L.marker(coords, { icon: redIcon })
//         .addTo(map)
//         .bindPopup(`#4 Plot ${i + 234}`); // adjust starting plot label if needed
//     });

//     console.log(`DEBUG: Plotted ${debugPoints.length} raw coordinates`);
//   }

  
});
