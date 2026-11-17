import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { userAPI } from '../../services/api';
import { pageCache, pageKey } from '../../utils/pageCache';
import { achField } from '../../utils/achievementText';
import AchievementIcon from '../achievements/AchievementIcon';
import AchievementModal from '../achievements/AchievementModal';

// Related achievements under a card's story (2026-11-17, user's call). Named
// ones (the place is on the list, or the achievement needs this quarter) get a
// row each, closest to done first, three at most until "more" is pressed; the
// label and rarity counts that every card of its kind feeds share one small
// line, or they would bury the rest. The Map's own card panel doesn't use it:
// its bottom bar already lists them.

const SHOWN = 3;
const ALSO_SHOWN = 3;
// The list comes from GET /user/achievements, shared with the Achievements
// page and History through pageCache. Refreshed in the background when older
// than this, so a run of opened cards costs one request, not one each.
const FRESH_MS = 60_000;
const fetchedAt = new Map();
const inFlight = new Map();

function loadAchievements(key, force = false) {
  const kept = pageCache.get(key);
  if (!force && kept && Date.now() - (fetchedAt.get(key) ?? 0) < FRESH_MS) return Promise.resolve(kept);
  if (!inFlight.has(key)) {
    inFlight.set(key, userAPI.getAchievements()
      .then(res => { pageCache.set(key, res.data); fetchedAt.set(key, Date.now()); return res.data; })
      .finally(() => inFlight.delete(key)));
  }
  return inFlight.get(key);
}

// What the achievement asks for: the player's progress, or a guest's `requires`.
const asks = a => a.progress ?? a.requires;

export function namesCard(achievement, card) {
  const r = asks(achievement);
  if (!r) return false;
  const places = [...(r.places ?? []), ...(r.picks ?? []).flatMap(g => g.places ?? [])];
  if (places.some(p => p.slug === card.slug)) return true;
  return !!(r.quarter?.name && r.quarter.name === card.quarter);
}

export function countsCard(achievement, card) {
  const r = asks(achievement);
  if (!r) return false;
  const labels = [...(r.counts ?? []).flatMap(c => c.label.split('|')), ...(r.countsLabel ? [r.countsLabel] : [])];
  if (labels.some(l => card.labels?.includes(l))) return true;
  return !!(r.countsRarity && r.countsRarity === card.rarity);
}

const share = a => (a.progress?.target ? a.progress.current / a.progress.target : 0);
// Not yet unlocked first, then closest to done.
const byCloseness = (a, b) => (a.unlocked ? 1 : 0) - (b.unlocked ? 1 : 0) || share(b) - share(a);

export default function CardAchievements({ loc, refreshKey }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const { user } = useAuth();
  const key = pageKey('achievements', user?._id);
  const [list, setList] = useState(() => pageCache.get(key)?.achievements ?? null);
  const [more, setMore] = useState(false);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let live = true;
    // refreshKey changes after a check-in here: the progress moved.
    loadAchievements(key, refreshKey > 0)
      .then(data => { if (live) setList(data.achievements); })
      .catch(() => { if (live) setList(prev => prev ?? []); });
    return () => { live = false; };
  }, [key, refreshKey]);

  const { named, counted } = useMemo(() => {
    if (!list || !loc) return { named: [], counted: [] };
    const n = list.filter(a => namesCard(a, loc)).sort(byCloseness);
    const c = list.filter(a => !n.includes(a) && countsCard(a, loc)).sort(byCloseness);
    return { named: n, counted: c };
  }, [list, loc]);

  if (!named.length && !counted.length) return null;
  const shown = more ? named : named.slice(0, SHOWN);
  const name = a => convert(achField(a, 'name', lang));

  return (
    <section className="card-ach" aria-label={t('history.relatedAchievements')}>
      {named.length > 0 && (
        <>
          <div className="card-ach__label">{t('history.relatedAchievements')}</div>
          <div className="card-ach__list">
            {shown.map(a => {
              const p = a.progress;
              return (
                <button key={a.id} type="button" className="card-ach__item" onClick={() => setOpen(a)}>
                  <span className={`ach-icon${a.unlocked ? '' : ' ach-icon--locked'}`} data-difficulty={a.difficulty}>
                    <AchievementIcon achievement={a} />
                  </span>
                  <span className="card-ach__body">
                    <span className="card-ach__head">
                      <span className="card-ach__name">{a.unlocked && '✓ '}{name(a)}</span>
                      {a.difficulty && (
                        <span className="ach-badge-pill" data-difficulty={a.difficulty}>{t(`ach.difficulty.${a.difficulty}`)}</span>
                      )}
                    </span>
                    {p ? (
                      <span className="ach-progress">
                        <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${Math.min(100, Math.round((p.current / p.target) * 100))}%` }} /></span>
                        <span className="ach-progress__count">{p.current} / {p.target}</span>
                      </span>
                    ) : (
                      <span className="card-ach__flavor">{convert(achField(a, 'flavor', lang))}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          {named.length > SHOWN && (
            <button type="button" className="card-ach__more" onClick={() => setMore(m => !m)}>
              {more ? t('detail.fewerAchievements') : t('detail.moreAchievements', { n: named.length - SHOWN })}
            </button>
          )}
        </>
      )}
      {counted.length > 0 && (
        <p className="card-ach__also">
          <span>{t('detail.alsoCounts')}</span>{' '}
          {counted.slice(0, ALSO_SHOWN).map((a, i) => (
            <span key={a.id}>
              {i > 0 && (lang === 'zh' ? '、' : ', ')}
              <button type="button" className="card-ach__also-link" onClick={() => setOpen(a)}>{name(a)}</button>
            </span>
          ))}
          {counted.length > ALSO_SHOWN && (lang === 'zh' ? '等' : ' …')}
        </p>
      )}
      {open && createPortal(<AchievementModal achievement={open} onClose={() => setOpen(null)} />, document.body)}
    </section>
  );
}
