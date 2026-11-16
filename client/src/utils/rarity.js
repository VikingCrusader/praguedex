import { useMemo } from 'react';
import { haversineDistance } from './geolocation';
export const RARITY_XP = { common: 10, rare: 20, superior: 30, epic: 50, mythic: 70, legend: 100 };

export const KING_LOCK_RARITIES = ['epic', 'mythic', 'legend', 'expedition', 'secret'];
export const isKingLockRarity = (rarity) => KING_LOCK_RARITIES.includes(rarity);
export const lockClosedIcon = (rarity) => isKingLockRarity(rarity) ? '/pixel-art/lock-closed-king.webp' : '/pixel-art/lock-closed.webp';
export const lockOpenIcon = (rarity) => isKingLockRarity(rarity) ? '/pixel-art/lock-open-king.webp' : '/pixel-art/lock-open.webp';

export const RARITY_COLOR = {
  common:   '#EBE8D9',
  rare:     '#87CEEB',
  superior: '#2c8c03',
  epic:     '#BA55D3',
  mythic:   '#c40202',
  legend:   '#FFD700',
  expedition: '#C9D1DB',
  secret: '#7FDCCF',
};

// CSS-variable form of RARITY_COLOR for inline styles, so the colours
// follow the light/dark theme (values defined in global.css). Use this in
// components; RARITY_COLOR stays as the hex source of truth for dark mode.
export const RARITY_VAR = Object.fromEntries(
  Object.keys(RARITY_COLOR).map((r) => [r, `var(--rarity-${r})`])
);

// One symbol per tier, getting fancier as the rarity rises (2026-10-09,
// user request): circle, triangle, diamond, five-point star, six-point star,
// crown. U+FE0E keeps the crown a text glyph (some platforms would draw it
// as a colour emoji that ignores the rarity colour).
export const RARITY_ICON = {
  common:   '\u25CF',
  rare:     '\u25B2',
  superior: '\u25C6',
  epic:     '\u2605',
  mythic:   '\u2736',
  legend:   '\u265B\uFE0E',
  expedition: '\u2756',
  secret: '\u25c8',
};

export const RARITY_LABEL = {
  en: { common: 'Common', rare: 'Rare', superior: 'Superior', epic: 'Epic', mythic: 'Mythic',     legend: 'Legendary',  expedition: 'Expedition', secret: 'Secret' },
  cz: { common: 'Běžné',  rare: 'Vzácné', superior: 'Výjimečné', epic: 'Epické', mythic: 'Mýtické', legend: 'Legendární', expedition: 'Výprava', secret: 'Tajné' },
  zh: { common: '常见',   rare: '稀有',   superior: '卓越',       epic: '史诗',   mythic: '神话',     legend: '传说',       expedition: '远征', secret: '秘藏' },
};

// Secret (秘藏 / Secret / Tajné, 2026-11-15, user's design): outside cards
// found only through the History Timeline (server rarityMap.js SECRET_SLUGS),
// on an obsidian card of their own. Not in ALL_RARITIES, so no filter offers
// it. Explore, the Map and the Guide drop an uncollected one from their lists
// (isFindable); a collected one shows like any card. The proximity alerts
// still know them all, so one still collects on the spot. Since 2026-11-16
// (user's call) an uncollected one also shows on Explore, the Map and search
// while the player is near it: within 8 km of a city card (the card's point
// is the city centre, and a city reaches further) and 3 km of any other. It
// goes again once the player leaves; nothing is remembered.
export const SECRET_NEAR_M = 3000;
export const SECRET_NEAR_CITY_M = 8000;
export const secretNearRadius = (l) => (l.labels?.includes('city') ? SECRET_NEAR_CITY_M : SECRET_NEAR_M);
export const isFindable = (l, pos) => {
  if (l.rarity !== 'secret' || l.unlocked) return true;
  if (!pos || !l.coordinates) return false;
  return haversineDistance(pos.lat, pos.lng, l.coordinates.lat, l.coordinates.lng) <= secretNearRadius(l);
};
// Explore's and the Map's card list: every findable card. The list keeps its
// identity while the position moves without changing which secret cards are
// in reach, so the pages don't redo their sorting on every GPS fix.
export function useFindable(all, pos) {
  const near = all
    .filter(l => l.rarity === 'secret' && !l.unlocked && isFindable(l, pos))
    .map(l => l.slug).join(' ');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => {
    const reach = new Set(near.split(' '));
    return all.filter(l => l.rarity !== 'secret' || l.unlocked || reach.has(l.slug));
  }, [all, near]);
}
// A rarity list with Secret added last, once the player has a secret card
// (2026-11-15, user's call): the profile's and the collection's rarity counts
// and the Explore and Map filters (with Show all) only offer it then.
export const withSecret = (rarities, hasSecret) => (hasSecret ? [...rarities, 'secret'] : rarities);
export const hasSecretCard = (locations) => !!locations?.some(l => l.rarity === 'secret' && l.unlocked);

// Expedition (远征, 2026-10-16): the one rarity for cards outside Prague,
// with a silver frame. Its XP is set by distance (server rarityMap.js), and
// each of its five XP steps sets a different stone in the frame.
export const CITY_RARITIES = ['common', 'rare', 'superior', 'epic', 'mythic', 'legend'];
export const ALL_RARITIES = [...CITY_RARITIES, 'expedition'];
// Three stones (2026-10-16, user's call: diamonds for everything from 180 up).
export const EXPEDITION_GEMS = { 60: 'bronze', 120: 'pearl', 180: 'diamond' };
export const expeditionGem = (xp) => {
  const steps = Object.keys(EXPEDITION_GEMS).map(Number);
  const step = steps.filter(s => s <= (xp ?? 0)).pop() ?? steps[0];
  return EXPEDITION_GEMS[step];
};
