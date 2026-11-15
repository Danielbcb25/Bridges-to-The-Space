// ============================================================
//  FALAS — os textos falados ficam em data/lang/<idioma>.json ("falas")
//  (narração, moradores da cidade, tripulação, Controle da Missão,
//  introduções de cada modo de jogo). F('crew.c4') → {pt,en,es}
// ============================================================
'use strict';
const FALAS = {};
function F(path) { let o = FALAS; for (const k of path.split('.')) o = o == null ? o : o[k]; return o == null ? path : o; }
async function loadFalas() {
  Object.assign(FALAS, await loadLangs()); // falas e traduções vêm de data/lang/<idioma>.json
  NARRATION_INTRO.splice(0, NARRATION_INTRO.length, ...(FALAS.story || []));
  NASA_FACTS.splice(0, NASA_FACTS.length, ...(FALAS.nasa || []));
  CFACTS.splice(0, CFACTS.length, ...(FALAS.colonyFacts || []));
  CITY_NPCS.forEach(n => Object.assign(n, (FALAS.npc || {})[n.id] || {}));
}
