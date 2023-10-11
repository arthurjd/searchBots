const puppeteer = require('puppeteer');
const fs = require('fs');







async function obterDadosMercadoLivre() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const MLBs = fs.readFileSync('input-data-search/PrecoMercadoLivre.txt').toString().split('\r\n').filter(Boolean);

    const result = [];

    for (let index = 0; index < MLBs.length; index++) {
        const MLB = MLBs[index];
        const url = `https://produto.mercadolivre.com.br/${MLB}`;
        await page.goto(url);

        const itemPrice = await page.$$('.ui-pdp-price__second-line .andes-money-amount__fraction');
        const itemStore = await page.$$('.ui-pdp-seller__header__title');

        const priceList = [];
        const storeList = [];

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

        // Cria um objeto com as informações
        const data = {
            MLB,
            url,
            price: priceList[0],
            store: storeList[0],
        };

        result.push(data);

        const progress = ((index + 1) / MLBs.length) * 100;
        console.log(`(2/3) Mercado Livre Progress: ${progress.toFixed(2)}%`);
    }

    await browser.close();

    // Escreve o objeto no arquivo "PrecoMercadoLivre"
    fs.writeFile('json/PrecoMercadoLivre.json', JSON.stringify(result, null, 2), (err) => {
        if (err) throw err;
        console.log('Dados escritos no arquivo "PrecoMercadoLivre"');
    });
}

















async function principal() {
    const resultadoMercadoLivre = await obterDadosMercadoLivre();
}

principal().then(() => {
    console.log('Processo concluído.');
}).catch((erro) => {
    console.error('Ocorreu um erro:', erro);
});