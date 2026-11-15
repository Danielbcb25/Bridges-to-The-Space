// ============================================================
//  BANCO DE DADOS DA NASA — o computador de bordo comenta cada
//  desafio com dados reais da NASA e faz um relatório no final.
//  Fontes: NASA Exoplanet Archive (consulta de 15/11/2026),
//  páginas da NASA sobre a ISS, ECLSS, DSN, DART, Orion e Artemis.
// ============================================================
'use strict';

const NASA_EXO_COUNT = 6470; // NASA Exoplanet Archive, tabela "ps" (default_flag=1), 15/11/2026
const NASA_EVFACTS = {
  termico: { src: 'NASA — ISS Active Thermal Control System', t: K(
    'A ISS joga o calor para o espaço com radiadores de amônia. Sem eles, a face virada para o Sol passaria de 120 °C e a da sombra cairia abaixo de −150 °C.',
    'The ISS dumps heat into space with ammonia radiators. Without them, the sunlit side would pass 120 °C (250 °F) and the shaded side would drop below −150 °C (−240 °F).',
    'La ISS expulsa el calor al espacio con radiadores de amoníaco. Sin ellos, la cara al Sol superaría los 120 °C y la de la sombra bajaría de −150 °C.') },
  asteroides: { src: 'NASA — Planetary Defense / DART', t: K(
    'A NASA acompanha mais de 35 mil asteroides próximos da Terra. Em 2022, a missão DART bateu de propósito no asteroide Dimorphos e encurtou a órbita dele em 32 minutos.',
    'NASA tracks more than 35,000 near-Earth asteroids. In 2022 the DART mission deliberately struck the asteroid Dimorphos and shortened its orbit by 32 minutes.',
    'La NASA sigue más de 35 mil asteroides cercanos a la Tierra. En 2022 la misión DART chocó a propósito con el asteroide Dimorphos y acortó su órbita en 32 minutos.') },
  brecha: { src: 'NASA — ISS Soyuz MS-09 leak (2018)', t: K(
    'Em 2018, um furo de cerca de 2 mm numa nave Soyuz acoplada à ISS fez a pressão cair aos poucos. A tripulação achou o furo e o selou com selante epóxi e gaze.',
    'In 2018 a hole about 2 mm wide in a Soyuz docked to the ISS made the pressure drop slowly. The crew found it and sealed it with epoxy sealant and gauze.',
    'En 2018 un agujero de unos 2 mm en una Soyuz acoplada a la ISS hizo bajar la presión poco a poco. La tripulación lo encontró y lo selló con sellador epoxi y gasa.') },
  combFalta: { src: 'NASA — Voyager mission', t: K(
    'Missões de longa distância economizam combustível com a gravidade dos planetas: a Voyager 2 usou Júpiter, Saturno, Urano e Netuno como "estilingues".',
    'Long-distance missions save fuel using planetary gravity: Voyager 2 used Jupiter, Saturn, Uranus and Neptune as "slingshots".',
    'Las misiones de larga distancia ahorran combustible con la gravedad de los planetas: la Voyager 2 usó a Júpiter, Saturno, Urano y Neptuno como "hondas".') },
  combVaz: { src: 'NASA JPL — Dawn mission (ion propulsion)', t: K(
    'A sonda Dawn usou propulsão iônica: gastava só cerca de 3,25 mg de xenônio por segundo e, mesmo assim, visitou dois mundos, Vesta e Ceres.',
    'The Dawn probe used ion propulsion: it burned only about 3.25 mg of xenon per second and still visited two worlds, Vesta and Ceres.',
    'La sonda Dawn usó propulsión iónica: gastaba solo unos 3,25 mg de xenón por segundo y aun así visitó dos mundos, Vesta y Ceres.') },
  oxigenio: { src: 'NASA — ISS Environmental Control and Life Support System (ECLSS)', t: K(
    'Na ISS, o oxigênio vem da água: o Sistema Gerador de Oxigênio separa a água em hidrogênio e oxigênio por eletrólise. Em 2023, o suporte à vida da estação passou a recuperar 98% da água.',
    'On the ISS, oxygen comes from water: the Oxygen Generation System splits water into hydrogen and oxygen by electrolysis. In 2023 the station\'s life support reached 98% water recovery.',
    'En la ISS el oxígeno viene del agua: el Sistema Generador de Oxígeno separa el agua en hidrógeno y oxígeno por electrólisis. En 2023 el soporte vital de la estación llegó a recuperar el 98 % del agua.') },
  painel: { src: 'NASA — Deep Space Network', t: K(
    'No espaço profundo, as naves são guiadas pela Deep Space Network da NASA: antenas de até 70 m na Califórnia, na Espanha e na Austrália, separadas por cerca de 120° para nunca perder o sinal.',
    'In deep space, spacecraft are guided by NASA\'s Deep Space Network: antennas up to 70 m (230 ft) wide in California, Spain and Australia, about 120° apart so the signal is never lost.',
    'En el espacio profundo, las naves se guían con la Deep Space Network de la NASA: antenas de hasta 70 m en California, España y Australia, separadas unos 120° para no perder nunca la señal.') },
  lixo: { src: 'NASA — ISS waste management', t: K(
    'Na ISS, o lixo é guardado em naves de carga que, depois de desacopladas, queimam na reentrada na atmosfera. No espaço, nada some sozinho.',
    'On the ISS, trash is packed into cargo ships that burn up on reentry after undocking. In space, nothing just goes away.',
    'En la ISS la basura se guarda en naves de carga que, tras desacoplarse, se queman al reentrar en la atmósfera. En el espacio nada desaparece solo.') },
  radio: { src: 'NASA — Mars communications / Voyager', t: K(
    'Um sinal de rádio leva de 3 a 22 minutos para ir da Terra a Marte. A Voyager 1, a nave mais distante, está a cerca de um dia-luz da Terra.',
    'A radio signal takes 3 to 22 minutes to travel from Earth to Mars. Voyager 1, the most distant spacecraft, is about one light-day from Earth.',
    'Una señal de radio tarda de 3 a 22 minutos en ir de la Tierra a Marte. La Voyager 1, la nave más lejana, está a cerca de un día luz de la Tierra.') },
  contaminacao: { src: 'NASA — ISS Water Recovery System', t: K(
    'O Sistema de Recuperação de Água da ISS transforma suor, umidade do ar e até urina em água potável, mais limpa que a de muitas torneiras na Terra.',
    'The ISS Water Recovery System turns sweat, cabin humidity and even urine into drinking water that is cleaner than many taps on Earth.',
    'El Sistema de Recuperación de Agua de la ISS convierte el sudor, la humedad del aire e incluso la orina en agua potable, más limpia que la de muchos grifos de la Tierra.') },
  traje: { src: 'NASA — Spacewalks (EVA 23, 2013)', t: K(
    'As caminhadas espaciais duram em média 6 horas e meia. Em 2013, água vazou para dentro do capacete do astronauta Luca Parmitano e a caminhada foi abortada às pressas.',
    'Spacewalks last about 6.5 hours on average. In 2013, water leaked into astronaut Luca Parmitano\'s helmet and the spacewalk was quickly aborted.',
    'Las caminatas espaciales duran en promedio 6 horas y media. En 2013 entró agua en el casco del astronauta Luca Parmitano y la caminata se abortó de urgencia.') },
  doenca: { src: 'NASA Human Research Program', t: K(
    'Na microgravidade, os fluidos do corpo sobem para a cabeça: o rosto incha, o nariz entope e alguns astronautas têm alterações nos olhos (a síndrome SANS).',
    'In microgravity, body fluids shift toward the head: faces get puffy, noses get stuffy and some astronauts develop eye changes (a condition called SANS).',
    'En microgravedad, los fluidos del cuerpo suben a la cabeza: la cara se hincha, la nariz se tapa y algunos astronautas sufren cambios en los ojos (el síndrome SANS).') },
  tempestade: { src: 'NASA — Orion / Artemis I radiation shelter', t: K(
    'Fora da proteção magnética da Terra, uma tempestade solar é perigosa. Na cápsula Orion, a tripulação monta um abrigo no centro da nave usando os próprios sacos de carga como blindagem.',
    'Outside Earth\'s magnetic shield, a solar storm is dangerous. In the Orion capsule, the crew builds a shelter in the middle of the ship using their own cargo bags as shielding.',
    'Fuera de la protección magnética de la Tierra, una tormenta solar es peligrosa. En la cápsula Orion, la tripulación arma un refugio en el centro de la nave con sus propias bolsas de carga como blindaje.') },
};
const NASA_ENDFACTS = [
  { src: 'NASA Exoplanet Archive (15/11/2026)', t: () => K(
    `A NASA já confirmou ${NASA_EXO_COUNT.toLocaleString('pt-BR')} exoplanetas, e nenhum deles foi confirmado como habitável.`,
    `NASA has confirmed ${NASA_EXO_COUNT.toLocaleString('en-US')} exoplanets, and none of them has been confirmed as habitable.`,
    `La NASA ya confirmó ${NASA_EXO_COUNT.toLocaleString('es-ES')} exoplanetas, y ninguno se ha confirmado como habitable.`) },
  { src: 'NASA Exoplanet Archive — Proxima Cen b', t: () => K(
    'O exoplaneta mais próximo, Proxima Centauri b, fica a 4,2 anos-luz. Na velocidade da Voyager 1 (17 km/s), a viagem levaria uns 75 mil anos.',
    'The closest exoplanet, Proxima Centauri b, is 4.2 light-years away. At Voyager 1\'s speed (17 km/s), the trip would take about 75,000 years.',
    'El exoplaneta más cercano, Proxima Centauri b, está a 4,2 años luz. A la velocidad de la Voyager 1 (17 km/s), el viaje tardaría unos 75 mil años.') },
  { src: 'NASA GISS — Global temperature', t: () => K(
    'Segundo a NASA, 2024 foi o ano mais quente já registrado na Terra. Cuidar do único planeta habitável que conhecemos ainda é a missão mais importante.',
    'According to NASA, 2024 was the warmest year on record on Earth. Taking care of the only habitable planet we know is still the most important mission.',
    'Según la NASA, 2024 fue el año más cálido registrado en la Tierra. Cuidar el único planeta habitable que conocemos sigue siendo la misión más importante.') },
];

