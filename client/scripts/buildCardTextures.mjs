// Card surface textures: brand-src/texture-<src>.png (a generated grayscale
// image) -> public/brand/textures/<name>.webp, a tile the cards lay over their
// paper (pixelart.css, "Card paper"). Run by hand after adding or replacing a
// source image, or changing TEXTURES: node scripts/buildCardTextures.mjs
//
// For each texture:
// 0. with `soften`, blur it first (a radius in source px), which wipes out
//    fine lines such as marble's veins and leaves only its clouds;
//    then take out the slow light and dark patches (the image minus a wide blur of
//    itself, `patch` its radius), keeping the grain: a patch would show as a
//    spot repeating across the card, and step 1 would double it;
// 1. make it repeat without a seam: across, blend it with itself moved half its
//    width, trusting the moved copy near the left and right edges (its own seam
//    lies in the middle, where the original is used whole); then the same down.
//    Mixing two patches flattens the grain, so the mix is scaled back up;
// 2. scale it to `contrast` (the standard deviation, out of 255) and save it
//    at `tile` px (shown at half that, for sharp screens), either
//    - grey, centred on mid grey, for the card to blend over its paper
//      (overlay leaves the paper's colour as it is where the tile is mid grey), or
//    - with `tint` and `base`: in colour, the paper itself: `base` (the
//      tier's --panel in pixelart.css, keep the two equal) with the dark parts
//      mixed towards `tint` and the light parts towards `light` (default
//      white), each as much
//      as it is far from the middle. The card shows it as it is. A grey tile
//      darkens a pale paper towards grey, which read as dirt on superior's
//      marble (user, 2026-11-14); this darkens it in its own colour. It is
//      opaque because a transparent noise tile compresses badly (260 KB).
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'brand-src');
const OUT = path.join(root, 'public', 'brand', 'textures');
const BLEND = 0.25; // share of the width blended at each edge

const TEXTURES = {
  paper: { src: 'paper', patch: 14, contrast: 26, tile: 512 },
  // Superior's jade: soft clouds, faint, deep jade green on a pale one, large
  // (768px, shown at 384px) so the clouds don't repeat within a card. (Green
  // marble, veins and all, was tried first and looked busy; user, 2026-11-14.)
  // Epic's raw silk (shantung), lavender with deep purple slubs.
  silk: { src: 'silk', patch: 14, contrast: 8, tile: 512, tint: '#4a2a6e', base: '#ddd0ec' },
  // Mythic's light red leather, its grain in deep red.
  leather: { src: 'leather', patch: 14, contrast: 20, tile: 512, tint: '#7a1018', base: '#f0cfcb' },
  // Legend's gilded lacquer: the gold leaf image as faint clouds of gold on
  // a near-black brown (pale gold leaf was tried first: gold frame on gold
  // lost its shine; user, 2026-11-14), large (768px, shown at 384px).
  gold: { src: 'gold', patch: 160, contrast: 18, tile: 768, tint: '#0e0904', light: '#8a6418', base: '#2a1d0e' },
  // Expedition's brushed silver, faint so its lines don't read as stripes.
  silver: { src: 'silver', patch: 14, contrast: 9, tile: 512, tint: '#3a4552', base: '#dfe4ea' },
  jade: { src: 'jade', patch: 160, contrast: 13, tile: 768, tint: '#1f5a34', base: '#b8d8c0' },
};

const smooth = t => t * t * (3 - 2 * t);

function seamless(px, w, h, across) {
  const out = new Float32Array(px.length);
  const n = across ? w : h;
  const band = n * BLEND;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = across ? x : y;
      const k = smooth(Math.min(1, Math.min(i, n - 1 - i) / band));
      const sx = across ? (x + w / 2) % w : x;
      const sy = across ? y : (y + h / 2) % h;
      out[y * w + x] = (px[y * w + x] * k + px[sy * w + sx] * (1 - k)) / Math.hypot(k, 1 - k);
    }
  }
  return out;
}

const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));

fs.mkdirSync(OUT, { recursive: true });
for (const [name, { src, soften, patch, contrast, tile, tint, base, light = '#ffffff' }] of Object.entries(TEXTURES)) {
  let grey = sharp(path.join(SRC, `texture-${src}.png`)).greyscale();
  if (soften) grey = sharp(await grey.blur(soften).toBuffer());
  const { data, info } = await grey.clone().raw().toBuffer({ resolveWithObject: true });
  const soft = await grey.clone().blur(patch).raw().toBuffer();
  const { width: w, height: h } = info;
  let px = Float32Array.from(data, (v, i) => v - soft[i]);
  px = seamless(seamless(px, w, h, true), w, h, false);
  const dev = Math.sqrt(px.reduce((a, b) => a + b * b, 0) / px.length);
  const level = v => (v * contrast) / dev; // -128..127 around the middle
  let image;
  if (tint) {
    const dark = hex(tint);
    const paper = hex(base);
    const rgb = new Uint8Array(w * h * 3);
    px.forEach((v, i) => {
      const d = level(v);
      const to = d < 0 ? dark : hex(light);
      const k = Math.min(1, Math.abs(d) / 128);
      for (let c = 0; c < 3; c++) rgb[i * 3 + c] = Math.round(paper[c] + (to[c] - paper[c]) * k);
    });
    image = sharp(rgb, { raw: { width: w, height: h, channels: 3 } });
  } else {
    const bytes = Uint8Array.from(px, v => Math.max(0, Math.min(255, Math.round(128 + level(v)))));
    image = sharp(bytes, { raw: { width: w, height: h, channels: 1 } });
  }
  const target = path.join(OUT, `${name}.webp`);
  await image.resize(tile, tile).webp({ quality: 70, effort: 6 }).toFile(target);
  console.log(`${name}.webp`, `${Math.round(fs.statSync(target).size / 1024)} KB`);
}
