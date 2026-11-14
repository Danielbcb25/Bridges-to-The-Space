// ============================================================
//  MULTIPLAYER — até 6 jogadores na tripulação (+ Comandante/host)
//  O host simula tudo; os tripulantes enviam posição e ações.
//  Servidor: node server/server.js
// ============================================================
'use strict';

// Transporte:
//  • "p2p" (padrão): WebRTC via PeerJS — funciona em sites estáticos (Vercel,
//    GitHub Pages) sem servidor próprio e sem VPN. O host vira o "servidor".
//  • "ws": servidor próprio opcional (node server/server.js).
const PEER_PREFIX = 'pontes01-v1-';
const PEER_ICE = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' },
  // relé TURN público (Open Relay Project) para redes que bloqueiam conexão direta
  { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' },
];
const roomCode = () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c = ''; for (let i = 0; i < 5; i++) c += A[Math.floor(Math.random() * A.length)]; return c; };

const Net = {
  ws: null, peer: null, conn: null, conns: {}, nextPid: 1, mode: null, open: false,
  role: null, room: null, players: {}, myRoleName: null, sendT: 0, posT: 0,
  err(t) { U.lobby = Object.assign({}, U.lobby, { err: t, busy: false }); },
  info(t) { U.lobby = Object.assign({}, U.lobby, { err: '', busy: t }); },
  // ---------- envio ----------
  send(m) {
    if (this.mode === 'ws') { if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify(m)); return; }
    if (this.mode !== 'p2p') return;
    if (this.role === 'host') {
      if (m.t === 'bcast') { const s = JSON.stringify(m.msg); for (const pid in this.conns) { const c = this.conns[pid]; if (c.open) try { c.send(s); } catch (e) { /* */ } } }
      else if (m.t === 'to') { const c = this.conns[m.pid]; if (c && c.open) try { c.send(JSON.stringify(m.msg)); } catch (e) { /* */ } }
    } else if (this.conn && this.conn.open) { try { this.conn.send(JSON.stringify(m)); } catch (e) { /* */ } }
  },
  ready() { return this.mode === 'ws' ? !!(this.ws && this.ws.readyState === 1) : this.mode === 'p2p' && (this.role === 'host' ? !!this.peer && this.open : !!(this.conn && this.conn.open)); },
  // ---------- WebSocket (servidor próprio) ----------
  connectWS(url, onOpen) {
    this.leave(true);
    let ws;
    try { ws = new WebSocket(url); } catch (e) { return this.err(T('URL inválida.')); }
    this.ws = ws; this.mode = 'ws';
    ws.onopen = onOpen;
    ws.onmessage = ev => { let m; try { m = JSON.parse(ev.data); } catch (e) { return; } this.onMsg(m); };
    ws.onerror = () => this.err(T('Não foi possível conectar ao servidor. Rode “node server/server.js” e abra o jogo por ele.'));
    ws.onclose = () => { if (this.ws === ws) { const was = this.role; this.ws = null; this.role = null; this.mode = null; if (was === 'client') { S = null; U.screen = 'lobby'; this.err(T('Conexão encerrada.')); } } };
  },
  // ---------- P2P (PeerJS) ----------
  peerOpts() { return Object.assign({ debug: 0, config: { iceServers: PEER_ICE } }, window.PEER_OPTS || {}); },
  hasPeer() { if (typeof Peer === 'undefined') { this.err(T('Biblioteca de rede não carregou. Verifique a conexão.')); return false; } return true; },
  hostP2P(tries = 0) {
    this.leave(true); if (!this.hasPeer()) return;
    const code = roomCode();
    this.mode = 'p2p'; this.info(T('Criando sala...'));
    const peer = new Peer(PEER_PREFIX + code, this.peerOpts()); this.peer = peer;
    peer.on('open', () => { if (this.peer !== peer) return; this.open = true; this.onMsg({ t: 'room', code }); });
    peer.on('connection', conn => {
      const pid = String(this.nextPid++);
      conn.on('open', () => { this.conns[pid] = conn; });
      conn.on('data', d => {
        let m; try { m = typeof d === 'string' ? JSON.parse(d) : d; } catch (e) { return; }
        if (!m || typeof m !== 'object') return;
        if (m.t === 'join' && Object.keys(this.players).length >= 6) { try { conn.send(JSON.stringify({ t: 'error', msg: T('Sala cheia.') })); } catch (e) { /* */ } return; }
        m.pid = pid; this.onMsg(m);
      });
      const bye = () => { if (!this.conns[pid]) return; delete this.conns[pid]; this.onMsg({ t: 'leave', pid }); };
      conn.on('close', bye); conn.on('error', bye);
    });
    peer.on('error', e => {
      if (this.peer !== peer) return;
      if (e.type === 'unavailable-id' && tries < 3) return this.hostP2P(tries + 1);
      this.err(T('Erro de conexão online') + ' (' + e.type + ').');
    });
    peer.on('disconnected', () => { if (this.peer === peer && !peer.destroyed) try { peer.reconnect(); } catch (e) { /* */ } });
  },
  joinP2P(code, hello) {
    this.leave(true); if (!this.hasPeer()) return;
    this.mode = 'p2p'; this.info(T('Conectando...'));
    const peer = new Peer(this.peerOpts()); this.peer = peer;
    const timer = setTimeout(() => { if (this.peer === peer && !(this.conn && this.conn.open)) this.err(T('Não foi possível alcançar a sala. Confira o código e tente de novo.')); }, 20000);
    peer.on('open', () => {
      const conn = peer.connect(PEER_PREFIX + code, { reliable: true }); this.conn = conn;
      conn.on('open', () => { clearTimeout(timer); this.room = code; this.send(hello); });
      conn.on('data', d => { let m; try { m = typeof d === 'string' ? JSON.parse(d) : d; } catch (e) { return; } this.onMsg(m); });
      conn.on('close', () => { if (this.conn === conn && this.role === 'client') this.onMsg({ t: 'closed' }); });
    });
    peer.on('error', e => {
      if (this.peer !== peer) return;
      clearTimeout(timer);
      this.err(e.type === 'peer-unavailable' ? T('Sala não encontrada.') : T('Erro de conexão online') + ' (' + e.type + ').');
    });
  },
  // ---------- API usada pela interface ----------
  host(url) { if (url) this.connectWS(url, () => this.send({ t: 'host' })); else this.hostP2P(); },
  join(url, code) {
    if (!code) return this.err(T('Digite o código da sala.'));
    const av = Object.assign({}, DEFAULT_AVATAR, Save.data.avatar || {});
    const hello = { t: 'join', code, name: av.name || 'Tripulante', avatar: av };
    if (url) this.connectWS(url, () => this.send(hello)); else this.joinP2P(code, hello);
  },
  leave(silent) {
    if (this.ws) { try { this.ws.close(); } catch (e) { /* */ } }
    if (this.conn) { try { this.conn.close(); } catch (e) { /* */ } }
    for (const pid in this.conns) { try { this.conns[pid].close(); } catch (e) { /* */ } }
    if (this.peer) { try { this.peer.destroy(); } catch (e) { /* */ } }
    this.ws = null; this.peer = null; this.conn = null; this.conns = {}; this.open = false; this.mode = null;
    this.role = null; this.room = null; this.players = {};
    if (typeof S !== 'undefined' && S) S.crew.forEach(c => { if (c.owner && c.owner !== 'host') c.owner = null; });
    if (!silent) U.lobby = null;
  },
  onMsg(m) {
    switch (m.t) {
      case 'room': this.role = 'host'; this.room = m.code; U.screen = 'lobby'; U.lobby = Object.assign({}, U.lobby, { err: '', busy: false }); break;
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
        const nm = this.players[m.pid].name;
        const rn = l => (I18N_DICT[l] && I18N_DICT[l][free.name]) || free.name;
        Chat.sysAll(K(`${nm} entrou como ${free.name}.`, `${nm} joined as ${rn('en')}.`, `${nm} entró como ${rn('es')}.`), 'join');
        if (S) toast(`${nm} entrou como ${free.name}.`);
        break;
      }
      case 'leave': {
        const p = this.players[m.pid]; if (!p) return;
        delete this.players[m.pid];
        Chat.sysAll(K(`${p.name} saiu da sala.`, `${p.name} left the room.`, `${p.name} salió de la sala.`), 'join');
        if (S) { const c = crewById(p.role); if (c) { c.owner = null; c.task = null; } toast(`${p.name} saiu. Um bot assumiu.`); }
        break;
      }
      case 'pos': {
        const p = this.players[m.pid]; if (!p || !S) return;
        const c = crewById(p.role); if (!c || !c.alive) return;
        Object.assign(c, { x: clamp(+m.x || 0, 20, (S.scene === 'colony' ? COLONY_W : WORLD_W) - 20), deck: m.deck === 'L' ? 'L' : 'U', face: m.face > 0 ? 1 : -1, moving: !!m.moving, walkT: +m.walkT || 0, climb: +m.climb || 0, climbTo: m.climbTo === 'L' ? 'L' : 'U', jy: clamp(+m.jy || 0, 0, 40) });
        c.tx = c.x; c.tdeck = c.deck;
        break;
      }
      case 'act': {
        const p = this.players[m.pid]; if (!p || !S) return;
        if (typeof m.type !== 'string' || !ACTIONS[m.type]) return;
        const blocked = ['cruise', 'fund', 'leaveStation', 'land', 'chooseSite', 'toMigration', 'chooseExo', 'setDest', 'detourReturn', 'trade', 'ration', 'hibernate'];
        if (blocked.includes(m.type)) return; // decisões do Comandante
        applyAction(m.type, m.p, p.role);
        break;
      }
      case 'chat': if (this.role === 'host') Chat.fromPlayer(m.pid, m.text); else if (this.role === 'client') Chat.fromNet(m.m); break;
      // ---- cliente ----
      case 'welcome': U.lobby = Object.assign({}, U.lobby, { err: '', busy: false }); this.role = 'client'; this.room = m.code; U.me = m.crew; this.myRoleName = m.roleName; U.screen = 'lobby'; break;
      case 'state': {
        if (this.role !== 'client') return;
        const keep = S && crewById(U.me);
        const local = keep ? { x: keep.x, deck: keep.deck, face: keep.face, moving: keep.moving, walkT: keep.walkT, climb: keep.climb, climbTo: keep.climbTo, tx: keep.tx, tdeck: keep.tdeck, jy: keep.jy, jv: keep.jv, jg: keep.jg } : null;
        const prevScene = S && S.scene;
        S = m.S;
        const mine = crewById(U.me);
        if (local && mine && prevScene === S.scene) { const task = mine.task; Object.assign(mine, local); mine.task = task; }
        U.screen = 'game';
        break;
      }
      case 'closed': { const was = this.role; this.leave(true); if (was === 'client') { S = null; U.screen = 'lobby'; this.err(T('O Comandante fechou a sala.')); } break; }
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
    if (!this.ready()) return;
    if (this.role === 'host' && S) {
      this.sendT -= dt;
      if (this.sendT <= 0) { this.sendT = 0.2; this.send({ t: 'bcast', msg: { t: 'state', S } }); }
    }
    if (this.role === 'client' && S && (S.scene === 'ship' || S.scene === 'colony')) {
      this.posT -= dt;
      const c = crewById(U.me);
      if (this.posT <= 0 && c) { this.posT = 0.1; this.send({ t: 'pos', x: c.x, deck: c.deck, face: c.face, moving: c.moving, walkT: c.walkT, climb: c.climb, climbTo: c.climbTo, jy: Math.round((c.jy || 0) * 10) / 10 }); }
    }
  },
};
