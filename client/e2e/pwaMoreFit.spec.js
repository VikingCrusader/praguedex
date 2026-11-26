import { test, expect, devices } from '@playwright/test';

// "More" fills exactly one screen on every phone (user's call, 2026-11-26):
// no scrolling, nothing cut off, its last row right above the tab bar.
const PHONES = ['iPhone SE', 'iPhone 8', 'iPhone 13', 'iPhone 14 Pro Max', 'Pixel 7', 'Galaxy S9+', 'Galaxy S5'];

for (const name of PHONES) {
  const { defaultBrowserType, ...phone } = devices[name];
  test.describe(name, () => {
    test.use({ ...phone });
    for (const lang of ['en', 'cz', 'zh']) {
      test(`More fits one screen (${lang})`, async ({ page }) => {
        await page.addInitScript(l => {
          localStorage.setItem('lang', l);
          localStorage.setItem('token', 'fake-jwt-token');
        }, lang);
        await page.route('**/api/auth/me', route => route.fulfill({ json: { user: { _id: 'u1', username: 'explorer', totalXP: 140, explorerLevel: 2 } } }));
        await page.route('**/api/packs', route => route.fulfill({ json: [] }));
        await page.goto('/more?pwa=1');
        await expect(page.locator('.more-tile')).toHaveCount(5);
        await page.evaluate(() => document.fonts.ready);
        const m = await page.evaluate(() => {
          const r = el => el.getBoundingClientRect();
          const nav = r(document.querySelector('.bottom-nav'));
          const pageBox = r(document.querySelector('.more-page'));
          const foot = r(document.querySelector('.more-page__foot'));
          const tiles = [...document.querySelectorAll('.more-tile')];
          return {
            scrolls: document.documentElement.scrollHeight > window.innerHeight + 1,
            gapAboveNav: Math.round(nav.top - pageBox.bottom),
            footInside: foot.bottom <= pageBox.bottom + 1,
            cut: tiles.filter(t => {
              const tb = r(t);
              return [...t.querySelectorAll('.more-tile__title, .more-tile__icon, .more-tile__blurb')]
                .filter(e => getComputedStyle(e).display !== 'none')
                .some(e => { const b = r(e); return b.top < tb.top - 1 || b.bottom > tb.bottom + 1 || b.right > tb.right + 1; })
                || [...t.querySelectorAll('.more-tile__title')].some(e => e.scrollWidth > e.clientWidth + 1);
            }).length,
            tileH: Math.round(r(tiles[0]).height),
          };
        });
        expect(m, JSON.stringify(m)).toMatchObject({ scrolls: false, gapAboveNav: 0, footInside: true, cut: 0 });
      });
    }
  });
}
