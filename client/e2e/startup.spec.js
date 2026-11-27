import { test, expect } from '@playwright/test';

// Start-up (2026-11-27): the Dex's card list is asked for together with the
// sign-in check (utils/earlyFetch.js), not after it; pages other than the Dex
// are split off (utils/lazyPage.js) and the splash waits for the one opened.

const USER = { _id: 'u1', username: 'tester', email: 't@example.com', totalXP: 0, explorerLevel: 1, achievements: [] };

test('the card list is asked for before the sign-in check has answered', async ({ page }) => {
  let meAnswered = false;
  let locationsAskedEarly = null;
  await page.route('**/api/auth/me', async route => {
    await new Promise(r => setTimeout(r, 1200));
    meAnswered = true;
    await route.fulfill({ json: { user: USER } });
  });
  await page.route('**/api/locations', route => {
    if (locationsAskedEarly === null) locationsAskedEarly = !meAnswered;
    return route.fulfill({ json: [] });
  });
  await page.route('**/api/packs', route => route.fulfill({ json: [] }));
  await page.route('**/api/user/**', route => route.fulfill({ json: {} }));
  await page.addInitScript(() => localStorage.setItem('token', 'test-token'));
  await page.goto('/explore');
  await expect(page.locator('#boot-splash')).toHaveCount(0, { timeout: 7000 });
  expect(locationsAskedEarly).toBe(true);
});

test('opening on a split-off page: the splash gives way to the page itself', async ({ page }) => {
  await page.route('**/api/packs', route => route.fulfill({ json: [] }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.goto('/privacy');
  await expect(page.locator('#boot-splash')).toHaveCount(0, { timeout: 7000 });
  await expect(page.locator('h1').first()).toBeVisible();
});
