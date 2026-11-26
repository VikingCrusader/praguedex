import { test, expect, devices } from '@playwright/test';

// The installed app's layout on phones (utils/appMode.js): no header, a tab
// bar at the bottom, History/Guide/Achievements behind More, theme and
// language in Settings. `?pwa=1` turns it on in an ordinary tab.
const { defaultBrowserType, ...iPhone } = devices['iPhone 13'];
test.use({ ...iPhone });

// The profile's figures (as in dashboard.spec.js), so the page doesn't wait on a real API.
const PROGRESS = {
  totalCheckins: 5,
  presetCheckins: 4,
  totalPreset: 10,
  unlockPercent: 40,
  cityCheckins: 3,
  totalCity: 8,
  cityUnlockPercent: 38,
  labelCount: { historical: 2, church: 1 },
  rarityCount: { common: 1, rare: 2, superior: 1, epic: 0, mythic: 0, legend: 1 },
  levelInfo: { level: 2, title: 'Apprentice Explorer', progress: 40, nextLevelXP: 200 },
  totalXP: 140,
  rank: 12,
  week: { cards: 5, xp: 380, rankChange: { delta: 3 } },
  recentFinds: {
    treasure: { count: 0, cards: [] },
    expedition: {
      count: 8,
      cards: ['Karlstejn', 'Melnik', 'Roztoky', 'Kutna Hora', 'Cesky Krumlov', 'Krivoklat'].map(name => ({
        slug: name.toLowerCase().replace(/\W+/g, '-'), name, localizedNames: { cz: name, zh: name },
        labels: ['castle', 'outside'], rarity: 'expedition', coverImage: '', pixelArtKey: '',
      })),
    },
  },
  districtProgress: Array.from({ length: 22 }, (_, i) => ({ district: `Praha ${i + 1}`, total: 40 + i, collected: (i * 7) % 30 })),
};

test.beforeEach(async ({ page }) => {
  await page.route('**/api/packs', route => route.fulfill({ json: [] }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.route('**/api/history**', route => route.fulfill({ json: [] }));
});

test('the website on a phone keeps its header', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.locator('.navbar')).toBeVisible();
  await expect(page.locator('.bottom-nav')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveClass(/pwa/);
});

test('the app has a tab bar at the bottom and no header', async ({ page }) => {
  await page.goto('/explore?pwa=1');
  await expect(page.locator('html')).toHaveClass(/pwa/);
  await expect(page.locator('.navbar')).toHaveCount(0);
  // Only the wordmark on top, no Back on a tab's own page.
  await expect(page.locator('.app-topbar__logo')).toBeVisible();
  await expect(page.locator('.app-topbar__back')).toHaveCount(0);
  const nav = page.locator('.bottom-nav');
  await expect(nav.locator('.bottom-nav__tab')).toHaveCount(5);
  await expect(nav.locator('.bottom-nav__tab--active')).toHaveAttribute('href', '/explore');
  // Sits on the bottom edge of the screen.
  const box = await nav.boundingBox();
  expect(Math.abs(box.y + box.height - page.viewportSize().height)).toBeLessThan(2);
  // No slogan over the cards.
  await expect(page.locator('.explore-title')).toHaveCount(0);
  // Kept for the session: a plain URL stays in the app layout.
  await page.goto('/map');
  await expect(page.locator('.bottom-nav')).toBeVisible();
});

test('More leads to History, Guide and Achievements, with a way back', async ({ page }) => {
  await page.goto('/explore?pwa=1');
  await page.locator('.bottom-nav a[href="/more"]').click();
  await expect(page).toHaveURL(/\/more$/);
  const tiles = page.locator('.more-tile');
  await expect(tiles).toHaveCount(4);
  await expect(page.locator('.app-topbar__back')).toHaveCount(0);

  await page.locator('.more-tile[href="/achievements"]').click();
  await expect(page).toHaveURL(/\/achievements$/);
  // More stays lit on the pages under it.
  await expect(page.locator('.bottom-nav__tab--active')).toHaveAttribute('href', '/more');
  await page.locator('.app-topbar__back').click();
  await expect(page).toHaveURL(/\/more$/);
});

test('opened straight on a page under More, Back goes to More', async ({ page }) => {
  await page.goto('/guide?pwa=1');
  await page.locator('.app-topbar__back').click();
  await expect(page).toHaveURL(/\/more$/);
});

test('the profile has no buttons in the app; a guest logs in from More', async ({ page }) => {
  await page.route('**/api/user/progress', route => route.fulfill({ json: PROGRESS }));
  await page.route('**/api/user/achievements', route => route.fulfill({ json: { players: 4, levels: [], achievements: [] } }));
  await page.goto('/dashboard?pwa=1');
  await expect(page.locator('.dashboard-title')).toBeVisible();
  await expect(page.locator('.dashboard-actions')).toHaveCount(0);
  await page.goto('/more');
  await expect(page.locator('.more-page__logout')).toHaveCount(0);
  await page.locator('.more-page__login').click();
  await expect(page).toHaveURL(/\/login$/);
});

test('Settings under More set the language and the theme', async ({ page }) => {
  await page.goto('/more?pwa=1');
  // A guest gets no leaderboard tile (the page is for signed-in players).
  await expect(page.locator('.more-tile')).toHaveCount(4);
  await page.locator('.more-tile--settings').click();
  const win = page.locator('.settings-window');
  await expect(win).toBeVisible();

  await win.locator('.lang-tab', { hasText: '中文' }).click();
  await expect(page.locator('.bottom-nav a[href="/more"]')).toContainText('更多');
  await expect(page.locator('.bottom-nav a[href="/dashboard"]')).toContainText('主页');

  const dark = win.locator('.settings-row').nth(1).locator('.lang-tab').nth(1);
  await dark.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await win.locator('.settings-row').nth(1).locator('.lang-tab').nth(0).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('a signed-in player finds the leaderboard under More', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: { _id: 'u1', username: 'explorer', totalXP: 140, explorerLevel: 2 } } }));
  await page.route('**/api/user/leaderboard**', route => route.fulfill({ json: [] }));
  await page.goto('/more?pwa=1');
  await expect(page.locator('.more-tile')).toHaveCount(5);
  await page.locator('.more-tile[href="/leaderboard"]').click();
  await expect(page).toHaveURL(/\/leaderboard$/);
  await expect(page.locator('.bottom-nav__tab--active')).toHaveAttribute('href', '/more');
});

