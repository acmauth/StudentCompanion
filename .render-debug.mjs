import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';

const [out, mode] = process.argv.slice(2);
const passed = mode === 'pass';

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));

await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

const res = await page.evaluate(async (passed) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap';
  document.head.appendChild(link);

  const mod = await import('/src/lib/share/gradeStory.ts');
  const canvas = await mod.renderGradeStory({
    courseTitle: 'Βασικές Αρχές Προγραμματισμού',
    formattedGrade: passed ? '9' : '4',
    grade: passed ? 0.9 : 0.4,
    isPassed: passed
  });

  // exercise the debug overlay too
  await mod.shareGradeStory({
    courseTitle: 'Βασικές Αρχές Προγραμματισμού',
    formattedGrade: passed ? '9' : '4',
    grade: passed ? 0.9 : 0.4,
    isPassed: passed
  });
  const overlayShown = !!document.querySelector('div[style*="zoom-out"] img');

  return { url: canvas.toDataURL('image/png'), w: canvas.width, h: canvas.height, overlayShown };
}, passed);

console.log('dimensions', res.w, 'x', res.h, '| debug overlay shown:', res.overlayShown);
writeFileSync(out, Buffer.from(res.url.split(',')[1], 'base64'));
await browser.close();
