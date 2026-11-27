import { test, expect } from '@playwright/test';

// The 繁體 dictionary (opencc-js) is loaded on its own, only for readers of
// Traditional Chinese (LanguageContext.jsx, 2026-11-27). The boot splash waits
// for it, so the first page a 繁體 reader sees is never Simplified.

test.beforeEach(async ({ page }) => {
  await page.route('**/api/packs', route => route.fulfill({ json: [] }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.route('**/api/history**', route => route.fulfill({ json: [] }));
});

test('a 繁體 reader: the splash waits for the dictionary, the page opens in Traditional', async ({ page }) => {
  // A slow dictionary, so the splash would otherwise be gone before it lands.
  await page.route(/cn2t/, async route => {
    await new Promise(r => setTimeout(r, 1500));
    await route.continue();
  });
  await page.addInitScript(() => {
    localStorage.setItem('lang', 'zh');
    localStorage.setItem('zhVariant', 'tw');
  });
  await page.goto('/explore');
  await expect(page.locator('#boot-splash')).toHaveCount(0, { timeout: 7000 });
  await expect(page.locator('.navbar')).toContainText('圖鑑');
  await expect(page.locator('.navbar')).not.toContainText('图鉴');
});

test('a Simplified reader never downloads the dictionary', async ({ page }) => {
  const fetched = [];
  page.on('request', req => { if (/cn2t/.test(req.url())) fetched.push(req.url()); });
  await page.addInitScript(() => {
    localStorage.setItem('lang', 'zh');
    localStorage.setItem('zhVariant', 'cn');
  });
  await page.goto('/explore');
  await expect(page.locator('#boot-splash')).toHaveCount(0, { timeout: 7000 });
  await expect(page.locator('.navbar')).toContainText('图鉴');
  expect(fetched).toEqual([]);
});
