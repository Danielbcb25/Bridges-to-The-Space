// ============================================================
//  SPRITES — modelos de pixel derivados dos PNGs originais
//  (.claude/Astronauta*.png). Cada letra é uma "camada" que o
//  criador de avatar pode recolorir.
// ============================================================
'use strict';

const SPR_W = 20, SPR_H = 31;

// Cabeça sem cabelo (linhas 3..11 do quadro)
const HEAD_BASE = [
  '....OOOOOOOOOOOO....',
  '...OSSSSSSSSSSSSO...',
  '...OSSSSSSSSSSSSO...',
  '...OSSeSSSSSSeSSO...',
  '...OSSESSSSSSESSO...',
  '...OSSSSSSSSSSSSO...',
  '...OSSSMSSSSMSSSO...',
  '...OSSSSMMMMSSSSO...',
  '...OOSSSSSSSSSSOO...',
];
// Capacete (AstronautaComCapacete.png)
const HEAD_HELMET = [
  '....OOOOOOOOOOOO....',
  '...OWWWWWWWWWWWWO...',
  '...OWWOOOOOOOOWWO...',
  '...OWOVVVVVVLLOWO...',
  '...OWOvVVVVVVLOWO...',
  '...OWOvVVVVVVVOWO...',
  '...OWOvvVVVVVVOWO...',
  '...OWWOOOOOOOOWWO...',
  '...OOWWWWWWWWWWOO...',
];
// Corpo civil (AstronautaSemTrage*.png) — linhas 12..30
const BODY_CIVIL = [
  '....ONNNNNNNNNNO....',
  '.....NTTTTTTTTN.....',
  '....NTTTTTTTTTTN....',
  '...NTTTTTTTTTTTTN...',
  '...NTNTTTTTTTTNTN...',
  '...NANTTTTTTTTNAN...',
  '...NANTTTTTTTTNAN...',
  '...NANTTTTTTTTNAN...',
  '...NANTTTTTTTTNAN...',
  '...NANTTTTTTTTNAN...',
  '...NANTTTTTTTTNAN...',
  '....N.NPPPPPPN.N....',
  '......NPPPPPPN......',
  '......NPNNNNPN......',
  '......NPN..NPN......',
  '......NPN..NPN......',
  '......NLN..NLN......',
  '......NLN..NLN......',
  '......NNN..NNN......',
];
// Corpo com traje (AstronautaSemCapacete*.png)
const BODY_SUIT = [
  '....ONNNNNNNNNNOO...',
  '.....NUUUUUUUUNBbO..',
  '....NUUUUUUUUUUNBbO.',
  '...NUUNNUUUUGgUUNbO.',
  '...NUNNUNUUUQRUUNbO.',
  '...NUUUUUUUUUUUUNbO.',
  '...NUNUUUUUUUUNUNbO.',
  '...NUNUUUUUUUUNUNbO.',
  '...NUNUUUUUUUUNUNbO.',
  '...NUNUUUUUUUUNUNO..',
  '...NUNUUUUUUUUNUN...',
  '....N.NUUUUUUN.N....',
  '......NUUUUUUN......',
  '......NUNNNNUN......',
  '......NUN..NUN......',
  '......NUN..NUN......',
  '......NUN..NUN......',
  '......NUN..NUN......',
  '......NNN..NNN......',
];
// Tanque quebrado (AstronautaCapaceteTanqueQuebrado.png)
const BODY_BROKEN = BODY_SUIT.slice();
BODY_BROKEN[1] = '.....NUUUUUUUUN.....';
BODY_BROKEN[2] = '....NUUUUUUUUUUN.O..';
BODY_BROKEN[3] = '...NUUNNUUUUGgUUNbO.';
BODY_BROKEN[4] = '...NUNNUNUUUQRUUNOO.';
BODY_BROKEN[5] = '...NUUUUUUUUUUUUNbO.';
BODY_BROKEN[6] = '...NUNUUUUUUUUNUNb..';
BODY_BROKEN[7] = '...NUNUUUUUUUUNUNO..';
BODY_BROKEN[8] = '...NUNUUUUUUUUNUNbO.';

