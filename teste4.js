const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url =
    'https://www.google.com/search?q=7891356093487&newwindow=1&hl=pt-BR&tbm=shop&sxsrf=APwXEdcnrru9VlhswbiFe_5RHqr-5JSPVQ%3A1682023927944&psb=1&ei=96VBZIyHOa6f5OUPoPKK6Aw&oq=&gs_lcp=Cgtwcm9kdWN0cy1jYxABGAEyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyCwiuARDKAxDqAhAnMgsIrgEQygMQ6gIQJ1AAWABg2gtoAXAAeACAAQCIAQCSAQCYAQCgAQGwAQzAAQE&sclient=products-cc';
  await page.goto(url);

  const itemPrice = await page.$$('.a8Pemb');
  const itemStore = await page.$$('.IuHnof');
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

  await browser.close();

  // Encontra o menor preço
  const minPrice = Math.min(...priceList);

  // Encontra a loja e o link de compra correspondentes ao menor preço
  const [minStore, minLink] = [storeList, linkList].map((list) =>
    list[priceList.indexOf(minPrice)]
  );

  // Cria um objeto com as informações
  const data = {
    url,
    price: minPrice,
    store: minStore,
    link: minLink
  };

  // Escreve o objeto no arquivo "prices4.json"
  fs.writeFile('prices4.json', JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log('Dados escritos no arquivo "prices4.json"');
  });
})();
