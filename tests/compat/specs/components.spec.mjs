import { test as base, expect } from '@playwright/test';

/**
 * Checks that every Evoke component works in a page: it is registered, it renders, and its events fire.
 * A test fails on its own, so the report shows exactly which component broke. Any console error, page error or
 * failed request during a test also fails it.
 *
 * Keep EXPECTED_TAGS in step with the kit: when a component is added, add its tag here and an example to
 * apps/html/index.html.
 */
const EXPECTED_TAGS = [
  'evoke-alert', 'evoke-app-bar', 'evoke-badge', 'evoke-bottom-sheet', 'evoke-button', 'evoke-button-toggle', 'evoke-card',
  'evoke-checkbox', 'evoke-chip', 'evoke-divider', 'evoke-expansion', 'evoke-grid-list', 'evoke-icon', 'evoke-input',
  'evoke-list', 'evoke-menu', 'evoke-modal', 'evoke-pagination', 'evoke-progress', 'evoke-quantity-stepper',
  'evoke-radio-group', 'evoke-select', 'evoke-sidenav', 'evoke-slider', 'evoke-stepper', 'evoke-switch', 'evoke-table',
  'evoke-tabs', 'evoke-textarea', 'evoke-toast', 'evoke-tooltip',
];

/** [tag, selector of something the component must render inside itself] */
const RENDERS = [
  ['evoke-app-bar', '#appbar .evoke-appbar__logo'],
  ['evoke-alert', '#alert .evoke-alert'],
  ['evoke-badge', '#badge .evoke-badge'],
  ['evoke-button', '#btn button.evoke-btn'],
  ['evoke-card', '#card .evoke-card'],
  ['evoke-checkbox', '#checkbox input[type="checkbox"]'],
  ['evoke-chip', '#chip button.evoke-chip'],
  ['evoke-input', '#input input'],
  ['evoke-modal', '#modal.hydrated'],
  ['evoke-pagination', '#pager .evoke-pager'],
  ['evoke-progress', '#progress [role="progressbar"]'],
  ['evoke-quantity-stepper', '#qty .evoke-qty'],
  ['evoke-radio-group', '#radio input[type="radio"]'],
  ['evoke-select', '#select select'],
  ['evoke-switch', '#switch input[role="switch"]'],
  ['evoke-table', '#table table.evoke-table'],
  ['evoke-tabs', '#tabs [role="tab"]'],
  ['evoke-textarea', '#textarea textarea'],
  ['evoke-toast', '#toast.hydrated'],
  ['evoke-tooltip', '#tooltip .evoke-tooltip'],
  ['evoke-divider', '#divider [role="separator"]'],
  ['evoke-list', '#list [role="option"]'],
  ['evoke-button-toggle', '#toggle button[aria-pressed]'],
  ['evoke-expansion', '#expansion button[aria-expanded]'],
  ['evoke-menu', '#menu button[aria-haspopup="menu"]'],
  ['evoke-slider', '#slider input[type="range"]'],
  ['evoke-icon', '#icon svg.evoke-icon'],
  ['evoke-grid-list', '#grid .evoke-grid-list'],
  ['evoke-stepper', '#stepper .evoke-stepper__header'],
  ['evoke-bottom-sheet', '#sheet.hydrated'],
  ['evoke-sidenav', '#sidenav.hydrated'],
];

// A test fails when the page logs an error, throws, or a file fails to load.
const test = base.extend({
  errors: async ({ page }, use) => {
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`console error: ${m.text()}`); });
    page.on('pageerror', (e) => errors.push(`page error: ${e.message}`));
    page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));
    await use(errors);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  await page.waitForSelector('#btn button.evoke-btn'); // the components have started
});

test.afterEach(async ({ errors }) => {
  expect(errors, 'the page must log no errors').toEqual([]);
});

const events = (page) => page.evaluate(() => window.__events);
const last = async (page, event, id) => (await events(page)).filter((e) => e.event === event && (!id || e.id === id)).at(-1);

test.describe('registration', () => {
  test('all 31 components are registered', async ({ page }) => {
    const missing = await page.evaluate((tags) => tags.filter((t) => !customElements.get(t)), EXPECTED_TAGS);
    expect(missing).toEqual([]);
  });

  test('no component is registered that this test does not know about', async ({ page }) => {
    // A new component without a test here should be noticed, not silently untested.
    const unknown = await page.evaluate((known) => {
      const seen = [...document.querySelectorAll('*')].map((e) => e.localName).filter((n) => n.startsWith('evoke-'));
      return [...new Set(seen)].filter((n) => !known.includes(n));
    }, EXPECTED_TAGS);
    expect(unknown).toEqual([]);
  });
});

