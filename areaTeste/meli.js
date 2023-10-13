const puppeteer = require('puppeteer');
const fs = require('fs').promises;


// Bot usado apenas para saber se um produto esta em catalogo
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Leia o conteúdo do arquivo de texto
        const itemIds = (await fs.readFile('areaTeste/teste.txt', 'utf8')).split('\n');

        // Inicialize um array para armazenar os resultados
        const results = [];

        for (let i = 0; i < itemIds.length; i++) {
            const itemId = itemIds[i].trim();

            // URL do link com base no itemID atual
            const url = `https://api.mercadolibre.com/items/${itemId}#json`;

            // Vá para a página com o JSON
            await page.goto(url);

            // Espere um pouco para garantir que o conteúdo seja carregado
            await page.waitForTimeout(3000);

            // Pegue o conteúdo JSON da página
            const jsonContent = await page.evaluate(() => {
                // Pegue o texto do elemento que contém o JSON
                const jsonElement = document.querySelector('pre');
                return jsonElement.textContent;
            });

            // Transforme o texto JSON em objeto JavaScript
            const jsonData = JSON.parse(jsonContent);

            // Selecione as informações especificadas e adicione ao objeto de resultados
            const selectedData = {
                catalog_product_id: jsonData.catalog_product_id
            };

            // Verifique se catalog_product_id não é nulo antes de acessar a página
            if (selectedData.catalog_product_id !== null) {
                const url2 = `https://www.mercadolivre.com.br/p/${selectedData.catalog_product_id}`;

                await page.goto(url2);

                // Extrair informações adicionais da página
                const itemPrice = await page.$$('.ui-pdp-price__second-line .andes-money-amount__fraction');
                const itemStore = await page.$$('.ui-pdp-seller__header__title');
                const itemStatus = await page.$$('.ui-pdp-container__col .ui-pdp-shipping-message__text');

                const priceList = [];
                const storeList = [];
                const statusList = [];

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

                for (let element of itemStatus) {
                    const text = await element.getProperty('textContent');
                    const value = await text.jsonValue();
                    storeList.push(value);
                }

                // Cria um objeto com as informações
                const data = {
                    selectedData,
                    url: url2,
                    price: priceList[0],
                    store: storeList[0],
                    status: statusList[0],
                };

                results.push(data);

                // Calcule a porcentagem de progresso e exiba no console
                const progress = ((i + 1) / itemIds.length) * 100;
                console.log(`Progresso: ${progress.toFixed(2)}%`);
            } else {
                console.log(`catalog_product_id é nulo para o item com ID: ${itemId}. A página não será carregada.`);
            }
        }

        // Escreva os resultados em um arquivo JSON
        await fs.writeFile('areaTeste/novoMeli.json', JSON.stringify(results, null, 2));

        console.log('Os dados selecionados foram escritos no arquivo areaTeste/novoMeli.json');
    } catch (error) {
        console.error('Erro ao ler o arquivo ou acessar o URL:', error);
    } finally {
        // Feche o navegador quando terminar
        await browser.close();
    }
})();