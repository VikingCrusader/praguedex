import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useT } from '../context/LanguageContext';
import { useWakeLock } from '../hooks/useWakeLock';
import NavIcon from '../components/shared/NavIcons';
import SettingsWindow from '../components/dashboard/SettingsWindow';

// "More" (2026-11-26, user's design): in the installed app on phones the
// tab bar has room for five tabs, so History, the Guide, Achievements, the
// leaderboard (signed-in players only, like its page) and Settings share this
// one. Each page tile opens the page as it is everywhere else; Settings opens
// the same window as the profile's button on the website. Privacy and Log out
// (Log in for a guest) sit in a small row at the bottom (2026-11-26, user's
// call: the profile only shows what the player has done). The page fills
// exactly one screen on every phone: the tiles share the height between the
// top row and the tab bar (pixelart.css, .more-page).
const ENTRIES = [
  { to: '/history',      icon: 'history',      title: 'nav.history',      blurb: 'more.historyBlurb' },
  { to: '/guide',        icon: 'guide',        title: 'nav.guide',        blurb: 'more.guideBlurb' },
  { to: '/achievements', icon: 'achievements', title: 'nav.achievements', blurb: 'more.achievementsBlurb' },
  { to: '/leaderboard',  icon: 'leaderboard',  title: 'nav.leaderboard',  blurb: 'more.leaderboardBlurb', userOnly: true },
  { settings: true,      icon: 'settings',     title: 'settings.title',   blurb: 'more.settingsBlurb' },
];

const Chevron = () => (
  <svg className="more-tile__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export default function MorePage() {
  const t = useT();
  const { user, guest, logout } = useAuth();
  const navigate = useNavigate();
  const wakeLock = useWakeLock();
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <div className="more-page">
      <h1 className="px-title more-page__title">{t('nav.more')}</h1>
      <ul className="more-page__list">
        {ENTRIES.filter(e => user || !e.userOnly).map(e => {
          const inner = (
            <>
              <span className="more-tile__icon"><NavIcon name={e.icon} size={30} /></span>
              <span className="more-tile__text">
                <span className="more-tile__title">{t(e.title)}</span>
                <span className="more-tile__blurb">{t(e.blurb)}</span>
              </span>
              <Chevron />
            </>
          );
          return (
            <li key={e.title}>
              {e.settings
                ? <button type="button" className="more-tile more-tile--settings" onClick={() => setSettingsOpen(true)}>{inner}</button>
                : <Link to={e.to} className="more-tile">{inner}</Link>}
            </li>
          );
        })}
      </ul>
      <div className="more-page__foot">
        <Link to="/privacy" className="more-page__link">{t('privacy.title')}</Link>
        {user ? (
          <button type="button" className="more-page__link more-page__logout" onClick={() => { logout(); navigate('/login'); }}>{t('nav.logout')}</button>
        ) : guest ? (
          <button type="button" className="more-page__link more-page__login" onClick={() => navigate('/login')}>{t('nav.login')}</button>
        ) : null}
      </div>
      {settingsOpen && <SettingsWindow wakeLock={wakeLock} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
