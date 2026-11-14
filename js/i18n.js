// ============================================================
//  IDIOMAS — tradutor do site e do jogo (PT · EN · ES)
//  • L({pt,en,es})  → texto novo já escrito nos 3 idiomas
//  • T('texto PT')  → traduz um texto em português usando os dicionários
//  • I18n.dom(html) → traduz o HTML renderizado pela interface
//  Textos sem tradução caem para o português (nunca quebram).
// ============================================================
'use strict';

const LANGS = [
  { id: 'pt', label: 'Português', flag: '🇧🇷', speech: 'pt-BR' },
  { id: 'en', label: 'English', flag: '🇺🇸', speech: 'en-US' },
  { id: 'es', label: 'Español', flag: '🇪🇸', speech: 'es-ES' },
];
const I18N_DICT = { en: {}, es: {} };      // chave = texto em PT (ou chave estática do index.html)
const I18N_PATTERNS = { en: [], es: [] };  // [RegExp, 'substituição $1']

const I18n = {
  lang: 'pt',
  init() {
    let l = null;
    try { l = (Save.data.settings.lang) || null; } catch (e) { /* */ }
    if (!l || !LANGS.some(x => x.id === l)) l = 'en'; // inglês é o idioma padrão
    this.lang = l;
    this.apply();
  },
  set(l) {
    if (!LANGS.some(x => x.id === l)) return;
    this.lang = l;
    try { Save.data.settings.lang = l; Save.write(); } catch (e) { /* */ }
    if (typeof U !== 'undefined') U.cache = {};
    if (typeof Narrator !== 'undefined') { Narrator.voice = null; }
    this.apply();
    if (typeof Chat !== 'undefined' && Chat.render) Chat.render(true);
  },
  speech() { return (LANGS.find(x => x.id === this.lang) || LANGS[0]).speech; },
  // traduz a página estática (index.html): elementos com data-i18n="chave" guardam o HTML original em data-pt
  apply() {
    document.documentElement.lang = this.lang === 'pt' ? 'pt-BR' : this.lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (el.dataset.pt == null) el.dataset.pt = el.innerHTML;
      const k = el.dataset.i18n;
      const v = this.lang === 'pt' ? null : (I18N_DICT[this.lang][k]);
      el.innerHTML = v != null ? v : el.dataset.pt;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(',').forEach(spec => {
        const [attr, k] = spec.split(':');
        if (el.dataset['pt_' + attr] == null) el.dataset['pt_' + attr] = el.getAttribute(attr) || '';
        const v = this.lang === 'pt' ? null : I18N_DICT[this.lang][k];
        el.setAttribute(attr, v != null ? v : el.dataset['pt_' + attr]);
      });
    });
    const sel = document.getElementById('lang');
    if (sel && sel.value !== this.lang) sel.value = this.lang;
    const t = this.lang === 'pt' ? 'Pontes01 — Exploração Espacial' : (I18N_DICT[this.lang]['title'] || document.title);
    document.title = t;
  },
  // texto isolado
  _c: { en: new Map(), es: new Map() },
  t(s) {
    if (this.lang === 'pt' || s == null || s === '' || typeof s !== 'string') return s;
    const cache = this._c[this.lang];
    const hit = cache.get(s); if (hit !== undefined) return hit;
    const d = I18N_DICT[this.lang]; let out = s;
    const k = s.trim();
    if (k.startsWith('Narração: ') && d['Narração:']) out = s.replace(k, d['Narração:'] + ' ' + this.t(k.slice(10)));
    else if (d[s] != null) out = d[s];
    else if (k && d[k] != null) out = s.replace(k, d[k]);
    else {
      let done = false;
      for (const [re, rep] of I18N_PATTERNS[this.lang]) { if (re.test(k)) { out = s.replace(k, k.replace(re, rep)); done = true; break; } }
      if (!done) {
        let m;
        // fala de tripulante: "Engenheiro 1 João: “...”", "Navegador Ana ★"
        if ((m = /^(Paramédico|Navegador|Agricultor \/ Eng\. Genético|Engenheiro \d|Pesquisador Chefe|Comandante)( .*)$/.exec(k))) {
          const rest = m[2]; const sp = /^ (.+?): “(.+)”$/.exec(rest);
          out = s.replace(k, this.t(m[1]) + (sp ? ' ' + sp[1] + ': “' + this.t(sp[2]) + '”' : rest.replace(/^ Comandante$/, ' ' + this.t('Comandante'))));
        }
        // símbolos no início ("▶ ", "— ", "✔ ") e sufixo " — Comandante"
        else if ((m = /^([^\p{L}\p{N}"“(]+)(.+)$/u.exec(k)) && this.t(m[2]) !== m[2]) out = s.replace(k, m[1] + this.t(m[2]));
        else if ((m = /^(.+?)( — )([^—]+)$/.exec(k)) && (this.t(m[1]) !== m[1] || this.t(m[3]) !== m[3])) out = s.replace(k, this.t(m[1]) + m[2] + this.t(m[3]));
      }
    }
    if (cache.size > 4000) cache.clear();
    cache.set(s, out); return out;
  },
  // HTML da interface → HTML traduzido (nós de texto + alguns atributos)
  dom(html) {
    if (this.lang === 'pt' || !html) return html;
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    const walk = n => {
      if (n.nodeType === 3) {
        const raw = n.nodeValue; const k = raw.trim();
        if (k) { const v = this.t(k); if (v !== k) n.nodeValue = raw.replace(k, v); }
      } else if (n.nodeType === 1) {
        for (const a of ['title', 'placeholder', 'alt']) if (n.hasAttribute(a)) n.setAttribute(a, this.t(n.getAttribute(a)));
        n.childNodes.forEach(walk);
      }
    };
    tpl.content.childNodes.forEach(walk);
    return tpl.innerHTML;
  },
};

// texto novo nos 3 idiomas
const K = (pt, en, es) => ({ pt, en, es });
// atalhos globais
const L = o => (o == null ? '' : typeof o === 'string' ? I18n.t(o) : (o[I18n.lang] != null ? o[I18n.lang] : (o.pt != null ? o.pt : '')));
const T = s => I18n.t(s);
