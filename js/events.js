// ============================================================
//  EVENTOS — desafios da viagem e estágios finais
// ============================================================
'use strict';

const EV = {}; // definições

// ---- ciclo de vida ----
function startEvent(type) {
  const def = EV[type]; if (!def) return;
  const info = EVENT_INFO[type];
  S.eventN++;
  S.event = { id: S.eventN, type, phase: 'warn', t: def.time || 60, dur: def.time || 60, steps: [], data: {}, puzzle: null, result: null, warnT: 25, stopShip: false };
  S.failsInPhase = 0;
  if (def.setup) def.setup(S.event);
  S.alarm = 1;
  logMsg(`⚠ ALERTA: ${info.title}`, 'bad');
  S.v++;
}
function goEvent() {
  const ev = S.event; if (!ev || ev.phase !== 'warn') return;
  ev.phase = 'run';
  const def = EV[ev.type];
  if (def.start) def.start(ev);
  // dica extra do Controle da Missão
  if (has('linha') && !(S.commDown > 0)) logMsg('Controle da Missão: ' + (def.tip || 'Mantenham a calma e sigam o procedimento.'), 'earth');
  if (has('ia')) {
    const wrong = sysHp('avionica') < 40 && Math.random() < 0.6;
    logMsg('Copiloto de IA sugere: ' + (wrong ? 'ignorar o alerta (sensores com defeito?)' : (def.ai || 'seguir os passos na ordem.')), 'ai');
  }
  S.v++;
}
function curStep(ev) { return ev.steps.find(s => !s.done && !s.optional) || null; }
function stepById(ev, id) { return ev.steps.find(s => s.id === id); }
function completeStep(ev, step, c) {
  step.done = true; step.doer = c ? c.name : null;
  logMsg(`✔ ${step.label}${c ? ' — ' + c.name : ''}`, 'good');
  const def = EV[ev.type];
  if (def.onStep) def.onStep(ev, step, c);
  if (!curStep(ev) && ev.phase === 'run' && !def.customEnd) endEvent(true);
  S.v++;
}
function endEvent(ok, extra) {
  const ev = S.event; if (!ev || ev.phase === 'result') return;
  const def = EV[ev.type];
  ev.phase = 'result';
  const res = { ok, text: '', points: 0 };
  if (ok) { res.points = def.points || 25; if (def.success) res.text = def.success(ev) || ''; }
  else {
    res.points = 0; // falha não rende pontos
    if (def.failure) res.text = def.failure(ev) || '';
    const loss = has('voz') ? 1 : 2; moral(S.unity ? -loss + 1 : -loss); S.unity = false;
  }
  if (extra) Object.assign(res, extra);
  ev.result = res;
  S.alarm = 0;
  S.crew.forEach(c => { if (c.task && c.task.ev === ev.id) c.task = null; });
  S.stats.events.push({ type: ev.type, ok: res.ok, grade: res.grade || (ok ? 'Sucesso' : 'Falha') });
  addPoints(res.points, EVENT_INFO[ev.type].title);
  S.v++;
}
function closeEvent() {
  const ev = S.event; if (!ev || ev.phase !== 'result') return;
  const def = EV[ev.type];
  if (def.cleanup) def.cleanup(ev);
  S.event = null; S.thermal = null; S.speedMod = 1; S.cylinders = false;
  S.eventsDone.push(ev.type);
  S.v++;
}
function tickEvents(dt) {
  const ev = S.event;
  if (!ev) {
    const next = S.schedule[0];
    if (next && S.stage === 1 && (S.day - 1 + S.dayT / S.dayLen) >= next.day) {
      S.schedule.shift();
      if (EV[next.type].can && !EV[next.type].can()) return;
      startEvent(next.type);
    }
    return;
  }
  if (ev.phase === 'warn') {
    ev.warnT -= dt;
    if (ev.warnT <= 0) goEvent(); // a crise não espera
    return;
  }
  if (ev.phase !== 'run') return;
  const def = EV[ev.type];
  if (!def.noTimer) ev.t -= dt;
  if (def.tick) def.tick(ev, dt);
  if (ev.phase === 'run' && ev.t <= 0 && !def.noTimer) endEvent(false);
}

// ---- ações gerais dos eventos ----
ACTIONS.eventGo = () => goEvent();
ACTIONS.eventClose = () => closeEvent();
ACTIONS.doStep = (p, actor) => {
  const ev = S.event; if (!ev || ev.phase !== 'run') return;
  const step = p.step ? stepById(ev, p.step) : curStep(ev);
  if (!step || step.done || !step.station) return;
  if (!step.optional && step !== curStep(ev)) return toast('Faça os passos na ordem.', 'warn');
  if (!actor.alive || actor.status === 'incapacitado') return;
  if (!atStation(actor, step.station, 26)) return toast(`Vá até: ${STATIONS[step.station].name}.`, 'warn');
  if (step.role && !roleMatches(actor, step.role) && step.roleOnly) return toast('Este passo precisa de um ' + step.role + '.', 'warn');
  actor.task = { station: step.station, dur: step.dur, t: 0, label: step.label, key: 'evStep', data: { ev: ev.id, step: step.id }, ev: ev.id };
};
ACTIONS.callRole = (p) => {
  const ev = S.event; if (!ev || ev.phase !== 'run') return;
  const step = p.step ? stepById(ev, p.step) : curStep(ev);
  if (!step || step.done) return;
  const role = p.role || step.role || 'engenheiro';
  let c = null;
  if (p.id) c = crewById(p.id);
  else c = pickForRole(role) || pickBotForRole(role);
  if (!c && has('exemplo') && p.role) return toast('Ninguém disponível. Use “Exemplo em campo”: vá você mesmo.', 'warn');
  if (!c) return toast('Ninguém disponível para essa função.', 'warn');
  if (step.claimed) return;
  step.claimed = c.id;
  callCrew(c, { station: step.station, dur: step.dur * (roleMatches(c, step.role) ? 1 : 1.5), label: step.label, key: 'evStep', data: { ev: ev.id, step: step.id }, ev: ev.id }, role);
  if (!isHumanCrew(c)) say(c, 'Indo agora: ' + step.label.charAt(0).toLowerCase() + step.label.slice(1) + '.');
};
function roleMatches(c, role) {
  if (!role) return true;
  if (role === 'engenheiro') return c.role === 'engenheiro1' || c.role === 'engenheiro2';
  return c.role === role;
}
TASK_DONE.evStep = (c, d) => {
  const ev = S.event; if (!ev || ev.id !== d.ev || ev.phase !== 'run') return;
  const step = stepById(ev, d.step); if (!step || step.done) return;
  step.claimed = null;
  if (step.puzzle) {
    const human = c.owner && c.owner !== 'bot';
    if (human) { ev.puzzle = makePuzzle(step.puzzle, ev, step); ev.puzzle.step = step.id; ev.puzzle.by = c.id; return; }
    // bot resolve com rolagem
    let mod = roleMatches(c, step.role) ? 3 : 0;
    if (has('tEng') && roleMatches(c, 'engenheiro')) mod++;
    if (effIndex() < 50) mod--;
    const r = d20();
    if (r === 20 || (r !== 1 && r + mod >= (step.dc || 9))) { botSolves(ev, step, c); completeStep(ev, step, c); }
    else { say(c, F('crew.c2')); step.claimed = c.id; c.task = { station: step.station, dur: step.dur, t: 0, label: step.label, key: 'evStep', data: d, ev: ev.id }; ev.t -= 6; }
    return;
  }
  completeStep(ev, step, c);
};
function botSolves(ev, step, c) {
  const def = EV[ev.type]; if (def.botSolve) def.botSolve(ev, step, c);
}

// ---------- quebra-cabeças ----------
function makePuzzle(kind, ev, step) {
  if (kind === 'filtros') {
    const n = 6; return { kind, n, bad: Math.floor(Math.random() * n), seen: [], swapped: false };
  }
  if (kind === 'mapa') {
    const tiles = []; for (let i = 0; i < 9; i++) tiles.push(1 + Math.floor(Math.random() * 3)); // 0 = alinhado
    return { kind, tiles };
  }
  if (kind === 'radio') {
    const msg = pick(RADIO_MESSAGES);
    return { kind, freq: 50, target: 10 + Math.floor(Math.random() * 80), msgIdx: RADIO_MESSAGES.indexOf(msg), seed: Math.floor(Math.random() * 1000), answered: false };
  }
  if (kind === 'agua') return { kind, order: [], options: shuffle(['Destilação', 'Filtração', 'Oxidação', 'Desinfecção']) };
  if (kind === 'remedio') return { kind, seen: {}, expiredWarned: false };
  if (kind === 'substituto') return { kind };
  if (kind === 'rota') return { kind };
  if (kind === 'pilot') return { kind, y: 0.5, rocks: [], t: 16, hits: 0, spawn: 0 };
  return { kind };
}
function puzzleDone(ev) {
  const step = stepById(ev, ev.puzzle.step);
  const c = crewById(ev.puzzle.by);
  ev.puzzle = null;
  completeStep(ev, step, c);
}

