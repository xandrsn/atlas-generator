// CLI argument parsing and validation for `npm run generate`. Pure: takes argv, returns options or throws.
export const USAGE = 'usage: npm run generate -- --lat <deg> --lon <deg> --radius <km> --name <slug>';

// Mainland Spain + Balearics (Canary Islands are out of scope for this tool).
const SPAIN = { latMin: 35.9, latMax: 44.0, lonMin: -9.4, lonMax: 4.5 };
const KNOWN = ['lat', 'lon', 'radius', 'name'];
const DECIMAL = /^-?\d+(\.\d+)?$/;

export function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') return { help: true };
    if (!a.startsWith('--')) throw new Error(`unexpected argument "${a}"`);
    const key = a.slice(2), val = argv[i + 1];
    if (!KNOWN.includes(key)) throw new Error(`unknown option --${key}`);
    if (val === undefined || val.startsWith('--')) throw new Error(`--${key} needs a value`);
    opts[key] = val; i++;
  }
  for (const k of KNOWN) if (opts[k] === undefined) throw new Error(`missing --${k}\n${USAGE}`);
  if (!DECIMAL.test(opts.lat) || !DECIMAL.test(opts.lon) || !/^\d+(\.\d+)?$/.test(opts.radius))
    throw new Error('lat, lon and radius must be plain decimal numbers');
  const lat = Number(opts.lat), lon = Number(opts.lon), radiusKm = Number(opts.radius);
  if (lat < SPAIN.latMin || lat > SPAIN.latMax || lon < SPAIN.lonMin || lon > SPAIN.lonMax)
    throw new Error(`point ${lat},${lon} is outside mainland Spain / Balearics`);
  if (!(radiusKm > 0 && radiusKm <= 25)) throw new Error('radius must be > 0 and <= 25 km');
  if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(opts.name)) throw new Error('name must be a lowercase slug (a-z, 0-9, dashes, max 40)');
  return { lat, lon, radiusKm, name: opts.name };
}
