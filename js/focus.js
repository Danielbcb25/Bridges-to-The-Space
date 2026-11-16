// ============================================================
//  MENOS POLUIÇÃO NA TELA + TEMPO AUTOMÁTICO
//  • Durante um desafio só ficam o painel do evento e a rotina:
//    some a barra de dicas do computador, o "Você sabia?" e o
//    aviso de fome (voltam quando o desafio acaba).
//  • Parado por 5 s na nave (sem desafio, sem painel aberto e sem
//    tarefa pendente da rotina), o tempo vai para 10x até o próximo
//    evento, como o Shift+S. Qualquer tecla ou clique volta ao normal.
// ============================================================
'use strict';

const IDLE_FAST_AFTER = 5; // segundos parado
const inChallenge = () => !!(S && S.event && S.event.phase !== 'result');

(function () {
  // ---------- foco no desafio ----------
  const _assist = assistMini;
  assistMini = function () { return inChallenge() ? '' : _assist(); };
  const _lesson = lessonCard;
  lessonCard = function () { return inChallenge() ? '' : _lesson(); };
  const _hItem = hungerItem;
  hungerItem = function () { return inChallenge() ? null : _hItem(); };
  const _hTick = hungerTick;
  hungerTick = function () { if (!inChallenge()) _hTick(); }; // o aviso de fome espera o desafio acabar
  // começou um desafio: some o aviso de fome que estava na tela (ele volta depois do desafio)
  const _start = startEvent;
  startEvent = function (t) {
    _start(t);
    if (!S || !S.event) return;
    const tx = S.toast && String(L(S.toast.text) || '');
    if (tx && /🍴/.test(tx)) S.toast = null;
    for (const c of alive()) if (c.hungryWarned && c.saciedade < HUNGRY) c.hungryWarned = false;
  };

  // ---------- tempo automático quando o jogador fica parado ----------
  U.lastInput = performance.now();
  const wake = e => {
    if (e && e.type === 'keydown' && e.code === 'KeyS' && e.shiftKey) { if (S) S.autoFast = false; U.lastInput = performance.now(); return; } // Shift+S: o jogador assume
    U.lastInput = performance.now();
    if (S && S.autoFast) { S.autoFast = false; if (S.fast) { S.fast = 0; toastLocal(K('▶ Tempo normal.', '▶ Normal time.', '▶ Tiempo normal.')); } }
  };
  document.addEventListener('keydown', wake, true);
  document.addEventListener('pointerdown', wake, true);
  document.addEventListener('wheel', wake, { capture: true, passive: true });

  const routinePending = () => { const r = S.routine; return !!(r && r.day === S.day && r.items.some(x => !x.done)); };
  setInterval(() => {
    if (!S || U.screen !== 'game' || S.paused || (typeof Net !== 'undefined' && Net.role === 'client')) return;
    if (S.autoFast && (!S.fast || inChallenge())) S.autoFast = false; // o evento chegou (ou alguém mudou o tempo)
    if (S.fast || inChallenge()) return;
    if (!['ship', 'colony'].includes(S.scene)) return;
    if (U.panel || U.help || U.qmenu || U.qset || (typeof Chat !== 'undefined' && Chat.open)) return;
    const m = me(); if (m && (m.task || m.ctask || (m.saciedade != null && m.saciedade < 40 && S.scene === 'ship'))) return;
    if (S.scene === 'ship' && routinePending()) return; // ainda tem tarefa do dia: não pula o tempo do jogador
    if ((performance.now() - U.lastInput) / 1000 < IDLE_FAST_AFTER) return;
    S.fast = 10; S.autoFast = true;
    toastLocal(K('⏩ Parado por 5 s: tempo 10x até o próximo evento (qualquer tecla volta ao normal).', '⏩ Idle for 5 s: time 10x until the next event (any key returns to normal).', '⏩ Inactivo 5 s: tiempo 10x hasta el próximo evento (cualquier tecla vuelve a lo normal).'));
  }, 500);
})();