// Estilos de cabelo: sobreposições nas linhas 0..11
const HAIR = {
  careca: [],
  lateral: [ // AstronautaSemTrage1
    [4, '....HHHHHHHHHHHH....'],
    [5, '....HHHH............'],
  ],
  curto: [ // AstronautaSemTrage2/3
    [4, '...OHHHHHHHHHHHHO...'],
    [5, '....H..........H....'],
    [6, '....H..........H....'],
  ],
  franja: [
    [3, '....OOOOOOOOOOOO....'],
    [4, '...OHHHHHHHHHHHHO...'],
    [5, '...OHHHHHhHHHHHHO...'],
    [6, '....H..........H....'],
  ],
  longo: [
    [3, '...OOOOOOOOOOOOOO...'],
    [4, '..OHHHHHHHHHHHHHHO..'],
    [5, '..OHHHHHHHHHHHHHHO..'],
    [6, '..OHH..........HHO..'],
    [7, '..OHH..........HHO..'],
    [8, '..OHH..........HHO..'],
    [9, '..OHH..........HHO..'],
    [10, '..OHH..........HHO..'],
    [11, '..OHHO........OHHO..'],
    [12, '..OOO..........OOO..'],
  ],
  moicano: [
    [0, '........OOOO........'],
    [1, '.......OHHHHO.......'],
    [2, '.......OHHHHO.......'],
    [3, '....OOOOHHHHOOOO....'],
    [4, '........HHHH........'],
  ],
  blackpower: [
    [0, '.....OOOOOOOOOO.....'],
    [1, '...OOHHHHHHHHHHOO...'],
    [2, '..OHHHHHHHHHHHHHHO..'],
    [3, '..OHHHHHHHHHHHHHHO..'],
    [4, '..OHHHHHHHHHHHHHHO..'],
    [5, '..OHHHHHhHHHhHHHHO..'],
    [6, '..OHHO........OHHO..'],
    [7, '...OO..........OO...'],
  ],
  coque: [
    [0, '........OOOO........'],
    [1, '.......OHHHHO.......'],
    [2, '.......OHHHHO.......'],
    [3, '....OOOOOOOOOOOO....'],
    [4, '...OHHHHHHHHHHHHO...'],
    [5, '....HH........HH....'],
  ],
  raspado: [
    [4, '....hhhhhhhhhhhh....'],
    [5, '....h..........h....'],
  ],
  topete: [
    [1, '.........OOOO.......'],
    [2, '.......OOHHHHO......'],
    [3, '....OOOHHHHHHOOO....'],
    [4, '...OHHHHHHHHHHHHO...'],
    [5, '....HH.........H....'],
  ],
};

const ACCESSORIES = {
  nenhum: [],
  oculos: [[6, '.....KKKOOOOKKK.....'], [7, '.....KKK....KKK.....']],
  oculosRedondos: [[6, '.....OIOOOOOOIO.....']],
  barba: [[9, '....HH.M....M.HH....'.replace(/M/g, '.')], [10, '....HHHH....HHHH....'], [11, '....OHHHHHHHHHHO....']],
  bigode: [[9, '.......HHHHHH.......']],
  cicatriz: [[5, '............C.......'], [6, '...........C........'], [7, '..........C.........']],
  fone: [[5, '..KK..........KK....'], [6, '..KK..........KK....'], [7, '..KK................'], [8, '...K................'], [9, '....KKK.............']],
  bone: [[3, '....AAAAAAAAAAAA....'], [4, '...AAAAAAAAAAAAAAAA.'], [5, '....................']],
  bandana: [[4, '...AAAAAAAAAAAAAAA..'], [5, '................AA..']],
  sardas: [[8, '.....F.F....F.F.....']],
};

// Paletas
const SKIN_TONES = ['#ffd9b8', '#ffb27f', '#ffae70', '#e09a66', '#c27a48', '#8e5529', '#6b3e1e', '#4a2a14'];
const HAIR_COLORS = ['#000000', '#3d2a1e', '#8e5529', '#c98b3a', '#f2d16b', '#d9d9d9', '#b5321f', '#7a3cff', '#24c3ff', '#ff4fa3', '#2fa84f'];
const EYE_COLORS = [['#000000', '#3d2a1e'], ['#7f593f', '#3d2a1e'], ['#4dcc5e', '#087a17'], ['#6ab0ff', '#1a4a9a'], ['#b9b9b9', '#4d4d4d'], ['#c86bff', '#5b1a8a']];
const CLOTH_COLORS = ['#ff9019', '#fbff28', '#ff0734', '#2fa84f', '#004a7f', '#771a0f', '#4ba843', '#ffffff', '#6b6b6b', '#7a3cff', '#24c3ff', '#ff4fa3', '#1b1b1b', '#c9a36b'];
const SUIT_COLORS = ['#0026ff', '#e8e8e8', '#ff7a1a', '#2c2c2c', '#00a37a', '#b5121b', '#7a3cff', '#d4b000'];
const VISOR_COLORS = [['#4cfcff', '#298889'], ['#ffd34c', '#a3801c'], ['#ff6a4c', '#8a2e1a'], ['#9dff6a', '#3f8a1f'], ['#c3c3ff', '#5a5a9a']];

