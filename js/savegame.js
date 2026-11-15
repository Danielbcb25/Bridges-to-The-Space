// ============================================================
//  SALVAR PROGRESSO E JOGOS SALVOS
//  • Cada jornada tem seu próprio salvamento automático (a cada 15 s,
//    ao trocar de cena e ao fechar a aba). Começar uma jornada nova NÃO
//    apaga a anterior: ela fica na aba "Jogos salvos".
//  • "Salvar progresso" (menu de pausa) cria um salvamento manual.
//  • Checkpoints: ao entrar em cada etapa e no início de cada desafio.
//    Se a missão falhar (solo ou multiplayer), dá para recomeçar dali.
// ============================================================
'use strict';

const SAVES_KEY = 'pontes01_saves_v2';
const CP_KEY = 'pontes01_checkpoint_v1';
const OLD_SAVE_KEY = 'pontes01_game_v1';
const MAX_AUTO = 6, MAX_MANUAL = 6;
const SCENE_NAMES = {
  earth: K('Terra', 'Earth', 'Tierra'), setup: K('Montagem', 'Build', 'Montaje'), launch: K('Decolagem', 'Launch', 'Despegue'),
  ship: K('Viagem', 'Trip', 'Viaje'), station: K('Estação Ponte-Alfa', 'Ponte-Alfa Station', 'Estación Ponte-Alfa'), detour: K('Desvio de rota', 'Route detour', 'Desvío de ruta'),
  planet: K('Órbita de Pontes-01b', 'Pontes-01b orbit', 'Órbita de Pontes-01b'), migration: K('Migração', 'Migration', 'Migración'), colony: K('Colônia', 'Colony', 'Colonia'), end: K('Fim', 'End', 'Fin'),
};
const clone = o => JSON.parse(JSON.stringify(o));

