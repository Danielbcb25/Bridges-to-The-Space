// ============================================================
//  COLÔNIA EM PONTES-01 — o jogo continua depois do pouso
//  Construir a base, transmitir dados para a Terra e receber
//  as naves de tripulação (colonos). Textos novos em PT/EN/ES.
// ============================================================
'use strict';

const COLONY_W = 1900, CGROUND = 226;

const CBUILD = {
  nave: { x: 150, icon: '🚀', name: K('Nave pousada · Controle da Colônia', 'Landed ship · Colony Control', 'Nave aterrizada · Control de la Colonia'),
    fact: K('O pouso em Marte da Perseverance (2021) usou o “guindaste aéreo” e levou cerca de 7 minutos da atmosfera ao solo, sem nenhum controle ao vivo: o sinal demora minutos para chegar da Terra.', 'The Perseverance Mars landing (2021) used the “sky crane” and took about 7 minutes from atmosphere to ground, with no live control: radio takes minutes to arrive from Earth.', 'El aterrizaje de Perseverance en Marte (2021) usó la “grúa aérea” y duró unos 7 minutos desde la atmósfera hasta el suelo, sin control en vivo: la señal tarda minutos en llegar desde la Tierra.') },
  lab: { x: 360, icon: '🔬', name: K('Laboratório de campo e oficina', 'Field lab & workshop', 'Laboratorio de campo y taller'),
    fact: K('O instrumento MOXIE, a bordo do rover Perseverance, produziu oxigênio a partir do CO₂ da atmosfera de Marte: 122 gramas no total, o suficiente para um cachorro pequeno respirar por cerca de 10 horas (NASA). É o princípio do uso de recursos locais (ISRU).', 'The MOXIE instrument on the Perseverance rover made oxygen from Mars\' CO₂ atmosphere: 122 grams in total, enough for a small dog to breathe about 10 hours (NASA). This is the idea of in-situ resource utilization (ISRU).', 'El instrumento MOXIE del rover Perseverance produjo oxígeno a partir del CO₂ de la atmósfera de Marte: 122 gramos en total, suficiente para que un perro pequeño respire unas 10 horas (NASA). Es la idea del uso de recursos locales (ISRU).') },
  solar: { x: 580, icon: '☀', name: K('Campo solar', 'Solar field', 'Campo solar'),
    fact: K('A Estação Espacial Internacional tem painéis solares com área maior que a de uma quadra de tênis e gera energia da ordem de 100 kW em plena luz do Sol. Mas ela passa pela sombra da Terra a cada órbita (~90 min): por isso tem baterias.', 'The International Space Station has solar arrays larger than a tennis court and produces on the order of 100 kW in full sunlight. But it passes through Earth\'s shadow every orbit (~90 min), so it needs batteries.', 'La Estación Espacial Internacional tiene paneles solares más grandes que una cancha de tenis y produce del orden de 100 kW a plena luz. Pero pasa por la sombra de la Tierra en cada órbita (~90 min), por eso tiene baterías.') },
  agua: { x: 800, icon: '💧', name: K('Estação de água', 'Water station', 'Estación de agua'),
    fact: K('Em 2023 a ISS alcançou 98% de recuperação de água: urina, suor e até a umidade da respiração viram água potável de novo (NASA). A sonda Phoenix confirmou gelo de água em Marte em 2008.', 'In 2023 the ISS reached 98% water recovery: urine, sweat and even breath moisture become drinkable again (NASA). The Phoenix lander confirmed water ice on Mars in 2008.', 'En 2023 la ISS alcanzó un 98% de recuperación de agua: la orina, el sudor y hasta la humedad de la respiración vuelven a ser potables (NASA). La sonda Phoenix confirmó hielo de agua en Marte en 2008.') },
  estufa: { x: 1020, icon: '🌱', name: K('Estufa colonial', 'Colonial greenhouse', 'Invernadero colonial'),
    fact: K('Astronautas da ISS já cultivaram e comeram alface (2015, experimento Veggie) e colheram pimentas Hatch (2021, Plant Habitat-04). Plantas também produzem O₂ e ajudam o psicológico da tripulação (NASA).', 'ISS astronauts have grown and eaten lettuce (2015, Veggie experiment) and harvested Hatch chile peppers (2021, Plant Habitat-04). Plants also make O₂ and help the crew\'s well-being (NASA).', 'Los astronautas de la ISS han cultivado y comido lechuga (2015, experimento Veggie) y cosechado chiles Hatch (2021, Plant Habitat-04). Las plantas también producen O₂ y ayudan al bienestar de la tripulación (NASA).') },
  torre: { x: 1240, icon: '📡', name: K('Torre de comunicação', 'Communication tower', 'Torre de comunicación'),
    fact: K('A Rede de Espaço Profundo da NASA (DSN) tem 3 complexos — Goldstone (EUA), Madri (Espanha) e Canberra (Austrália) — separados por cerca de 120°, para que sempre um deles enxergue a nave enquanto a Terra gira. Em 2023 o teste DSOC enviou dados por laser a 267 Mbps de 31 milhões de km.', 'NASA\'s Deep Space Network (DSN) has 3 complexes — Goldstone (USA), Madrid (Spain) and Canberra (Australia) — about 120° apart, so one always sees the spacecraft as Earth turns. In 2023 the DSOC test sent laser data at 267 Mbps from 31 million km.', 'La Red del Espacio Profundo de la NASA (DSN) tiene 3 complejos — Goldstone (EE. UU.), Madrid (España) y Canberra (Australia) — separados unos 120°, para que siempre uno vea la nave mientras la Tierra gira. En 2023 la prueba DSOC envió datos por láser a 267 Mbps desde 31 millones de km.') },
  pista: { x: 1470, icon: '🛬', name: K('Pista de pouso e farol', 'Landing pad & beacon', 'Pista de aterrizaje y baliza'),
    fact: K('Pousar exige um alvo conhecido: a NASA escolheu a cratera Jezero, em Marte, depois de anos de imagens de satélite. Sinais de rádio e faróis ajudam a guiar o pouso final.', 'Landing needs a known target: NASA picked Jezero crater on Mars after years of satellite imagery. Radio signals and beacons help guide the final descent.', 'Aterrizar exige un objetivo conocido: la NASA eligió el cráter Jezero en Marte tras años de imágenes satelitales. Las señales de radio y las balizas ayudan en el descenso final.') },
  habitat: { x: 1720, icon: '🏠', name: K('Habitat e domos', 'Habitat & domes', 'Hábitat y domos'),
    fact: K('Na simulação CHAPEA da NASA, quatro voluntários viveram 378 dias em um habitat impresso em 3D (“Mars Dune Alpha”, 2023–2024) para estudar o isolamento, a comida e o trabalho em equipe.', 'In NASA\'s CHAPEA simulation, four volunteers lived 378 days in a 3D-printed habitat (“Mars Dune Alpha”, 2023–2024) to study isolation, food and teamwork.', 'En la simulación CHAPEA de la NASA, cuatro voluntarios vivieron 378 días en un hábitat impreso en 3D (“Mars Dune Alpha”, 2023–2024) para estudiar el aislamiento, la comida y el trabajo en equipo.') },
};
const CSHORT = { nave: K('Nave', 'Ship', 'Nave'), lab: K('Laboratório', 'Lab', 'Laboratorio'), solar: K('Campo solar', 'Solar field', 'Campo solar'), agua: K('Água', 'Water', 'Agua'), estufa: K('Estufa', 'Greenhouse', 'Invernadero'), torre: K('Torre', 'Tower', 'Torre'), pista: K('Pista', 'Pad', 'Pista'), habitat: K('Habitat', 'Habitat', 'Hábitat') };
const CORDER = ['nave', 'lab', 'solar', 'agua', 'estufa', 'torre', 'pista', 'habitat'];
// custos por nível (kwh, água L, peças, sementes kg, duração s)
const CCOST = {
  solar: [null, { kwh: 8, peca: 1, dur: 10 }, { kwh: 12, peca: 1, dur: 12 }, { kwh: 16, peca: 2, dur: 14 }],
  agua: [null, { kwh: 10, peca: 1, dur: 10 }, { kwh: 14, peca: 1, dur: 12 }],
  estufa: [null, { kwh: 8, agua: 40, plant: 5, dur: 12 }, { kwh: 12, agua: 60, plant: 5, dur: 14 }],
  torre: [null, { kwh: 12, peca: 1, dur: 12 }, { kwh: 16, peca: 1, dur: 14 }],
  pista: [null, { kwh: 10, dur: 10 }, { kwh: 14, peca: 1, dur: 12 }],
  habitat: [null, { kwh: 12, peca: 1, agua: 30, dur: 14 }, { kwh: 14, peca: 1, agua: 30, dur: 14 }, { kwh: 16, peca: 2, agua: 40, dur: 16 }],
};
const CROLE = { solar: 'engenheiro', agua: 'engenheiro', estufa: 'agricultor', torre: 'engenheiro', pista: 'engenheiro', habitat: 'engenheiro', lab: 'pesquisador' };
const CREQ = { // pré-requisitos de construção (id → [[prédio, nível]])
  agua: [['solar', 1]], estufa: [['agua', 1]], torre: [['solar', 1]], pista: [['solar', 1]], habitat: [['solar', 1]],
};
const TX_PACKAGES = [
  { id: 'atmosfera', gb: 20, name: K('Atmosfera', 'Atmosphere', 'Atmósfera'), need: 'atmosfera' },
  { id: 'agua', gb: 20, name: K('Água', 'Water', 'Agua'), need: 'agua' },
  { id: 'solo', gb: 25, name: K('Solo', 'Soil', 'Suelo'), need: 'solo' },
  { id: 'radiacao', gb: 15, name: K('Radiação', 'Radiation', 'Radiación'), need: 'radiacao' },
  { id: 'biologia', gb: 30, name: K('Biologia', 'Biology', 'Biología'), need: 'biologia' },
  { id: 'diario', gb: 10, name: K('Diário de bordo da viagem', 'Voyage log', 'Diario de a bordo del viaje'), need: null },
  { id: 'saude', gb: 10, name: K('Relatório médico da tripulação', 'Crew medical report', 'Informe médico de la tripulación'), need: null },
];
const CSHIPS = [
  { n: 1, name: 'Arca-2', size: 10, sup: { kwh: 10, agua: 80, comida: 20 } },
  { n: 2, name: 'Arca-3', size: 15, sup: { kwh: 12, agua: 100, comida: 30 } },
  { n: 3, name: 'Arca-4', size: 20, sup: { kwh: 15, agua: 120, comida: 40 } },
];
const CFACTS = [
  K('Controle da Missão: na ISS, os astronautas perdem 1% a 1,5% da massa óssea por mês sem gravidade e treinam cerca de 2 horas por dia para reduzir isso (NASA).', 'Mission Control: on the ISS, astronauts lose 1–1.5% of bone mass per month in microgravity and exercise about 2 hours a day to reduce it (NASA).', 'Control de la Misión: en la ISS los astronautas pierden entre 1% y 1,5% de masa ósea por mes sin gravedad y entrenan unas 2 horas al día para reducirlo (NASA).'),
  K('Controle da Missão: um astronauta na ISS recebe cerca de 80 mSv de radiação em 6 meses; na Terra, a média natural é ≈ 3 mSv por ano (NASA).', 'Mission Control: an ISS astronaut gets about 80 mSv of radiation in 6 months; on Earth the natural average is ≈ 3 mSv a year (NASA).', 'Control de la Misión: un astronauta en la ISS recibe unos 80 mSv de radiación en 6 meses; en la Tierra el promedio natural es ≈ 3 mSv al año (NASA).'),
  K('Controle da Missão: a Voyager 1, lançada em 1977, viaja a 17 km/s e já está a cerca de um dia-luz de nós. Mesmo assim, levaria ~75 mil anos para chegar à estrela mais próxima.', 'Mission Control: Voyager 1, launched in 1977, travels at 17 km/s and is already about one light-day away. Even so, it would take ~75,000 years to reach the nearest star.', 'Control de la Misión: la Voyager 1, lanzada en 1977, viaja a 17 km/s y ya está a casi un día luz. Aun así, tardaría ~75.000 años en llegar a la estrella más cercana.'),
  K('Controle da Missão: já são mais de 6.000 exoplanetas confirmados no NASA Exoplanet Archive. Poucos estão na zona habitável da estrela.', 'Mission Control: there are over 6,000 confirmed exoplanets in the NASA Exoplanet Archive. Few lie in their star\'s habitable zone.', 'Control de la Misión: hay más de 6.000 exoplanetas confirmados en el NASA Exoplanet Archive. Pocos están en la zona habitable de su estrella.'),
  K('Controle da Missão: o telescópio James Webb observa a luz das estrelas atravessando atmosferas de exoplanetas para descobrir de que gases elas são feitas.', 'Mission Control: the James Webb telescope watches starlight pass through exoplanet atmospheres to learn which gases they contain.', 'Control de la Misión: el telescopio James Webb observa la luz de las estrellas atravesando atmósferas de exoplanetas para saber de qué gases están hechas.'),
  K('Controle da Missão: recicle tudo! Na ISS, o lixo vai embora em cargueiros que queimam na reentrada; numa colônia, o lixo é matéria-prima.', 'Mission Control: recycle everything! On the ISS trash leaves on cargo ships that burn up on reentry; in a colony, waste is raw material.', 'Control de la Misión: ¡reciclen todo! En la ISS la basura sale en cargueros que se queman al reentrar; en una colonia, los residuos son materia prima.'),
];

