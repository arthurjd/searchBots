const puppeteer = require('puppeteer');
const fs = require('fs').promises;

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
                itemId: itemId.trim(),
                title: jsonData.title,
                price: jsonData.price,
                base_price: jsonData.base_price,
                permalink: jsonData.permalink,
            };

            // Adicione o objeto ao array de resultados
            results.push(selectedData);

            // Calcule a porcentagem de progresso e exiba no console
            const progress = ((i + 1) / itemIds.length) * 100;
            console.log(`Progresso: ${progress.toFixed(2)}%`);
        }

        // Escreva os resultados em um arquivo JSON
        await fs.writeFile('areaTeste/jsonMeli.json', JSON.stringify(results, null, 2));

        console.log('Os dados selecionados foram escritos no arquivo areaTeste/jsonMeli.json');
    } catch (error) {
        console.error('Erro ao ler o arquivo ou acessar o URL:', error);
    } finally {
        // Feche o navegador quando terminar
        await browser.close();
    }
})();