ACTIONS.puzzle = (p, actor) => {
  const ev = S.event; if (!ev || !ev.puzzle) return;
  const pz = ev.puzzle;
  switch (pz.kind) {
    case 'filtros':
      if (p.op === 'inspect' && !pz.seen.includes(p.i)) { pz.seen.push(p.i); ev.t -= 2; }
      if (p.op === 'swap') {
        if (p.i === pz.bad) { toast('Filtro entupido trocado pelo reserva!', 'good'); puzzleDone(ev); }
        else { toast('Esse filtro estava bom. Tempo perdido!', 'warn'); ev.t -= 6; }
      }
      break;
    case 'mapa':
      pz.tiles[p.i] = (pz.tiles[p.i] + 1) % 4;
      if (pz.tiles.every(t => t === 0)) { toast('Mapa estelar recalibrado!', 'good'); puzzleDone(ev); }
      break;
    case 'radio':
      if (p.op === 'tune') pz.freq = clamp(pz.freq + p.d, 0, 99);
      if (p.op === 'answer' && !pz.answered) {
        pz.answered = true;
        const msg = RADIO_MESSAGES[pz.msgIdx];
        ev.data.correct = p.answer === msg.answer;
        ev.data.msg = msg;
        puzzleDone(ev);
      }
      break;
    case 'agua': {
      const correct = ['Destilação', 'Filtração', 'Oxidação', 'Desinfecção'];
      const nextOk = correct[pz.order.length];
      if (p.stage === nextOk) { pz.order.push(p.stage); if (pz.order.length === 4) { toast('Ordem correta! Processando a água...', 'good'); puzzleDone(ev); } }
      else { toast(`Etapa fora de ordem (${p.stage}). O ciclo reiniciou.`, 'warn'); pz.order = []; ev.t -= 8; }
      break;
    }
    case 'remedio': {
      const v = crewById(ev.data.victim); const dis = DISEASES.find(d => d.id === ev.data.disease);
      if (p.op === 'device') {
        if (p.dev === 'scanner') { if (S.res.medicos < 1) return toast('Sem recursos para o scanner.', 'warn'); addRes('medicos', -1, 'Scanner médico'); }
        pz.seen[p.dev] = dis.readings[p.dev]; ev.t -= 3;
      }
      if (p.op === 'replace') { ACTIONS.replaceMeds(); }
      if (p.op === 'give') {
        if (S.day > S.meds.validUntil) { toast('O remédio está vencido e não fez efeito! Troque o estoque primeiro.', 'bad'); ev.t -= 10; return; }
        if (S.res.medicos < 1) return toast('Sem recursos médicos!', 'bad');
        addRes('medicos', -1, 'Remédio');
        if (p.med === dis.med) { v.sickness = null; toast(`${v.name} tomou ${MEDICINES.find(m => m.id === p.med).name} e está se recuperando.`, 'good'); puzzleDone(ev); }
        else { toast('Remédio errado. Os sintomas continuam.', 'warn'); moral(-1, v); ev.t -= 8; }
      }
      break;
    }
    case 'substituto': {
      const sub = crewById(p.id); if (!sub || !available(sub) && sub.id !== 'cmd') return toast('Tripulante indisponível.', 'warn');
      ev.data.sub = sub.id;
      const step = stepById(ev, 'troca');
      ev.puzzle = null;
      completeStep(ev, stepById(ev, 'escolher'), actor);
      if (sub.owner && sub.owner !== 'bot') toast(`${sub.name}: vá até a Eclusa e pressione E para trocar de lugar.`, 'warn');
      else { step.claimed = sub.id; assignTask(sub, { station: 'eclusa', dur: step.dur, label: step.label, key: 'evStep', data: { ev: ev.id, step: 'troca' }, ev: ev.id }); say(sub, F('crew.c3')); }
      break;
    }
    case 'rota': {
      const opt = p.opt;
      if (opt === 'gravidade') { S.totalDays += 2; S.fuelBonus = 0.85; logMsg('Rota com assistência gravitacional: -15% de consumo, +2 dias.'); }
      if (opt === 'economico') { S.cruise = 'economico'; logMsg('Cruzeiro econômico definido para o resto da viagem.'); }
      if (opt === 'manter') { moral(-3); logMsg('Rota mantida. A tripulação ficou apreensiva.'); }
      ev.data.choice = opt;
      puzzleDone(ev);
      break;
    }
    case 'pilot':
      if (p.op === 'move') pz.y = clamp(pz.y + p.d, 0.05, 0.95);
      break;
  }
  S.v++;
};

// =============== DEFINIÇÕES DOS EVENTOS ===============
EV.asteroides = {
  time: 60, points: 30, tip: 'Desviem dos maiores, os pequenos o escudo aguenta.', ai: 'ativar o escudo antes de pilotar.',
  setup(ev) {
    ev.steps = [
      { id: 'escudo', label: 'Ativar o escudo de proteção da nave', station: 'ponte', dur: 2.5 },
      { id: 'manche', label: 'Usar o manche para desviar dos meteoros', station: 'ponte', dur: 0.5, puzzle: 'pilot', role: 'navegador', dc: 9 },
      { id: 'radar', label: 'Conferir no radar se o caminho ficou livre', station: 'ponte', dur: 2 },
    ];
  },
  onStep(ev, step) { if (step.id === 'escudo') ev.data.shield = true; },
  botSolve(ev, step, c) { const hits = Math.max(0, 3 - Math.floor(Math.random() * 4)); ev.data.hits = hits; asteroidHits(hits); },
  tick(ev, dt) {
    const pz = ev.puzzle; if (!pz || pz.kind !== 'pilot') return;
    pz.t -= dt; pz.spawn -= dt;
    if (pz.spawn <= 0) { pz.spawn = 0.45 + Math.random() * 0.4; pz.rocks.push({ x: 1.05, y: Math.random(), r: 0.03 + Math.random() * 0.05, v: 0.35 + Math.random() * 0.35 }); }
    for (const r of pz.rocks) {
      r.x -= r.v * dt;
      if (!r.hit && Math.abs(r.x - 0.15) < r.r + 0.04 && Math.abs(r.y - pz.y) < r.r + 0.05) { r.hit = true; pz.hits++; asteroidHits(1, r.r > 0.06); }
    }
    pz.rocks = pz.rocks.filter(r => r.x > -0.1 && !r.hit);
    if (pz.t <= 0) { ev.data.hits = pz.hits; puzzleDone(ev); }
  },
  success(ev) { return `A nave atravessou a chuva de meteoros com ${ev.data.hits || 0} impacto(s).`; },
  failure() { damageSys('casco', 20); damageSys('propulsao', 15); addRes('casco', -20, 'Impactos de meteoros'); return 'Sem desvio a tempo: vários impactos no casco e na propulsão.'; },
};
function asteroidHits(n, big) {
  for (let i = 0; i < n; i++) {
    let dmg = (big ? 9 : 5) * (S.event && S.event.data.shield ? 0.5 : 1);
    if (has('casco1')) dmg *= 0.75; if (has('casco2')) dmg *= 0.8; if (Save.owns('cascoExtra')) dmg *= 0.85;
    damageSys('casco', dmg); addRes('casco', -dmg, 'Impactos de meteoros');
    if (has('solar') && !has('casco1') && Math.random() < 0.4) { damageSys('casco', 2); logMsg('Um painel solar foi atingido!', 'bad'); }
  }
  if (n) S.shake = 0.5;
}

EV.combFalta = {
  time: 55, points: 25, tip: 'A reserva do tanque auxiliar resolve. Válvula, bomba e confirmação no painel.', ai: 'tanque auxiliar → bomba → painel.',
  setup(ev) {
    ev.steps = [
      { id: 'valvula', label: 'Abrir a válvula de reserva do tanque auxiliar', station: 'tanqueAux', dur: 3, role: 'engenheiro' },
      { id: 'bomba', label: 'Ligar a bomba de combustível', station: 'bomba', dur: 3, role: 'engenheiro' },
      { id: 'painel', label: 'Conferir no painel se o nível subiu e a velocidade voltou', station: 'ponte', dur: 2, role: 'navegador' },
    ];
  },
  start() { S.speedMod = 0.45; sayRole('navegador', F('crew.c4')); },
  success() { addRes('combustivel', 60, 'Reserva do tanque auxiliar'); return 'Combustível da reserva liberado. Velocidade normalizada.'; },
  failure() { addRes('combustivel', -40, 'Falha na alimentação'); damageSys('propulsao', 10); S.progress = Math.max(0, S.progress - 0.02); return 'O motor engasgou: perdemos combustível e tempo.'; },
};

