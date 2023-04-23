const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const eans = fs.readFileSync('lista-eans.txt').toString().split('\r\n').filter(Boolean);

  const result = [];

  for (let ean of eans) {
    const url = `https://www.google.com/search?tbm=shop&hl=pt-BR&psb=1&ved=2ahUKEwiOkbqJwL7-AhVCDdQKHbl6DqUQu-kFegQIABAL&q=${ean}`;
    await page.goto(url);

    const itemPrice = await page.$$('.a8Pemb');
    const itemStore = await page.$$('div.aULzUe');
    const itemLink = await page.$$('.Lq5OHe');

    const priceList = [];
    const storeList = [];
    const linkList = [];

    for (let element of itemPrice) {
      const text = await element.getProperty('textContent');
      const value = await text.jsonValue();
      priceList.push(parseFloat(value.replace(/[^0-9,.-]+/g, '')));
    }

    for (let element of itemStore) {
      const text = await element.getProperty('textContent');
      const value = await text.jsonValue();
      storeList.push(value);
    }

    for (let element of itemLink) {
      const href = await element.getProperty('href');
      const value = await href.jsonValue();
      linkList.push(value);
    }

    // Encontra o menor preço
    const minPrice = Math.min(...priceList);

    // Encontra a loja e o link de compra correspondentes ao menor preço
    const [minStore, minLink] = [storeList, linkList].map((list) =>
      list[priceList.indexOf(minPrice)]
    );

    // Cria um objeto com as informações
    const data = {
      ean,
      url,
      price: minPrice,
      store: minStore,
      link: minLink
    };

    result.push(data);
  }

  await browser.close();

  // Escreve o objeto no arquivo "prices5.json"
  fs.writeFile('prices5.json', JSON.stringify(result, null, 2), (err) => {
    if (err) throw err;
    console.log('Dados escritos no arquivo "prices5.json"');
});
})();