// depois de cada desafio, o computador mostra o dado da NASA daquele tema
{
  const _close = closeEvent;
  closeEvent = function () {
    const ev = S && S.event; const type = ev && ev.type;
    _close();
    if (type && NASA_EVFACTS[type] && S) {
      S.nasaSeen = S.nasaSeen || []; if (!S.nasaSeen.includes(type)) S.nasaSeen.push(type);
      S.nasaLast = { type, at: S.journeyTime || 0 }; S.v++;
    }
  };
}
function nasaCard() {
  if (!S || !S.nasaLast || !['ship', 'colony'].includes(S.scene)) return '';
  const n = S.nasaLast; if ((S.journeyTime || 0) - n.at > 25 || U.nasaHide === n.at) return '';
  const f = NASA_EVFACTS[n.type]; if (!f) return '';
  return `<div class="nasa-card"><button class="x" data-ui="nasaHide">✕</button><b>💻 ${esc(L('Banco de dados da NASA'))}</b><p>${esc(L(f.t))}</p><small>${esc(L('Fonte'))}: ${esc(f.src)}</small></div>`;
}
UIH.nasaHide = () => { if (S && S.nasaLast) U.nasaHide = S.nasaLast.at; };
// lista para o painel do computador (H) e para o relatório final
function nasaList(withEnd) {
  const seen = (S && S.nasaSeen) || [];
  const out = seen.map(t => NASA_EVFACTS[t]).filter(Boolean).map(f => ({ t: f.t, src: f.src }));
  if (withEnd) NASA_ENDFACTS.forEach(f => out.push({ t: f.t(), src: f.src }));
  return out;
}
function nasaReport() {
  const list = nasaList(true);
  return `<div class="nasa-report"><h4>💻 ${esc(L('Relatório do computador de bordo: dados reais da NASA'))}</h4>${list.map(f => `<div class="nf"><p>${esc(L(f.t))}</p><small>${esc(L('Fonte'))}: ${esc(f.src)}</small></div>`).join('')}</div>`;
}