EV.combVaz = {
  time: 60, points: 30, tip: 'Vamos recalcular a rota. Mantenham o rádio aberto.', ai: 'pedir o recálculo da rota à Terra.',
  setup(ev) {
    ev.steps = [
      { id: 'pedir', label: 'Pedir à equipe em solo o recálculo da rota', station: 'antena', dur: (S.setup.origin === 'diplomata' || has('antena')) ? 2 : 4.5 },
      { id: 'escolher', label: 'Escolher a nova rota calculada pela Terra', station: 'antena', dur: 0.5, puzzle: 'rota', role: 'navegador', dc: 7 },
    ];
  },
  start(ev) {
    const pct = has('valvulas') ? 0.10 : 0.20;
    const lost = S.res.combustivel * pct; ev.data.lost = lost;
    addRes('combustivel', -lost, 'Vazamento de combustível');
    damageSys('tanques', 20);
    toast(`Vazaram ${fmt(lost, 0)} kg de combustível (${pct * 100}%)!`, 'bad');
  },
  botSolve(ev) { S.cruise = 'economico'; ev.data.choice = 'economico'; },
  success(ev) { return 'Rota recalculada com a ajuda da equipe em solo.'; },
  failure() { addRes('combustivel', -30, 'Rota ineficiente'); return 'Sem nova rota, gastamos ainda mais combustível.'; },
};

EV.oxigenio = {
  time: 60, points: 35, tip: 'Usem os cilindros. O filtro reserva está no compartimento do suporte à vida.', ai: 'inspecionar os filtros e trocar o entupido.',
  setup(ev) {
    const quick = has('filtroReserva');
    ev.steps = [
      { id: 'achar', label: quick ? 'Localizar o filtro (troca rápida instalada)' : 'Descobrir qual filtro está entupido', station: 'suporte', dur: quick ? 1.5 : 1, puzzle: quick ? null : 'filtros', role: 'engenheiro', dc: 8 },
      { id: 'trocar', label: 'Trocar pelo filtro reserva', station: 'suporte', dur: quick ? 1.5 : 3, role: 'engenheiro' },
      { id: 'reiniciar', label: 'Reiniciar o sistema de O₂ e conferir o nível verde', station: 'suporte', dur: 2 },
    ];
  },
  start() { S.cylinders = true; narrate('Alerta de perigo! O suporte à vida apresentou problemas. Até resolver, toda a tripulação usa cilindros de oxigênio.'); },
  success() { S.cylinders = false; return 'Filtro trocado, oxigênio de volta ao verde.'; },
  failure() { S.cylinders = false; damageSys('suporte', 30); addRes('oxigenio', -15, 'Falha na filtragem'); moral(-10); return 'A filtragem ficou parada tempo demais. Suporte à vida danificado.'; },
};

EV.painel = {
  time: 55, points: 30, tip: 'Reiniciem o computador e recalibrem pelo mapa estelar.', ai: 'chamar o engenheiro para reiniciar e recalibrar.',
  setup(ev) {
    const backup = has('redundante') || has('analogicos');
    ev.steps = [
      { id: 'reboot', label: 'Reiniciar o computador de bordo', station: 'avionica', dur: 3, role: 'engenheiro' },
      { id: 'calibrar', label: backup ? 'Carregar o mapa de backup' : 'Recalibrar o mapa estelar', station: 'avionica', dur: backup ? 2 : 0.5, puzzle: backup ? null : 'mapa', role: 'engenheiro', dc: 9 },
    ];
  },
  start() { S.speedMod = 0.5; sayRole('navegador', F('crew.c5')); },
  success() { return 'Computador recalibrado. A nave sabe onde está de novo.'; },
  failure() { S.progress = Math.max(0, S.progress - 0.03); damageSys('avionica', 25); return 'A nave ficou perdida por tempo demais e desviou da rota.'; },
};

EV.lixo = {
  time: 60, points: 25, tip: 'Recolham tudo que flutua e confiram os mecanismos.', ai: 'coletar o lixo e chamar um engenheiro para o motor.',
  setup(ev) {
    ev.steps = [
      { id: 'coletar', label: 'Coletar a maior parte do lixo (8 de 11)', station: null, dur: 0 },
      { id: 'mecanismo', label: 'Engenheiro: retirar lixo preso no mecanismo do motor', station: 'motor', dur: 4, role: 'engenheiro', optional: true },
    ];
  },
  start(ev) {
    S.trash = [];
    const kinds = ['lata', 'garrafa', 'papel', 'resto'];
    for (let i = 0; i < 11; i++) {
      const room = pick(ROOMS);
      S.trash.push({ id: i, x: room.x0 + 15 + Math.random() * (room.x1 - room.x0 - 30), deck: room.deck, kind: pick(kinds), ph: Math.random() * 6 });
    }
    ev.data.collected = 0;
    addRes('lixo', 4, 'Lixo solto');
    sayRole('engenheiro1', F('crew.c6'));
  },
  tick(ev, dt) {
    // bots ajudam a recolher
    for (const c of alive()) {
      if (c.owner && c.owner !== 'bot') continue;
      if (c.task || c.hibernating) continue;
      if (Math.random() < dt * 0.3) { const t = pick(S.trash); if (t) { c.tx = t.x; c.tdeck = t.deck; } }
    }
    for (const c of alive()) {
      for (const t of S.trash) if (!t.got && t.deck === c.deck && Math.abs(t.x - c.x) < 10 && (!c.owner || c.owner === 'bot' ? Math.random() < dt * 1.5 : false)) collectTrash(ev, t, c);
    }
    S.trash = S.trash.filter(t => !t.got);
    const s = ev.steps[0];
    if (!s.done && ev.data.collected >= 8) completeStep(ev, s, null);
    s.label = `Coletar a maior parte do lixo (${ev.data.collected} de 11)`;
    if (s.done && ev.steps[1].done) endEvent(true);
  },
  customEnd: true,
  onStep(ev, step, c) {
    if (step.id === 'mecanismo' && c && !roleMatches(c, 'engenheiro')) {
      if (d20() < 10) { damageSys('propulsao', 10); toast('Sem experiência, a retirada danificou o mecanismo.', 'warn'); }
    }
    if (ev.steps.every(s => s.done)) endEvent(true);
  },
  success() { S.trash = []; return 'Lixo recolhido e compactado. O motor está livre.'; },
  failure(ev) { S.trash = []; moral(-5); if (!ev.steps[1].done) damageSys('propulsao', 15); return 'Lixo demais pela nave: mau cheiro, mofo e um mecanismo travado.'; },
};
function collectTrash(ev, t, c) {
  if (t.got) return; t.got = true; ev.data.collected++;
  addRes('lixo', -0.2, 'Lixo recolhido');
  S.v++;
}
ACTIONS.pickTrash = (p, actor) => {
  const ev = S.event; if (!ev || ev.type !== 'lixo' || ev.phase !== 'run') return;
  const t = S.trash.find(x => !x.got && x.deck === actor.deck && Math.abs(x.x - actor.x) < 16);
  if (t) collectTrash(ev, t, actor);
};

EV.radio = {
  time: 75, points: 30, tip: '…ssshhh… (a dica também chegou cortada)', ai: 'girar o sintonizador até o chiado sumir.',
  setup(ev) {
    ev.steps = [
      { id: 'sintonizar', label: 'Sintonizar o rádio e decifrar a mensagem', station: 'antena', dur: 1, puzzle: 'radio', role: 'engenheiro', dc: 10 },
      { id: 'antena', label: 'Engenheiro: consertar a antena (reduz o chiado)', station: 'antena', dur: 6, role: 'engenheiro', optional: true },
    ];
  },
  start() { S.commDown = 999; sayRole('engenheiro2', F('crew.c7')); },
  onStep(ev, step) { if (step.id === 'antena') { ev.data.fixed = true; damageSys('comunicacao', -15); } },
  botSolve(ev) { ev.data.correct = Math.random() < 0.7; ev.data.msg = pick(RADIO_MESSAGES); },
  success(ev) {
    S.commDown = 0;
    if (ev.data.correct) { addPoints(10, 'Mensagem decifrada'); if (ev.data.msg) applyRadioMsg(ev.data.msg); return 'Mensagem entendida: “' + (ev.data.msg ? ev.data.msg.answer : '') + '”.'; }
    moral(-5); return 'O rádio voltou, mas a mensagem foi mal interpretada. A tripulação ficou confusa.';
  },
  failure() { S.commDown = 0; damageSys('comunicacao', 20); return 'Ficamos sem entender o aviso da Terra.'; },
};
function applyRadioMsg(msg) {
  if (msg.answer.includes('tempestade')) S.stormWarned = true;
  if (msg.answer.includes('remédios')) toast('Dica: verifique a validade dos remédios na Enfermaria.', 'info');
  if (msg.answer.includes('detritos')) { S.progress = Math.min(1, S.progress + 0.01); }
  if (msg.answer.includes('água')) moral(5);
}

