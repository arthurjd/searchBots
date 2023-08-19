
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const eans = fs.readFileSync('PrecoGoogle.txt').toString().split('\r\n').filter(Boolean);
    const result = [];
    for (let index = 0; index < eans.length; index++) {
      const ean = eans[index];
      const url = `https://www.google.com/search?tbm=shop&hl=pt-BR&psb=1&ved=2ahUKEwiOkbqJwL7-AhVCDdQKHbl6DqUQu-kFegQIABAL&q=${ean}`;
      await page.goto(url);
      const itemPrice = await page.$('.a-price-whole');
      const itemStore = await page.$('.a-store-name');
      result.push({ ean, price: itemPrice, store: itemStore });

      const progress = ((index + 1) / eans.length) * 100;
      console.log(`Progress: ${progress.toFixed(2)}%`);
    }
    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
    if (browser) await browser.close();
  }
})();
