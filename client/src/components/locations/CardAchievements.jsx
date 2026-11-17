import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { userAPI } from '../../services/api';
import { pageCache, pageKey } from '../../utils/pageCache';
import { achField } from '../../utils/achievementText';
import AchievementIcon from '../achievements/AchievementIcon';
import AchievementModal from '../achievements/AchievementModal';

// Related achievements under a card's story (2026-11-17, user's call): three
// at most, one to a row, no "more". Those that name the card (the place is on
// the list, or the achievement needs this quarter) come first, closest to done
// first; label counts the card feeds fill the rest the same way. Rarity
// counts are left out.
// The Map's own card panel doesn't use it: its bottom bar already lists them.

const SHOWN = 3;
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

// Two achievements list every card of a kind rather than chosen places, so they
// don't name the card: Veni, Vidi, Vici (every Legendary) is a rarity count and
// isn't shown (user's call, 2026-11-17); Around the World (every Embassy) is a
// label count and fills in like one.
const RARITY_LIST = new Set(['veni_vidi_vici']);
const LABEL_LIST = new Set(['around_the_world']);

export function namesCard(achievement, card) {
  if (RARITY_LIST.has(achievement.id) || LABEL_LIST.has(achievement.id)) return false;
  const r = asks(achievement);
  if (!r) return false;
  const places = [...(r.places ?? []), ...(r.picks ?? []).flatMap(g => g.places ?? [])];
  if (places.some(p => p.slug === card.slug)) return true;
  return !!(r.quarter?.name && r.quarter.name === card.quarter);
}

// Label counts only: a rarity count (Commonplace on every common card) says
// nothing about this card, so it isn't listed here (user's call, 2026-11-17).
export function countsCard(achievement, card) {
  const r = asks(achievement);
  if (!r) return false;
  if (LABEL_LIST.has(achievement.id)) return (r.places ?? []).some(p => p.slug === card.slug);
  const labels = [...(r.counts ?? []).flatMap(c => c.label.split('|')), ...(r.countsLabel ? [r.countsLabel] : [])];
  return labels.some(l => card.labels?.includes(l));
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
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let live = true;
    // refreshKey changes after a check-in here: the progress moved.
    loadAchievements(key, refreshKey > 0)
      .then(data => { if (live) setList(data.achievements); })
      .catch(() => { if (live) setList(prev => prev ?? []); });
    return () => { live = false; };
  }, [key, refreshKey]);

  const shown = useMemo(() => {
    if (!list || !loc) return [];
    const named = list.filter(a => namesCard(a, loc)).sort(byCloseness);
    const counted = list.filter(a => !named.includes(a) && countsCard(a, loc)).sort(byCloseness);
    return [...named, ...counted].slice(0, SHOWN);
  }, [list, loc]);

  if (!shown.length) return null;
  const name = a => convert(achField(a, 'name', lang));

  return (
    <section className="card-ach" aria-label={t('history.relatedAchievements')}>
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
      {open && createPortal(<AchievementModal achievement={open} onClose={() => setOpen(null)} />, document.body)}
    </section>
  );
}
