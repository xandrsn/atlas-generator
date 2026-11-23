#!/usr/bin/env node
// Entry point for `npm run generate`. Today it validates the area, writes maps/<name>/area.json and prints the plan.
// The bake steps (Catastro, OSM, PNOA, DEM) are still wired to Chiclana: see README "Status".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, USAGE } from '../lib/args.mjs';
import { circleToBbox, bboxToTiles } from '../lib/area.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let opts;
try { opts = parseArgs(process.argv.slice(2)); } catch (e) { console.error(e.message); console.error(USAGE); process.exit(2); }
if (opts.help) { console.log(USAGE); process.exit(0); }

const bbox = circleToBbox(opts.lat, opts.lon, opts.radiusKm);
const tiles = [14, 17].map(z => bboxToTiles(bbox, z));
const area = { name: opts.name, centre: { lat: opts.lat, lon: opts.lon }, radiusKm: opts.radiusKm, bbox, ortho: tiles.map(t => ({ z: t.z, tiles: t.count })) };
const dir = path.join(ROOT, 'maps', opts.name);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'area.json'), JSON.stringify(area, null, 2) + '\n');
console.log(`area "${opts.name}": bbox ${bbox.west.toFixed(4)},${bbox.south.toFixed(4)} .. ${bbox.east.toFixed(4)},${bbox.north.toFixed(4)}`);
for (const t of tiles) console.log(`  PNOA z${t.z}: ${t.count} tiles`);
console.log(`wrote ${path.relative(ROOT, path.join(dir, 'area.json'))}`);
console.log('Bake steps are not generalised yet: nothing was downloaded. See README "Status".');
