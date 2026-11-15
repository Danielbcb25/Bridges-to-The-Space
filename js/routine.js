// ============================================================
//  ROTINA DO ASTRONAUTA — tarefas pequenas de cada dia na nave.
//  Entre um desafio e outro a tripulação faz manutenção: checar o
//  suporte à vida, cuidar da horta, processar o lixo... O computador
//  de bordo indica onde e como, e a lista fica no canto da tela.
//  Quando um desafio chega a rotina pausa; depois ela continua.
// ============================================================
'use strict';

// on: 'open' = abrir o painel da estação (E); lista = ações que contam
const CHORES = {
  rota:     { st: 'ponte', icon: '🧭', t: 'Conferir a rota na Ponte', how: 'Andar de cima, à direita. Aperte E e veja o progresso e os dias restantes.', on: 'open' },
  suporte:  { st: 'suporte', icon: '🫁', t: 'Checar o Suporte à vida', how: 'Andar de baixo, 2ª sala. Aperte E e confira O₂, água e filtros.', on: 'open', sys: 'suporte' },
  horta:    { st: 'estufa', icon: '🌱', t: 'Cuidar da horta', how: 'Na Estufa, aperte E e clique em "Cuidar de todas", plante ou colha.', on: ['careAll', 'care', 'plant', 'harvest'], need: () => has('estufa') },
  lixo:     { st: 'lixo', icon: '🗑', t: 'Processar o lixo', how: 'No Compactador (andar de baixo), aperte E e clique em "Processar agora".', on: ['processTrash', 'ejectTrash'], need: () => S.res.lixo >= 1 },
  cardapio: { st: 'cozinha', icon: '🍳', t: 'Revisar o cardápio', how: 'Na Cozinha, aperte E e confira o que será servido hoje.', on: 'open' },
  tanques:  { st: 'tanqueAux', icon: '⛽', t: 'Conferir os tanques', how: 'Nos Tanques (andar de baixo, à esquerda), aperte E e veja água e combustível.', on: 'open', sys: 'tanques', alt: ['bomba'] },
  radio:    { st: 'antena', icon: '📡', t: 'Ler as mensagens da Terra', how: 'No Rádio (andar de cima, 2ª sala), aperte E.', on: 'open', sys: 'comunicacao' },
  motor:    { st: 'motor', icon: '🔧', t: 'Inspecionar os motores', how: 'Na Propulsão (andar de cima, à esquerda), aperte E e veja o estado do motor.', on: 'open', sys: 'propulsao' },
  saude:    { st: 'enfermaria', icon: '✚', t: 'Check-up da tripulação', how: 'Na Enfermaria (andar de cima), aperte E e veja quem precisa de cuidado.', on: 'open' },
  pesquisa: { st: 'lab', icon: '🔬', t: 'Ligar a pesquisa no Laboratório', how: 'No Laboratório, aperte E e marque "Pesquisa ligada".', on: ['research'], need: () => !S.researchOn },
  dormir:   { st: 'dormitorio', icon: '😴', t: 'Descansar', how: 'Nos Dormitórios (andar de baixo, à direita), aperte E e clique em Dormir.', on: ['sleep', 'rest'], need: () => { const m = me(); return m && m.humor < 70; } },
};
const ROUTINE_DAY1 = ['suporte', 'horta', 'lixo', 'radio'];
const ROUTINE_SIZE = 4;

