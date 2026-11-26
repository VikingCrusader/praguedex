import { createContext, startTransition, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PWA_LAYOUT } from '../../utils/appMode';
import { TABS, tabOf } from './BottomNav';

// Each page turns in like a page of a book (2026-11-12): forward navigation
// brings it in from the right, going back from the left. Keyed by the path, so
// moving within a page (?event=, a filter in the URL) doesn't turn it again.
// The first page a visitor lands on doesn't turn. The animation carries no
// fill, so no transform is left on the page afterwards (fixed pop-ups inside
// it keep working). Reduced motion is handled in pixelart.css.
//
// Heavy pages wait for the turn (2026-11-13): mounting all of Explore's cards
// or the Map's markers in the click's own task froze the old page for about
// 300 ms and then ate the turn's first frames. Such a page renders a light
// first frame and the rest once the turn is over (`useAfterTurn`).

// Must match the page-turn animations in pixelart.css (0.32 s), plus a little.
const TURN_MS = 340;

// When the current page started turning in (performance.now()), 0 when it didn't.
const TurnContext = createContext(0);

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// The page turns away as soon as a navbar link is pressed (2026-11-13): the
// old page starts sliding out at once, and the new page only mounts two
// frames later. A transform/opacity animation runs on the compositor, so it
// keeps playing while the main thread is busy mounting the new page, and the
// click never looks frozen. Only navbar (and app tab bar) links: other links may carry router
// state, which isn't in the DOM.
function useTurnAway(pageRef) {
  const navigate = useNavigate();
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.('.navbar a[href], .bottom-nav a[href]');
      if (!link || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      const page = pageRef.current;
      if (!page || reducedMotion()) return;
      // The router's own Link sees this and leaves the navigation to us.
      e.preventDefault();
      // The class goes on in the next frame, not here: the navbar's own click
      // handler reads the links' positions right after this, and a style change
      // made first would force a fresh layout of the whole old page (~30 ms on
      // Explore). The navigation follows a frame later, once the turn is playing.
      requestAnimationFrame(() => {
        page.classList.add('page-turn--leaving');
        requestAnimationFrame(() => navigate(url.pathname + url.search + url.hash));
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate, pageRef]);
}

// Swiping between pages in the installed app on phones (2026-11-26, user's
// design). On a tab's own page a sideways swipe goes to the next tab (left)
// or the one before (right), in the tab bar's order; on a page under a tab
// (History, Guide, Achievements, ...) a swipe right goes back. The page
// follows the finger, and past a third of the screen (or on a quick flick)
// it turns: it slides on out, and the new page comes in from the side the
// finger came from. Short of that it springs back. With nowhere to go it
// only gives a little. Only transform and opacity move.
//
// Left alone, so their own gestures keep working: the map, anything that
// scrolls sideways (History's axis, the hunt comic, card rows), form fields,
// windows and sheets, and the page while pinch-zoomed. A mostly vertical
// drag is a scroll and is never taken over.
const SWIPE_LOCK = 10;          // px before the drag picks a direction
const SWIPE_TURN = 0.3;         // of the screen width, to turn on release
const SWIPE_FLICK = 0.45;       // px/ms, a quick flick turns from 40 px
const SWIPE_OUT_MS = 170;

function scrollsSideways(el, page) {
  for (let n = el; n && n !== page; n = n.parentElement) {
    if (n.scrollWidth > n.clientWidth + 1) {
      const ox = getComputedStyle(n).overflowX;
      if (ox === 'auto' || ox === 'scroll') return true;
    }
  }
  return false;
}

function useSwipeTurn(pageRef, enabled) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, guest } = useAuth();
  const on = enabled && !!(user || guest);
  useEffect(() => {
    if (!on) return undefined;
    // Where a swipe each way leads from here: { to, back } or null.
    const tab = tabOf(pathname);
    const i = tab ? TABS.indexOf(tab) : -1;
    const onTabPage = tab && pathname === tab.to;
    const goBack = () => {
      if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
      else navigate(tab.to, { replace: true, state: { turn: 'back' } });
    };
    const targets = {
      // Finger moving left: the next page comes in from the right.
      left: onTabPage && i < TABS.length - 1 ? () => navigate(TABS[i + 1].to) : null,
      right: !tab ? null
        : onTabPage ? (i > 0 ? () => navigate(TABS[i - 1].to, { state: { turn: 'back' } }) : null)
        : goBack,
    };

    let g = null; // the gesture in progress
    const page = () => pageRef.current;
    const setStyle = (el, x, fade, ms) => {
      el.style.transition = ms ? `transform ${ms}ms ease-out, opacity ${ms}ms ease-out` : 'none';
      el.style.transform = x ? `translateX(${x}px)` : '';
      el.style.opacity = fade ? String(fade) : '';
    };
    const shown = (dx) => {
      const go = dx < 0 ? targets.left : targets.right;
      if (!go) return Math.sign(dx) * Math.min(Math.abs(dx) * 0.22, 40); // nowhere to go
      return dx;
    };
    const fadeFor = (x, width) => 1 - Math.min(0.45, (Math.abs(x) / width) * 0.6);

    const onStart = (e) => {
      g = null;
      const el = page();
      if (!el || e.touches.length !== 1 || (window.visualViewport?.scale ?? 1) > 1.01) return;
      const t = e.target;
      if (!el.contains(t)) return;
      if (t.closest?.('.leaflet-container, input, textarea, select, [contenteditable], [role="dialog"], .px-overlay, .card-showcase, [data-no-swipe]')) return;
      if (scrollsSideways(t, el)) return;
      const { clientX: x, clientY: y } = e.touches[0];
      g = { x0: x, y0: y, dx: 0, locked: null, samples: [[performance.now(), x]] };
    };
    const onMove = (e) => {
      if (!g) return;
      const { clientX: x, clientY: y } = e.touches[0];
      const dx = x - g.x0;
      const dy = y - g.y0;
      if (!g.locked) {
        if (Math.abs(dx) < SWIPE_LOCK && Math.abs(dy) < SWIPE_LOCK) return;
        if (Math.abs(dx) < Math.abs(dy) * 1.2) { g = null; return; } // a scroll
        g.locked = true;
        g.x0 = x; // start following from here, so the page doesn't jump
      }
      e.preventDefault();
      g.dx = x - g.x0;
      g.samples.push([performance.now(), x]);
      if (g.samples.length > 6) g.samples.shift();
      const el = page();
      const width = window.innerWidth;
      const shownX = shown(g.dx);
      setStyle(el, shownX, fadeFor(shownX, width), 0);
    };
    const onEnd = () => {
      const cur = g;
      g = null;
      if (!cur?.locked) return;
      const el = page();
      if (!el) return;
      const width = window.innerWidth;
      const [t0, x0] = cur.samples[0];
      const [t1, x1] = cur.samples[cur.samples.length - 1];
      const speed = t1 > t0 ? (x1 - x0) / (t1 - t0) : 0;
      const go = cur.dx < 0 ? targets.left : targets.right;
      const far = Math.abs(cur.dx) > width * SWIPE_TURN;
      const flick = Math.abs(cur.dx) > 40 && Math.abs(speed) > SWIPE_FLICK && Math.sign(speed) === Math.sign(cur.dx);
      if (go && (far || flick)) {
        const out = Math.sign(cur.dx) * width * 0.45;
        setStyle(el, out, 0.01, SWIPE_OUT_MS);
        setTimeout(go, SWIPE_OUT_MS - 20);
      } else {
        setStyle(el, 0, 0, 220);
        setTimeout(() => { if (el.style.transform === '' || el.style.transform === 'none') el.style.transition = ''; }, 240);
      }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [on, pathname, navigate, pageRef]);
}

export default function PageTurn({ children }) {
  const location = useLocation();
  const { pathname } = location;
  // Back: the browser's Back, or a swipe to the page before (useSwipeTurn).
  const back = useNavigationType() === 'POP' || location.state?.turn === 'back';
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; }, []);
  const pageRef = useRef(null);
  useTurnAway(pageRef);
  useSwipeTurn(pageRef, PWA_LAYOUT);
  const turn = !mounted.current ? '' : back ? ' page-turn--back' : ' page-turn--forward';
  const started = useRef({ path: null, at: 0 });
  if (started.current.path !== pathname) {
    started.current = { path: pathname, at: turn && !reducedMotion() ? performance.now() : 0 };
  }
  return (
    <TurnContext.Provider value={started.current.at}>
      <div key={pathname} ref={pageRef} className={`page-turn${turn}`}>{children}</div>
    </TurnContext.Provider>
  );
}

// False while the page is still turning in, then true for good. The switch is
// a transition, so React renders the rest of the page in slices instead of one
// long task. Mounted later on the same page (or with no turn), it is true at once.
export function useAfterTurn() {
  const at = useContext(TurnContext);
  const left = () => at + TURN_MS - performance.now();
  const [done, setDone] = useState(() => !at || left() <= 0);
  useEffect(() => {
    if (done) return undefined;
    const id = setTimeout(() => startTransition(() => setDone(true)), Math.max(0, left()));
    return () => clearTimeout(id);
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps
  return done;
}
