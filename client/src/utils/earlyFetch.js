import { locationAPI } from '../services/api';

// The Dex's card list is asked for as soon as the app starts (main.jsx), at
// the same time as the sign-in check, instead of after it (2026-11-27): the
// page itself only mounts once the check is done (ProtectedRoute), so on a
// cold start that was two round trips one after the other. The answer depends
// only on the token sent, so it is used only if the token is still the same.

let early = null;

export function startEarlyFetches() {
  const { pathname } = window.location;
  if (pathname !== '/' && pathname !== '/explore') return;
  const locations = locationAPI.getAll();
  locations.catch(() => {});
  early = { token: localStorage.getItem('token'), locations };
}

// The early answer, once; null if there is none or the token has changed.
export function takeEarlyLocations() {
  if (!early) return null;
  const { token, locations } = early;
  early = null;
  return token === localStorage.getItem('token') ? locations : null;
}
