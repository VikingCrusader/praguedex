// The Czech Republic's border, simplified to about 1 km, for the Map's "Show
// all" fence (MapView.jsx: the view's centre is kept inside it, user's call
// 2026-11-15). From ČÚZK's RÚIAN service, layer 19 (Stat), the same service
// buildPragueAreas.mjs reads. Writes src/utils/czechBorder.json as [lat, lng]
// pairs. Run by hand: node scripts/buildCzechBorder.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL = 'https://ags.cuzk.gov.cz/arcgis/rest/services/RUIAN/Prohlizeci_sluzba_nad_daty_RUIAN/MapServer/19/query'
  + '?where=1%3D1&returnGeometry=true&outSR=4326&maxAllowableOffset=0.01&f=json';

const res = await fetch(URL);
const json = await res.json();
const rings = json.features?.[0]?.geometry?.rings;
if (!rings?.length) throw new Error('no border in the answer');
// The state is one ring; keep the largest in case the service splits it.
const ring = rings.reduce((a, b) => (b.length > a.length ? b : a));
const border = ring.map(([lng, lat]) => [Math.round(lat * 1000) / 1000, Math.round(lng * 1000) / 1000]);
const target = path.join(root, 'src', 'utils', 'czechBorder.json');
fs.writeFileSync(target, JSON.stringify(border));
console.log(`czechBorder.json: ${border.length} points, ${Math.round(fs.statSync(target).size / 1024)} KB`);
