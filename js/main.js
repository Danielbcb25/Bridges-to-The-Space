// ============================================================
//  LOOP PRINCIPAL E CONTROLES
// ============================================================
'use strict';

const keys = {};
let lastT = performance.now();
let lastEventId = null;

function musicFor() {
  if (!S || U.screen !== 'game') return 'intro';
  if (['intro', 'earth'].includes(S.scene)) return 'intro';
  if (S.scene === 'end') return S.ending && S.ending.ok ? 'heroic' : 'fase';
  if (S.event && S.event.phase !== 'result') return 'heroic';
  if (S.scene === 'migration') return 'heroic';
  return 'fase';
}

function moveHuman(c, dt) {
  if (!c || !c.alive || c.hibernating || c.eva) return;
  const L = keys.ArrowLeft || keys.KeyA, Rr = keys.ArrowRight || keys.KeyD;
  const up = keys.ArrowUp || keys.KeyW, down = keys.ArrowDown || keys.KeyS;
  const pilot = S.event && S.event.puzzle && S.event.puzzle.kind === 'pilot';
  if (pilot) return;
  if (c.climb > 0) { stepMove(c, dt); return; }
  if (L || Rr || up || down) U.autopilot = null;
  if (U.autopilot) {
    const st = STATIONS[U.autopilot];
    c.tx = st.x; c.tdeck = st.deck; stepMove(c, dt);
    if (atStation(c, U.autopilot, 2)) U.autopilot = null;
    return;
  }
  if (U.clickTarget) { c.tx = U.clickTarget.x; c.tdeck = U.clickTarget.deck; stepMove(c, dt); if (!c.moving) U.clickTarget = null; return; }
  const sp = (c.status === 'ferido' ? 40 : 70) * (c.sickness ? 0.6 : 1);
  let dx = (Rr ? 1 : 0) - (L ? 1 : 0);
  if (dx) { c.x = clamp(c.x + dx * sp * dt, 64, WORLD_W - 70); c.face = dx; c.moving = true; c.walkT += dt; if (Math.floor(c.walkT * 8) % 4 === 0 && Math.random() < 0.05) Sfx.step(); }
  else c.moving = false;
  const lad = LADDERS.find(l => Math.abs(l - c.x) < 9);
  if (lad != null && ((up && c.deck === 'L') || (down && c.deck === 'U'))) { c.x = lad; c.climb = 0.7; c.climbTo = c.deck === 'U' ? 'L' : 'U'; c.tdeck = c.climbTo; c.tx = lad; }
  if (!c.climb) { c.tx = c.x; c.tdeck = c.deck; }
}

function interact() {
  if (!S || S.scene !== 'ship' || U.panel) return;
  const c = me(); if (!c || !c.alive) return;
  const ev = S.event;
  if (ev && ev.type === 'lixo' && ev.phase === 'run' && S.trash.some(t => t.deck === c.deck && Math.abs(t.x - c.x) < 16)) { act('pickTrash'); Sfx.pick(); return; }
  const near = stationNear(c); if (!near) return;
  if (ev && ev.phase === 'run') {
    const step = ev.steps.find(s => !s.done && s.station === near && (s === curStep(ev) || s.optional));
    if (step) { act('doStep', { step: step.id }); return; }
  }
  if (near === 'termico' && ev && ev.type === 'termico') return;
  U.panel = near; U.tab = null;
  if (near === 'ponte' && S.tutorial === 0) act('tut', { n: 1 });
  if (near === 'cozinha' && S.tutorial === 3) act('tut', { n: 4 });
}

function update(dt) {
  R.t += dt;
  Net.tick(dt);
  if (!S || U.screen !== 'game') return;
  const host = Net.role !== 'client';
  if (S.scene === 'intro') U.introT += dt;
  if (S.scene === 'earth' && host) {
    const E = U.earth;
    if (!U.comms) {
      E.t += dt;
      const p = E.p; const dx = ((keys.ArrowRight || keys.KeyD) ? 1 : 0) - ((keys.ArrowLeft || keys.KeyA) ? 1 : 0);
      if (dx) { p.x = clamp(p.x + dx * 60 * dt, 20, EARTH_W - 20); p.face = dx; p.moving = true; p.walkT += dt; } else p.moving = false;
      if (E.t >= E.limit) { U.comms = 1; Sfx.alarm(); Narrator.say('Você foi selecionado para uma missão espacial para salvar o futuro da humanidade.'); }
    }
  }
  if (S.scene === 'launch' && host) {
    U.launchT += dt;
    if (U.launchT > 6.5) {
      S.scene = 'ship'; S.stage = 1;
      narrate('A nave está no espaço. Comandante, assuma o controle: visite os módulos, configure a navegação e cuide dos recursos e da tripulação.');
    }
  }
  if (S.scene === 'ship') {
    const c = me();
    if (c) moveHuman(c, dt);
    if (host && !(Net.role !== 'host' && U.panel === 'menu')) tickGame(dt);
    // som de alerta em novos eventos
    if (S.event && S.event.id !== lastEventId) { lastEventId = S.event.id; Sfx.alarm(); }
  } else if (host && ['station', 'planet', 'migration'].includes(S.scene)) {
    tickCrew(dt);
  }
  if (S.scene === 'ship' && S.event && S.event.puzzle && S.event.puzzle.kind === 'pilot') {
    const up = keys.ArrowUp || keys.KeyW, down = keys.ArrowDown || keys.KeyS;
    if (up || down) { U.pilotAcc = (U.pilotAcc || 0) + dt; if (U.pilotAcc > 0.05) { U.pilotAcc = 0; act('puzzle', { op: 'move', d: up ? -0.035 : 0.035 }); } }
  }
}

