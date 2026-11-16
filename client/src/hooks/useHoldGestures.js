import { useEffect, useRef, useState } from 'react';

// Showcase gestures on a card or pack: hold this long on a touch screen.
const LONG_PRESS_MS = 450;

// Long press (touch) or right click (mouse) opens the showcase; a click is
// always a plain tap, at once. (A double click opened it until 2026-11-16, which
// made every mouse click wait 250 ms for a possible second one; user's call.)
// `enabled`: false makes every click a plain tap and leaves the browser's own
// context menu alone.
// `showcaseOpen` is how it was opened ('touch' or 'mouse'), or false.
export function useHoldGestures({ enabled, onTap }) {
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const press = useRef({ timer: null, fired: false, x: 0, y: 0, pointer: 'mouse' });
  const clearPress = () => { clearTimeout(press.current.timer); press.current.timer = null; };
  useEffect(() => () => clearTimeout(press.current.timer), []);

  const handlers = {
    onClick: () => {
      if (press.current.fired) { press.current.fired = false; return; }
      onTap();
    },
    onPointerDown: e => {
      press.current.pointer = e.pointerType;
      if (!enabled || e.pointerType === 'mouse') return;
      press.current.fired = false;
      press.current.x = e.clientX;
      press.current.y = e.clientY;
      clearPress();
      press.current.timer = setTimeout(() => {
        press.current.fired = true;
        navigator.vibrate?.(12);
        setShowcaseOpen('touch');
      }, LONG_PRESS_MS);
    },
    onPointerMove: e => {
      if (press.current.timer && Math.hypot(e.clientX - press.current.x, e.clientY - press.current.y) > 10) clearPress();
    },
    onPointerUp: clearPress,
    onPointerCancel: clearPress,
    onPointerLeave: clearPress,
    // The finger that opened the showcase lifts over it: cancel the mouse
    // events and click the browser would emulate, or they land on the
    // showcase and close it again at once.
    onTouchEnd: e => { if (press.current.fired) e.preventDefault(); },
    // A touch long press also fires contextmenu (Android): the timer above
    // handles that one, so only a mouse (or pen) right click opens it here.
    onContextMenu: enabled ? e => {
      e.preventDefault();
      if (press.current.pointer !== 'touch') setShowcaseOpen('mouse');
    } : undefined,
  };

  return { handlers, showcaseOpen, closeShowcase: () => setShowcaseOpen(false) };
}
