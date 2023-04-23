const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url =
    'https://www.google.com/search?q=7891356093487&newwindow=1&hl=pt-BR&tbm=shop&sxsrf=APwXEdcnrru9VlhswbiFe_5RHqr-5JSPVQ%3A1682023927944&psb=1&ei=96VBZIyHOa6f5OUPoPKK6Aw&oq=&gs_lcp=Cgtwcm9kdWN0cy1jYxABGAEyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyCwiuARDKAxDqAhAnMgsIrgEQygMQ6gIQJ1AAWABg2gtoAXAAeACAAQCIAQCSAQCYAQCgAQGwAQzAAQE&sclient=products-cc';
  await page.goto(url);

  const itemPrice = await page.$$('.a8Pemb');
  const itemStore = await page.$$('.IuHnof');

  const priceList = [];
  const storeList = [];

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

  await browser.close();

  // Encontra o menor preço
  const minPrice = Math.min(...priceList);

  // Encontra a loja correspondente ao menor preço
  const minStore = storeList[priceList.indexOf(minPrice)];

  // Cria um objeto com as informações
  const data = {
    url,
    price: minPrice,
    store: minStore
  };

  // Escreve o objeto no arquivo "prices3.json"
  fs.writeFile('prices3.json', JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log('Dados escritos no arquivo "prices3.json"');
  });
})();