const SIGNED_IN = async page => {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: { _id: 'u1', username: 'explorer', totalXP: 140, explorerLevel: 2 } } }));
};

test('Privacy and Log out sit at the bottom of More', async ({ page }) => {
  await SIGNED_IN(page);
  await page.goto('/more?pwa=1');
  await page.locator('.more-page__link[href="/privacy"]').click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.locator('.bottom-nav__tab--active')).toHaveAttribute('href', '/more');
  await page.locator('.app-topbar__back').click();
  await page.locator('.more-page__logout').click();
  await expect(page).toHaveURL(/\/login$/);
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
});

test('signed out, language and theme sit above the log-in box', async ({ page }) => {
  await page.goto('/login?pwa=1');
  // The wordmark stays alone in the middle of the top row.
  await expect(page.locator('.app-topbar > *')).toHaveCount(1);
  const prefs = page.locator('.auth-prefs');
  await expect(prefs).toBeVisible();
  const [p, box] = [await prefs.boundingBox(), await page.locator('.auth-box').boundingBox()];
  expect(p.y + p.height).toBeLessThanOrEqual(box.y);
  await prefs.locator('.lang-tab', { hasText: 'CZ' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-lang', 'cz');
  await prefs.locator('.lang-tab', { hasText: 'Tmavý' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(prefs.locator('.auth-prefs__note')).toContainText('Nastavení');
  await page.goto('/register');
  await expect(page.locator('.auth-prefs')).toBeVisible();
});

test('the website keeps the log-in page as it was', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('.auth-prefs')).toHaveCount(0);
});

test('the tab bar holds still while a long page turns in', async ({ page }) => {
  // A turning page used to stick out at the side, the phone zoomed out to
  // fit it, and the tab bar jumped (2026-11-26).
  await page.route('**/api/locations', route => route.fulfill({
    json: Array.from({ length: 60 }, (_, i) => ({
      slug: `place-${i}`, name: `Place ${i}`, localizedNames: { cz: `Místo ${i}`, zh: `地点${i}` },
      labels: ['church'], rarity: 'common', coordinates: { lat: 50.08, lng: 14.42 }, district: 'Praha 1',
    })),
  }));
  await page.goto('/more?pwa=1');
  const nav = page.locator('.bottom-nav');
  const rest = (await nav.boundingBox()).y;
  await page.evaluate(() => {
    window.__moves = [];
    const t0 = performance.now();
    const tick = () => {
      window.__moves.push([document.querySelector('.bottom-nav').getBoundingClientRect().top, window.innerWidth]);
      if (performance.now() - t0 < 1000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.locator('.bottom-nav a[href="/explore"]').click();
  await page.waitForTimeout(1100);
  const moves = await page.evaluate(() => window.__moves);
  const width = page.viewportSize().width;
  expect(moves.filter(([top, w]) => Math.abs(top - rest) > 1 || w !== width)).toEqual([]);
});