test.describe('rendering', () => {
  for (const [tag, selector] of RENDERS) {
    test(`${tag} renders`, async ({ page }) => {
      await expect(page.locator(selector).first()).toBeAttached();
    });
  }

  test('evoke-badge shows its count', async ({ page }) => {
    await expect(page.locator('#badge')).toContainText('3');
  });

  test('evoke-progress reports its value', async ({ page }) => {
    await expect(page.locator('#progress [role="progressbar"]')).toHaveAttribute('aria-valuenow', '60');
  });

  test('evoke-app-bar shows the slotted logo', async ({ page }) => {
    await expect(page.locator('#appbar')).toContainText('Evoke');
  });
});

test.describe('events', () => {
  test('evoke-button: click', async ({ page }) => {
    await page.click('#btn button');
    expect(await last(page, 'click', 'btn')).toBeTruthy();
  });

  test('evoke-input: evokeInput and evokeChange carry the typed text', async ({ page }) => {
    await page.fill('#input input', 'hello@evoke.com');
    expect((await last(page, 'evokeInput', 'input'))?.detail).toBe('hello@evoke.com');
    await page.locator('#input input').blur();
    expect((await last(page, 'evokeChange', 'input'))?.detail).toBe('hello@evoke.com');
  });

  test('evoke-select: evokeChange carries the chosen value', async ({ page }) => {
    await page.selectOption('#select select', 'design');
    expect((await last(page, 'evokeChange', 'select'))?.detail).toBe('design');
  });

  test('evoke-checkbox: evokeChange carries true', async ({ page }) => {
    await page.check('#checkbox input[type="checkbox"]');
    expect((await last(page, 'evokeChange', 'checkbox'))?.detail).toBe(true);
  });

  test('evoke-radio-group: evokeChange carries the chosen value', async ({ page }) => {
    await page.check('#radio input[type="radio"] >> nth=1');
    expect((await last(page, 'evokeChange', 'radio'))?.detail).toBe('pro');
  });

  test('evoke-textarea: evokeInput carries the typed text', async ({ page }) => {
    await page.fill('#textarea textarea', 'a longer note');
    expect((await last(page, 'evokeInput', 'textarea'))?.detail).toBe('a longer note');
  });

  test('evoke-switch: evokeChange carries true', async ({ page }) => {
    // The real checkbox is hidden by design; people click the toggle track.
    await page.click('#switch .evoke-switch__track');
    expect((await last(page, 'evokeChange', 'switch'))?.detail).toBe(true);
    await expect(page.locator('#switch input[role="switch"]')).toBeChecked();
  });

  test('evoke-card: evokeClick when clickable', async ({ page }) => {
    await page.click('#card .evoke-card');
    expect(await last(page, 'evokeClick', 'card')).toBeTruthy();
  });

  test('evoke-alert: evokeDismiss from the close button', async ({ page }) => {
    await page.click('#alert .evoke-alert__close');
    expect(await last(page, 'evokeDismiss', 'alert')).toBeTruthy();
  });

  test('evoke-tabs: evokeChange carries the chosen tab', async ({ page }) => {
    await page.click('#tabs [role="tab"]:has-text("Specs")');
    expect((await last(page, 'evokeChange', 'tabs'))?.detail).toBe('s');
  });

  test('evoke-table: evokeSort carries the column and direction', async ({ page }) => {
    await page.click('#table .evoke-table__sort');
    expect((await last(page, 'evokeSort', 'table'))?.detail).toMatchObject({ key: 'name', direction: 'asc' });
  });

  test('evoke-pagination: evokeChange carries the page number', async ({ page }) => {
    await page.click('#pager button[aria-label="Page 2"]');
    expect((await last(page, 'evokeChange', 'pager'))?.detail).toBe(2);
  });

  test('evoke-chip: evokeChange when toggled', async ({ page }) => {
    await page.click('#chip button.evoke-chip');
    expect((await last(page, 'evokeChange', 'chip'))?.detail).toBe(true);
  });

  test('evoke-chip: evokeRemove from the remove button', async ({ page }) => {
    await page.click('#chip-removable .evoke-chip__remove');
    expect(await last(page, 'evokeRemove', 'chip-removable')).toBeTruthy();
  });

  test('evoke-quantity-stepper: evokeChange carries the new quantity', async ({ page }) => {
    await page.click('#qty button[aria-label="Increase quantity"]');
    expect((await last(page, 'evokeChange', 'qty'))?.detail).toBe(3);
  });

  test('evoke-list: evokeChange carries the chosen item', async ({ page }) => {
    await page.click('#list [role="option"]:has-text("Pear")');
    expect((await last(page, 'evokeChange', 'list'))?.detail).toBe('pear');
    await expect(page.locator('#list [role="option"][aria-selected="true"]')).toHaveText(/Pear/);
  });

  test('evoke-button-toggle: evokeChange carries the chosen button', async ({ page }) => {
    await page.click('#toggle button:has-text("Week")');
    expect((await last(page, 'evokeChange', 'toggle'))?.detail).toBe('week');
    await expect(page.locator('#toggle button:has-text("Week")')).toHaveAttribute('aria-pressed', 'true');
  });

  test('evoke-expansion: evokeToggle opens and closes the panel', async ({ page }) => {
    await expect(page.locator('#expansion [role="region"]')).toBeHidden();
    await page.click('#expansion button[aria-expanded]');
    expect((await last(page, 'evokeToggle', 'expansion'))?.detail).toBe(true);
    await expect(page.locator('#expansion [role="region"]')).toBeVisible();
    await expect(page.locator('#expansion')).toContainText('Hidden text');
  });

  test('evoke-menu: opens, and choosing an item fires evokeSelect', async ({ page }) => {
    await expect(page.locator('#menu [role="menu"]')).toHaveCount(0);
    await page.click('#menu button[aria-haspopup="menu"]');
    await expect(page.locator('#menu [role="menu"]')).toBeVisible();
    await page.click('#menu [role="menuitem"]:has-text("Delete")');
    expect((await last(page, 'evokeSelect', 'menu'))?.detail).toBe('delete');
    await expect(page.locator('#menu [role="menu"]')).toHaveCount(0);
  });

  test('evoke-slider: evokeChange carries the new value', async ({ page }) => {
    await page.locator('#slider input').focus();
    await page.keyboard.press('ArrowRight');
    expect((await last(page, 'evokeChange', 'slider'))?.detail).toBe(31);
  });

  test('evoke-icon: has an accessible name when labelled', async ({ page }) => {
    await expect(page.locator('#icon [role="img"]')).toHaveAttribute('aria-label', 'Done');
  });

  test('evoke-grid-list: lays its children out in columns', async ({ page }) => {
    await expect(page.locator('#grid')).toContainText('Three');
    const cols = await page.locator('#grid .evoke-grid-list').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(cols).toBe(2);
  });

  test('evoke-stepper: Next moves on, evokeChange carries the step, Finish fires evokeComplete', async ({ page }) => {
    await page.click('#stepper .evoke-stepper__action--primary');
    expect((await last(page, 'evokeChange', 'stepper'))?.detail).toBe(1);
    await expect(page.locator('#stepper [aria-current="step"]')).toContainText('Profile');
    await page.click('#stepper .evoke-stepper__action--primary');
    await expect(page.locator('#stepper .evoke-stepper__action--primary')).toHaveText('Finish');
    await page.click('#stepper .evoke-stepper__action--primary');
    expect(await last(page, 'evokeComplete', 'stepper')).toBeTruthy();
  });

  test('evoke-stepper: a linear stepper cannot jump ahead from the header', async ({ page }) => {
    await expect(page.locator('#stepper .evoke-stepper__step >> nth=2 >> button')).toBeDisabled();
  });
});