EV.contaminacao = {
  time: 70, points: 35, tip: 'Destilação, filtração, oxidação e desinfecção — nessa ordem.', ai: 'seguir as 4 etapas do ciclo fechado.',
  setup(ev) {
    ev.steps = [
      { id: 'ordem', label: 'Montar a sequência de descontaminação', station: 'suporte', dur: 1, puzzle: 'agua', role: 'engenheiro', dc: 8 },
      { id: 'processar', label: 'Processar a água no ciclo fechado', station: 'suporte', dur: 4 },
    ];
  },
  start() { addRes('agua', -40, 'Água contaminada descartada'); narrate('A água disponível foi contaminada por mau gerenciamento. Ela é vital para a hidratação e para a agricultura.'); },
  success() { return 'Água descontaminada: destilada, filtrada, oxidada e desinfetada.'; },
  failure() {
    addRes('agua', -120, 'Água contaminada'); addRes('plantacao', -5, 'Irrigação contaminada');
    const v = pick(alive()); v.sickness = 'infeccao'; v.status = 'ferido'; v.statusT = 30;
    return 'A água contaminada se espalhou. Perdemos água e alguém adoeceu.';
  },
};

EV.traje = {
  time: 60, points: 40, tip: 'Mandem outro tripulante pela eclusa, rápido!', ai: 'escolher o outro engenheiro como substituto.',
  can() { return roleAlive('engenheiro'); },
  setup(ev) {
    ev.time = has('trajes') ? 75 : 55; ev.t = ev.dur = ev.time;
    ev.steps = [
      { id: 'escolher', label: 'Escolher quem vai substituir o engenheiro', station: 'eclusa', dur: 0.5, puzzle: 'substituto', dc: 5 },
      { id: 'troca', label: 'Substituto: trocar de lugar pela eclusa', station: 'eclusa', dur: 4 },
    ];
  },
  start(ev) {
    const v = byRole('engenheiro').find(c => c.alive && !c.hibernating) || byRole('engenheiro').find(c => c.alive);
    ev.data.victim = v.id; v.task = null; v.outfit = 'broken'; v.x = STATIONS.eclusa.x + 30; v.deck = 'L'; v.tx = v.x; v.tdeck = 'L'; v.eva = true;
    say(v, F('crew.c8'), 8);
  },
  botSolve(ev) { const sub = alive().find(c => c.id !== ev.data.victim && available(c) && c.id !== 'cmd'); ev.data.sub = sub ? sub.id : null; },
  success(ev) { const v = crewById(ev.data.victim); v.outfit = 'suit'; v.eva = false; moral(-2, v); damageSys('acoplamento', -10); return `${v.name} voltou para dentro a tempo. O substituto terminou o reparo.`; },
  failure(ev) {
    const v = crewById(ev.data.victim); v.outfit = 'suit'; v.eva = false;
    if (has('trajes') || has('enfermaria')) { const r = d10(); if (r === 1) kill(v, 'vazamento no traje'); else { v.status = 'incapacitado'; v.statusT = 60; return `${v.name} foi resgatado inconsciente. Sobreviveu graças aos trajes/enfermaria.`; } }
    else kill(v, 'vazamento no traje');
    return 'O substituto não chegou a tempo.';
  },
};

EV.doenca = {
  time: 60, points: 30, tip: 'Usem os aparelhos para o diagnóstico antes do remédio.', ai: 'medir temperatura e oxigênio no sangue primeiro.',
  setup(ev) {
    ev.steps = [{ id: 'tratar', label: 'Diagnosticar e medicar o doente', station: 'enfermaria', dur: 1, puzzle: 'remedio', role: 'paramedico', dc: 8 }];
  },
  start(ev) {
    const cands = alive().filter(c => !c.hibernating);
    const v = pick(cands);
    const dis = pick(DISEASES);
    ev.data.victim = v.id; ev.data.disease = dis.id;
    v.sickness = dis.id;
    say(v, `Não estou bem... sinto ${dis.sintoma}.`, 7);
    if (S.day > S.meds.validUntil) logMsg('Atenção: os remédios em estoque estão vencidos.', 'warn');
  },
  botSolve(ev) {
    if (S.day > S.meds.validUntil) ACTIONS.replaceMeds();
    const v = crewById(ev.data.victim); if (v) v.sickness = null; addRes('medicos', -1, 'Remédio');
  },
  success(ev) { const v = crewById(ev.data.victim); return `${v.name} foi tratado e está se recuperando.`; },
  failure(ev) {
    const v = crewById(ev.data.victim);
    v.status = 'incapacitado'; v.statusT = 40; moral(-8); addRes('medicos', -2, 'Tentativas de tratamento');
    if (!has('enfermaria') && !roleAlive('paramedico') && d10() === 1) kill(v, 'doença sem tratamento');
    return `${v.name} piorou e ficou incapacitado por um tempo, com mobilidade e visão reduzidas.`;
  },
};

EV.tempestade = {
  time: 45, points: 25, tip: 'Todos ao abrigo blindado dos dormitórios!', ai: 'ordenar abrigo imediatamente.',
  setup(ev) { ev.steps = [{ id: 'abrigo', label: 'Levar toda a tripulação ao abrigo (Dormitórios)', station: null, dur: 0 }]; },
  start(ev) { ev.data.stormAt = 22; narrate('Tempestade solar! Partículas de alta energia vão atravessar a nave em instantes.'); },
  customEnd: true,
  tick(ev, dt) {
    const room = ROOMS.find(r => r.id === 'dormitorio');
    const inside = c => c.deck === 'L' && c.x >= room.x0 && c.x <= room.x1;
    const all = alive().filter(c => !c.eva);
    ev.data.inside = all.filter(inside).length; ev.data.total = all.length;
    ev.steps[0].label = `Levar toda a tripulação ao abrigo (${ev.data.inside}/${ev.data.total} nos Dormitórios)`;
    if (ev.t <= ev.data.stormAt && !ev.data.storm) {
      ev.data.storm = true; S.commDown = 20; S.shake = 0.6;
      let hurt = 0;
      for (const c of all) if (!inside(c)) { c.status = 'ferido'; c.statusT = has('escudoMag') ? 15 : 35; hurt++; }
      let dmg = (has('escudoMag') ? 3 : 8) * (has('casco2') ? 0.5 : 1) * (S.stormWarned ? 0.5 : 1);
      damageSys('casco', dmg); damageSys('comunicacao', dmg);
      ev.data.hurt = hurt;
      logMsg(`A tempestade atingiu a nave. ${hurt} tripulante(s) fora do abrigo.`, hurt ? 'bad' : 'good');
    }
    if (ev.data.storm && ev.t <= ev.data.stormAt - 15) endEvent(ev.data.hurt === 0, { text: ev.data.hurt ? `${ev.data.hurt} tripulante(s) ficaram expostos à radiação.` : 'Todos protegidos no abrigo. Ninguém foi exposto.' });
  },
  noTimer: false,
  success() { return 'Todos protegidos no abrigo.'; },
  failure() { return 'Parte da tripulação foi exposta à radiação.'; },
};
ACTIONS.shelter = () => {
  for (const c of alive()) if ((!c.owner || c.owner === 'bot') && !c.eva && !c.hibernating) { c.task = null; goTo(c, 'dormitorio', Math.random() * 60 - 40); c.idleT = 40; }
  toast('Tripulação a caminho do abrigo!');
};

// ===================== REGULAÇÃO TÉRMICA =====================
const TH_ACTIONS = {
  rot: { name: 'Girar a nave', short: 'Rotação', need: 5, role: 'navegador', station: 'ponte', cost: () => `−${has('motorEf') ? 15 : 20} kg comb.`, sys: 'propulsao' },
  rad: { name: 'Radiadores', short: 'Radiadores', need: 4, role: 'engenheiro', station: 'termico', cost: () => '−6 kWh', sys: 'termico' },
  heat: { name: 'Aquecedores', short: 'Aquecedores', need: 4, role: 'engenheiro', station: 'termico', cost: () => `−${thHeatCost()} kWh`, sys: 'suporte' },
  rep: { name: 'Reparar o isolamento', short: 'Reparo', need: 3, role: 'engenheiro', station: 'eclusa', cost: () => '−4,8 kWh e engenheiro 1 min', sys: 'termico' },
  shut: { name: 'Persianas térmicas', short: 'Persianas', need: 6, role: 'engenheiro', station: 'termico', cost: () => '−3 kWh', sys: 'termico' },
  equip: { name: 'Desligar equipamentos', short: 'Equipamentos', need: 5, role: 'pesquisador', station: 'lab', cost: () => (S.thermal && S.thermal.equipOff ? 'religar (sem custo)' : '+6 kWh e −3 moral'), sys: 'avionica' },
};
function thHeatCost() { let c = has('aquecEf') ? 9 : 12; if (S.thermal && S.thermal.shutOk) c -= 3; return c; }

