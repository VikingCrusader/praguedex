import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWindowEntrance } from '../../hooks/useModalEntrance';
import LocationDetail from '../locations/LocationDetail';
import PackDetail from '../packs/PackDetail';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { quarterName } from '../../utils/pragueQuarters';
import { RARITY_LABEL, RARITY_ICON, RARITY_VAR } from '../../utils/rarity';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';
import { achField, formatPercent, formatAchDate, SHOW_UNLOCK_RATE } from '../../utils/achievementText';
import AchievementIcon from './AchievementIcon';

// The History Timeline's first event, which links a Secret card (Pičhora).
const SECRET_HISTORY_EVENT = 'early-history';

// The three Expedition frames, by XP step (Decked in Jewels' checklist).
const EXPEDITION_FRAME = {
  en: { 60: 'Silver', 120: 'Amber', 180: 'Platinum' },
  cz: { 60: 'stříbro', 120: 'jantar', 180: 'platina' },
  zh: { 60: '白银', 120: '琥珀', 180: '铂金' },
};

// Detail of one achievement: the one-line flavor, the exact requirement, the
// user's progress (with the places, for "check in at these places" ones),
// when it was unlocked and how many players have it. Fields the caller
// doesn't have (another explorer's progress, the unlock rate) are skipped.
export default function AchievementModal({ achievement: ach, onClose }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const text = field => convert(achField(ach, field, lang));
  const p = ach.progress;
  const [openSlug, setOpenSlug] = useState(null);
  const [openPack, setOpenPack] = useState(null);
  const { overlayRef, modalRef, close } = useWindowEntrance(onClose);
  // What the achievement asks for (places, packs, labels): from the progress,
  // or for a guest, who has none, from `requires` (2026-11-15).
  const r = p ?? ach.requires;
  const pct = p ? Math.min(100, Math.round((p.current / p.target) * 100)) : 0;
  // A label or rarity leads to the Explore cards it counts; no underline (user's call).
  const toExplore = (filter, content, className = '') => (
    <Link
      className={`ach-filter-link${className}`}
      to="/explore"
      state={{ ...filter, showAll: filter.rarity === 'expedition' || filter.label === 'outside' }}
      onClick={onClose}
    >
      {content}
    </Link>
  );
  const labelText = l => `${LABEL_DEFINITIONS[l]?.emoji || ''} ${convert(LABEL_DEFINITIONS[l]?.[lang] || LABEL_DEFINITIONS[l]?.en || l)}`.trim();
  const rarityText = r => convert((RARITY_LABEL[lang] || RARITY_LABEL.en)[r]);
  // The named cards as the area guides' landmark tags (2026-11-14, user's call):
  // collected ones in gold with a tick, each opening its card.
  const renderPlaces = list => (
    <ul className="area-guide__landmarks ach-place-tags">
      {list.map(pl => (
        <li key={pl.slug} className={`area-guide__landmark${pl.done ? ' area-guide__landmark--got' : ''}`}>
          {pl.missing
            ? <span className="ach-places__missing">{pl.slug} · {t('ach.noCard')}</span>
            : (
              <button type="button" className="ach-places__open" onClick={() => setOpenSlug(pl.slug)}>
                {pl.done && <span aria-label={t('areaGuide.landmarkCollected')}>✓ </span>}
                {convert(getLocName(pl, lang))}
              </button>
            )}
        </li>
      ))}
    </ul>
  );

  const lists = r && (
    <>
            {r.countsLabel && (
              <div className="ach-modal__sublabel" style={{ marginTop: 8 }}>
                {toExplore({ label: r.countsLabel }, t('ach.seeCards', { name: labelText(r.countsLabel) }), ' ach-filter-link--gold')}
              </div>
            )}
            {r.countsRarity && (
              <div className="ach-modal__sublabel" style={{ marginTop: 8 }}>
                {toExplore({ rarity: r.countsRarity }, t('ach.seeCards', { name: rarityText(r.countsRarity) }), ' ach-filter-link--gold')}
              </div>
            )}
            {r.counts && r.counts.map(c => (
              <div className="ach-modal__quarter" key={c.label}>
                <div className="ach-modal__sublabel">
                  {/* "a|b": one bar for cards with either label (Art Lover) */}
                  {c.label.split('|').map((l, i) => <span key={l}>{i > 0 && ' / '}{toExplore({ label: l }, labelText(l))}</span>)}
                </div>
                {p && (
                  <div className="ach-progress">
                    <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${Math.min(100, Math.round((c.current / c.target) * 100))}%` }} /></span>
                    <span className="ach-progress__count">{c.current} / {c.target}</span>
                  </div>
                )}
              </div>
            ))}
            {r.labels && (
              <ul className="ach-places ach-places--rarities">
                {r.labels.map(l => (
                  <li key={l.label} className={`ach-places__item${l.done ? ' ach-places__item--done' : ''}`}>
                    <span className="ach-places__mark" aria-hidden="true">{l.done ? '✓' : '○'}</span>
                    {toExplore({ label: l.label }, labelText(l.label))}
                  </li>
                ))}
              </ul>
            )}
            {r.places?.length > 0 && r.picks && (
              <div className="ach-modal__sublabel" style={{ marginTop: 10 }}>{t('ach.required')}</div>
            )}
            {r.places?.length > 0 && renderPlaces(r.places)}
            {r.picks?.map((g, i) => (
              <div key={i}>
                <div className="ach-modal__sublabel" style={{ marginTop: 10 }}>
                  {g.label
                    ? t('ach.pickNOf', { group: convert(g.label[lang] || g.label.en), n: g.need })
                    : t('ach.pickN', { n: g.need })}
                </div>
                {renderPlaces(g.places)}
              </div>
            ))}
            {r.packs && (
              <div>
                <div className="ach-modal__sublabel" style={{ marginTop: 10 }}>{t('ach.pickNPacks', { n: r.packs.need })}</div>
                <ul className="ach-places">
                  {r.packs.items.map(pk => (
                    <li key={pk.slug} className={`ach-places__item${pk.done ? ' ach-places__item--done' : ''}`}>
                      <span className="ach-places__mark" aria-hidden="true">{pk.done ? '✓' : '○'}</span>
                      <button type="button" className="ach-places__open" onClick={() => setOpenPack(pk.slug)}>{convert(getLocName(pk, lang))}</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {r.rarities && (
              <ul className="ach-places ach-places--rarities">
                {r.rarities.map(item => (
                  <li key={item.step ? `${item.rarity}-${item.step}` : item.rarity} className={`ach-places__item${item.done ? ' ach-places__item--done' : ''}`}>
                    <span className="ach-places__mark" aria-hidden="true">{item.done ? '✓' : '○'}</span>
                    {(() => {
                      const content = <><span style={{ color: RARITY_VAR[item.rarity] }}>{RARITY_ICON[item.rarity]}</span> {rarityText(item.rarity)}{item.step ? ` · ${convert((EXPEDITION_FRAME[lang] || EXPEDITION_FRAME.en)[item.step])}` : ''}</>;
                      // Secret cards aren't on Explore: they are found on the
                      // History page, so Secret opens its first event, which
                      // links one (Pičhora; user's call, 2026-11-16).
                      return item.rarity === 'secret'
                        ? <Link className="ach-filter-link" to={`/history?event=${SECRET_HISTORY_EVENT}`} onClick={onClose}>{content}</Link>
                        : toExplore({ rarity: item.rarity }, content);
                    })()}
                  </li>
                ))}
              </ul>
            )}
    </>
  );

  return (
    <>
    <div ref={overlayRef} className="px-overlay" onClick={close}>
      <div
        ref={modalRef}
        className={`px-modal ach-modal${ach.unlocked ? ' ach-modal--unlocked' : ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label={text('name')}
      >
        <button className="px-modal__close" onClick={close} aria-label="✕">✕</button>
        <div className="ach-modal__head">
          <span className={`ach-icon ach-icon--lg${ach.unlocked ? '' : ' ach-icon--locked'}`} data-difficulty={ach.difficulty}><AchievementIcon achievement={ach} /></span>
          <div style={{ minWidth: 0 }}>
            <div className="ach-modal__name">{text('name')}</div>
            {ach.flavor && <div className="ach-modal__flavor">{text('flavor')}</div>}
            {(ach.difficulty || ach.xp > 0) && (
              <div className="ach-modal__badges">
                {ach.difficulty && (
                  <span className="ach-badge-pill" data-difficulty={ach.difficulty}>
                    {t('ach.difficulty')}: {t(`ach.difficulty.${ach.difficulty}`)}
                  </span>
                )}
                {ach.xp > 0 && <span className="ach-badge-pill ach-badge-pill--xp" data-difficulty={ach.difficulty}>+{ach.xp} XP</span>}
              </div>
            )}
          </div>
        </div>

        {ach.story && (
          <div className="ach-modal__section ach-modal__story">
            <div className="ach-modal__label">{t('ach.story')}</div>
            {text('story').split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}
          </div>
        )}

        <div className="ach-modal__section">
          <div className="ach-modal__label">{t('ach.requirement')}</div>
          <p className="ach-modal__req">{text('description')}</p>
          {!p && lists}
        </div>

        {p && (
          <div className="ach-modal__section">
            <div className="ach-modal__label">{t('ach.progress')}</div>
            <div className="ach-progress">
              <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${pct}%` }} /></span>
              <span className="ach-progress__count">{p.current} / {p.target}{p.unit ? ` ${p.unit}` : ''}</span>
            </div>
            {p.note && (
              <div className="ach-modal__sublabel" style={{ marginTop: 8 }}>
                {t('ach.closest', { name: convert(p.note[lang] || p.note.en) })}
              </div>
            )}
            {lists}
            {p.district && (
              <div className="ach-modal__sublabel" style={{ marginTop: 8 }}>
                {t('ach.closestDistrict', { district: convert(t('detail.district', { n: p.district.replace(/^Praha /, '') })) })}
              </div>
            )}
            {p.quarter && (
              <div className="ach-modal__quarter">
                <div className="ach-modal__sublabel">{t('ach.quarterProgress', { quarter: convert(quarterName(p.quarter.name, lang)) })}</div>
                <div className="ach-progress">
                  <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${Math.min(100, Math.round((p.quarter.current / p.quarter.target) * 100))}%` }} /></span>
                  <span className="ach-progress__count">{p.quarter.current} / {p.quarter.target}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="ach-modal__meta">
          {ach.unlocked
            ? <span className="ach-modal__date">{t('ach.unlockedOn', { date: formatAchDate(ach.unlockedAt, lang) })}</span>
            : <span>{t('common.locked')}</span>}
          {SHOW_UNLOCK_RATE && ach.unlockRate != null && <span>{t('ach.rate', { pct: formatPercent(ach.unlockRate, lang) })}</span>}
        </div>
        {ach.historyEvents?.length > 0 && (
          <div className="ach-modal__section ach-modal__history">
            {ach.historyEvents.map(event => (
              <Link key={event.slug} to={`/history?event=${event.slug}`} onClick={onClose}>
                {t('ach.readHistory')}: {convert(event.title[lang] || event.title.en)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    {/* After the overlay and on its level, so on top of it. */}
    {openSlug && <LocationDetail slug={openSlug} onClose={() => setOpenSlug(null)} />}
    {openPack && <PackDetail slug={openPack} onClose={() => setOpenPack(null)} />}
    </>
  );
}
