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
  if (S.event && S.event.phase !== 'result') return toastLocal(K('Não dá para acelerar durante um desafio.', 'You cannot speed up during a challenge.', 'No se puede acelerar durante un desafío.'));
  if (Net.role === 'client') return;
  S.fast = S.fast ? 0 : 2;
  toastLocal(S.fast ? K('⏩ Tempo 2x até o próximo evento.', '⏩ Time 2x until the next event.', '⏩ Tiempo 2x hasta el próximo evento.') : K('▶ Tempo normal.', '▶ Normal time.', '▶ Tiempo normal.'));
};
function timeScale() { return S && S.fast && !(S.event && S.event.phase !== 'result') ? S.fast : 1; }
function toastLocal(k) { if (S) { S.toast = { text: k, kind: 'info', t: 3, id: Math.random() }; } }

// ---------- passos por cena ----------
const KS = (pt, en, es) => K(pt, en, es);
function assistSteps() {
  if (!S) return [];
  const list = [];
  const add = (t, done, go, icon, act) => list.push({ t, done: !!done, go, icon: icon || '▫', act });
  switch (S.scene) {
    case 'intro': add(KS('Assista à apresentação do modo de jogo (Espaço avança).', 'Watch the game-mode briefing (Space advances).', 'Mire la presentación del modo de juego (Espacio avanza).'), false, null, '🎬'); break;
    case 'earth': {
      const E = U.earth || { read: {} }; const rd = E.read || {};
      const bvis = CITY_BUILDINGS.filter(b => rd[b.id + ':0']).length;
      add(KS('Converse com a primeira moradora (Ms. Lia).', 'Talk to the first resident (Ms. Lia).', 'Hable con la primera vecina (Ms. Lia).'), rd['npc:lia'], { earth: CITY_NPCS[0].x }, '💬');
      add(KS(`Entre em 3 prédios da cidade (${Math.min(3, bvis)}/3).`, `Enter 3 city buildings (${Math.min(3, bvis)}/3).`, `Entre en 3 edificios de la ciudad (${Math.min(3, bvis)}/3).`), bvis >= 3, { earth: (CITY_BUILDINGS.find(b => !rd[b.id + ':0']) || CITY_BUILDINGS[0]).x }, '🏢');
      add(KS(`Junte 10 descobertas no Diário (J) para ganhar verba (${cityCount()}/10).`, `Collect 10 discoveries in the Diary (J) for extra budget (${cityCount()}/10).`, `Reúna 10 descubrimientos en el Diario (J) para ganar presupuesto (${cityCount()}/10).`), cityCount() >= 10, null, '📓');
      add(KS('Vá ao Centro de Alistamento e aceite a missão.', 'Go to the Enlistment Center and accept the mission.', 'Vaya al Centro de Alistamiento y acepte la misión.'), U.comms, { earth: CITY_BUILDINGS[CITY_BUILDINGS.length - 1].x }, '🚀');
      break;
    }
    case 'setup': {
      const st = S.setup;
      add(KS('Missão: escolha a origem do Comandante e a rota.', 'Mission: choose the Commander\'s origin and the route.', 'Misión: elija el origen del Comandante y la ruta.'), U.setupStep > 0, { setup: 0 }, '🧭');
      add(KS('Módulos: escolha até 5 slots (estufa, reciclador…).', 'Modules: pick up to 5 slots (greenhouse, recycler…).', 'Módulos: elija hasta 5 ranuras (invernadero, reciclador…).'), U.setupStep > 1 && st.modules.length > 0, { setup: 1 }, '🧩');
      add(KS('Suprimentos: combustível, água, oxigênio, comida e peças.', 'Supplies: fuel, water, oxygen, food and parts.', 'Suministros: combustible, agua, oxígeno, comida y piezas.'), U.setupStep > 2, { setup: 2 }, '📦');
      add(KS('Decole!', 'Launch!', '¡Despegue!'), false, { setup: 3 }, '🚀');
      break;
    }
    case 'ship': {
      // só a progressão principal: desafios aleatórios têm o próprio painel
      const tut = [
        [KS('Vá à Ponte de comando (andar de cima, à direita).', 'Go to the Command bridge (upper deck, right).', 'Vaya al Puente de mando (cubierta superior, derecha).'), 'ponte', '🧭'],
        [KS('Escolha o modo de cruzeiro no painel de pilotagem.', 'Choose the cruise mode at the piloting panel.', 'Elija el modo de crucero en el panel de pilotaje.'), 'ponte', '🚀'],
        [KS('Abra o relatório de recursos (R).', 'Open the resource report (R).', 'Abra el informe de recursos (R).'), null, '📊'],
        [KS('Defina o cardápio na Cozinha (andar de baixo).', 'Set the menu in the Kitchen (lower deck).', 'Defina el menú en la Cocina (cubierta inferior).'), 'cozinha', '🍳'],
      ];
      tut.forEach(([t, st, ic], i) => add(t, S.tutorial > i, st ? { st } : null, ic, i === 2 ? 'report' : null));
      add(KS(`Leve a nave até Pontes-01b (${Math.round(S.progress * 100)}%). Use ⏩ (Shift+S) para acelerar.`, `Take the ship to Pontes-01b (${Math.round(S.progress * 100)}%). Use ⏩ (Shift+S) to speed up.`, `Lleve la nave a Pontes-01b (${Math.round(S.progress * 100)}%). Use ⏩ (Shift+S) para acelerar.`), false, null, '🪐');
      break;
    }
    case 'station':
      add(KS('Analise exoplanetas (dados da NASA).', 'Analyze exoplanets (NASA data).', 'Analice exoplanetas (datos de la NASA).'), S.explore.analyzed.length >= 2, null, '🔭');
      add(KS('Escolha o planeta de destino.', 'Choose the destination planet.', 'Elija el planeta de destino.'), S.explore.dest, null, '🎯');
      add(KS('Parta da estação.', 'Leave the station.', 'Parta de la estación.'), false, null, '🚀', 'leaveStation');
      break;
    case 'detour': add(KS('Este planeta não serve: volte à Estação Ponte-Alfa.', 'This planet won\'t do: return to Ponte-Alfa Station.', 'Este planeta no sirve: vuelva a la Estación Ponte-Alfa.'), false, null, '↩', 'detourReturn'); break;
    case 'planet':
      add(KS('Faça análises do planeta.', 'Run planet analyses.', 'Haga análisis del planeta.'), S.planet.analyzed.length >= 2, null, '🔬');
      CHALLENGES.forEach(ch => add(ch.name, S.planet.challenges.some(c => c.id === ch.id), null, '🎲'));
      add(KS('Planeje a migração.', 'Plan the migration.', 'Planifique la migración.'), false, null, '🗺', 'toMigration');
      break;
    case 'migration':
      add(KS('Escolha o local de pouso.', 'Choose the landing site.', 'Elija el lugar de aterrizaje.'), S.planet.site, null, '📍');
      add(KS('Pouse em Pontes-01b.', 'Land on Pontes-01b.', 'Aterrice en Pontes-01b.'), false, null, '🛬', 'land');
      break;
    case 'colony':
      if (S.colony.tut === 0) add(KS('Leia a missão e comece a construir.', 'Read the mission and start building.', 'Lea la misión y empiece a construir.'), false, null, '📜', 'cTut');
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
  return `<div class="assist-mini ${flash}" data-ui="help" title="${esc(L(K('Computador de bordo (H)', 'Onboard computer (H)', 'Computadora de a bordo (H)')))}"><span class="pc">💻</span><span class="ic">${n.icon}</span><span class="tx">${esc(L(n.t))}</span><span class="cnt">${done}/${all.length}</span>${n.go || n.act ? `<button class="btn tiny primary" data-ui="helpGo">▶ ${esc(L(K('Ir', 'Go', 'Ir')))}</button>` : ''}<kbd>H</kbd></div>`;
}
function helpPanel() {
  const all = assistSteps(); const n = all.find(s => !s.done);
  const keysHelp = [['← →', K('andar', 'walk', 'caminar')], ['Shift', K('correr', 'run', 'correr')], ['Espaço', K('interagir / pular', 'interact / jump', 'interactuar / saltar')], ['E', K('interagir', 'interact', 'interactuar')], ['Esc', K('fechar / voltar', 'close / back', 'cerrar / volver')], ['Shift+S', K('tempo 2x', 'time 2x', 'tiempo 2x')], ['H', K('ajuda', 'help', 'ayuda')], ['R / T', K('relatório / tripulação', 'report / crew', 'informe / tripulación')]];
  return `<div class="modal-bg" data-ui="help"><div class="panel station wide pcpanel" data-stop="1"><button class="x" data-ui="help">✕</button>
    <h2>💻 ${esc(L(K('COMPUTADOR DE BORDO', 'ONBOARD COMPUTER', 'COMPUTADORA DE A BORDO')))}</h2>
    ${n ? `<div class="nextcard"><div class="big-ic">${n.icon}</div><div><small>${esc(L(K('PRÓXIMO PASSO', 'NEXT STEP', 'PRÓXIMO PASO')))}</small><p>${esc(L(n.t))}</p>${n.go || n.act ? `<button class="btn primary" data-ui="helpGo">${n.act ? '▶ ' + esc(L(K('Fazer agora', 'Do it now', 'Hacerlo ahora'))) : '📍 ' + esc(L(K('Ir até lá', 'Go there', 'Ir allí')))}</button>` : ''}</div></div>` : `<p class="green">✔ ${esc(L(K('Tudo em dia!', 'All caught up!', '¡Todo al día!')))}</p>`}
    <h4>${esc(L(K('Lista de tarefas', 'To-do list', 'Lista de tareas')))}</h4>
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
    const st = !c.alive ? '☠' : c.hibernating ? '💤' : c.sickness ? '🤒' : c.status !== 'ok' ? '✚' : '✔';
    return `<div class="${c.alive ? '' : 'dead'}"><img src="${spriteURL(c.avatar, 'suit', c.alive && c.humor >= 40 ? 'happy' : 'sad', 3)}" alt=""><b>${esc(c.name)}</b><span>${esc(c.roleName)}</span><em>${st} ☺ ${Math.round(c.humor)}</em></div>`;
  }).join(''));
}
