import { isHandheld, isStandalone } from './installPrompt';

// The installed app's own layout on phones (2026-11-26, user's design): no
// header, a tab bar at the bottom (Dex, Map, Treasure, More, Profile), History,
// Guide and Achievements behind More, theme and language in Settings. The
// website on a phone keeps the header.
//
// Decided once at start: an installed app doesn't change mode while it runs,
// and turning a phone doesn't make it a tablet. Phones only: an iPad or a
// computer with the app installed keeps the website's layout.
//
// `?pwa=1` shows the layout in an ordinary browser tab (for checking it
// without installing; kept for the tab's session), `?pwa=0` turns that off.

const KEY = 'pwaLayoutPreview';

function previewFlag() {
  try {
    const q = new URLSearchParams(window.location.search).get('pwa');
    if (q === '1') sessionStorage.setItem(KEY, '1');
    else if (q === '0') sessionStorage.removeItem(KEY);
    return sessionStorage.getItem(KEY) === '1';
  } catch (_) {
    return false;
  }
}

function detect() {
  if (typeof window === 'undefined') return false;
  if (previewFlag()) return true;
  const shortSide = Math.min(window.screen?.width ?? Infinity, window.screen?.height ?? Infinity);
  return isStandalone() && isHandheld() && shortSide < 600;
}

export const PWA_LAYOUT = detect();

// Called once from main.jsx, before the first render: the `pwa` class on
// <html> drives the CSS, and the status bar area becomes the app's own (the
// page is drawn under it, padded by env(safe-area-inset-*)).
export function applyAppMode() {
  if (!PWA_LAYOUT) return;
  document.documentElement.classList.add('pwa');
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp && !/viewport-fit/.test(vp.content)) vp.setAttribute('content', `${vp.content}, viewport-fit=cover`);
}