const GameSave = {
  t: 0, lastScene: null, lastEv: null, cp: null,
  canSave() { return !!(S && U.screen === 'game' && Net.role !== 'client' && !S.fail && !['intro', 'end'].includes(S.scene)); },
  list() {
    let l = [];
    try { l = JSON.parse(localStorage.getItem(SAVES_KEY)) || []; } catch (e) { l = []; }
    // migra o salvamento antigo (versão de um único jogo)
    try {
      const old = JSON.parse(localStorage.getItem(OLD_SAVE_KEY));
      if (old && old.S) { old.S.runId = old.S.runId || old.at || Date.now(); l.push({ id: 'a' + old.S.runId, auto: true, at: old.at || Date.now(), data: old }); localStorage.removeItem(OLD_SAVE_KEY); this.store(l); }
    } catch (e) { /* */ }
    return l.sort((a, b) => b.at - a.at);
  },
  store(l) {
    // se faltar espaço, apaga os mais antigos até caber
    for (let n = 0; n < 20; n++) {
      try { localStorage.setItem(SAVES_KEY, JSON.stringify(l)); return true; }
      catch (e) { if (l.length <= 1) return false; l.sort((a, b) => b.at - a.at); l.pop(); }
    }
    return false;
  },
  snapshot() {
    const E = U.earth ? { t: U.earth.t, limit: U.earth.limit, p: U.earth.p, read: U.earth.read, greeted: U.earth.greeted } : null;
    if (!S.runId) S.runId = Date.now();
    return { v: 2, at: Date.now(), S, U: { earth: E, comms: U.comms || 0, setupStep: U.setupStep || 0 } };
  },
  write(manual) {
    if (!this.canSave()) return false;
    const data = this.snapshot();
    const l = this.list();
    let ok;
    if (manual) {
      l.push({ id: 'm' + Date.now(), auto: false, at: Date.now(), data });
      const man = l.filter(x => !x.auto).sort((a, b) => b.at - a.at);
      man.slice(MAX_MANUAL).forEach(x => l.splice(l.indexOf(x), 1));
      ok = this.store(l);
      toast(ok ? K('💾 Progresso salvo. Veja em “Jogos salvos”.', '💾 Progress saved. See it in “Saved games”.', '💾 Progreso guardado. Véalo en “Partidas guardadas”.') : K('Não foi possível salvar neste navegador.', 'Could not save in this browser.', 'No se pudo guardar en este navegador.'), ok ? 'good' : 'warn');
      return ok;
    }
    const id = 'a' + S.runId;
    const i = l.findIndex(x => x.id === id);
    const entry = { id, auto: true, at: Date.now(), data };
    if (i >= 0) l[i] = entry; else l.push(entry);
    const autos = l.filter(x => x.auto).sort((a, b) => b.at - a.at);
    autos.slice(MAX_AUTO).forEach(x => l.splice(l.indexOf(x), 1));
    return this.store(l);
  },
  read() { const l = this.list(); const a = l.find(x => x.auto && !x.done) || l[0]; return a ? a.data : null; },
  clear() { /* jogos anteriores ficam guardados; apague pela aba Jogos salvos */ },
  remove(id) { const l = this.list().filter(x => x.id !== id); this.store(l); },
  describe(e) {
    const s = e.data.S;
    return { name: (s.crew && s.crew[0] && s.crew[0].name) || 'Comandante', journey: s.journey === 'curta' ? K('Jornada Curta', 'Short Journey', 'Jornada Corta') : K('Jornada Completa', 'Full Journey', 'Jornada Completa'),
      scene: SCENE_NAMES[s.scene] || K(s.scene, s.scene, s.scene), day: s.day, points: s.points, multi: s.mode === 'host', done: !!e.done, at: e.at, auto: e.auto };
  },
  summary() {
    const l = this.list(); const e = l.find(x => !x.done); if (!e) return null;
    const d = this.describe(e); return { day: d.day, scene: L(d.scene), at: d.at, id: e.id };
  },
  apply(d) {
    S = clone(d.S);
    if (Net.role === 'host') { S.mode = 'host'; S.crew.forEach(c => { c.owner = c.id === 'cmd' ? 'host' : null; }); Net.assignSeats(); }
    else { if (Net.role) Net.leave(true); S.mode = 'solo'; S.crew.forEach(c => { c.owner = c.id === 'cmd' ? 'host' : null; }); }
    S.crew.forEach(c => { if (c.task && c.task.called) c.task = null; });
    S.paused = false; S.fast = 0;
    if (S.scene === 'launch') { S.scene = 'ship'; S.stage = 1; }
    U.screen = 'game'; U.panel = null; U.me = 'cmd'; U.help = false; U.cache = {};
    U.comms = (d.U && d.U.comms) || 0; U.setupStep = (d.U && d.U.setupStep) || 0; U.setupDirty = true;
    if (S.scene === 'earth') { cityInit(); if (d.U && d.U.earth) Object.assign(U.earth, d.U.earth); U.comms = (d.U && d.U.comms) || 0; }
    this.lastScene = S.scene; this.lastEv = S.event ? S.event.id : null; this.t = 0;
    if (typeof enterGameFullscreen === 'function') enterGameFullscreen();
  },
  load(id) {
    const l = this.list(); const e = id ? l.find(x => x.id === id) : (l.find(x => !x.done) || l[0]);
    if (!e) return false;
    this.cp = null; try { localStorage.removeItem(CP_KEY); } catch (er) { /* */ }
    this.apply(e.data);
    toast(K('Jornada retomada.', 'Journey resumed.', 'Jornada reanudada.'), 'good');
    return true;
  },

  // ---------- checkpoints (recomeçar da missão que falhou) ----------
  checkpoint(label) {
    if (!S || S.fail || Net.role === 'client' || ['intro', 'end', 'earth', 'setup', 'launch'].includes(S.scene)) return;
    if (!S.runId) S.runId = Date.now();
    this.cp = { label, at: Date.now(), runId: S.runId, data: { S: clone(S), U: { comms: U.comms || 0 } } };
    try { localStorage.setItem(CP_KEY, JSON.stringify(this.cp)); } catch (e) { /* só fica na memória */ }
  },
  checkpointFor() {
    let cp = this.cp;
    if (!cp) { try { cp = JSON.parse(localStorage.getItem(CP_KEY)); } catch (e) { cp = null; } }
    return cp && S && cp.runId === S.runId ? cp : null;
  },
  retry() {
    if (Net.role === 'client') return;
    const cp = this.checkpointFor(); if (!cp) return false;
    Narrator.stop();
    this.apply(cp.data);
    S.retries = (S.retries || 0) + 1;
    this.cp = cp; // o mesmo ponto continua valendo para novas tentativas
    toast({ pt: '↺ Recomeçando da missão: ' + L(cp.label), en: '↺ Restarting from mission: ' + L(cp.label), es: '↺ Reiniciando desde la misión: ' + L(cp.label) }, 'good');
    if (S.event && S.event.phase === 'run') { S.event.phase = 'warn'; S.event.warnT = 15; } // o desafio recomeça do aviso
    return true;
  },

  tick(dt) {
    if (!S || U.screen !== 'game' || Net.role === 'client') return;
    if (S.scene === 'end') {
      if (!this.endMarked) { this.endMarked = true; if (S.ending && S.ending.ok) { const l = this.list(); const e = l.find(x => x.id === 'a' + S.runId); if (e) { e.done = true; this.store(l); } } }
      return;
    }
    this.endMarked = false;
    // checkpoints: ao entrar em cada etapa e no início de cada desafio
    if (S.scene !== this.lastScene) { this.lastScene = S.scene; this.checkpoint(SCENE_NAMES[S.scene]); this.t = 0; if (this.canSave()) this.write(); return; }
    const evId = S.event ? S.event.id : null;
    if (evId !== this.lastEv) { this.lastEv = evId; if (S.event && S.event.phase === 'warn') { const info = EVENT_INFO[S.event.type]; this.checkpointEvent(info); } }
    if (!this.canSave()) return;
    this.t += dt;
    if (this.t >= 15) { this.t = 0; this.write(); }
  },
  checkpointEvent(info) {
    // o checkpoint do desafio guarda o estado antes do desafio começar (fase de aviso)
    this.checkpoint(K(info.icon + ' ' + info.title, info.icon + ' ' + T(info.title), info.icon + ' ' + T(info.title)));
  },
};
window.addEventListener('beforeunload', () => GameSave.write());
window.addEventListener('visibilitychange', () => { if (document.hidden) GameSave.write(); });

