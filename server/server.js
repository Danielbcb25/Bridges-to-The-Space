// ============================================================
//  Servidor do Pontes01 — arquivos estáticos + WebSocket (sem dependências)
//  Uso: node server/server.js  [porta]   → http://localhost:8080
// ============================================================
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const PORT = +(process.argv[2] || process.env.PORT || 8080);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.mp3': 'audio/mpeg', '.json': 'application/json', '.svg': 'image/svg+xml', '.md': 'text/plain; charset=utf-8' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.resolve(ROOT, '.' + p);
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end(); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('404'); }
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const range = req.headers.range;
    if (range && type === 'audio/mpeg') {
      const m = /bytes=(\d*)-(\d*)/.exec(range); const start = +m[1] || 0; const end = m[2] ? +m[2] : st.size - 1;
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes' });
    fs.createReadStream(file).pipe(res);
  });
});

// ---------- WebSocket mínimo (RFC 6455, só texto) ----------
function wsSend(sock, str) {
  if (sock.destroyed) return;
  const data = Buffer.from(str);
  let head;
  if (data.length < 126) head = Buffer.from([0x81, data.length]);
  else if (data.length < 65536) { head = Buffer.alloc(4); head[0] = 0x81; head[1] = 126; head.writeUInt16BE(data.length, 2); }
  else { head = Buffer.alloc(10); head[0] = 0x81; head[1] = 127; head.writeBigUInt64BE(BigInt(data.length), 2); }
  sock.write(Buffer.concat([head, data]));
}
function wsParse(conn, chunk, onText) {
  conn.buf = Buffer.concat([conn.buf, chunk]);
  while (conn.buf.length >= 2) {
    const b0 = conn.buf[0], b1 = conn.buf[1];
    const op = b0 & 0x0f, fin = b0 & 0x80, masked = b1 & 0x80;
    let len = b1 & 0x7f, off = 2;
    if (len === 126) { if (conn.buf.length < 4) return; len = conn.buf.readUInt16BE(2); off = 4; }
    else if (len === 127) { if (conn.buf.length < 10) return; len = Number(conn.buf.readBigUInt64BE(2)); off = 10; }
    if (len > 8 * 1024 * 1024) { conn.sock.destroy(); return; }
    const mOff = off; if (masked) off += 4;
    if (conn.buf.length < off + len) return;
    let payload = conn.buf.subarray(off, off + len);
    if (masked) { const mask = conn.buf.subarray(mOff, mOff + 4); payload = Buffer.from(payload); for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i & 3]; }
    conn.buf = conn.buf.subarray(off + len);
    if (op === 0x8) { conn.sock.end(Buffer.from([0x88, 0])); return; }
    if (op === 0x9) { conn.sock.write(Buffer.concat([Buffer.from([0x8a, payload.length]), payload])); continue; }
    if (op === 0x1 || op === 0x0) { conn.frag = (conn.frag || '') + payload.toString('utf8'); if (fin) { const t = conn.frag; conn.frag = ''; onText(t); } }
  }
}

const rooms = new Map(); // code -> { host, clients: Map(pid -> conn) }
let nextPid = 1;
const code = () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c; do { c = ''; for (let i = 0; i < 5; i++) c += A[Math.floor(Math.random() * A.length)]; } while (rooms.has(c)); return c; };

server.on('upgrade', (req, sock) => {
  if (!req.url.startsWith('/ws')) return sock.destroy();
  const key = req.headers['sec-websocket-key'];
  if (!key) return sock.destroy();
  const accept = crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  sock.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
  sock.setNoDelay(true);
  const conn = { sock, buf: Buffer.alloc(0), pid: nextPid++, room: null, isHost: false };
  const send = o => wsSend(sock, JSON.stringify(o));
  sock.on('data', chunk => wsParse(conn, chunk, txt => {
    let m; try { m = JSON.parse(txt); } catch (e) { return; }
    if (m.t === 'host' && !conn.room) {
      const c = code(); rooms.set(c, { host: conn, clients: new Map() }); conn.room = c; conn.isHost = true;
      send({ t: 'room', code: c }); return;
    }
    if (m.t === 'join' && !conn.room) {
      const r = rooms.get(String(m.code || '').toUpperCase());
      if (!r) return send({ t: 'error', msg: 'Sala não encontrada.' });
      if (r.clients.size >= 28) return send({ t: 'error', msg: 'Sala cheia.' });
      conn.room = String(m.code).toUpperCase(); r.clients.set(conn.pid, conn);
      wsSend(r.host.sock, JSON.stringify({ t: 'join', pid: conn.pid, name: m.name, avatar: m.avatar, ship: m.ship })); return;
    }
    const r = conn.room && rooms.get(conn.room); if (!r) return;
    if (conn.isHost) {
      if (m.t === 'bcast') { const s = JSON.stringify(m.msg); for (const c of r.clients.values()) wsSend(c.sock, s); }
      if (m.t === 'to') { const c = r.clients.get(m.pid); if (c) wsSend(c.sock, JSON.stringify(m.msg)); }
    } else {
      m.pid = conn.pid;
      wsSend(r.host.sock, JSON.stringify(m));
    }
  }));
  const bye = () => {
    const r = conn.room && rooms.get(conn.room); if (!r) return;
    if (conn.isHost) { for (const c of r.clients.values()) { wsSend(c.sock, JSON.stringify({ t: 'closed' })); } rooms.delete(conn.room); }
    else { r.clients.delete(conn.pid); wsSend(r.host.sock, JSON.stringify({ t: 'leave', pid: conn.pid })); }
    conn.room = null;
  };
  sock.on('close', bye); sock.on('error', bye);
});

server.listen(PORT, () => console.log(`Pontes01 rodando em http://localhost:${PORT}  (WebSocket em /ws)`));
