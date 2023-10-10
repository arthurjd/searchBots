const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const ASINs = fs.readFileSync('PrecoAmazon.txt').toString().split('\r\n').filter(Boolean);

    const result = [];

    for (let index = 0; index < ASINs.length; index++) {
        const ASIN = ASINs[index];
        const url = `https://www.amazon.com.br/dp/${ASIN}`;
        await page.goto(url);

        const itemPrice = await page.$$('.a-offscreen');
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
            availabilityList.push(value.replace('Não temos previsão de quando este produto estará disponível novamente.', '').replace(' Em estoque ', 'Disponível').replace('    Não disponível.   ', 'Indisponível'));
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

        const progress = ((index + 1) / ASINs.length) * 100;
        console.log(`(1/2) Amazon Progress: ${progress.toFixed(2)}%`);
    }

    await browser.close();

    // Escreve o objeto no arquivo "PrecoAmazon.json"
    fs.writeFile('PrecoAmazon.json', JSON.stringify(result, null, 2), (err) => {
        if (err) throw err;
        console.log('Dados escritos no arquivo "PrecoAmazon.json"');
    });
})();








(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const eans = fs.readFileSync('PrecoGoogle.txt').toString().split('\r\n').filter(Boolean);

    const result = [];

    for (let index = 0; index < eans.length; index++) {
        const ean = eans[index];
        const url = `https://www.google.com/search?tbm=shop&hl=pt-BR&psb=1&ved=2ahUKEwiOkbqJwL7-AhVCDdQKHbl6DqUQu-kFegQIABAL&q=${ean}`;
        await page.goto(url);

        const itemPrice = await page.$$('.a8Pemb');
        const itemStore = await page.$$('.aULzUe');
        const itemLink = await page.$$('.Lq5OHe');

        const priceList = [];
        const storeList = [];
        const linkList = [];

        for (let element of itemPrice) {
            const text = await element.getProperty('textContent');
            const value = await text.jsonValue();
            const priceString = value.replace(/[^0-9,-]+/g, '').replace(',', '.');
            priceList.push(parseFloat(priceString));
        }

        for (let element of itemStore) {
            const text = await element.getProperty('textContent');
            const value = await text.jsonValue();
            storeList.push(value.replace('.aULzUe{letter-spacing:0.2px;position:relative;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;color:#295397;line-height:22px;font-family:Roboto,Arial,Sans-Serif}.aULzUe::after{content:\"\";height:48px;left:0;position:absolute;top:calc(50% - 24px);width:100%}', '').replace('.aULzUe{letter-spacing:0.2px;position:relative;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;color:#1a73e8;line-height:22px;font-family:Roboto,Arial,Sans-Serif}.aULzUe::after{content:"";height:48px;left:0;position:absolute;top:calc(50% - 24px);width:100%}', ''));
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

        const progress = ((index + 1) / eans.length) * 100;
        console.log(`(2/2) Google Progress: ${progress.toFixed(2)}%`);
    }

    await browser.close();

    // Escreve o objeto no arquivo "PrecoGoogle.json"
    fs.writeFile('PrecoGoogle.json', JSON.stringify(result, null, 2), (err) => {
        if (err) throw err;
        console.log('Dados escritos no arquivo "PrecoGoogle.json"');
    });
})();