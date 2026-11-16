import { RARITY_XP, RARITY_COLOR, RARITY_LABEL, expeditionGem, isFindable } from '../utils/rarity.js';

const TIERS = ['common', 'rare', 'superior', 'epic', 'mythic', 'legend'];

describe('RARITY_XP', () => {
  test('covers all six tiers in order', () => {
    expect(Object.keys(RARITY_XP)).toEqual(TIERS);
  });

  test('matches server-side values', () => {
    expect(RARITY_XP).toEqual({ common: 10, rare: 20, superior: 30, epic: 50, mythic: 70, legend: 100 });
  });

  test('values are strictly ascending', () => {
    const values = Object.values(RARITY_XP);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe('RARITY_COLOR', () => {
  test('has an entry for every tier, plus expedition and secret', () => {
    expect(Object.keys(RARITY_COLOR)).toEqual([...TIERS, 'expedition', 'secret']);
  });

  test('every value is a valid six-digit hex colour', () => {
    const invalid = Object.entries(RARITY_COLOR).filter(([, c]) => !/^#[0-9a-fA-F]{6}$/.test(c));
    expect(invalid).toEqual([]);
  });

  test('superior tier uses the distinctive green (#2c8c03)', () => {
    expect(RARITY_COLOR.superior).toBe('#2c8c03');
  });

  test('legend tier uses gold (#FFD700)', () => {
    expect(RARITY_COLOR.legend).toBe('#FFD700');
  });
});

describe('RARITY_LABEL', () => {
  test('has English, Czech, and Chinese entries', () => {
    expect(Object.keys(RARITY_LABEL)).toEqual(expect.arrayContaining(['en', 'cz', 'zh']));
  });

  test('each language covers all six tiers, plus expedition and secret', () => {
    for (const labels of Object.values(RARITY_LABEL)) {
      expect(Object.keys(labels)).toEqual([...TIERS, 'expedition', 'secret']);
    }
    expect(RARITY_LABEL.zh.expedition).toBe('远征');
    expect(RARITY_LABEL.zh.secret).toBe('秘藏');
  });

  test('no label value is an empty string', () => {
    const empty = Object.entries(RARITY_LABEL).flatMap(([lang, labels]) =>
      Object.entries(labels).filter(([, v]) => !v).map(([k]) => `${lang}.${k}`)
    );
    expect(empty).toEqual([]);
  });
});

describe('expeditionGem', () => {
  test('maps each XP step to its stone', () => {
    expect([60, 120, 180, 240, 300].map(expeditionGem)).toEqual(['bronze', 'pearl', 'diamond', 'diamond', 'diamond']);
  });
  test('falls back to bronze for a missing or odd value', () => {
    expect(expeditionGem(undefined)).toBe('bronze');
    expect(expeditionGem(150)).toBe('pearl');
  });
});

describe('isFindable', () => {
  test('an uncollected secret card is hidden, a collected one and every other card show', () => {
    expect(isFindable({ rarity: 'secret', unlocked: false })).toBe(false);
    expect(isFindable({ rarity: 'secret', unlocked: true })).toBe(true);
    expect(isFindable({ rarity: 'expedition', unlocked: false })).toBe(true);
    expect(isFindable({ rarity: 'common' })).toBe(true);
  });

  test('an uncollected secret card shows near the player: 3 km, or 8 km for a city', () => {
    const fort = { rarity: 'secret', unlocked: false, labels: ['ruin'], coordinates: { lat: 50, lng: 14 } };
    const city = { ...fort, labels: ['city'] };
    const at = km => ({ lat: 50 + km / 111.2, lng: 14 });
    expect(isFindable(fort, at(2.9))).toBe(true);
    expect(isFindable(fort, at(3.1))).toBe(false);
    expect(isFindable(city, at(7.9))).toBe(true);
    expect(isFindable(city, at(8.1))).toBe(false);
    expect(isFindable(fort, null)).toBe(false);
  });
});
