/* sections.js
   Builds your pre-mapped section routes/outlines and returns a dictionary:
   { 'I': {route, outline}, 'A1': {route, outline}, 'K': {outline}, ... }
   NOTE: We don't add anything to the map here; profile.js will.
*/
(function () {
  window.NiskySections = function () {
    /* Routes (unchanged) */
    const sectionLRoute = L.polyline([[477,882],[387,882],[382,887],[378,892],[374,896],[370,901],[366,905],[362,910],[359,914],[355,919],[353,924],[350,929],[349,935],[348,938],[349,943],[349,949],[347,956]], { color: 'blue', weight: 3 });
    const section4Route = L.polyline([[477,882],[387,882],[382,887],[378,892],[374,896],[370,901],[366,905],[362,910],[359,914],[355,919],[353,924],[350,929],[349,935],[348,938],[325,950],[321,1327],[326,1342],[333,1356],[340,1371],[356,1383],[367,1389],[369,1391]], { color: 'goldenrod', weight: 3 });
    const sectionFRoute = L.polyline([[477,882],[387,882],[382,887],[378,892],[374,896],[370,901],[366,905],[362,910],[359,914],[355,919],[353,924],[350,929],[349,935],[348,938],[342,939],[332,944],[323,945],[320,944]], { color: 'purple', weight: 3 });
    const sectionIRoute = L.polyline([[477,882],[387,882],[387,877]], { color: 'orange', weight: 3 });
    const sectionARoute = L.polyline([[477,882],[387,882],[373,851],[365,827],[362,797],[358,760],[351,739],[328,706],[310,700],[297,699],[294,675],[288,660],[287,654],[293,635],[300,616],[303,608],[301,598],[297,585],[293,570],[296,553],[300,539],[308,515],[313,492],[314,483],[312,356],[317,356]], { color: 'darkorange', weight: 3 });
    const sectionA1Route = L.polyline([ ...sectionARoute.getLatLngs(), [374,356], [374,364] ], { color: 'royalblue', weight: 3 });
    const sectionA2Route = L.polyline([ ...sectionARoute.getLatLngs(), [374,356], [374,351] ], { color: 'mediumvioletred', weight: 3 });
    const sectionA3Route = L.polyline([ ...sectionARoute.getLatLngs(), [413,357], [411,361] ], { color: 'seagreen', weight: 3 });
    const sectionA4Route = L.polyline([ ...sectionARoute.getLatLngs(), [413,357], [413,353] ], { color: 'darkorange', weight: 3 });
    const sectionA5Route = L.polyline([ ...sectionARoute.getLatLngs(), [456,356], [460,361] ], { color: 'crimson', weight: 3 });
    const sectionA6Route = L.polyline([ ...sectionARoute.getLatLngs(), [456,356], [460,354] ], { color: 'blue', weight: 3 });

    /* Outlines (unchanged) */
    const sectionLOutline = L.polygon([[332,958],[334,956],[338,954],[344,954],[346,955],[350,958],[355,970],[364,988],[380,1009],[400,1027],[420,1046],[430,1060],[435,1075],[437,1088],[435,1098],[433,1104],[424,1116],[410,1123],[395,1125],[387,1124],[370,1118],[353,1100],[348,1090],[341,1075],[334,1050],[328,1025],[327,1000],[328,975]], { color: 'blue', fillColor: '#89cff0', fillOpacity: 0.5, weight: 2 }).bindPopup("Section L Outline");
    const sectionKOutline = L.polygon([[462,892],[468,899],[470,904],[470,912],[470,925],[469,950],[469,1075],[465,1080],[458,1082],[452,1078],[449,1072],[445,1065],[442,1060],[438,1053],[431,1047],[392,1014],[375,995],[362,971],[353,952],[353,935],[358,921],[369,906],[394,889],[411,886],[429,887],[455,888]], { color: 'green', fillColor: '#b0f2b6', fillOpacity: 0.5, weight: 2 }).bindPopup("Section K Outline");
    const sectionIOutline = L.polygon([[480,705],[480,877],[327,877],[327,715],[333,712],[337,708],[338,706],[340,704]], { color: 'orange', fillColor: '#ffd699', fillOpacity: 0.5, weight: 2 }).bindPopup("Section I Outline");
    const sectionFOutline = L.polygon([[320,895],[318,1108],[266,1108],[260,1115],[217,1116],[216,1048],[215,1028],[216,988],[216,951],[220,938],[224,924],[232,904],[241,892],[248,887],[309,887],[313,888],[315,889],[317,890],[319,893]], { color: 'purple', fillColor: '#dab6ff', fillOpacity: 0.5, weight: 2 }).bindPopup("Section F Outline");
    const unionCemeteryOutline = L.polygon([[481,496],[321,496],[321,697],[480,697]], { color: 'red', fillColor: '#ffb3b3', fillOpacity: 0.5, weight: 2 }).bindPopup("Union Cemetery Outline");
    const sectionEOutline = L.polygon([[317,711],[327,712],[327,878],[263,878],[257,876],[251,868],[246,857],[239,846],[231,832],[226,821],[224,784],[222,761],[222,755],[223,748],[220,734],[214,724],[209,705],[205,690],[205,673],[205,655],[204,649],[288,650],[295,644],[317,644]], { color: 'brown', fillColor: '#e0c7a2', fillOpacity: 0.5, weight: 2 }).bindPopup("Section E Outline");
    const section1Outline = L.polygon([[439,1119],[455,1135],[475,1135],[475,1254],[459,1264],[442,1270],[419,1271],[409,1268],[394,1255],[332,1187],[329,1173],[329,1158],[335,1145],[351,1134],[371,1131],[404,1131],[417,1126],[432,1117],[435,1116]], { color: 'orange', fillColor: '#ffd699', fillOpacity: 0.5, weight: 2 }).bindPopup("Section 1 Outline");
    const sectionOOutline = L.polygon([[332,1201],[398,1268],[421,1298],[429,1314],[433,1333],[434,1337],[435,1349],[431,1359],[428,1368],[419,1377],[407,1384],[392,1389],[374,1388],[354,1378],[344,1367],[331,1342],[327,1327],[327,1202],[329,1200],[332,1201]], { color: 'teal', fillColor: '#a0e7e5', fillOpacity: 0.5, weight: 2 }).bindPopup("Section O Outline");
    const sectionDOutline = L.polygon([[316,642],[292,642],[289,643],[286,645],[285,647],[205,648],[200,637],[196,620],[188,565],[183,523],[182,490],[183,488],[311,487],[311,512],[313,513],[317,514]], { color: 'darkgreen', fillColor: '#b6e2a1', fillOpacity: 0.5, weight: 2 }).bindPopup("Section D Outline");
    const sectionGOutline = L.polygon([[319,1116],[319,1181],[259,1181],[258,1297],[247,1297],[219,1187],[217,1116]], { color: 'navy', fillColor: '#a6b8ff', fillOpacity: 0.5, weight: 2 }).bindPopup("Section G Outline");
    const sectionD5Outline = L.polygon([[319,1185],[268,1185],[267,1323],[319,1323]], { color: 'maroon', fillColor: '#f4b6b6', fillOpacity: 0.5, weight: 2 }).bindPopup("Section D5 Outline");
    const section4Outline = L.polygon([[446,1398],[486,1504],[490,1527],[490,1546],[487,1567],[481,1583],[470,1599],[457,1612],[437,1622],[418,1628],[395,1632],[383,1634],[370,1629],[363,1626],[355,1617],[351,1609],[345,1586],[334,1537],[330,1509],[326,1454],[326,1392],[329,1384],[337,1380],[347,1380],[360,1388],[379,1395],[394,1395],[400,1393],[407,1392],[416,1388],[422,1385],[432,1385],[441,1390],[446,1396]], { color: 'goldenrod', fillColor: '#ffe680', fillOpacity: 0.5, weight: 2 }).bindPopup("Section 4 Outline");
    const sectionD6Outline = L.polygon([[317,1328],[318,1468],[321,1507],[327,1546],[342,1608],[294,1621],[279,1539],[287,1541],[249,1351],[266,1351],[266,1328]], { color: 'darkred', fillColor: '#f7a7a7', fillOpacity: 0.5, weight: 2 }).bindPopup("Section D6 Outline");
    const sectionCOutline = L.polygon([[312,483],[182,483],[179,465],[178,445],[181,426],[181,410],[178,391],[183,360],[312,360]], { color: 'slateblue', fillColor: '#b5c6ff', fillOpacity: 0.5, weight: 2 }).bindPopup("Section C Outline");
    const sectionBOutline = L.polygon([[312,352],[185,352],[185,337],[185,323],[182,305],[185,298],[190,296],[197,292],[207,290],[212,287],[216,283],[219,270],[220,257],[216,246],[212,239],[211,233],[215,232],[312,230]], { color: 'mediumseagreen', fillColor: '#b7f0d4', fillOpacity: 0.5, weight: 2 }).bindPopup("Section B Outline");
    const sectionAOutline = L.polygon([[352,231],[318,231],[317,493],[351,493]], { color: 'darkorange', fillColor: '#ffd8a6', fillOpacity: 0.5, weight: 2 }).bindPopup("Section A Outline");
    const sectionA2Outline = L.polygon([[390,235],[360,235],[360,351],[390,351]], { color: 'mediumvioletred', fillColor: '#f7c6d9', fillOpacity: 0.5, weight: 2 }).bindPopup("Section A2 Outline");
    const sectionA1Outline = L.polygon([[389,364],[388,491],[357,491],[358,364]], { color: 'royalblue', fillColor: '#bcd4ff', fillOpacity: 0.5, weight: 2 }).bindPopup("Section A1 Outline");
    const sectionA3Outline = L.polygon([[397,360],[425,361],[428,363],[430,367],[429,489],[427,491],[425,492],[399,492],[397,491],[396,488]], { color: 'seagreen', fillColor: '#b7f0b1', fillOpacity: 0.5, weight: 2 }).bindPopup("Section A3 Outline");
    const sectionA4Outline = L.polygon([[430,236],[429,349],[427,351],[424,354],[397,353],[397,232],[425,232],[429,233]], { color: 'darkorange', fillColor: '#ffd9a0', fillOpacity: 0.5, weight: 2 }).bindPopup("Section A4 Outline");
    const sectionA5Outline = L.polygon([[482,362],[440,362],[437,362],[434,366],[434,490],[434,492],[438,493],[481,492]], { color: 'crimson', fillColor: '#f4a6a6', fillOpacity: 0.5, weight: 2 }).bindPopup("Section A5 Outline");
    const sectionA6Outline = L.polygon([[482,232],[479,233],[477,231],[441,230],[436,232],[434,235],[434,348],[436,351],[439,354],[477,353],[482,353]], { color: 'blue', fillColor: '#a6d8ff', fillOpacity: 0.5, weight: 2 }).bindPopup("Section A6 Outline");

    // Return a lookup. Some have routes + outlines; others just outlines.
    return {
      'L':  { route: sectionLRoute, outline: sectionLOutline },
      'F':  { route: sectionFRoute, outline: sectionFOutline },
      'I':  { route: sectionIRoute, outline: sectionIOutline },
      '4':  { route: section4Route, outline: section4Outline },

      'A':  { outline: sectionAOutline },
      'A1': { route: sectionA1Route, outline: sectionA1Outline },
      'A2': { route: sectionA2Route, outline: sectionA2Outline },
      'A3': { route: sectionA3Route, outline: sectionA3Outline },
      'A4': { route: sectionA4Route, outline: sectionA4Outline },
      'A5': { route: sectionA5Route, outline: sectionA5Outline },
      'A6': { route: sectionA6Route, outline: sectionA6Outline },

      'K':  { outline: sectionKOutline },
      'E':  { outline: sectionEOutline },
      '1':  { outline: section1Outline },
      'O':  { outline: sectionOOutline },
      'D':  { outline: sectionDOutline },
      'G':  { outline: sectionGOutline },
      'D5': { outline: sectionD5Outline },
      'D6': { outline: sectionD6Outline },
      'C':  { outline: sectionCOutline },
      'B':  { outline: sectionBOutline },
      'UNION': { outline: unionCemeteryOutline }
    };
  };
})();
