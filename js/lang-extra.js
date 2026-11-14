// ============================================================
//  TRADUÇÕES COMPLEMENTARES (EN · ES)
//  • Padrões para mensagens montadas com nomes e números
//    (as partes variáveis são traduzidas recursivamente).
//  • Textos que faltavam nos dicionários (placas, avisos, eventos).
// ============================================================
'use strict';
(function () {
  const t = s => I18n.t(s);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const low = s => s.charAt(0).toLowerCase() + s.slice(1);
  const P = (re, en, es) => { I18N_PATTERNS.en.push([re, en]); I18N_PATTERNS.es.push([re, es]); };
  const sev = { en: { leve: 'minor', média: 'moderate', grave: 'severe' }, es: { leve: 'leve', média: 'media', grave: 'grave' } };

  P(/^Indo agora: (.+)\.$/, (m, a) => 'On my way: ' + low(t(cap(a))) + '.', (m, a) => 'Voy ahora: ' + low(t(cap(a))) + '.');
  P(/^(\+?)(\d+) pontos \((.+)\)\.$/, (m, s, n, a) => `${s}${n} points (${t(a)}).`, (m, s, n, a) => `${s}${n} puntos (${t(a)}).`);
  P(/^(\d+) tripulante\(s\) ficaram expostos à radiação\.$/, '$1 crew member(s) were exposed to radiation.', '$1 tripulante(s) quedaron expuestos a la radiación.');
  P(/^Colheita: \+([\d.,]+) kg de (.+)\.$/, (m, n, a) => `Harvest: +${n} kg of ${t(a)}.`, (m, n, a) => `Cosecha: +${n} kg de ${t(a)}.`);
  P(/^A nave atravessou a chuva de meteoros com (\d+) impacto\(s\)\.$/, 'The ship made it through the meteor shower with $1 impact(s).', 'La nave atravesó la lluvia de meteoros con $1 impacto(s).');
  P(/^(.+) foi resgatado inconsciente\. Sobreviveu graças aos trajes\/enfermaria\.$/, '$1 was rescued unconscious and survived thanks to the suits/sickbay.', '$1 fue rescatado/a inconsciente. Sobrevivió gracias a los trajes/enfermería.');
  P(/^(.+) voltou para dentro a tempo\. O substituto terminou o reparo\.$/, '$1 got back inside in time. The substitute finished the repair.', '$1 volvió adentro a tiempo. El sustituto terminó la reparación.');
  P(/^(.+) piorou e ficou incapacitado por um tempo, com mobilidade e visão reduzidas\.$/, '$1 got worse and is incapacitated for a while, with reduced mobility and vision.', '$1 empeoró y quedó incapacitado/a por un tiempo, con movilidad y visión reducidas.');
  P(/^(.+) foi tratado e está se recuperando\.$/, '$1 was treated and is recovering.', '$1 fue tratado/a y se está recuperando.');
  P(/^(.+) tomou (.+) e está se recuperando\.$/, (m, a, b) => `${a} took the ${low(t(b))} and is recovering.`, (m, a, b) => `${a} tomó ${low(t(b))} y se está recuperando.`);
  P(/^(.+) faz manutenção preventiva em (.+) \(1 min\)\.$/, (m, a, b) => `${a} does preventive maintenance on ${t(b)} (1 min).`, (m, a, b) => `${a} hace mantenimiento preventivo en ${t(b)} (1 min).`);
  P(/^Manutenção preventiva concluída: (.+) \+1\.$/, (m, a) => `Preventive maintenance done: ${t(a)} +1.`, (m, a) => `Mantenimiento preventivo listo: ${t(a)} +1.`);
  P(/^(.+) falhou! \(Sangue-frio disponível: rolar de novo\?\)$/, (m, a) => `${t(a)} failed! (Cold blood available: roll again?)`, (m, a) => `¡${t(a)} falló! (Sangre fría disponible: ¿tirar de nuevo?)`);
  P(/^(.+) falhou \((leve|média|grave)\): (.+)$/, (m, a, g, c) => `${t(a)} failed (${sev.en[g]}): ${t(c)}`, (m, a, g, c) => `${t(a)} falló (${sev.es[g]}): ${t(c)}`);
  P(/^(.+) falhou!$/, (m, a) => `${t(a)} failed!`, (m, a) => `¡${t(a)} falló!`);
  P(/^(.+): efeito terminou\.$/, (m, a) => `${t(a)}: effect ended.`, (m, a) => `${t(a)}: efecto terminado.`);
  P(/^Cena (\d) — (.+)$/, (m, n, a) => `Scene ${n} — ${t(a)}`, (m, n, a) => `Escena ${n} — ${t(a)}`);
  P(/^(.*) · ativo (\d+)s(?: · (abrir|fechar))?$/, (m, a, n, sm) => `${t(a)} · active ${n}s${sm ? ' · ' + (sm === 'abrir' ? 'open' : 'close') : ''}`, (m, a, n, sm) => `${t(a)} · activo ${n}s${sm ? ' · ' + (sm === 'abrir' ? 'abrir' : 'cerrar') : ''}`);
  P(/^Resultado: (.+)\. Custo para manter a temperatura: ([\d.,]+) kWh de energia, ([\d.,]+) kg de combustível\. Plantação perdida: ([\d.,]+) kg\. Tempo fora da faixa segura: ([\d.,]+) s\.$/,
    (m, g, k, f, p, s) => `Result: ${t(g)}. Cost of keeping the temperature: ${k} kWh of energy, ${f} kg of fuel. Crops lost: ${p} kg. Time outside the safe range: ${s} s.`,
    (m, g, k, f, p, s) => `Resultado: ${t(g)}. Costo de mantener la temperatura: ${k} kWh de energía, ${f} kg de combustible. Cultivo perdido: ${p} kg. Tiempo fuera del rango seguro: ${s} s.`);
  P(/^Troca feita: (.+)$/, (m, a) => `Trade done: ${t(a)}`, (m, a) => `Intercambio hecho: ${t(a)}`);
  P(/^Análise de (.+) concluída\.\s*(.*)$/, (m, a, r) => `${t(a)} analysis complete.${r ? ' ' + t(r) : ''}`, (m, a, r) => `Análisis de ${low(t(a))} completado.${r ? ' ' + t(r) : ''}`);
  P(/^A expedição pousou no (.+?)\. A humanidade tem um novo começo(?: — que custou caro\.)?$/, (m, a) => `The expedition landed at ${t(a)}. Humanity has a new beginning — one that came at a high price.`, (m, a) => `La expedición aterrizó en ${t(a)}. La humanidad tiene un nuevo comienzo — que costó caro.`);
  P(/^(.+) \(dia (\d+), (.+)\)$/, (m, a, n, c) => `${t(a)} (day ${n}, ${t(c)})`, (m, a, n, c) => `${t(a)} (día ${n}, ${t(c)})`);
  P(/^Livro de Receitas \((\d+)\/(\d+)\)$/, 'Recipe Book ($1/$2)', 'Libro de Recetas ($1/$2)');
  P(/^([\d.,]+) kg\/dia \(0,84 kg\/pessoa\)$/, '$1 kg/day (0.84 kg/person)', '$1 kg/día (0,84 kg/persona)');
  P(/^([\d.,]+) (kg|L)\/dia$/, '$1 $2/day', '$1 $2/día');
  P(/^\+([\d.,]+) kg\/dia de O₂$/, '+$1 kg/day of O₂', '+$1 kg/día de O₂');
  P(/^Vazaram ([\d.,]+) kg de combustível \((\d+)%\)!$/, '$1 kg of fuel leaked ($2%)!', '¡Se fugaron $1 kg de combustible ($2%)!');
  P(/^Mensagem entendida: “(.+)”\.$/, (m, a) => `Message understood: “${t(a)}”.`, (m, a) => `Mensaje entendido: “${t(a)}”.`);
  P(/^(.+) está do lado de fora com o traje vazando!$/, '$1 is outside with a leaking suit!', '¡$1 está afuera con el traje perdiendo aire!');
  P(/^Doente: (.+)\. Remédios (.+)\.$/, (m, a, b) => `Patient: ${a}. Medicine ${t(b)}.`, (m, a, b) => `Enfermo/a: ${a}. Medicamentos ${t(b)}.`);
  P(/^válidos até o dia (\d+)$/, 'valid until day $1', 'válidos hasta el día $1');
  P(/^(.+) entrou em hibernação\.$/, '$1 entered hibernation.', '$1 entró en hibernación.');
  P(/^(.+) saiu da hibernação\.$/, '$1 left hibernation.', '$1 salió de la hibernación.');
  P(/^(.+) recebeu tratamento\.$/, '$1 received treatment.', '$1 recibió tratamiento.');
  P(/^(.+) pronta \(2 refeições\)\.$/, (m, a) => `${t(a)} ready (2 meals).`, (m, a) => `${t(a)} lista (2 comidas).`);
  P(/^Receita descoberta: (.+?)! (.+)$/, (m, a, b) => `Recipe discovered: ${t(a)}! ${t(b)}`, (m, a, b) => `¡Receta descubierta: ${t(a)}! ${t(b)}`);
  P(/^(.+) reparado \(\+(\d+)%\)\.$/, (m, a, n) => `${t(a)} repaired (+${n}%).`, (m, a, n) => `${t(a)} reparado (+${n}%).`);
  P(/^([\d.,]+) kg de lixo ejetados\. Sem reciclador, a chance de reaproveitar foi perdida\.$/, '$1 kg of trash ejected. Without a recycler, the chance to reuse it was lost.', '$1 kg de basura expulsados. Sin reciclador se perdió la chance de reaprovecharla.');
  P(/^Uma bandeja de (.+) passou do ponto e estragou\.$/, (m, a) => `A tray of ${low(t(a))} went past its prime and spoiled.`, (m, a) => `Una bandeja de ${low(t(a))} se pasó y se echó a perder.`);
  P(/^(.+) concluiu: (.+) \(nível (\d+)\)\.$/, (m, a, b, n) => `${a} finished: ${t(b)} (level ${n}).`, (m, a, b, n) => `${a} terminó: ${t(b)} (nivel ${n}).`);
  P(/^Falta (.+) \(1 kg\)\.$/, (m, a) => `Missing ${low(t(a))} (1 kg).`, (m, a) => `Falta ${low(t(a))} (1 kg).`);
  P(/^☠ (.+) morreu \((.+)\)\.$/, (m, a, b) => `☠ ${t(a)} died (${t(b)}).`, (m, a, b) => `☠ ${t(a)} murió (${t(b)}).`);
  P(/^(.+) entrou como (.+)\.$/, (m, a, b) => `${a} joined as ${t(b)}.`, (m, a, b) => `${a} entró como ${t(b)}.`);
  P(/^(.+) saiu\. Um bot assumiu\.$/, '$1 left. A bot took over.', '$1 salió. Un bot tomó su lugar.');
  P(/^(.+) a caminho…$/, '$1 on the way…', '$1 en camino…');
  P(/^(.+): vá até a Eclusa e pressione E para trocar de lugar\.$/, '$1: go to the Airlock and press E to swap places.', '$1: vaya a la Esclusa y presione E para cambiar de lugar.');
  P(/^Próximo evento previsto: (.+) no dia (\d+)\.$/, (m, a, n) => `Next predicted event: ${t(a)} on day ${n}.`, (m, a, n) => `Próximo evento previsto: ${t(a)} el día ${n}.`);
  P(/^Fundo de contingência: (\d+) pts$/, 'Contingency fund: $1 pts', 'Fondo de contingencia: $1 pts');
  P(/^Fundo de contingência: (\d+) ponto\(s\)\.$/, 'Contingency fund: $1 point(s).', 'Fondo de contingencia: $1 punto(s).');
  P(/^Comida para ≈ (\d+) dias numa viagem de ≈ (\d+) dias\. Será preciso racionar ou trocar\.$/, 'Food for ≈ $1 days on a trip of ≈ $2 days. You will need to ration or trade.', 'Comida para ≈ $1 días en un viaje de ≈ $2 días. Habrá que racionar o intercambiar.');
  P(/^(\d+)\. (.+)$/, (m, n, a) => `${n}. ${t(a)}`, (m, n, a) => `${n}. ${t(a)}`);
  P(/^(.+) \((\d+) porções\)$/, (m, a, n) => `${t(a)} (${n} portions)`, (m, a, n) => `${t(a)} (${n} porciones)`);
  P(/^(.+) \(fresco\)$/, (m, a) => `${t(a)} (fresh)`, (m, a) => `${t(a)} (fresco)`);
  P(/^(.+) \(acabou → ração\)$/, (m, a) => `${t(a)} (ran out → rations)`, (m, a) => `${t(a)} (se acabó → ración)`);
  P(/^Paramédico: (.+)$/, (m, a) => `Paramedic: ${t(a)}`, (m, a) => `Paramédico: ${t(a)}`);
  P(/^(.+):$/, (m, a) => (t(a) !== a ? t(a) + ':' : m), (m, a) => (t(a) !== a ? t(a) + ':' : m));
  // partes separadas por " · " (traduz cada uma)
  P(/^(.+?) · (.+)$/, (m) => m.split(' · ').map(x => t(x)).join(' · '), (m) => m.split(' · ').map(x => t(x)).join(' · '));
})();

