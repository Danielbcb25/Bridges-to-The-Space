// ============================================================
//  COMPUTADOR DE BORDO — próximo passo, lista de tarefas e ajuda (H)
//  + aceleração do tempo (Shift+S / botão ⏩), pulo, corrida e
//  página do site em "modo jogo" (some o texto, aparece a tripulação).
// ============================================================
'use strict';

const RUN_MULT = 1.75; // Shift + andar
// gravidade do pulo por lugar: no espaço o pulo é lento e "flutua"
const JUMP = { ship: { v: 74, g: 120 }, earth: { v: 150, g: 620 }, colony: { v: 135, g: 430 } };

function jumpStart(o, where) {
  if (!o || (o.jy || 0) > 0.5) return false;
  const j = JUMP[where] || JUMP.earth;
  o.jv = j.v; o.jy = 0.01; o.jg = j.g; o.jHold = true;
  Sfx.tone(where === 'ship' ? 330 : 520, 0.08, 'triangle', 0.05);
  return true;
}
function jumpTick(o, dt) {
  if (!o || !o.jy) return;
  const g = o.jg || 600;
  // pulo dinâmico: soltar a tecla na subida corta o pulo; no espaço, segurar faz flutuar mais
  const holding = keys.Space;
  let gg = g;
  if (o.jv > 0 && !holding) gg = g * 2.2;
  if (o.jv < 0 && holding && g < 200) gg = g * 0.55;
  o.jy += o.jv * dt; o.jv -= gg * dt;
  if (o.jy <= 0) { o.jy = 0; o.jv = 0; }
}

// ---------- aceleração do tempo ----------
UIH.fast = () => {
  if (!S || !['ship', 'colony'].includes(S.scene)) return;
  if (S.event && S.event.phase !== 'result') return toastLocal('Não dá para acelerar durante um desafio.');
  if (Net.role === 'client') return;
  // Shift+S de novo aumenta: 2x → 5x → 10x → normal
  const steps = [0, 2, 5, 10];
  S.fast = steps[(steps.indexOf(S.fast || 0) + 1) % steps.length];
  toastLocal(S.fast ? K(`⏩ Tempo ${S.fast}x até o próximo evento (Shift+S muda).`, `⏩ Time ${S.fast}x until the next event (Shift+S changes it).`, `⏩ Tiempo ${S.fast}x hasta el próximo evento (Shift+S lo cambia).`) : '▶ Tempo normal.');
};
// avança a simulação em passos de no máximo 0,1 s (estável mesmo a 10x)
function stepScaled(fn, dt, k) { let left = dt * k; while (left > 1e-6) { const h = Math.min(0.1, left); fn(h); left -= h; } }
function timeScale() { return S && S.fast && !(S.event && S.event.phase !== 'result') ? S.fast : 1; }
function toastLocal(k) { if (S) { S.toast = { text: k, kind: 'info', t: 3, id: Math.random() }; } }