UIH.continueGame = () => { if (GameSave.load()) Sfx.ok(); };
UIH.saveNow = () => { GameSave.write(true); };
UIH.saves = () => { U.screen = 'saves'; U.delAsk = null; };
UIH.loadSave = id => { if (GameSave.load(id)) Sfx.ok(); };
UIH.delSaveAsk = id => { U.delAsk = id; };
UIH.delSave = id => { GameSave.remove(id); U.delAsk = null; Sfx.click(); };
UIH.retryMission = () => { if (GameSave.retry()) Sfx.ok(); };

// aba "Jogos salvos"
function savesScreen() {
  const l = GameSave.list();
  const fmtDate = t => new Date(t).toLocaleString(I18n.lang === 'pt' ? 'pt-BR' : I18n.lang === 'es' ? 'es-ES' : 'en-US', { dateStyle: 'short', timeStyle: 'short' });
  const rows = l.map(e => {
    const d = GameSave.describe(e);
    return `<div class="saverow ${d.done ? 'done' : ''}"><div class="sv-ic">${d.done ? '🏁' : d.auto ? '🔄' : '💾'}</div>
      <div class="sv-info"><b>${esc(d.name)} · ${esc(L(d.journey))}${d.multi ? ' · 👥' : ''}</b><span>${esc(L(d.scene))} · ${esc(L(K('dia', 'day', 'día')))} ${d.day} · ✦ ${d.points} ${esc(L(K('pontos', 'points', 'puntos')))}</span>
      <small>${d.auto ? esc(L(K('Salvamento automático', 'Autosave', 'Guardado automático'))) : esc(L(K('Salvo manualmente', 'Saved manually', 'Guardado manualmente')))} · ${fmtDate(e.at)}${d.done ? ' · ' + esc(L(K('jornada concluída', 'journey completed', 'jornada completada'))) : ''}</small></div>
      <div class="sv-btns"><button class="btn primary small" data-ui="loadSave" data-arg="${e.id}">▶ ${esc(L(K('Abrir', 'Open', 'Abrir')))}</button>
      ${U.delAsk === e.id ? `<button class="btn small red" data-ui="delSave" data-arg="${e.id}">${esc(L(K('Confirmar', 'Confirm', 'Confirmar')))}</button>` : `<button class="btn small" data-ui="delSaveAsk" data-arg="${e.id}">🗑</button>`}</div></div>`;
  }).join('');
  return `<div class="panel center wide scroll"><h2>📂 ${esc(L(K('JOGOS SALVOS', 'SAVED GAMES', 'PARTIDAS GUARDADAS')))}</h2>
    <p class="muted small">${esc(L(K('Cada jornada é salva sozinha. Começar uma nova não apaga as anteriores. No menu de pausa, “Salvar progresso” cria um salvamento extra.', 'Each journey saves itself. Starting a new one does not erase the previous ones. In the pause menu, “Save progress” makes an extra save.', 'Cada jornada se guarda sola. Empezar una nueva no borra las anteriores. En el menú de pausa, “Guardar progreso” crea un guardado extra.')))}</p>
    ${rows || `<p class="muted">${esc(L(K('Nenhum jogo salvo ainda.', 'No saved games yet.', 'Aún no hay partidas guardadas.')))}</p>`}
    <div class="row"><button class="btn" data-ui="title">◀ ${esc(L(K('Voltar', 'Back', 'Volver')))} <kbd>Esc</kbd></button></div></div>`;
}
// bloco "recomeçar" na tela de derrota
function retryBlock() {
  if (!S || !S.fail) return '';
  if (Net.role === 'client') return `<div class="alert info">${esc(L(K('O Comandante pode recomeçar da missão que falhou. Aguarde…', 'The Commander can restart from the failed mission. Please wait…', 'El Comandante puede reiniciar desde la misión fallida. Espere…')))}</div>`;
  const cp = GameSave.checkpointFor();
  if (!cp) return '';
  return `<div class="retry"><button class="btn primary big" data-ui="retryMission">↺ ${esc(L(K('Recomeçar da missão', 'Restart from the mission', 'Reiniciar desde la misión')))}: ${esc(L(cp.label))}</button>
    <p class="small muted">${esc(L(K('Volta ao início da etapa ou do desafio em que a missão falhou, com os recursos daquele momento.', 'Goes back to the start of the stage or challenge where the mission failed, with the resources from that moment.', 'Vuelve al inicio de la etapa o del desafío en que falló la misión, con los recursos de ese momento.')))}${S.retries ? ' · ' + esc(L(K('tentativas', 'retries', 'intentos'))) + ': ' + S.retries : ''}</p></div>`;
}
