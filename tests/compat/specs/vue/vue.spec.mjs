import { test as base, expect } from '@playwright/test';

/**
 * Checks the kit inside a real Vue 3 app (built with Vite), written two ways:
 *   - "wrappers": the Vue wrappers from '@evoke-tech/stencil-ui-kit/vue' (index.html)
 *   - "raw tags": the plain <evoke-*> tags with the loader (raw.html)
 * Both pages show the same things, so every check below runs against both. A check is about Vue itself:
 * does a Vue value reach the component (props), does a component event reach Vue, and does Vue keep working
 * when its data changes (the component's inner markup must survive a re-render).
 * Any console error or warning (Vue prints its warnings as console warnings) also fails a test.
 */
const PAGES = [
  ['wrappers', '/index.html'],
  ['raw tags', '/raw.html'],
];

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
  test.describe(`Vue, ${mode}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
      await page.waitForSelector('#count-btn button.evoke-btn'); // the components have started
    });

    test.afterEach(async ({ problems }) => {
      expect(problems, 'the page must log no errors or Vue warnings').toEqual([]);
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

    test('Vue text inside a component updates, and the component keeps its inner markup', async ({ page }) => {
      await expect(page.locator('#count-btn')).toContainText('Count: 0');
      for (let i = 0; i < 3; i++) await page.click('#count-btn button.evoke-btn');
      await expect(page.locator('#count-btn')).toContainText('Count: 3');
      // The classic failure: Vue replaces the button's contents and the inner <button> is gone.
      await expect(page.locator('#count-btn button.evoke-btn')).toHaveCount(1);
    });

    test('a Vue value reaches a component as a prop, and the component event reaches Vue', async ({ page }) => {
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

    test('the datepicker, slider, menu and stepper report back to Vue', async ({ page }) => {
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

    test('list props that change in Vue update the component (select options, table rows)', async ({ page }) => {
      await expect(page.locator('#role select option')).toHaveCount(3); // placeholder + 2
      await page.click('#add-role');
      await expect(page.locator('#role select option')).toHaveCount(4);
      await expect(page.locator('#table tbody tr')).toHaveCount(2);
      await page.click('#add-row');
      await expect(page.locator('#table tbody tr')).toHaveCount(3);
    });

    test('a modal is opened by a Vue value and closes itself back into Vue', async ({ page }) => {
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
