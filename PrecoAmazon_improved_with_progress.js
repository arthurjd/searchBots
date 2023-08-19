
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const ASINs = fs.readFileSync('PrecoAmazon.txt').toString().split('\r\n').filter(Boolean);
    const result = [];
    for (let index = 0; index < ASINs.length; index++) {
      const ASIN = ASINs[index];
      const url = `https://www.amazon.com.br/dp/${ASIN}`;
      await page.goto(url);
      const itemPrice = await page.$('.a-price-whole');
      const itemStore = await page.$('.a-store-name');
      result.push({ ASIN, price: itemPrice, store: itemStore });

      const progress = ((index + 1) / ASINs.length) * 100;
      console.log(`Progress: ${progress.toFixed(2)}%`);
    }
    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
    if (browser) await browser.close();
  }
})();
