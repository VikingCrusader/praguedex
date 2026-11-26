// Line icons for the app's bottom tab bar and the More page (2026-11-26).
// One style: 24x24, 1.8 px rounded strokes in currentColor, so they follow
// the theme and the active tab's gold.

const PATHS = {
  // A card in front of another.
  explore: (
    <>
      <path d="M16 3H6.5A2.5 2.5 0 0 0 4 5.5V17" />
      <rect x="8" y="6.5" width="12" height="15" rx="2" />
      <path d="M14 10.5l2.4 3.25L14 17l-2.4-3.25z" />
    </>
  ),
  // A folded map.
  map: (
    <>
      <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </>
  ),
  // A chest.
  treasureHunt: (
    <>
      <path d="M3.5 11V8.5A4.5 4.5 0 0 1 8 4h8a4.5 4.5 0 0 1 4.5 4.5V11" />
      <rect x="3.5" y="11" width="17" height="9" rx="1.5" />
      <rect x="10.5" y="9.5" width="3" height="4" rx="0.8" />
    </>
  ),
  // Four tiles.
  more: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </>
  ),
  // A person.
  dashboard: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  // A podium.
  leaderboard: (
    <>
      <path d="M3 20.5h18" />
      <path d="M4.5 20.5V14h5v6.5M9.5 20.5V9h5v11.5M14.5 20.5V12h5v8.5" />
      <path d="M12 3.2l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 5.3l2-.3z" />
    </>
  ),
  // A cog.
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="6.8" />
      <path strokeWidth="3" strokeLinecap="butt" d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.35 5.35l1.85 1.85M16.8 16.8l1.85 1.85M5.35 18.65l1.85-1.85M16.8 7.2l1.85-1.85" />
    </>
  ),
  // An open book.
  history: (
    <>
      <path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5z" />
      <path d="M12 6.5v13" />
    </>
  ),
  // A compass.
  guide: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  // A medal on its ribbon.
  achievements: (
    <>
      <path d="M8.5 10 5.5 3h4l2.5 4.5L14.5 3h4l-3 7" />
      <circle cx="12" cy="15" r="5.5" />
      <circle cx="12" cy="15" r="2.2" />
    </>
  ),
};

export default function NavIcon({ name, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="nav-icon"
    >
      {PATHS[name]}
    </svg>
  );
}