// ---------- passos por cena ----------
const KS = (pt, en, es) => K(pt, en, es);
function assistSteps() {
  if (!S) return [];
  const list = [];
  const add = (t, done, go, icon, act) => list.push({ t, done: !!done, go, icon: icon || '▫', act });
  switch (S.scene) {
    case 'intro': add('Assista à apresentação do modo de jogo (Espaço avança).', false, null, '🎬'); break;
    case 'earth': {
      const E = U.earth || { read: {} }; const rd = E.read || {};
      const bvis = CITY_BUILDINGS.filter(b => rd[b.id + ':0']).length;
      add('Converse com a primeira moradora (Ms. Lia).', rd['npc:lia'], { earth: CITY_NPCS[0].x }, '💬');
      add(KS(`Entre em 3 prédios da cidade (${Math.min(3, bvis)}/3).`, `Enter 3 city buildings (${Math.min(3, bvis)}/3).`, `Entre en 3 edificios de la ciudad (${Math.min(3, bvis)}/3).`), bvis >= 3, { earth: (CITY_BUILDINGS.find(b => !rd[b.id + ':0']) || CITY_BUILDINGS[0]).x }, '🏢');
      add('Vá até o foguete no fim da cidade e embarque (E).', U.comms, { earth: rocketX() }, '🚀');
      break;
    }
    case 'setup': {
      const st = S.setup;
      add('Missão: escolha a origem do Comandante e a rota.', U.setupStep > 0, { setup: 0 }, '🧭');
      add('Módulos: escolha até 5 slots (estufa, reciclador…).', U.setupStep > 1 && st.modules.length > 0, { setup: 1 }, '🧩');
      add('Suprimentos: combustível, água, oxigênio, comida e peças.', U.setupStep > 2, { setup: 2 }, '📦');
      add('Decole!', false, { setup: 3 }, '🚀');
      break;
    }
    case 'ship': {
      // só a progressão principal: desafios aleatórios têm o próprio painel
      const tut = [
        ['Vá à Ponte de comando (andar de cima, à direita).', 'ponte', '🧭'],
        ['Escolha o modo de cruzeiro no painel de pilotagem.', 'ponte', '🚀'],
        ['Abra o relatório de recursos (R).', null, '📊'],
        ['Defina o cardápio na Cozinha (andar de baixo).', 'cozinha', '🍳'],
      ];
      tut.forEach(([t, st, ic], i) => add(t, S.tutorial > i, st ? { st } : null, ic, i === 2 ? 'report' : null));
      add(KS(`Leve a nave até Pontes-01b (${Math.round(S.progress * 100)}%). Use ⏩ (Shift+S) para acelerar.`, `Take the ship to Pontes-01b (${Math.round(S.progress * 100)}%). Use ⏩ (Shift+S) to speed up.`, `Lleve la nave a Pontes-01b (${Math.round(S.progress * 100)}%). Use ⏩ (Shift+S) para acelerar.`), false, null, '🪐');
      break;
    }
    case 'station':
      add('Analise exoplanetas (dados da NASA).', S.explore.analyzed.length >= 2, null, '🔭');
      add('Escolha o planeta de destino.', S.explore.dest, null, '🎯');
      add('Parta da estação.', false, null, '🚀', 'leaveStation');
      break;
    case 'detour': add('Este planeta não serve: volte à Estação Ponte-Alfa.', false, null, '↩', 'detourReturn'); break;
    case 'planet':
      add('Faça análises do planeta.', S.planet.analyzed.length >= 2, null, '🔬');
      CHALLENGES.forEach(ch => add(ch.name, S.planet.challenges.some(c => c.id === ch.id), null, '🎲'));
      add('Planeje a migração.', false, null, '🗺', 'toMigration');
      break;
    case 'migration':
      add('Escolha o local de pouso.', S.planet.site, null, '📍');
      add('Pouse em Pontes-01b.', false, null, '🛬', 'land');
      break;
    case 'colony':
      if (S.colony.tut === 0) add('Leia a missão e comece a construir.', false, null, '📜', 'cTut');
      colonyObjectives().forEach(o => add(o.t, o.done, { b: { solar: 'solar', agua: 'agua', estufa: 'estufa', torre: 'torre', tx: 'torre', pista: 'pista', naves: 'pista' }[o.id] }, o.done ? '✔' : '🏗'));
      break;
  }
  return list;
}
function assistNext() { return assistSteps().find(s => !s.done) || null; }
function goStep(s) {
  if (!s || !s.go) return;
  const g = s.go;
  if (g.st && STATIONS[g.st]) U.autopilot = g.st;
  if (g.b && typeof CBUILD !== 'undefined' && CBUILD[g.b]) U.clickTarget = { x: CBUILD[g.b].x };
  if (g.earth != null && U.earth) U.earth.target = g.earth;
  if (g.setup != null) { U.setupStep = g.setup; U.setupDirty = true; }
}
UIH.help = () => { U.help = !U.help; Sfx.click(); };
UIH.helpGo = () => { const n = assistNext(); U.help = false; if (n && n.act) { if (n.act === 'report') UIH.panel('report'); else act(n.act); } else goStep(n); };

