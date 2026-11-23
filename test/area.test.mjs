import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circleToBbox, bboxToTiles } from '../lib/area.mjs';

test('circleToBbox: 3 km around Chiclana centre spans 3 km each way', () => {
  const b = circleToBbox(36.41, -6.15, 3);
  const latKm = (b.north - b.south) * 110.574 / 2;
  const lonKm = (b.east - b.west) * 111.32 * Math.cos(36.41 * Math.PI / 180) / 2;
  assert.ok(Math.abs(latKm - 3) < 1e-9, `lat half-span ${latKm}`);
  assert.ok(Math.abs(lonKm - 3) < 1e-9, `lon half-span ${lonKm}`);
  assert.ok(b.west < -6.15 && b.east > -6.15 && b.south < 36.41 && b.north > 36.41);
});

test('circleToBbox: radius 0 collapses to the point', () => {
  const b = circleToBbox(40.4, -3.7, 0);
  assert.equal(b.west, -3.7);
  assert.equal(b.north, 40.4);
});

test('bboxToTiles: a single point is one tile at the expected x/y', () => {
  const t = bboxToTiles({ west: -3.7, south: 40.4, east: -3.7, north: 40.4 }, 14);
  assert.equal(t.x0, Math.floor((-3.7 + 180) / 360 * 2 ** 14));
  assert.equal(t.count, 1);
});

test('bboxToTiles: 6 km square at z17 is close to the area / tile-area estimate', () => {
  const t = bboxToTiles(circleToBbox(36.41, -6.15, 3), 17);
  const tileM = 40075016.686 / 2 ** 17 * Math.cos(36.41 * Math.PI / 180);
  const expected = (6000 / tileM) ** 2;
  assert.ok(t.count > expected * 0.8 && t.count < expected * 1.4, `count ${t.count} vs ~${expected.toFixed(0)}`);
});
