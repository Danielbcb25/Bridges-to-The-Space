// ============================================================
//  QUIZ NASA — perguntas com dados oficiais da NASA; acertos rendem créditos
//  (usados na Loja). Perguntas com "l" valem bônus se o jogador já aprendeu
//  o assunto na cidade (Save.data.learned).
// ============================================================
'use strict';

// Q(lição, fonte, pergunta[pt,en,es], opções[[pt,en,es]...], índice correto, explicação[pt,en,es])
const Q = (l, src, q, o, a, e) => ({ l, src, q: K(...q), o: o.map(x => K(...x)), a, e: K(...e) });
const QUIZ_BANK = [
  Q('controle:0', 'NASA Space Communications and Navigation (DSN)',
    ['Quais são os 3 complexos da Rede de Espaço Profundo (DSN) da NASA?', 'Which are the 3 complexes of NASA\'s Deep Space Network (DSN)?', '¿Cuáles son los 3 complejos de la Red del Espacio Profundo (DSN) de la NASA?'],
    [['Goldstone, Madri e Canberra', 'Goldstone, Madrid and Canberra', 'Goldstone, Madrid y Canberra'], ['Houston, Paris e Tóquio', 'Houston, Paris and Tokyo', 'Houston, París y Tokio'], ['Cabo Canaveral, Moscou e Pequim', 'Cape Canaveral, Moscow and Beijing', 'Cabo Cañaveral, Moscú y Pekín'], ['Kourou, Lima e Sydney', 'Kourou, Lima and Sydney', 'Kourou, Lima y Sídney']], 0,
    ['As antenas ficam espaçadas ~120° ao redor da Terra: sempre uma delas enxerga a sonda.', 'The antennas are spaced ~120° around Earth, so one of them can always see the spacecraft.', 'Las antenas están separadas ~120° alrededor de la Tierra: siempre una ve la sonda.']),
  Q('controle:1', 'NASA Mars Exploration',
    ['Quanto tempo leva um sinal de rádio de Marte até a Terra (um sentido)?', 'How long does a radio signal take from Mars to Earth (one way)?', '¿Cuánto tarda una señal de radio de Marte a la Tierra (un sentido)?'],
    [['De 3 a 22 minutos', 'From 3 to 22 minutes', 'De 3 a 22 minutos'], ['Menos de 1 segundo', 'Under 1 second', 'Menos de 1 segundo'], ['Cerca de 2 dias', 'About 2 days', 'Cerca de 2 días'], ['Exatamente 1 hora', 'Exactly 1 hour', 'Exactamente 1 hora']], 0,
    ['A luz viaja a ~300.000 km/s, mas as distâncias entre planetas variam muito. Por isso sondas precisam de autonomia.', 'Light travels ~300,000 km/s, but distances between planets vary a lot. That is why probes need autonomy.', 'La luz viaja a ~300.000 km/s, pero las distancias entre planetas varían mucho. Por eso las sondas necesitan autonomía.']),
  Q('observatorio:0', 'NASA Mars Exploration',
    ['Qual gás compõe cerca de 95% da atmosfera de Marte?', 'Which gas makes up about 95% of the Martian atmosphere?', '¿Qué gas forma cerca del 95% de la atmósfera de Marte?'],
    [['Dióxido de carbono', 'Carbon dioxide', 'Dióxido de carbono'], ['Oxigênio', 'Oxygen', 'Oxígeno'], ['Nitrogênio', 'Nitrogen', 'Nitrógeno'], ['Hélio', 'Helium', 'Helio']], 0,
    ['Por isso o experimento MOXIE, no rover Perseverance, produziu oxigênio a partir do CO₂ marciano.', 'That is why the MOXIE experiment on the Perseverance rover made oxygen from Martian CO₂.', 'Por eso el experimento MOXIE del rover Perseverance produjo oxígeno a partir del CO₂ marciano.']),
  Q('', 'NASA Mars Exploration',
    ['A gravidade na superfície de Marte é aproximadamente…', 'Gravity on the surface of Mars is about…', 'La gravedad en la superficie de Marte es aproximadamente…'],
    [['38% da gravidade da Terra', '38% of Earth\'s gravity', '38% de la gravedad de la Tierra'], ['O dobro da Terra', 'Twice Earth\'s', 'El doble de la Tierra'], ['Igual à da Terra', 'The same as Earth\'s', 'Igual a la de la Tierra'], ['10% da Terra', '10% of Earth\'s', '10% de la Tierra']], 0,
    ['Quem pesa 100 kg na Terra "pesaria" cerca de 38 kg em Marte (a massa continua a mesma).', 'Someone weighing 100 kg on Earth would "weigh" about 38 kg on Mars (mass stays the same).', 'Quien pesa 100 kg en la Tierra "pesaría" unos 38 kg en Marte (la masa sigue igual).']),
  Q('', 'NASA Mars Exploration',
    ['Um dia marciano (sol) dura aproximadamente…', 'A Martian day (sol) lasts about…', 'Un día marciano (sol) dura aproximadamente…'],
    [['24 h 37 min', '24 h 37 min', '24 h 37 min'], ['12 horas', '12 hours', '12 horas'], ['30 horas', '30 hours', '30 horas'], ['48 horas', '48 hours', '48 horas']], 0,
    ['Equipes de rovers vivem em "tempo marciano" para operar a missão.', 'Rover teams live on "Mars time" to operate the mission.', 'Los equipos de los rovers viven en "hora marciana" para operar la misión.']),
  Q('', 'NASA Mars Exploration',
    ['O que foi o Ingenuity, da NASA?', 'What was NASA\'s Ingenuity?', '¿Qué fue Ingenuity, de la NASA?'],
    [['Um helicóptero que voou em Marte (2021)', 'A helicopter that flew on Mars (2021)', 'Un helicóptero que voló en Marte (2021)'], ['Um satélite da Lua', 'A Moon satellite', 'Un satélite de la Luna'], ['Um telescópio espacial', 'A space telescope', 'Un telescopio espacial'], ['Uma estação em órbita', 'An orbiting station', 'Una estación en órbita']], 0,
    ['Foi o primeiro voo controlado e motorizado em outro planeta.', 'It was the first powered, controlled flight on another planet.', 'Fue el primer vuelo motorizado y controlado en otro planeta.']),
  Q('casa:0', 'NASA Climate Change',
    ['Segundo a NASA, o CO₂ na atmosfera hoje está acima de…', 'According to NASA, atmospheric CO₂ today is above…', 'Según la NASA, el CO₂ atmosférico hoy supera…'],
    [['420 ppm', '420 ppm', '420 ppm'], ['280 ppm', '280 ppm', '280 ppm'], ['100 ppm', '100 ppm', '100 ppm'], ['1000 ppm', '1000 ppm', '1000 ppm']], 0,
    ['Antes da Revolução Industrial era ~280 ppm. O valor é medido continuamente, por exemplo no observatório de Mauna Loa.', 'Before the Industrial Revolution it was ~280 ppm. It is measured continuously, e.g. at Mauna Loa observatory.', 'Antes de la Revolución Industrial era ~280 ppm. Se mide de forma continua, por ejemplo en Mauna Loa.']),
  Q('casa:1', 'NASA GISS / NASA Climate Change',
    ['Desde o fim do século XIX, a temperatura média global subiu cerca de…', 'Since the late 19th century, global average temperature has risen about…', 'Desde fines del siglo XIX, la temperatura media global subió cerca de…'],
    [['1,2 °C', '1.2 °C', '1,2 °C'], ['0,01 °C', '0.01 °C', '0,01 °C'], ['5 °C', '5 °C', '5 °C'], ['Não mudou', 'It has not changed', 'No cambió']], 0,
    ['Os dados vêm de estações e satélites e são analisados pelo GISS da NASA.', 'The data come from stations and satellites and are analysed by NASA GISS.', 'Los datos vienen de estaciones y satélites y los analiza el GISS de la NASA.']),
  Q('casa:1', 'NASA Sea Level Change',
    ['Em média, o nível do mar sobe há décadas a cerca de…', 'On average, sea level has been rising for decades at about…', 'En promedio, el nivel del mar sube desde hace décadas a cerca de…'],
    [['3,4 mm por ano', '3.4 mm per year', '3,4 mm por año'], ['3,4 m por ano', '3.4 m per year', '3,4 m por año'], ['0,01 mm por ano', '0.01 mm per year', '0,01 mm por año'], ['Está caindo', 'It is falling', 'Está bajando']], 0,
    ['Satélites altimétricos medem o oceano desde 1993 — e a taxa vem acelerando.', 'Altimetry satellites have measured the ocean since 1993 — and the rate is accelerating.', 'Satélites altimétricos miden el océano desde 1993 — y la tasa se acelera.']),
  Q('', 'NASA ISS Facts',
    ['A que altitude orbita a Estação Espacial Internacional?', 'At what altitude does the International Space Station orbit?', '¿A qué altitud orbita la Estación Espacial Internacional?'],
    [['Cerca de 400 km', 'About 400 km', 'Cerca de 400 km'], ['Cerca de 40 km', 'About 40 km', 'Cerca de 40 km'], ['Cerca de 40.000 km', 'About 40,000 km', 'Cerca de 40.000 km'], ['Cerca de 384.000 km', 'About 384,000 km', 'Cerca de 384.000 km']], 0,
    ['Ela dá uma volta na Terra a cada ~90 minutos, a ~28.000 km/h.', 'It circles Earth every ~90 minutes at ~28,000 km/h.', 'Da una vuelta a la Tierra cada ~90 minutos, a ~28.000 km/h.']),
  Q('', 'NASA Voyager Mission',
    ['Qual sonda lançada em 1977 chegou ao espaço interestelar em 2012?', 'Which probe launched in 1977 reached interstellar space in 2012?', '¿Qué sonda lanzada en 1977 llegó al espacio interestelar en 2012?'],
    [['Voyager 1', 'Voyager 1', 'Voyager 1'], ['Apollo 11', 'Apollo 11', 'Apollo 11'], ['Hubble', 'Hubble', 'Hubble'], ['Curiosity', 'Curiosity', 'Curiosity']], 0,
    ['A Voyager 1 é o objeto feito por humanos mais distante da Terra.', 'Voyager 1 is the most distant human-made object from Earth.', 'La Voyager 1 es el objeto humano más lejano de la Tierra.']),
  Q('', 'NASA Webb Mission',
    ['Onde fica o Telescópio Espacial James Webb?', 'Where is the James Webb Space Telescope located?', '¿Dónde está el Telescopio Espacial James Webb?'],
    [['No ponto L2, a ~1,5 milhão de km da Terra', 'At point L2, ~1.5 million km from Earth', 'En el punto L2, a ~1,5 millones de km de la Tierra'], ['Em órbita baixa a 400 km', 'In low orbit at 400 km', 'En órbita baja a 400 km'], ['Na superfície da Lua', 'On the Moon\'s surface', 'En la superficie de la Luna'], ['Em Marte', 'On Mars', 'En Marte']], 0,
    ['Lá o escudo solar mantém os instrumentos infravermelhos bem frios.', 'There, the sunshield keeps the infrared instruments very cold.', 'Allí el escudo solar mantiene fríos los instrumentos infrarrojos.']),
  Q('missao:0', 'NASA Systems Engineering / NPR 7120.5',
    ['Qual fase do ciclo de vida de uma missão NASA cobre conceito e desenvolvimento de tecnologia?', 'Which phase of a NASA mission lifecycle covers concept and technology development?', '¿Qué fase del ciclo de vida de una misión NASA cubre el concepto y el desarrollo tecnológico?'],
    [['Fase A', 'Phase A', 'Fase A'], ['Fase E', 'Phase E', 'Fase E'], ['Fase F', 'Phase F', 'Fase F'], ['Fase D', 'Phase D', 'Fase D']], 0,
    ['Antes dela há a Pré-Fase A (estudos de conceito). Depois: B projeto preliminar, C projeto final e construção, D integração, testes e lançamento, E operações, F encerramento.', 'Before it comes Pre-Phase A (concept studies). Then: B preliminary design, C final design and build, D integration, test and launch, E operations, F closeout.', 'Antes está la Pre-Fase A (estudios de concepto). Luego: B diseño preliminar, C diseño final y construcción, D integración, pruebas y lanzamiento, E operaciones, F cierre.']),
  Q('missao:0', 'NASA Systems Engineering / NPR 7120.5',
    ['Em qual fase a missão já está no espaço, coletando e enviando ciência?', 'In which phase is the mission already in space, collecting and sending science?', '¿En qué fase la misión ya está en el espacio, recolectando y enviando ciencia?'],
    [['Fase E (operações)', 'Phase E (operations)', 'Fase E (operaciones)'], ['Fase B', 'Phase B', 'Fase B'], ['Pré-Fase A', 'Pre-Phase A', 'Pre-Fase A'], ['Fase C', 'Phase C', 'Fase C']], 0,
    ['A Fase E é de operações e sustentação; a F é o encerramento (por exemplo, descarte seguro da sonda).', 'Phase E is operations and sustainment; F is closeout (for example, safe disposal of the spacecraft).', 'La Fase E es de operaciones y sostenimiento; la F es el cierre (por ejemplo, descarte seguro de la sonda).']),
  Q('missao:1', 'NASA Systems Engineering Handbook',
    ['O que significa a sigla PDR numa missão NASA?', 'What does PDR stand for in a NASA mission?', '¿Qué significa la sigla PDR en una misión NASA?'],
    [['Revisão Preliminar de Projeto', 'Preliminary Design Review', 'Revisión Preliminar de Diseño'], ['Plano de Decolagem Rápida', 'Rapid Departure Plan', 'Plan de Despegue Rápido'], ['Programa de Dados do Rover', 'Rover Data Program', 'Programa de Datos del Rover'], ['Painel de Direção Remota', 'Remote Driving Panel', 'Panel de Dirección Remota']], 0,
    ['Revisões (como PDR e CDR, a Revisão Crítica de Projeto) são portões: a missão só avança se o projeto estiver maduro.', 'Reviews (like PDR and CDR, the Critical Design Review) are gates: the mission only moves on if the design is mature.', 'Las revisiones (como PDR y CDR, la Revisión Crítica de Diseño) son puertas: la misión solo avanza si el diseño está maduro.']),
  Q('missao:2', 'NASA Science Mission Directorate',
    ['Numa missão científica, o que deve vir primeiro?', 'In a science mission, what should come first?', 'En una misión científica, ¿qué debe venir primero?'],
    [['As perguntas científicas, que definem objetivos e instrumentos', 'The science questions, which define objectives and instruments', 'Las preguntas científicas, que definen objetivos e instrumentos'], ['Escolher a cor da nave', 'Choosing the spacecraft color', 'Elegir el color de la nave'], ['Comprar o foguete', 'Buying the rocket', 'Comprar el cohete'], ['Escolher a data da festa de lançamento', 'Picking the launch party date', 'Elegir la fecha de la fiesta de lanzamiento']], 0,
    ['Perguntas → objetivos → requisitos → instrumentos e nave. O design da missão nasce da ciência.', 'Questions → objectives → requirements → instruments and spacecraft. Mission design starts from the science.', 'Preguntas → objetivos → requisitos → instrumentos y nave. El diseño nace de la ciencia.']),
  Q('missao:2', 'NASA Systems Engineering Handbook',
    ['Por que as missões mantêm margens (folgas) de massa, energia e orçamento?', 'Why do missions keep margins (reserves) of mass, power and budget?', '¿Por qué las misiones mantienen márgenes de masa, energía y presupuesto?'],
    [['Porque imprevistos acontecem e o projeto cresce durante o desenvolvimento', 'Because surprises happen and designs grow during development', 'Porque ocurren imprevistos y el diseño crece durante el desarrollo'], ['Para gastar dinheiro à toa', 'To waste money', 'Para gastar dinero sin sentido'], ['Porque a NASA não sabe fazer contas', 'Because NASA cannot do math', 'Porque la NASA no sabe hacer cuentas'], ['Não existem margens', 'There are no margins', 'No existen márgenes']], 0,
    ['É exatamente a ideia do seu fundo de contingência no jogo!', 'This is exactly the idea behind your contingency fund in the game!', '¡Es exactamente la idea de su fondo de contingencia en el juego!']),
];

