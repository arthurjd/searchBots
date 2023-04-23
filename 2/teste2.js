const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = 'https://www.google.com/search?q=7891356093487&newwindow=1&hl=pt-BR&tbm=shop&sxsrf=APwXEdcnrru9VlhswbiFe_5RHqr-5JSPVQ%3A1682023927944&psb=1&ei=96VBZIyHOa6f5OUPoPKK6Aw&oq=&gs_lcp=Cgtwcm9kdWN0cy1jYxABGAEyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyCwiuARDKAxDqAhAnMgsIrgEQygMQ6gIQJ1AAWABg2gtoAXAAeACAAQCIAQCSAQCYAQCgAQGwAQzAAQE&sclient=products-cc';
  await page.goto(url);

  const itemPrice = await page.$$('.a8Pemb');
  const priceList = [];

  for (let element of itemPrice) {
    const text = await element.getProperty('textContent');
    const value = await text.jsonValue();
    const numericValue = parseFloat(value.replace('R$', ''));
    priceList.push(numericValue);
  }

  await browser.close();

  // Encontra o menor preço
  const minPrice = Math.min(...priceList);

  // Cria um objeto com a URL e o menor preço
  const data = { 
    url: url,
    price: minPrice 
  };

  // Escreve o objeto no arquivo "prices2.json"
  fs.writeFile('prices2.json', JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log('Dados escritos no arquivo "prices2.json"');
  });

})();
