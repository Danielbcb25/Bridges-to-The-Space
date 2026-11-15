# Bridges-to-The-Space — Pontes01

Jogo 2D em pixel art (site estático) sobre gerenciar uma nave rumo ao planeta **Pontes-01b**, baseado em `.claude/context.md`.
Sprites derivados de `.claude/Astronauta*.png`; trilha sonora com os MP3 da pasta `.claude`.

## Jogar

- **Solo (com bots):** abra `index.html` por qualquer servidor estático (ex.: GitHub Pages) ou rode o servidor abaixo.
- **Multiplayer (até 6 tripulantes + Comandante):** funciona direto no site (Vercel, GitHub Pages ou qualquer hospedagem estática), sem servidor e sem VPN. O Comandante clica em *Multiplayer → Criar sala* e passa o código de 5 letras; os amigos entram com o código. A conexão é P2P (WebRTC, biblioteca PeerJS em `js/vendor/`).
- **Servidor próprio (opcional, rede local):** rode `node server/server.js`, abra `http://localhost:8080` e informe `ws://SEU-IP:8080/ws` em *Avançado*.

## Novidades

- **Tradutor no topo do site**: Português · English · Español (interface, textos do site, narração por voz e conteúdo novo; o idioma fica salvo no navegador).
- **Terra explorável**: cidade com 8 edifícios educativos (dados da NASA) e 8 moradores com diálogos; o **Diário do Explorador** (J) dá até +3 pontos de verba.
- **Qualquer destino na Estação Ponte-Alfa**: escolha até os exoplanetas errados — a viagem custa combustível, oxigênio, comida e dias, e mostra por que o planeta não serve (mais dados do NASA Exoplanet Archive).
- **O jogo continua em Pontes-01b**: construa campo solar, água, estufa, torre e pista; transmita dados à Terra; acenda o farol e receba 3 naves de tripulação (colonos) para fechar o final.
- **Chat**: só no multiplayer (Enter). No modo solo a tripulação e as pessoas da cidade falam em balões de fala.
- **Idiomas**: inglês (padrão), português e espanhol.

## Controles e ajuda

- **← →** andar (ou clique para andar — o teclado tem prioridade) · **Shift** correr · **Espaço** interagir; longe de tudo, **pula** (na nave o pulo é lento, de gravidade zero) · **E** interagir · **Esc** fecha/desmarca/volta.
- **H** abre o **computador de bordo**: próximo passo, lista de tarefas e controles. A barra 💻 no topo mostra sempre o próximo passo.
- **Shift+S** ou o botão ⏩: tempo 2x até o próximo evento.
- HUD enxuto com 4 barras (oxigênio, fome, humor, armazenamento); ▾ mostra todos os recursos.
- **Traduções e falas em JSON, um arquivo por idioma**: `data/lang/pt.json` (textos do site e falas originais), `data/lang/en.json` e `data/lang/es.json` (`ui`: texto em português → tradução; `patterns`: mensagens com números; `falas`: textos falados). Mensagens que traduzem partes de uma frase ficam em `js/i18n-patterns.js`. O jogo precisa ser aberto por um servidor (GitHub Pages, Vercel ou `node server/server.js`) para carregar os JSON.
- **Salvar progresso**: salvamento automático (a cada 15 s e ao trocar de cena) e “Salvar progresso” no menu de pausa; **Continuar** na tela de título.
- **Tempo acelerado**: Shift+S alterna 2x → 5x → 10x → normal até o próximo evento.

## Jogos salvos e recomeçar

- Cada jornada é salva automaticamente (a cada 15 s, ao trocar de cena e ao fechar a aba). Começar uma nova **não apaga** as anteriores: abra qualquer uma em **📂 Jogos salvos** (tela inicial ou sala do multiplayer). "Salvar progresso" no menu de pausa cria um salvamento extra.
- Se a missão falhar (solo ou multiplayer), o botão **↺ Recomeçar da missão** volta ao início da etapa ou do desafio em que tudo deu errado, com os recursos daquele momento. No multiplayer, o Comandante recomeça e todos voltam juntos.

## O que tem

- Narração da introdução, caminhada pela Terra poluída e comunicados.
- Criador de avatar pixelado (pele, cabelo, olhos, roupas, traje, visor, acessórios e pintura pixel a pixel).
- Montagem da expedição: 45 pontos de verba, 5 slots, origem, liderança, rota, módulos, melhorias, reservas, treinamento, gadgets, despensa, fundo de contingência e relatório de prontidão.
- Nave em corte lateral com 12 salas e 15 estações; busca rápida (barras) e relatório detalhado de entradas/saídas.
- Desafios: Regulação Térmica completa (d20/d10, modificadores, sinergias, conflitos, pistas), meteoros (pilotagem), falta e vazamento de combustível, falha de O₂, painel enlouquecido, lixo, rádio com interferência, água contaminada, vazamento de traje, doenças/remédios e tempestade solar.
- Alimentação: horta 4×3, cozinha e livro de receitas, cardápio com gostos/alergias, mesa, racionamento, desperdício.
- Etapas: estação orbital (escambo + exoplanetas reais da NASA), órbita de Pontes-01b (análises e adaptação), migração e final único.
- Jornada Completa e Curta; loja com itens de lazer (moral) e produtividade (eficiência) comprados com pontos.
