// ============================================================
//  CHAT — multiplayer (jogadores reais) e jornada solo
//  • Multiplayer: o host retransmite as mensagens a todos.
//  • Solo: converse com a tripulação (bots) e com o Controle da
//    Missão (curiosidades da NASA e status da nave/colônia).
//  Mensagens do sistema são enviadas em PT/EN/ES e traduzidas
//  no navegador de cada jogador.
// ============================================================
'use strict';

const NASA_FACTS = [
  K('Controle da Missão: a atmosfera da Terra tem hoje mais de 420 ppm de CO₂, contra ≈ 280 ppm antes da era industrial (NASA/NOAA).', 'Mission Control: Earth\'s atmosphere now holds over 420 ppm of CO₂, versus ≈ 280 ppm before the industrial era (NASA/NOAA).', 'Control de la Misión: la atmósfera terrestre tiene hoy más de 420 ppm de CO₂, frente a ≈ 280 ppm antes de la era industrial (NASA/NOAA).'),
  K('Controle da Missão: a temperatura média da Terra já subiu ≈ 1,2 °C desde o fim do século XIX; os 10 anos mais quentes da história são os 10 últimos (NASA GISS).', 'Mission Control: Earth\'s average temperature has risen ≈ 1.2 °C since the late 1800s; the 10 warmest years on record are the last 10 (NASA GISS).', 'Control de la Misión: la temperatura media de la Tierra subió ≈ 1,2 °C desde fines del siglo XIX; los 10 años más cálidos registrados son los últimos 10 (NASA GISS).'),
  K('Controle da Missão: satélites da NASA medem que o nível do mar subiu cerca de 10 cm desde 1993, e o ritmo está acelerando.', 'Mission Control: NASA satellites show sea level has risen about 10 cm since 1993, and the pace is accelerating.', 'Control de la Misión: los satélites de la NASA miden que el nivel del mar subió unos 10 cm desde 1993 y el ritmo se acelera.'),
  K('Controle da Missão: a ISS dá uma volta na Terra a cada ~90 minutos, a 28.000 km/h. Os astronautas veem 16 nasceres do sol por dia!', 'Mission Control: the ISS circles Earth every ~90 minutes at 28,000 km/h. Astronauts see 16 sunrises a day!', 'Control de la Misión: la ISS da una vuelta a la Tierra cada ~90 minutos a 28.000 km/h. ¡Los astronautas ven 16 amaneceres al día!'),
  K('Controle da Missão: um astronauta respira cerca de 0,84 kg de oxigênio por dia. Na ISS, o O₂ vem da eletrólise da água.', 'Mission Control: an astronaut breathes about 0.84 kg of oxygen a day. On the ISS, O₂ comes from splitting water by electrolysis.', 'Control de la Misión: un astronauta respira cerca de 0,84 kg de oxígeno por día. En la ISS el O₂ sale de la electrólisis del agua.'),
  K('Controle da Missão: no espaço não há ar para espalhar o calor — a nave só se esfria irradiando. A diferença entre sol e sombra passa de 200 °C.', 'Mission Control: in space there is no air to spread heat — a ship cools only by radiating. The sun–shade difference can top 200 °C.', 'Control de la Misión: en el espacio no hay aire que reparta el calor: la nave solo se enfría irradiando. La diferencia entre sol y sombra supera los 200 °C.'),
  K('Controle da Missão: o sinal de rádio de Marte leva de 3 a 22 minutos para chegar à Terra. Conversas ao vivo são impossíveis!', 'Mission Control: a radio signal from Mars takes 3 to 22 minutes to reach Earth. Live conversations are impossible!', 'Control de la Misión: la señal de radio desde Marte tarda de 3 a 22 minutos en llegar a la Tierra. ¡Las conversaciones en vivo son imposibles!'),
  K('Controle da Missão: o telescópio Kepler (2009–2018) descobriu mais de 2.600 planetas observando pequenas quedas no brilho das estrelas (método do trânsito).', 'Mission Control: the Kepler telescope (2009–2018) found over 2,600 planets by watching tiny dips in starlight (the transit method).', 'Control de la Misión: el telescopio Kepler (2009–2018) descubrió más de 2.600 planetas observando pequeñas caídas en el brillo de las estrellas (método del tránsito).'),
];

