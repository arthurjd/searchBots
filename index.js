const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.google.com/search?q=7891356093487&newwindow=1&hl=pt-BR&tbm=shop&sxsrf=APwXEdcnrru9VlhswbiFe_5RHqr-5JSPVQ%3A1682023927944&psb=1&ei=96VBZIyHOa6f5OUPoPKK6Aw&oq=&gs_lcp=Cgtwcm9kdWN0cy1jYxABGAEyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyCwiuARDKAxDqAhAnMgsIrgEQygMQ6gIQJ1AAWABg2gtoAXAAeACAAQCIAQCSAQCYAQCgAQGwAQzAAQE&sclient=products-cc');


    const itemPrice = await page.$$('.a8Pemb');
    for (let element of itemPrice) {
        const text = await element.getProperty('textContent');
        const value = await text.jsonValue();
        console.log(value);
      }

    fs.writeFile('precos.json', JSON.stringify(itemPrice, null, 2), err => {
        if(err) throw new Error('something went wrong')

        console.log('well done!')
    })

    await browser.close();
})();