EV.termico = {
  time: 60, points: 0, noTimer: true, customEnd: true,
  tip: 'Poucas soluções, bem combinadas. Preparem-se antes.', ai: 'girar a nave cedo e abrir radiadores no pico.',
  setup(ev) {
    const D = 60; // fase térmica de 1 minuto
    ev.t = ev.dur = D;
    ev.steps = [];
    S.thermal = {
      D, el: 0, T: 22, sun: 30, shade: -60, scene: 0, rip: false, ripLoss: 0, repaired: false, overload: false, shadow: false,
      act: { rot: 0, rad: 0, heat: 0, shut: 0 }, weak: {}, disabled: {}, shutMode: null, equipOff: false, equipDelay: 0,
      last: null, fails: 0, anyFail: false, maint: {}, dedic: {}, kwh: 0, fuel: 0, plantsLost: 0, outT: 0, plantT: 0,
      sangue: has('sangue'), olhar: has('olhar'), clear: null, pendingReroll: null, startE: S.res.energia, startShield: S.res.escudo,
      startData: S.res.dados, msgs: [], sunMult: 1, panic: false, gbLost: 0,
    };
  },
  start(ev) {
    const th = S.thermal;
    narrate('Atenção, tripulação. A nave está entrando em uma zona de calor extremo. No espaço não há ar para espalhar o calor. O lado voltado para a estrela esquenta sem parar, enquanto o outro lado congela. Mantenham a temperatura interna entre 18 e 26 graus.');
    sayRole('navegador', F('crew.c9'), 9);
    thMsg('Cena 1 — Alerta de calor. Decisão: ligar a rotação agora ou esperar.');
  },
  tick(ev, dt) { thermalTick(ev, dt); },
};

function thMsg(t) { const th = S.thermal; if (!th) return; th.msgs.push(t); if (th.msgs.length > 12) th.msgs.shift(); logMsg(t, 'thermal'); }

function thermalTick(ev, dt) {
  const th = S.thermal; if (!th) return;
  th.el += dt; ev.t = Math.max(0, th.D - th.el);
  const dk = dt * (300 / th.D); // a física foi calibrada para 5 min: acelera na mesma proporção
  const p = th.el / th.D;
  const peak = has('pintura') ? 100 : 120;
  // cenas
  if (th.scene < 2 && p >= 0.12) {
    th.scene = 2; thMsg('Cena 2 — A estrela se aproxima: o lado do Sol sobe para +' + peak + ' °C.');
    sayRole('engenheiro1', F('crew.c10'), 8);
    const need = thNeed('rot');
    if (need >= 9 && roleAlive('navegador')) sayRole('navegador', F('crew.c11'));
  }
  if (th.scene < 3 && p >= 0.32) {
    th.scene = 3;
    if (!has('cobertor') || Math.random() < 0.5) {
      th.rip = true; thMsg('Cena 3 — Rasgo no isolamento! Um micrometeoroide atingiu o cobertor térmico.');
      const e = byRole('engenheiro').find(c => c.alive);
      if (e) say(e, thNeed('rep') >= 9 ? '(respiração pesada) O isolamento rasgou... preciso sair para consertar, mas vou ficar exposto.' : 'O isolamento rasgou. Preciso sair para consertar, mas vou ficar exposto.', 8);
    } else thMsg('Cena 3 — Um micrometeoroide bateu no cobertor multicamadas, mas ele aguentou.');
  }
  if (th.scene < 4 && p >= 0.48) {
    th.scene = 4; th.overload = true; thMsg('Cena 4 — Sobrecarga elétrica: os equipamentos geram calor interno.');
    sayRole('pesquisador', F('crew.c12'), 8);
  }
  if (th.scene < 5 && p >= 0.66) {
    th.scene = 5; th.shadow = true; th.overload = false; thMsg('Cena 5 — Entrada na sombra: a temperatura cai rápido.');
    sayRole('paramedico', F('crew.c13'), 8);
  }
  // temperaturas externas
  let sunT = th.shadow ? -60 : (th.scene >= 2 ? peak : 60);
  let shadeT = th.shadow ? -150 : (th.scene >= 2 ? -120 : -100);
  th.sun += (sunT - th.sun) * Math.min(1, dk * 0.08 * th.sunMult);
  th.shade += (shadeT - th.shade) * Math.min(1, dk * 0.08);
  // efeitos ativos
  for (const k in th.act) if (th.act[k] > 0) { th.act[k] -= dt; if (th.act[k] <= 0) { th.act[k] = 0; th.weak[k] = false; if (k === 'shut') th.shutMode = null; thMsg(`${TH_ACTIONS[k].name}: efeito terminou.`); } }
  if (th.sunMult > 1) th.sunMult = Math.max(1, th.sunMult - dk * 0.02);
  const rot = th.act.rot > 0 ? (th.weak.rot ? 0.75 : 0.45) : 1;
  const ripF = th.rip && !th.repaired ? 1.6 : 1;
  const heatIn = Math.max(0, th.sun - 20) * 0.06 * rot * ripF * th.sunMult;
  const shutClosed = th.act.shut > 0 && th.shutMode === 'fechar';
  const shutOpen = th.act.shut > 0 && th.shutMode === 'abrir';
  const coldLoss = Math.max(0, 20 - th.shade) * (th.shadow ? 0.03 : 0.012) * rot * ripF * (shutClosed ? (th.weak.shut ? 0.75 : 0.5) : 1);
  let equip = th.equipOff ? 0 : (th.overload ? 8 : 3);
  if (has('fusao')) equip += 2;
  const conflict = th.act.rad > 0 && th.act.heat > 0;
  const rad = th.act.rad > 0 ? (th.weak.rad ? 4 : 9) * (conflict ? 0.5 : 1) : 0;
  const heat = th.act.heat > 0 ? (th.weak.heat ? 5 : 10) * (conflict ? 0.5 : 1) : 0;
  const Teq = 22 + heatIn - coldLoss + equip - rad + heat - (shutOpen ? (th.weak.shut ? 2 : 4) : 0);
  th.Teq = Teq;
  th.T += (Teq - th.T) * Math.min(1, dk * 0.05);
  // escudo perdendo espessura com o rasgo aberto
  if (th.rip && !th.repaired && th.ripLoss < 7.5) { const l = Math.min(7.5 - th.ripLoss, dk * 0.06); th.ripLoss += l; addRes('escudo', -l, 'Rasgo no isolamento'); }
  // plantação sofre fora da faixa
  const out = th.T > 26 || th.T < 18;
  if (out) {
    th.outT += dt; th.plantT += dk;
    const every = has('tAgr') ? 12 : 7;
    if (th.plantT >= every && th.plantsLost < 18) { th.plantT = 0; th.plantsLost += 1; addRes('plantacao', -1, 'Temperatura fora da faixa'); }
  }
  if (th.T > 32 || th.T < 12) for (const c of alive()) c.humor = clamp(c.humor - dk * 0.15, 0, 100);
  if (th.equipDelay > 0) { th.equipDelay -= dt; if (th.equipDelay <= 0) { th.equipOff = false; S.equipOff = false; thMsg('Equipamentos religados após o atraso.'); } }
  if (th.pendingReroll) { th.pendingReroll.t -= dt; if (th.pendingReroll.t <= 0) { const pr = th.pendingReroll; th.pendingReroll = null; thFailure(pr.k); } }
  if (th.el >= th.D) thermalEnd(ev);
}

function thMods(k) {
  const th = S.thermal; const list = [];
  const a = TH_ACTIONS[k];
  if (th.dedic[k]) list.push([has('delegar') ? 3 : 2, 'tripulante dedicado']);
  if (th.maint[k]) list.push([1, 'manutenção preventiva']);
  if (th.last === k) list.push([-2, 'desgaste (uso seguido)']);
  if (S.res.escudo < 25) list.push([-2, 'escudo < 25 mm']);
  if (moralIndex() < 40) list.push([-2, 'moral baixa']);
  if (S.res.energia < 12 && (k === 'rad' || k === 'heat')) list.push([-3, 'energia < 12 kWh']);
  if ((th.T > 40 || th.T < 10) && k === 'shut') list.push([-2, 'temperatura extrema']);
  if (th.anyFail) list.push([-1, 'outra solução já falhou']);
  if (k === 'rot') { if (has('propReforco')) list.push([2, 'propulsores reforçados']); if (has('tNav')) list.push([1, 'navegador treinado']); if (S.setup.origin === 'astronauta') list.push([1, 'ex-astronauta']); }
  if (k === 'rad') { if (has('radiadoresRed')) list.push([2, 'radiadores redundantes']); if (th.rotOk) list.push([1, 'sinergia com a rotação']); if (th.act.heat > 0) list.push([-2, 'conflito com aquecedores']); if (th.act.shut > 0 && th.shutMode === 'fechar') list.push([-1, 'persianas fechadas']); if (has('fusao')) list.push([-1, 'calor do reator']); }
  if (k === 'heat') { if (th.shutOk) list.push([1, 'sinergia com persianas']); if (th.act.rad > 0) list.push([-2, 'conflito com radiadores']); }
  if (k === 'rep') { if (has('cobertor')) list.push([1, 'cobertor multicamadas']); if (S.setup.origin === 'engenheiro') list.push([1, 'engenheiro-chefe']); }
  if (['rep', 'rad', 'shut'].includes(k) && has('tEng')) list.push([1, 'engenheiros treinados']);
  if (effIndex() < 50) list.push([-1, 'eficiência baixa']);
  if (th.exemplo && th.exemplo[k]) list.push([-1, 'líder no lugar do tripulante']);
  return list;
}
function thNeed(k) { // número necessário no dado
  if (!S.thermal) return 10;
  const mod = thMods(k).reduce((s, m) => s + m[0], 0);
  return clamp(TH_ACTIONS[k].need - mod, 2, 20);
}
function thHint(k) {
  const n = thNeed(k);
  const th = S.thermal;
  let level = n <= 3 ? 'ok' : n <= 8 ? 'warn' : 'bad';
  let band = null;
  if (has('sensores') || (th.clear === k)) band = n <= 6 ? 'alta' : n <= 11 ? 'média' : 'baixa';
  return { level, band, n };
}

