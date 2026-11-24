import { test, expect } from '@playwright/test';

/**
 * Each theme file remaps the --evoke-* tokens to another system's variables. With none of those systems loaded,
 * the fallback colours in the theme file apply, so the colour of a primary button shows that the file loaded, comes
 * after the base file, and reaches the components. (With the real Bootstrap, Tailwind or Material loaded, the colours
 * come from them; the framework tests cover that.)
 */
const THEMES = [
  { name: 'default look (base file only)', query: '', primary: 'rgb(255, 83, 22)' },
  { name: 'tokens.css', query: '?theme=tokens', primary: 'rgb(255, 83, 22)' },
  { name: 'tailwind.css', query: '?theme=tailwind', primary: 'rgb(37, 99, 235)' },
  { name: 'bootstrap.css', query: '?theme=bootstrap', primary: 'rgb(13, 110, 253)' },
  { name: 'material.css', query: '?theme=material', primary: 'rgb(103, 80, 164)' },
];

for (const theme of THEMES) {
  test(`theme ${theme.name}: the primary button takes the theme colour`, async ({ page }) => {
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));

    await page.goto(`/theme.html${theme.query}`);
    const button = page.locator('#primary button.evoke-btn');
    await expect(button).toBeAttached();
    await expect(button).toHaveCSS('background-color', theme.primary);
    expect(errors).toEqual([]);
  });
}

test('the themes change the look: Bootstrap and Material differ from the default', async ({ page }) => {
  const colour = async (query) => {
    await page.goto(`/theme.html${query}`);
    return page.locator('#primary button.evoke-btn').evaluate((el) => getComputedStyle(el).backgroundColor);
  };
  const def = await colour('');
  expect(await colour('?theme=bootstrap')).not.toBe(def);
  expect(await colour('?theme=material')).not.toBe(def);
});
