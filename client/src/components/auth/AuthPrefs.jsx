import { useT } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import LanguageSwitcher from '../shared/LanguageSwitcher';

// Language and theme above the log-in / sign-up box in the installed app on a
// phone (2026-11-26, user's call): signed out there is no header, no tab bar
// and no Settings, so a newcomer can pick them here, with a note on where
// they live afterwards. The website has them in its header.
export default function AuthPrefs() {
  const t = useT();
  const { theme, setTheme } = useTheme();
  return (
    <div className="auth-prefs">
      <div className="auth-prefs__row">
        <span className="auth-prefs__label">{t('settings.language')}</span>
        <LanguageSwitcher />
      </div>
      <div className="auth-prefs__row">
        <span className="auth-prefs__label">{t('settings.theme')}</span>
        <div className="lang-tabs">
          {['light', 'dark'].map(v => (
            <button key={v} type="button" className={`lang-tab${theme === v ? ' lang-tab--active' : ''}`} aria-pressed={theme === v} onClick={() => setTheme(v)}>
              {t(`settings.${v}`)}
            </button>
          ))}
        </div>
      </div>
      <p className="auth-prefs__note">{t('auth.prefsNote')}</p>
    </div>
  );
}
