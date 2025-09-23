# BAM_Niskey_Hill
Codebase for the Lehigh 2025 Capstone team for Bethlehem Area Moravians - Niskey Hills Cemetery Project 

Some GPT Notes

Short answer: these look plausible and internally pretty consistent. I don’t think #2 is wildly off.

Here’s why:

All three lat/lon pairs sit right where Nisky Hill/Bethlehem should be (≈ 40.618°N, −75.37°W).

Pairwise scale check (pixel distance → ground distance) is steady:

A[482,228] → B[330,1203]: 986.8 px corresponds to ~585 m ⇒ ~0.593 m/px

A → C[478,881]: 653.0 px → ~395 m ⇒ ~0.606 m/px

B → C: 354.4 px → ~201 m ⇒ ~0.566 m/px
Those m/px numbers cluster around 0.59 ± 0.02, which is great for rough sanity.

What’s “weird” (and expected with an un-georeferenced scan) is the direction: big east–west meter changes line up mostly with vertical pixel changes, and moving “left” in pixels increases longitude (east). That just means your image isn’t north-up and is likely mirrored/rotated—not a data error.

Quick rules of thumb for your latitude (to self-check any future points)

0.001° lat ≈ 111 m

0.001° lon ≈ ~85 m (cos 40.6° ≈ 0.76 × 111 m)

Using those:

A→B: Δlat = −0.000814 ≈ −90 m, Δlon = +0.006847 ≈ +582 m ⇒ ~585 m total ✅

A→C: Δlat = −0.000066 ≈ −7 m, Δlon = +0.004685 ≈ +398 m ⇒ ~395–400 m ✅

What to do next (to lock it in)

Get 4–6 control points (pixel x,y ↔ lat,lon) spread across corners/edges.

Fit a transform once, use everywhere:

If you only scaled/rotated/skewed the scan: affine is enough.

If there’s perspective/warping: use a projective (homography).

Easiest path: drop the scan in QGIS Georeferencer, place your control points, export a GeoTIFF (or tiles).

Pure web: compute a homography and use L.imageOverlay.rotated or a custom CRS.

After that, every plot pixel → lat/lon is deterministic, and your three points should fall with small residuals (a few meters). If one control point is way off, you’ll see it immediately.

If you want, paste me 1–3 more [x,y]↔(lat,lon) pairs from different corners, and I’ll compute an affine fit and report the residuals + a tiny JS snippet you can drop in to transform pixels → WGS84 on the fly.