function draw(dt) {
  cx.imageSmoothingEnabled = false;
  cv.style.filter = '';
  if (!S || U.screen !== 'game') { drawTitleBg(dt); if (U.screen === 'avatar') { cx.fillStyle = 'rgba(5,6,26,0.6)'; cx.fillRect(0, 0, VW, VH); } return; }
  switch (S.scene) {
    case 'intro': drawIntroBg(dt); break;
    case 'earth': {
      if (Net.role === 'client') { drawIntroBg(dt); break; }
      const p = U.earth.p;
      drawEarth(dt, p);
      drawChar(Object.assign({}, crewById('cmd').avatar), 'civil', p.x - R.earthCam, GROUND, p.face, p.moving ? Math.floor(p.walkT * 8) : 0, 'happy');
      // placa próxima
      const sign = earthLayout.props.find(s => s.type === 'sign' && Math.abs(s.x + 25 - p.x) < 40);
      if (sign) bubble(sign.t, p.x - R.earthCam, GROUND - 34);
      break;
    }
    case 'setup': drawSetupBg(dt); break;
    case 'launch': drawLaunch(dt, U.launchT || 0); break;
    case 'ship': {
      const ev = S.event;
      if (ev && ev.puzzle && ev.puzzle.kind === 'pilot') drawPilot(ev.puzzle);
      else drawShipInterior(dt, me() || S.crew[0]);
      const m = me(); if (m && m.sickness) cv.style.filter = 'blur(0.6px)';
      break;
    }
    case 'station': drawStationBg(dt); break;
    case 'planet': drawPlanetBg(dt); break;
    case 'migration': drawSurface(dt, false); break;
    case 'end': if (S.ending && S.ending.ok) drawSurface(dt, true); else { spaceBg(); drawStars(1, dt); drawShipExterior(220 + Math.sin(R.t * 0.2) * 20, 140, 1.2, false); } break;
  }
}

function frame(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
  try { update(dt); draw(dt); renderUI(); if (U.screen === 'avatar') drawAvatarPreviews(); }
  catch (e) { console.error(e); }
  Music.play(musicFor());
  requestAnimationFrame(frame);
}

// ---------- entrada ----------
window.addEventListener('keydown', e => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) return;
  Music.unlock(); Sfx.ensure();
  keys[e.code] = true;
  const inGame = S && U.screen === 'game';
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code) && inGame) e.preventDefault();
  if (!inGame) return;
  if (e.code === 'Escape') { if (U.panel) UIH.closePanel(); else if (S.scene === 'ship') UIH.panel('menu'); }
  if (S.scene !== 'ship') {
    if (S.scene === 'intro' && (e.code === 'Enter' || e.code === 'Space')) UIH.introNext();
    return;
  }
  if (e.code === 'KeyE' || e.code === 'Space') interact();
  if (e.code === 'KeyR') { U.panel === 'report' ? UIH.closePanel() : UIH.panel('report'); }
  if (e.code === 'KeyT') { U.panel === 'crew' ? UIH.closePanel() : UIH.panel('crew'); }
  if (e.code === 'KeyF') { U.panel === 'fund' ? UIH.closePanel() : UIH.panel('fund'); }
});
window.addEventListener('keyup', e => { keys[e.code] = false; });
window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

function bindCanvas() {
  cv.addEventListener('pointerdown', e => {
    Music.unlock(); Sfx.ensure();
    if (!S || S.scene !== 'ship' || U.panel) return;
    const r = cv.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * VW + R.camX, y = (e.clientY - r.top) / r.height * VH;
    const deck = y < (DECKS.U.floor + DECKS.L.top) / 2 ? 'U' : 'L';
    // clique numa estação: anda até ela
    const st = Object.keys(STATIONS).find(id => STATIONS[id].deck === deck && Math.abs(STATIONS[id].x - x) < 12);
    if (st) U.autopilot = st; else U.clickTarget = { x: clamp(x, 64, WORLD_W - 70), deck };
  });
  // controles de toque
  document.querySelectorAll('#touch [data-key]').forEach(b => {
    const k = b.dataset.key;
    const on = e => { e.preventDefault(); Music.unlock(); if (k === 'KeyE') interact(); else keys[k] = true; };
    const off = e => { e.preventDefault(); keys[k] = false; };
    b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
  });
}

function boot() {
  initCanvas();
  bindUI();
  bindCanvas();
  Music.play('intro');
  document.getElementById('fs').addEventListener('click', () => {
    const g = document.getElementById('game');
    if (document.fullscreenElement) document.exitFullscreen(); else if (g.requestFullscreen) g.requestFullscreen();
  });
  const start = document.getElementById('start');
  const go = () => { start.classList.add('hide'); Music.unlock(); Sfx.ensure(); };
  start.addEventListener('pointerdown', go); start.addEventListener('keydown', go);
  document.querySelectorAll('[data-crew-sprite]').forEach(img => { const r = ROLES[+img.dataset.crewSprite]; img.src = spriteURL(Object.assign(randomAvatar(() => ((+img.dataset.crewSprite + 1) * 0.137) % 1), { suit: 0 }), 'suit', 'happy', 3); img.alt = r ? r.name : ''; });
  document.querySelectorAll('[data-sprite]').forEach(img => { img.src = spriteURL(DEFAULT_AVATAR, img.dataset.sprite, 'happy', 4); });
  requestAnimationFrame(frame);
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot); else window.addEventListener('load', boot);