const DEFAULT_AVATAR = {
  name: 'Comandante',
  skin: 1, hair: 'lateral', hairColor: 2, eyes: 1,
  shirt: 0, pants: 5, shorts: true, longSleeve: false,
  suit: 0, pack: '#ff9411', visor: 0, badge: '#20a04f',
  acc: 'nenhum', accColor: '#e03030', paint: {},
};

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.max(0, Math.min(255, Math.round(r * f)));
  g = Math.max(0, Math.min(255, Math.round(g * f)));
  b = Math.max(0, Math.min(255, Math.round(b * f)));
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function avatarPalette(a) {
  const skin = SKIN_TONES[a.skin] || SKIN_TONES[1];
  const eye = EYE_COLORS[a.eyes] || EYE_COLORS[1];
  const vis = VISOR_COLORS[a.visor] || VISOR_COLORS[0];
  const hair = HAIR_COLORS[a.hairColor] || HAIR_COLORS[2];
  const shirt = CLOTH_COLORS[a.shirt] || CLOTH_COLORS[0];
  const pants = CLOTH_COLORS[a.pants] || CLOTH_COLORS[5];
  const suit = SUIT_COLORS[a.suit] || SUIT_COLORS[0];
  return {
    O: '#000000', N: '#00052a', S: skin, e: eye[0], E: eye[1], M: '#000000',
    H: hair, h: shade(hair, 1.35), T: shirt, P: pants,
    A: a.longSleeve ? shirt : skin, L: a.shorts ? skin : pants,
    U: suit, B: shade(a.pack, 0.85), b: a.pack,
    G: a.badge, g: shade(a.badge, 1.6), Q: shade(a.badge, 0.7), R: shade(a.badge, 2.0),
    W: '#ffffff', V: vis[0], v: vis[1], L2: '#ffffff', K: '#151515', I: '#9fe8ff',
    C: '#c0504d', F: shade(skin, 0.72),
  };
}

// Compõe uma matriz de caracteres do quadro
function composeGrid(a, outfit, mood) {
  const g = [];
  for (let y = 0; y < SPR_H; y++) g.push(new Array(SPR_W).fill('.'));
  const put = (rows, y0) => rows.forEach((r, i) => {
    for (let x = 0; x < SPR_W; x++) if (r[x] !== '.' && r[x] !== undefined) g[y0 + i][x] = r[x];
  });
  const helmet = outfit === 'helmet' || outfit === 'broken';
  const body = outfit === 'civil' ? BODY_CIVIL : outfit === 'broken' ? BODY_BROKEN : BODY_SUIT;
  put(body, 12);
  if (helmet) {
    put(HEAD_HELMET, 3);
    // o capacete troca 'L' (reflexo) por branco
    for (let y = 3; y < 12; y++) for (let x = 0; x < SPR_W; x++) if (g[y][x] === 'L') g[y][x] = 'W';
  } else {
    put(HEAD_BASE, 3);
    if (mood === 'sad') { // boca triste
      for (let x = 7; x <= 12; x++) { g[9][x] = (x >= 8 && x <= 11) ? 'M' : 'S'; g[10][x] = (x === 7 || x === 12) ? 'M' : 'S'; }
    }
    if (mood === 'sick') { g[6][6] = 'E'; g[6][13] = 'E'; g[7][6] = 'S'; g[7][13] = 'S'; }
    for (const [y, r] of (HAIR[a.hair] || [])) for (let x = 0; x < SPR_W; x++) if (r[x] !== '.') g[y][x] = r[x];
    for (const [y, r] of (ACCESSORIES[a.acc] || [])) for (let x = 0; x < SPR_W; x++) if (r[x] !== '.') g[y][x] = r[x];
  }
  return g;
}

const _sprCache = new Map();
function avatarKey(a) { return JSON.stringify(a); }

