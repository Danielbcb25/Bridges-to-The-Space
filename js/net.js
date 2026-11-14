// ============================================================
//  MULTIPLAYER — até 6 jogadores na tripulação (+ Comandante/host)
//  O host simula tudo; os tripulantes enviam posição e ações.
//  Servidor: node server/server.js
// ============================================================
'use strict';

const Net = {
  ws: null, role: null, room: null, players: {}, myRoleName: null, sendT: 0, posT: 0,
  connect(url, onOpen) {
    this.leave(true);
    let ws;
    try { ws = new WebSocket(url); } catch (e) { return this.err('URL inválida.'); }
    this.ws = ws;
    ws.onopen = onOpen;
    ws.onmessage = ev => { let m; try { m = JSON.parse(ev.data); } catch (e) { return; } this.onMsg(m); };
    ws.onerror = () => this.err('Não foi possível conectar ao servidor. Rode “node server/server.js” e abra o jogo por ele.');
    ws.onclose = () => { if (this.ws === ws) { const was = this.role; this.ws = null; this.role = null; if (was === 'client') { S = null; U.screen = 'lobby'; this.err('Conexão encerrada.'); } } };
  },
  err(t) { U.lobby = Object.assign({}, U.lobby, { err: t }); },
  send(m) { if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify(m)); },
  host(url) { this.connect(url, () => this.send({ t: 'host' })); },
  join(url, code) {
    if (!code) return this.err('Digite o código da sala.');
    const av = Object.assign({}, DEFAULT_AVATAR, Save.data.avatar || {});
    this.connect(url, () => this.send({ t: 'join', code, name: av.name || 'Tripulante', avatar: av }));
  },
  leave(silent) {
    if (this.ws) { try { this.ws.close(); } catch (e) { /* */ } }
    this.ws = null; this.role = null; this.room = null; this.players = {};
    if (S) S.crew.forEach(c => { if (c.owner && c.owner !== 'host') c.owner = null; });
    if (!silent) U.lobby = null;
  },
  onMsg(m) {
    switch (m.t) {
      case 'room': this.role = 'host'; this.room = m.code; U.screen = 'lobby'; U.lobby = Object.assign({}, U.lobby, { err: '' }); break;
      case 'error': this.err(m.msg); break;
      // ---- host ----
      case 'join': {
        if (this.role !== 'host') return;
        const taken = Object.values(this.players).map(p => p.role);
        const free = ROLES.find(r => !taken.includes(r.id));
        if (!free) { this.send({ t: 'to', pid: m.pid, msg: { t: 'error', msg: 'Sala cheia (6 tripulantes).' } }); return; }
        this.players[m.pid] = { name: String(m.name || 'Tripulante').slice(0, 14), role: free.id, avatar: m.avatar };
        this.send({ t: 'to', pid: m.pid, msg: { t: 'welcome', crew: free.id, roleName: free.name, code: this.room } });
        if (S) this.assignSeats();
        if (S) toast(`${this.players[m.pid].name} entrou como ${free.name}.`);
        break;
      }
      case 'leave': {
        const p = this.players[m.pid]; if (!p) return;
        delete this.players[m.pid];
        if (S) { const c = crewById(p.role); if (c) { c.owner = null; c.task = null; } toast(`${p.name} saiu. Um bot assumiu.`); }
        break;
      }
      case 'pos': {
        const p = this.players[m.pid]; if (!p || !S) return;
        const c = crewById(p.role); if (!c || !c.alive) return;
        Object.assign(c, { x: clamp(+m.x || 0, 40, WORLD_W - 40), deck: m.deck === 'L' ? 'L' : 'U', face: m.face > 0 ? 1 : -1, moving: !!m.moving, walkT: +m.walkT || 0, climb: +m.climb || 0, climbTo: m.climbTo === 'L' ? 'L' : 'U' });
        c.tx = c.x; c.tdeck = c.deck;
        break;
      }
      case 'act': {
        const p = this.players[m.pid]; if (!p || !S) return;
        if (typeof m.type !== 'string' || !ACTIONS[m.type]) return;
        const blocked = ['cruise', 'fund', 'leaveStation', 'land', 'chooseSite', 'toMigration', 'chooseExo', 'trade', 'ration', 'hibernate'];
        if (blocked.includes(m.type)) return; // decisões do Comandante
        applyAction(m.type, m.p, p.role);
        break;
      }
      // ---- cliente ----
      case 'welcome': this.role = 'client'; this.room = m.code; U.me = m.crew; this.myRoleName = m.roleName; U.screen = 'lobby'; break;
      case 'state': {
        if (this.role !== 'client') return;
        const keep = S && crewById(U.me);
        const local = keep ? { x: keep.x, deck: keep.deck, face: keep.face, moving: keep.moving, walkT: keep.walkT, climb: keep.climb, climbTo: keep.climbTo, tx: keep.tx, tdeck: keep.tdeck } : null;
        const prevScene = S && S.scene;
        S = m.S;
        const mine = crewById(U.me);
        if (local && mine && prevScene === S.scene) { const task = mine.task; Object.assign(mine, local); mine.task = task; }
        U.screen = 'game';
        break;
      }
      case 'closed': S = null; U.screen = 'lobby'; this.role = null; this.err('O Comandante fechou a sala.'); break;
    }
  },
  assignSeats() {
    if (!S) return;
    for (const pid in this.players) {
      const p = this.players[pid]; const c = crewById(p.role); if (!c) continue;
      c.owner = pid; c.name = p.name; if (p.avatar) c.avatar = Object.assign({}, DEFAULT_AVATAR, p.avatar, { name: p.name });
    }
  },
  tick(dt) {
    if (!this.ws || this.ws.readyState !== 1) return;
    if (this.role === 'host' && S) {
      this.sendT -= dt;
      if (this.sendT <= 0) { this.sendT = 0.2; this.send({ t: 'bcast', msg: { t: 'state', S } }); }
    }
    if (this.role === 'client' && S && S.scene === 'ship') {
      this.posT -= dt;
      const c = crewById(U.me);
      if (this.posT <= 0 && c) { this.posT = 0.1; this.send({ t: 'pos', x: c.x, deck: c.deck, face: c.face, moving: c.moving, walkT: c.walkT, climb: c.climb, climbTo: c.climbTo }); }
    }
  },
};
