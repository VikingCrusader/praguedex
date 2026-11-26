import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useT } from '../../context/LanguageContext';
import NavIcon from './NavIcons';

// The installed app's tab bar on phones (2026-11-26, user's design; see
// utils/appMode.js): it takes the header's place, at the bottom. History, the
// Guide, Achievements, the leaderboard (with the players it leads to) and the
// privacy page open from More, so its tab stays lit there.
export const TABS = [
  { to: '/explore',       icon: 'explore',      label: 'nav.explore' },
  { to: '/map',           icon: 'map',          label: 'nav.map' },
  { to: '/treasure-hunt', icon: 'treasureHunt', label: 'nav.treasureHunt' },
  { to: '/more',          icon: 'more',         label: 'nav.more',       under: ['/history', '/guide', '/achievements', '/leaderboard', '/explorer', '/privacy'] },
  { to: '/dashboard',     icon: 'dashboard',    label: 'nav.tabProfile' },
];

const within = (pathname, base) => pathname === base || pathname.startsWith(`${base}/`);

// The tab a page belongs to (its own, or the one it was opened from).
export function tabOf(pathname) {
  return TABS.find(tab => within(pathname, tab.to) || tab.under?.some(p => within(pathname, p))) ?? null;
}

export default function BottomNav() {
  const { user, guest } = useAuth();
  const { pathname } = useLocation();
  const t = useT();
  if (!user && !guest) return null;
  const current = tabOf(pathname);

  return (
    <nav className="bottom-nav" aria-label={t('nav.tabs')}>
      {TABS.map(tab => {
        const active = current === tab;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`bottom-nav__tab${active ? ' bottom-nav__tab--active' : ''}`}
            aria-current={active && pathname === tab.to ? 'page' : undefined}
          >
            <NavIcon name={tab.icon} />
            <span className="bottom-nav__label">{t(tab.label)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// The app's top row (2026-11-26): the wordmark in the middle, as in the
// website's header (a tap reloads, the app has no reload button), and on the
// pages that sit under More (History, Guide, Achievements, the leaderboard,
// players, privacy) a Back button on its left, since
// the installed app has no browser Back button. Back goes back if there is a
// page to go back to inside the app, otherwise to the tab's own page. It
// scrolls away with the page.
export function AppTopBar() {
  const { user, guest } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const t = useT();
  const tab = tabOf(pathname);
  const showBack = (user || guest) && tab && pathname !== tab.to;
  const back = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate(tab.to, { replace: true, state: { turn: 'back' } });
  };
  return (
    <header className="app-topbar">
      {showBack && (
        <button type="button" className="app-topbar__back" onClick={back}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          {t('nav.back')}
        </button>
      )}
      <button type="button" className="app-topbar__logo" onClick={() => window.location.reload()}>
        <span className="navbar__logo-mark app-topbar__mark" aria-hidden="true" />
        {t('appName')}
      </button>
    </header>
  );
}
