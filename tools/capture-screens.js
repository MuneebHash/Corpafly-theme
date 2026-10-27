// Captures Gate screenshots for each prototype page at 1440 and 390 px wide.
// Usage: node tools/capture-screens.js http://127.0.0.1:8765 direction-a direction-b direction-c
// Writes prototypes/screens/<name>-<width>.jpg (full page) and <name>-<width>-fold.png (first screen).
const { chromium } = require('playwright');
const path = require('path');

const base = process.argv[2];
const names = process.argv.slice(3);
const sizes = [{ w: 1440, h: 900 }, { w: 390, h: 844 }];
const outDir = path.join(__dirname, '..', 'prototypes', 'screens');

(async () => {
  const browser = await chromium.launch();
  for (const name of names) {
    for (const { w, h } of sizes) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(`${base}/prototypes/${name}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1600); // let the one hero moment finish
      await page.screenshot({ path: path.join(outDir, `${name}-${w}-fold.png`) });
      // Scroll through so lazy images load and first-view reveals play, then capture the whole page.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) {
          scrollTo(0, y); await new Promise((r) => setTimeout(r, 140));
        }
        scrollTo(0, 0);
      });
      await page.waitForTimeout(900);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await page.screenshot({ path: path.join(outDir, `${name}-${w}.jpg`), fullPage: true, type: 'jpeg', quality: 86 });
      console.log(`${name} @${w}: horizontal overflow ${overflow}px${errors.length ? ' | errors: ' + errors.join(' | ') : ''}`);
      await page.close();
    }
  }
  await browser.close();
})();