const Chat = {
  log: [], open: false, unread: 0, nid: 1, factT: 70, lastSend: 0, dirty: true, els: null, peekUntil: 0,
  init() {
    const host = document.getElementById('chat'); if (!host) return;
    host.innerHTML = '';
    const btn = document.createElement('button'); btn.className = 'chat-btn'; btn.type = 'button';
    const peek = document.createElement('div'); peek.className = 'chat-peek';
    const box = document.createElement('div'); box.className = 'chat-box';
    const head = document.createElement('div'); head.className = 'chat-head';
    const title = document.createElement('b'); const close = document.createElement('button'); close.type = 'button'; close.textContent = '✕'; close.className = 'chat-x';
    head.append(title, close);
    const list = document.createElement('div'); list.className = 'chat-list';
    const form = document.createElement('form'); form.className = 'chat-form'; form.autocomplete = 'off';
    const inp = document.createElement('input'); inp.type = 'text'; inp.maxLength = 200; inp.className = 'chat-in';
    const go = document.createElement('button'); go.type = 'submit'; go.textContent = '➤'; go.className = 'chat-go';
    form.append(inp, go); box.append(head, list, form); host.append(peek, box, btn);
    this.els = { host, btn, peek, box, title, list, inp, close };
    btn.addEventListener('click', () => this.toggle());
    close.addEventListener('click', () => this.toggle(false));
    form.addEventListener('submit', e => { e.preventDefault(); const t = inp.value; inp.value = ''; this.send(t); inp.blur(); }); // Enter de novo reabre o campo; o jogo volta a receber as teclas
    inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Escape') { inp.blur(); this.toggle(false); } });
    inp.addEventListener('keyup', e => e.stopPropagation());
    ['pointerdown', 'click'].forEach(ev => host.addEventListener(ev, e => e.stopPropagation()));
    this.render(true);
    setInterval(() => this.tick(), 500);
  },
  // o chat só existe no multiplayer; no modo solo a tripulação fala em balões
  visible() { return !!Net.role && ((typeof S !== 'undefined' && S && U.screen === 'game') || U.screen === 'lobby'); },
  toggle(v) {
    this.open = v == null ? !this.open : v;
    if (this.open) { this.unread = 0; this.dirty = true; }
    this.render(true);
    if (this.open && this.els) setTimeout(() => this.els.inp.focus(), 30);
  },
  focus() { if (typeof keys !== 'undefined') for (const k in keys) keys[k] = false; if (!this.open) this.toggle(true); else this.els.inp.focus(); },
  myName() {
    if (typeof S !== 'undefined' && S) { const c = crewById(U.me); if (c) return c.name; }
    const av = Save.data.avatar; return (av && av.name) || (Net.role === 'host' ? 'Comandante' : 'Tripulante');
  },
  myRole() { if (typeof S !== 'undefined' && S) { const c = crewById(U.me); if (c) return c.roleName; } return Net.role === 'host' ? 'Comandante' : (Net.myRoleName || ''); },
  // adiciona localmente
  add(m) {
    m.id = this.nid++; m.at = Date.now();
    this.log.push(m); if (this.log.length > 100) this.log.shift();
    if (!this.open && !m.mine) { this.unread++; this.peekUntil = Date.now() + 9000; }
    this.dirty = true; this.render();
  },
  // mensagem do sistema / Controle da Missão (host e solo transmitem a todos)
  sysAll(k, kind) {
    const m = { sys: true, kind: kind || 'mc', k };
    if (typeof Net !== 'undefined' && Net.role === 'client') return; // clientes só recebem
    if (typeof Net === 'undefined' || !Net.role) { // solo: sem chat — curiosidades viram aviso do rádio
      if (kind === 'fact' && typeof S !== 'undefined' && S) S.toast = { text: k, kind: 'info', t: 8, id: Math.random() };
      return;
    }
    this.add(Object.assign({}, m));
    if (typeof Net !== 'undefined' && Net.role === 'host') Net.send({ t: 'bcast', msg: { t: 'chat', m } });
  },
  // o jogador local digitou algo
  send(text) {
    text = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 200); if (!text) return;
    const now = Date.now(); if (now - this.lastSend < 350) return; this.lastSend = now;
    if (Net.role === 'client') { Net.send({ t: 'chat', text }); return; }
    const m = { from: this.myName(), role: this.myRole(), rid: U.me, text };
    this.add(Object.assign({ mine: true }, m));
    if (Net.role === 'host') Net.send({ t: 'bcast', msg: { t: 'chat', m } });
    if (typeof S !== 'undefined' && S && U.screen === 'game') this.botReply(text);
  },
  // host recebe texto de um tripulante
  fromPlayer(pid, text) {
    const p = Net.players[pid]; if (!p) return;
    const now = Date.now(); if (now - (p.lastChat || 0) < 350) return; p.lastChat = now;
    text = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 200); if (!text) return;
    const r = ROLES.find(x => x.id === p.role);
    const m = { from: p.name, role: r ? r.name : '', rid: p.role, text };
    this.add(Object.assign({}, m));
    Net.send({ t: 'bcast', msg: { t: 'chat', m } });
    if (typeof S !== 'undefined' && S) this.botReply(text, true);
  },
  // cliente recebe
  fromNet(m) { if (!m || typeof m !== 'object') return; const mine = !m.sys && m.rid === U.me && m.from === this.myName(); this.add(Object.assign({}, m, { mine })); },

  // ---------- respostas dos bots (solo) ----------
  botReply(text, onlyMention) {
    if (!S) return;
    const low = text.toLowerCase();
    const crew = S.crew.filter(c => c.alive && c.id !== U.me && (!c.owner || c.owner === 'bot'));
    let target = crew.find(c => low.includes(c.name.toLowerCase()) || low.includes('@' + c.roleName.toLowerCase().split(' ')[0]) || low.includes(c.roleName.toLowerCase()));
    const mc = /(nasa|terra\b|earth|tierra|controle|control\b|mission|miss[aã]o|misi[oó]n|fato|fact|curios|sabia|did you know|sab[ií]as)/.test(low);
    if (onlyMention && !target && !mc && !/^@/.test(low)) return; // no multiplayer, só responde se for chamado
    const delay = 700 + Math.random() * 900;
    setTimeout(() => {
      if (!S) return;
      const intent = this.intent(low);
      if (mc && !target) return this.reply({ name: L(K('Controle da Missão', 'Mission Control', 'Control de la Misión')), role: 'NASA', mc: true }, this.mcAnswer(low, intent));
      if (!target) target = crew.length ? pick(crew) : null;
      if (!target) return this.reply({ name: L(K('Controle da Missão', 'Mission Control', 'Control de la Misión')), role: 'NASA', mc: true }, this.mcAnswer(low, intent));
      this.reply({ name: target.name, role: target.roleName, rid: target.id }, this.crewAnswer(target, intent));
    }, delay);
  },
  reply(who, text) {
    if (!text) return;
    const m = { from: who.name, role: who.role, rid: who.rid || 'bot', text, bot: true, mc: !!who.mc };
    this.add(Object.assign({}, m));
    if (Net.role === 'host') Net.send({ t: 'bcast', msg: { t: 'chat', m } });
  },
  intent(low) {
    const has_ = re => re.test(low);
    if (has_(/(ajuda|help|ayuda|comandos|commands)/)) return 'help';
    if (has_(/(oxig|oxyg|o2|o₂)/)) return 'o2';
    if (has_(/([aá]gua|water|agua)/)) return 'agua';
    if (has_(/(comida|food|comer|eat|alimento|fome|hungry|hambre)/)) return 'comida';
    if (has_(/(energia|energy|power|bateria|battery|bater[ií]a)/)) return 'energia';
    if (has_(/(combust|fuel)/)) return 'fuel';
    if (has_(/(moral|humor|mood|[aâ]nimo|feliz|happy)/)) return 'moral';
    if (has_(/(status|situa|situation|estado|como estamos|how are|how is|resumo|summary)/)) return 'status';
    if (has_(/(miss[aã]o|objetivo|objective|mission|o que fa[cç]o|what do i do|qu[eé] hago|pr[oó]ximo|next)/)) return 'goal';
    if (has_(/(piada|joke|chiste)/)) return 'joke';
    if (has_(/(obrigad|thank|gracias|valeu)/)) return 'thanks';
    if (has_(/(\boi\b|ol[aá]|hello|\bhi\b|hola|bom dia|good morning|buenas)/)) return 'hi';
    if (has_(/(planeta|planet|pontes)/)) return 'planet';
    return 'chat';
  },
  statusLine() {
    const r = S.res, f = (k, u) => fmt(r[k], 0) + ' ' + u;
    return `⚡ ${f('energia', 'kWh')} · 💧 ${f('agua', 'L')} · 🍱 ${f('comida', 'kg')} · ⛽ ${f('combustivel', 'kg')} · O₂ ${f('oxigenio', 'kg')} · ☺ ${fmt(moralIndex(), 0)}`;
  },
  goalLine() {
    if (S.scene === 'colony' && S.colony) { const o = colonyObjectives().find(x => !x.done); return o ? L(K('Próximo objetivo: ', 'Next objective: ', 'Próximo objetivo: ')) + L(o.t) : L(K('Todos os objetivos cumpridos!', 'All objectives complete!', '¡Todos los objetivos cumplidos!')); }
    if (S.scene === 'ship') return L(K('Cuide dos recursos, enfrente os desafios e leve a nave até Pontes-01b. Use as estações com E.', 'Look after resources, handle the challenges and bring the ship to Pontes-01b. Use stations with E.', 'Cuide los recursos, enfrente los desafíos y lleve la nave a Pontes-01b. Use las estaciones con E.'));
    if (S.scene === 'station') return L(K('Analise os exoplanetas, escolha o destino com cuidado e parta da Estação Ponte-Alfa.', 'Analyze the exoplanets, choose your destination carefully and leave Ponte-Alfa Station.', 'Analice los exoplanetas, elija el destino con cuidado y parta de la Estación Ponte-Alfa.'));
    return L(K('Siga as instruções na tela, Comandante.', 'Follow the on-screen instructions, Commander.', 'Siga las instrucciones en pantalla, Comandante.'));
  },
  fact() { Chat._fn = ((Chat._fn || 0) + 1); const all = NASA_FACTS.concat(CFACTS); return L(all[Math.floor(Math.random() * all.length)]); },
  mcAnswer(low, intent) {
    if (['status', 'o2', 'agua', 'comida', 'energia', 'fuel', 'moral'].includes(intent)) return L(K('Controle da Missão: telemetria recebida — ', 'Mission Control: telemetry received — ', 'Control de la Misión: telemetría recibida — ')) + this.statusLine();
    if (intent === 'goal') return L(K('Controle da Missão: ', 'Mission Control: ', 'Control de la Misión: ')) + this.goalLine();
    if (intent === 'help') return L(K('Controle da Missão: pergunte “status”, “oxigênio”, “água”, “objetivo” ou “curiosidade”. Chame um tripulante pelo nome!', 'Mission Control: ask for “status”, “oxygen”, “water”, “goal” or “fact”. Call a crew member by name!', 'Control de la Misión: pregunte “estado”, “oxígeno”, “agua”, “objetivo” o “curiosidad”. ¡Llame a un tripulante por su nombre!'));
    if (intent === 'hi') return L(K('Controle da Missão: aqui é a Terra, Comandante. Câmbio!', 'Mission Control: Earth here, Commander. Over!', 'Control de la Misión: aquí la Tierra, Comandante. ¡Cambio!'));
    if (intent === 'thanks') return L(K('Controle da Missão: sempre às ordens. A Terra torce por vocês!', 'Mission Control: always at your service. Earth is rooting for you!', 'Control de la Misión: siempre a sus órdenes. ¡La Tierra los apoya!'));
    return this.fact();
  },
  crewAnswer(c, intent) {
    const role = c.role.startsWith('engenheiro') ? 'eng' : c.role;
    const r = S.res;
    const flavor = {
      paramedico: [K('Estou de olho na saúde de todos. Beba água e durma bem!', 'I\'m watching everyone\'s health. Drink water and sleep well!', 'Vigilo la salud de todos. ¡Beban agua y duerman bien!'), K('Na microgravidade os ossos perdem massa. Lembrem de se exercitar!', 'In microgravity bones lose mass. Remember to exercise!', 'En microgravedad los huesos pierden masa. ¡Recuerden hacer ejercicio!')],
      navegador: [K('A rota está sob controle. Cada grau de desvio custa combustível.', 'The route is under control. Every degree of drift costs fuel.', 'La ruta está bajo control. Cada grado de desvío cuesta combustible.'), K('As estrelas não mentem: Pontes-01b está logo ali.', 'The stars don\'t lie: Pontes-01b is right there.', 'Las estrellas no mienten: Pontes-01b está justo ahí.')],
      agricultor: [K('As plantas estão firmes! Alface em 4 dias, batata demora mais.', 'The plants are doing great! Lettuce in 4 days, potatoes take longer.', '¡Las plantas están firmes! Lechuga en 4 días, la papa tarda más.'), K('Na ISS já colheram até pimenta. Aqui vai ter tempero!', 'On the ISS they even harvested chile peppers. We\'ll have spice here!', 'En la ISS hasta cosecharon chile. ¡Aquí habrá sabor!')],
      eng: [K('Posso consertar quase tudo com uma boa peça e um pouco de energia.', 'I can fix almost anything with a good part and a bit of power.', 'Puedo arreglar casi todo con una buena pieza y algo de energía.'), K('Os sistemas estão rodando. Se algo apitar, eu corro!', 'Systems are running. If anything beeps, I\'ll run!', 'Los sistemas funcionan. ¡Si algo suena, corro!')],
      pesquisador: [K('Os dados que coletamos valem ouro para a Terra.', 'The data we collect is gold for Earth.', 'Los datos que recogemos valen oro para la Tierra.'), K('Sabia que já são mais de 6.000 exoplanetas confirmados?', 'Did you know there are over 6,000 confirmed exoplanets?', '¿Sabía que ya hay más de 6.000 exoplanetas confirmados?')],
      comandante: [K('Aqui é o Comandante. Seguimos a missão.', 'Commander here. We continue the mission.', 'Aquí el Comandante. Seguimos con la misión.')],
    }[role] || [K('Estou aqui para ajudar.', 'Here to help.', 'Estoy aquí para ayudar.')];
    const pre = `${c.name}: `;
    const resLine = (k, label) => pre + L(K('Temos ', 'We have ', 'Tenemos ')) + fmt(r[k], 0) + ' ' + label + '.';
    switch (intent) {
      case 'status': return pre + this.statusLine();
      case 'o2': return resLine('oxigenio', 'kg de O₂');
      case 'agua': return resLine('agua', L(K('litros de água', 'L of water', 'L de agua')));
      case 'comida': return resLine('comida', L(K('kg de comida', 'kg of food', 'kg de comida')));
      case 'energia': return resLine('energia', 'kWh');
      case 'fuel': return resLine('combustivel', L(K('kg de combustível', 'kg of fuel', 'kg de combustible')));
      case 'moral': return pre + L(K('A moral da equipe está em ', 'Team morale is ', 'La moral del equipo está en ')) + fmt(moralIndex(), 0) + '. ' + (c.humor < 40 ? L(K('Eu mesmo ando meio pra baixo…', 'I\'m feeling a bit down myself…', 'Yo mismo ando algo decaído…')) : L(K('Eu estou bem!', 'I\'m doing fine!', '¡Yo estoy bien!')));
      case 'goal': return pre + this.goalLine();
      case 'help': return pre + L(K('Pergunte “status”, “água”, “comida”, “moral”, “objetivo” ou fale com a “NASA” para curiosidades.', 'Ask for “status”, “water”, “food”, “morale”, “goal” or talk to “NASA” for facts.', 'Pregunte “estado”, “agua”, “comida”, “moral”, “objetivo” o hable con la “NASA” para curiosidades.'));
      case 'joke': return pre + pick([L(K('Por que o astronauta terminou o namoro? Precisava de espaço!', 'Why did the astronaut end the relationship? He needed space!', '¿Por qué el astronauta terminó la relación? ¡Necesitaba espacio!')), L(K('Cuidado com o lixo espacial: é o único que gira em volta da gente!', 'Beware space junk: the only trash that orbits around us!', 'Cuidado con la basura espacial: ¡la única que gira a nuestro alrededor!'))]);
      case 'thanks': return pre + L(K('De nada, Comandante!', 'You\'re welcome, Commander!', '¡De nada, Comandante!'));
      case 'hi': return pre + L(K('Olá! Pronto para o que der e vier.', 'Hello! Ready for whatever comes.', '¡Hola! Listo para lo que venga.'));
      case 'planet': return pre + L(K('Pontes-01b tem raio ≈ 1,04 R⊕, água líquida provável e uma estrela calma. A nossa melhor aposta!', 'Pontes-01b has radius ≈ 1.04 R⊕, probable liquid water and a calm star. Our best bet!', 'Pontes-01b tiene radio ≈ 1,04 R⊕, agua líquida probable y una estrella tranquila. ¡Nuestra mejor apuesta!'));
      default: return pre + L(pick(flavor));
    }
  },

  // ---------- interface ----------
  tick() {
    if (!this.els) return;
    const vis = this.visible();
    this.els.host.style.display = vis ? '' : 'none';
    if (!vis) return;
    if (Date.now() < this.peekUntil + 600) this.render();
    // solo: tripulantes comentam em balões de fala
    if (typeof S !== 'undefined' && S && U.screen === 'game' && !Net.role && ['ship', 'colony'].includes(S.scene) && !S.paused && !(S.event && S.event.phase === 'run')) {
      this.talkT = (this.talkT == null ? 25 : this.talkT) - 0.5;
      if (this.talkT <= 0) {
        this.talkT = 30 + Math.random() * 30;
        const crew = S.crew.filter(c => c.alive && c.id !== U.me && !c.bubble && !c.hibernating && !c.eva);
        if (crew.length) { const c = pick(crew); const line = this.crewAnswer(c, Math.random() < 0.25 ? 'status' : 'chat'); if (line) say(c, line.startsWith(c.name + ': ') ? line.slice(c.name.length + 2) : line, 7); }
      }
    }
    // curiosidades automáticas do Controle da Missão (host / solo)
    if (typeof S !== 'undefined' && S && U.screen === 'game' && Net.role !== 'client' && ['ship', 'station', 'detour', 'planet', 'migration'].includes(S.scene) && !S.paused) {
      this.factT -= 0.5;
      if (this.factT <= 0) { this.factT = 85 + Math.random() * 40; this.sysAll(NASA_FACTS[(this._f = ((this._f || 0) + 1)) % NASA_FACTS.length], 'fact'); }
    }
  },
  render(force) {
    const e = this.els; if (!e) return;
    const vis = this.visible(); e.host.style.display = vis ? '' : 'none';
    e.host.classList.toggle('open', this.open);
    const label = L(K('Chat', 'Chat', 'Chat'));
    e.btn.textContent = '💬 ' + label + (this.unread ? ' (' + this.unread + ')' : '');
    e.btn.classList.toggle('new', this.unread > 0);
    e.btn.title = L(K('Abrir o chat (Enter)', 'Open chat (Enter)', 'Abrir el chat (Enter)'));
    e.title.textContent = Net.role ? '💬 ' + L(K('Chat da sala', 'Room chat', 'Chat de la sala')) + (Net.room ? ' ' + Net.room : '') : '💬 ' + L(K('Chat com a tripulação e a NASA', 'Chat with the crew & NASA', 'Chat con la tripulación y la NASA'));
    e.inp.placeholder = Net.role ? L(K('Mensagem para a sala… (Enter envia)', 'Message the room… (Enter sends)', 'Mensaje a la sala… (Enter envía)')) : L(K('Fale com a tripulação ou “NASA”… (“ajuda”)', 'Talk to the crew or “NASA”… (“help”)', 'Hable con la tripulación o “NASA”… (“ayuda”)'));
    if (!this.dirty && !force) { this.peekRender(); return; }
    this.dirty = false;
    e.list.textContent = '';
    for (const m of this.log) e.list.appendChild(this.line(m));
    e.list.scrollTop = e.list.scrollHeight;
    this.peekRender();
  },
  line(m) {
    const d = document.createElement('div'); d.className = 'cm' + (m.sys ? ' sys ' + (m.kind || '') : '') + (m.mine ? ' mine' : '') + (m.bot ? ' bot' : '') + (m.mc ? ' mcm' : '');
    if (m.sys) { d.textContent = L(m.k); return d; }
    const b = document.createElement('b'); b.textContent = m.from + (m.role && !m.mc ? ' · ' + T(m.role) : '') + ': ';
    b.style.color = this.color(m);
    const s = document.createElement('span'); s.textContent = m.bot && m.text.startsWith(m.from + ': ') ? m.text.slice(m.from.length + 2) : m.text;
    d.append(b, s); return d;
  },
  color(m) {
    if (m.mc) return '#ffd34c';
    const i = ['cmd', 'paramedico', 'navegador', 'agricultor', 'engenheiro1', 'engenheiro2', 'pesquisador'].indexOf(m.rid);
    return ['#ffd34c', '#7dffb0', '#7ad8ff', '#a6e86a', '#ff9f5a', '#ff7ac8', '#c7a6ff'][i < 0 ? 0 : i];
  },
  peekRender() {
    const e = this.els; if (!e) return;
    if (this.open || Date.now() > this.peekUntil) { e.peek.textContent = ''; return; }
    e.peek.textContent = '';
    this.log.filter(m => Date.now() - m.at < 9000).slice(-3).forEach(m => e.peek.appendChild(this.line(m)));
  },
};