// ---------- estado ----------
function startColony(site, score) {
  S.stage = 5; S.scene = 'colony';
  // módulo de carga do pouso: garante o mínimo para começar
  S.cap.energia = Math.max(S.cap.energia, 60); S.cap.agua = Math.max(S.cap.agua, 400); S.cap.comida = Math.max(S.cap.comida, 100); S.cap.plantacao = Math.max(S.cap.plantacao, 60);
  S.res.energia = Math.max(S.res.energia, 40); S.res.agua = Math.max(S.res.agua, 200); S.res.comida = Math.max(S.res.comida, 40); S.res.plantacao = Math.max(S.res.plantacao, 12);
  S.peças = Math.max(S.peças, 2);
  S.colony = {
    t: 0, day: 1, dayT: 0, dayLen: 40, site: site.name, score,
    b: { solar: 0, agua: 0, estufa: 0, torre: 0, pista: 0, habitat: 0 },
    colonists: 0, tx: {}, txCount: 0, ships: [], shipsLanded: 0, short: { comida: 0, agua: 0 },
    tut: 0, done: false, finishT: 0, feed: [], storm: 0, factN: 0, nextFact: 70, built: 0,
  };
  S.crew.forEach((c, i) => { c.x = 110 + i * 22; c.deck = 'L'; c.tx = c.x; c.tdeck = 'L'; c.moving = false; c.ctask = null; c.task = null; c.climb = 0; c.eva = false; c.hibernating = false; c.bubble = null; });
  narrate(K('Pouso realizado em ' + site.name + '. Bem-vindos a Pontes-01! A viagem acabou, mas a missão está só começando: construam a base, falem com a Terra e recebam as naves de tripulação.',
    'Landing complete at ' + site.name + '. Welcome to Pontes-01! The trip is over, but the mission is just beginning: build the base, talk to Earth and receive the crew ships.',
    'Aterrizaje completado en ' + site.name + '. ¡Bienvenidos a Pontes-01! El viaje terminó, pero la misión recién empieza: construyan la base, hablen con la Tierra y reciban las naves de tripulación.'));
}
const colonyPop = () => alive().length + (S.colony ? S.colony.colonists : 0);
const colonyBeds = () => S.colony.b.habitat * 20;
function colonyObjectives() {
  const C = S.colony;
  return [
    { id: 'solar', done: C.b.solar >= 1, t: K('Instalar o campo solar', 'Install the solar field', 'Instalar el campo solar') },
    { id: 'agua', done: C.b.agua >= 1, t: K('Captar e purificar água', 'Collect and purify water', 'Captar y purificar agua') },
    { id: 'estufa', done: C.b.estufa >= 1, t: K('Plantar a primeira estufa', 'Plant the first greenhouse', 'Plantar el primer invernadero') },
    { id: 'torre', done: C.b.torre >= 1, t: K('Erguer a torre de comunicação', 'Raise the communication tower', 'Levantar la torre de comunicación') },
    { id: 'tx', done: C.txCount >= 3, t: K('Transmitir 3 pacotes de dados à Terra (' + Math.min(3, C.txCount) + '/3)', 'Send 3 data packages to Earth (' + Math.min(3, C.txCount) + '/3)', 'Transmitir 3 paquetes de datos a la Tierra (' + Math.min(3, C.txCount) + '/3)') },
    { id: 'pista', done: C.b.pista >= 1, t: K('Preparar a pista de pouso e o farol', 'Prepare the landing pad and beacon', 'Preparar la pista y la baliza') },
    { id: 'naves', done: C.shipsLanded >= 3, t: K('Receber 3 naves de tripulação (' + C.shipsLanded + '/3)', 'Receive 3 crew ships (' + C.shipsLanded + '/3)', 'Recibir 3 naves de tripulación (' + C.shipsLanded + '/3)') },
  ];
}
function colonyMsg(k, kind) { // mensagem da Terra / sistema: toast + chat + feed
  const C = S.colony; if (!C) return;
  C.feed.push({ d: C.day, t: k, kind: kind || 'mc' }); if (C.feed.length > 14) C.feed.shift();
  S.toast = { text: k, kind: kind === 'bad' ? 'bad' : kind === 'good' ? 'good' : 'info', t: 5, id: Math.random() };
  S.v++;
  if (typeof Chat !== 'undefined') Chat.sysAll(k, kind === 'bad' ? 'bad' : 'mc');
}

