// Deterministic 32 px extraction, with an optional site-palette adaptation.
// Usage: node scripts/extract-bronze-cursors.mjs SOURCE_DIRECTORY OUTPUT_DIRECTORY [--oxblood]
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';

const [source, output, variant] = process.argv.slice(2);
assert.ok(source && output, 'Provide separate source and output directories.');
assert.ok(variant === undefined || variant === '--oxblood', 'Only the optional --oxblood adaptation is supported.');
const oxblood = variant === '--oxblood';
const sourceRoot = path.resolve(source), outputRoot = path.resolve(output);
assert.ok(outputRoot !== sourceRoot && !outputRoot.startsWith(sourceRoot + path.sep), 'Never write into the supplied theme.');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const luma = ([r, g, b]) => .2126 * r + .7152 * g + .0722 * b;
const sourceAnchor = [174, 103, 11]; // Frequent opaque bronze midtone in Link Select.
const baseColor = [117, 13, 32]; // home.css --burgundy: #750D20.
const highlightColor = [245, 240, 230]; // home.css --paper: #F5F0E6.
function recolor(rgba) {
  const result = Buffer.from(rgba), pivot = luma(sourceAnchor);
  for (let at = 0; at < result.length; at += 4) {
    const rgb = [...rgba.subarray(at, at + 3)];
    // Neutral outlines/shadows and transparent pixels retain their original RGB.
    if (!rgba[at + 3] || !(rgb[0] > rgb[1] && rgb[1] >= rgb[2])) continue;
    const tone = luma(rgb);
    const low = tone <= pivot ? [0, 0, 0] : baseColor;
    const high = tone <= pivot ? baseColor : highlightColor;
    const amount = tone <= pivot ? tone / pivot : (tone - pivot) / (255 - pivot);
    for (let c = 0; c < 3; c++) result[at + c] = Math.round(low[c] + (high[c] - low[c]) * amount);
  }
  return result;
}
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const tag = Buffer.from(type), size = Buffer.alloc(4), crc = Buffer.alloc(4);
  size.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(Buffer.concat([tag, data])));
  return Buffer.concat([size, tag, data, crc]);
}
function png32(rgba) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(32); header.writeUInt32BE(32, 4); header[8] = 8; header[9] = 6;
  const rows = Buffer.alloc(32 * (1 + 32 * 4));
  for (let y = 0; y < 32; y++) rgba.copy(rows, y * 129 + 1, y * 128, (y + 1) * 128);
  return Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', header), chunk('IDAT', deflateSync(rows)), chunk('IEND', Buffer.alloc(0))]);
}
fs.mkdirSync(output, { recursive: true });
const frames = [];
for (const [name, role] of [['Normal Select.cur', 'normal'], ['Link Select.cur', 'link'], ['Text Select.cur', 'text']]) {
  const bytes = fs.readFileSync(path.join(source, name));
  assert.equal(bytes.readUInt16LE(0), 0); assert.equal(bytes.readUInt16LE(2), 2);
  let entry;
  for (let i = 0; i < bytes.readUInt16LE(4); i++) {
    const candidate = bytes.subarray(6 + i * 16, 22 + i * 16);
    if (candidate[0] === 32 && candidate[1] === 32) { entry = Buffer.from(candidate); break; }
  }
  assert.ok(entry, 'The source must contain an original 32 px frame.');
  const length = entry.readUInt32LE(8), offset = entry.readUInt32LE(12);
  const originalPayload = bytes.subarray(offset, offset + length);
  const payload = Buffer.from(originalPayload);
  assert.equal(payload.length, length);
  assert.equal(payload.readUInt32LE(0), 40); assert.equal(payload.readInt32LE(4), 32);
  assert.equal(payload.readInt32LE(8), 64); assert.equal(payload.readUInt16LE(14), 32);
  assert.equal(payload.readUInt32LE(16), 0);
  const hotspot = [entry.readUInt16LE(4), entry.readUInt16LE(6)];
  assert.ok(hotspot.every(value => value >= 0 && value < 32));
  const rgba = Buffer.alloc(4096);
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
    const from = 40 + ((31 - y) * 32 + x) * 4, to = (y * 32 + x) * 4;
    rgba[to] = payload[from + 2]; rgba[to + 1] = payload[from + 1];
    rgba[to + 2] = payload[from]; rgba[to + 3] = payload[from + 3];
    const mask = payload[40 + 4096 + (31 - y) * 4 + (x >> 3)] & (0x80 >> (x & 7));
    assert.ok(!mask || rgba[to + 3] === 0, 'Reject an inconsistent transparency mask.');
  }
  assert.ok(rgba.some((byte, i) => i % 4 === 3 && byte > 0), 'Expected explicit source alpha.');
  const originalRGBAHash = hash(rgba);
  const pixels = oxblood ? recolor(rgba) : rgba;
  if (oxblood) for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
    const from = (y * 32 + x) * 4, to = 40 + ((31 - y) * 32 + x) * 4;
    payload[to] = pixels[from + 2]; payload[to + 1] = pixels[from + 1]; payload[to + 2] = pixels[from];
  }
  entry.writeUInt32LE(22, 12);
  fs.writeFileSync(path.join(output, role + '.cur'), Buffer.concat([Buffer.from([0, 0, 2, 0, 1, 0]), entry, payload]));
  fs.writeFileSync(path.join(output, role + '.png'), png32(pixels));
  frames.push({ role, sourceFile: name, sourceSHA256: hash(bytes), size: [32, 32], hotspot,
    originalPayloadSHA256: hash(originalPayload), originalRGBASHA256: originalRGBAHash,
    payloadSHA256: hash(payload), rgbaSHA256: hash(pixels), cur: role + '.cur', png: role + '.png' });
}
fs.copyFileSync(path.join(source, 'readme.txt'), path.join(output, 'source-readme.txt'));
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify({ name: 'Windows XP Bronze', author: 'Come2Back',
  distributor: 'RIDDLER', source: 'https://www.rw-designer.com/cursor-set/windows-xp-bronze',
  license: 'Personal noncommercial use only; original terms in source-readme.txt.',
  extraction: oxblood
    ? 'Original 32 px geometry, alpha, transparency mask and hotspots; site-palette RGB adaptation; PNG matches adapted CUR.'
    : 'Original 32 px frame, original CUR payload and hotspot, identical RGBA PNG fallback.',
  ...(oxblood ? { adaptation: { name: 'Oxblood site palette', base: '#750D20', highlight: '#F5F0E6',
    sourceAnchor, method: 'Monotonic encoded-luma ramp: black to burgundy at the bronze midtone, then paper highlights. Only bronze RGB is mapped; neutral RGB, alpha, geometry and hotspots are unchanged.',
    rights: 'Palette adaptation does not change original authorship or personal noncommercial license.' } } : {}),
  frames }, null, 2) + '\n');
console.log(`Extracted three 32 px frames${oxblood ? ' with the oxblood site palette' : ''}; source files unchanged.`);
