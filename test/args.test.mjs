import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from '../lib/args.mjs';

const ok = ['--lat', '36.41', '--lon', '-6.15', '--radius', '3', '--name', 'mymap'];

test('parses a valid point and radius', () => {
  assert.deepEqual(parseArgs(ok), { lat: 36.41, lon: -6.15, radiusKm: 3, name: 'mymap' });
});

test('--help short-circuits', () => {
  assert.deepEqual(parseArgs(['--help']), { help: true });
});

test('rejects missing options, unknown options and dangling values', () => {
  assert.throws(() => parseArgs(ok.slice(2)), /missing --lat/);
  assert.throws(() => parseArgs([...ok, '--foo', '1']), /unknown option --foo/);
  assert.throws(() => parseArgs(['--lat', '--lon', '1']), /unknown option|needs a value/);
  assert.throws(() => parseArgs(['stray']), /unexpected argument/);
});

test('rejects points outside mainland Spain and bad radius', () => {
  assert.throws(() => parseArgs(['--lat', '28.1', '--lon', '-15.4', '--radius', '3', '--name', 'x']), /outside/);
  assert.throws(() => parseArgs(['--lat', '36.4', '--lon', '-6.1', '--radius', '0', '--name', 'x']), /radius/);
  assert.throws(() => parseArgs(['--lat', '36.4', '--lon', '-6.1', '--radius', '40', '--name', 'x']), /radius/);
});

test('rejects non-numeric coordinates and unsafe names', () => {
  assert.throws(() => parseArgs(['--lat', '1e3', '--lon', '-6', '--radius', '1', '--name', 'x']), /plain decimal/);
  assert.throws(() => parseArgs(['--lat', '36.4', '--lon', '-6.1', '--radius', '1', '--name', '../etc']), /slug/);
});