function assistMini() {
  const all = assistSteps(); const n = all.find(x => !x.done); if (!n) return '';
  const done = all.filter(x => x.done).length;
  const key = JSON.stringify(n.t);
  if (U.lastAssist !== key) { U.lastAssist = key; U.assistFlash = R.t + 2.5; if (S.scene !== 'intro') Sfx.tone(1180, 0.06, 'sine', 0.04); }
  const flash = R.t < (U.assistFlash || 0) ? 'flash' : '';
  return `<div class="assist-mini ${flash}" data-ui="help" title="${esc(L('Computador de bordo (H)'))}"><span class="pc">💻</span><span class="ic">${n.icon}</span><span class="tx">${esc(L(n.t))}</span><span class="cnt">${done}/${all.length}</span>${n.go || n.act ? `<button class="btn tiny primary" data-ui="helpGo">▶ ${esc(L('Ir'))}</button>` : ''}<kbd>H</kbd></div>`;
}
function helpPanel() {
  const all = assistSteps(); const n = all.find(s => !s.done);
  const keysHelp = [['← →', 'andar'], ['Shift', 'correr'], ['Espaço', 'interagir / pular'], ['E', 'interagir'], ['Esc', 'fechar / voltar'], ['Shift+S', 'tempo 2x'], ['H', 'ajuda'], ['R / T', 'relatório / tripulação']];
  return `<div class="modal-bg" data-ui="help"><div class="panel station wide pcpanel" data-stop="1"><button class="x" data-ui="help">✕</button>
    <h2>💻 ${esc(L('COMPUTADOR DE BORDO'))}</h2>
    ${n ? `<div class="nextcard"><div class="big-ic">${n.icon}</div><div><small>${esc(L('PRÓXIMO PASSO'))}</small><p>${esc(L(n.t))}</p>${n.go || n.act ? `<button class="btn primary" data-ui="helpGo">${n.act ? '▶ ' + esc(L('Fazer agora')) : '📍 ' + esc(L('Ir até lá'))}</button>` : ''}</div></div>` : `<p class="green">✔ ${esc(L('Tudo em dia!'))}</p>`}
    <h4>${esc(L('Lista de tarefas'))}</h4>
    <ul class="todo">${all.map(s => `<li class="${s.done ? 'done' : s === n ? 'cur' : ''}"><span>${s.done ? '☑' : s === n ? '▶' : '☐'}</span> ${s.icon} ${esc(L(s.t))}</li>`).join('')}</ul>
</div></div>`;
}

// ---------- página do site: modo jogo ----------
let _crewStripKey = '';
function sitePlayMode() {
  const playing = !!(S && U.screen === 'game');
  document.body.classList.toggle('playing', playing);
  const box = document.getElementById('crew-live'); if (!box) return;
  if (!playing) { if (_crewStripKey) { box.innerHTML = ''; _crewStripKey = ''; } return; }
  const key = S.crew.map(c => [c.name, c.roleName, c.alive, c.status, !!c.sickness, Math.round(c.humor / 10), c.hibernating, avatarKey(c.avatar)].join('|')).join(';') + I18n.lang;
  if (key === _crewStripKey) return; _crewStripKey = key;
  box.innerHTML = I18n.dom(S.crew.map(c => {
    const st = !c.alive ? '💀' : c.hibernating ? '💤' : c.sickness ? '🤒' : c.status !== 'ok' ? '✚' : '✔';
    return `<div class="${c.alive ? '' : 'dead'}"><img src="${spriteURL(c.avatar, 'suit', c.alive && c.humor >= 40 ? 'happy' : 'sad', 3)}" alt=""><b>${esc(c.name)}</b><span>${esc(c.roleName)}</span><em>${st} ☺ ${Math.round(c.humor)}</em></div>`;
  }).join(''));
}
