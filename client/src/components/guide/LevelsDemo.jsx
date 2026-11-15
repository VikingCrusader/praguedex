import { useState } from 'react';
import { useLang, useConvert } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { BOARD, fill } from '../../utils/guideBoard';

const levelTitle = (lvl, lang) => (lang === 'zh' ? (lvl.title_zh ?? lvl.title) : lang === 'cz' ? (lvl.title_cz ?? lvl.title) : lvl.title);

// The XP & Levels demo (2026-11-16, user's idea): a slider along all 100
// levels, showing each one's title and the XP it takes, with the levels on
// either side for context. A signed-in player starts on their own level,
// marked as theirs. `levels` comes from GET /api/user/achievements.
export default function LevelsDemo({ levels }) {
  const { lang } = useLang();
  const convert = useConvert();
  const { user } = useAuth();
  const b = (BOARD[lang] || BOARD.en).levels;
  const mine = user?.levelInfo?.level ?? user?.explorerLevel ?? null;
  const [at, setAt] = useState(() => mine ?? 1);
  if (!levels?.length) return <div className="spinner" />;
  const max = levels[levels.length - 1].level;
  const lvl = levels.find(l => l.level === at) ?? levels[0];
  const prev = levels.find(l => l.level === lvl.level - 1);
  const next = levels.find(l => l.level === lvl.level + 1);
  const xp = n => n.toLocaleString(lang === 'zh' ? 'zh-CN' : lang === 'cz' ? 'cs-CZ' : 'en-US');

  return (
    <div className="guide-levels">
      <label className="guide-hunt__slider">
        <span>{convert(b.slider)}: <strong>Lv {lvl.level}</strong></span>
        <input type="range" min={1} max={max} value={lvl.level} onChange={e => setAt(Number(e.target.value))} />
      </label>
      <div className={`guide-levels__card${mine === lvl.level ? ' is-mine' : ''}`}>
        <span className="guide-levels__lv">Lv {lvl.level}</span>
        <strong className="guide-levels__title">{convert(levelTitle(lvl, lang))}</strong>
        <span className="guide-levels__xp">{fill(convert(b.need), { xp: xp(lvl.xpRequired) })}</span>
        {mine === lvl.level && <span className="guide-levels__mine">{convert(b.you)}</span>}
      </div>
      <div className="guide-levels__around">
        {prev ? <button type="button" onClick={() => setAt(prev.level)}>‹ Lv {prev.level} · {convert(levelTitle(prev, lang))}</button> : <span />}
        {next ? <button type="button" onClick={() => setAt(next.level)}>Lv {next.level} · {convert(levelTitle(next, lang))} ›</button> : <span />}
      </div>
      <p className="guide-demo__hint">{convert(mine && mine !== lvl.level ? fill(b.hintMine, { n: mine }) : b.hint)}</p>
      {mine && mine !== lvl.level && (
        <button type="button" className="px-btn px-btn--outline guide-levels__back" onClick={() => setAt(mine)}>{convert(b.back)}</button>
      )}
    </div>
  );
}
