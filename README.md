# Buscador
Esse é um "robô" buscador do Google Shopping.
Coloque o EAN em uma lista e será buscado o preço mais baixo sendo praticado no Google para aquele produto, quem esta vendendo, o link do Google e o link de compra.

# Como Usar
1. Instale o Puppeteer ao abrir o projeto
    npm install puppeteer
2. Escreva os EANs (Código de Barras) do produto no arquivo TXT
3. Acione o código, exemplo: node PrecoGoogle.js
4. Abra o arquivo em Excel corespondente a busca que fez e edite a consulta dos dados para buscar o arquivo JSON dentro da pasta correta. Para fazer isso selecione alguma celula da planilha, vá na ultima quia --> "Consulta" --> "Editar" --> O Power Query vi abri e clique em "Configurações das fontes de dados" --> Procute o arquivo JSON e feche as abas.
5. Atualize a plailha, na guia "Dados" clique em "Atualizar"