// ---------- ações ----------
const bots = () => S.crew.filter(c => c.alive && (!c.owner || c.owner === 'bot'));
const roleMatch = (c, role) => role === 'engenheiro' ? c.role.startsWith('engenheiro') || (c.id === 'cmd' && S.setup.origin === 'engenheiro') : c.role === role;
function pickWorker(role) {
  const free = bots().filter(c => !c.ctask && c.status !== 'incapacitado');
  return free.find(c => roleMatch(c, role)) || free.find(c => c.id !== 'cmd') || null;
}
function costTxt(c) {
  const a = [];
  if (c.kwh) a.push('⚡' + c.kwh + ' kWh'); if (c.agua) a.push('💧' + c.agua + ' L'); if (c.peca) a.push('⚙' + c.peca + ' ' + L(K('peça', 'part', 'pieza')) + (c.peca > 1 ? 's' : ''));
  if (c.plant) a.push('🌱' + c.plant + ' kg'); if (c.gb) a.push('💾' + c.gb + ' GB'); if (c.dur) a.push('⏱' + c.dur + 's');
  return a.join(' · ');
}
function canPay(c) {
  if (c.kwh && S.res.energia < c.kwh) return K('Energia insuficiente.', 'Not enough energy.', 'Energía insuficiente.');
  if (c.agua && S.res.agua < c.agua) return K('Água insuficiente.', 'Not enough water.', 'Agua insuficiente.');
  if (c.peca && S.peças < c.peca) return K('Faltam peças. Fabrique no laboratório de campo.', 'Not enough parts. Build some at the field lab.', 'Faltan piezas. Fabríquelas en el laboratorio de campo.');
  if (c.plant && S.res.plantacao < c.plant) return K('Faltam sementes/biomassa.', 'Not enough seeds/biomass.', 'Faltan semillas/biomasa.');
  if (c.gb && S.res.dados < c.gb) return K('Dados insuficientes.', 'Not enough data.', 'Datos insuficientes.');
  return null;
}
function pay(c) {
  if (c.kwh) addRes('energia', -c.kwh, 'Colônia'); if (c.agua) addRes('agua', -c.agua, 'Colônia');
  if (c.peca) S.peças -= c.peca; if (c.plant) addRes('plantacao', -c.plant, 'Colônia'); if (c.gb) addRes('dados', -c.gb, 'Transmissão');
}
function buildReqErr(id, lvl) {
  const C = S.colony;
  for (const [b, l] of (CREQ[id] || [])) if (C.b[b] < l) return K('Antes: ' + L(CSHORT[b]) + ' (nível ' + l + ').', 'First: ' + L(CSHORT[b]) + ' (level ' + l + ').', 'Antes: ' + L(CSHORT[b]) + ' (nivel ' + l + ').');
  return null;
}
function taskSpec(p) {
  const C = S.colony;
  if (p.k === 'build') {
    const id = p.b, lvl = (C.b[id] || 0) + 1, c = CCOST[id] && CCOST[id][lvl];
    if (!c) return null;
    const imp = buildReqErr(id, lvl);
    return { bid: id, cost: Object.assign({}, c), role: CROLE[id], err: imp, label: K('Construir: ' + L(CBUILD[id].name), 'Build: ' + L(CBUILD[id].name), 'Construir: ' + L(CBUILD[id].name)) };
  }
  if (p.k === 'fab') { const c = { kwh: has('impressora') ? 5 : 8, agua: 15, dur: has('impressora') ? 5 : 8 }; return { bid: 'lab', cost: c, role: 'engenheiro', label: K('Fabricar uma peça (impressão 3D)', 'Make a part (3D printing)', 'Fabricar una pieza (impresión 3D)') }; }
  if (p.k === 'an') {
    const an = PLANET_ANALYSES.find(a => a.id === p.a); if (!an || S.planet.analyzed.includes(an.id)) return null;
    return { bid: 'lab', cost: { kwh: 4, dur: has('lab') ? 5 : 8 }, role: 'pesquisador', label: K('Analisar: ' + an.name, 'Analyze: ' + an.name, 'Analizar: ' + an.name) };
  }
  if (p.k === 'tx') {
    const pk = TX_PACKAGES.find(x => x.id === p.a); if (!pk || C.tx[pk.id]) return null;
    let err = null;
    if (C.b.torre < 1) err = K('Construa a torre de comunicação primeiro.', 'Build the communication tower first.', 'Construya primero la torre de comunicación.');
    else if (pk.need && !S.planet.analyzed.includes(pk.need)) err = K('Sem dados: faça a análise no laboratório de campo.', 'No data: run the analysis at the field lab.', 'Sin datos: haga el análisis en el laboratorio de campo.');
    else if (pk.id === 'saude' && !roleAlive('paramedico')) err = K('Sem paramédico para o relatório médico.', 'No paramedic for the medical report.', 'Sin paramédico para el informe médico.');
    return { bid: 'torre', cost: { kwh: 6, gb: pk.gb, dur: 8 }, role: 'pesquisador', err, label: K('Transmitir: ' + L(pk.name), 'Transmit: ' + L(pk.name), 'Transmitir: ' + L(pk.name)) };
  }
  if (p.k === 'beacon') {
    const sh = C.ships.find(x => x.state === 'inbound');
    return { bid: 'pista', cost: { kwh: 2, dur: 5 }, role: 'engenheiro', err: !sh ? K('Nenhuma nave a caminho.', 'No ship inbound.', 'Ninguna nave en camino.') : (sh.beacon ? K('O farol já está aceso.', 'The beacon is already lit.', 'La baliza ya está encendida.') : null), label: K('Acender o farol de pouso', 'Light the landing beacon', 'Encender la baliza de aterrizaje') };
  }
  return null;
}
ACTIONS.cTut = () => { if (S.colony) S.colony.tut = 1; };
ACTIONS.cTask = (p, actor) => {
  const C = S.colony; if (!C || S.scene !== 'colony' || C.done) return;
  const sp = taskSpec(p); if (!sp) return;
  if (sp.err) return toast(sp.err, 'warn');
  const pe = canPay(sp.cost); if (pe) return toast(pe, 'warn');
  let who = actor;
  if (p.call) { who = pickWorker(sp.role); if (!who) return toast(K('Nenhum tripulante livre para ajudar.', 'No free crew member to help.', 'Ningún tripulante libre para ayudar.'), 'warn'); }
  else if (Math.abs(who.x - CBUILD[sp.bid].x) > 90) return toast(K('Vá até o local para trabalhar.', 'Walk to the site to work.', 'Vaya al lugar para trabajar.'), 'warn');
  if (!who.alive) return;
  if (who.ctask) return toast(K('Este tripulante já está ocupado.', 'This crew member is busy.', 'Este tripulante está ocupado.'), 'warn');
  if (who.status === 'incapacitado') return toast(K('Tripulante incapacitado.', 'Crew member incapacitated.', 'Tripulante incapacitado.'), 'warn');
  pay(sp.cost);
  const mult = (roleMatch(who, sp.role) ? 1.4 : 1) * clamp(effIndex() / 82, 0.5, 1.3);
  who.ctask = { key: p.k, bid: sp.bid, dur: sp.cost.dur / mult, t: 0, label: sp.label, data: p };
  S.v++;
};
const CTASK_DONE = {
  build(c, t) {
    const C = S.colony, id = t.data.b; C.b[id]++; C.built++;
    if (id === 'solar') { S.cap.energia += 40; }
    if (id === 'agua') { S.cap.agua += 150; }
    if (id === 'estufa') { S.cap.comida += 40; }
    addPoints(20, 'Construção em Pontes-01');
    colonyMsg(K(c.name + ' concluiu: ' + L(CBUILD[id].name) + ' (nível ' + C.b[id] + ').', c.name + ' finished: ' + L(CBUILD[id].name) + ' (level ' + C.b[id] + ').', c.name + ' terminó: ' + L(CBUILD[id].name) + ' (nivel ' + C.b[id] + ').'), 'good');
    Sfx.ok();
  },
  fab(c) { S.peças++; toast(K('Peça fabricada com materiais locais.', 'Part made from local materials.', 'Pieza fabricada con materiales locales.'), 'good'); },
  an(c, t) {
    const an = PLANET_ANALYSES.find(a => a.id === t.data.a);
    if (!S.planet.analyzed.includes(an.id)) S.planet.analyzed.push(an.id);
    addRes('dados', 12, 'Análise de campo');
    colonyMsg(K('Análise de ' + an.name + ' concluída: ' + an.result, an.name + ' analysis done: ' + an.result, 'Análisis de ' + an.name + ' completado: ' + an.result), 'good');
  },
  tx(c, t) {
    const C = S.colony; const pk = TX_PACKAGES.find(x => x.id === t.data.a);
    const mods = (C.b.torre * 2) + (sysHp('comunicacao') >= 70 ? 2 : sysHp('comunicacao') < 40 ? -3 : 0) + (roleMatch(c, 'pesquisador') ? 2 : 0) + (has('radar') ? 1 : 0);
    const r = d20(); const ok = r === 20 || (r !== 1 && r + mods >= 8);
    if (!ok) { addRes('dados', pk.gb * 0.5, 'Pacote corrompido'); return colonyMsg(K('Ruído na linha: o pacote “' + L(pk.name) + '” chegou corrompido. Metade dos dados foi recuperada: tente de novo.', 'Line noise: package “' + L(pk.name) + '” arrived corrupted. Half the data was recovered: try again.', 'Ruido en la línea: el paquete “' + L(pk.name) + '” llegó dañado. Se recuperó la mitad de los datos: intente de nuevo.'), 'bad'); }
    C.tx[pk.id] = true; C.txCount++; C.txFx = 4; S.v++;
    addPoints(25, 'Dados enviados à Terra');
    const delay = 8 + Math.floor(Math.random() * 12);
    C.pendingAck = (C.pendingAck || []).concat([{ t: 6, k: K('Terra → Pontes-01: pacote “' + L(pk.name) + '” recebido e validado pelos cientistas. O sinal viaja à velocidade da luz (atraso de ~' + delay + ' min, como Marte em média). Obrigado, Pontes-01!', 'Earth → Pontes-01: package “' + L(pk.name) + '” received and validated by scientists. The signal travels at the speed of light (~' + delay + ' min delay, like Mars on average). Thank you, Pontes-01!', 'Tierra → Pontes-01: paquete “' + L(pk.name) + '” recibido y validado por los científicos. La señal viaja a la velocidad de la luz (retraso de ~' + delay + ' min, como Marte en promedio). ¡Gracias, Pontes-01!') }]);
    colonyMsg(K('Transmitindo “' + L(pk.name) + '” para a Terra pela antena de alto ganho… sinal enviado!', 'Transmitting “' + L(pk.name) + '” to Earth through the high-gain antenna… signal sent!', 'Transmitiendo “' + L(pk.name) + '” a la Tierra por la antena de alta ganancia… ¡señal enviada!'), 'good');
  },
  beacon(c) {
    const sh = S.colony.ships.find(x => x.state === 'inbound'); if (!sh) return;
    sh.beacon = true; colonyMsg(K('Farol aceso! A nave ' + sh.name + ' recebe o sinal e corrige a descida.', 'Beacon lit! Ship ' + sh.name + ' picks up the signal and corrects its descent.', '¡Baliza encendida! La nave ' + sh.name + ' recibe la señal y corrige el descenso.'), 'good');
  },
};
ACTIONS.cShip = p => {
  const C = S.colony; if (!C || S.scene !== 'colony' || C.done) return;
  const def = CSHIPS.find(s => s.n === +p.n); if (!def) return;
  if (C.ships.some(s => s.n === def.n)) return;
  const err = C.b.pista < 1 ? K('Prepare a pista de pouso.', 'Prepare the landing pad.', 'Prepare la pista.')
    : C.b.torre < 1 || C.txCount < 1 ? K('Transmita ao menos um pacote de dados para a Terra antes de pedir a nave.', 'Send at least one data package to Earth before calling the ship.', 'Transmita al menos un paquete de datos a la Tierra antes de pedir la nave.')
    : C.ships.some(s => s.state === 'inbound') ? K('Já há uma nave a caminho.', 'A ship is already inbound.', 'Ya hay una nave en camino.')
    : def.n > 1 && !C.ships.some(s => s.n === def.n - 1 && s.state === 'landed') ? K('Receba a nave anterior primeiro.', 'Receive the previous ship first.', 'Reciba primero la nave anterior.')
    : C.colonists + def.size > colonyBeds() ? K('Camas insuficientes: amplie o habitat (' + colonyBeds() + ' camas; precisa de ' + (C.colonists + def.size) + ').', 'Not enough beds: expand the habitat (' + colonyBeds() + ' beds; needs ' + (C.colonists + def.size) + ').', 'Camas insuficientes: amplíe el hábitat (' + colonyBeds() + ' camas; necesita ' + (C.colonists + def.size) + ').')
    : S.res.energia < 12 ? K('Energia insuficiente para o farol e o radar de guiagem (12 kWh).', 'Not enough energy for the beacon and guidance radar (12 kWh).', 'Energía insuficiente para la baliza y el radar de guía (12 kWh).')
    : null;
  if (err) return toast(err, 'warn');
  addRes('energia', -12, 'Guiagem da nave');
  C.ships.push({ n: def.n, name: def.name, size: def.size, state: 'inbound', t: 0, eta: 32, beacon: false });
  colonyMsg(K('A ' + def.name + ' (' + def.size + ' colonos) iniciou a descida! Chegada em ~30 s. Acenda o farol na pista para ajudar no pouso.', 'Ship ' + def.name + ' (' + def.size + ' colonists) started its descent! Arrival in ~30 s. Light the beacon at the pad to help it land.', '¡La nave ' + def.name + ' (' + def.size + ' colonos) inició el descenso! Llegada en ~30 s. Encienda la baliza en la pista para ayudar al aterrizaje.'));
};
function landShip(sh) {
  const C = S.colony; const def = CSHIPS.find(s => s.n === sh.n);
  const mods = C.b.pista * 2 + (sh.beacon ? 4 : 0) + (C.b.torre >= 2 ? 1 : 0) + (sysHp('comunicacao') >= 70 ? 1 : 0) + (C.storm > 0 ? -3 : 0);
  const r = d20(); const ok = r === 20 || (r !== 1 && r + mods >= 9);
  if (!ok) {
    sh.state = 'abort'; C.ships = C.ships.filter(x => x !== sh);
    return colonyMsg(K('Pouso abortado! A ' + sh.name + ' voltou à órbita por falta de guiagem' + (C.storm > 0 ? ' e por causa da tempestade de poeira' : '') + '. Acenda o farol e melhore a pista, depois chame de novo.', 'Landing aborted! Ship ' + sh.name + ' went back to orbit for lack of guidance' + (C.storm > 0 ? ' and because of the dust storm' : '') + '. Light the beacon and improve the pad, then call again.', '¡Aterrizaje abortado! La nave ' + sh.name + ' volvió a órbita por falta de guía' + (C.storm > 0 ? ' y por la tormenta de polvo' : '') + '. Encienda la baliza y mejore la pista, luego llame de nuevo.'), 'bad');
  }
  sh.state = 'landed'; C.shipsLanded++; C.colonists += sh.size;
  addRes('energia', def.sup.kwh, 'Suprimentos da nave'); addRes('agua', def.sup.agua, 'Suprimentos da nave'); addRes('comida', def.sup.comida, 'Suprimentos da nave');
  moral(6); addPoints(60, 'Nave de tripulação recebida');
  colonyMsg(K(sh.name + ' pousou! +' + sh.size + ' colonos chegaram a Pontes-01 trazendo suprimentos. População: ' + colonyPop() + '.', sh.name + ' landed! +' + sh.size + ' colonists arrived on Pontes-01 with supplies. Population: ' + colonyPop() + '.', sh.name + ' aterrizó! +' + sh.size + ' colonos llegaron a Pontes-01 con suministros. Población: ' + colonyPop() + '.'), 'good');
  Sfx.ok();
}