// ---------- padrões de mensagens concatenadas no código ----------
(function () {
  const t = s => I18n.t(s);
  const low = s => s.charAt(0).toLowerCase() + s.slice(1);
  const P = (re, en, es) => { I18N_PATTERNS.en.unshift([re, en]); I18N_PATTERNS.es.unshift([re, es]); };
  P(/^Controle da Missão: (.+)$/, (m, a) => `Mission Control: ${t(a)}`, (m, a) => `Control de la Misión: ${t(a)}`);
  P(/^Copiloto de IA sugere: (.+)$/, (m, a) => `AI copilot suggests: ${low(t(a))}`, (m, a) => `El copiloto de IA sugiere: ${low(t(a))}`);
  P(/^MISSÃO FALHOU: (.+)$/, (m, a) => `MISSION FAILED: ${t(a)}`, (m, a) => `MISIÓN FALLIDA: ${t(a)}`);
  P(/^Modo de cruzeiro: (.+)$/, (m, a) => `Cruise mode: ${t(a)}`, (m, a) => `Modo de crucero: ${t(a)}`);
  P(/^Nova receita no livro: (.+)$/, (m, a) => `New recipe in the book: ${t(a)}`, (m, a) => `Nueva receta en el libro: ${t(a)}`);
  P(/^Olhar estratégico: a pista de (.+) ficou mais clara\.$/, (m, a) => `Strategic eye: the clue for ${t(a)} is clearer now.`, (m, a) => `Mirada estratégica: la pista de ${t(a)} quedó más clara.`);
  P(/^A tempestade chega em (\d+) s\.$/, 'The storm arrives in $1 s.', 'La tormenta llega en $1 s.');
  P(/^Este passo precisa de um (.+)\.$/, (m, a) => `This step needs a ${low(t(a))}.`, (m, a) => `Este paso necesita un ${low(t(a))}.`);
  P(/^Manutenção preventiva: (.+)$/, (m, a) => `Preventive maintenance: ${t(a)}`, (m, a) => `Mantenimiento preventivo: ${t(a)}`);
  P(/^Regulação térmica: (.+)$/, (m, a) => `Thermal regulation: ${t(a)}`, (m, a) => `Regulación térmica: ${t(a)}`);
  P(/^Nenhum (.+) disponível para se dedicar\.$/, (m, a) => `No ${low(t(a))} available to dedicate.`, (m, a) => `Ningún ${low(t(a))} disponible para dedicarse.`);
  P(/^Vá até: (.+)\.$/, (m, a) => `Go to: ${t(a)}.`, (m, a) => `Vaya a: ${t(a)}.`);
  P(/^Não estou bem\.\.\. sinto (.+)\.$/, (m, a) => `I don't feel well... I have ${t(a)}.`, (m, a) => `No me siento bien... tengo ${t(a)}.`);
  P(/^Indo agora: (.+)$/, (m, a) => `On my way: ${low(t(a.charAt(0).toUpperCase() + a.slice(1).replace(/\.$/, '')))}.`, (m, a) => `Voy ahora: ${low(t(a.charAt(0).toUpperCase() + a.slice(1).replace(/\.$/, '')))}.`);
  P(/^Coletar a maior parte do lixo \((\d+) de (\d+)\)$/, 'Collect most of the trash ($1 of $2)', 'Recoger la mayor parte de la basura ($1 de $2)');
  P(/^Levar toda a tripulação ao abrigo \((\d+)\/(\d+) nos Dormitórios\)$/, 'Take the whole crew to the shelter ($1/$2 in the Quarters)', 'Llevar a toda la tripulación al refugio ($1/$2 en los Dormitorios)');
  P(/^(.+) inutilizável até o fim da fase\.$/, (m, a) => `${t(a)} unusable until the end of the phase.`, (m, a) => `${t(a)} inutilizable hasta el final de la fase.`);
  P(/^📢 (.+) foi chamado\(a\): (.+)$/, (m, a, b) => `📢 ${a} was called: ${t(b)}`, (m, a, b) => `📢 ${a} fue llamado/a: ${t(b)}`);
  P(/^(.+) não atendeu o chamado; (.+) assumiu\.$/, '$1 did not answer the call; $2 took over.', '$1 no respondió al llamado; $2 tomó el relevo.');
  P(/^(.+) não atendeu o chamado\.$/, '$1 did not answer the call.', '$1 no respondió al llamado.');
  P(/^(.+) cuida pessoalmente: (.+) \(tripulante dedicado\)\.$/, (m, a, b) => `${a} handles it personally: ${t(b)} (dedicated crew member).`, (m, a, b) => `${a} se encarga personalmente: ${t(b)} (tripulante dedicado).`);
  P(/^Rádio — ([\d.,]+) MHz$/, 'Radio — $1 MHz', 'Radio — $1 MHz');
  P(/^Pousamos em (.+)! Mas uma colônia não se faz sozinha\.$/, (m, a) => `We landed at ${t(a)}! But a colony does not build itself.`, (m, a) => `¡Aterrizamos en ${t(a)}! Pero una colonia no se construye sola.`);
})();

