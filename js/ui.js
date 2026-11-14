// ============================================================
//  INTERFACE — telas HTML sobre o canvas
// ============================================================
'use strict';

const U = {
  screen: 'title', panel: null, tab: null, setupStep: 0, avatarDraft: null, paintColor: '#ff0734', paintOn: false,
  introIdx: 0, introT: 0, earth: null, comms: 0, launchT: 0, cook: [], autopilot: null, cache: {}, lastNarr: null,
  lastToast: null, me: 'cmd', avatarDirty: true, setupDirty: true, settingsOpen: false, confirmQuit: false, lobby: null,
};
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const J = o => esc(JSON.stringify(o));

function act(type, p) {
  Sfx.click();
  if (Net.role === 'client') Net.send({ t: 'act', type, p });
  else applyAction(type, p, U.me);
}
function me() { return S ? crewById(U.me) : null; }

const _spriteURL = new Map();
function spriteURL(av, outfit = 'suit', mood = 'happy', scale = 3) {
  const key = avatarKey(av) + outfit + mood + scale;
  if (_spriteURL.has(key)) return _spriteURL.get(key);
  const c = document.createElement('canvas'); c.width = SPR_W * scale; c.height = SPR_H * scale;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(getSprite(av, outfit, mood, 0), 0, 0, c.width, c.height);
  const url = c.toDataURL();
  if (_spriteURL.size > 300) _spriteURL.clear();
  _spriteURL.set(key, url); return url;
}
function bar(v, max, cls = '', inverse = false) {
  const p = clamp(max ? v / max : 0, 0, 1);
  const lvl = inverse ? (p > 0.7 ? 'bad' : p > 0.4 ? 'warn' : 'ok') : (p < 0.2 ? 'bad' : p < 0.4 ? 'warn' : 'ok');
  return `<span class="bar ${cls} ${lvl}"><i style="width:${(p * 100).toFixed(1)}%"></i></span>`;
}
function setHTML(id, html) {
  if (U.cache[id] === html) return;
  U.cache[id] = html;
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// =============== TELAS SEM PARTIDA ===============
function titleScreen() {
  const cr = Save.data.credits;
  return `<div class="title-screen">
    <div class="tbox tl"><div class="lbl">TERRA</div><div class="red">⚠ INABITÁVEL</div><div class="sep"></div><div class="lbl">MARTE</div><div class="green">✓ COLÔNIA ATIVA</div></div>
    <div class="tbox tc"><p>A Terra está se tornando inabitável.<br>Os humanos já conquistaram colônias em <span class="orange">Marte</span>,<br>e agora precisamos de um novo lar.<br>Nosso destino é desconhecido...<br>...mas uma esperança nos guia: <span class="cyan">Pontes01</span>.</p></div>
    <div class="tbox tr"><div class="lbl cyan">▣ MISSÃO ATUAL</div><div class="small">Explorar o planeta</div><div class="cyan">Pontes01</div></div>
    <div class="logo"><h1>PONTES<span>01</span></h1><div class="sub">— EXPLORAÇÃO ESPACIAL —</div></div>
    <div class="menu">
      <button class="mbtn primary" data-ui="journey">▶ NOVA JORNADA</button>
      <button class="mbtn" data-ui="lobby">👥 MULTIPLAYER</button>
      <button class="mbtn" data-ui="avatar">🧑‍🚀 CRIAR AVATAR</button>
      <button class="mbtn" data-ui="shop">✦ LOJA <small>${cr} créditos</small></button>
      <button class="mbtn" data-ui="history">📖 HISTÓRIA</button>
      <button class="mbtn" data-ui="settings">⚙ CONFIGURAÇÕES</button>
    </div>
    <div class="tfoot">UM NOVO MUNDO NOS ESPERA...<b>PONTES01</b></div>
  </div>`;
}
function journeyScreen() {
  return `<div class="panel center wide">
    <h2>NOVA JORNADA</h2>
    <p class="muted">Escolha o tamanho da expedição. Os 6 tripulantes que não forem jogadores são controlados por bots.</p>
    <div class="cards two">
      <button class="card big" data-ui="startGame" data-arg="completa"><h3>🚀 Jornada Completa</h3><p>≈ 30 dias de viagem · 9 desafios · as 5 etapas da campanha.</p><p class="muted">Cada dia dura 30 s. Recomendado para a experiência completa.</p></button>
      <button class="card big" data-ui="startGame" data-arg="curta"><h3>⚡ Jornada Curta</h3><p>≈ 12 dias · 4 desafios · regulação térmica de 3 min.</p><p class="muted">Ideal para aulas e partidas rápidas.</p></button>
    </div>
    <div class="row"><button class="btn" data-ui="title">◀ Voltar</button></div>
  </div>`;
}
function historyScreen() {
  return `<div class="panel center wide scroll">
    <h2>HISTÓRIA</h2>
    ${NARRATION_INTRO.map(t => `<p>${esc(t)}</p>`).join('')}
    <h3>As 5 etapas</h3>
    <ol><li><b>Preparação:</b> montar a expedição com verba limitada.</li><li><b>Partida e viagem:</b> controlar a nave e enfrentar os problemas espaciais.</li><li><b>Exploração científica:</b> analisar dados reais de exoplanetas.</li><li><b>O novo mundo:</b> investigar Pontes-01 e se adaptar.</li><li><b>Migração:</b> escolher onde a humanidade vai recomeçar.</li></ol>
    <p class="quote">“Na Terra, a atmosfera regula a temperatura de graça. Numa nave, tudo isso tem custo. Por isso é mais fácil manter a Terra habitável do que habitar outro planeta.”</p>
    <div class="row"><button class="btn" data-ui="title">◀ Voltar</button></div>
  </div>`;
}
function settingsScreen(inGame) {
  const st = Save.data.settings;
  return `<div class="panel center">
    <h2>CONFIGURAÇÕES</h2>
    <label class="field">Música <input type="range" min="0" max="1" step="0.05" value="${st.music}" data-set="music"></label>
    <label class="field">Efeitos <input type="range" min="0" max="1" step="0.05" value="${st.sfx}" data-set="sfx"></label>
    <label class="check"><input type="checkbox" data-set="narration" ${st.narration ? 'checked' : ''}> Narração por voz (pt-BR)</label>
    <label class="check"><input type="checkbox" data-set="showDice" ${st.showDice ? 'checked' : ''}> Modo professor: mostrar as rolagens dos dados</label>
    <label class="check"><input type="checkbox" data-set="fastEarth" ${st.fastEarth ? 'checked' : ''}> Abertura na Terra mais curta (30 s)</label>
    <div class="row"><button class="btn" data-ui="${inGame ? 'closePanel' : 'title'}">◀ Voltar</button></div>
  </div>`;
}
function shopScreen() {
  const cats = [['lazer', 'Lazer (moral)'], ['produtividade', 'Produtividade (eficiência)'], ['upgrade', 'Peças e upgrades']];
  const b = shopBonus();
  return `<div class="panel center wide scroll">
    <h2>LOJA <span class="credits">✦ ${Save.data.credits} créditos</span></h2>
    <p class="muted">Cada fase vencida dá pontos. Itens de lazer aumentam a <b>moral</b>; itens de produtividade aumentam a <b>eficiência</b> da tripulação. Bônus atuais: moral +${b.moral}% · eficiência +${b.eff}%.</p>
    ${cats.map(([c, n]) => `<h3>${n}</h3><div class="shopgrid">${SHOP.filter(i => i.cat === c).map(i => {
      const owned = Save.owns(i.id);
      return `<div class="shopitem ${owned ? 'owned' : ''}"><b>${esc(i.name)}</b><span>${esc(i.desc)}</span>${owned ? '<em>✔ adquirido</em>' : `<button class="btn small" data-ui="buy" data-arg="${i.id}" ${Save.data.credits < i.price ? 'disabled' : ''}>✦ ${i.price}</button>`}</div>`;
    }).join('')}</div>`).join('')}
    <div class="row"><button class="btn" data-ui="title">◀ Voltar</button></div>
  </div>`;
}

// ---------- criador de avatar ----------
function avatarScreen() {
  const a = U.avatarDraft;
  const sw = (key, list, cur, isPair) => list.map((c, i) => `<button class="sw ${cur === i ? 'on' : ''}" style="background:${isPair ? c[0] : c}" data-ui="av" data-arg="${key}:${i}"></button>`).join('');
  const swc = (key, list, cur) => list.map(c => `<button class="sw ${cur === c ? 'on' : ''}" style="background:${c}" data-ui="avc" data-arg="${key}:${c}"></button>`).join('');
  const opts = (key, obj, cur, names) => Object.keys(obj).map(k => `<button class="chip ${cur === k ? 'on' : ''}" data-ui="avs" data-arg="${key}:${k}">${names[k] || k}</button>`).join('');
  const hairNames = { careca: 'Careca', lateral: 'Repartido', curto: 'Curto', franja: 'Franja', longo: 'Longo', moicano: 'Moicano', blackpower: 'Black power', coque: 'Coque', raspado: 'Raspado', topete: 'Topete' };
  const accNames = { nenhum: 'Nenhum', oculos: 'Óculos escuros', oculosRedondos: 'Óculos', barba: 'Barba', bigode: 'Bigode', cicatriz: 'Cicatriz', fone: 'Headset', bone: 'Boné', bandana: 'Bandana', sardas: 'Sardas' };
  const paintPal = ['#000000', '#ffffff', '#ff0734', '#ff9019', '#fbff28', '#2fa84f', '#24c3ff', '#0026ff', '#7a3cff', '#ff4fa3', '#8e5529', '#ffb27f', 'erase'];
  return `<div class="avatar-screen">
    <div class="av-left">
      <h2>CRIADOR DE AVATAR</h2>
      <div class="previews"><canvas id="pv-civil" width="60" height="93"></canvas><canvas id="pv-suit" width="60" height="93"></canvas><canvas id="pv-helmet" width="60" height="93"></canvas></div>
      <div class="muted small">Terra (sem traje) · Nave · Capacete</div>
      <h3>Pintura livre (pixel a pixel)</h3>
      <canvas id="paint" width="200" height="310" class="paintgrid"></canvas>
      <div class="pal">${paintPal.map(c => `<button class="sw ${U.paintColor === c ? 'on' : ''} ${c === 'erase' ? 'erase' : ''}" style="${c === 'erase' ? '' : 'background:' + c}" data-ui="paintColor" data-arg="${c}">${c === 'erase' ? '⌫' : ''}</button>`).join('')}
        <button class="btn small" data-ui="paintClear">Limpar pintura</button></div>
    </div>
    <div class="av-right scroll">
      <label class="field">Nome <input id="av-name" maxlength="14" value="${esc(a.name)}"></label>
      <div class="grp"><b>Pele</b>${sw('skin', SKIN_TONES, a.skin)}</div>
      <div class="grp"><b>Cabelo</b>${opts('hair', HAIR, a.hair, hairNames)}</div>
      <div class="grp"><b>Cor do cabelo</b>${sw('hairColor', HAIR_COLORS, a.hairColor)}</div>
      <div class="grp"><b>Olhos</b>${sw('eyes', EYE_COLORS, a.eyes, true)}</div>
      <div class="grp"><b>Acessório</b>${opts('acc', ACCESSORIES, a.acc, accNames)}</div>
      <div class="grp"><b>Cor do acessório</b>${swc('accColor', ['#e03030', '#2f7fff', '#ffd34c', '#2fa84f', '#7a3cff', '#151515', '#ffffff'], a.accColor)}</div>
      <div class="grp"><b>Camiseta</b>${sw('shirt', CLOTH_COLORS, a.shirt)} <button class="chip ${a.longSleeve ? 'on' : ''}" data-ui="avt" data-arg="longSleeve">Manga longa</button></div>
      <div class="grp"><b>Calça / short</b>${sw('pants', CLOTH_COLORS, a.pants)} <button class="chip ${a.shorts ? 'on' : ''}" data-ui="avt" data-arg="shorts">Short</button></div>
      <div class="grp"><b>Traje espacial</b>${sw('suit', SUIT_COLORS, a.suit)}</div>
      <div class="grp"><b>Mochila de O₂</b>${swc('pack', ['#ff9411', '#e8e8e8', '#38e07b', '#ff4fa3', '#24c3ff', '#ffd34c'], a.pack)}</div>
      <div class="grp"><b>Visor</b>${sw('visor', VISOR_COLORS, a.visor, true)}</div>
      <div class="grp"><b>Insígnia</b>${swc('badge', ['#20a04f', '#e03030', '#2f7fff', '#ffd34c', '#7a3cff'], a.badge)}</div>
      <div class="row"><button class="btn" data-ui="avRandom">🎲 Aleatório</button><button class="btn primary" data-ui="avSave">✔ Salvar</button><button class="btn" data-ui="title">◀ Voltar</button></div>
    </div>
  </div>`;
}
function drawAvatarPreviews() {
  const a = U.avatarDraft; if (!a) return;
  const frame = Math.floor(R.t * 6) % 4;
  [['pv-civil', 'civil'], ['pv-suit', 'suit'], ['pv-helmet', 'helmet']].forEach(([id, of]) => {
    const c = document.getElementById(id); if (!c) return;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.clearRect(0, 0, c.width, c.height);
    g.drawImage(getSprite(a, of, 'happy', [0, 1, 0, 2][frame]), 0, 0, 60, 93);
  });
  const p = document.getElementById('paint'); if (!p) return;
  const g = p.getContext('2d'); g.imageSmoothingEnabled = false;
  g.fillStyle = '#1a2040'; g.fillRect(0, 0, 200, 310);
  for (let y = 0; y < SPR_H; y++) for (let x = 0; x < SPR_W; x++) if ((x + y) % 2) { g.fillStyle = '#20284c'; g.fillRect(x * 10, y * 10, 10, 10); }
  g.drawImage(getSprite(a, 'suit', 'happy', 0), 0, 0, 200, 310);
  g.strokeStyle = 'rgba(255,255,255,0.08)';
  for (let x = 0; x <= SPR_W; x++) { g.beginPath(); g.moveTo(x * 10 + 0.5, 0); g.lineTo(x * 10 + 0.5, 310); g.stroke(); }
  for (let y = 0; y <= SPR_H; y++) { g.beginPath(); g.moveTo(0, y * 10 + 0.5); g.lineTo(200, y * 10 + 0.5); g.stroke(); }
}

// ---------- lobby multiplayer ----------
function lobbyScreen() {
  const L = U.lobby || {};
  const def = (location.protocol === 'https:' ? 'wss://' : 'ws://') + (location.host || 'localhost:8080') + '/ws';
  if (Net.role === 'host' && Net.room) {
    return `<div class="panel center wide">
      <h2>SALA <span class="code">${esc(Net.room)}</span></h2>
      <p class="muted">Passe o código para até 6 amigos. Cada um assume um tripulante; os lugares vazios ficam com bots.</p>
      <div class="seats">${ROLES.map(r => { const p = Object.values(Net.players).find(x => x.role === r.id); return `<div class="seat ${p ? 'human' : ''}"><b>${r.name}</b><span>${p ? '🎮 ' + esc(p.name) : '🤖 Bot'}</span></div>`; }).join('')}</div>
      <div class="cards two">
        <button class="card" data-ui="startGame" data-arg="completa"><h3>🚀 Jornada Completa</h3></button>
        <button class="card" data-ui="startGame" data-arg="curta"><h3>⚡ Jornada Curta</h3></button>
      </div>
      <div class="row"><button class="btn" data-ui="netLeave">◀ Fechar sala</button></div>
    </div>`;
  }
  if (Net.role === 'client') {
    return `<div class="panel center"><h2>CONECTADO</h2><p>Sala <span class="code">${esc(Net.room || '')}</span>. Você será: <b>${esc(Net.myRoleName || '...')}</b>.</p><p class="muted">Aguardando o Comandante iniciar a jornada e montar a nave...</p><div class="row"><button class="btn" data-ui="netLeave">◀ Sair</button></div></div>`;
  }
  return `<div class="panel center">
    <h2>MULTIPLAYER</h2>
    <p class="muted">Até 6 jogadores na tripulação + o Comandante (quem cria a sala). Requer o servidor: <code>node server/server.js</code>.</p>
    <label class="field">Servidor <input id="net-url" value="${esc(L.url || def)}"></label>
    <div class="row"><button class="btn primary" data-ui="netHost">Criar sala (Comandante)</button></div>
    <label class="field">Código da sala <input id="net-code" maxlength="5" value="${esc(L.code || '')}" style="text-transform:uppercase"></label>
    <div class="row"><button class="btn" data-ui="netJoin">Entrar como tripulante</button></div>
    <p class="err">${esc(L.err || '')}</p>
    <div class="row"><button class="btn" data-ui="title">◀ Voltar</button></div>
  </div>`;
}

// =============== CENAS DA PARTIDA ===============
function introScreen() {
  const i = U.introIdx, t = NARRATION_INTRO[i] || '';
  const shown = t.slice(0, Math.floor(U.introT * 45));
  return `<div class="intro"><div class="narr"><p>${esc(shown)}<span class="caret">▌</span></p></div>
    <div class="row bottom"><button class="btn" data-ui="introSkip">Pular ⏭</button><button class="btn primary" data-ui="introNext">${i < NARRATION_INTRO.length - 1 ? 'Próximo ▶' : 'Começar ▶'}</button></div></div>`;
}
function earthScreen() {
  const E = U.earth; const left = Math.max(0, Math.ceil(E.limit - E.t));
  if (U.comms) return commsScreen();
  return `<div class="earth-hud">
    <div class="tbox tl small"><b>TERRA · 2091</b><br>Qualidade do ar: <span class="red">péssima (IQA 312)</span><br>Temperatura: <span class="orange">46 °C</span><br>Água: racionamento nível 4</div>
    <div class="tbox tr small">Explore a cidade.<br>Comunicado em <b>${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</b></div>
    <div class="hint">← → / A D para andar ${E.t > 15 ? '· <button class="btn small" data-ui="earthSkip">Pular ⏭</button>' : ''}</div>
  </div>`;
}
function commsScreen() {
  if (U.comms === 1) return `<div class="modal-bg"><div class="panel center comm"><div class="blink red">● TRANSMISSÃO PRIORITÁRIA</div><h2>COMUNICADO</h2><p class="big">Você foi selecionado para uma missão espacial para salvar o futuro da humanidade.</p><div class="row"><button class="btn primary" data-ui="comms2">Continuar ▶</button></div></div></div>`;
  return `<div class="modal-bg"><div class="panel center comm wide"><div class="blink red">● PRÓXIMO COMUNICADO</div>
    <p>Você tem uma <b>verba limitada (${setupBudget()} pontos)</b> e <b>5 espaços de módulo</b> para montar uma nave de exploração. Não é possível comprar tudo: cada escolha é um sacrifício. Pontos não gastos viram um <b>fundo de contingência</b>.</p>
    <p class="muted">A nave precisa cuidar de: sanidade dos 6 tripulantes, plantações e estoque de alimentos, medicamentos e recursos clínicos, combustível, água, oxigênio, descarte de lixo e reciclagem, comunicação e equipamentos científicos.</p>
    <div class="seats">${ROLES.map(r => `<div class="seat"><b>${r.name}</b></div>`).join('')}</div>
    <div class="row"><button class="btn primary" data-ui="toSetup">Montar a nave ▶</button></div></div></div>`;
}

// ---------- montagem ----------
function setupScreen() {
  const st = S.setup; const step = SETUP_STEPS[U.setupStep];
  const spent = setupCost(st), budget = setupBudget(), slots = setupSlots(st);
  const left = budget - spent;
  const item = (it, list, extra = '') => {
    const on = st[list].includes(it.id);
    const locked = it.req && !st[list].includes(it.req);
    const slotFull = list === 'modules' && !on && slots + it.slots > SLOTS;
    const cant = !on && (it.pts > left || locked || slotFull);
    return `<button class="opt ${on ? 'on' : ''} ${cant ? 'cant' : ''}" data-ui="setToggle" data-arg="${list}:${it.id}"><b>${esc(it.name)}</b><span>${esc(it.desc)}</span><em>${it.pts} pts${it.slots ? ' · ' + it.slots + ' slot' + (it.slots > 1 ? 's' : '') : ''}${locked ? ' · requer anterior' : ''}${extra}</em></button>`;
  };
  let body = '';
  switch (step.id) {
    case 'origin': body = `<p class="muted">Escolha uma origem gratuita para o Comandante.</p><div class="opts">${ORIGINS.map(o => `<button class="opt ${st.origin === o.id ? 'on' : ''}" data-ui="setOrigin" data-arg="${o.id}"><b>${o.name}</b><span>${o.bonus}</span><em>grátis</em></button>`).join('')}</div>`; break;
    case 'skills': body = `<p class="muted">Sem teto: você pode gastar todos os pontos só no líder — mas ficará com uma nave básica.</p><div class="opts">${SKILLS.map(s => item(s, 'skills')).join('')}</div>`; break;
    case 'route': body = `<div class="opts">${ROUTES.map(r => `<button class="opt ${st.route === r.id ? 'on' : ''}" data-ui="setRoute" data-arg="${r.id}"><b>${r.name}</b><span>${r.desc}</span><em>${r.cost} · sem custo</em></button>`).join('')}</div>`; break;
    case 'modules': {
      const cats = [...new Set(MODULES.map(m => m.cat))];
      body = `<p class="muted">5 slots no total; o reator de fusão ocupa 2. Sinergias: Estufa+Reciclador de água · Reciclador de lixo+Oficina 3D · Laboratório+Sonda · Radar+Copiloto IA · Enfermaria+Hibernação.</p>` + cats.map(c => `<h4>${c}</h4><div class="opts">${MODULES.filter(m => m.cat === c).map(m => item(m, 'modules')).join('')}</div>`).join('');
      break;
    }
    case 'upgrades': body = `<div class="opts">${UPGRADES.map(u => item(u, 'upgrades', ' · ' + SYSTEMS[u.sys].name)).join('')}</div>`; break;
    case 'reserves': body = `<div class="opts">${RESERVES.map(r => item(r, 'reserves')).join('')}</div>`; break;
    case 'training': body = `<div class="opts">${TRAINING.map(r => item(r, 'training')).join('')}</div>`; break;
    case 'gadgets': body = `<div class="opts">${GADGETS.map(r => item(r, 'gadgets')).join('')}</div>`; break;
    case 'pantry': body = `<p class="muted">A nave já sai com 60 kg de ração liofilizada (≈ 14 dias para 7 pessoas a 0,6 kg/dia).</p><div class="opts">${PANTRY.map(r => item(r, 'pantry')).join('')}</div>`; break;
    case 'fund': body = `<div class="fund"><div class="bignum">${left}</div><p>pontos sobrando viram <b>fundo de contingência</b> para emergências na viagem: peça de reposição (2), tratamento médico urgente (3), baterias de emergência (2) ou oxigênio (2).</p><p class="muted">O dilema: gastar tudo para sair forte ou guardar pontos para se adaptar.</p></div>`; break;
    case 'report': body = `<div class="report-list">${readinessAlerts().map(a => `<div class="alert ${a[0]}">${esc(a[1])}</div>`).join('')}</div><div class="row"><button class="btn primary big" data-ui="launch">🚀 DECOLAR</button></div>`; break;
  }
  return `<div class="setup">
    <div class="setup-side">
      <h3>MONTAGEM</h3>
      <div class="budget"><div>Verba <b class="${left < 0 ? 'red' : ''}">${left}</b> / ${budget}</div><div>Slots <b>${slots}</b> / ${SLOTS}</div></div>
      <ol class="steps">${SETUP_STEPS.map((s, i) => `<li class="${i === U.setupStep ? 'on' : ''} ${i < U.setupStep ? 'done' : ''}" data-ui="setStep" data-arg="${i}">${s.title}</li>`).join('')}</ol>
      <div class="muted small">Jornada ${S.journey === 'curta' ? 'Curta' : 'Completa'}</div>
    </div>
    <div class="setup-main scroll">
      <h2>${U.setupStep + 1}. ${step.title}</h2>
      ${body}
    </div>
    <div class="setup-nav">${U.setupStep > 0 ? '<button class="btn" data-ui="setPrev">◀ Voltar</button>' : '<span></span>'}${U.setupStep < SETUP_STEPS.length - 1 ? '<button class="btn primary" data-ui="setNext">Próximo ▶</button>' : ''}</div>
  </div>`;
}
function readinessAlerts() {
  const st = S.setup; const h = id => st.modules.includes(id) || st.upgrades.includes(id) || st.reserves.includes(id) || st.skills.includes(id) || st.pantry.includes(id) || st.gadgets.includes(id) || st.training.includes(id);
  const a = [];
  const days = Math.round((S.journey === 'curta' ? 12 : 30) * ROUTES.find(r => r.id === st.route).days);
  const food = 60 + (h('racaoExtra') ? 30 : 0);
  if (!h('filtroReserva')) a.push(['bad', 'Sem filtro de ar reserva: risco alto em falhas do Suporte à Vida.']);
  if (!h('enfermaria')) a.push(['bad', 'Sem enfermaria: feridos graves podem morrer.']);
  if (st.route === 'rapida' && !h('tanqueExtra')) a.push(['warn', 'Combustível justo para a rota rápida.']);
  if (h('fusao')) a.push(['warn', 'Reator instalado: energia sobrando, mas atenção ao calor.']);
  const skillPts = st.skills.reduce((s, id) => s + SKILLS.find(x => x.id === id).pts, 0);
  if (skillPts >= 12 && st.modules.length <= 1) a.push(['bad', 'Líder excelente, nave frágil: qualquer falha grave pode ser fatal.']);
  if (!['estufa', 'reciclaAgua', 'biorreator', 'reciclaLixo', 'hibernacao'].some(h)) a.push(['bad', 'Nenhum módulo de sobrevivência: risco crítico de fome e sede.']);
  if (food / 4.2 < days && !h('estufa') && !h('biorreator')) a.push(['bad', `Comida para ≈ ${Math.floor(food / 4.2)} dias numa viagem de ≈ ${days} dias. Será preciso racionar ou trocar.`]);
  if (h('sangue')) a.push(['good', 'Comandante com Sangue-frio: uma segunda chance por fase.']);
  if (h('solar') && !h('casco1')) a.push(['warn', 'Painéis solares sem blindagem: asteroides podem danificá-los.']);
  if (h('escudoMag') && h('biorreator')) a.push(['warn', 'Escudo magnético + Biorreator: os dois gastam energia constante e podem deixar a nave no vermelho.']);
  if (h('estufa') && h('reciclaAgua')) a.push(['good', 'Sinergia: Estufa + Reciclador de água — ciclo fechado.']);
  if (h('reciclaLixo') && h('impressora')) a.push(['good', 'Sinergia: lixo vira peças de reparo.']);
  if (h('lab') && h('sonda')) a.push(['good', 'Sinergia: Laboratório + Sonda dobram os dados.']);
  if (h('radar') && h('ia')) a.push(['good', 'Sinergia: Radar + Copiloto de IA — pistas ainda mais claras.']);
  if (h('enfermaria') && h('hibernacao')) a.push(['good', 'Sinergia: feridos se recuperam bem mais rápido.']);
  if (!h('sonda') && !h('pouso')) a.push(['warn', 'Sem sonda nem nave de pouso: investigar Pontes-01 vai arriscar a nave principal.']);
  const left = setupBudget() - setupCost(st);
  if (left < 0) a.push(['bad', 'Verba estourada! Remova itens para decolar.']);
  else a.push(['info', `Fundo de contingência: ${left} ponto(s).`]);
  return a;
}

// ---------- HUD da nave ----------
function hudTop() {
  const r = S.res, c = S.cap;
  const items = RES_META.map(m => {
    const v = r[m.id], cap = m.id === 'lixo' ? 30 : c[m.id];
    return `<div class="rb" title="${m.name}: ${fmt(v)} ${m.unit}"><span class="ic">${m.icon}</span>${bar(v, cap, '', m.inverse)}<span class="v">${fmt(v, v < 10 ? 1 : 0)}<small>${m.unit}</small></span></div>`;
  });
  const mo = moralIndex(), ef = effIndex();
  items.push(`<div class="rb" title="Moral (média do humor + bônus)"><span class="ic">☺</span>${bar(mo, 100)}<span class="v">${fmt(mo, 0)}<small>pts</small></span></div>`);
  items.push(`<div class="rb" title="Eficiência da tripulação"><span class="ic">⚙</span>${bar(ef, 100)}<span class="v">${fmt(ef, 0)}<small>%</small></span></div>`);
  const hh = Math.floor(S.dayT / S.dayLen * 24), mm = Math.floor((S.dayT / S.dayLen * 24 * 60) % 60);
  const stageNames = ['Preparação', 'Partida e viagem', 'Exploração científica', 'O novo mundo', 'Migração'];
  return `<div class="hud-top"><div class="bars">${items.join('')}</div><div class="clock"><b>DIA ${S.day}</b> ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}<br><small>${stageNames[Math.min(S.stage, 4)]}</small>${S.commDown > 0 ? '<br><small class="red">📡 sem comunicação</small>' : ''}${S.cylinders ? '<br><small class="orange">🫁 cilindros de O₂</small>' : ''}</div></div>`;
}
function hudBottom() {
  const m = me(); const near = m && m.alive ? stationNear(m) : null;
  let prompt = '';
  const ev = S.event;
  if (near) {
    const step = ev && ev.phase === 'run' ? ev.steps.find(s => !s.done && s.station === near && (s === curStep(ev) || s.optional)) : null;
    prompt = step ? `<b>E</b> — ${esc(step.label)}` : `<b>E</b> — ${STATIONS[near].name}`;
  }
  if (ev && ev.type === 'lixo' && ev.phase === 'run' && m && S.trash.some(t => t.deck === m.deck && Math.abs(t.x - m.x) < 16)) prompt = '<b>E</b> — recolher lixo';
  if (m && m.task) prompt = `⏳ ${esc(m.task.label)} — fique na estação`;
  const p = S.progress;
  return `<div class="hud-bottom">
    <div class="track"><span class="lbl">TERRA</span><div class="line"><i style="width:${p * 100}%"></i><em class="mk st" style="left:50%">◆</em><em class="ship" style="left:${p * 100}%">▶</em></div><span class="lbl cyan">PONTES-01</span></div>
    <div class="prompt">${prompt}</div>
    <div class="btns"><button class="btn small" data-ui="panel" data-arg="report">[R] Relatório</button><button class="btn small" data-ui="panel" data-arg="crew">[T] Tripulação</button><button class="btn small" data-ui="panel" data-arg="fund">[F] Fundo ${S.fund}</button><button class="btn small" data-ui="panel" data-arg="menu">☰</button></div>
  </div>`;
}
function tutorialBox() {
  const steps = [
    'Use ←/→ (A/D) para andar e ↑/↓ (W/S) nas escadas. Vá até a <b>Ponte de comando</b> (à direita, andar de cima) e pressione <b>E</b> no painel.',
    'Configure a navegação: escolha o <b>modo de cruzeiro</b>.',
    'Pressione <b>R</b> para abrir o relatório de recursos (busca aprofundada).',
    'Visite a <b>Cozinha e mesa</b> (andar de baixo) e defina o cardápio do dia.',
  ];
  if (S.tutorial >= steps.length || Net.role === 'client') return '';
  return `<div class="tut"><b>OBJETIVO</b> ${steps[S.tutorial]}</div>`;
}

// ---------- painel de evento ----------
function eventPanel() {
  const ev = S.event; if (!ev) return '';
  const info = EVENT_INFO[ev.type];
  if (ev.phase === 'warn') {
    return `<div class="evp warn"><div class="blink red">⚠ ALERTA DE DESAFIO</div><h2>${info.icon} ${info.title}</h2><p>${info.desc}</p>
      <h4>Partes da nave envolvidas</h4>${info.systems.map(s => `<div class="sysline"><span>${SYSTEMS[s].name}</span><em class="dmg ${SYSTEMS[s].dmg}">Dano ${SYSTEMS[s].dmg}</em>${bar(sysHp(s), 100)}<b>${fmt(sysHp(s), 0)}%</b></div>`).join('')}
      ${info.energy ? `<div class="sysline"><span>Energia</span><em class="dmg Médio">reserva</em>${bar(S.res.energia, S.cap.energia)}<b>${fmt(S.res.energia, 0)} kWh</b></div>` : ''}
      ${has('radar') ? '<p class="cyan small">📡 Radar de longo alcance: aviso antecipado recebido.</p>' : ''}
      <div class="row"><button class="btn primary" data-act="eventGo">Enfrentar agora (${Math.ceil(ev.warnT)} s)</button></div></div>`;
  }
  if (ev.phase === 'result') {
    const r = ev.result;
    return `<div class="evp result ${r.ok ? 'ok' : 'bad'}"><h2>${info.icon} ${info.title}</h2><h3 class="${r.ok ? 'green' : 'red'}">${r.grade || (r.ok ? 'SUCESSO' : 'FALHA')}</h3><p>${esc(r.text)}</p>
      ${ev.type === 'termico' && ev.data.report ? `<div class="kv"><span>Energia gasta</span><b>${fmt(ev.data.report.kwh)} kWh</b><span>Combustível</span><b>${fmt(ev.data.report.fuel, 0)} kg</b><span>Plantação perdida</span><b>${fmt(ev.data.report.plants, 0)} kg</b><span>Falhas</span><b>${ev.data.report.fails}</b></div><p class="quote small">Na Terra, a atmosfera regula a temperatura de graça. Numa nave, tudo isso tem custo.</p>` : ''}
      <p class="cyan">+${r.points} pontos</p><div class="row"><button class="btn primary" data-act="eventClose">Continuar ▶</button></div></div>`;
  }
  if (ev.type === 'termico') return thermalPanel();
  const pct = clamp(ev.t / ev.dur, 0, 1);
  const cs = curStep(ev);
  const steps = ev.steps.map(s => {
    const st = s.station ? STATIONS[s.station].name : '';
    const active = !s.done && (s === cs || s.optional);
    let btns = '';
    if (active && s.station) {
      btns = `<button class="btn tiny" data-ui="goto" data-arg="${s.station}">Ir até lá</button>`;
      if (s.role || s.optional) { const rn = s.role === 'engenheiro' ? 'engenheiro' : (ROLES.find(r => r.id === s.role) || {}).short || 'tripulante'; btns += `<button class="btn tiny" data-act="callRole" data-p='${J({ step: s.id, role: s.role || 'engenheiro' })}'>Chamar ${esc(rn)}</button>`; }
      if (s.claimed) { const c = crewById(s.claimed); btns = `<em class="small">${esc(c ? c.name : '')} a caminho…</em>`; }
    }
    return `<li class="${s.done ? 'done' : active ? 'cur' : ''}">${s.done ? '✔' : active ? '▶' : '·'} ${esc(s.label)}${s.optional ? ' <small>(opcional)</small>' : ''}${st ? `<small class="st">📍 ${st}</small>` : ''}<div>${btns}</div></li>`;
  }).join('');
  let extra = '';
  if (ev.type === 'tempestade') extra = `<div class="row"><button class="btn primary" data-act="shelter">Ordenar abrigo a todos</button></div><p class="small">${ev.data.storm ? 'A tempestade está passando...' : 'A tempestade chega em ' + Math.max(0, Math.ceil(ev.t - ev.data.stormAt)) + ' s.'}</p>`;
  if (ev.type === 'lixo') extra = '<p class="small">Ande pela nave e pressione <b>E</b> perto do lixo flutuante para recolher.</p>';
  if (ev.type === 'traje' && ev.data.victim) extra = `<p class="small red">${esc(crewById(ev.data.victim).name)} está do lado de fora com o traje vazando!</p>`;
  if (ev.type === 'doenca' && ev.data.victim) extra = `<p class="small">Doente: <b>${esc(crewById(ev.data.victim).name)}</b>. Remédios ${S.day > S.meds.validUntil ? '<span class="red">VENCIDOS</span>' : 'válidos até o dia ' + S.meds.validUntil}.</p>`;
  return `<div class="evp run"><h2>${info.icon} ${info.title}</h2>
    <div class="timer">${bar(ev.t, ev.dur, 'time')}<b>${Math.ceil(ev.t)} s</b></div>
    <ol class="evsteps">${steps}</ol>${extra}
    ${ev.puzzle ? puzzleHTML(ev) : ''}
    <div class="evlog">${S.log.slice(-4).map(l => `<div class="${l.kind}">${esc(l.text)}</div>`).join('')}</div></div>`;
}

function puzzleHTML(ev) {
  const pz = ev.puzzle;
  if (pz.kind === 'filtros') {
    return `<div class="puzzle"><h4>Filtros de ar (CDRA)</h4><p class="small">Inspecione os filtros (custa tempo) e troque o entupido pelo reserva.</p><div class="filters">${Array.from({ length: pz.n }, (_, i) => {
      const seen = pz.seen.includes(i); const bad = seen && i === pz.bad;
      return `<div class="filter ${seen ? (bad ? 'bad' : 'ok') : ''}"><span>F${i + 1}</span><em>${seen ? (bad ? 'ENTUPIDO' : 'limpo') : '?'}</em><button class="btn tiny" data-act="puzzle" data-p='${J({ op: 'inspect', i })}' ${seen ? 'disabled' : ''}>Inspecionar</button><button class="btn tiny" data-act="puzzle" data-p='${J({ op: 'swap', i })}'>Trocar</button></div>`;
    }).join('')}</div></div>`;
  }
  if (pz.kind === 'mapa') {
    return `<div class="puzzle"><h4>Recalibrar mapa estelar</h4><p class="small">Gire os setores até todas as setas apontarem para cima ↑ (para a estrela-guia).</p><div class="map3">${pz.tiles.map((t, i) => `<button class="tile" data-act="puzzle" data-p='${J({ i })}' style="transform:rotate(${t * 90}deg)">↑</button>`).join('')}</div></div>`;
  }
  if (pz.kind === 'radio') {
    const msg = RADIO_MESSAGES[pz.msgIdx];
    const fixed = ev.data.fixed || has('antena');
    const dist = Math.abs(pz.freq - pz.target);
    const q = clamp(1 - dist / (fixed ? 40 : 28), 0, 1);
    let s = pz.seed;
    const shown = [...msg.full].map(ch => { s = (s * 9301 + 49297) % 233280; return (ch === ' ' || s / 233280 < q) ? ch : (s % 3 ? '█' : '~'); }).join('');
    return `<div class="puzzle"><h4>Rádio — ${fmt(100 + pz.freq * 0.5, 1)} MHz</h4><div class="signal">${bar(q, 1)}<b>${q > 0.85 ? 'sinal limpo' : q > 0.4 ? 'chiado' : 'só ruído'}</b></div>
      <div class="radiomsg">${esc(shown)}</div>
      <div class="row"><button class="btn tiny" data-act="puzzle" data-p='${J({ op: 'tune', d: -10 })}'>◀◀</button><button class="btn tiny" data-act="puzzle" data-p='${J({ op: 'tune', d: -1 })}'>◀</button><button class="btn tiny" data-act="puzzle" data-p='${J({ op: 'tune', d: 1 })}'>▶</button><button class="btn tiny" data-act="puzzle" data-p='${J({ op: 'tune', d: 10 })}'>▶▶</button></div>
      ${q < 0.5 ? '<p class="small muted">Sintonize melhor para entender a mensagem.</p>' : `<p class="small">O que a base está tentando avisar?</p><div class="opts1">${shuffleStable(msg.options, pz.seed).map(o => `<button class="btn tiny" data-act="puzzle" data-p='${J({ op: 'answer', answer: o })}'>${esc(o)}</button>`).join('')}</div>`}</div>`;
  }
  if (pz.kind === 'agua') {
    return `<div class="puzzle"><h4>Ciclo fechado de descontaminação</h4><p class="small">Clique nas etapas na ordem correta.</p><div class="row">${pz.options.map(o => `<button class="btn tiny ${pz.order.includes(o) ? 'on' : ''}" data-act="puzzle" data-p='${J({ stage: o })}' ${pz.order.includes(o) ? 'disabled' : ''}>${o}</button>`).join('')}</div><p>Sequência: ${pz.order.map((o, i) => `${i + 1}. ${o}`).join(' → ') || '—'}</p></div>`;
  }
  if (pz.kind === 'remedio') {
    const expired = S.day > S.meds.validUntil;
    return `<div class="puzzle"><h4>Aparelhos médicos</h4><div class="devs">${MED_DEVICES.map(d => `<button class="btn tiny" data-act="puzzle" data-p='${J({ op: 'device', dev: d.id })}'>${d.name}</button>${pz.seen[d.id] ? `<span class="reading">${esc(pz.seen[d.id])}</span>` : ''}`).join('')}</div>
      ${expired ? `<p class="red small">Estoque vencido! <button class="btn tiny" data-act="puzzle" data-p='${J({ op: 'replace' })}'>Trocar lote (2 recursos)</button></p>` : ''}
      <h4>Kit de remédios</h4><div class="row">${MEDICINES.map(m => `<button class="btn tiny" data-act="puzzle" data-p='${J({ op: 'give', med: m.id })}'>${m.name}</button>`).join('')}</div>
      <p class="small muted">Referência: febre e ruído no pulmão → infecção; SpO₂ baixo → hipóxia; pressão alta e dor de cabeça → fluidos na cabeça; náusea → enjoo espacial; coceira e chiado → alergia.</p></div>`;
  }
  if (pz.kind === 'substituto') {
    const v = S.event.data.victim;
    return `<div class="puzzle"><h4>Quem vai substituir?</h4><div class="opts1">${S.crew.filter(c => c.alive && c.id !== v && !c.hibernating).map(c => `<button class="btn tiny" data-act="puzzle" data-p='${J({ id: c.id })}' ${available(c) || c.id === 'cmd' ? '' : 'disabled'}>${esc(c.roleName)} ${esc(c.name)}${roleMatches(c, 'engenheiro') ? ' ★' : ''}</button>`).join('')}</div><p class="small muted">★ engenheiro: termina o reparo com segurança.</p></div>`;
  }
  if (pz.kind === 'rota') {
    return `<div class="puzzle"><h4>Rotas calculadas pela Terra</h4><div class="opts1">
      <button class="btn tiny" data-act="puzzle" data-p='${J({ opt: 'gravidade' })}'>Assistência gravitacional: −15% de combustível, +2 dias</button>
      <button class="btn tiny" data-act="puzzle" data-p='${J({ opt: 'economico' })}'>Cruzeiro econômico: −30% de combustível, mais lento</button>
      <button class="btn tiny" data-act="puzzle" data-p='${J({ opt: 'manter' })}'>Manter a rota atual (moral −3)</button></div></div>`;
  }
  if (pz.kind === 'pilot') return `<div class="puzzle"><h4>Pilotagem</h4><p>Use ↑/↓ (W/S) para desviar. ${Math.ceil(pz.t)} s · impactos: ${pz.hits}</p><div class="row"><button class="btn" data-ui="pilot" data-arg="-1">▲</button><button class="btn" data-ui="pilot" data-arg="1">▼</button></div></div>`;
  return '';
}
function shuffleStable(arr, seed) { const a = arr.slice(); let s = seed; for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function thermalPanel() {
  const th = S.thermal; if (!th) return '';
  const tcol = th.T > 26 ? 'red' : th.T < 18 ? 'cyan' : 'green';
  const scene = ['Alerta de calor', 'Alerta de calor', 'A estrela se aproxima', 'Rasgo no isolamento', 'Sobrecarga elétrica', 'Entrada na sombra'][th.scene] || '';
  const res = [['energia', 'kWh'], ['combustivel', 'kg'], ['escudo', 'mm'], ['plantacao', 'kg'], ['dados', 'GB'], ['agua', 'L'], ['oxigenio', 'kg']];
  const thermo = (label, v, min, max, cls) => `<div class="thermo"><div class="tube"><i class="${cls}" style="height:${clamp((v - min) / (max - min), 0, 1) * 100}%"></i></div><b>${fmt(v, 0)}°</b><small>${label}</small></div>`;
  const acts = Object.keys(TH_ACTIONS).map(k => {
    const a = TH_ACTIONS[k]; const h = thHint(k);
    const dis = th.disabled[k];
    const active = th.act[k] > 0 || (k === 'rep' && th.repaired) || (k === 'equip' && th.equipOff);
    const hintTxt = h.level === 'ok' ? 'confiante' : h.level === 'warn' ? 'alerta leve' : 'problema!';
    const ded = byRole(a.role).some(available);
    return `<div class="tact ${active ? 'active' : ''} ${dis ? 'dis' : ''}">
      <div class="th-h"><b>${a.name}</b><span class="light ${h.level}" title="${hintTxt}"></span>${h.band ? `<em class="band">chance ${h.band}</em>` : ''}</div>
      <small>${k === 'equip' && th.equipOff ? 'Religar: rolagem necessária' : a.cost()}${active && th.act[k] > 0 ? ` · ativo ${Math.ceil(th.act[k])}s` : ''}${k === 'shut' && th.shutMode ? ' · ' + th.shutMode : ''}</small>
      <div class="row">${k === 'shut' ? `<button class="btn tiny" data-act="thAct" data-p='${J({ k, mode: 'abrir' })}' ${dis ? 'disabled' : ''}>Abrir</button><button class="btn tiny" data-act="thAct" data-p='${J({ k, mode: 'fechar' })}' ${dis ? 'disabled' : ''}>Fechar</button>`
        : `<button class="btn tiny" data-act="thAct" data-p='${J({ k })}' ${dis || (k === 'rep' && (!th.rip || th.repaired)) ? 'disabled' : ''}>${k === 'equip' ? (th.equipOff ? 'Religar' : 'Desligar') : k === 'rep' ? 'Reparar' : 'Ativar'}</button>
           <button class="btn tiny ghost" data-act="thAct" data-p='${J({ k, dedic: true })}' ${dis || !ded || (k === 'rep' && (!th.rip || th.repaired)) ? 'disabled' : ''} title="Tripulante certo dedicado: +2">+ dedicado</button>`}
        <button class="btn tiny ghost" data-act="thMaint" data-p='${J({ k })}' ${th.maint[k] ? 'disabled' : ''} title="Gasta 1 min do tripulante: +1">${th.maint[k] ? '✔ manut.' : 'manutenção'}</button>
        ${th.olhar ? `<button class="btn tiny ghost" data-act="thOlhar" data-p='${J({ k })}' title="Olhar estratégico">👁</button>` : ''}
      </div></div>`;
  }).join('');
  return `<div class="evp thermal">
    <h2>🌡 Regulação Térmica <small>${scene}</small></h2>
    <div class="timer">${bar(S.event.t, th.D, 'time')}<b>${Math.floor(S.event.t / 60)}:${String(Math.floor(S.event.t % 60)).padStart(2, '0')}</b></div>
    <div class="thermos">${thermo('Sol', th.sun, -160, 130, 'hot')}${thermo('Sombra', th.shade, -160, 130, 'cold')}<div class="thermo main"><div class="tube"><i class="${tcol}" style="height:${clamp((th.T - 0) / 50, 0, 1) * 100}%"></i><span class="band-safe"></span></div><b class="${tcol}">${fmt(th.T, 1)}°</b><small>Interior</small></div>
      <div class="thres">${res.map(([k, u]) => `<div><span>${RES_META.find(m => m.id === k).name}</span>${bar(S.res[k], S.cap[k])}<b>${fmt(S.res[k], 1)} ${u}</b></div>`).join('')}<div><span>Moral</span>${bar(moralIndex(), 100)}<b>${fmt(moralIndex(), 0)} pts</b></div></div></div>
    <p class="small">Meta: manter o interior entre <b>18 °C e 26 °C</b>. ${th.rip && !th.repaired ? '<span class="red">Rasgo no isolamento aberto!</span>' : ''} ${th.equipOff ? '<span class="orange">Equipamentos desligados (sem pesquisa).</span>' : ''}</p>
    ${th.pendingReroll ? `<div class="reroll"><b>${TH_ACTIONS[th.pendingReroll.k].name} falhou!</b> Usar Sangue-frio? <button class="btn tiny primary" data-act="thReroll">Rolar de novo</button><button class="btn tiny" data-act="thAcceptFail">Aceitar</button></div>` : ''}
    <div class="tacts">${acts}</div>
    <div class="evlog">${th.msgs.slice(-5).map(m => `<div>${esc(m)}</div>`).join('')}</div>
  </div>`;
}

// ---------- painéis das estações ----------
function repairRow(sys) {
  const hp = sysHp(sys);
  return `<div class="sysline"><span>${SYSTEMS[sys].name}</span><em class="dmg ${SYSTEMS[sys].dmg}">Dano ${SYSTEMS[sys].dmg}</em>${bar(hp, 100)}<b>${fmt(hp, 0)}%</b>
    ${hp < 100 ? `<button class="btn tiny" data-act="repair" data-p='${J({ sys })}'>Reparar</button><button class="btn tiny" data-act="repair" data-p='${J({ sys, call: true })}'>Chamar eng.</button>` : ''}</div>`;
}
function stationPanel(id) {
  const st = STATIONS[id]; let body = '';
  const peç = `<p class="small muted">Reparo: usa 1 peça sobressalente (você tem ${S.peças}) ou 5 kWh.</p>`;
  switch (id) {
    case 'ponte': {
      const cr = cruiseObj();
      const daysLeft = (1 - S.progress) * S.totalDays / (cr.speed * S.speedMod);
      body = `<h4>Navegação</h4><div class="opts">${[['economico', 'Econômico', '−30% combustível · 15% mais lento'], ['normal', 'Normal', 'equilíbrio'], ['acelerado', 'Acelerado', '+50% combustível · 20% mais rápido']].map(([k, n, d]) => `<button class="opt ${S.cruise === k ? 'on' : ''}" data-act="cruise" data-p='${J({ mode: k })}'><b>${n}</b><span>${d}</span></button>`).join('')}</div>
        <div class="kv"><span>Progresso</span><b>${fmt(S.progress * 100, 0)}%</b><span>Dias restantes (estim.)</span><b>${fmt(daysLeft, 1)}</b><span>Rota</span><b>${routeObj().name}</b><span>Combustível</span><b>${fmt(S.res.combustivel, 0)} kg</b></div>
        ${has('radar') ? `<h4>Radar de longo alcance</h4><p>${S.schedule[0] ? `Próximo evento previsto: <b>${EVENT_INFO[S.schedule[0].type].title}</b> no dia ${Math.ceil(S.schedule[0].day)}.` : 'Nenhum evento detectado.'}</p>` : ''}`;
      break;
    }
    case 'motor': body = repairRow('propulsao') + `<p class="small">Consumo de cruzeiro: ${fmt(8 * routeObj().fuel * cruiseObj().fuel, 1)} kg/dia${sysHp('propulsao') < 50 ? ' <span class="red">(+30% por dano)</span>' : ''}.</p>` + peç; break;
    case 'antena': body = repairRow('comunicacao') + `<h4>Mensagens da Terra</h4><div class="evlog">${S.log.filter(l => l.kind === 'earth' || l.kind === 'ai').slice(-5).map(l => `<div>${esc(l.text)}</div>`).join('') || '<div class="muted">Sem mensagens recentes.</div>'}</div>` + peç; break;
    case 'lab': body = `<div class="kv"><span>Dados coletados</span><b>${fmt(S.res.dados, 0)} GB</b><span>Laboratório</span><b>${has('lab') ? 'instalado' : 'básico'}</b></div>
      <label class="check"><input type="checkbox" data-actcheck="research" ${S.researchOn ? 'checked' : ''}> Pesquisa ligada (gasta energia, gera dados)</label>`; break;
    case 'enfermaria': body = `<div class="kv"><span>Recursos médicos</span><b>${fmt(S.res.medicos, 0)}</b><span>Remédios válidos até</span><b class="${S.day > S.meds.validUntil ? 'red' : ''}">dia ${S.meds.validUntil}${S.day > S.meds.validUntil ? ' (VENCIDOS)' : ''}</b></div>
      <div class="row"><button class="btn small" data-act="replaceMeds">Trocar lote de remédios (2 recursos)</button></div>
      <h4>Tripulação</h4>${S.crew.map(c => `<div class="sysline"><span>${esc(c.roleName)} ${esc(c.name)}</span><em>${!c.alive ? '☠' : c.sickness ? 'doente' : c.status}</em>${c.alive && (c.status !== 'ok' || c.sickness) ? `<button class="btn tiny" data-act="treat" data-p='${J({ id: c.id })}'>Tratar</button>` : ''}</div>`).join('')}
      <p class="small muted">Aparelhos: kit de primeiros socorros, termômetro, oxímetro, medidor de pressão, máscara e tanque de O₂, scanner médico, estetoscópio, kit de remédios e maca.</p>`; break;
    case 'avionica': body = Object.keys(SYSTEMS).map(repairRow).join('') + peç; break;
    case 'termico': body = repairRow('termico') + `<div class="kv"><span>Espessura do escudo</span><b>${fmt(S.res.escudo, 1)} mm</b></div><p class="small">No espaço o calor só sai por radiação. O cobertor multicamadas (MLI) e os radiadores mantêm a nave entre 18 °C e 26 °C.</p>`; break;
    case 'tanqueAux': case 'bomba': body = repairRow('tanques') + `<div class="kv"><span>Combustível</span><b>${fmt(S.res.combustivel, 0)} / ${S.cap.combustivel} kg</b></div>` + peç; break;
    case 'suporte': {
      const n = alive().length;
      body = repairRow('suporte') + `<h4>Dados do suporte à vida (referência NASA/ISS)</h4><div class="kv">
        <span>Consumo de O₂</span><b>${fmt(NASA.o2PorPessoaDia * n, 2)} kg/dia (0,84 kg/pessoa)</b><span>Eletrólise (OGS)</span><b>+${fmt(NASA.ogsO2Dia * sysHp('suporte') / 100, 1)} kg/dia de O₂</b>
        <span>Reciclagem de água</span><b>${has('reciclaAgua') ? '98% (ciclo fechado)' : '70% (básico)'}</b><span>Uso de água</span><b>${fmt(NASA.aguaPorPessoaDia * n, 1)} L/dia</b>
        <span>CO₂ produzido</span><b>${fmt(NASA.co2PorPessoaDia * n, 1)} kg/dia</b></div>` + peç;
      break;
    }
    case 'lixo': body = `<div class="kv"><span>Lixo a bordo</span><b>${fmt(S.res.lixo, 1)} kg</b><span>Reciclador</span><b>${has('reciclaLixo') ? 'instalado' : 'não'}</b><span>Adubo</span><b>${fmt(S.adubo, 1)} kg</b><span>Peças</span><b>${S.peças}</b></div><p class="small">O lixo é o espelho da poluição que expulsou a humanidade da Terra. Acima de 15 kg ele tira humor da tripulação. Ejete pela Eclusa ou recicle.</p>`; break;
    case 'eclusa': body = repairRow('acoplamento') + `<div class="row"><button class="btn small" data-act="ejectTrash">Ejetar lixo (${fmt(S.res.lixo, 1)} kg)</button></div>`; break;
    case 'dormitorio': body = `<p>Descansar recupera humor. ${shopBonus().moral ? 'Itens de lazer da loja dão bônus.' : ''}</p><div class="row"><button class="btn small" data-act="rest">Descansar (eu)</button></div>
      <h4>Mandar descansar</h4>${S.crew.filter(c => c.alive && c.id !== 'cmd').map(c => `<div class="sysline"><span>${esc(c.name)}</span>${bar(c.humor, 100)}<b>${fmt(c.humor, 0)}</b><button class="btn tiny" data-act="rest" data-p='${J({ id: c.id })}'>Descansar</button>${has('hibernacao') ? `<button class="btn tiny" data-act="hibernate" data-p='${J({ id: c.id })}'>${c.hibernating ? 'Acordar' : 'Hibernar'}</button>` : ''}</div>`).join('')}
      <h4>Itens de lazer</h4><p class="small">${SHOP.filter(i => Save.owns(i.id) && i.moral).map(i => i.name).join(', ') || 'Nenhum (compre na Loja da tela inicial).'}</p>`; break;
    case 'estufa': body = farmPanel(); break;
    case 'cozinha': body = kitchenPanel(); break;
  }
  return `<div class="modal-bg" data-ui="closePanel"><div class="panel station" data-stop="1"><button class="x" data-ui="closePanel">✕</button><h2>${st.name}</h2>${body}</div></div>`;
}
function farmPanel() {
  if (!S.trays.length) return '<p>Sem estufa hidropônica nem kit de ervas. Não há bandejas de cultivo a bordo.</p>';
  const sel = U.farmSel == null ? 0 : U.farmSel;
  const t = S.trays[sel];
  const grid = S.trays.map((tr, i) => `<button class="tray ${i === sel ? 'sel' : ''} ${tr.state}" data-ui="farmSel" data-arg="${i}">${tr.crop ? `<b style="color:${CROPS[tr.crop].color}">${CROPS[tr.crop].name.split(' ')[0]}</b><span>${tr.state === 'pronto' ? 'COLHER ' + Math.ceil(tr.readyT) + 's' : tr.state === 'estragado' ? 'estragou' : Math.floor(tr.g * 100) + '%'}</span>` : '<span>vazia</span>'}</button>`).join('');
  let detail = '';
  if (!t.crop) detail = `<h4>Plantar na bandeja ${sel + 1}</h4><div class="opts">${Object.entries(CROPS).map(([k, c]) => `<button class="opt" data-act="plant" data-p='${J({ i: sel, crop: k })}'><b>${c.name}</b><span>${c.days} dias · ${c.yield} kg · ${c.water} L${c.needs ? ' · requer biorreator' : ''}</span></button>`).join('')}</div>`;
  else if (t.state === 'crescendo') detail = `<h4>${CROPS[t.crop].name} — ${Math.floor(t.g * 100)}%</h4>${['luz', 'agua', 'nutr'].map(w => `<div class="sysline"><span>${{ luz: 'Luz', agua: 'Água', nutr: 'Nutrientes' }[w]}</span>${bar(t[w], 100)}<button class="btn tiny" data-act="care" data-p='${J({ i: sel, what: w })}'>+</button></div>`).join('')}<div class="row"><button class="btn tiny" data-act="sacrificeTray" data-p='${J({ i: sel })}'>Sacrificar bandeja (economiza água)</button></div>`;
  else detail = `<div class="row"><button class="btn primary" data-act="harvest" data-p='${J({ i: sel })}'>${t.state === 'pronto' ? 'Colher agora' : 'Limpar bandeja'}</button></div>`;
  return `<p class="small">Mantenha luz, água e nutrientes no verde. A janela de colheita dura 1 minuto: colher tarde estraga. Diversificar protege contra pragas. ${roleAlive('agricultor') ? 'O agricultor cuida das plantas quando pode.' : ''}</p>
    <div class="trays">${grid}</div><div class="row"><button class="btn tiny" data-act="careAll">Cuidar de todas</button></div>${detail}
    <div class="kv"><span>Plantação (biomassa)</span><b>${fmt(S.res.plantacao, 1)} kg</b><span>Adubo</span><b>${fmt(S.adubo, 1)} kg</b></div>`;
}
function kitchenPanel() {
  const fd = S.food; const tab = U.tab || 'cardapio';
  const tabs = `<div class="tabs">${[['cardapio', 'Cardápio e mesa'], ['cozinhar', 'Cozinhar'], ['despensa', 'Despensa']].map(([k, n]) => `<button class="chip ${tab === k ? 'on' : ''}" data-ui="tab" data-arg="${k}">${n}</button>`).join('')}</div>`;
  const avail = [['racao', 'Ração liofilizada']].concat(Object.keys(CROPS).filter(k => (fd.fresh[k] || 0) > 0.3).map(k => [k, CROPS[k].name + ' (fresco)'])).concat(fd.recipes.filter(r => (fd.dishes[r] || 0) > 0).map(r => [r, RECIPES.find(x => x.id === r).name + ` (${fd.dishes[r]} porções)`]));
  if (tab === 'cardapio') {
    const meals = ['Manhã', 'Tarde', 'Noite'];
    const warn = [];
    for (const c of alive()) for (const slot of fd.menu) {
      const tags = RECIPES.find(r => r.id === slot) ? RECIPES.find(r => r.id === slot).tags : CROPS[slot] ? CROPS[slot].tags : [];
      if (tags.some(t => c.allergy.includes(t))) warn.push(`${c.name} tem alergia a ${c.allergy.join(', ')}!`);
    }
    return tabs + `<h4>Refeições do dia</h4>${meals.map((m, i) => `<div class="sysline"><span>${m}</span><select data-actsel="menu" data-slot="${i}">${avail.map(([k, n]) => `<option value="${k}" ${fd.menu[i] === k ? 'selected' : ''}>${esc(n)}</option>`).join('')}${avail.find(a => a[0] === fd.menu[i]) ? '' : `<option selected value="${fd.menu[i]}">${esc(fd.menu[i])} (acabou → ração)</option>`}</select></div>`).join('')}
      ${warn.length && roleAlive('paramedico') ? `<div class="alert bad">Paramédico: ${esc([...new Set(warn)].join(' '))}</div>` : ''}
      <h4>Racionamento</h4><div class="opts">${[['pleno', 'Pleno', '0,6 kg/pessoa/dia'], ['reduzido', 'Reduzido', '0,4 kg · humor −2/dia · −1 nas rolagens'], ['minimo', 'Mínimo', '0,2 kg · humor −5/dia · −2 · risco de desmaio']].map(([k, n, d]) => `<button class="opt ${fd.racionamento === k ? 'on' : ''}" data-act="ration" data-p='${J({ level: k })}'><b>${n}</b><span>${d}</span></button>`).join('')}</div>
      <h4>A Mesa (refeição da noite)</h4><div class="opts">${[['completa', 'Mesa completa', 'todos param · humor +3 · sorteio de convivência'], ['revezamento', 'Revezamento', 'sistemas cobertos · humor +1'], ['posto', 'Comer no posto', 'sem tempo perdido · humor −1']].map(([k, n, d]) => `<button class="opt ${fd.mesa === k ? 'on' : ''}" data-act="mesa" data-p='${J({ mode: k })}'><b>${n}</b><span>${d}</span></button>`).join('')}</div>
      <h4>Gostos da tripulação</h4><div class="prefs">${alive().map(c => `<div><b>${esc(c.name)}</b> <small>${esc(c.roleName)}</small><br>❤ ${c.likes.join(', ') || '—'} ${c.avoid.length ? '· ✖ ' + c.avoid.join(', ') : ''} ${c.allergy.length ? '· <span class="red">alergia: ' + c.allergy.join(', ') + '</span>' : ''}</div>`).join('')}</div>
      ${!fd.banquete ? `<div class="row"><button class="btn small" data-act="banquete">🎉 Banquete do Dia da Terra (4 kg, uma vez)</button></div>` : ''}`;
  }
  if (tab === 'cozinhar') {
    const ings = [['racao', 'Ração', S.res.comida]].concat(Object.keys(CROPS).map(k => [k, CROPS[k].name, fd.fresh[k] || 0]));
    return tabs + `<p class="small">${has('cozinha') ? 'Cozinha equipada: fogão de indução e forno.' : 'Sem cozinha equipada: só receitas frias.'} Arraste (clique) 2 ou 3 ingredientes para a panela. Errar não pune: você só perde os ingredientes.</p>
      <div class="ings">${ings.map(([k, n, q]) => `<button class="chip ${U.cook.includes(k) ? 'on' : ''}" data-ui="cookToggle" data-arg="${k}" ${q < 1 ? 'disabled' : ''}>${n} <small>${fmt(q, 1)} kg</small></button>`).join('')}</div>
      <div class="pot">🍲 ${U.cook.map(k => k === 'racao' ? 'Ração' : CROPS[k].name).join(' + ') || 'panela vazia'}</div>
      <div class="row"><button class="btn primary" data-ui="cook" ${U.cook.length < 2 ? 'disabled' : ''}>Cozinhar (−1 kWh, −2 L)</button><button class="btn" data-ui="cookClear">Esvaziar</button></div>
      <h4>Livro de Receitas (${fd.recipes.length}/${RECIPES.length})</h4><div class="prefs">${RECIPES.map(r => fd.recipes.includes(r.id) ? `<div><b>${r.name}</b> — ${r.ing.map(i => i === 'racao' ? 'ração' : CROPS[i].name).join(' + ')} · humor +${r.humor}<br><small class="muted">${esc(r.fact)}</small></div>` : `<div class="muted">??? (receita não descoberta)</div>`).join('')}</div>`;
  }
  return tabs + `<div class="kv"><span>Ração liofilizada</span><b>${fmt(S.res.comida, 1)} kg</b>${Object.keys(CROPS).map(k => `<span>${CROPS[k].name}</span><b>${fmt(fd.fresh[k] || 0, 1)} kg</b>`).join('')}${Object.keys(fd.dishes).filter(k => fd.dishes[k] > 0).map(k => `<span>${RECIPES.find(r => r.id === k).name}</span><b>${fd.dishes[k]} porções</b>`).join('')}
    <span>Comida produzida</span><b>${fmt(fd.produced, 1)} kg</b><span>Desperdiçada</span><b>${fmt(fd.wasted, 1)} kg</b><span>Validade do fresco</span><b>${has('geladeira') ? 6 : 3} dias</b></div>`;
}

// ---------- relatório, tripulação, fundo, menu ----------
function reportPanel() {
  const tab = U.tab || 'recursos';
  const tabs = `<div class="tabs">${[['recursos', 'Recursos'], ['sistemas', 'Sistemas'], ['tripulacao', 'Tripulação']].map(([k, n]) => `<button class="chip ${tab === k ? 'on' : ''}" data-ui="tab" data-arg="${k}">${n}</button>`).join('')}</div>`;
  let body = '';
  if (tab === 'recursos') {
    body = `<table class="rep"><tr><th>Recurso</th><th>Atual</th><th>Disp.</th><th>Entradas (hoje)</th><th>Saídas (hoje)</th><th>Saldo total</th></tr>${RES_META.map(m => {
      const fd = S.flowsDay[m.id] || {}, ft = S.flowsTotal[m.id] || {};
      const inD = Object.values(fd).filter(v => v > 0).reduce((a, b) => a + b, 0), outD = Object.values(fd).filter(v => v < 0).reduce((a, b) => a + b, 0);
      const tot = Object.values(ft).reduce((a, b) => a + b, 0);
      const cap = m.id === 'lixo' ? null : S.cap[m.id];
      const reasons = Object.entries(ft).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 8).map(([k, v]) => `<div><span>${esc(k)}</span><b class="${v >= 0 ? 'green' : 'red'}">${v >= 0 ? '+' : ''}${fmt(v, 1)}</b></div>`).join('');
      return `<tr><td><details><summary>${m.icon} ${m.name}</summary><div class="reasons">${reasons || '<i>sem movimento</i>'}</div></details></td><td>${fmt(S.res[m.id], 1)} ${m.unit}</td><td>${cap ? fmt(S.res[m.id] / cap * 100, 0) + '%' : '—'}</td><td class="green">+${fmt(inD, 1)}</td><td class="red">${fmt(outD, 1)}</td><td>${tot >= 0 ? '+' : ''}${fmt(tot, 1)}</td></tr>`;
    }).join('')}</table><p class="small muted">Clique no nome de um recurso para ver as entradas e saídas por origem.</p>`;
  }
  if (tab === 'sistemas') body = Object.keys(SYSTEMS).map(k => `<div class="sysline"><span title="${esc(SYSTEMS[k].desc)}">${SYSTEMS[k].name}</span><em class="dmg ${SYSTEMS[k].dmg}">Dano ${SYSTEMS[k].dmg}</em>${bar(sysHp(k), 100)}<b>${fmt(sysHp(k), 0)}%</b></div><p class="small muted">${esc(SYSTEMS[k].desc)}</p>`).join('');
  if (tab === 'tripulacao') body = crewList();
  return `<div class="modal-bg" data-ui="closePanel"><div class="panel station wide" data-stop="1"><button class="x" data-ui="closePanel">✕</button><h2>Relatório da nave</h2>${tabs}${body}</div></div>`;
}
function crewList() {
  return `<div class="crewlist">${S.crew.map(c => `<div class="crew ${c.alive ? '' : 'dead'}"><img src="${spriteURL(c.avatar, 'suit', c.alive && c.humor >= 40 ? 'happy' : 'sad', 2)}" alt=""><div><b>${esc(c.name)}</b> <small>${esc(c.roleName)}</small> ${c.owner && c.owner !== 'bot' ? '<span class="tag">🎮 jogador</span>' : '<span class="tag">🤖 bot</span>'}<br>
    ${c.alive ? `Humor ${bar(c.humor, 100)} Saciedade ${bar(c.saciedade, 100)} Nutrição ${bar(c.nutricao, 100)}<br><small>${c.hibernating ? '💤 hibernando' : c.sickness ? '🤒 doente' : c.status === 'ok' ? '✔ ok' : '✚ ' + c.status}${c.task ? ' · ' + esc(c.task.label) : ''} · ❤ ${c.likes.join(', ')}${c.allergy.length ? ' · alergia: ' + c.allergy.join(', ') : ''}</small>` : '☠ morto'}</div></div>`).join('')}</div>`;
}
function fundPanel() {
  const o = [['peca', 'Peça de reposição', 2], ['medico', 'Tratamento médico urgente (todos)', 3], ['energia', 'Baterias de emergência (+20 kWh)', 2], ['oxigenio', 'Oxigênio de emergência (+15 kg)', 2]];
  return `<div class="modal-bg" data-ui="closePanel"><div class="panel station" data-stop="1"><button class="x" data-ui="closePanel">✕</button><h2>Fundo de contingência: ${S.fund} pts</h2><div class="opts">${o.map(([k, n, c]) => `<button class="opt ${S.fund < c ? 'cant' : ''}" data-act="fund" data-p='${J({ kind: k })}'><b>${n}</b><em>${c} pts</em></button>`).join('')}</div></div></div>`;
}
function menuPanel() {
  return `<div class="modal-bg" data-ui="closePanel"><div class="panel center" data-stop="1"><h2>PAUSA</h2>
    <div class="menu"><button class="mbtn" data-ui="closePanel">▶ Continuar</button><button class="mbtn" data-ui="panel" data-arg="settings">⚙ Configurações</button>
    ${U.confirmQuit ? '<button class="mbtn red" data-ui="quit">Confirmar: sair para o título</button>' : '<button class="mbtn" data-ui="quitAsk">⏏ Sair para o título</button>'}</div>
    <p class="small muted">Pontos desta jornada: ${S.points} · Créditos: ${Save.data.credits}</p></div></div>`;
}

// ---------- estágios finais ----------
function stationScreen() {
  const tab = U.tab || 'exo';
  const tabs = `<div class="tabs">${[['exo', 'Exploração científica'], ['escambo', 'Escambo']].map(([k, n]) => `<button class="chip ${tab === k ? 'on' : ''}" data-ui="tab" data-arg="${k}">${n}</button>`).join('')}</div>`;
  let body = '';
  if (tab === 'exo') {
    body = `<p class="small">Dados reais (NASA Exoplanet Archive, aproximados). Critérios: tamanho parecido com a Terra (0,8–1,5 R⊕), temperatura de equilíbrio entre 200 e 300 K, estrela calma e distância alcançável. Cada análise custa ${has('lab') ? 5 : 10} GB.</p>
      <div class="exos">${EXOPLANETS.map(e => { const an = S.explore.analyzed.includes(e.id); return `<div class="exo ${S.explore.chosen === e.id ? 'on' : ''}"><b>${e.name}</b>${an ? `<div class="kv small"><span>Distância</span><b>${e.dist}${typeof e.dist === 'number' ? ' anos-luz' : ''}</b><span>Raio/massa</span><b>${e.radius}</b><span>Temp. de equilíbrio</span><b>${e.teq} K</b><span>Ano</span><b>${e.period} dias</b><span>Estrela</span><b>${e.star}</b><span>ESI</span><b>${e.esi}</b></div><p class="small muted">${e.issues}</p><button class="btn tiny" data-act="chooseExo" data-p='${J({ id: e.id })}'>Escolher como candidato</button>` : `<button class="btn tiny" data-act="analyzeExo" data-p='${J({ id: e.id })}'>Analisar</button>`}</div>`; }).join('')}</div>`;
  } else body = `<p class="small">Troque dados científicos e peças por recursos. Dados valem pontos de ciência, mas comida mantém a tripulação viva.</p><div class="opts">${TRADES.map(t => `<button class="opt ${t.can() ? '' : 'cant'}" data-act="trade" data-p='${J({ id: t.id })}'><b>${t.name}</b></button>`).join('')}</div>`;
  return `<div class="stage-panel"><h2>ESTAÇÃO PONTE-ALFA</h2>${miniRes()}${tabs}<div class="scroll">${body}</div>
    <div class="row"><button class="btn primary" data-act="leaveStation" ${S.explore.chosen === 'pontes' ? '' : 'disabled'}>Partir para Pontes-01 ▶</button></div></div>`;
}
function miniRes() { return `<div class="minires">${['energia', 'combustivel', 'agua', 'oxigenio', 'comida', 'dados'].map(k => { const m = RES_META.find(x => x.id === k); return `<span>${m.icon} ${fmt(S.res[k], 0)} ${m.unit}</span>`; }).join('')}<span>✚ ${fmt(S.res.medicos, 0)}</span><span>⚙ ${S.peças} peças</span></div>`; }
function planetScreen() {
  return `<div class="stage-panel"><h2>O NOVO MUNDO: PONTES-01</h2>${miniRes()}<div class="scroll">
    <h4>Análises ${has('sonda') ? '(sonda de reconhecimento)' : has('pouso') ? '(nave auxiliar de pouso)' : '(sem sonda: a nave desce — arriscado)'}</h4>
    <div class="opts">${PLANET_ANALYSES.map(a => { const d = S.planet.analyzed.includes(a.id); return `<div class="opt ${d ? 'on' : ''}"><b>${a.name}</b><span>${d ? esc(a.result) : 'custo: ' + a.cost + ' GB e 4 kWh'}</span>${d ? '' : `<button class="btn tiny" data-act="planetAnalyze" data-p='${J({ id: a.id })}'>Analisar</button>`}</div>`; }).join('')}</div>
    <h4>Desafios de adaptação e sobrevivência</h4>
    <div class="opts">${CHALLENGES.map(ch => { const done = S.planet.challenges.find(c => c.id === ch.id); const mods = ch.mods().filter(m => m[0]); return `<div class="opt ${done ? (done.ok ? 'on' : 'cant') : ''}"><b>${ch.name}</b><span>${ch.desc}</span><em>${mods.map(m => (m[0] > 0 ? '+' : '') + m[0] + ' ' + m[1]).join(' · ') || 'sem bônus'}</em>${done ? `<span class="${done.ok ? 'green' : 'red'}">${done.ok ? 'Sucesso' : esc(done.txt)}</span>` : `<button class="btn tiny" data-act="challenge" data-p='${J({ id: ch.id })}'>Enfrentar (d20)</button>`}</div>`; }).join('')}</div>
    </div><div class="row"><button class="btn primary" data-act="toMigration">Planejar a migração ▶</button></div></div>`;
}
function migrationScreen() {
  return `<div class="stage-panel"><h2>MIGRAÇÃO</h2>${miniRes()}<div class="scroll"><p class="small">Escolha onde a expedição vai pousar. O que você analisou aparece em detalhes; o resto é risco.</p>
    <div class="opts">${LANDING_SITES.map(s => `<button class="opt ${S.planet.site === s.id ? 'on' : ''}" data-act="chooseSite" data-p='${J({ id: s.id })}'><b>${s.name}</b><span>✔ ${s.pros}</span><span>✖ ${s.cons}</span><em>${Object.keys(s.score).map(k => S.planet.analyzed.includes(k) ? `${PLANET_ANALYSES.find(a => a.id === k).name}: ${s.score[k] > 0 ? 'bom' : s.score[k] < 0 ? 'ruim' : 'neutro'}` : `${PLANET_ANALYSES.find(a => a.id === k).name}: ?`).join(' · ')}</em></button>`).join('')}</div>
    <p class="small">Pouso ${has('pouso') ? 'com a nave auxiliar (40 kg de combustível)' : 'com a nave principal — arriscado (80 kg de combustível)'}.</p></div>
    <div class="row"><button class="btn primary big" data-act="land">🛬 POUSAR</button></div></div>`;
}
function endScreen() {
  const e = S.ending || { ok: false, reason: S.fail };
  const fl = S.flowsTotal;
  const spent = k => -Object.values(fl[k] || {}).filter(v => v < 0).reduce((a, b) => a + b, 0);
  const fd = S.food;
  const humorAvg = alive().length ? alive().reduce((s, c) => s + c.humor, 0) / alive().length : 0;
  return `<div class="panel center wide scroll end ${e.ok ? 'ok' : 'bad'}">
    <h1>${e.ok ? 'CHEGAMOS A PONTES-01' : 'MISSÃO FRACASSADA'}</h1>
    <p class="big">${e.ok ? `A expedição pousou no ${esc(e.site)}. A humanidade tem um novo começo — que custou caro.` : esc(e.reason)}</p>
    <div class="kv"><span>Dias de viagem</span><b>${S.day}</b><span>Tripulantes vivos</span><b>${alive().length} de 7</b><span>Pontos</span><b>${S.points}</b><span>Energia gasta</span><b>${fmt(spent('energia'), 0)} kWh</b><span>Combustível gasto</span><b>${fmt(spent('combustivel'), 0)} kg</b><span>Água consumida</span><b>${fmt(spent('agua'), 0)} L</b><span>Oxigênio respirado</span><b>${fmt(spent('oxigenio'), 0)} kg</b>
      <span>Comida produzida / desperdiçada</span><b>${fmt(fd.produced, 1)} / ${fmt(fd.wasted, 1)} kg</b><span>kWh e litros por kg de comida</span><b>${fd.produced > 0 ? fmt(S.stats.kwhFood / fd.produced, 1) + ' kWh · ' + fmt(S.stats.waterFood / fd.produced, 1) + ' L' : '—'}</b><span>Receitas descobertas</span><b>${fd.recipes.length}/${RECIPES.length}</b><span>Dias de mesa completa</span><b>${fd.mesaDays}</b><span>Humor médio</span><b>${fmt(humorAvg, 0)}</b>
      <span>Custo da regulação térmica</span><b>${fmt(S.stats.thermalKwh, 1)} kWh · ${fmt(S.stats.thermalFuel, 0)} kg</b></div>
    ${S.dead.length ? `<h4>Perdas</h4><p>${S.dead.map(d => `${esc(d.role)} ${esc(d.name)} (dia ${d.day}, ${esc(d.cause)})`).join('<br>')}</p>` : ''}
    <h4>Desafios</h4><p>${S.stats.events.map(x => `${EVENT_INFO[x.type].icon} ${EVENT_INFO[x.type].title}: <b class="${x.ok ? 'green' : 'red'}">${x.grade}</b>`).join('<br>') || '—'}</p>
    <p class="quote">Na Terra, o solo, a chuva, a atmosfera e os polinizadores fazem tudo isso de graça. Na nave, cada grau, cada litro e cada quilo custam energia, tempo e atenção. <b>É mais fácil manter a Terra habitável do que habitar outro planeta.</b></p>
    <div class="row"><button class="btn primary" data-ui="journey">Jogar novamente</button><button class="btn" data-ui="shop">✦ Loja (${Save.data.credits})</button><button class="btn" data-ui="quit">Título</button></div></div>`;
}

// =============== RENDERIZAÇÃO ===============
function renderUI() {
  let scr = '', hud = '', side = '', modal = '';
  if (!S || U.screen !== 'game') {
    const map = { title: titleScreen, journey: journeyScreen, history: historyScreen, settings: () => settingsScreen(false), shop: shopScreen, avatar: () => U.avatarDirty ? avatarScreen() : U.cache.scr, lobby: lobbyScreen };
    scr = (map[U.screen] || titleScreen)();
    U.avatarDirty = false;
  } else if (Net.role === 'client' && !['ship', 'station', 'planet', 'migration', 'end'].includes(S.scene)) {
    scr = `<div class="panel center"><h2>AGUARDANDO O COMANDANTE</h2><p class="muted">${{ intro: 'Narração da introdução', earth: 'Caminhando pela Terra poluída', setup: 'Montando a nave com a verba limitada', launch: 'Decolagem!' }[S.scene] || '...'}</p><p>Você é: <b>${esc(Net.myRoleName || '')}</b></p></div>`;
  } else {
    switch (S.scene) {
      case 'intro': scr = introScreen(); break;
      case 'earth': scr = earthScreen(); break;
      case 'setup': scr = U.setupDirty ? setupScreen() : U.cache.scr; U.setupDirty = false; break;
      case 'launch': scr = ''; break;
      case 'ship':
        hud = hudTop() + tutorialBox() + hudBottom();
        side = eventPanel();
        if (U.panel === 'report') modal = reportPanel();
        else if (U.panel === 'crew') modal = `<div class="modal-bg" data-ui="closePanel"><div class="panel station wide" data-stop="1"><button class="x" data-ui="closePanel">✕</button><h2>Tripulação</h2>${crewList()}</div></div>`;
        else if (U.panel === 'fund') modal = fundPanel();
        else if (U.panel === 'menu') modal = menuPanel();
        else if (U.panel === 'settings') modal = `<div class="modal-bg">${settingsScreen(true)}</div>`;
        else if (U.panel && STATIONS[U.panel]) modal = stationPanel(U.panel);
        break;
      case 'station': scr = stationScreen(); break;
      case 'planet': scr = planetScreen(); break;
      case 'migration': scr = migrationScreen(); break;
      case 'end': scr = endScreen(); break;
    }
  }
  const gameEl = document.getElementById('game'); const sc = S && U.screen === 'game' ? S.scene : 'menu'; if (gameEl.dataset.scene !== sc) gameEl.dataset.scene = sc;
  setHTML('scr', scr); setHTML('hud', hud); setHTML('side', side); setHTML('modal', modal);
  document.getElementById('side').className = S && S.event && S.event.type === 'termico' && S.event.phase === 'run' ? 'wide' : '';
  // toast
  const tt = S && S.toast;
  const th = tt ? `<div class="toast ${tt.kind}">${esc(tt.text)}</div>` : '';
  setHTML('toast', th);
  if (tt && U.lastToast !== tt.id) { U.lastToast = tt.id; if (tt.kind === 'bad') Sfx.bad(); else if (tt.kind === 'good') Sfx.ok(); }
  if (S && S.narration && U.lastNarr !== S.narration.id) { U.lastNarr = S.narration.id; Narrator.say(S.narration.text); }
}

// =============== HANDLERS ===============
const UIH = {};
UIH.title = () => { U.screen = 'title'; Music.play('intro'); };
UIH.journey = () => { U.screen = 'journey'; S = null; };
UIH.history = () => { U.screen = 'history'; };
UIH.settings = () => { U.screen = 'settings'; };
UIH.shop = () => { U.screen = 'shop'; S = S && S.scene === 'end' ? null : S; };
UIH.lobby = () => { U.screen = 'lobby'; };
UIH.buy = id => { const it = SHOP.find(i => i.id === id); if (!it || Save.owns(id) || Save.data.credits < it.price) return; Save.data.credits -= it.price; Save.data.owned.push(id); Save.write(); Sfx.ok(); };
UIH.avatar = () => { U.screen = 'avatar'; U.avatarDraft = JSON.parse(JSON.stringify(Object.assign({}, DEFAULT_AVATAR, Save.data.avatar || {}))); U.avatarDirty = true; };
UIH.av = arg => { const [k, v] = arg.split(':'); U.avatarDraft[k] = +v; U.avatarDirty = true; };
UIH.avc = arg => { const i = arg.indexOf(':'); U.avatarDraft[arg.slice(0, i)] = arg.slice(i + 1); U.avatarDirty = true; };
UIH.avs = arg => { const [k, v] = arg.split(':'); U.avatarDraft[k] = v; U.avatarDirty = true; };
UIH.avt = k => { U.avatarDraft[k] = !U.avatarDraft[k]; U.avatarDirty = true; };
UIH.avRandom = () => { const n = U.avatarDraft.name; U.avatarDraft = Object.assign(randomAvatar(), { name: n, suit: Math.floor(Math.random() * SUIT_COLORS.length) }); U.avatarDirty = true; };
UIH.paintColor = c => { U.paintColor = c; U.avatarDirty = true; };
UIH.paintClear = () => { U.avatarDraft.paint = {}; };
UIH.avSave = () => { const n = $('#av-name'); if (n) U.avatarDraft.name = n.value.trim() || 'Comandante'; Save.data.avatar = U.avatarDraft; Save.write(); Sfx.ok(); UIH.title(); };
UIH.startGame = journey => {
  const mode = Net.role === 'host' ? 'host' : 'solo';
  newGame(journey, mode);
  if (Net.role === 'host') Net.assignSeats();
  U.screen = 'game'; U.introIdx = 0; U.introT = 0; U.panel = null; U.me = 'cmd';
  S.scene = 'intro'; Narrator.say(NARRATION_INTRO[0]); Music.play('intro');
};
UIH.introNext = () => {
  if (U.introT * 45 < NARRATION_INTRO[U.introIdx].length) { U.introT = 999; return; }
  U.introIdx++; U.introT = 0;
  if (U.introIdx >= NARRATION_INTRO.length) return UIH.introSkip();
  Narrator.say(NARRATION_INTRO[U.introIdx]);
};
UIH.introSkip = () => { Narrator.stop(); S.scene = 'earth'; U.earth = { t: 0, limit: Save.data.settings.fastEarth ? 30 : 120, p: { x: 80, face: 1, moving: false, walkT: 0 } }; U.comms = 0; };
UIH.earthSkip = () => { U.earth.t = U.earth.limit; };
UIH.comms2 = () => { U.comms = 2; Narrator.say('Próximo comunicado: você tem uma verba limitada para montar uma nave de exploração.'); };
UIH.toSetup = () => { S.scene = 'setup'; U.setupStep = 0; U.setupDirty = true; Music.play('fase'); };
UIH.setStep = i => { U.setupStep = +i; U.setupDirty = true; };
UIH.setNext = () => { U.setupStep = Math.min(SETUP_STEPS.length - 1, U.setupStep + 1); U.setupDirty = true; };
UIH.setPrev = () => { U.setupStep = Math.max(0, U.setupStep - 1); U.setupDirty = true; };
UIH.setOrigin = id => { S.setup.origin = id; U.setupDirty = true; };
UIH.setRoute = id => { S.setup.route = id; U.setupDirty = true; };
UIH.setToggle = arg => {
  const [list, id] = arg.split(':'); const arr = S.setup[list];
  const cat = { skills: SKILLS, modules: MODULES, upgrades: UPGRADES, reserves: RESERVES, training: TRAINING, gadgets: GADGETS, pantry: PANTRY }[list];
  const it = cat.find(x => x.id === id);
  if (arr.includes(id)) {
    arr.splice(arr.indexOf(id), 1);
    cat.filter(x => x.req === id).forEach(x => { if (arr.includes(x.id)) arr.splice(arr.indexOf(x.id), 1); });
  } else {
    const left = setupBudget() - setupCost(S.setup);
    if (it.pts > left) { Sfx.bad(); return; }
    if (it.req && !arr.includes(it.req)) { Sfx.bad(); return; }
    if (list === 'modules' && setupSlots(S.setup) + it.slots > SLOTS) { Sfx.bad(); return; }
    arr.push(id);
  }
  U.setupDirty = true;
};
UIH.launch = () => {
  if (setupCost(S.setup) > setupBudget()) { Sfx.bad(); return; }
  applySetup(); S.scene = 'launch'; U.launchT = 0; Sfx.noise(2, 0.08);
};
UIH.panel = p => {
  U.panel = p; U.tab = null; U.confirmQuit = false;
  if (p === 'report' && S.tutorial === 2) act('tut', { n: 3 });
};
UIH.closePanel = () => { U.panel = null; U.tab = null; U.cook = []; };
UIH.tab = t => { U.tab = t; };
UIH.goto = st => { U.autopilot = st; };
UIH.farmSel = i => { U.farmSel = +i; };
UIH.cookToggle = k => { const i = U.cook.indexOf(k); if (i >= 0) U.cook.splice(i, 1); else if (U.cook.length < 3) U.cook.push(k); };
UIH.cookClear = () => { U.cook = []; };
UIH.cook = () => { act('cook', { ing: U.cook.slice() }); U.cook = []; };
UIH.pilot = d => act('puzzle', { op: 'move', d: +d * 0.08 });
UIH.quitAsk = () => { U.confirmQuit = true; };
UIH.quit = () => { Narrator.stop(); if (Net.role) Net.leave(); S = null; U.screen = 'title'; U.panel = null; Music.play('intro'); };
UIH.netHost = () => { const url = $('#net-url').value.trim(); U.lobby = { url }; Net.host(url); };
UIH.netJoin = () => { const url = $('#net-url').value.trim(); const code = $('#net-code').value.trim().toUpperCase(); U.lobby = { url, code }; Net.join(url, code); };
UIH.netLeave = () => { Net.leave(); U.screen = 'lobby'; };
ACTIONS.tut = p => { if (S.tutorial < p.n) S.tutorial = p.n; };

function bindUI() {
  const layer = document.getElementById('ui-layer');
  const handle = (e) => {
    const t = e.target.closest('[data-ui],[data-act]');
    if (!t || t.disabled) return;
    if (t.dataset.ui === 'closePanel' && e.target.closest('[data-stop]') && !e.target.closest('.x')) return;
    Music.unlock(); Sfx.ensure();
    if (t.dataset.act) { let p = {}; try { p = t.dataset.p ? JSON.parse(t.dataset.p) : {}; } catch (er) { /* */ } act(t.dataset.act, p); }
    else { const fn = UIH[t.dataset.ui]; if (fn) { Sfx.click(); fn(t.dataset.arg); } }
    e.preventDefault();
  };
  layer.addEventListener('pointerdown', e => { if (e.button !== 0) return; if (e.target.closest('input,select,details,summary')) return; handle(e); });
  layer.addEventListener('click', e => { if (e.detail === 0) handle(e); });
  layer.addEventListener('input', e => {
    const t = e.target;
    if (t.id === 'av-name' && U.avatarDraft) U.avatarDraft.name = t.value;
    if (t.dataset.set) { const st = Save.data.settings; st[t.dataset.set] = t.type === 'checkbox' ? t.checked : +t.value; Save.write(); Music.refreshVolume(); if (t.dataset.set === 'narration' && !t.checked) Narrator.stop(); }
  });
  layer.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.actsel === 'menu') act('menu', { slot: +t.dataset.slot, item: t.value });
    if (t.dataset.actcheck === 'research') act('research', { on: t.checked });
  });
  // pintura do avatar
  const paintAt = e => {
    const c = e.target; if (c.id !== 'paint') return;
    const r = c.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left) / r.width * SPR_W), y = Math.floor((e.clientY - r.top) / r.height * SPR_H);
    if (x < 0 || y < 0 || x >= SPR_W || y >= SPR_H) return;
    U.avatarDraft.paint = Object.assign({}, U.avatarDraft.paint, { [x + ',' + y]: U.paintColor });
  };
  layer.addEventListener('pointerdown', e => { if (e.target.id === 'paint') { U.paintOn = true; paintAt(e); } });
  layer.addEventListener('pointermove', e => { if (U.paintOn) paintAt(e); });
  window.addEventListener('pointerup', () => { U.paintOn = false; });
  layer.addEventListener('keydown', e => { if (e.target.tagName === 'INPUT') e.stopPropagation(); });
}