ACTIONS.thAct = (p, actor) => {
  const th = S.thermal; const ev = S.event;
  if (!th || !ev || ev.phase !== 'run') return;
  const k = p.k; const a = TH_ACTIONS[k];
  if (th.disabled[k]) return toast(`${a.name} inutilizável até o fim da fase.`, 'warn');
  if (th.pendingReroll) return;
  // dedicado?
  th.dedic[k] = false; th.exemplo = th.exemplo || {};
  // o próprio jogador com a função certa conta como tripulante dedicado
  if (actor && roleMatches(actor, a.role) && actor.alive && actor.status !== 'incapacitado') { th.dedic[k] = true; thMsg(`${actor.name} cuida pessoalmente: ${a.short} (tripulante dedicado).`); }
  else if (p.dedic) {
    const c = pickForRole(a.role);
    if (c) { th.dedic[k] = true; callCrew(c, { station: a.station, dur: 12 * th.D / 300, label: a.name, key: 'thBusy' }, a.role); }
    else if (has('exemplo')) { th.exemplo[k] = true; th.dedic[k] = true; thMsg('Exemplo em campo: o Comandante assume a função (−1).'); }
    else thMsg('Nenhum ' + a.role + ' disponível para se dedicar.');
  }
  // custos
  if (k === 'rot') { const f = has('motorEf') ? 15 : 20; if (S.res.combustivel < f) return toast('Combustível insuficiente.', 'warn'); addRes('combustivel', -f, 'Regulação térmica: rotação'); th.fuel += f; S.stats.thermalFuel += f; }
  else if (k === 'equip') {
    if (!th.equipOff) {
      th.equipOff = true; S.equipOff = true; addRes('energia', 6, 'Equipamentos desligados'); th.kwh -= 6; moral(-3);
      S.commDown = Math.max(S.commDown, 5);
      thMsg('Equipamentos desligados: +6 kWh, comunicação cai, moral −3 e a pesquisa para.');
      th.last = k; S.v++; return;
    }
  } else {
    const kwh = { rad: 6, heat: thHeatCost(), rep: 4.8, shut: 3 }[k];
    if (k === 'rep') { const eng = (actor && roleMatches(actor, 'engenheiro')) ? null : pickForRole('engenheiro'); if (!eng && !(actor && roleMatches(actor, 'engenheiro')) && !has('exemplo')) return toast('Nenhum engenheiro disponível para o reparo.', 'warn'); if (eng) callCrew(eng, { station: 'eclusa', dur: 12 * th.D / 300, label: 'Reparo do isolamento', key: 'thBusy' }, 'engenheiro'); }
    if (S.res.energia < kwh) return toast('Energia insuficiente.', 'warn');
    addRes('energia', -kwh, 'Regulação térmica: ' + a.short); th.kwh += kwh; S.stats.thermalKwh += kwh;
  }
  if (k === 'shut') th.shutMode = p.mode || (th.T > 22 ? 'abrir' : 'fechar');
  thRoll(k);
};
TASK_DONE.thBusy = () => {};
ACTIONS.thMaint = (p, actor) => {
  const th = S.thermal; if (!th) return;
  const k = p.k; const a = TH_ACTIONS[k];
  const c = (actor && roleMatches(actor, a.role) && available(actor)) ? actor : pickForRole(a.role);
  if (!c) return toast('Ninguém disponível para a manutenção.', 'warn');
  const mt = { station: a.station, dur: 10 * th.D / 300, label: 'Manutenção preventiva: ' + a.short, key: 'thMaint', data: { k } };
  if (c === actor) assignTask(c, mt); else callCrew(c, mt, a.role);
  thMsg(`${c.name} faz manutenção preventiva em ${a.short} (1 min).`);
};
TASK_DONE.thMaint = (c, d) => { if (S.thermal) { S.thermal.maint[d.k] = true; thMsg(`Manutenção preventiva concluída: ${TH_ACTIONS[d.k].short} +1.`); } };
ACTIONS.thOlhar = (p) => { const th = S.thermal; if (!th || !th.olhar) return; th.olhar = false; th.clear = p.k; thMsg('Olhar estratégico: a pista de ' + TH_ACTIONS[p.k].short + ' ficou mais clara.'); };
ACTIONS.thReroll = () => {
  const th = S.thermal; if (!th || !th.pendingReroll || !th.sangue) return;
  const k = th.pendingReroll.k; th.pendingReroll = null; th.sangue = false;
  thMsg('Sangue-frio: o Comandante rola de novo.');
  thRoll(k, true);
};
ACTIONS.thAcceptFail = () => { const th = S.thermal; if (!th || !th.pendingReroll) return; const k = th.pendingReroll.k; th.pendingReroll = null; thFailure(k); };

function thRoll(k, isReroll) {
  const th = S.thermal; const a = TH_ACTIONS[k];
  const mods = thMods(k); const mod = mods.reduce((s, m) => s + m[0], 0);
  const r = d20(); const total = r + mod;
  const need = k === 'equip' ? 5 : a.need;
  const ok = r === 20 || (r !== 1 && total >= need);
  th.lastRoll = { k, r, mod, need, ok };
  if (Save.data.settings.showDice) thMsg(`[d20=${r} ${mod >= 0 ? '+' : ''}${mod} = ${total} vs ${need}]`);
  th.maint[k] = false;
  th.last = k;
  if (ok) {
    if (k === 'rot') { th.act.rot = 90 * th.D / 300; th.rotOk = true; thMsg('Rotação funcionando: o calor se distribui (técnica do “espetinho”).'); sayRole('navegador', F('crew.c14')); }
    if (k === 'rad') { th.act.rad = 60 * th.D / 300; thMsg('Radiadores abertos: o calor sai por radiação.'); }
    if (k === 'heat') { th.act.heat = 60 * th.D / 300; thMsg('Aquecedores ligados.'); }
    if (k === 'rep') { th.repaired = true; thMsg('Isolamento reparado: o escudo para de perder espessura.'); sayRole('engenheiro2', F('crew.c15')); }
    if (k === 'shut') { th.act.shut = 60 * th.D / 300; th.shutOk = true; thMsg(`Persianas ${th.shutMode === 'abrir' ? 'abertas: soltando calor' : 'fechadas: segurando calor'}.`); }
    if (k === 'equip') { th.equipOff = false; S.equipOff = false; thMsg('Equipamentos religados com sucesso.'); }
    S.v++; return;
  }
  // falhou
  if (th.sangue && !isReroll) { th.pendingReroll = { k, t: 8 }; thMsg(`${a.name} falhou! (Sangue-frio disponível: rolar de novo?)`); S.v++; return; }
  thFailure(k);
}
function thFailure(k) {
  const th = S.thermal; const a = TH_ACTIONS[k];
  th.anyFail = true; th.fails++;
  const loss = has('voz') ? 1 : 2; moral(-loss);
  const panicAt = has('voz2') ? 3 : 2;
  if (th.fails >= panicAt && !th.panic) { th.panic = true; moral(-10); thMsg('PÂNICO NA TRIPULAÇÃO! Moral −10.'); }
  const sev = d10();
  const g = sev === 1 ? 'grave' : sev <= 4 ? 'média' : 'leve';
  let txt = '';
  if (k === 'rot') {
    if (g === 'leve') { th.act.rot = 40 * th.D / 300; th.weak.rot = true; th.sunMult = 1.3; txt = 'Gira pouco: o lado do Sol esquenta mais rápido.'; }
    if (g === 'média') { addRes('plantacao', -6, 'Propulsor travado'); th.plantsLost += 6; txt = 'Propulsor travado! Plantação −6 kg.'; sayRole('navegador', F('crew.c16')); }
    if (g === 'grave') { th.disabled.rot = true; th.act.rot = 0; addRes('combustivel', -50, 'Propulsor queimado'); th.fuel += 50; damageSys('propulsao', 15); txt = 'Propulsor queimou: sem controle de rotação e −50 kg de combustível.'; }
  }
  if (k === 'rad') {
    if (g === 'leve') { th.act.rad = 60 * th.D / 300; th.weak.rad = true; txt = 'Radiadores soltam menos calor: a temperatura sobe devagar.'; }
    if (g === 'média') { moral(-5); addRes('dados', -20, 'Perda de fluido do radiador'); th.gbLost += 20; txt = 'Perda de fluido: moral −5 e dados −20 GB.'; }
    if (g === 'grave') { th.disabled.rad = true; th.act.rad = 0; txt = 'Vazamento do fluido: radiador inutilizável até o fim da fase.'; }
  }
  if (k === 'heat') {
    if (g === 'leve') { th.act.heat = 60 * th.D / 300; th.weak.heat = true; txt = 'Aquecedores esquentam de forma irregular.'; }
    if (g === 'média') { S.commDown = 60 * th.D / 300; moral(-5); txt = 'Curto-circuito: comunicação cai por 1 min e moral −5.'; }
    if (g === 'grave') { const m = has('extintores') ? 0.5 : 1; addRes('energia', -9 * m, 'Incêndio pequeno'); addRes('oxigenio', -9 * m, 'Incêndio pequeno'); th.kwh += 9 * m; txt = `Incêndio pequeno: −${9 * m} kWh e −${9 * m} kg de oxigênio.`; S.shake = 0.4; }
  }
  if (k === 'rep') {
    if (g === 'leve') { addRes('escudo', -2.5, 'Conserto fraco'); txt = 'Conserto fraco: escudo −2,5 mm.'; }
    if (g === 'média') { addRes('escudo', -7.5, 'Conserto falhou'); txt = 'Escudo −7,5 mm.'; }
    if (g === 'grave') {
      const e = byRole('engenheiro').find(c => c.alive);
      if (e) { e.status = 'incapacitado'; e.statusT = th.D - th.el + 20; e.task = null; }
      addRes('medicos', -(has('tMed') ? 1 : 2), 'Atendimento do engenheiro');
      txt = 'Acidente: o engenheiro foi ferido! O paramédico gasta recursos médicos. (Ninguém morre.)';
    }
  }
  if (k === 'shut') {
    if (g === 'leve') { th.act.shut = 60 * th.D / 300; th.weak.shut = true; txt = 'Persianas abrem só um pouco.'; }
    if (g === 'média') { th.act.shut = 60 * th.D / 300; th.shutMode = 'abrir'; addRes('agua', -60, 'Persianas travadas (água congelou)'); txt = 'Persianas travaram abertas: a água congela (−60 L).'; }
    if (g === 'grave') { addRes('escudo', -5, 'Persianas danificaram o casco'); damageSys('casco', 5); txt = 'Persianas travaram e danificaram o casco: escudo −5 mm.'; }
  }
  if (k === 'equip') {
    if (g === 'leve') { th.equipDelay = 60 * th.D / 300; txt = 'Atraso de 1 min para religar.'; }
    if (g === 'média') { const l = has('tPesq') ? 15 : 30; addRes('dados', -l, 'Perda de dados'); th.gbLost += l; th.equipOff = false; S.equipOff = false; txt = `Perda de dados: −${l} GB.`; }
    if (g === 'grave') { const l = Math.max(0, S.res.dados - th.startData); addRes('dados', -l, 'Dados da fase perdidos'); th.gbLost += l; S.commDown = 120 * th.D / 300; th.equipOff = false; S.equipOff = false; txt = 'Perdemos os dados da fase e a comunicação com a Terra por 2 min.'; }
  }
  thMsg(`✖ ${a.name} falhou (${g}): ${txt}`);
  S.v++;
}

