const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://espn.com');
  await page.setViewport({ width: 1280, height: 800 });
  await page.screenshot({ 
    path: '/Users/darkknight/Desktop/espn-windsurf.png',
    fullPage: true 
  });
  await browser.close();
  console.log('Screenshot saved to /Users/darkknight/Desktop/espn-windsurf.png');
})();
