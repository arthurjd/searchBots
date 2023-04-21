const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const url = 'https://www.google.com/search?q=7891356093487&newwindow=1&hl=pt-BR&tbm=shop&sxsrf=APwXEdcnrru9VlhswbiFe_5RHqr-5JSPVQ%3A1682023927944&psb=1&ei=96VBZIyHOa6f5OUPoPKK6Aw&oq=&gs_lcp=Cgtwcm9kdWN0cy1jYxABGAEyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyCwiuARDKAxDqAhAnMgsIrgEQygMQ6gIQJ1AAWABg2gtoAXAAeACAAQCIAQCSAQCYAQCgAQGwAQzAAQE&sclient=products-cc';
    await page.goto(url);

    const itemPrice = await page.$$('.a8Pemb');
    const priceList = [];

    for (let element of itemPrice) {
        const text = await element.getProperty('textContent');
        const value = await text.jsonValue();
        priceList.push(value);
    }

    await browser.close();

    // Cria um objeto com a lista de preços
    const data = {
        url: url,
        prices: priceList
    };
    
    // Escreve o objeto no arquivo "prices.json"
    fs.writeFile('prices.json', JSON.stringify(data, null, 2), (err) => {
        if (err) throw err;
        console.log('Dados escritos no arquivo "prices.json"');
    });
})();
