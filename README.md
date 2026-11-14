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

## Novidades

- **Tradutor no topo do site**: Português · English · Español (interface, textos do site, narração por voz e conteúdo novo; o idioma fica salvo no navegador).
- **Terra explorável**: cidade com 8 edifícios educativos (dados da NASA) e 8 moradores com diálogos; o **Diário do Explorador** (J) dá até +3 pontos de verba.
- **Qualquer destino na Estação Ponte-Alfa**: escolha até os exoplanetas errados — a viagem custa combustível, oxigênio, comida e dias, e mostra por que o planeta não serve (mais dados do NASA Exoplanet Archive).
- **O jogo continua em Pontes-01**: construa campo solar, água, estufa, torre e pista; transmita dados à Terra; acenda o farol e receba 3 naves de tripulação (colonos) para fechar o final.
- **Chat**: no multiplayer, conversa em tempo real entre os jogadores (Enter); no solo, converse com a tripulação e com o Controle da Missão (curiosidades da NASA).

## O que tem

- Narração da introdução, caminhada pela Terra poluída e comunicados.
- Criador de avatar pixelado (pele, cabelo, olhos, roupas, traje, visor, acessórios e pintura pixel a pixel).
- Montagem da expedição: 45 pontos de verba, 5 slots, origem, liderança, rota, módulos, melhorias, reservas, treinamento, gadgets, despensa, fundo de contingência e relatório de prontidão.
- Nave em corte lateral com 12 salas e 15 estações; busca rápida (barras) e relatório detalhado de entradas/saídas.
- Desafios: Regulação Térmica completa (d20/d10, modificadores, sinergias, conflitos, pistas), meteoros (pilotagem), falta e vazamento de combustível, falha de O₂, painel enlouquecido, lixo, rádio com interferência, água contaminada, vazamento de traje, doenças/remédios e tempestade solar.
- Alimentação: horta 4×3, cozinha e livro de receitas, cardápio com gostos/alergias, mesa, racionamento, desperdício.
- Etapas: estação orbital (escambo + exoplanetas reais da NASA), órbita de Pontes-01 (análises e adaptação), migração e final único.
- Jornada Completa e Curta; loja com itens de lazer (moral) e produtividade (eficiência) comprados com pontos.