function thermalEnd(ev) {
  const th = S.thermal;
  const E = S.res.energia, sh = S.res.escudo;
  let grade, pts;
  if (E < 9 || sh < 25) {
    grade = 'Crítico'; pts = 0; // falha não rende pontos
    const v = pick(alive().filter(c => c.id !== 'cmd')); if (v) { v.status = 'ferido'; v.statusT = 90; }
    S.fragile = true;
  } else if (th.outT < th.D * 0.15 && th.fails <= 1 && E > 24) { grade = 'Excelente'; pts = 40; moral(10); }
  else { grade = 'Sobrevivência'; pts = 25; }
  narrate('A zona de calor ficou para trás. Aqui no espaço, cada grau precisa ser controlado por nós, com energia, tempo e recursos limitados. Na Terra, a atmosfera faz isso sozinha, de graça.');
  const text = `Resultado: ${grade}. Custo para manter a temperatura: ${fmt(th.kwh)} kWh de energia, ${fmt(th.fuel, 0)} kg de combustível. Plantação perdida: ${fmt(th.plantsLost, 0)} kg. Tempo fora da faixa segura: ${fmt(th.outT, 0)} s.`;
  ev.data.grade = grade;
  ev.data.report = { kwh: th.kwh, fuel: th.fuel, plants: th.plantsLost, outT: th.outT, fails: th.fails, gb: th.gbLost };
  endEvent(grade !== 'Crítico', { text, points: pts, grade, ok: grade !== 'Crítico' });
  S.event.result.points = pts;
  if (S.thermal) { S.equipOff = false; }
}

// ===================== ESTÁGIOS: ESTAÇÃO, PLANETA E MIGRAÇÃO =====================
const TRADES = [
  { id: 'racao', name: '50 GB de dados → 10 kg de ração', can: () => S.res.dados >= 50, do: () => { addRes('dados', -50, 'Escambo'); addRes('comida', 10, 'Escambo'); } },
  { id: 'sementes', name: '1 peça sobressalente → sementes (+8 kg de plantação)', can: () => S.peças >= 1, do: () => { S.peças--; addRes('plantacao', 8, 'Escambo'); } },
  { id: 'receita', name: '100 GB de dados → receita rara', can: () => S.res.dados >= 100 && RECIPES.some(r => !S.food.recipes.includes(r.id)), do: () => { addRes('dados', -100, 'Escambo'); const r = RECIPES.find(x => !S.food.recipes.includes(x.id)); S.food.recipes.push(r.id); toast('Nova receita no livro: ' + r.name); } },
  { id: 'medicos', name: '30 GB de dados → 3 recursos médicos', can: () => S.res.dados >= 30, do: () => { addRes('dados', -30, 'Escambo'); addRes('medicos', 3, 'Escambo'); } },
  { id: 'energia', name: '40 GB de dados → recarga de 30 kWh', can: () => S.res.dados >= 40, do: () => { addRes('dados', -40, 'Escambo'); addRes('energia', 30, 'Escambo'); } },
  { id: 'agua', name: '40 GB de dados → 100 L de água', can: () => S.res.dados >= 40, do: () => { addRes('dados', -40, 'Escambo'); addRes('agua', 100, 'Escambo'); } },
  { id: 'reparo', name: '10 kg de ração → reparo completo da Aviônica', can: () => S.res.comida >= 10, do: () => { addRes('comida', -10, 'Escambo'); S.systems.avionica.hp = 100; } },
];
ACTIONS.trade = p => { const t = TRADES.find(x => x.id === p.id); if (!t || !t.can()) return; t.do(); S.explore.trades++; toast('Troca feita: ' + t.name, 'good'); };
ACTIONS.analyzeExo = p => {
  if (S.explore.analyzed.includes(p.id)) return;
  const cost = has('lab') ? 5 : 10;
  if (S.res.dados < cost) return toast('Dados insuficientes para a análise.', 'warn');
  addRes('dados', -cost, 'Análise de exoplaneta'); S.explore.analyzed.push(p.id);
};
// Destino livre: o jogador pode escolher qualquer exoplaneta, até os errados (e aprender com as consequências).
ACTIONS.setDest = p => { if (EXOPLANETS.some(e => e.id === p.id)) S.explore.dest = p.id; };
ACTIONS.chooseExo = ACTIONS.setDest;
function tripCost(exo, back) {
  const t = exo.trip; const k = back ? 0.9 : 1;
  return { fuel: Math.round(t.fuel * k), o2: Math.round(t.o2 * k), food: Math.round(t.food * k), days: t.days };
}
function applyTripCost(c) {
  addRes('combustivel', -c.fuel, 'Desvio de rota'); addRes('oxigenio', -c.o2, 'Desvio de rota');
  addRes('comida', -c.food, 'Desvio de rota'); addRes('agua', -c.days * 4, 'Desvio de rota');
  S.day += c.days; S.v++;
}
ACTIONS.leaveStation = () => {
  const id = S.explore.dest;
  if (!id) return toast('Escolha primeiro o planeta de destino.', 'warn');
  if (id === 'pontes') {
    if (S.explore.analyzed.includes('pontes') && !S.explore.bonusPaid) { S.explore.bonusPaid = true; addPoints(60, 'Análise científica correta'); }
    narrate('Controle da Missão: rota confirmada para Pontes-01b. Raio parecido com o da Terra, temperatura amena e estrela calma.');
    S.explore.chosen = 'pontes';
    return leaveStation();
  }
  const exo = EXOPLANETS.find(e => e.id === id); if (!exo || !exo.trip) return;
  const c = tripCost(exo);
  if (S.res.combustivel < c.fuel) {
    applyTripCost({ fuel: S.res.combustivel, o2: Math.min(S.res.oxigenio, c.o2), food: Math.min(S.res.comida, c.food), days: c.days });
    return fail(`Você partiu para ${exo.name} sem combustível suficiente (${c.fuel} kg). A nave ficou à deriva. ${L(exo.trip.outcome)}`);
  }
  applyTripCost(c);
  S.explore.wrong = (S.explore.wrong || 0) + 1;
  const gain = addRes('dados', exo.trip.dados, 'Dados de exoplaneta') || 0;
  if (S.res.oxigenio <= 0) return fail(`O oxigênio acabou durante a viagem até ${exo.name}.`);
  if (S.res.comida <= 0) moral(-15);
  moral(exo.trip.moral);
  S.detour = { id, arrivedDay: S.day, dados: Math.round(gain) };
  S.scene = 'detour'; S.stage = 2;
  narrate(`Chegamos a ${exo.name}. Atenção: este não é o destino planejado.`);
};
ACTIONS.detourReturn = () => {
  if (S.scene !== 'detour' || !S.detour) return;
  const exo = EXOPLANETS.find(e => e.id === S.detour.id); const c = tripCost(exo, true);
  if (S.res.combustivel < c.fuel) {
    applyTripCost({ fuel: S.res.combustivel, o2: Math.min(S.res.oxigenio, c.o2), food: Math.min(S.res.comida, c.food), days: c.days });
    return fail(`Sem combustível para voltar de ${exo.name} (precisava de ${c.fuel} kg). A nave ficou presa lá, longe de Pontes-01b.`);
  }
  applyTripCost(c);
  if (S.res.oxigenio <= 0) return fail('O oxigênio acabou durante a volta à Estação Ponte-Alfa.');
  if (S.res.comida <= 0) moral(-15);
  S.explore.visited = S.explore.visited || {}; S.explore.visited[exo.id] = true;
  S.explore.dest = null; S.detour = null; S.scene = 'station'; S.stage = 2;
  moral(-3);
  addPoints(10, 'Lição aprendida: dados de um exoplaneta real');
  narrate('De volta à Estação Ponte-Alfa. Escolha o próximo destino com mais cuidado, Comandante.');
};