// ---------- simulação ----------
function colonyNewDay() {
  const C = S.colony; C.day++; S.day++;
  const pop = colonyPop();
  const stormMul = C.storm > 0 ? 0.5 : 1;
  const sol = C.b.solar * (14 + (has('solar') ? 3 : 0)) * stormMul;
  addRes('energia', sol, 'Campo solar'); addRes('energia', -(2 + pop * 0.1), 'Consumo da colônia');
  addRes('agua', C.b.agua * 35, 'Estação de água'); addRes('agua', -pop * 3, 'Consumo da colônia');
  const food = C.b.estufa * (5 + (has('estufa') ? 1 : 0) + (has('sementes') ? 1 : 0) + (S.planet.analyzed.includes('solo') ? 1 : 0) + (roleAlive('agricultor') ? 1 : 0));
  addRes('comida', food, 'Estufa colonial'); addRes('comida', -pop * 0.5, 'Consumo da colônia');
  if (C.storm > 0) C.storm--;
  const lack = [];
  for (const k of ['comida', 'agua']) { if (S.res[k] < 0.5) { C.short[k]++; lack.push(k); } else C.short[k] = 0; }
  if (lack.length) {
    moral(-4);
    colonyMsg(K('Alerta: ' + lack.map(k => k === 'comida' ? 'comida' : 'água').join(' e ') + ' acabando! Construa/amplie a estufa e a estação de água.', 'Warning: ' + lack.map(k => k === 'comida' ? 'food' : 'water').join(' and ') + ' running out! Build/expand the greenhouse and water station.', 'Alerta: ¡' + lack.map(k => k === 'comida' ? 'comida' : 'agua').join(' y ') + ' se agota! Construya/amplíe el invernadero y la estación de agua.'), 'bad');
  }
  if (C.short.comida >= 3 || C.short.agua >= 3) return fail(C.short.comida >= 3 ? 'A colônia ficou sem comida por 3 dias. Sem produção de alimentos local, a vida em outro planeta não se sustenta.' : 'A colônia ficou sem água por 3 dias. Sem água, não há colônia.');
  if (C.day > 3 && C.storm <= 0 && C.b.solar > 0 && Math.random() < 0.14) {
    C.storm = 2;
    colonyMsg(K('Tempestade de poeira! A produção solar cai pela metade por 2 dias e pousos ficam mais difíceis. (Em Marte, tempestades de poeira já cobriram o planeta inteiro e silenciaram o rover Opportunity em 2018.)', 'Dust storm! Solar output drops by half for 2 days and landings get harder. (On Mars, dust storms have covered the whole planet and silenced the Opportunity rover in 2018.)', '¡Tormenta de polvo! La producción solar baja a la mitad por 2 días y los aterrizajes se complican. (En Marte, las tormentas de polvo han cubierto todo el planeta y silenciaron al rover Opportunity en 2018.)'), 'bad');
  }
  for (const c of alive()) { c.humor = clamp(c.humor + (lack.length ? -2 : 1), 0, 100); }
  checkFail();
}
function moveToward(c, tx, dt, sp) {
  const d = tx - c.x;
  if (Math.abs(d) < 3) { c.moving = false; return true; }
  const s = Math.min(Math.abs(d), (sp || 55) * dt); c.x += Math.sign(d) * s; c.face = d > 0 ? 1 : -1; c.moving = true; c.walkT += dt;
  return false;
}
function tickColony(dt) {
  const C = S.colony; if (!C || S.fail) return;
  if (C.done) { C.finishT -= dt; if (C.finishT <= 0 && S.scene === 'colony') finishColony(); return; }
  if (C.tut === 0) return; // espera a introdução
  C.t += dt; C.dayT += dt; if (C.txFx > 0) C.txFx -= dt;
  if (C.dayT >= C.dayLen) { C.dayT -= C.dayLen; colonyNewDay(); if (S.fail) return; }
  if (S.toast) { S.toast.t -= dt; if (S.toast.t <= 0) S.toast = null; }
  // tripulação
  for (const c of S.crew) {
    if (!c.alive) continue;
    if (c.bubble) { c.bubble.t -= dt; if (c.bubble.t <= 0) c.bubble = null; }
    if (c.statusT > 0) { c.statusT -= dt; if (c.statusT <= 0) { c.status = 'ok'; c.statusT = 0; } }
    const human = c.owner && c.owner !== 'bot';
    const t = c.ctask;
    if (t) {
      const B = CBUILD[t.bid]; const near = Math.abs(c.x - B.x) < 70;
      if (near) {
        t.t += dt; c.moving = false;
        if (t.t >= t.dur) { c.ctask = null; S.v++; const fn = CTASK_DONE[t.key]; if (fn) fn(c, t); }
      } else if (!human) moveToward(c, B.x + (Math.random() * 20 - 10), dt, 60);
    } else if (!human) {
      c.idleT -= dt;
      if (c.idleT <= 0) { c.idleT = 4 + Math.random() * 8; c.wx = 90 + Math.random() * (COLONY_W - 180); if (Math.random() < 0.5) c.wx = CBUILD[pick(CORDER)].x + (Math.random() * 60 - 30); }
      if (c.wx != null) { if (moveToward(c, c.wx, dt, 38)) c.wx = null; } else c.moving = false;
    }
  }
  // naves a caminho
  for (const sh of C.ships.slice()) if (sh.state === 'inbound') { sh.t += dt; if (sh.t >= sh.eta) landShip(sh); }
  // respostas da Terra (atraso do sinal)
  if (C.pendingAck && C.pendingAck.length) {
    C.pendingAck.forEach(a => { a.t -= dt; });
    const due = C.pendingAck.filter(a => a.t <= 0); C.pendingAck = C.pendingAck.filter(a => a.t > 0);
    due.forEach(a => colonyMsg(a.k, 'mc'));
  }
  // curiosidades da NASA
  C.nextFact -= dt;
  if (C.nextFact <= 0) { C.nextFact = 80 + Math.random() * 40; const f = CFACTS[C.factN++ % CFACTS.length]; if (typeof Chat !== 'undefined') Chat.sysAll(f, 'fact'); }
  // fim?
  if (colonyObjectives().every(o => o.done)) { C.done = true; C.finishT = 3; narrate(K('A colônia está de pé. Painéis, água, estufa, antena, pista e três naves de tripulação: a humanidade tem um novo lar.', 'The colony stands. Panels, water, greenhouse, antenna, pad and three crew ships: humanity has a new home.', 'La colonia está en pie. Paneles, agua, invernadero, antena, pista y tres naves de tripulación: la humanidad tiene un nuevo hogar.')); }
  checkFail();
}
function finishColony() {
  const C = S.colony;
  addPoints(200, 'Colônia estabelecida em Pontes-01');
  S.scene = 'end'; S.stage = 6;
  S.ending = { ok: true, site: C.site, score: C.score, colony: true };
  Save.data.runs++; if (!Save.data.best || S.points > Save.data.best) Save.data.best = S.points; Save.write();
}