function routineNew() {
  if (!S || Net.role === 'client') return;
  const ok = id => !CHORES[id].need || CHORES[id].need();
  let ids;
  if (S.day <= 1) ids = ROUTINE_DAY1.filter(ok);
  else {
    // o que está precisando entra primeiro; o resto é sorteado
    const urgent = [];
    if (S.res.lixo >= 5) urgent.push('lixo');
    { const m = me(); if (m && m.humor < 50) urgent.push('dormir'); }
    if (has('estufa') && S.trays && S.trays.some(t => t.crop && (t.state !== 'crescendo' || t.agua < 60 || t.luz < 60 || t.nutr < 60))) urgent.push('horta');
    const rest = Object.keys(CHORES).filter(id => !urgent.includes(id) && ok(id)).sort(() => Math.random() - 0.5);
    ids = urgent.filter(ok).concat(rest);
  }
  while (ids.length < ROUTINE_SIZE) { const extra = ['rota', 'cardapio', 'tanques', 'motor', 'saude'].find(x => !ids.includes(x)); if (!extra) break; ids.push(extra); }
  S.routine = { day: S.day, items: ids.slice(0, ROUTINE_SIZE).map(id => ({ id, done: false })), bonus: false };
}
function routineGet() {
  if (!S || S.scene !== 'ship') return null;
  if ((!S.routine || S.routine.day !== S.day) && Net.role !== 'client') routineNew();
  return S.routine;
}
// chamado pelo host depois de cada ação (e quando alguém abre o painel de uma estação)
function routineHook(type, p, actor) {
  const r = S && S.routine; if (!r || S.scene !== 'ship' || r.day !== S.day) return;
  for (const it of r.items) {
    if (it.done) continue;
    const ch = CHORES[it.id]; if (!ch) continue;
    const hit = ch.on === 'open' ? type === 'inspect' && (p.st === ch.st || (ch.alt || []).includes(p.st))
      : ch.on.includes(type) && (type !== 'research' || p.on) && (!['sleep', 'rest'].includes(type) || !p.id || (actor && p.id === actor.id));
    if (!hit) continue;
    it.done = true; it.by = actor ? actor.id : null;
    if (ch.sys && S.systems[ch.sys]) S.systems[ch.sys].hp = clamp(S.systems[ch.sys].hp + 3, 0, 100); // manutenção preventiva
    toast('✔ Rotina: ' + ch.t, 'good');
  }
  if (!r.bonus && r.items.every(x => x.done)) {
    r.bonus = true;
    alive().forEach(c => c.humor = clamp(c.humor + 3, 0, 100));
    addPoints(10, 'Rotina do dia completa');
    toast(K('🌟 Rotina do dia completa! A tripulação ficou mais animada.', '🌟 Daily routine done! The crew feels better.', '🌟 ¡Rutina del día completa! La tripulación se animó.'), 'good');
  }
}
ACTIONS.inspect = (p, actor) => routineHook('inspect', p, actor);
{ // todas as ações passam pelo gancho da rotina
  const _apply = applyAction;
  applyAction = function (type, p, actorId) { _apply(type, p, actorId); if (S && type !== 'inspect') routineHook(type, p || {}, crewById(actorId || 'cmd')); };
}
function routineNext() {
  const r = routineGet(); if (!r) return null;
  const it = r.items.find(x => !x.done); if (!it) return null;
  const ch = CHORES[it.id];
  return { t: ch.t, how: ch.how, icon: ch.icon, go: { st: ch.st }, routine: true };
}

// lista no canto: tutorial do 1º dia + rotina do dia; pausa durante desafios
function routineBox() {
  if (!S || S.scene !== 'ship' || U.help) return '';
  const r = routineGet(); if (!r) return '';
  const ev = S.event && S.event.phase !== 'result' ? S.event : null;
  const rows = [];
  if (S.tutorial < 4) assistSteps().filter(x => x.go && x.go.st).forEach(x => rows.push({ t: x.t, icon: x.icon, done: x.done, how: TUT_HOW[x.go.st] }));
  r.items.forEach(it => { const ch = CHORES[it.id]; rows.push({ t: ch.t, icon: ch.icon, done: it.done, how: ch.how }); });
  const cur = ev ? null : rows.find(x => !x.done);
  const done = r.items.filter(x => x.done).length;
  return `<div class="goals routine ${ev ? 'paused' : ''}"><b>${ev ? '⚠ ' + esc(L('EMERGÊNCIA')) : esc(L('ROTINA')) + ' · ' + esc(L('DIA')) + ' ' + S.day} <small>${done}/${r.items.length}</small></b>
    ${ev ? `<div class="evline">${esc(T((EVENT_INFO[ev.type] || {}).title || ''))}</div><div class="muted small">${esc(L('Rotina pausada: resolva o desafio primeiro.'))}</div>` : ''}
    ${rows.map(x => `<div class="${x.done ? 'done' : x === cur ? 'cur' : ''}">${x.done ? '☑' : x === cur ? '▶' : '☐'} ${x.icon} ${esc(L(x.t))}${x === cur && x.how ? `<div class="how">${esc(L(x.how))}</div>` : ''}</div>`).join('')}
    ${!ev && r.bonus ? `<div class="green small">✔ ${esc(L('Rotina completa. Acelere o tempo (Shift+S) até o próximo desafio.'))}</div>` : ''}</div>`;
}
const TUT_HOW = { ponte: 'Suba a escada e vá até a Ponte, à direita. Aperte E no painel.', cozinha: 'Desça até a Cozinha e aperte E para montar o cardápio.' };
