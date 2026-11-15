import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, ScaleControl, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { useLang, useConvert, useT } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { useUserPosition } from '../../hooks/useUserPosition';
import { getCurrentPosition } from '../../utils/geolocation';
import { hasLocationConsent } from '../../utils/locationConsent';
import MapVectorBase from './MapVectorBase';
import { useTheme } from '../../context/ThemeContext';
import { useAfterTurn } from '../shared/PageTurn';
import CZECH_BORDER from '../../utils/czechBorder.json';

const PRAGUE_CENTER = [50.0755, 14.4378];

const ZOOM_RADIUS = { 10:5, 11:5, 12:5, 13:5, 14:5, 15:6, 16:8, 17:10, 18:10 };

const TOUCH_RADIUS = 2; // a finger needs a bigger target

function scaledRadius(zoom, isSelected) {
  const r = ZOOM_RADIUS[Math.min(Math.max(zoom, 10), 18)] ?? 3;
  return isSelected ? Math.min(r + 3, 13) : r;
}

function Markers({ locations, selectedSlug, onLocationClick, lang, convert, nightMap, touch }) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  // Rounded: ZOOM_RADIUS has whole levels, and fitting an area can stop between them.
  useMapEvents({ zoomend: (e) => setZoom(Math.round(e.target.getZoom())) });
  const userPos = useUserPosition();

  return (
    <>
      {locations.map(loc => {
        const isSelected = loc.slug === selectedSlug;
        // Dark dots disappear on the night map, so locked places are white there.
        const color = loc.unlocked ? '#FFD700' : nightMap ? '#fff' : '#555';
        const fill  = loc.unlocked ? '#FFD700' : nightMap ? '#fff' : '#333';
        return (
          <CircleMarker
            key={loc._id}
            center={[loc.coordinates.lat, loc.coordinates.lng]}
            radius={scaledRadius(zoom, isSelected) + (touch ? TOUCH_RADIUS : 0)}
            pathOptions={{
              color:       isSelected ? (nightMap ? '#FFD700' : '#fff') : color,
              fillColor:   fill,
              fillOpacity: loc.unlocked || nightMap ? 0.9 : 0.6,
              weight:      isSelected ? 3 : 2,
            }}
            bubblingMouseEvents={false}
            eventHandlers={{ click: () => onLocationClick(loc.slug) }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
              <span style={{ fontFamily: 'var(--ui-font-text)', fontSize: 15 }}>
                {loc.unlocked ? '★ ' : '🔒 '}{convert(getLocName(loc, lang))}
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}
      {/* Drawn last, so the user's own dot stays on top of the place
          markers instead of disappearing under them in the city centre. */}
      {userPos && (
        <CircleMarker
          center={[userPos.lat, userPos.lng]}
          radius={(ZOOM_RADIUS[Math.min(Math.max(zoom, 10), 18)] ?? 3) + 4}
          pathOptions={{ color: '#fff', fillColor: '#e63946', fillOpacity: 1, weight: 2 }}
          interactive={false}
        />
      )}
    </>
  );
}

// Bounding boxes: Prague's administrative boundary (OSM relation 435514)
// and the Czech Republic.
export const PRAGUE_BOUNDS  = [[49.9419, 14.2244], [50.1774, 14.7068]];
const CZECHIA_BOUNDS = [[48.55, 12.09], [51.06, 18.86]];
// Central Bohemia (Středočeský kraj, round Prague): where "Show all" opens
// (2026-11-15, user's call), since most expedition cards are there.
export const CENTRAL_BOHEMIA_BOUNDS = [[49.53, 13.42], [50.6, 15.55]];
// The fence for the area in play: Prague with a margin and a soft edge; the
// Czech Republic's own box, hard, so the map can be dragged anywhere in the
// country but not past its border (user's call, 2026-11-15; Leaflet fences are
// boxes, so the corners still show a little of the neighbours).
const fenceOf = (cityOnly) => (cityOnly ? padBounds(PRAGUE_BOUNDS, 0.25) : CZECHIA_BOUNDS);
// Grow a [[s, w], [n, e]] box by a fraction of its size on every side.
const padBounds = ([[s, w], [n, e]], f) => {
  const dy = (n - s) * f, dx = (e - w) * f;
  return [[s - dy, w - dx], [n + dy, e + dx]];
};

// The map stays on the area in play, Prague ("City only") or the Czech
// Republic ("Show all"): the minimum zoom just fits it in the current map
// size (recomputed on resize), and panning is fenced to it (fenceOf). In the
// city, dragging past the fence meets some resistance and springs back,
// animated, on release (Leaflet's maxBounds with a viscosity below 1); the
// country's fence is hard (viscosity 1).
// The border's box is only the outer fence: its corners lie in Germany,
// Poland and Austria. With "Show all", whenever a move ends with the view's
// centre outside the border itself (utils/czechBorder.json, from
// scripts/buildCzechBorder.mjs), the map glides back to just inside the
// nearest point of it (user's call, 2026-11-15: not past the border).
function insideBorder({ lat, lng }) {
  let inside = false;
  for (let i = 0, j = CZECH_BORDER.length - 1; i < CZECH_BORDER.length; j = i++) {
    const [yi, xi] = CZECH_BORDER[i];
    const [yj, xj] = CZECH_BORDER[j];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
// The nearest point of the border, a little way in towards the country's middle.
const BORDER_MIDDLE = [49.8, 15.47];
function backInside({ lat, lng }) {
  const k = Math.cos((lat * Math.PI) / 180); // a degree of longitude is shorter
  let best = null;
  let bestD = Infinity;
  for (let i = 0, j = CZECH_BORDER.length - 1; i < CZECH_BORDER.length; j = i++) {
    const [ay, ax] = CZECH_BORDER[j];
    const [by, bx] = CZECH_BORDER[i];
    const dx = (bx - ax) * k, dy = by - ay;
    const len = dx * dx + dy * dy;
    const t = len ? Math.max(0, Math.min(1, (((lng - ax) * k) * dx + (lat - ay) * dy) / len)) : 0;
    const py = ay + t * dy, px = ax + (t * dx) / k;
    const d = ((px - lng) * k) ** 2 + (py - lat) ** 2;
    if (d < bestD) { bestD = d; best = [py, px]; }
  }
  return [best[0] + (BORDER_MIDDLE[0] - best[0]) * 0.03, best[1] + (BORDER_MIDDLE[1] - best[1]) * 0.03];
}

function MapAreaLimit({ cityOnly }) {
  const map = useMap();
  useEffect(() => {
    if (cityOnly) return undefined;
    const keepInside = () => {
      const centre = map.getCenter();
      if (!insideBorder(centre)) map.panTo(backInside(centre), { duration: 0.35 });
    };
    map.on('moveend', keepInside);
    return () => { map.off('moveend', keepInside); };
  }, [map, cityOnly]);
  useEffect(() => {
    const apply = () => {
      // getBoundsZoom clamps to the current minZoom and maxBounds, so reset
      // both first.
      map.setMaxBounds(null);
      map.setMinZoom(0);
      const z = map.getBoundsZoom(cityOnly ? PRAGUE_BOUNDS : CZECHIA_BOUNDS);
      map.setMinZoom(z);
      map.options.maxBoundsViscosity = cityOnly ? 0.6 : 1;
      map.setMaxBounds(fenceOf(cityOnly));
      if (map.getZoom() < z) map.setZoom(z);
    };
    apply();
    map.on('resize', apply);
    return () => { map.off('resize', apply); };
  }, [map, cityOnly]);
  return null;
}

// On opening, the map starts on Prague's centre and moves to the user once
// their first position comes in. It moves only once, only if the user hasn't
// dragged the map yet, and only if they are inside the area in play
// (otherwise MapAreaLimit's fence would pull the view straight back).
const USER_ZOOM = 15;

// The 2K layout's two ways of moving the view, top right. It opens on the whole city
// and goes to the player only when asked, and only if they are inside the area in play.
function ViewButtons({ cityOnly, extra }) {
  const map = useMap();
  const t = useT();
  const userPos = useUserPosition();
  const ref = useRef(null);
  useEffect(() => { L.DomEvent.disableClickPropagation(ref.current); }, []);
  const [[s, w], [n, e]] = fenceOf(cityOnly);
  const canLocate = userPos && userPos.lat >= s && userPos.lat <= n && userPos.lng >= w && userPos.lng <= e;
  return (
    <div ref={ref} className="map-view-buttons">
      {canLocate && (
        <button type="button" className="filter-btn" onClick={() => map.flyTo([userPos.lat, userPos.lng], Math.max(map.getZoom(), USER_ZOOM), { duration: 0.8 })}>
          {t('map.locateMe')}
        </button>
      )}
      <button type="button" className="filter-btn" onClick={() => map.flyToBounds(PRAGUE_BOUNDS, { duration: 0.8 })}>
        {t('map.viewCity')}
      </button>
      {extra && <button type="button" className="filter-btn" onClick={extra.onClick}>{extra.label}</button>}
    </div>
  );
}

// Top left, in place of the zoom buttons. Hidden until its picture exists.
function Compass() {
  const [missing, setMissing] = useState(false);
  if (missing) return null;
  return <img className="map-compass" src="/map/compass.webp" alt="" onError={() => setMissing(true)} />;
}

function AskForPosition() {
  // Signed-in users already have a position watcher (useProximityDetection);
  // guests don't, so ask once here. The result reaches useUserPosition
  // through the shared cache. Only with location consent: opening the map
  // doesn't bring up the consent dialog.
  useEffect(() => { if (hasLocationConsent()) getCurrentPosition().catch(() => {}); }, []);
  return null;
}

export default function MapView({ locations, selectedSlug, onLocationClick, cityOnly = false, viewButton = null, touch = false, children = null }) {
  const { lang } = useLang();
  const convert = useConvert();
  const [vectorFailed, setVectorFailed] = useState(false);
  const { theme } = useTheme();
  // The street map (WebGL setup) and the markers wait until the page has
  // turned in; building them in the click's own task froze the switch.
  const afterTurn = useAfterTurn();

  return (
    <MapContainer
      center={PRAGUE_CENTER}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      {!afterTurn ? null : !vectorFailed ? <MapVectorBase onFail={() => setVectorFailed(true)} /> : (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}
      <MapAreaLimit cityOnly={cityOnly} />
      <AskForPosition />
      <ViewButtons cityOnly={cityOnly} extra={viewButton} />
      <Compass />
      <ScaleControl position="bottomleft" imperial={false} />
      {afterTurn && <Markers
        locations={locations}
        selectedSlug={selectedSlug}
        onLocationClick={onLocationClick}
        lang={lang}
        convert={convert}
        nightMap={!vectorFailed && theme === 'dark'}
        touch={touch}
      />}
      {children}
    </MapContainer>
  );
}