// ---------- movimento do jogador local ----------
function moveColonyHuman(c, dt) {
  if (!c || !c.alive) return;
  const L_ = keys.ArrowLeft || keys.KeyA, R_ = keys.ArrowRight || keys.KeyD;
  if (L_ || R_) U.clickTarget = null;
  let dx = (R_ ? 1 : 0) - (L_ ? 1 : 0);
  if (!dx && U.clickTarget) { const d = U.clickTarget.x - c.x; if (Math.abs(d) < 3) U.clickTarget = null; else dx = Math.sign(d); }
  if (dx) { c.x = clamp(c.x + dx * (c.status === 'ferido' ? 40 : 75) * dt, 24, COLONY_W - 24); c.face = dx; c.moving = true; c.walkT += dt; }
  else c.moving = false;
  c.deck = 'L'; c.tx = c.x;
}
function nearBuilding(c) {
  let best = null, bd = 60;
  for (const id of CORDER) { const d = Math.abs(CBUILD[id].x - c.x); if (d < bd) { bd = d; best = id; } }
  return best;
}
function colonyInteract() {
  const c = me(); if (!c || !c.alive || !S.colony) return;
  if (S.colony.tut === 0) return act('cTut');
  const b = nearBuilding(c); if (!b) return;
  U.panel = 'c:' + b; U.tab = null;
}

