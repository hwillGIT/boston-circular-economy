/**
 * Verify all 6 P2 gamification components render on the dashboard.
 * Run: npx playwright test scratch/verify_p2.mjs
 * Or:  node scratch/verify_p2.mjs (uses Playwright API directly)
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:5173/boston-circular-economy';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to dashboard...');
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle', timeout: 15000 });

  const checks = [
    { name: 'EcoStreak',     selector: '.eco-streak' },
    { name: 'BadgeGrid',     selector: '.badge-grid' },
    { name: 'Leaderboard',   selector: '.leaderboard' },
    { name: 'GratitudeFeed', selector: '.gratitude-feed' },
    { name: 'EcoKudos',      selector: '.eco-kudos-btn' },
    { name: 'CurbsideMode',  selector: '.curbside-container' },
  ];

  let passed = 0;
  let failed = 0;

  for (const { name, selector } of checks) {
    const el = await page.$(selector);
    if (el) {
      const box = await el.boundingBox();
      const visible = box && box.width > 0 && box.height > 0;
      if (visible) {
        console.log(`  ✅ ${name} — rendered (${Math.round(box.width)}x${Math.round(box.height)})`);
        passed++;
      } else {
        console.log(`  ⚠️  ${name} — in DOM but zero-size`);
        failed++;
      }
    } else {
      console.log(`  ❌ ${name} — NOT FOUND (selector: ${selector})`);
      failed++;
    }
  }

  console.log(`\nResult: ${passed}/${checks.length} passed, ${failed} failed`);

  // Screenshot for evidence
  await page.screenshot({ path: 'scratch/dashboard_p2.png', fullPage: true });
  console.log('Screenshot saved: scratch/dashboard_p2.png');

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
