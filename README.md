# Bridges-to-The-Space — Pontes01

Jogo 2D em pixel art (site estático) sobre gerenciar uma nave rumo ao planeta **Pontes-01**, baseado em `.claude/context.md`.
Sprites derivados de `.claude/Astronauta*.png`; trilha sonora com os MP3 da pasta `.claude`.

## Jogar

- **Solo (com bots):** abra `index.html` por qualquer servidor estático (ex.: GitHub Pages) ou rode o servidor abaixo.
- **Multiplayer (até 6 tripulantes + Comandante):**

```bash
node server/server.js
```

Abra `http://localhost:8080` (ou o IP da máquina na rede). O Comandante cria a sala em *Multiplayer*; os outros entram com o código.

## O que tem

- Narração da introdução, caminhada pela Terra poluída e comunicados.
- Criador de avatar pixelado (pele, cabelo, olhos, roupas, traje, visor, acessórios e pintura pixel a pixel).
- Montagem da expedição: 45 pontos de verba, 5 slots, origem, liderança, rota, módulos, melhorias, reservas, treinamento, gadgets, despensa, fundo de contingência e relatório de prontidão.
- Nave em corte lateral com 12 salas e 15 estações; busca rápida (barras) e relatório detalhado de entradas/saídas.
- Desafios: Regulação Térmica completa (d20/d10, modificadores, sinergias, conflitos, pistas), meteoros (pilotagem), falta e vazamento de combustível, falha de O₂, painel enlouquecido, lixo, rádio com interferência, água contaminada, vazamento de traje, doenças/remédios e tempestade solar.
- Alimentação: horta 4×3, cozinha e livro de receitas, cardápio com gostos/alergias, mesa, racionamento, desperdício.
- Etapas: estação orbital (escambo + exoplanetas reais da NASA), órbita de Pontes-01 (análises e adaptação), migração e final único.
- Jornada Completa e Curta; loja com itens de lazer (moral) e produtividade (eficiência) comprados com pontos.
