import { test, expect, devices } from '@playwright/test';

// Swiping between pages in the installed app (PageTurn.jsx, useSwipeTurn):
// tab to tab in the tab bar's order, right to go back from a page under a tab;
// the page follows the finger and springs back if the swipe is short.
const { defaultBrowserType, ...iPhone } = devices['iPhone 13'];
test.use({ ...iPhone });

test.beforeEach(async ({ page }) => {
  await page.route('**/api/packs', route => route.fulfill({ json: [] }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.route('**/api/history**', route => route.fulfill({ json: [] }));
});

// A real touch drag from (x0, y0) to (x1, y1) in `steps` moves over `ms`.
async function swipe(page, [x0, y0], [x1, y1], { steps = 12, ms = 240, hold = false } = {}) {
  const cdp = await page.context().newCDPSession(page);
  const point = (x, y) => [{ x, y, radiusX: 4, radiusY: 4, force: 1, id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: point(x0, y0) });
  for (let i = 1; i <= steps; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: point(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps) });
    await page.waitForTimeout(ms / steps);
  }
  if (hold) return cdp;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  return cdp;
}

const settle = page => page.waitForTimeout(600);

test('a swipe left goes to the next tab, a swipe right to the one before', async ({ page }) => {
  await page.goto('/explore?pwa=1');
  await settle(page);
  await swipe(page, [320, 420], [60, 430]);
  await expect(page).toHaveURL(/\/map(\?|$)/);
  await page.goto('/more');
  await settle(page);
  await swipe(page, [60, 420], [330, 410]);
  await expect(page).toHaveURL(/\/treasure-hunt(\?|$)/);
  // Coming back, the page turns in from the left.
  await expect(page.locator('.page-turn--back')).toHaveCount(1);
});

test('the page follows the finger, and a short swipe springs back', async ({ page }) => {
  await page.goto('/more?pwa=1');
  await settle(page);
  const cdp = await swipe(page, [300, 420], [220, 420], { hold: true });
  const x = await page.locator('.page-turn').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
  expect(x).toBeLessThan(-40);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(400);
  await expect(page).toHaveURL(/\/more(\?|$)/);
  expect(await page.locator('.page-turn').evaluate(el => getComputedStyle(el).transform)).toBe('none');
});

test('a quick flick turns even when short', async ({ page }) => {
  await page.goto('/more?pwa=1');
  await settle(page);
  // 110 px: short of a third of the screen (130 px), so only the speed turns it.
  await swipe(page, [300, 420], [190, 420], { steps: 3, ms: 45 });
  await expect(page).toHaveURL(/\/dashboard(\?|$)/);
});

test('past the first and last tab the page only gives a little', async ({ page }) => {
  await page.goto('/explore?pwa=1');
  await settle(page);
  const cdp = await swipe(page, [60, 420], [340, 420], { hold: true });
  const x = await page.locator('.page-turn').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
  expect(x).toBeGreaterThan(0);
  expect(x).toBeLessThanOrEqual(40);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(400);
  await expect(page).toHaveURL(/\/explore(\?|$)/);
});

test('a page under a tab goes back on a swipe right, and nowhere on a swipe left', async ({ page }) => {
  await page.goto('/more?pwa=1');
  await settle(page);
  await page.locator('.more-tile[href="/achievements"]').click();
  await expect(page).toHaveURL(/\/achievements(\?|$)/);
  await settle(page);
  await swipe(page, [320, 420], [60, 420]);
  await page.waitForTimeout(400);
  await expect(page).toHaveURL(/\/achievements(\?|$)/);
  await swipe(page, [60, 420], [330, 420]);
  await expect(page).toHaveURL(/\/more(\?|$)/);
});

test('a vertical drag scrolls and never turns', async ({ page }) => {
  await page.goto('/more?pwa=1');
  await settle(page);
  await swipe(page, [200, 600], [150, 250]);
  await page.waitForTimeout(400);
  await expect(page).toHaveURL(/\/more(\?|$)/);
});

test('the map keeps its own drag', async ({ page }) => {
  await page.goto('/map?pwa=1');
  await settle(page);
  const map = await page.locator('.leaflet-container').boundingBox();
  const y = map.y + map.height / 2;
  await swipe(page, [map.x + map.width - 30, y], [map.x + 30, y]);
  await page.waitForTimeout(400);
  await expect(page).toHaveURL(/\/map(\?|$)/);
});

test('the website on a phone does not swipe between pages', async ({ page }) => {
  await page.goto('/more');
  await page.goto('/explore');
  await settle(page);
  await swipe(page, [320, 420], [60, 420]);
  await page.waitForTimeout(400);
  await expect(page).toHaveURL(/\/explore(\?|$)/);
});