ACTIONS.planetAnalyze = p => {
  if (S.planet.analyzed.includes(p.id)) return;
  const an = PLANET_ANALYSES.find(a => a.id === p.id);
  if (S.res.dados < an.cost) return toast('Dados/armazenamento insuficientes.', 'warn');
  if (S.res.energia < 4) return toast('Energia insuficiente.', 'warn');
  addRes('dados', -an.cost * 0.5, 'Análise planetária'); addRes('energia', -4, 'Análise planetária');
  addRes('dados', an.cost * 0.3, 'Dados do planeta');
  let txt = '';
  if (!has('sonda')) {
    const r = d20() + (has('pouso') ? 3 : 0);
    if (r < 7) { damageSys('casco', 8); addRes('combustivel', -10, 'Descida de reconhecimento'); const v = pick(alive().filter(c => c.id !== 'cmd')); if (v) { v.status = 'ferido'; v.statusT = 30; } txt = ' A descida de reconhecimento foi turbulenta: casco danificado e um tripulante ferido.'; }
    else { addRes('combustivel', -10, 'Descida de reconhecimento'); txt = has('pouso') ? ' (Nave auxiliar usada.)' : ' (Sem sonda: a própria nave desceu para coletar.)'; }
  } else txt = ' (Sonda de reconhecimento: sem riscos para a tripulação.)';
  S.planet.analyzed.push(p.id);
  toast(`Análise de ${an.name} concluída.${txt}`, 'good');
};
const CHALLENGES = [
  { id: 'aclimatacao', name: 'Aclimatação ao ar de Pontes-01b', desc: 'O ar tem 19% de O₂ e pressão um pouco menor. A tripulação precisa se adaptar.', need: 9,
    mods: () => [[has('enfermaria') ? 2 : 0, 'enfermaria'], [roleAlive('paramedico') ? 2 : 0, 'paramédico'], [S.planet.analyzed.includes('atmosfera') ? 2 : 0, 'atmosfera analisada'], [moralIndex() < 40 ? -2 : 0, 'moral baixa']],
    fail: () => { moral(-10); const v = pick(alive().filter(c => c.id !== 'cmd')); if (v) { v.status = 'ferido'; v.statusT = 60; } return 'Tonturas e desmaios: um tripulante ferido, moral −10.'; } },
  { id: 'cultivo', name: 'Primeiro cultivo no solo alienígena', desc: 'O solo precisa de microrganismos terrestres para que as plantas cresçam.', need: 11,
    mods: () => [[has('sementes') ? 3 : 0, 'banco de sementes'], [roleAlive('agricultor') ? 2 : 0, 'agricultor'], [S.planet.analyzed.includes('solo') ? 3 : 0, 'solo analisado'], [S.adubo > 5 ? 1 : 0, 'adubo reciclado'], [has('estufa') ? 1 : 0, 'experiência da estufa']],
    fail: () => { addRes('comida', -10, 'Cultivo falhou'); addRes('plantacao', -10, 'Cultivo falhou'); return 'As primeiras mudas morreram. Comida e sementes perdidas.'; } },
  { id: 'abrigo', name: 'Montar abrigo e energia na superfície', desc: 'Painéis, isolamento e um abrigo pressurizado precisam ficar prontos antes da noite.', need: 9,
    mods: () => [[byRole('engenheiro').filter(c => c.alive).length * 2, 'engenheiros'], [S.peças > 0 ? 1 : 0, 'peças sobressalentes'], [S.res.energia > 30 ? 1 : 0, 'energia sobrando'], [has('impressora') ? 2 : 0, 'impressora 3D'], [S.planet.analyzed.includes('radiacao') ? 1 : 0, 'radiação mapeada']],
    fail: () => { addRes('energia', -20, 'Abrigo improvisado'); moral(-6); return 'O abrigo ficou improvisado: energia −20 kWh e moral −6.'; } },
];
ACTIONS.challenge = p => {
  if (S.planet.challenges.find(c => c.id === p.id)) return;
  const ch = CHALLENGES.find(c => c.id === p.id);
  const mod = ch.mods().reduce((s, m) => s + m[0], 0);
  let r = d20();
  if (has('sangue') && r + mod < ch.need && r !== 20) { const r2 = d20(); if (r2 > r) { r = r2; logMsg('Sangue-frio: nova rolagem.'); } }
  const ok = r === 20 || (r !== 1 && r + mod >= ch.need);
  const txt = ok ? 'Sucesso!' : ch.fail();
  S.planet.challenges.push({ id: ch.id, ok, txt });
  if (ok) addPoints(30, ch.name);
  toast(`${ch.name}: ${ok ? 'sucesso' : 'falhou'}. ${ok ? '' : txt}`, ok ? 'good' : 'bad');
};
ACTIONS.toMigration = () => {
  if (S.planet.challenges.length < CHALLENGES.length) return toast('Enfrente todos os desafios de adaptação antes.', 'warn');
  S.stage = 4; S.scene = 'migration';
  narrate('Migração. Decida o destino da expedição e organize a chegada, considerando as investigações e os recursos disponíveis.');
};
ACTIONS.chooseSite = p => { S.planet.site = p.id; };
ACTIONS.land = () => {
  if (!S.planet.site) return toast('Escolha um local de pouso.', 'warn');
  const site = LANDING_SITES.find(s => s.id === S.planet.site);
  const need = has('pouso') ? 40 : 80;
  const reasons = [];
  if (S.res.combustivel < need) reasons.push(`Combustível insuficiente para o pouso (precisa de ${need} kg).`);
  let score = 0; const det = [];
  for (const k in site.score) { const known = S.planet.analyzed.includes(k); const v = site.score[k]; score += known ? v : Math.min(v, 0) - (known ? 0 : 0.5); det.push(k); }
  score += S.planet.challenges.filter(c => c.ok).length;
  if (has('sementes')) score += 1;
  const food = S.res.comida + Object.values(S.food.fresh).reduce((a, b) => a + b, 0);
  if (food < 8 && !has('sementes') && S.res.plantacao < 15) reasons.push('Sem comida nem sementes para começar a colônia.');
  if (score < 3) reasons.push('O local escolhido não foi bem investigado ou é hostil demais para a colônia.');
  if (!has('pouso')) {
    const r = d20();
    if (r < 6) { damageSys('casco', 40); addRes('casco', -40, 'Pouso difícil'); if (sysHp('casco') <= 0) reasons.push('A nave principal se partiu no pouso.'); else { const v = pick(alive().filter(c => c.id !== 'cmd')); if (v && d10() <= 3) kill(v, 'pouso difícil'); } }
  }
  addRes('combustivel', -Math.min(need, S.res.combustivel), 'Pouso');
  if (S.fail) return;
  if (alive().length < 3) reasons.push('Restaram menos de 3 tripulantes.');
  if (reasons.length) { fail(reasons.join(' ')); return; }
  addPoints(200, 'Chegada a Pontes-01b');
  startColony(site, score); // o jogo continua na superfície de Pontes-01b
};
