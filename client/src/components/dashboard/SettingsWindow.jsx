import { useEffect } from 'react';
import { useWindowEntrance } from '../../hooks/useModalEntrance';
import { useT, useConvert } from '../../context/LanguageContext';

// The settings window, opened from the profile's header (2026-11-12, user's call:
// beside the leaderboard and privacy buttons, not at the bottom of the page). The
// things a player sets once on this device: the screen staying on. More can go in
// the list later. (A card animations switch was here until 2026-11-15: the card
// effects now run on the GPU, so it was dropped, user's call.)
export default function SettingsWindow({ wakeLock, onClose }) {
  const { overlayRef, modalRef, close } = useWindowEntrance(onClose);
  const t = useT();
  const convert = useConvert();
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  return (
    <div ref={overlayRef} className="px-overlay settings-overlay" onClick={e => e.target === e.currentTarget && close()}>
      <div ref={modalRef} className="px-modal settings-window" role="dialog" aria-label={convert(t('settings.title'))}>
        <button type="button" className="px-modal__close" onClick={close} aria-label={convert(t('areaGuide.close'))}>✕</button>
        <h2 className="px-title settings-window__title">{convert(t('settings.title'))}</h2>
        <ul className="settings-window__list">
          <li className="settings-row">
            <span className="settings-row__label">{convert(t('settings.wakeLock'))}</span>
            {wakeLock.supported ? (
              <button type="button" className="settings-switch" aria-pressed={wakeLock.active} onClick={wakeLock.toggle}>
                {convert(t(wakeLock.active ? 'settings.on' : 'settings.off'))}
              </button>
            ) : (
              <span className="settings-row__note">{convert(t('dashboard.wakeLockUnsupported'))}</span>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