test.describe('open and close', () => {
  test('evoke-modal opens, and Escape closes it with evokeClose', async ({ page }) => {
    await expect(page.locator('#modal [role="dialog"]')).toHaveCount(0);
    await page.click('#open-modal');
    await expect(page.locator('#modal [role="dialog"]')).toBeVisible();
    await page.keyboard.press('Escape');
    expect(await last(page, 'evokeClose', 'modal')).toBeTruthy();
    await expect(page.locator('#modal [role="dialog"]')).toHaveCount(0);
  });

  test('evoke-toast opens, and its action fires evokeAction', async ({ page }) => {
    await page.click('#open-toast');
    await expect(page.locator('#toast .evoke-toast')).toBeVisible();
    await page.click('#toast .evoke-toast__action');
    expect(await last(page, 'evokeAction', 'toast')).toBeTruthy();
  });

  test('evoke-tooltip shows on hover', async ({ page }) => {
    await page.hover('#tip-btn button');
    await expect(page.locator('#tooltip .evoke-tooltip__bubble')).toBeVisible();
  });

  test('evoke-bottom-sheet opens, and Escape closes it with evokeClose', async ({ page }) => {
    await expect(page.locator('#sheet [role="dialog"]')).toHaveCount(0);
    await page.click('#open-sheet');
    await expect(page.locator('#sheet [role="dialog"]')).toBeVisible();
    await page.keyboard.press('Escape');
    expect(await last(page, 'evokeClose', 'sheet')).toBeTruthy();
    await expect(page.locator('#sheet [role="dialog"]')).toHaveCount(0);
  });

  test('evoke-sidenav opens, and its close button fires evokeClose', async ({ page }) => {
    await expect(page.locator('#sidenav [role="dialog"]')).toHaveCount(0);
    await page.click('#open-sidenav');
    await expect(page.locator('#sidenav [role="dialog"]')).toBeVisible();
    await page.click('#sidenav .evoke-sidenav__close');
    expect(await last(page, 'evokeClose', 'sidenav')).toBeTruthy();
    await expect(page.locator('#sidenav [role="dialog"]')).toHaveCount(0);
  });
});
