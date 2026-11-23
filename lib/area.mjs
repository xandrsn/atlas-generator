// Pure geo helpers: point + radius -> bbox -> web-mercator tile range. No I/O.
const KM_PER_DEG_LAT = 110.574;
const KM_PER_DEG_LON_EQ = 111.320;

/** Bounding box (lon/lat) of a circle of `radiusKm` around (lat, lon). */
export function circleToBbox(lat, lon, radiusKm) {
  const dLat = radiusKm / KM_PER_DEG_LAT;
  const dLon = radiusKm / (KM_PER_DEG_LON_EQ * Math.cos(lat * Math.PI / 180));
  return { west: lon - dLon, south: lat - dLat, east: lon + dLon, north: lat + dLat };
}

/** Web-mercator tile range (z/x/y) covering a bbox. */
export function bboxToTiles(bbox, z) {
  const n = 2 ** z;
  const tx = lon => Math.floor((lon + 180) / 360 * n);
  const ty = lat => {
    const r = lat * Math.PI / 180;
    return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n);
  };
  const x0 = tx(bbox.west), x1 = tx(bbox.east), y0 = ty(bbox.north), y1 = ty(bbox.south);
  return { z, x0, x1, y0, y1, count: (x1 - x0 + 1) * (y1 - y0 + 1) };
}