// ---------- textos que faltavam: 'pt': [en, es] ----------
(function () {
  const X = {
    // avatar
    'Estilo rápido': ['Quick style', 'Estilo rápido'], 'Feminino': ['Feminine', 'Femenino'], 'Masculino': ['Masculine', 'Masculino'],
    'Rabo de cavalo': ['Ponytail', 'Cola de caballo'], 'Tranças': ['Braids', 'Trenzas'], 'Chanel': ['Bob', 'Bob'], 'Cacheado': ['Curly', 'Rizado'],
    'Maria-chiquinha': ['Pigtails', 'Coletas'], 'Ondulado': ['Wavy', 'Ondulado'], 'Longo com franja': ['Long with bangs', 'Largo con flequillo'],
    'Rosto': ['Face', 'Rostro'], 'Cílios': ['Eyelashes', 'Pestañas'], 'Blush': ['Blush', 'Rubor'], 'Brincos': ['Earrings', 'Aretes'], 'Batom': ['Lipstick', 'Labial'],
    'Laço': ['Bow', 'Moño'], 'Tiara': ['Tiara', 'Tiara'], 'Flor': ['Flower', 'Flor'], 'Presilha': ['Hair clip', 'Pasador'],
    'Parte de baixo': ['Bottoms', 'Parte de abajo'], 'Calça': ['Pants', 'Pantalón'], 'Short': ['Shorts', 'Short'], 'Saia': ['Skirt', 'Falda'], 'Vestido': ['Dress', 'Vestido'],
    'Cor da calça / saia': ['Pants / skirt color', 'Color del pantalón / falda'], 'Olhos': ['Eyes', 'Ojos'],
    // placas da Terra
    'TEMPERATURA: 46 °C': ['TEMPERATURE: 46 °C', 'TEMPERATURA: 46 °C'], 'USE MÁSCARA': ['WEAR A MASK', 'USE MASCARILLA'],
    'MAR: +10 cm DESDE 1993': ['SEA LEVEL: +10 cm SINCE 1993', 'MAR: +10 cm DESDE 1993'], 'COLÔNIA EM MARTE: VAGAS ESGOTADAS': ['MARS COLONY: NO SPOTS LEFT', 'COLONIA EN MARTE: SIN CUPOS'],
    '6.000+ EXOPLANETAS CONFIRMADOS': ['6,000+ CONFIRMED EXOPLANETS', '6.000+ EXOPLANETAS CONFIRMADOS'], 'PROJETO PONTES-01: ALISTAMENTO': ['PONTES-01 PROJECT: ENLISTMENT', 'PROYECTO PONTES-01: ALISTAMIENTO'],
    'CO₂: 420+ ppm (NASA)': ['CO₂: 420+ ppm (NASA)', 'CO₂: 420+ ppm (NASA)'],
    // multiplayer
    'Até 6 jogadores na tripulação + o Comandante (quem cria a sala). Funciona online direto pelo navegador: não precisa de servidor nem de VPN.': ['Up to 6 crew players + the Commander (who creates the room). It works online right in the browser: no server and no VPN needed.', 'Hasta 6 jugadores en la tripulación + el Comandante (quien crea la sala). Funciona en línea directo en el navegador: no necesita servidor ni VPN.'],
    'Avançado: servidor próprio': ['Advanced: your own server', 'Avanzado: servidor propio'],
    'Deixe em branco para usar a conexão online (P2P). Para usar o servidor incluído, rode': ['Leave blank to use the online (P2P) connection. To use the included server, run', 'Déjelo en blanco para usar la conexión en línea (P2P). Para usar el servidor incluido, ejecute'],
    'e informe o endereço, ex.: ws://localhost:8080/ws': ['and enter its address, e.g. ws://localhost:8080/ws', 'e indique la dirección, ej.: ws://localhost:8080/ws'],
    '🌐 Sala online (P2P): funciona pela internet, sem servidor e sem VPN. Mantenha esta aba aberta.': ['🌐 Online room (P2P): works over the internet, with no server and no VPN. Keep this tab open.', '🌐 Sala en línea (P2P): funciona por internet, sin servidor y sin VPN. Mantenga esta pestaña abierta.'],
    '🖧 Servidor próprio': ['🖧 Own server', '🖧 Servidor propio'],
    'Não foi possível conectar ao servidor. Rode “node server/server.js” e abra o jogo por ele.': ['Could not connect to the server. Run “node server/server.js” and open the game through it.', 'No se pudo conectar al servidor. Ejecute “node server/server.js” y abra el juego desde él.'],
    'Conexão encerrada.': ['Connection closed.', 'Conexión cerrada.'], 'Biblioteca de rede não carregou. Verifique a conexão.': ['The network library did not load. Check your connection.', 'La biblioteca de red no cargó. Verifique la conexión.'],
    'Erro de conexão online': ['Online connection error', 'Error de conexión en línea'], 'Não foi possível alcançar a sala. Confira o código e tente de novo.': ['Could not reach the room. Check the code and try again.', 'No se pudo llegar a la sala. Revise el código e intente de nuevo.'],
    'Sala não encontrada.': ['Room not found.', 'Sala no encontrada.'], 'Digite o código da sala.': ['Enter the room code.', 'Escriba el código de la sala.'], 'Sala cheia.': ['Room is full.', 'Sala llena.'],
    'Criando sala...': ['Creating room...', 'Creando sala...'], 'Conectando...': ['Connecting...', 'Conectando...'], 'URL inválida.': ['Invalid URL.', 'URL inválida.'],
    'O Comandante fechou a sala.': ['The Commander closed the room.', 'El Comandante cerró la sala.'],
    'Narração da introdução': ['Intro narration', 'Narración de la introducción'], 'Caminhando pela Terra poluída': ['Walking through polluted Earth', 'Caminando por la Tierra contaminada'], 'Montando a nave com a verba limitada': ['Building the ship on a limited budget', 'Armando la nave con presupuesto limitado'],
    // interface geral
    'Começar ▶': ['Start ▶', 'Empezar ▶'], 'Continuar': ['Continue', 'Continuar'], 'Próximo ▶': ['Next ▶', 'Siguiente ▶'], 'FALHA': ['FAILURE', 'FALLA'], 'Falha': ['Failure', 'Falla'], 'Crítico': ['Critical', 'Crítico'],
    'CHEGAMOS A PONTES-01': ['WE MADE IT TO PONTES-01', 'LLEGAMOS A PONTES-01'], 'Preparação': ['Preparation', 'Preparación'], 'Migração': ['Migration', 'Migración'],
    'Confirmar: sair para o título': ['Confirm: quit to title', 'Confirmar: salir al título'], '⏏ Sair para o título': ['⏏ Quit to title', '⏏ Salir al título'],
    'sem movimento': ['no movement', 'sin movimiento'], 'Itens de lazer da loja dão bônus.': ['Leisure items from the shop give a bonus.', 'Los artículos de ocio de la tienda dan bonificación.'],
    'Sem estufa hidropônica nem kit de ervas. Não há bandejas de cultivo a bordo.': ['No hydroponic greenhouse or herb kit. There are no growing trays on board.', 'Sin invernadero hidropónico ni kit de hierbas. No hay bandejas de cultivo a bordo.'],
    'Ração': ['Rations', 'Ración'], 'ração': ['rations', 'ración'], 'panela vazia': ['empty pot', 'olla vacía'], 'Cozinhar (−1 kWh, −2 L)': ['Cook (−1 kWh, −2 L)', 'Cocinar (−1 kWh, −2 L)'],
    'Cozinha equipada: fogão de indução e forno.': ['Equipped kitchen: induction stove and oven.', 'Cocina equipada: placa de inducción y horno.'],
    'Sem cozinha equipada: só receitas frias.': ['No equipped kitchen: cold recipes only.', 'Sin cocina equipada: solo recetas frías.'],
    'Sem cozinha equipada: só receitas frias. Arraste (clique) 2 ou 3 ingredientes para a panela. Errar não pune: você só perde os ingredientes.': ['No equipped kitchen: cold recipes only. Drag (click) 2 or 3 ingredients into the pot. Mistakes are not punished: you only lose the ingredients.', 'Sin cocina equipada: solo recetas frías. Arrastre (haga clic) 2 o 3 ingredientes a la olla. Equivocarse no castiga: solo pierde los ingredientes.'],
    'Arraste (clique) 2 ou 3 ingredientes para a panela. Errar não pune: você só perde os ingredientes.': ['Drag (click) 2 or 3 ingredients into the pot. Mistakes are not punished: you only lose the ingredients.', 'Arrastre (haga clic) 2 o 3 ingredientes a la olla. Equivocarse no castiga: solo pierde los ingredientes.'],
    '(receita não descoberta)': ['(recipe not discovered)', '(receta no descubierta)'], 'Luz': ['Light', 'Luz'], 'Nutrientes': ['Nutrients', 'Nutrientes'], 'Estufa': ['Greenhouse', 'Invernadero'],
    '0,6 kg/pessoa/dia': ['0.6 kg/person/day', '0,6 kg/persona/día'], '98% (ciclo fechado)': ['98% (closed loop)', '98% (ciclo cerrado)'], '70% (básico)': ['70% (basic)', '70% (básico)'],
    'Sintonize melhor para entender a mensagem.': ['Tune in better to understand the message.', 'Sintonice mejor para entender el mensaje.'],
    'Radar de longo alcance: aviso antecipado recebido.': ['Long-range radar: early warning received.', 'Radar de largo alcance: aviso anticipado recibido.'],
    '(+30% por dano)': ['(+30% from damage)', '(+30% por daño)'], 'Religar: rolagem necessária': ['Restart: roll required', 'Reencender: tirada necesaria'], 'religar (sem custo)': ['restart (free)', 'reencender (gratis)'],
    'Gasta 1 min do tripulante: +1': ['Uses 1 min of a crew member: +1', 'Usa 1 min del tripulante: +1'],
    'com a nave auxiliar (40 kg de combustível)': ['with the auxiliary lander (40 kg of fuel)', 'con la nave auxiliar (40 kg de combustible)'],
    'com a nave principal — arriscado (80 kg de combustível)': ['with the main ship — risky (80 kg of fuel)', 'con la nave principal — arriesgado (80 kg de combustible)'],
    'na rota': ['on our route', 'en la ruta'], 'Comida (ração)': ['Food (rations)', 'Comida (ración)'], 'Reator de fusão': ['Fusion reactor', 'Reactor de fusión'],
    // prontidão
    'Combustível justo para a rota rápida.': ['Fuel is tight for the fast route.', 'Combustible justo para la ruta rápida.'],
    'Reator instalado: energia sobrando, mas atenção ao calor.': ['Reactor installed: plenty of power, but watch the heat.', 'Reactor instalado: energía de sobra, pero atención al calor.'],
    'Líder excelente, nave frágil: qualquer falha grave pode ser fatal.': ['Excellent leader, fragile ship: any serious failure may be fatal.', 'Líder excelente, nave frágil: cualquier falla grave puede ser fatal.'],
    'Escudo magnético + Biorreator: os dois gastam energia constante e podem deixar a nave no vermelho.': ['Magnetic shield + Bioreactor: both drain power constantly and may leave the ship in the red.', 'Escudo magnético + Biorreactor: ambos gastan energía constante y pueden dejar la nave en rojo.'],
    'Sinergia: Estufa + Reciclador de água — ciclo fechado.': ['Synergy: Greenhouse + Water recycler — closed loop.', 'Sinergia: Invernadero + Reciclador de agua — ciclo cerrado.'],
    'Sinergia: lixo vira peças de reparo.': ['Synergy: trash becomes repair parts.', 'Sinergia: la basura se convierte en piezas de reparación.'],
    'Sinergia: Laboratório + Sonda dobram os dados.': ['Synergy: Lab + Probe double the data.', 'Sinergia: Laboratorio + Sonda duplican los datos.'],
    'Sinergia: Radar + Copiloto de IA — pistas ainda mais claras.': ['Synergy: Radar + AI copilot — even clearer clues.', 'Sinergia: Radar + Copiloto de IA — pistas aún más claras.'],
    'Sinergia: feridos se recuperam bem mais rápido.': ['Synergy: the injured recover much faster.', 'Sinergia: los heridos se recuperan mucho más rápido.'],
    'Verba estourada! Remova itens para decolar.': ['Over budget! Remove items to launch.', '¡Presupuesto excedido! Quite artículos para despegar.'],
    'Mais combustível': ['More fuel', 'Más combustible'], 'Viagem longa: mais água, comida e desgaste de sanidade': ['Long trip: more water, food and sanity wear', 'Viaje largo: más agua, comida y desgaste de cordura'],
    // receitas
    'Ensopado da Terra': ['Earth stew', 'Guiso de la Tierra'], 'Pão de algas': ['Algae bread', 'Pan de algas'], 'Sopa de reaproveitamento': ['Leftover soup', 'Sopa de aprovechamiento'],
    'Purê apimentado': ['Spicy mash', 'Puré picante'], 'Doce de batata': ['Sweet potato treat', 'Dulce de papa'], 'Banquete do Dia da Terra': ['Earth Day Feast', 'Banquete del Día de la Tierra'],
    'Refeições quentes e familiares ajudam a manter o ânimo em missões longas.': ['Warm, familiar meals help keep spirits up on long missions.', 'Las comidas calientes y familiares ayudan a mantener el ánimo en misiones largas.'],
    'Algas crescem rápido e servem de comida de emergência.': ['Algae grow fast and work as emergency food.', 'Las algas crecen rápido y sirven de comida de emergencia.'],
    'Na ISS usam tortilhas no lugar do pão: migalhas flutuam e podem entrar nos equipamentos.': ['On the ISS they use tortillas instead of bread: crumbs float and can get into equipment.', 'En la ISS usan tortillas en vez de pan: las migas flotan y pueden entrar en los equipos.'],
    'Reaproveitar sobras reduz o lixo orgânico a bordo.': ['Reusing leftovers cuts organic waste on board.', 'Aprovechar las sobras reduce la basura orgánica a bordo.'],
    'Sal e pimenta vão em forma líquida no espaço: o pó flutua e pode ser inalado.': ['Salt and pepper go up in liquid form: powder floats and can be inhaled.', 'La sal y la pimienta van en forma líquida al espacio: el polvo flota y puede inhalarse.'],
    'Doces são raros a bordo e muito valorizados pela tripulação.': ['Sweets are rare on board and highly valued by the crew.', 'Los dulces son raros a bordo y muy valorados por la tripulación.'],
    // doenças
    'Respiração normal': ['Normal breathing', 'Respiración normal'], 'Sistema vestibular confuso pela microgravidade': ['Inner ear confused by microgravity', 'Sistema vestibular confundido por la microgravedad'],
    'Dor de cabeça (fluidos na cabeça)': ['Headache (fluids in the head)', 'Dolor de cabeza (líquidos en la cabeza)'], 'Pressão intracraniana elevada pelo deslocamento de fluidos': ['Raised intracranial pressure from fluid shift', 'Presión intracraneal elevada por el desplazamiento de líquidos'],
    'dor de cabeça e rosto inchado': ['a headache and a puffy face', 'dolor de cabeza y la cara hinchada'], 'Reação a poeira e partículas flutuantes': ['Reaction to dust and floating particles', 'Reacción al polvo y a partículas flotantes'],
    'Infecção bacteriana': ['Bacterial infection', 'Infección bacteriana'], 'Ruído no pulmão direito': ['Crackles in the right lung', 'Ruido en el pulmón derecho'],
    'Bactérias se multiplicam mais rápido em microgravidade': ['Bacteria multiply faster in microgravity', 'Las bacterias se multiplican más rápido en microgravedad'], 'febre e cansaço': ['a fever and fatigue', 'fiebre y cansancio'],
    'Hipóxia leve': ['Mild hypoxia', 'Hipoxia leve'], 'Respiração acelerada': ['Rapid breathing', 'Respiración acelerada'], 'Pouco oxigênio no sangue': ['Low blood oxygen', 'Poco oxígeno en la sangre'], 'falta de ar e confusão': ['shortness of breath and confusion', 'falta de aire y confusión'],
    'náusea e tontura': ['nausea and dizziness', 'náuseas y mareo'], 'coceira e espirros': ['itching and sneezing', 'picazón y estornudos'],
    // rádio
    'ATENCAO NAVE: TEMPESTADE SOLAR EM 2 DIAS. REFORCEM O ESCUDO': ['ATTENTION SHIP: SOLAR STORM IN 2 DAYS. REINFORCE THE SHIELD', 'ATENCION NAVE: TORMENTA SOLAR EN 2 DIAS. REFUERCEN EL ESCUDO'],
    'ROTA CORRIGIDA: DESVIEM 3 GRAUS PARA EVITAR DETRITOS': ['ROUTE CORRECTED: DEVIATE 3 DEGREES TO AVOID DEBRIS', 'RUTA CORREGIDA: DESVIEN 3 GRADOS PARA EVITAR ESCOMBROS'],
    'TROQUEM O LOTE DE REMEDIOS: ESTOQUE PODE ESTAR VENCIDO': ['REPLACE THE MEDICINE BATCH: STOCK MAY BE EXPIRED', 'CAMBIEN EL LOTE DE MEDICAMENTOS: EL STOCK PUEDE ESTAR VENCIDO'],
    'PONTES-01 CONFIRMADO: AGUA LIQUIDA DETECTADA NA SUPERFICIE': ['PONTES-01 CONFIRMED: LIQUID WATER DETECTED ON THE SURFACE', 'PONTES-01 CONFIRMADO: AGUA LIQUIDA DETECTADA EN LA SUPERFICIE'],
    'Mensagem decifrada': ['Message decoded', 'Mensaje descifrado'],
    // motor / navio
    'Oficina 3D: lixo reciclado virou 1 peça de reparo.': ['3D workshop: recycled trash became 1 repair part.', 'Taller 3D: la basura reciclada se convirtió en 1 pieza de reparación.'],
    'falta de oxigênio': ['lack of oxygen', 'falta de oxígeno'], 'desidratação': ['dehydration', 'deshidratación'], 'fome': ['starvation', 'hambre'], 'vazamento no traje': ['suit leak', 'fuga en el traje'], 'doença sem tratamento': ['untreated illness', 'enfermedad sin tratamiento'], 'pouso difícil': ['rough landing', 'aterrizaje difícil'],
    'ENERGIA ZERADA! Todos os sistemas pararam. Dois tripulantes desmaiaram.': ['POWER AT ZERO! All systems stopped. Two crew members fainted.', '¡ENERGÍA EN CERO! Todos los sistemas se detuvieron. Dos tripulantes se desmayaron.'],
    'O Comandante morreu. A missão falhou.': ['The Commander died. The mission failed.', 'El Comandante murió. La misión fracasó.'],
    'Restaram menos de 3 tripulantes vivos.': ['Fewer than 3 crew members are still alive.', 'Quedaron menos de 3 tripulantes vivos.'], 'Restaram menos de 3 tripulantes.': ['Fewer than 3 crew members remain.', 'Quedaron menos de 3 tripulantes.'],
    'O agricultor e os engenheiros morreram: não há como manter a nave nem plantar.': ['The farmer and the engineers died: there is no way to keep the ship running or grow food.', 'El agricultor y los ingenieros murieron: no hay forma de mantener la nave ni de cultivar.'],
    'O combustível acabou. A nave ficou à deriva no espaço.': ['Fuel ran out. The ship is adrift in space.', 'Se acabó el combustible. La nave quedó a la deriva en el espacio.'],
    'Refeições': ['Meals', 'Comidas'], 'Sem comida para a refeição!': ['No food for the meal!', '¡No hay comida para la comida!'], 'Restos de comida': ['Food scraps', 'Restos de comida'],
    'Estou com uma reação alérgica forte...': ['I\'m having a strong allergic reaction...', 'Tengo una reacción alérgica fuerte...'], 'Acho que comi algo que me fez mal.': ['I think I ate something that made me sick.', 'Creo que comí algo que me hizo mal.'],
    'Crise em andamento: a mesa completa virou revezamento.': ['Crisis under way: the full table became shifts.', 'Crisis en curso: la mesa completa pasó a turnos.'],
    'Briga por comida na mesa! Dois tripulantes perderam humor.': ['A fight over food at the table! Two crew members lost mood.', '¡Pelea por comida en la mesa! Dos tripulantes perdieron ánimo.'],
    'A tripulação se uniu na mesa. A próxima falha custará menos moral.': ['The crew bonded at the table. The next failure will cost less morale.', 'La tripulación se unió en la mesa. La próxima falla costará menos moral.'],
    'Clima tenso na mesa, mas nada aconteceu.': ['Tension at the table, but nothing happened.', 'Clima tenso en la mesa, pero no pasó nada.'],
    'Os remédios da enfermaria venceram! Troque o estoque na Enfermaria.': ['The sickbay medicines expired! Replace the stock at the Sickbay.', '¡Los medicamentos de la enfermería vencieron! Cambie el stock en la Enfermería.'],
    'Comandante, o lote de remédios venceu. Precisamos trocar.': ['Commander, the medicine batch expired. We need to replace it.', 'Comandante, el lote de medicamentos venció. Tenemos que cambiarlo.'],
    'Bônus de cientista': ['Scientist bonus', 'Bono de científico'], 'Cuidados na horta': ['Garden care', 'Cuidados del huerto'], 'Metade da viagem': ['Halfway there', 'Mitad del viaje'],
    'Nenhum engenheiro disponível.': ['No engineer available.', 'Ningún ingeniero disponible.'], 'Energia insuficiente para o reparo.': ['Not enough power for the repair.', 'Energía insuficiente para la reparación.'],
    'Recursos médicos insuficientes (precisa de 2).': ['Not enough medical supplies (needs 2).', 'Recursos médicos insuficientes (necesita 2).'], 'Troca do lote de remédios': ['Medicine batch replacement', 'Cambio del lote de medicamentos'],
    'Estoque de remédios renovado (válido por 12 dias).': ['Medicine stock renewed (valid for 12 days).', 'Stock de medicamentos renovado (válido por 12 días).'],
    'Sem paramédico, feridos não são tratados.': ['Without a paramedic, the injured are not treated.', 'Sin paramédico, los heridos no se tratan.'], 'Sem recursos médicos.': ['No medical supplies.', 'Sin recursos médicos.'], 'Sem recursos médicos!': ['No medical supplies!', '¡Sin recursos médicos!'],
    'Ejetado pela eclusa': ['Ejected through the airlock', 'Expulsado por la esclusa'], 'Algas exigem o Biorreator de algas.': ['Algae require the Algae bioreactor.', 'Las algas requieren el Biorreactor de algas.'],
    'O kit de ervas só cultiva folhas e pimenta.': ['The herb kit only grows leaves and peppers.', 'El kit de hierbas solo cultiva hojas y pimiento.'], 'Sem sementes/biomassa.': ['No seeds/biomass.', 'Sin semillas/biomasa.'],
    'Bandeja sacrificada para economizar água.': ['Tray sacrificed to save water.', 'Bandeja sacrificada para ahorrar agua.'], 'Ração insuficiente.': ['Not enough rations.', 'Ración insuficiente.'],
    'Esta receita precisa da cozinha equipada (fogão e forno).': ['This recipe needs the equipped kitchen (stove and oven).', 'Esta receta necesita la cocina equipada (placa y horno).'],
    'Combinação desconhecida': ['Unknown combination', 'Combinación desconocida'], 'Combinação desconhecida. Os ingredientes foram perdidos.': ['Unknown combination. The ingredients were lost.', 'Combinación desconocida. Se perdieron los ingredientes.'],
    'Comida de reserva insuficiente.': ['Not enough reserve food.', 'Comida de reserva insuficiente.'], 'Fundo de contingência insuficiente.': ['Not enough contingency fund.', 'Fondo de contingencia insuficiente.'],
    'Fundo: +1 peça de reposição.': ['Fund: +1 spare part.', 'Fondo: +1 pieza de repuesto.'], 'Fundo: +20 kWh de baterias de emergência.': ['Fund: +20 kWh of emergency batteries.', 'Fondo: +20 kWh de baterías de emergencia.'], 'Fundo: +15 kg de oxigênio.': ['Fund: +15 kg of oxygen.', 'Fondo: +15 kg de oxígeno.'],
    'A câmara comporta um tripulante por vez.': ['The chamber holds one crew member at a time.', 'La cámara admite un tripulante a la vez.'], 'Bem melhor depois de uma pausa.': ['Much better after a break.', 'Mucho mejor después de una pausa.'],
    'Estou melhor, voltando ao posto.': ['I feel better, heading back to my post.', 'Estoy mejor, vuelvo a mi puesto.'],
    // eventos
    'ignorar o alerta (sensores com defeito?)': ['ignore the alert (faulty sensors?)', 'ignorar la alerta (¿sensores defectuosos?)'], 'seguir os passos na ordem.': ['follow the steps in order.', 'seguir los pasos en orden.'],
    'Faça os passos na ordem.': ['Do the steps in order.', 'Haga los pasos en orden.'], 'Ninguém disponível. Use “Exemplo em campo”: vá você mesmo.': ['Nobody available. Use “Lead by example”: go yourself.', 'Nadie disponible. Use “Ejemplo en el campo”: vaya usted mismo.'],
    'Ninguém disponível para essa função.': ['Nobody available for that role.', 'Nadie disponible para esa función.'], 'Não consegui de primeira, vou tentar de novo...': ['Didn\'t get it the first time, trying again...', 'No me salió a la primera, lo intento de nuevo...'],
    'Filtro entupido trocado pelo reserva!': ['Clogged filter swapped for the spare!', '¡Filtro tapado cambiado por el de repuesto!'], 'Sem recursos para o scanner.': ['No supplies for the scanner.', 'Sin recursos para el escáner.'],
    'Scanner médico': ['Medical scanner', 'Escáner médico'], 'O remédio está vencido e não fez efeito! Troque o estoque primeiro.': ['The medicine is expired and had no effect! Replace the stock first.', '¡El medicamento está vencido y no hizo efecto! Cambie el stock primero.'],
    'Remédio': ['Medicine', 'Medicamento'], 'remédios': ['medicines', 'medicamentos'], 'Remédio errado. Os sintomas continuam.': ['Wrong medicine. The symptoms continue.', 'Medicamento equivocado. Los síntomas siguen.'], 'Tripulante indisponível.': ['Crew member unavailable.', 'Tripulante no disponible.'],
    'Rota com assistência gravitacional: -15% de consumo, +2 dias.': ['Gravity-assist route: -15% consumption, +2 days.', 'Ruta con asistencia gravitacional: -15% de consumo, +2 días.'],
    'Cruzeiro econômico definido para o resto da viagem.': ['Economy cruise set for the rest of the trip.', 'Crucero económico fijado para el resto del viaje.'], 'Rota mantida. A tripulação ficou apreensiva.': ['Route kept. The crew is uneasy.', 'Ruta mantenida. La tripulación quedó inquieta.'],
    'Desviem dos maiores, os pequenos o escudo aguenta.': ['Dodge the big ones, the shield can take the small ones.', 'Esquiven los grandes, el escudo aguanta los pequeños.'], 'ativar o escudo antes de pilotar.': ['turn on the shield before piloting.', 'activar el escudo antes de pilotar.'],
    'Conferir no radar se o caminho ficou livre': ['Check the radar to see if the path is clear', 'Revisar en el radar si el camino quedó libre'], 'Impactos de meteoros': ['Meteor impacts', 'Impactos de meteoros'],
    'Sem desvio a tempo: vários impactos no casco e na propulsão.': ['No dodge in time: several impacts on the hull and propulsion.', 'Sin desvío a tiempo: varios impactos en el casco y la propulsión.'], 'Um painel solar foi atingido!': ['A solar panel was hit!', '¡Un panel solar fue alcanzado!'],
    'A reserva do tanque auxiliar resolve. Válvula, bomba e confirmação no painel.': ['The auxiliary tank reserve will fix it. Valve, pump, then confirm on the panel.', 'La reserva del tanque auxiliar lo resuelve. Válvula, bomba y confirmación en el panel.'],
    'Reserva do tanque auxiliar': ['Auxiliary tank reserve', 'Reserva del tanque auxiliar'], 'Falha na alimentação': ['Feed failure', 'Falla de alimentación'], 'O motor engasgou: perdemos combustível e tempo.': ['The engine sputtered: we lost fuel and time.', 'El motor se ahogó: perdimos combustible y tiempo.'],
    'pedir o recálculo da rota à Terra.': ['ask Earth to recalculate the route.', 'pedir a la Tierra que recalcule la ruta.'], 'Rota recalculada com a ajuda da equipe em solo.': ['Route recalculated with help from the ground team.', 'Ruta recalculada con ayuda del equipo en tierra.'],
    'Sem nova rota, gastamos ainda mais combustível.': ['Without a new route, we burned even more fuel.', 'Sin nueva ruta, gastamos aún más combustible.'],
    'Usem os cilindros. O filtro reserva está no compartimento do suporte à vida.': ['Use the cylinders. The spare filter is in the life support compartment.', 'Usen los cilindros. El filtro de repuesto está en el compartimento de soporte vital.'],
    'inspecionar os filtros e trocar o entupido.': ['inspect the filters and swap the clogged one.', 'inspeccionar los filtros y cambiar el tapado.'], 'Trocar pelo filtro reserva': ['Swap for the spare filter', 'Cambiar por el filtro de repuesto'],
    'Reiniciar o sistema de O₂ e conferir o nível verde': ['Restart the O₂ system and check for the green level', 'Reiniciar el sistema de O₂ y revisar el nivel verde'],
    'Reiniciar o sistema de o₂ e conferir o nível verde': ['Restart the O₂ system and check for the green level', 'Reiniciar el sistema de O₂ y revisar el nivel verde'],
    'Filtro trocado, oxigênio de volta ao verde.': ['Filter swapped, oxygen back in the green.', 'Filtro cambiado, oxígeno de vuelta en verde.'], 'Falha na filtragem': ['Filtration failure', 'Falla de filtración'],
    'A filtragem ficou parada tempo demais. Suporte à vida danificado.': ['Filtration was down too long. Life support damaged.', 'La filtración estuvo parada demasiado tiempo. Soporte vital dañado.'],
    'Reiniciem o computador e recalibrem pelo mapa estelar.': ['Restart the computer and recalibrate with the star map.', 'Reinicien la computadora y recalibren con el mapa estelar.'], 'chamar o engenheiro para reiniciar e recalibrar.': ['call the engineer to restart and recalibrate.', 'llamar al ingeniero para reiniciar y recalibrar.'],
    'Carregar o mapa de backup': ['Load the backup map', 'Cargar el mapa de respaldo'], 'Computador recalibrado. A nave sabe onde está de novo.': ['Computer recalibrated. The ship knows where it is again.', 'Computadora recalibrada. La nave sabe dónde está otra vez.'],
    'A nave ficou perdida por tempo demais e desviou da rota.': ['The ship was lost for too long and drifted off course.', 'La nave estuvo perdida demasiado tiempo y se desvió de la ruta.'],
    'Recolham tudo que flutua e confiram os mecanismos.': ['Gather everything floating and check the mechanisms.', 'Recojan todo lo que flota y revisen los mecanismos.'], 'coletar o lixo e chamar um engenheiro para o motor.': ['collect the trash and call an engineer for the engine.', 'recoger la basura y llamar a un ingeniero para el motor.'],
    'Lixo demais pela nave: mau cheiro, mofo e um mecanismo travado.': ['Too much trash around the ship: bad smell, mold and a jammed mechanism.', 'Demasiada basura en la nave: mal olor, moho y un mecanismo trabado.'],
    '…ssshhh… (a dica também chegou cortada)': ['…ssshhh… (the hint got cut off too)', '…ssshhh… (la pista también llegó cortada)'], 'girar o sintonizador até o chiado sumir.': ['turn the tuner until the static goes away.', 'girar el sintonizador hasta que desaparezca el ruido.'],
    'O rádio voltou, mas a mensagem foi mal interpretada. A tripulação ficou confusa.': ['The radio is back, but the message was misread. The crew is confused.', 'La radio volvió, pero el mensaje se interpretó mal. La tripulación quedó confundida.'],
    'Ficamos sem entender o aviso da Terra.': ['We never understood Earth\'s warning.', 'Nos quedamos sin entender el aviso de la Tierra.'], 'Dica: verifique a validade dos remédios na Enfermaria.': ['Tip: check the medicine expiry date at the Sickbay.', 'Consejo: revise la validez de los medicamentos en la Enfermería.'],
    'Destilação, filtração, oxidação e desinfecção — nessa ordem.': ['Distillation, filtration, oxidation and disinfection — in that order.', 'Destilación, filtración, oxidación y desinfección — en ese orden.'], 'seguir as 4 etapas do ciclo fechado.': ['follow the 4 steps of the closed loop.', 'seguir las 4 etapas del ciclo cerrado.'],
    'Processar a água no ciclo fechado': ['Process the water in the closed loop', 'Procesar el agua en el ciclo cerrado'], 'Irrigação contaminada': ['Contaminated irrigation', 'Riego contaminado'],
    'A água contaminada se espalhou. Perdemos água e alguém adoeceu.': ['The contaminated water spread. We lost water and someone got sick.', 'El agua contaminada se esparció. Perdimos agua y alguien enfermó.'],
    'Água descontaminada: destilada, filtrada, oxidada e desinfetada.': ['Water decontaminated: distilled, filtered, oxidized and disinfected.', 'Agua descontaminada: destilada, filtrada, oxidada y desinfectada.'],
    'Mandem outro tripulante pela eclusa, rápido!': ['Send another crew member through the airlock, fast!', '¡Manden a otro tripulante por la esclusa, rápido!'], 'Substituto: trocar de lugar pela eclusa': ['Substitute: swap places through the airlock', 'Sustituto: cambiar de lugar por la esclusa'],
    'O substituto não chegou a tempo.': ['The substitute did not arrive in time.', 'El sustituto no llegó a tiempo.'], 'Vou no lugar dele!': ['I\'ll go in their place!', '¡Voy en su lugar!'],
    'Usem os aparelhos para o diagnóstico antes do remédio.': ['Use the devices to diagnose before giving medicine.', 'Usen los aparatos para el diagnóstico antes del medicamento.'], 'medir temperatura e oxigênio no sangue primeiro.': ['measure temperature and blood oxygen first.', 'medir temperatura y oxígeno en sangre primero.'],
    'Atenção: os remédios em estoque estão vencidos.': ['Warning: the medicines in stock are expired.', 'Atención: los medicamentos en stock están vencidos.'], 'Tentativas de tratamento': ['Treatment attempts', 'Intentos de tratamiento'],
    'Levar toda a tripulação ao abrigo (Dormitórios)': ['Take the whole crew to the shelter (Quarters)', 'Llevar a toda la tripulación al refugio (Dormitorios)'], 'Parte da tripulação foi exposta à radiação.': ['Part of the crew was exposed to radiation.', 'Parte de la tripulación fue expuesta a la radiación.'],
    'Todos protegidos no abrigo. Ninguém foi exposto.': ['Everyone safe in the shelter. Nobody was exposed.', 'Todos protegidos en el refugio. Nadie fue expuesto.'], 'Todos protegidos no abrigo.': ['Everyone safe in the shelter.', 'Todos protegidos en el refugio.'],
    'Tripulação a caminho do abrigo!': ['Crew heading to the shelter!', '¡Tripulación camino al refugio!'], 'Ordenar abrigo a todos': ['Order everyone to the shelter', 'Ordenar refugio a todos'],
    // térmico
    'Rotação': ['Rotation', 'Rotación'], 'Poucas soluções, bem combinadas. Preparem-se antes.': ['Few solutions, well combined. Prepare beforehand.', 'Pocas soluciones, bien combinadas. Prepárense antes.'], 'girar a nave cedo e abrir radiadores no pico.': ['spin the ship early and open the radiators at the peak.', 'girar la nave temprano y abrir los radiadores en el pico.'],
    'Aqui o calor só sai por radiação. Se não abrirmos os radiadores, ele fica preso.': ['Out here heat only leaves by radiation. If we don\'t open the radiators, it stays trapped.', 'Aquí el calor solo sale por radiación. Si no abrimos los radiadores, queda atrapado.'],
    'Os propulsores estão fazendo um ruído estranho... não sei se aguentam girar a nave por muito tempo.': ['The thrusters are making a strange noise... not sure they can keep spinning the ship for long.', 'Los propulsores hacen un ruido extraño... no sé si aguantan girar la nave mucho tiempo.'],
    'O isolamento rasgou. Preciso sair para consertar, mas vou ficar exposto.': ['The insulation tore. I need to go out and fix it, but I\'ll be exposed.', 'El aislamiento se rasgó. Tengo que salir a repararlo, pero quedaré expuesto.'],
    '(respiração pesada) O isolamento rasgou... preciso sair para consertar, mas vou ficar exposto.': ['(heavy breathing) The insulation tore... I need to go out and fix it, but I\'ll be exposed.', '(respiración pesada) El aislamiento se rasgó... tengo que salir a repararlo, pero quedaré expuesto.'],
    'Nossos instrumentos esquentam muito. Podemos desligar alguns, mas perdemos dados.': ['Our instruments run hot. We can turn some off, but we lose data.', 'Nuestros instrumentos se calientan mucho. Podemos apagar algunos, pero perdemos datos.'],
    'A tripulação está sentindo frio. Se continuar assim, o corpo perde energia e o raciocínio piora.': ['The crew is getting cold. If this goes on, the body loses energy and thinking gets worse.', 'La tripulación siente frío. Si sigue así, el cuerpo pierde energía y el razonamiento empeora.'],
    'A estrela se aproxima': ['The star approaches', 'La estrella se acerca'], 'A estrela se aproxima: o lado do Sol sobe para +120 °C.': ['The star approaches: the sunward side climbs to +120 °C.', 'La estrella se acerca: el lado del Sol sube a +120 °C.'],
    'A estrela se aproxima: o lado do Sol sobe para +100 °C.': ['The star approaches: the sunward side climbs to +100 °C.', 'La estrella se acerca: el lado del Sol sube a +100 °C.'],
    'Alerta de calor. Decisão: ligar a rotação agora ou esperar.': ['Heat alert. Decision: start rotation now or wait.', 'Alerta de calor. Decisión: activar la rotación ahora o esperar.'],
    'Rasgo no isolamento': ['Insulation tear', 'Rasgadura en el aislamiento'], 'Rasgo no isolamento! Um micrometeoroide atingiu o cobertor térmico.': ['Insulation tear! A micrometeoroid hit the thermal blanket.', '¡Rasgadura en el aislamiento! Un micrometeoroide golpeó la manta térmica.'],
    'Um micrometeoroide bateu no cobertor multicamadas, mas ele aguentou.': ['A micrometeoroid hit the multilayer blanket, but it held.', 'Un micrometeoroide golpeó la manta multicapa, pero aguantó.'],
    'Sobrecarga elétrica': ['Electrical overload', 'Sobrecarga eléctrica'], 'Sobrecarga elétrica: os equipamentos geram calor interno.': ['Electrical overload: the equipment generates internal heat.', 'Sobrecarga eléctrica: los equipos generan calor interno.'],
    'Entrada na sombra': ['Entering the shadow', 'Entrada en la sombra'], 'Entrada na sombra: a temperatura cai rápido.': ['Entering the shadow: the temperature drops fast.', 'Entrada en la sombra: la temperatura cae rápido.'],
    'Temperatura fora da faixa': ['Temperature out of range', 'Temperatura fuera de rango'], 'Equipamentos religados após o atraso.': ['Equipment back on after the delay.', 'Equipos reencendidos tras el retraso.'],
    'manutenção preventiva': ['preventive maintenance', 'mantenimiento preventivo'], 'outra solução já falhou': ['another solution already failed', 'otra solución ya falló'], 'propulsores reforçados': ['reinforced thrusters', 'propulsores reforzados'],
    'sinergia com a rotação': ['synergy with rotation', 'sinergia con la rotación'], 'conflito com aquecedores': ['conflict with heaters', 'conflicto con calefactores'], 'calor do reator': ['reactor heat', 'calor del reactor'],
    'sinergia com persianas': ['synergy with louvers', 'sinergia con persianas'], 'conflito com radiadores': ['conflict with radiators', 'conflicto con radiadores'], 'eficiência baixa': ['low efficiency', 'eficiencia baja'], 'líder no lugar do tripulante': ['leader filling in for the crew member', 'líder en lugar del tripulante'],
    'Exemplo em campo: o Comandante assume a função (−1).': ['Lead by example: the Commander takes the role (−1).', 'Ejemplo en el campo: el Comandante asume la función (−1).'],
    'Combustível insuficiente.': ['Not enough fuel.', 'Combustible insuficiente.'], 'Energia insuficiente.': ['Not enough power.', 'Energía insuficiente.'],
    'Equipamentos desligados: +6 kWh, comunicação cai, moral −3 e a pesquisa para.': ['Equipment off: +6 kWh, comms drop, morale −3 and research stops.', 'Equipos apagados: +6 kWh, cae la comunicación, moral −3 y la investigación se detiene.'],
    'Nenhum engenheiro disponível para o reparo.': ['No engineer available for the repair.', 'Ningún ingeniero disponible para la reparación.'], 'Ninguém disponível para a manutenção.': ['Nobody available for the maintenance.', 'Nadie disponible para el mantenimiento.'],
    'Sangue-frio: o Comandante rola de novo.': ['Cold blood: the Commander rolls again.', 'Sangre fría: el Comandante tira de nuevo.'],
    'Rotação funcionando: o calor se distribui (técnica do “espetinho”).': ['Rotation working: the heat spreads out (the “rotisserie” technique).', 'Rotación funcionando: el calor se reparte (técnica del “asador”).'], 'Rotação estável.': ['Rotation stable.', 'Rotación estable.'],
    'Radiadores abertos: o calor sai por radiação.': ['Radiators open: the heat leaves by radiation.', 'Radiadores abiertos: el calor sale por radiación.'], 'Aquecedores ligados.': ['Heaters on.', 'Calefactores encendidos.'],
    'Isolamento reparado: o escudo para de perder espessura.': ['Insulation repaired: the shield stops losing thickness.', 'Aislamiento reparado: el escudo deja de perder espesor.'], 'Conserto feito, voltando!': ['Fix done, coming back!', '¡Reparación hecha, vuelvo!'],
    'Persianas abertas: soltando calor.': ['Louvers open: releasing heat.', 'Persianas abiertas: liberando calor.'], 'Persianas fechadas: segurando calor.': ['Louvers closed: holding heat.', 'Persianas cerradas: reteniendo calor.'],
    'Equipamentos religados com sucesso.': ['Equipment restarted successfully.', 'Equipos reencendidos con éxito.'], 'PÂNICO NA TRIPULAÇÃO! Moral −10.': ['CREW PANIC! Morale −10.', '¡PÁNICO EN LA TRIPULACIÓN! Moral −10.'],
    'Gira pouco: o lado do Sol esquenta mais rápido.': ['Barely spinning: the sunward side heats up faster.', 'Gira poco: el lado del Sol se calienta más rápido.'], 'Propulsor travado! Plantação −6 kg.': ['Thruster jammed! Crops −6 kg.', '¡Propulsor trabado! Cultivo −6 kg.'],
    'O propulsor travou! A nave parou de girar!': ['The thruster jammed! The ship stopped spinning!', '¡El propulsor se trabó! ¡La nave dejó de girar!'], 'Propulsor queimou: sem controle de rotação e −50 kg de combustível.': ['Thruster burned out: no rotation control and −50 kg of fuel.', 'El propulsor se quemó: sin control de rotación y −50 kg de combustible.'],
    'Perda de fluido do radiador': ['Radiator fluid loss', 'Pérdida de fluido del radiador'], 'Perda de fluido: moral −5 e dados −20 GB.': ['Fluid loss: morale −5 and data −20 GB.', 'Pérdida de fluido: moral −5 y datos −20 GB.'],
    'Vazamento do fluido: radiador inutilizável até o fim da fase.': ['Fluid leak: radiator unusable until the end of the phase.', 'Fuga de fluido: radiador inutilizable hasta el fin de la fase.'],
    'Radiadores soltam menos calor: a temperatura sobe devagar.': ['Radiators release less heat: the temperature rises slowly.', 'Los radiadores liberan menos calor: la temperatura sube despacio.'], 'Aquecedores esquentam de forma irregular.': ['Heaters warm unevenly.', 'Los calefactores calientan de forma irregular.'],
    'Curto-circuito: comunicação cai por 1 min e moral −5.': ['Short circuit: comms down for 1 min and morale −5.', 'Cortocircuito: la comunicación cae por 1 min y moral −5.'], 'Incêndio pequeno': ['Small fire', 'Incendio pequeño'],
    'Incêndio pequeno: −9 kWh e −9 kg de oxigênio.': ['Small fire: −9 kWh and −9 kg of oxygen.', 'Incendio pequeño: −9 kWh y −9 kg de oxígeno.'], 'Incêndio pequeno: −4.5 kWh e −4.5 kg de oxigênio.': ['Small fire: −4.5 kWh and −4.5 kg of oxygen.', 'Incendio pequeño: −4,5 kWh y −4,5 kg de oxígeno.'],
    'Conserto fraco: escudo −2,5 mm.': ['Weak fix: shield −2.5 mm.', 'Reparación débil: escudo −2,5 mm.'], 'Escudo −7,5 mm.': ['Shield −7.5 mm.', 'Escudo −7,5 mm.'],
    'Atendimento do engenheiro': ['Engineer\'s treatment', 'Atención del ingeniero'], 'Acidente: o engenheiro foi ferido! O paramédico gasta recursos médicos. (Ninguém morre.)': ['Accident: the engineer was injured! The paramedic uses medical supplies. (Nobody dies.)', '¡Accidente: el ingeniero resultó herido! El paramédico gasta recursos médicos. (Nadie muere.)'],
    'Persianas abrem só um pouco.': ['Louvers only open a little.', 'Las persianas solo se abren un poco.'], 'Persianas travaram abertas: a água congela (−60 L).': ['Louvers stuck open: the water freezes (−60 L).', 'Persianas trabadas abiertas: el agua se congela (−60 L).'],
    'Persianas travaram e danificaram o casco: escudo −5 mm.': ['Louvers jammed and damaged the hull: shield −5 mm.', 'Las persianas se trabaron y dañaron el casco: escudo −5 mm.'], 'Atraso de 1 min para religar.': ['1 min delay to restart.', 'Retraso de 1 min para reencender.'],
    'Perda de dados': ['Data loss', 'Pérdida de datos'], 'Dados da fase perdidos': ['Phase data lost', 'Datos de la fase perdidos'], 'Perdemos os dados da fase e a comunicação com a Terra por 2 min.': ['We lost the phase data and contact with Earth for 2 min.', 'Perdimos los datos de la fase y la comunicación con la Tierra por 2 min.'],
    'Na Terra, a atmosfera regula a temperatura de graça. Numa nave, tudo isso tem custo.': ['On Earth, the atmosphere regulates temperature for free. On a ship, all of it has a cost.', 'En la Tierra, la atmósfera regula la temperatura gratis. En una nave, todo eso tiene un costo.'],
    'Plantação perdida': ['Crops lost', 'Cultivo perdido'], 'Falhas': ['Failures', 'Fallas'],
    // estação, planeta e pouso
    'Dados insuficientes para a análise.': ['Not enough data for the analysis.', 'Datos insuficientes para el análisis.'], 'Análise de exoplaneta': ['Exoplanet analysis', 'Análisis de exoplaneta'], 'Desvio de rota': ['Route detour', 'Desvío de ruta'],
    'Escolha primeiro o planeta de destino.': ['Choose the destination planet first.', 'Elija primero el planeta de destino.'], 'Análise científica correta': ['Correct scientific analysis', 'Análisis científico correcto'], 'Dados de exoplaneta': ['Exoplanet data', 'Datos de exoplaneta'],
    'O oxigênio acabou durante a volta à Estação Ponte-Alfa.': ['Oxygen ran out on the way back to Ponte-Alfa Station.', 'El oxígeno se acabó en la vuelta a la Estación Ponte-Alfa.'], 'Lição aprendida: dados de um exoplaneta real': ['Lesson learned: data from a real exoplanet', 'Lección aprendida: datos de un exoplaneta real'],
    'Dados do planeta': ['Planet data', 'Datos del planeta'], 'Descida de reconhecimento': ['Reconnaissance descent', 'Descenso de reconocimiento'],
    'A descida de reconhecimento foi turbulenta: casco danificado e um tripulante ferido.': ['The reconnaissance descent was rough: hull damaged and one crew member injured.', 'El descenso de reconocimiento fue turbulento: casco dañado y un tripulante herido.'],
    '(Sonda de reconhecimento: sem riscos para a tripulação.)': ['(Reconnaissance probe: no risk to the crew.)', '(Sonda de reconocimiento: sin riesgos para la tripulación.)'], '(Nave auxiliar usada.)': ['(Auxiliary lander used.)', '(Nave auxiliar usada.)'],
    '(Sem sonda: a própria nave desceu para coletar.)': ['(No probe: the ship itself went down to collect samples.)', '(Sin sonda: la propia nave bajó a recolectar.)'],
    'As primeiras mudas morreram. Comida e sementes perdidas.': ['The first seedlings died. Food and seeds lost.', 'Las primeras plántulas murieron. Comida y semillas perdidas.'],
    'Enfrente todos os desafios de adaptação antes.': ['Face all the adaptation challenges first.', 'Enfrente todos los desafíos de adaptación antes.'], 'Escolha um local de pouso.': ['Choose a landing site.', 'Elija un lugar de aterrizaje.'],
    'Sem comida nem sementes para começar a colônia.': ['No food or seeds to start the colony.', 'Sin comida ni semillas para empezar la colonia.'], 'O local escolhido não foi bem investigado ou é hostil demais para a colônia.': ['The chosen site was not investigated well or is too hostile for the colony.', 'El lugar elegido no se investigó bien o es demasiado hostil para la colonia.'],
    'Pouso difícil': ['Rough landing', 'Aterrizaje difícil'], 'A nave principal se partiu no pouso.': ['The main ship broke apart on landing.', 'La nave principal se partió en el aterrizaje.'],
    'Temperatura amena (≈ 19 °C), rios próximos': ['Mild temperature (≈ 19 °C), rivers nearby', 'Temperatura templada (≈ 19 °C), ríos cercanos'],
    'N₂ 74%, O₂ 19%, CO₂ 0,9%, pressão 0,93 atm — respirável com aclimatação.': ['N₂ 74%, O₂ 19%, CO₂ 0.9%, pressure 0.93 atm — breathable after acclimatization.', 'N₂ 74%, O₂ 19%, CO₂ 0,9%, presión 0,93 atm — respirable con aclimatación.'],
    'Campo magnético fraco (≈ 40% do terrestre). UV alto na costa, moderado no vale.': ['Weak magnetic field (≈ 40% of Earth\'s). High UV on the coast, moderate in the valley.', 'Campo magnético débil (≈ 40% del terrestre). UV alto en la costa, moderado en el valle.'],
    'Vale Equatorial': ['Equatorial Valley', 'Valle Ecuatorial'], 'Planalto Norte': ['Northern Plateau', 'Meseta Norte'], 'Costa do Mar Raso': ['Shallow Sea Coast', 'Costa del Mar Somero'],
    'Pontes-01 não existe': ['Pontes-01 does not exist', 'Pontes-01 no existe'], 'Há água líquida em Pontes-01': ['There is liquid water on Pontes-01', 'Hay agua líquida en Pontes-01'], 'Pontes-01 é um gigante gasoso': ['Pontes-01 is a gas giant', 'Pontes-01 es un gigante gaseoso'],
    'Impossível: 1.206 anos-luz. A sonda Voyager 1 (17 km/s) levaria cerca de 21 milhões de anos.': ['Impossible: 1,206 light-years. The Voyager 1 probe (17 km/s) would take about 21 million years.', 'Imposible: 1.206 años luz. La Voyager 1 (17 km/s) tardaría unos 21 millones de años.'],
    // nutrição
    'Energia': ['Energy', 'Energía'], 'Proteína': ['Protein', 'Proteína'], 'Vitaminas': ['Vitamins', 'Vitaminas'], 'Nutrição': ['Nutrition', 'Nutrición'], 'Saciedade': ['Fullness', 'Saciedad'], 'Humor': ['Mood', 'Ánimo'],
    'ferido': ['injured', 'herido'], 'incapacitado': ['incapacitated', 'incapacitado'],
    'Comandante com Sangue-frio: uma segunda chance por fase.': ['Commander with Cold blood: a second chance per phase.', 'Comandante con Sangre fría: una segunda oportunidad por fase.'],
    'AGUARDANDO O COMANDANTE': ['WAITING FOR THE COMMANDER', 'ESPERANDO AL COMANDANTE'], 'Aguardando o Comandante iniciar a jornada e montar a nave...': ['Waiting for the Commander to start the journey and build the ship...', 'Esperando a que el Comandante inicie la travesía y arme la nave...'],
    'Fechar sala': ['Close room', 'Cerrar sala'], 'SALA': ['ROOM', 'SALA'], 'Sala': ['Room', 'Sala'], 'Sair': ['Leave', 'Salir'], 'CONECTADO': ['CONNECTED', 'CONECTADO'],
    'Passe o código para até 6 amigos. Cada um assume um tripulante; os lugares vazios ficam com bots.': ['Share the code with up to 6 friends. Each one takes a crew member; empty seats are filled by bots.', 'Pase el código a hasta 6 amigos. Cada uno asume un tripulante; los lugares vacíos quedan con bots.'],
    'Você será:': ['You will be:', 'Usted será:'], 'Você será': ['You will be', 'Usted será'], 'Você é:': ['You are:', 'Usted es:'], 'Você é': ['You are', 'Usted es'],
    'fique na estação': ['stay at the station', 'quédese en la estación'], 'Criar sala (Comandante)': ['Create room (Commander)', 'Crear sala (Comandante)'], 'Entrar como tripulante': ['Join as crew member', 'Entrar como tripulante'], 'Código da sala': ['Room code', 'Código de la sala'],
    'Chamar eng.': ['Call eng.', 'Llamar ing.'], 'Chamar engenheiro': ['Call engineer', 'Llamar ingeniero'], 'Chamar navegador': ['Call navigator', 'Llamar navegante'], 'Chamar paramédico': ['Call paramedic', 'Llamar paramédico'], 'Chamar agricultor': ['Call farmer', 'Llamar agricultor'], 'Chamar pesquisador': ['Call researcher', 'Llamar investigador'], 'Chamar tripulante': ['Call crew member', 'Llamar tripulante'],
    'Ir até lá': ['Go there', 'Ir allí'], 'a caminho…': ['on the way…', 'en camino…'], 'Eu faço': ['I do it', 'Lo hago yo'],
    'Engenheiro 1': ['Engineer 1', 'Ingeniero 1'], 'Engenheiro 2': ['Engineer 2', 'Ingeniero 2'],
    'PROJETO PONTES-01b: ALISTAMENTO': ['PONTES-01b PROJECT: ENLISTMENT', 'PROYECTO PONTES-01b: ALISTAMIENTO'], 'CHEGAMOS A PONTES-01b': ['WE MADE IT TO PONTES-01b', 'LLEGAMOS A PONTES-01b'],
    'Descansar / lazer': ['Rest / leisure', 'Descansar / ocio'],
    'Análises (sonda de reconhecimento)': ['Analyses (reconnaissance probe)', 'Análisis (sonda de reconocimiento)'], 'Análises (nave auxiliar de pouso)': ['Analyses (auxiliary lander)', 'Análisis (nave auxiliar de aterrizaje)'],
    'Perda de dados: −30 GB.': ['Data loss: −30 GB.', 'Pérdida de datos: −30 GB.'], 'Perda de dados: −15 GB.': ['Data loss: −15 GB.', 'Pérdida de datos: −15 GB.'],
    'engenheiro': ['engineer', 'ingeniero'], 'navegador': ['navigator', 'navegante'], 'pesquisador': ['researcher', 'investigador'], 'paramedico': ['paramedic', 'paramédico'],
  };
  for (const pt in X) { if (I18N_DICT.en[pt] == null) I18N_DICT.en[pt] = X[pt][0]; if (I18N_DICT.es[pt] == null) I18N_DICT.es[pt] = X[pt][1]; }
})();
