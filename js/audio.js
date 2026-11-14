// ============================================================
//  ÁUDIO — trilha sonora (MP3 da pasta .claude), efeitos e narração
// ============================================================
'use strict';

const Music = {
  cur: null, curKey: null, list: [], idx: 0, unlocked: false, fadeTimer: null,
  vol() { return Save.data.settings.music; },
  play(key) {
    if (key === this.curKey) return;
    this.curKey = key;
    this.list = key === 'intro' ? [ASSETS.intro] : (key === 'heroic' ? ASSETS.heroic.slice() : ASSETS.fase.slice());
    this.idx = Math.floor(Math.random() * this.list.length);
    if (this.unlocked) this._start();
  },
  _start() {
    const old = this.cur;
    if (old) this._fadeOut(old);
    if (!this.list.length) return;
    const a = new Audio(this.list[this.idx]);
    a.loop = this.list.length === 1;
    a.volume = 0;
    a.addEventListener('ended', () => { if (this.cur === a) { this.idx = (this.idx + 1) % this.list.length; this._start(); } });
    this.cur = a;
    a.play().catch(() => {});
    this._fadeIn(a);
  },
  _fadeIn(a) {
    const target = this.vol() * (Narrator.speaking ? 0.35 : 1);
    const step = () => { if (a !== this.cur) return; a.volume = Math.min(target, a.volume + 0.04); if (a.volume < target) setTimeout(step, 60); };
    step();
  },
  _fadeOut(a) {
    const step = () => { a.volume = Math.max(0, a.volume - 0.05); if (a.volume > 0) setTimeout(step, 50); else a.pause(); };
    step();
  },
  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    if (this.curKey) this._start();
  },
  refreshVolume() { if (this.cur) this.cur.volume = this.vol() * (Narrator.speaking ? 0.35 : 1); },
};

const Sfx = {
  ctx: null,
  ensure() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* sem áudio */ } } return this.ctx; },
  tone(freq, dur, type = 'square', vol = 0.08, slide = 0, delay = 0) {
    const c = this.ensure(); if (!c) return;
    const v = vol * Save.data.settings.sfx;
    if (v <= 0) return;
    const t0 = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.linearRampToValueAtTime(freq + slide, t0 + dur);
    g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + dur + 0.02);
  },
  noise(dur, vol = 0.06) {
    const c = this.ensure(); if (!c) return;
    const v = vol * Save.data.settings.sfx; if (v <= 0) return;
    const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = c.createBufferSource(), g = c.createGain(); g.gain.value = v;
    s.buffer = buf; s.connect(g); g.connect(c.destination); s.start();
  },
  click() { this.tone(660, 0.05, 'square', 0.05); },
  ok() { this.tone(523, 0.08); this.tone(784, 0.12, 'square', 0.08, 0, 0.08); },
  bad() { this.tone(220, 0.25, 'sawtooth', 0.07, -80); },
  alarm() { this.tone(880, 0.18, 'square', 0.05); this.tone(660, 0.18, 'square', 0.05, 0, 0.2); },
  pick() { this.tone(988, 0.06, 'triangle', 0.08); },
  hit() { this.noise(0.25, 0.12); },
  step() { this.tone(120, 0.03, 'triangle', 0.03); },
  dice() { for (let i = 0; i < 5; i++) this.tone(300 + Math.random() * 500, 0.03, 'square', 0.04, 0, i * 0.04); },
};

const Narrator = {
  speaking: false, voice: null,
  pickVoice() {
    if (!('speechSynthesis' in window)) return null;
    const vs = speechSynthesis.getVoices();
    const lg = I18n.speech(), base = lg.slice(0, 2);
    this.voice = vs.find(v => v.lang.replace('_', '-').toLowerCase() === lg.toLowerCase()) || vs.find(v => v.lang.toLowerCase().startsWith(base)) || null;
    return this.voice;
  },
  say(text) {
    if (!Save.data.settings.narration || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(L(text));
      u.lang = I18n.speech(); u.rate = 1.02; u.pitch = 0.95;
      if (!this.voice) this.pickVoice();
      if (this.voice) u.voice = this.voice;
      u.onstart = () => { this.speaking = true; Music.refreshVolume(); };
      u.onend = u.onerror = () => { this.speaking = false; Music.refreshVolume(); };
      speechSynthesis.speak(u);
    } catch (e) { /* ignora */ }
  },
  stop() { try { speechSynthesis.cancel(); } catch (e) { /* */ } this.speaking = false; Music.refreshVolume(); },
};
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => Narrator.pickVoice();
