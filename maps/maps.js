const fs = require('fs');
const fetch = require('node-fetch');
const config = require('../config.js');

const apiKey = config.apiKeyMaps;
const zipCodesFile = 'all-txt/cep.txt';

// Função para buscar o nome da rua a partir do CEP usando a API Geocoding do Google Maps
async function getStreetNameFromZipCode(zipCode) {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    if (data.status === 'OK') {
      const streetName = data.results[0].address_components.find(component => component.types.includes('route')).long_name;
      return { zipCode, streetName };
    } else {
      throw new Error(`Não foi possível encontrar o endereço para o CEP: ${zipCode}`);
    }
  } catch (error) {
    console.error('Erro ao buscar o endereço:', error);
    return { zipCode, error: error.message };
  }
}

// Lê o arquivo com os CEPs e usa a função acima para buscar os nomes das ruas
fs.readFile(zipCodesFile, 'utf8', async (err, data) => {
  if (err) {
    return console.error('Erro ao ler o arquivo:', err);
  }

  // Separa os CEPs por quebra de linha
  const zipCodes = data.split('\n').filter(Boolean);

  // Mapeia os CEPs para promessas de buscas de nome de rua
  const resultsPromises = zipCodes.map(getStreetNameFromZipCode);

  // Aguarda todas as promessas serem resolvidas
  const results = await Promise.all(resultsPromises);

  // Processa os resultados para remover os caracteres '\r' antes de salvar
  const cleanedResults = results.map(result => ({
    zipCode: result.zipCode.replace(/\r/g, ''), // Remove os caracteres '\r'
    streetName: result.streetName
  }));

  // Escreve o resultado limpo em um arquivo JSON
  fs.writeFile('json/maps.json', JSON.stringify(cleanedResults, null, 2), 'utf8', (writeErr) => {
    if (writeErr) {
      return console.error('Erro ao escrever o resultado no arquivo:', writeErr);
    }
    console.log('Resultados salvos em results.json.');
  });
});