// walk: 0 parado, 1 perna esquerda, 2 perna direita
function getSprite(a, outfit = 'suit', mood = 'happy', walk = 0) {
  const key = avatarKey(a) + '|' + outfit + '|' + mood + '|' + walk;
  let c = _sprCache.get(key);
  if (c) return c;
  const pal = avatarPalette(a);
  const g = composeGrid(a, outfit, mood);
  if (walk) { // levanta uma perna 1px
    const xs = walk === 1 ? [6, 7, 8] : [11, 12, 13];
    for (const x of xs) {
      for (let y = 26; y <= 30; y++) g[y - 1][x] = g[y][x];
      g[30][x] = '.';
    }
  }
  c = document.createElement('canvas');
  c.width = SPR_W; c.height = SPR_H;
  const ctx = c.getContext('2d');
  for (let y = 0; y < SPR_H; y++) for (let x = 0; x < SPR_W; x++) {
    const ch = g[y][x];
    if (ch === '.') continue;
    let col = pal[ch];
    if (ch === 'A' && a.acc !== 'nenhum' && y < 12) col = a.accColor;
    if (!col) continue;
    ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1);
  }
  // pintura livre do criador
  if (a.paint) for (const k in a.paint) {
    const [x, y] = k.split(',').map(Number);
    if (outfit !== 'civil' && y >= 3 && y < 12 && (outfit === 'helmet' || outfit === 'broken')) continue;
    if (a.paint[k] === 'erase') ctx.clearRect(x, y, 1, 1);
    else { ctx.fillStyle = a.paint[k]; ctx.fillRect(x, y, 1, 1); }
  }
  if (_sprCache.size > 600) _sprCache.clear();
  _sprCache.set(key, c);
  return c;
}

// Itens (PoteComAgua.png / ResinaExpoxi.png)
const ITEM_ART = {
  pote: { pal: { O: '#000', c: '#0094ff', d: '#3aadff', e: '#75c5ff' }, rows: [
    '..OOOOOO..', '..OOcdOO..', '...OcdO...', '...OcdO...', '..OccddO..', '.OccccddO.', '.OecccccO.', '.OecccccO.', '.OeeccccO.', '.OOOOOOOO.'] },
  resina: { pal: { O: '#000', c: '#404040', d: '#606060', e: '#808080', f: '#c0c0c0' }, rows: [
    '....OO....', '...OccO...', '...OcdO...', '...OdeO...', '...OeeO...', '...OefO...', '...OffO...', '...OOOO...'] },
  lata: { pal: { O: '#000', c: '#c0c0c0', d: '#e03030', e: '#ffffff' }, rows: [
    '..OOOO..', '.OccccO.', '.OddddO.', '.OdeedO.', '.OddddO.', '.OccccO.', '..OOOO..'] },
  garrafa: { pal: { O: '#000', c: '#7fd0ff', d: '#2f7fbf' }, rows: [
    '...OO...', '...OO...', '..OccO..', '.OccccO.', '.OcddcO.', '.OccccO.', '.OccccO.', '..OOOO..'] },
  papel: { pal: { O: '#333', c: '#f0f0e0', d: '#c8c8b0' }, rows: [
    '.OOOOOO.', 'OccdcccO', 'OcccdccO', 'OcdcccdO', '.OOOOOO.'] },
  resto: { pal: { O: '#2a1a0a', c: '#a0602a', d: '#5a8a2a' }, rows: [
    '..OOO...', '.OccdO..', 'OcdccdO.', '.OOOOO..'] },
  filtro: { pal: { O: '#000', c: '#8a8a8a', d: '#d0d0d0' }, rows: [
    'OOOOOO', 'OdcdcO', 'OcdcdO', 'OdcdcO', 'OcdcdO', 'OOOOOO'] },
};
const _itemCache = {};
function getItemSprite(id) {
  if (_itemCache[id]) return _itemCache[id];
  const art = ITEM_ART[id];
  const c = document.createElement('canvas');
  c.width = art.rows[0].length; c.height = art.rows.length;
  const ctx = c.getContext('2d');
  art.rows.forEach((r, y) => [...r].forEach((ch, x) => {
    if (ch === '.') return; ctx.fillStyle = art.pal[ch]; ctx.fillRect(x, y, 1, 1);
  }));
  return (_itemCache[id] = c);
}

function randomAvatar(rng = Math.random) {
  const pick = arr => arr[Math.floor(rng() * arr.length)];
  const hairs = Object.keys(HAIR);
  return {
    name: '', skin: Math.floor(rng() * SKIN_TONES.length), hair: pick(hairs),
    hairColor: Math.floor(rng() * 6), eyes: Math.floor(rng() * EYE_COLORS.length),
    shirt: Math.floor(rng() * CLOTH_COLORS.length), pants: Math.floor(rng() * CLOTH_COLORS.length),
    shorts: rng() < 0.5, longSleeve: rng() < 0.3, suit: 0, pack: '#ff9411', visor: 0, badge: '#20a04f',
    acc: rng() < 0.6 ? 'nenhum' : pick(Object.keys(ACCESSORIES)), accColor: pick(['#e03030', '#2f7fff', '#ffd34c', '#2fa84f']), paint: {},
  };
}
