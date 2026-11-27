import { lazy } from 'react';

// Pages other than the Dex are split off the main bundle (2026-11-27): the map
// library, History, the Guide's texts and the rest no longer slow down start-up.
// Once the boot splash is gone they are all fetched in the background
// (main.jsx: preloadPages), so going to one later doesn't wait. The page the
// app opens on is fetched straight away, and the splash waits for it.

const pages = [];

export function lazyPage(path, load) {
  let promise = null;
  const preload = () => {
    if (!promise) promise = load().catch(err => { promise = null; throw err; });
    return promise;
  };
  pages.push({ path, preload });
  return lazy(preload);
}

// The page this load opens on: fetched now, the boot splash waits for it.
export function preloadStartPage() {
  const { pathname } = window.location;
  const page = pages.find(p => pathname === p.path || pathname.startsWith(`${p.path}/`));
  if (page) (window.bootSplashHolds ||= []).push(page.preload().catch(() => {}));
}

export function preloadPages() {
  pages.forEach(p => { p.preload().catch(() => {}); });
}