// ---------- desenho ----------
function drawColony(dt) {
  const C = S.colony; const m = me() || S.crew[0];
  R.colCam = clamp((m ? m.x : 200) - VW / 2, 0, COLONY_W - VW);
  const cam = Math.round(R.colCam);
  const f = C.dayT / C.dayLen; // 0..1
  const night = clamp((Math.abs(f - 0.5) - 0.42) * 7, 0, 0.55);
  // céu (estrela G9 laranja-amarelada)
  const g = cx.createLinearGradient(0, 0, 0, CGROUND);
  g.addColorStop(0, '#2c5ba6'); g.addColorStop(0.55, '#7fb0d8'); g.addColorStop(1, '#f1d8a4');
  cx.fillStyle = g; cx.fillRect(0, 0, VW, VH);
  const sx = 40 + f * 400, sy = 120 - Math.sin(f * Math.PI) * 88;
  cx.fillStyle = 'rgba(255,220,140,0.35)'; cx.beginPath(); cx.arc(sx, sy, 24, 0, 7); cx.fill();
  cx.fillStyle = '#ffd98a'; cx.beginPath(); cx.arc(sx, sy, 15, 0, 7); cx.fill();
  // lua gigante pálida
  cx.fillStyle = 'rgba(235,235,250,0.85)'; cx.beginPath(); cx.arc(Math.round(90 - cam * 0.03), 56, 20, 0, 7); cx.fill();
  cx.fillStyle = 'rgba(180,180,205,0.8)'; cx.fillRect(Math.round(84 - cam * 0.03), 50, 6, 5); cx.fillRect(Math.round(96 - cam * 0.03), 60, 8, 4);
  // nuvens
  cx.fillStyle = 'rgba(255,255,255,0.55)';
  for (let i = 0; i < 6; i++) { const x = ((i * 190 + R.t * 5) % (VW + 160)) - 80 - cam * 0.1; cx.fillRect(Math.round(x), 40 + (i % 3) * 22, 52, 6); cx.fillRect(Math.round(x + 10), 36 + (i % 3) * 22, 30, 5); }
  // montanhas
  cx.fillStyle = '#6f89b4';
  for (let x = -20; x < VW + 20; x += 6) { const wx = x + cam * 0.2; const h = 34 + Math.sin(wx * 0.021) * 18 + Math.sin(wx * 0.07) * 6; cx.fillRect(x, Math.round(CGROUND - 24 - h), 6, Math.round(h + 24)); }
  cx.fillStyle = '#4f8a78';
  for (let x = -20; x < VW + 20; x += 4) { const wx = x + cam * 0.5; const h = 14 + Math.sin(wx * 0.035 + 2) * 9; cx.fillRect(x, Math.round(CGROUND - 8 - h), 4, Math.round(h + 8)); }
  // chão e rio
  cx.fillStyle = '#6aa05a'; cx.fillRect(0, CGROUND, VW, VH - CGROUND);
  cx.fillStyle = '#58904c'; for (let x = -(cam % 20); x < VW; x += 20) cx.fillRect(x, CGROUND, 10, 2);
  cx.fillStyle = '#4a7d41'; cx.fillRect(0, CGROUND + 20, VW, 3);
  const rx = 640 - cam; cx.fillStyle = '#2f78c8'; cx.fillRect(Math.round(rx), CGROUND + 6, 90, 12); cx.fillStyle = '#6fb4ff'; for (let i = 0; i < 6; i++) cx.fillRect(Math.round(rx + 4 + ((i * 16 + R.t * 14) % 78)), CGROUND + 9 + (i % 3) * 3, 6, 1);
  // flora alienígena (decor)
  for (let i = 0; i < 40; i++) { const wx = 60 + i * 47 + (i * 31 % 17); const x = Math.round(wx - cam); if (x < -10 || x > VW + 10) continue; const hgt = 5 + (i * 7 % 9); cx.fillStyle = i % 3 ? '#2fc4a8' : '#d86ad0'; cx.fillRect(x, CGROUND - hgt, 2, hgt); cx.fillRect(x - 2, CGROUND - hgt, 6, 2); }
  // construções
  for (const id of CORDER) drawBuilding(id, CBUILD[id].x - cam, cam);
  // naves a caminho
  for (const sh of C.ships) if (sh.state === 'inbound') {
    const p = clamp(sh.t / sh.eta, 0, 1); const bx = CBUILD.pista.x - cam; const y = -40 + p * (CGROUND - 24 + 40) * (1 - Math.pow(1 - p, 3) * 0.2);
    cx.save(); cx.translate(Math.round(bx + Math.sin(R.t * 2) * (1 - p) * 8), Math.round(y)); cx.rotate(-Math.PI / 2); cx.scale(0.8, 0.8);
    drawShipExteriorRaw(0, 0, true); cx.restore();
    cx.fillStyle = 'rgba(255,255,255,0.6)'; cx.fillRect(Math.round(bx - 1), 0, 2, Math.max(0, Math.round(y - 22)));
    text(sh.name + ' · ' + Math.max(0, Math.ceil(sh.eta - sh.t)) + 's', bx, Math.max(4, y - 42), '#ffd34c', 8, 'center');
  }
  // tripulantes
  const order = S.crew.filter(c => c.alive).sort((a, b) => a.x - b.x);
  for (const c of order) {
    const x = Math.round(c.x - cam); if (x < -30 || x > VW + 30) continue;
    drawChar(c.avatar, 'suit', x, CGROUND + 14, c.face, c.moving ? Math.floor(c.walkT * 8) : 0, c.humor < 35 ? 'sad' : 'happy');
    const mine = c.id === U.me;
    text(c.name, x, CGROUND + 14 - SPR_H - 10, mine ? '#ffd34c' : (c.owner && c.owner !== 'bot' ? '#7dffb0' : '#bcd3ff'), 7, 'center');
    if (c.ctask) { const B = CBUILD[c.ctask.bid]; const pr = clamp(c.ctask.t / c.ctask.dur, 0, 1); cx.fillStyle = '#000'; cx.fillRect(x - 12, CGROUND + 14 - SPR_H - 3, 24, 4); cx.fillStyle = Math.abs(c.x - B.x) < 70 ? '#46e08a' : '#ffd23f'; cx.fillRect(x - 11, CGROUND + 14 - SPR_H - 2, Math.round(22 * pr), 2); }
    if (c.bubble) bubble(c.bubble.text, x, CGROUND + 14 - SPR_H - 12);
  }
  // noite
  if (night > 0) { cx.fillStyle = `rgba(8,10,40,${night})`; cx.fillRect(0, 0, VW, VH); }
  if (C.storm > 0) { cx.fillStyle = 'rgba(190,140,80,0.22)'; cx.fillRect(0, 0, VW, VH); cx.fillStyle = 'rgba(220,170,110,0.5)'; for (let i = 0; i < 30; i++) cx.fillRect(((i * 53 + R.t * 220) % (VW + 40)) - 20, (i * 37) % VH, 12, 1); }
  // prompt de proximidade
  const nb = m ? nearBuilding(m) : null;
  if (nb && !U.panel && C.tut) text('[E] ' + T(L(CSHORT[nb])), VW / 2, 64, '#fff', 8, 'center');
}
function drawShipExteriorRaw(x, y, flame) { drawShipExterior(x, y, 1, flame); }
function drawBuilding(id, bx, cam) {
  const C = S.colony; const B = CBUILD[id]; const lv = id === 'nave' || id === 'lab' ? 1 : C.b[id];
  if (bx < -120 || bx > VW + 120) return;
  const G = CGROUND; const r = (a, b, w, h, c) => { cx.fillStyle = c; cx.fillRect(Math.round(bx + a), Math.round(b), w, h); };
  const label = (t) => text(T(t), bx, G + 19, lv ? '#fff' : '#cfd6e6', 7, 'center');
  const short = L(CSHORT[id]);
  if (id === 'nave') {
    drawShipExterior(bx - 36, G - 26, 1.15, false);
    r(-60, G - 6, 8, 6, '#555'); r(40, G - 6, 8, 6, '#555'); r(-62, G - 2, 12, 2, '#333'); r(38, G - 2, 12, 2, '#333');
    r(56, G - 40, 3, 40, '#aaa'); r(52, G - 44, 11, 5, '#ff4a5a');
    label(short); return;
  }
  if (lv === 0) { // terreno de obra
    cx.strokeStyle = '#ffd23f'; cx.setLineDash([4, 3]); cx.strokeRect(Math.round(bx - 32) + 0.5, G - 30.5, 64, 30); cx.setLineDash([]);
    r(-34, G - 34, 3, 34, '#8a6a30'); r(31, G - 34, 3, 34, '#8a6a30'); r(-34, G - 34, 68, 2, '#8a6a30');
    r(-12, G - 18, 24, 12, '#3a3a50'); text(B.icon, bx, G - 22, '#fff', 10, 'center');
    label(short); return;
  }
  if (id === 'lab') {
    r(-40, G - 34, 80, 34, '#d7dbe8'); r(-40, G - 34, 80, 3, '#fff'); r(-40, G - 4, 80, 4, '#8a93ad');
    r(-14, G - 24, 28, 24, '#2c3354'); r(-12, G - 22, 24, 20, '#7ad8ff'); r(-12, G - 12, 24, 2, '#2f5bd7');
    r(-34, G - 28, 14, 10, '#7ad8ff'); r(20, G - 28, 14, 10, '#7ad8ff');
    r(-16, G - 44, 32, 10, '#b0b8d0'); r(-4, G - 54, 8, 10, '#8a93ad'); r(-12, G - 58, 24, 4, '#ff8a2a');
    label(short); return;
  }
  if (id === 'solar') {
    const n = 2 + lv * 2;
    for (let i = 0; i < n; i++) { const px = -34 + i * 16; r(px, G - 30 - (i % 2) * 4, 14, 22, '#1d3a9a'); r(px, G - 30 - (i % 2) * 4, 14, 2, '#5a7cff'); cx.fillStyle = '#5a7cff'; for (let k = 0; k < 4; k++) cx.fillRect(Math.round(bx + px + 1), G - 27 - (i % 2) * 4 + k * 5, 12, 1); r(px + 6, G - 8 - (i % 2) * 4 + 0, 2, 8 + (i % 2) * 4, '#777'); }
    r(-40, G - 4, 80, 4, '#444'); if (lv > 0) { r(-44, G - 14, 8, 14, '#bbb'); r(-43, G - 12, 6, 3, '#ffd23f'); }
    label(short + ' Nv' + lv); return;
  }
  if (id === 'agua') {
    r(-36, G - 22, 28, 22, '#9aa3bb'); r(-36, G - 22, 28, 3, '#cfd6e6'); r(-30, G - 30, 16, 8, '#cfd6e6');
    r(0, G - 30, 40, 30, '#2f78c8'); r(0, G - 30, 40, 4, '#6fb4ff'); r(4, G - 22, 32, 2, '#6fb4ff'); r(4, G - 14, 32, 2, '#1d5aa0');
    for (let i = 0; i < 3; i++) r(-8, G - 14 + i * 4, 10, 2, '#888'); const dr = Math.floor(R.t * 6) % 4; r(-6, G - 8 + dr, 2, 2, '#6fb4ff');
    if (lv > 1) { r(44, G - 24, 18, 24, '#9aa3bb'); r(46, G - 22, 14, 6, '#6fb4ff'); }
    label(short + ' Nv' + lv); return;
  }
  if (id === 'estufa') {
    const w = lv > 1 ? 100 : 72; r(-w / 2, G - 34, w, 34, 'rgba(160,230,255,0.35)'); r(-w / 2, G - 36, w, 3, '#cfd6e6'); r(-w / 2, G - 34, 3, 34, '#cfd6e6'); r(w / 2 - 3, G - 34, 3, 34, '#cfd6e6');
    for (let i = 0; i < 4; i++) r(-w / 2 + i * w / 4, G - 34, 2, 34, 'rgba(255,255,255,0.5)');
    for (let i = 0; i < (lv > 1 ? 9 : 6); i++) { const px = -w / 2 + 6 + i * 11; const hgt = 8 + (i * 5 % 9) + Math.floor(Math.sin(R.t + i) * 1); r(px, G - hgt - 4, 2, hgt, '#3fa84a'); r(px - 3, G - hgt - 4, 8, 3, '#5fd35f'); }
    r(-w / 2, G - 4, w, 4, '#5a4020'); label(short + ' Nv' + lv); return;
  }
  if (id === 'torre') {
    r(-6, G - 80, 12, 80, '#cfd6e6'); r(-4, G - 78, 3, 76, '#fff'); for (let i = 0; i < 6; i++) r(-6, G - 72 + i * 12, 12, 2, '#8a93ad');
    r(-16, G - 92, 32, 8, '#b0b8d0'); cx.fillStyle = '#e8ecf6'; cx.beginPath(); cx.ellipse(Math.round(bx), G - 96, 18, 8, -0.3, 0, 7); cx.fill(); r(-1, G - 104, 2, 10, '#ff4a5a');
    if (lv > 1) { cx.fillStyle = '#e8ecf6'; cx.beginPath(); cx.ellipse(Math.round(bx + 24), G - 44, 12, 6, 0.4, 0, 7); cx.fill(); r(22, G - 44, 3, 44, '#aaa'); }
    r(-20, G - 6, 40, 6, '#555'); r(-12, G - 16, 24, 10, '#cfd6e6'); r(-8, G - 14, 6, 4, '#7ad8ff');
    if ((C.txFx || 0) > 0) for (let i = 0; i < 3; i++) { const rr = ((R.t * 30 + i * 14) % 42); cx.strokeStyle = `rgba(122,216,255,${1 - rr / 42})`; cx.beginPath(); cx.arc(Math.round(bx), G - 100, 6 + rr, Math.PI * 1.15, Math.PI * 1.85); cx.stroke(); }
    label(short + ' Nv' + lv); return;
  }
  if (id === 'pista') {
    r(-52, G - 3, 104, 3, '#555'); r(-48, G - 2, 96, 1, '#999'); for (let i = 0; i < 8; i++) r(-46 + i * 13, G - 2, 6, 1, '#ffd23f');
    r(-30, G - 36, 60, 2, '#444'); r(-30, G - 36, 2, 36, '#444'); r(28, G - 36, 2, 36, '#444');
    const on = C.ships.some(s => s.state === 'inbound' && s.beacon);
    for (let i = 0; i < 2 + lv; i++) { const lx = -48 + i * (96 / (1 + lv)); r(lx, G - 8, 3, 8, '#888'); r(lx - 1, G - 11, 5, 3, on && Math.floor(R.t * 4) % 2 ? '#ffffff' : '#ff4a5a'); }
    r(-4, G - 56, 8, 56, '#777'); r(-8, G - 60, 16, 6, on ? (Math.floor(R.t * 6) % 2 ? '#fff' : '#ffd23f') : '#c33'); if (on) { cx.fillStyle = 'rgba(255,240,150,0.25)'; cx.beginPath(); cx.moveTo(bx, G - 58); cx.lineTo(bx - 60, G - 180); cx.lineTo(bx + 60, G - 180); cx.fill(); }
    label(short + ' Nv' + lv); return;
  }
  if (id === 'habitat') {
    for (let i = 0; i < lv; i++) {
      const px = -28 + i * 40 - (lv - 1) * 8 + 8; const rad = 22 - i * 1;
      cx.fillStyle = '#e8e8f0'; cx.beginPath(); cx.arc(Math.round(bx + px), G, rad, Math.PI, 0); cx.fill();
      cx.fillStyle = '#b0b8d0'; cx.beginPath(); cx.arc(Math.round(bx + px), G, rad - 4, Math.PI, 0); cx.fill();
      cx.fillStyle = (Math.floor(R.t + i) % 3) ? '#ffe9a0' : '#7ad8ff'; cx.fillRect(Math.round(bx + px - 8), G - 14, 6, 6); cx.fillRect(Math.round(bx + px + 3), G - 14, 6, 6);
      r(px - 4, G - 8, 8, 8, '#2c3354');
      if (i > 0) r(px - 20, G - 6, 8, 4, '#8a93ad');
    }
    label(short + ' Nv' + lv); return;
  }
}

