# atlas-generator

Tool to bake a playable ATLAS map (3D, drivable, from open data) for a point and radius in mainland Spain, on your own PC.

Made by [Charlie Andersen](https://charlieandersen.vercel.app). Example map and web client: https://github.com/xandrsn/atlas-chiclana (live: https://atlas-chiclana.vercel.app). Pre-baked Chiclana data: https://github.com/xandrsn/atlas-chiclana-data.

## Usage

Requires Node.js 20 or newer. No dependencies.

```
npm run generate -- --lat 36.41 --lon -6.15 --radius 3 --name mymap
npm test
```

| Option | Meaning |
|---|---|
| `--lat`, `--lon` | Centre point, decimal degrees (WGS84). Must be in mainland Spain or the Balearics |
| `--radius` | Radius in km, > 0 and <= 25 |
| `--name` | Output slug: lowercase letters, digits and dashes, max 40 |

The area is the circle's bounding box. Output goes to `maps/<name>/`.

## Status

- Done: argument validation, circle to bounding box, PNOA tile counts per zoom (`lib/area.mjs`, `lib/args.mjs`), unit tests (`npm test`), and writing `maps/<name>/area.json`.
- Not done: the bake itself. Nothing is downloaded yet. The source pipeline (`prep`, `catastro`, `osm`, `osmprep`, `vegetation`, `landclass`, `dem_ign`, `pools`, `roofcolors`, `facades`) still has Chiclana constants: the boundary relation 346951, the INE municipality code 11015 in the Catastro URL, the origin and grid in `public/js/geo.js`, and the bbox and tile ranges written into the scripts. Generalising these means:
  1. the boundary comes from the area (bbox from `area.json`) instead of relation 346951;
  2. the Catastro municipality codes are looked up for the municipalities that intersect the circle (Catastro publishes a file per INE code; the lookup is not written yet);
  3. the origin and the DEM and tile grids come from `area.json`, not from the constants.
- Not in this repo: the local game server and the client. Play the generated map with a copy of the `atlas-chiclana` client and its local server (`npm start`) once the bake writes the same file layout the client loads (`data/*.bin`, `data/*.json`).

## Data sources and licences

- Orthophoto PNOA © Instituto Geográfico Nacional, CC BY 4.0
- Buildings and addresses © Dirección General del Catastro, CC BY 4.0
- Terrain MDT05 © Instituto Geográfico Nacional / CNIG, CC BY 4.0
- Roads, limits, places and parks © OpenStreetMap contributors, ODbL. Derived databases keep the ODbL share-alike terms.

Please keep these credits when you publish a map you generated.

## Limits

- Use the Overpass, Catastro and IGN services politely: the scripts keep to their rate limits. Large areas make many requests.
- Radius is capped at 25 km to keep downloads and disk use bounded.
