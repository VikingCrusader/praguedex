import { getRarity, RARITY_XP, expeditionXP, resolveRarity, EXPEDITION_XP_OVERRIDES, SECRET_SLUGS, SECRET_XP } from '../src/data/rarityMap.js';
import { historyEvents } from '../src/data/seedHistoryEvents.js';

describe('RARITY_XP', () => {
  test('has all six tiers', () => {
    expect(Object.keys(RARITY_XP)).toEqual(['common', 'rare', 'superior', 'epic', 'mythic', 'legend']);
  });

  test('XP values are correct', () => {
    expect(RARITY_XP.common).toBe(10);
    expect(RARITY_XP.rare).toBe(20);
    expect(RARITY_XP.superior).toBe(30);
    expect(RARITY_XP.epic).toBe(50);
    expect(RARITY_XP.mythic).toBe(70);
    expect(RARITY_XP.legend).toBe(100);
  });

  test('values are strictly ascending', () => {
    const values = Object.values(RARITY_XP);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe('getRarity', () => {
  test('returns "legend" for top landmarks', () => {
    expect(getRarity('prague-castle')).toBe('legend');
    expect(getRarity('charles-bridge')).toBe('legend');
    expect(getRarity('astronomical-clock')).toBe('legend');
    expect(getRarity('national-theatre')).toBe('legend');
  });

  test('returns "epic" for off-the-beaten-path locations', () => {
    expect(getRarity('husuv-sbor-vinohrady')).toBe('epic');
    expect(getRarity('novy-svet')).toBe('epic');
    expect(getRarity('kafka-rotating-head')).toBe('epic');
    expect(getRarity('cisarsky-ostrov')).toBe('epic');
  });

  test('returns "rare" for smart-tourist locations', () => {
    expect(getRarity('pinkas-synagogue')).toBe('rare');
    expect(getRarity('mucha-museum')).toBe('rare');
    expect(getRarity('john-lennon-wall')).toBe('rare');
    expect(getRarity('zizkov-tv-tower')).toBe('rare');
  });

  test('returns "common" for unknown slugs', () => {
    expect(getRarity('this-does-not-exist')).toBe('common');
    expect(getRarity('random-place-xyz')).toBe('common');
  });

  test('returns "common" for empty string', () => {
    expect(getRarity('')).toBe('common');
  });

  test('all returned values are valid rarity tiers', () => {
    const validTiers = new Set(Object.keys(RARITY_XP));
    for (const slug of ['prague-castle', 'pinkas-synagogue', 'husuv-sbor-vinohrady', 'unknown']) {
      expect(validTiers.has(getRarity(slug))).toBe(true);
    }
  });
});

describe('expedition (outside Prague)', () => {
  const at = km => ({ lat: 50.0865 + km / 111.2, lng: 14.4114 }); // due north of Charles Bridge

  test('steps by distance from Charles Bridge: 60 / 120 / 180 / 240 / 300', () => {
    expect(expeditionXP('x', at(10))).toBe(60);
    expect(expeditionXP('x', at(30))).toBe(120);
    expect(expeditionXP('x', at(75))).toBe(180);
    expect(expeditionXP('x', at(120))).toBe(240);
    expect(expeditionXP('x', at(200))).toBe(300);
  });

  test('overrides win over distance (Karlštejn is 23 km out but pays 240)', () => {
    expect(expeditionXP('karlstejn-castle', at(23))).toBe(240);
    expect(expeditionXP('kriz-svate-ludmily-tetin', at(75))).toBe(60);
  });

  test('every override is one of the five steps', () => {
    const steps = new Set([60, 120, 180, 240, 300]);
    expect(Object.values(EXPEDITION_XP_OVERRIDES).filter(v => !steps.has(v))).toEqual([]);
  });

  test('resolveRarity: outside cards are expedition, city cards keep their tier', () => {
    expect(resolveRarity({ slug: 'x', labels: ['castle', 'outside'], coordinates: at(30), rarity: 'legend' }))
      .toEqual({ rarity: 'expedition', xpReward: 120 });
    expect(resolveRarity({ slug: 'x', labels: ['castle'], coordinates: at(1), rarity: 'epic' }))
      .toEqual({ rarity: 'epic', xpReward: 50 });
    expect(resolveRarity({ slug: 'x', labels: ['castle'], coordinates: at(1), rarity: 'expedition' }))
      .toEqual({ rarity: 'common', xpReward: 10 });
  });
});

describe('secret cards', () => {
  test('a secret outside card is rarity secret with the raised XP', () => {
    // Vladař is 86 km out: expedition 180, secret 270.
    const vladar = { lat: 50.0786, lng: 13.2131 };
    expect(resolveRarity({ slug: 'hora-vladar', labels: ['prehistory', 'outside'], coordinates: vladar }))
      .toEqual({ rarity: 'secret', xpReward: 270 });
    // The same place under another slug stays expedition.
    expect(resolveRarity({ slug: 'x', labels: ['outside'], coordinates: vladar }))
      .toEqual({ rarity: 'expedition', xpReward: 180 });
  });

  test('a secret slug without the outside label is an ordinary city card', () => {
    expect(resolveRarity({ slug: 'brno', labels: ['city'], rarity: 'epic' })).toEqual({ rarity: 'epic', xpReward: 50 });
  });

  test('SECRET_XP raises every step', () => {
    expect(SECRET_XP).toEqual({ 60: 90, 120: 150, 180: 270, 240: 360, 300: 500 });
  });

  // The only way to find a secret card is as a related landmark on the
  // History Timeline, so every one must be linked from at least one event.
  test('every secret card is linked from the History Timeline', () => {
    const linked = new Set(historyEvents.flatMap(e => (e.relatedLandmarks || []).map(r => r.slug)));
    expect([...SECRET_SLUGS].filter(s => !linked.has(s))).toEqual([]);
  });
});