// ---------- interface ----------
function colonyHud() {
  const C = S.colony; const items = RES_META.filter(m => ['energia', 'agua', 'comida', 'dados', 'plantacao'].includes(m.id)).map(m => {
    const v = S.res[m.id], cap = S.cap[m.id];
    return `<div class="rb" title="${esc(m.name)}: ${fmt(v)} ${m.unit}"><span class="ic">${m.icon}</span>${bar(v, cap)}<span class="v">${fmt(v, v < 10 ? 1 : 0)}<small>${m.unit}</small></span></div>`;
  });
  items.push(`<div class="rb" title="${esc(L(K('Peças', 'Parts', 'Piezas')))}"><span class="ic">⚙</span><span class="v">${S.peças}<small>${esc(L(K('peças', 'parts', 'piezas')))}</small></span></div>`);
  items.push(`<div class="rb" title="${esc(L(K('População', 'Population', 'Población')))}"><span class="ic">👥</span><span class="v">${colonyPop()}<small>${esc(L(K('pessoas', 'people', 'personas')))}</small></span></div>`);
  items.push(`<div class="rb" title="Moral"><span class="ic">☺</span>${bar(moralIndex(), 100)}<span class="v">${fmt(moralIndex(), 0)}<small>pts</small></span></div>`);
  const f = C.dayT / C.dayLen, hh = Math.floor(f * 24), mm = Math.floor((f * 24 * 60) % 60);
  const obj = colonyObjectives(); const doneN = obj.filter(o => o.done).length;
  const m = me(); const nb = m && m.alive ? nearBuilding(m) : null;
  let prompt = '';
  if (m && m.ctask) prompt = `⏳ ${esc(L(m.ctask.label))} — ${Math.abs(m.x - CBUILD[m.ctask.bid].x) < 70 ? esc(L(K('fique aqui', 'stay here', 'quédese aquí'))) : esc(L(K('volte ao local!', 'go back to the site!', '¡vuelva al lugar!')))}`;
  else if (nb) prompt = `<b>E</b> — ${esc(L(CSHORT[nb]))}`;
  return `<div class="hud-top"><div class="bars">${items.join('')}</div><div class="clock"><b>${esc(L(K('COLÔNIA · DIA', 'COLONY · DAY', 'COLONIA · DÍA')))} ${C.day}</b> ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}<br><small>${esc(C.site)}${C.storm > 0 ? ' · 🌪' : ''}</small></div></div>
    <div class="objbox"><b>${esc(L(K('MISSÃO PONTES-01', 'PONTES-01 MISSION', 'MISIÓN PONTES-01')))} ${doneN}/${obj.length}</b>${obj.map(o => `<div class="${o.done ? 'done' : ''}">${o.done ? '✔' : '▫'} ${esc(L(o.t))}</div>`).join('')}</div>
    <div class="hud-bottom"><div class="prompt">${prompt}</div>
    <div class="btns"><button class="btn small" data-ui="panel" data-arg="c:nave">${esc(L(K('Controle', 'Control', 'Control')))}</button><button class="btn small" data-ui="panel" data-arg="menu">☰</button></div></div>`;
}
function ctaskBar(bid) {
  const ws = S.crew.filter(c => c.alive && c.ctask && c.ctask.bid === bid);
  return ws.map(c => `<div class="alert info">⏳ ${esc(c.name)}: ${esc(L(c.ctask.label))} ${bar(c.ctask.t, c.ctask.dur)} ${Math.abs(c.x - CBUILD[bid].x) < 70 ? '' : '<b class="orange">' + esc(L(K('(longe do local)', '(away from the site)', '(lejos del lugar)'))) + '</b>'}</div>`).join('');
}
function taskBtns(p) {
  const sp = taskSpec(p); if (!sp) return '';
  const err = sp.err || canPay(sp.cost);
  const bots_ = pickWorker(sp.role);
  const J_ = o => esc(JSON.stringify(o));
  return `<div class="row"><button class="btn ${err ? '' : 'primary'}" data-act="cTask" data-p='${J_(Object.assign({}, p, { call: 0 }))}' ${err ? 'disabled' : ''}>${esc(L(K('Eu faço', 'I do it', 'Lo hago yo')))}</button>
    <button class="btn" data-act="cTask" data-p='${J_(Object.assign({}, p, { call: 1 }))}' ${err || !bots_ ? 'disabled' : ''}>${esc(L(K('Chamar equipe', 'Call the crew', 'Llamar al equipo')))}</button>
    <span class="small ${err ? 'orange' : 'muted'}">${esc(costTxt(sp.cost))}${err ? ' · ' + esc(L(err)) : ''}</span></div>`;
}
function buildBlock(id) {
  const C = S.colony, lv = C.b[id], max = CCOST[id].length - 1;
  const eff = { solar: K('+14 kWh por dia por nível e mais capacidade de bateria.', '+14 kWh per day per level and more battery capacity.', '+14 kWh por día por nivel y más capacidad de batería.'),
    agua: K('+35 L por dia por nível (extração e filtragem do rio).', '+35 L per day per level (river extraction and filtering).', '+35 L por día por nivel (extracción y filtrado del río).'),
    estufa: K('+5 kg de comida por dia por nível (mais com solo analisado e agricultor).', '+5 kg food per day per level (more with analyzed soil and a farmer).', '+5 kg de comida por día por nivel (más con suelo analizado y agricultor).'),
    torre: K('Permite transmitir dados à Terra; níveis melhoram o sinal.', 'Lets you send data to Earth; levels improve the signal.', 'Permite enviar datos a la Tierra; los niveles mejoran la señal.'),
    pista: K('Necessária para receber naves; níveis aumentam a chance de um pouso seguro.', 'Needed to receive ships; levels raise the chance of a safe landing.', 'Necesaria para recibir naves; los niveles aumentan la probabilidad de un aterrizaje seguro.'),
    habitat: K('+20 camas por nível: é preciso ter cama para cada colono.', '+20 beds per level: every colonist needs a bed.', '+20 camas por nivel: cada colono necesita una cama.') }[id];
  return `<p class="small">${esc(L(eff))}</p><p>${esc(L(K('Nível', 'Level', 'Nivel')))}: <b>${lv}/${max}</b> ${bar(lv, max)}</p>${lv < max ? taskBtns({ k: 'build', b: id }) : `<p class="green">✔ ${esc(L(K('Nível máximo', 'Max level', 'Nivel máximo')))}</p>`}`;
}
function colonyPanel(id) {
  const C = S.colony; const B = CBUILD[id]; let body = '';
  const sec = t => `<h4>${esc(L(t))}</h4>`;
  if (id === 'nave') {
    const obj = colonyObjectives();
    body = sec(K('Objetivos da missão', 'Mission objectives', 'Objetivos de la misión')) + obj.map(o => `<div class="alert ${o.done ? 'good' : 'info'}">${o.done ? '✔' : '▫'} ${esc(L(o.t))}</div>`).join('') +
      sec(K('Colônia', 'Colony', 'Colonia')) + `<div class="kv"><span>${esc(L(K('População', 'Population', 'Población')))}</span><b>${colonyPop()} (${alive().length} ${esc(L(K('tripulantes', 'crew', 'tripulantes')))} + ${C.colonists} ${esc(L(K('colonos', 'colonists', 'colonos')))})</b><span>${esc(L(K('Camas', 'Beds', 'Camas')))}</span><b>${C.colonists}/${colonyBeds()}</b><span>${esc(L(K('Pacotes enviados', 'Packages sent', 'Paquetes enviados')))}</span><b>${C.txCount}</b><span>${esc(L(K('Naves recebidas', 'Ships received', 'Naves recibidas')))}</span><b>${C.shipsLanded}/3</b><span>${esc(L(K('Local', 'Site', 'Lugar')))}</span><b>${esc(C.site)}</b></div>` +
      sec(K('Mensagens da Terra', 'Messages from Earth', 'Mensajes de la Tierra')) + `<div class="evlog">${C.feed.slice(-6).map(f => `<div>${esc(L(f.t))}</div>`).join('') || '<i>—</i>'}</div>` +
      sec(K('Tripulação', 'Crew', 'Tripulación')) + crewList();
  } else if (id === 'lab') {
    const pending = PLANET_ANALYSES.filter(a => !S.planet.analyzed.includes(a.id));
    body = sec(K('Oficina de impressão 3D', '3D-printing workshop', 'Taller de impresión 3D')) + `<p class="small">${esc(L(K('Peças podem ser fabricadas com o solo local (regolito) e plástico reciclado. Cada obra grande precisa de peças.', 'Parts can be made from local soil (regolith) and recycled plastic. Every big build needs parts.', 'Las piezas se pueden fabricar con suelo local (regolito) y plástico reciclado. Cada obra grande necesita piezas.')))}</p>` + `<p>⚙ ${S.peças} ${esc(L(K('peças em estoque', 'parts in stock', 'piezas en stock')))}</p>` + taskBtns({ k: 'fab' }) +
      sec(K('Análises de campo (sem risco)', 'Field analyses (no risk)', 'Análisis de campo (sin riesgo)')) +
      (pending.length ? pending.map(a => `<div class="opt"><b>${esc(T(a.name))}</b>${taskBtns({ k: 'an', a: a.id })}</div>`).join('') : `<p class="green">✔ ${esc(L(K('Todas as análises concluídas. Os resultados viram pacotes de dados para a Terra.', 'All analyses complete. The results become data packages for Earth.', 'Todos los análisis completados. Los resultados se convierten en paquetes de datos para la Tierra.')))}</p>`) +
      sec(K('Resultados', 'Results', 'Resultados')) + S.planet.analyzed.map(a => `<p class="small">• <b>${esc(T(PLANET_ANALYSES.find(x => x.id === a).name))}:</b> ${esc(T(PLANET_ANALYSES.find(x => x.id === a).result))}</p>`).join('');
  } else if (id === 'torre') {
    body = buildBlock(id);
    if (C.b.torre >= 1) body += sec(K('Transmitir dados para a Terra', 'Send data to Earth', 'Enviar datos a la Tierra')) + `<p class="small">${esc(L(K('Cada pacote usa dados (GB) e energia. A qualidade do sinal depende da torre, da comunicação da nave e do pesquisador. Meta: 3 pacotes.', 'Each package uses data (GB) and energy. Signal quality depends on the tower, the ship comms and the researcher. Goal: 3 packages.', 'Cada paquete usa datos (GB) y energía. La calidad de la señal depende de la torre, las comunicaciones de la nave y el investigador. Meta: 3 paquetes.')))}</p>` +
      TX_PACKAGES.map(pk => C.tx[pk.id] ? `<div class="opt on"><b>✔ ${esc(L(pk.name))}</b><span>${esc(L(K('Enviado à Terra', 'Sent to Earth', 'Enviado a la Tierra')))}</span></div>` : `<div class="opt"><b>${esc(L(pk.name))}</b>${taskBtns({ k: 'tx', a: pk.id })}</div>`).join('');
  } else if (id === 'pista') {
    body = buildBlock(id);
    if (C.b.pista >= 1) {
      body += sec(K('Naves de tripulação (colonos)', 'Crew ships (colonists)', 'Naves de tripulación (colonos)')) + `<p class="small">${esc(L(K('Peça a nave à Terra (exige 1+ pacote enviado, pista, energia e camas livres). Durante a descida, alguém deve ir à pista e acender o farol (+4 no pouso)!', 'Call the ship from Earth (needs 1+ package sent, a pad, energy and free beds). During descent, someone must go to the pad and light the beacon (+4 to landing)!', 'Pida la nave a la Tierra (exige 1+ paquete enviado, pista, energía y camas libres). ¡Durante el descenso alguien debe ir a la pista y encender la baliza (+4 al aterrizaje)!')))}</p>` + ctaskBar('pista');
      body += CSHIPS.map(def => {
        const sh = C.ships.find(s => s.n === def.n);
        if (sh && sh.state === 'landed') return `<div class="opt on"><b>✔ ${def.name}</b><span>+${def.size} ${esc(L(K('colonos a bordo da colônia', 'colonists joined the colony', 'colonos se unieron a la colonia')))}</span></div>`;
        if (sh && sh.state === 'inbound') return `<div class="opt"><b>🛬 ${def.name} — ${Math.max(0, Math.ceil(sh.eta - sh.t))}s</b>${bar(sh.t, sh.eta)}<span>${sh.beacon ? '💡 ' + esc(L(K('Farol aceso', 'Beacon lit', 'Baliza encendida'))) : esc(L(K('Acenda o farol!', 'Light the beacon!', '¡Encienda la baliza!')))}</span>${sh.beacon ? '' : taskBtns({ k: 'beacon' })}</div>`;
        return `<div class="opt"><b>${def.name}</b><span>${def.size} ${esc(L(K('colonos', 'colonists', 'colonos')))} · ${esc(L(K('traz suprimentos', 'brings supplies', 'trae suministros')))}</span><button class="btn tiny" data-act="cShip" data-p='${esc(JSON.stringify({ n: def.n }))}'>${esc(L(K('Pedir à Terra', 'Request from Earth', 'Pedir a la Tierra')))} (⚡12)</button></div>`;
      }).join('');
    }
  } else if (id === 'habitat') {
    body = buildBlock(id) + `<p>${esc(L(K('Camas', 'Beds', 'Camas')))}: <b>${C.colonists}/${colonyBeds()}</b> · ${esc(L(K('Naves previstas', 'Planned ships', 'Naves previstas')))}: 10 + 15 + 20</p>`;
  } else body = buildBlock(id);
  body = ctaskBar(id === 'nave' ? '__' : id) + body;
  return `<div class="modal-bg" data-ui="closePanel"><div class="panel station wide" data-stop="1"><button class="x" data-ui="closePanel">✕</button><h2>${B.icon} ${esc(L(B.name))}</h2>${body}<p class="quote small">🛰 ${esc(L(B.fact))}</p></div></div>`;
}
function colonyIntro() {
  return `<div class="modal-bg"><div class="panel center wide scroll" data-stop="1"><div class="blink cyan">● ${esc(L(K('PONTES-01 · SUPERFÍCIE', 'PONTES-01 · SURFACE', 'PONTES-01 · SUPERFICIE')))}</div><h2>${esc(L(K('A MISSÃO CONTINUA', 'THE MISSION CONTINUES', 'LA MISIÓN CONTINÚA')))}</h2>
    <p class="big">${esc(L(K('Pousamos em ' + S.colony.site + '! Mas uma colônia não se faz sozinha.', 'We landed at ' + T(S.colony.site) + '! But a colony does not build itself.', '¡Aterrizamos en ' + T(S.colony.site) + '! Pero una colonia no se construye sola.')))}</p>
    ${colonyObjectives().map(o => `<div class="alert info">▫ ${esc(L(o.t))}</div>`).join('')}
    <p class="small">${esc(L(K('Ande com ← → (A/D) e use E nas construções. Você pode trabalhar sozinho ou chamar a equipe (bots/jogadores). Fique perto do local enquanto trabalha. Nenhuma construção funciona sem energia: comece pelo campo solar. Se faltar comida ou água por 3 dias, a colônia falha.', 'Walk with ← → (A/D) and press E at buildings. You can work yourself or call the crew (bots/players). Stay near the site while you work. Nothing runs without power: start with the solar field. If food or water runs out for 3 days, the colony fails.', 'Camine con ← → (A/D) y pulse E en los edificios. Puede trabajar usted mismo o llamar al equipo (bots/jugadores). Quédese cerca del lugar mientras trabaja. Nada funciona sin energía: empiece por el campo solar. Si falta comida o agua por 3 días, la colonia fracasa.')))}</p>
    <div class="row"><button class="btn primary big" data-act="cTut">${esc(L(K('Começar a construir ▶', 'Start building ▶', 'Empezar a construir ▶')))}</button></div></div></div>`;
}

// ---------- desvio de rota: planeta errado ----------
function drawDetourBg(dt) {
  spaceBg(); drawStars(1, dt);
  const exo = S.detour && EXOPLANETS.find(e => e.id === S.detour.id);
  drawPlanet(exo ? exo.trip.type : 'rock', 180, 150, 220, R.t * 0.5);
  const a = R.t * 0.4; drawShipExterior(180 + Math.cos(a) * 140, 150 + Math.sin(a) * 40, 0.7, false);
  text(exo ? exo.name.toUpperCase() : '', 12, 10, '#ff9f5a', 8);
}
