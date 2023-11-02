const puppeteer = require('puppeteer');
const fs = require('fs');

async function obterDadosReceita() {
    const CNPJs = fs.readFileSync('all-txt/cnpjlist.txt').toString().split('\r\n').filter(Boolean);
    const requestsPerMinute = 3;
    const delayBetweenRequests = 60 * 1000 / requestsPerMinute; // 60 segundos divididos pelo número de requisições por minuto

    const result = [];

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (let i = 0; i < CNPJs.length; i++) {
        const CNPJ = CNPJs[i];
        const url = `https://www.receitaws.com.br/v1/cnpj/${CNPJ}`;

        await page.goto(url);
        const preData = await page.evaluate(() => {
            const preElement = document.querySelector('pre');
            return preElement.innerText;
        });

        result.push(JSON.parse(preData));

        const progress = ((i + 1) / CNPJs.length) * 100;
        console.log(`Progresso: ${progress.toFixed(2)}%`);

        if (i < CNPJs.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
        }
    }

    await browser.close();

    fs.writeFile('json/cnpjResult.json', JSON.stringify(result, null, 2), (err) => {
        if (err) throw err;
        console.log('Dados escritos no arquivo "cnpjResult.json"');
    });

    console.log('Processo concluído.');
}

obterDadosReceita();
