const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {pathToFileURL} = require('node:url');
const path = require('node:path');

// Run against the source by default, or a deployed site via SITE_URL.
(async () => {
  // Playwright hides scrollbars in headless mode by default, masking this bug.
  const browser = await chromium.launch({channel: 'msedge', ignoreDefaultArgs: ['--hide-scrollbars']});
  const failures = [];
  try {
    for (const [width, height] of [[320,740],[390,844],[650,740],[768,900],[900,900],[901,900],[1024,768],[1280,900],[1440,900],[1920,1080]]) {
      const context = await browser.newContext({viewport: {width, height}});
      const page = await context.newPage();
      const base = process.env.SITE_URL || pathToFileURL(path.resolve(__dirname, '../index.html')).href;
      await page.goto(base);
      await page.locator('.brand img').evaluate(img => img.decode());
      const measure = () => page.evaluate(() => {
        const boxes = {};
        for (const selector of ['.header', '.brand img', '.brand span', 'nav']) {
          const {x, y, width, height} = document.querySelector(selector).getBoundingClientRect();
          boxes[selector] = {x, y, width, height};
        }
        return boxes;
      });
      const baseline = await measure();
      for (const route of ['food', 'fragrance', 'about', 'home']) {
        if (route === 'food' || route === 'fragrance') {
          await page.locator('#service-toggle').click();
          await page.locator(`#service-menu a[href="#${route}"]`).click();
        } else {
          await page.locator(`[data-page="${route}"]`).click();
        }
        await page.locator(`#${route}`).waitFor({state: 'visible'});
        const actual = await measure();
        for (const [selector, box] of Object.entries(baseline)) {
          for (const dimension of ['x', 'y', 'width', 'height']) {
            const delta = Math.abs(actual[selector][dimension] - box[dimension]);
            if (delta > 0.5) failures.push(`${width}x${height} ${route}: ${selector} ${dimension} shifted ${delta}px (${box[dimension]} -> ${actual[selector][dimension]})`);
          }
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px ${route}: horizontal overflow`);
      }
      console.log(`CHECK ${width}x${height}: Home -> Food -> Fragrance -> About Us -> Home`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
  assert.deepEqual(failures, [], 'Header, logo, wordmark and navigation must not shift between routes');
  console.log('PASS header stability: all route transitions preserve header geometry');
})().catch(error => { console.error(error); process.exitCode = 1; });
