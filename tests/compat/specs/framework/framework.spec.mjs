import { test as base, expect } from '@playwright/test';

/**
 * Checks the kit inside a real app built with that framework's own build tool. APP is "react" (React 19, which
 * supports custom elements natively), "react18" (React 18: props are set as properties and events are listened to
 * from a ref) or "angular" (Angular CLI). Every app shows the same page (ids such as #count-btn and #out-name), so every
 * check below runs on all of them. A check is about the framework itself: does a value reach the component (props),
 * does a component event reach the framework, and does the framework keep working when its data changes (the
 * component's inner markup must survive a re-render). Any console error or warning also fails a test.
 */
const APP = process.env.APP || 'react';
const PAGES = [[APP, '/index.html']];

const test = base.extend({
  problems: async ({ page }, use) => {
    const problems = [];
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`console ${m.type()}: ${m.text()}`); });
    page.on('pageerror', (e) => problems.push(`page error: ${e.message}`));
    page.on('requestfailed', (r) => problems.push(`request failed: ${r.url()}`));
    await use(problems);
  },
});

for (const [mode, path] of PAGES) {
  test.describe(`${mode}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
      await page.waitForSelector('#count-btn button.evoke-btn'); // the components have started
    });

    test.afterEach(async ({ problems }) => {
      expect(problems, 'the page must log no errors or warnings').toEqual([]);
    });

    test('the components render', async ({ page }) => {
      for (const sel of [
        '#name input', '#role select', '#switch input[role="switch"]', '#tabs [role="tab"]', '#list [role="option"]',
        '#date input[type="text"]', '#slider input[type="range"]', '#menu button[aria-haspopup="menu"]',
        '#stepper .evoke-stepper__header', '#table table.evoke-table',
      ]) {
        await expect(page.locator(sel).first(), sel).toBeAttached();
      }
    });

    test('Framework text inside a component updates, and the component keeps its inner markup', async ({ page }) => {
      await expect(page.locator('#count-btn')).toContainText('Count: 0');
      for (let i = 0; i < 3; i++) await page.click('#count-btn button.evoke-btn');
      await expect(page.locator('#count-btn')).toContainText('Count: 3');
      // The classic failure: the framework replaces the button's contents and the inner <button> is gone.
      await expect(page.locator('#count-btn button.evoke-btn')).toHaveCount(1);
    });

    test('a framework value reaches a component as a prop, and the component event reaches the framework', async ({ page }) => {
      await expect(page.locator('#date input[type="text"]')).toHaveValue('2025-03-15');
      await page.fill('#name input', 'Maya');
      await expect(page.locator('#out-name')).toHaveText('Hello, Maya');
      await page.selectOption('#role select', 'design');
      await expect(page.locator('#out-role')).toHaveText('design');
      await page.click('#switch .evoke-switch__track');
      await expect(page.locator('#out-on')).toHaveText('on');
      await page.click('#tabs [role="tab"]:has-text("Specs")');
      await expect(page.locator('#out-tab')).toHaveText('s');
      await page.click('#list [role="option"]:has-text("Pear")');
      await expect(page.locator('#out-fruit')).toHaveText('pear');
    });

    test('the datepicker, slider, menu and stepper report back to the framework', async ({ page }) => {
      await page.fill('#date input[type="text"]', '2025-04-02');
      await page.locator('#date input[type="text"]').blur();
      await expect(page.locator('#out-date')).toHaveText('2025-04-02');

      await page.locator('#slider input').focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('#out-volume')).toHaveText('31');

      await page.click('#menu button[aria-haspopup="menu"]');
      await page.click('#menu [role="menuitem"]:has-text("Delete")');
      await expect(page.locator('#out-action')).toHaveText('delete');

      await page.click('#stepper .evoke-stepper__action--primary');
      await expect(page.locator('#out-step')).toHaveText('1');
      await page.click('#stepper .evoke-stepper__action--primary');
      await expect(page.locator('#out-step')).toHaveText('1 done');
    });

    test('list props that change in the framework update the component (select options, table rows)', async ({ page }) => {
      await expect(page.locator('#role select option')).toHaveCount(3); // placeholder + 2
      await page.click('#add-role');
      await expect(page.locator('#role select option')).toHaveCount(4);
      await expect(page.locator('#table tbody tr')).toHaveCount(2);
      await page.click('#add-row');
      await expect(page.locator('#table tbody tr')).toHaveCount(3);
    });

    test('a modal is opened by a framework value and closes itself back into it', async ({ page }) => {
      await expect(page.locator('#modal [role="dialog"]')).toHaveCount(0);
      await page.click('#open-modal');
      await expect(page.locator('#modal [role="dialog"]')).toBeVisible();
      await expect(page.locator('#out-modal')).toHaveText('open');
      await page.keyboard.press('Escape');
      await expect(page.locator('#out-modal')).toHaveText('closed');
      await expect(page.locator('#modal [role="dialog"]')).toHaveCount(0);
      await page.click('#open-modal'); // and it can be opened again
      await expect(page.locator('#modal [role="dialog"]')).toBeVisible();
    });
  });
}
