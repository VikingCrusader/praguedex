import { useLang, useConvert, useT } from '../../context/LanguageContext';
import { HUNT_COMIC, HUNT_COMIC_TITLE } from '../../utils/huntComic';
import '../../styles/huntComic.css';

// The Treasure Hunt as a six-panel comic (utils/huntComic.js), after the
// page's joking lead. Default: a strip to swipe through on narrow screens,
// three across where there is room (a container query, so it fits the window
// it sits in). `cols`: always laid out whole, that many across (the board's
// left column on computers, 2026-11-16, user's call: all six spread out, the
// page as full as the Guide's).
export default function HuntComic({ title = true, lead = true, cols = 0 }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const pick = o => convert(o[lang] || o.en);

  return (
    <section className={`hunt-comic${cols ? ' hunt-comic--grid' : ''}`} style={cols ? { '--hunt-comic-cols': cols } : undefined}>
      {/* The page's joking lead goes first (2026-11-16, user's call). */}
      {lead && <p className="hunt-comic__lead">{t('draw.huntLead')}</p>}
      {title && <h3 className="guide-h3 hunt-comic__title">{pick(HUNT_COMIC_TITLE)}</h3>}
      <ol className="hunt-comic__strip">
        {HUNT_COMIC.map((p, i) => (
          <li key={i} className="hunt-comic__panel">
            <div className="hunt-comic__pic">
              <img src={`/guide/hunt-comic/${i + 1}.webp`} alt="" loading="lazy" width="800" height="800" />
              <span className="hunt-comic__dist">{pick(p.dist)}</span>
            </div>
            <p className="hunt-comic__text"><span className="hunt-comic__num">{i + 1}</span>{pick(p.text)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
