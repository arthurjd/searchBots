# Buscador
Esse é um "robô" buscador do Google Shopping.
Coloque o EAN em uma lista e será buscado o preço mais baixo sendo praticado no Google para aquele produto, quem esta vendendo, o link do Google e o link de compra.

# Como Usar
Estou usando o Puppeteer para abrir um navegador e pesquisar uma lista de EAN (Código de Barras) de produtos dentro do Google Shopping.

Use o arquivo "teste5.js" atrelado a lista "lista-eans5.txt" para buscar até 50 EANs sem ser bloqueado pelo Google.
Use o arquivo "teste6.js" atrelado a lista "lista-eans6.txt" para buscar até 92 EANs sem ser bloqueado pelo Google.

Pelos meus testes esses foram os limites de buscas sem levar bloqueio, isso ocorre pois no arquivo "teste6.js" estou deixando uma pausa de 1 segundo entre cada pesquisa.
