const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const ASINs = fs.readFileSync('PrecoAmazon.txt').toString().split('\r\n').filter(Boolean);

  const result = [];

  for (let ASIN of ASINs) {
    const url = `https://www.amazon.com.br/dp/${ASIN}`;
    await page.goto(url);

    const itemPrice = await page.$$('.a-price-whole');
    const itemStore = await page.$$('#sellerProfileTriggerId');
    const itemAvailability = await page.$$('#availability span');

    const priceList = [];
    const storeList = [];
    const availabilityList = [];

    for (let element of itemPrice) {
      const text = await element.getProperty('textContent');
      const value = await text.jsonValue();
      priceList.push(value);
    }

    for (let element of itemStore) {
      const text = await element.getProperty('textContent');
      const value = await text.jsonValue();
      storeList.push(value);
    }

    for (let element of itemAvailability) {
      const text = await element.getProperty('textContent');
      const value = await text.jsonValue();
      availabilityList.push(value.replace('Não temos previsão de quando este produto estará disponível novamente.','').replace(' Em estoque ', 'Disponível').replace('    Não disponível.   ', 'Indisponível'));
    } 

    // Definir o valor de "store" como "Amazon" se a lista de lojas estiver vazia e a lista de disponibilidade for "Disponível"
    if (storeList.length === 0 && availabilityList[0] === 'Disponível') {
      storeList.push('Amazon');
    }

    // Cria um objeto com as informações
    const data = {
      ASIN,
      url,
      price: priceList[0],
      store: storeList[0],
      availability: availabilityList[0],
    };

    result.push(data);
  }

  await browser.close();

  // Escreve o objeto no arquivo "PrecoAmazon.json"
  fs.writeFile('PrecoAmazon.json', JSON.stringify(result, null, 2), (err) => {
    if (err) throw err;
    console.log('Dados escritos no arquivo "PrecoAmazon.json"');
  });
})();