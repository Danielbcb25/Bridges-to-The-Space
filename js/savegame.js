// ============================================================
//  SALVAR PROGRESSO — salvamento automático da jornada (solo/host)
//  • Salva a cada 15 s, ao trocar de cena e ao fechar a aba.
//  • "Continuar" na tela de título retoma de onde parou.
//  • No fim da jornada (vitória ou derrota) o salvamento é apagado.
// ============================================================
'use strict';

const GAME_SAVE_KEY = 'pontes01_game_v1';
const GameSave = {
  t: 0, lastScene: null,
  canSave() { return !!(S && U.screen === 'game' && Net.role !== 'client' && !S.fail && !['intro', 'end'].includes(S.scene)); },
  write(manual) {
    if (!this.canSave()) return false;
    try {
      const E = U.earth ? { t: U.earth.t, limit: U.earth.limit, p: U.earth.p, read: U.earth.read } : null;
      const data = { v: 1, at: Date.now(), S, U: { earth: E, comms: U.comms || 0, setupStep: U.setupStep || 0 } };
      localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(data));
      if (manual) toast('💾 Progresso salvo.', 'good');
      return true;
    } catch (e) { if (manual) toast('Não foi possível salvar neste navegador.', 'warn'); return false; }
  },
  read() { try { const d = JSON.parse(localStorage.getItem(GAME_SAVE_KEY)); return d && d.v === 1 && d.S ? d : null; } catch (e) { return null; } },
  clear() { try { localStorage.removeItem(GAME_SAVE_KEY); } catch (e) { /* */ } },
  // resumo para o botão "Continuar"
  summary() {
    const d = this.read(); if (!d) return null;
    const names = { earth: 'Terra', setup: 'Montagem', launch: 'Viagem', ship: 'Viagem', station: 'Estação', detour: 'Desvio', planet: 'Órbita', migration: 'Migração', colony: 'Colônia' };
    return { day: d.S.day, scene: L(names[d.S.scene] || K(d.S.scene, d.S.scene, d.S.scene)), at: d.at };
  },
  load() {
    const d = this.read(); if (!d) return false;
    if (Net.role) Net.leave(true);
    S = d.S;
    S.mode = 'solo';
    S.crew.forEach(c => { c.owner = c.id === 'cmd' ? 'host' : null; if (c.task && c.task.called) c.task = null; });
    S.paused = false; S.fast = 0;
    if (S.scene === 'launch') { S.scene = 'ship'; S.stage = 1; }
    U.screen = 'game'; U.panel = null; U.me = 'cmd'; U.help = false;
    U.comms = d.U.comms || 0; U.setupStep = d.U.setupStep || 0; U.setupDirty = true;
    if (S.scene === 'earth') { cityInit(); if (d.U.earth) Object.assign(U.earth, d.U.earth); U.comms = d.U.comms || 0; }
    this.lastScene = S.scene; this.t = 0;
    if (typeof enterGameFullscreen === 'function') enterGameFullscreen();
    toast('Jornada retomada.', 'good');
    return true;
  },
  tick(dt) {
    if (S && S.scene === 'end' && U.screen === 'game' && Net.role !== 'client') { if (this.read()) this.clear(); return; }
    if (!this.canSave()) return;
    this.t += dt;
    if (S.scene !== this.lastScene) { this.lastScene = S.scene; this.t = 0; this.write(); return; }
    if (this.t >= 15) { this.t = 0; this.write(); }
  },
};
window.addEventListener('beforeunload', () => GameSave.write());
window.addEventListener('visibilitychange', () => { if (document.hidden) GameSave.write(); });

UIH.continueGame = () => { if (GameSave.load()) Sfx.ok(); };
UIH.saveNow = () => { GameSave.write(true); };