const QUIZ_N = 8;
const quizLearned = l => !!(l && Save.data.learned && Save.data.learned[l]);
function learnMark(key) { if (!key) return; Save.data.learned = Save.data.learned || {}; if (!Save.data.learned[key]) { Save.data.learned[key] = 1; Save.write(); } }

function quizStart() {
  const qs = shuffle(QUIZ_BANK.slice()).slice(0, QUIZ_N).map(q => ({ q, ord: shuffle(q.o.map((_, i) => i)) }));
  U.quiz = { qs, i: 0, ok: 0, earned: 0, picked: null, done: false };
}
function quizScreen() {
  const Z = U.quiz;
  if (!Z) return `<div class="panel center wide"><h2>🛰 ${esc(L(K('QUIZ NASA', 'NASA QUIZ', 'QUIZ NASA')))} <span class="credits">✦ ${Save.data.credits}</span></h2>
    <p>${L(K('Responda perguntas com dados oficiais da NASA e ganhe <b>créditos</b> para usar na Loja e na missão. Acertos de assuntos que você aprendeu na cidade rendem bônus. Visite o <b>Centro de Design de Missões NASA</b> na cidade para aprender mais!', 'Answer questions with official NASA data and earn <b>credits</b> for the Shop and your mission. Right answers on topics you learned in the city earn a bonus. Visit the <b>NASA Mission Design Center</b> in the city to learn more!', '¡Responda preguntas con datos oficiales de la NASA y gane <b>créditos</b> para la Tienda y la misión! Los aciertos en temas aprendidos en la ciudad dan bonificación. ¡Visite el <b>Centro de Diseño de Misiones NASA</b> en la ciudad para aprender más!'))}</p>
    <p class="small muted">${esc(L(K('Cada acerto: +5 ✦ (primeira vez) ou +1 ✦ (repetida) · +2 ✦ se você aprendeu o tema na cidade · Rodada perfeita: +5 ✦', 'Each right answer: +5 ✦ (first time) or +1 ✦ (repeat) · +2 ✦ if you learned the topic in the city · Perfect round: +5 ✦', 'Cada acierto: +5 ✦ (primera vez) o +1 ✦ (repetida) · +2 ✦ si aprendió el tema en la ciudad · Ronda perfecta: +5 ✦')))}</p>
    <div class="row"><button class="btn primary big" data-ui="quizStart">▶ ${esc(L(K('Começar (8 perguntas)', 'Start (8 questions)', 'Empezar (8 preguntas)')))}</button><button class="btn" data-ui="title">◀ ${esc(L('Voltar'))}</button></div></div>`;
  if (Z.done) {
    const perfect = Z.ok === Z.qs.length;
    return `<div class="panel center wide"><h2>🛰 ${esc(L(K('Resultado', 'Result', 'Resultado')))}</h2>
      <div class="bignum">${Z.ok}/${Z.qs.length}</div>
      <p class="credits big">+${Z.earned} ✦ ${esc(L(K('créditos', 'credits', 'créditos')))}${perfect ? ' 🏆' : ''}</p>
      <p class="small muted">${esc(L(K('Total na carteira:', 'Wallet total:', 'Total en la cartera:')))} ✦ ${Save.data.credits}</p>
      <div class="row"><button class="btn primary" data-ui="quizStart">↻ ${esc(L(K('Jogar de novo', 'Play again', 'Jugar de nuevo')))}</button><button class="btn" data-ui="shop">✦ ${esc(L('LOJA'))}</button><button class="btn" data-ui="quizExit">◀ ${esc(L('Voltar'))}</button></div></div>`;
  }
  const it = Z.qs[Z.i], q = it.q, ans = it.ord.indexOf(q.a);
  const opts = it.ord.map((oi, k) => {
    let cls = '';
    if (Z.picked !== null) cls = k === ans ? ' good' : k === Z.picked ? ' bad' : ' cant';
    return `<button class="opt${cls}" data-ui="quizPick" data-arg="${k}" ${Z.picked !== null ? 'disabled' : ''}><b>${'ABCD'[k]}</b> ${esc(L(q.o[oi]))}</button>`;
  }).join('');
  const fb = Z.picked === null ? '' : `<div class="quizfb"><b>${Z.picked === ans ? '✔ ' + esc(L(K('Correto!', 'Correct!', '¡Correcto!'))) : '✖ ' + esc(L(K('Não foi dessa vez.', 'Not this time.', 'Esta vez no.')))}</b> ${Z.gain ? `<span class="credits">+${Z.gain} ✦</span>` : ''}<p>${esc(L(q.e))}</p><p class="small muted">${esc(L(K('Fonte: ', 'Source: ', 'Fuente: ')))}${esc(q.src)}</p>
    <button class="btn primary" data-ui="quizNext">${Z.i + 1 >= Z.qs.length ? esc(L(K('Ver resultado', 'See result', 'Ver resultado'))) : esc(L(K('Próxima ▶', 'Next ▶', 'Siguiente ▶')))}</button></div>`;
  return `<div class="panel center wide scroll"><h2>🛰 ${esc(L(K('QUIZ NASA', 'NASA QUIZ', 'QUIZ NASA')))} <span class="small muted">${Z.i + 1}/${Z.qs.length} · ✦ ${Z.earned}</span></h2>
    <p class="citytxt">${esc(L(q.q))}</p><div class="opts">${opts}</div>${fb}
    <div class="row"><button class="btn small" data-ui="quizExit">✕ ${esc(L(K('Sair do quiz', 'Quit quiz', 'Salir del quiz')))}</button></div></div>`;
}
UIH.quiz = () => { U.screen = 'quiz'; U.quiz = null; S = S && S.scene === 'end' ? null : S; };
UIH.quizStart = () => { quizStart(); U.screen = 'quiz'; };
UIH.quizExit = () => { U.quiz = null; UIH.title(); };
UIH.quizPick = k => {
  const Z = U.quiz; if (!Z || Z.picked !== null || Z.done) return;
  k = +k; const it = Z.qs[Z.i], q = it.q; Z.picked = k; Z.gain = 0;
  if (it.ord[k] === q.a) {
    Save.data.quizDone = Save.data.quizDone || {};
    const key = q.q.pt; const first = !Save.data.quizDone[key];
    Z.gain = (first ? 5 : 1) + (quizLearned(q.l) ? 2 : 0);
    Save.data.quizDone[key] = 1; Z.ok++; if (Sfx.ok) Sfx.ok();
  } else if (Sfx.click) Sfx.click();
  Z.earned += Z.gain; Save.data.credits += Z.gain; Save.write();
};
UIH.quizNext = () => {
  const Z = U.quiz; if (!Z) return;
  if (Z.i + 1 >= Z.qs.length) {
    if (Z.ok === Z.qs.length) { Z.earned += 5; Save.data.credits += 5; Save.write(); }
    Z.done = true;
  } else { Z.i++; Z.picked = null; Z.gain = 0; }
};
