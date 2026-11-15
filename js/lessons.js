// ============================================================
//  LIÇÕES NA GAMEPLAY — depois de cada desafio o computador de bordo
//  conta uma curiosidade real sobre o tema. As perguntas (que dão
//  créditos) ficam só no Quiz da tela inicial; o que você aprendeu
//  aqui vale bônus lá.
// ============================================================
'use strict';

const EXO_COUNT = 6470; // exoplanetas confirmados (Exoplanet Archive, 15/11/2026)
// fato contado pelo computador + a pergunta correspondente, que entra no Quiz da tela inicial
const EV_LESSONS = {
  termico: {
    fact: K('A Estação Espacial joga o calor para o espaço com radiadores de amônia. Sem eles, a face virada para o Sol passaria de 120 °C e a da sombra cairia abaixo de −150 °C.',
      'The Space Station dumps heat into space with ammonia radiators. Without them, the sunlit side would pass 120 °C (250 °F) and the shaded side would drop below −150 °C (−240 °F).',
      'La Estación Espacial expulsa el calor al espacio con radiadores de amoníaco. Sin ellos, la cara al Sol superaría los 120 °C y la de la sombra bajaría de −150 °C.'),
    quiz: Q('ev:termico', '', ['Como a Estação Espacial se livra do excesso de calor?', 'How does the Space Station get rid of extra heat?', '¿Cómo se libra la Estación Espacial del exceso de calor?'],
      [['Com radiadores de amônia', 'With ammonia radiators', 'Con radiadores de amoníaco'], ['Abrindo as janelas', 'By opening the windows', 'Abriendo las ventanas'], ['Com ventiladores para fora', 'With fans blowing outside', 'Con ventiladores hacia afuera'], ['Não precisa, o espaço é frio', 'It doesn\'t need to, space is cold', 'No hace falta, el espacio es frío']], 0,
      ['No vácuo não há ar para levar o calor: ele só sai por radiação.', 'In a vacuum there is no air to carry heat away: it can only leave as radiation.', 'En el vacío no hay aire que se lleve el calor: solo sale por radiación.']) },
  asteroides: {
    fact: K('Mais de 35 mil asteroides próximos da Terra são acompanhados por telescópios. Em 2022, a missão DART bateu de propósito no asteroide Dimorphos e encurtou a órbita dele em 32 minutos.',
      'More than 35,000 near-Earth asteroids are tracked by telescopes. In 2022 the DART mission deliberately struck the asteroid Dimorphos and shortened its orbit by 32 minutes.',
      'Telescopios siguen más de 35 mil asteroides cercanos a la Tierra. En 2022 la misión DART chocó a propósito con el asteroide Dimorphos y acortó su órbita en 32 minutos.'),
    quiz: Q('ev:asteroides', '', ['O que a missão DART fez em 2022?', 'What did the DART mission do in 2022?', '¿Qué hizo la misión DART en 2022?'],
      [['Desviou um asteroide batendo nele', 'Deflected an asteroid by hitting it', 'Desvió un asteroide chocando con él'], ['Pousou em Marte', 'Landed on Mars', 'Aterrizó en Marte'], ['Fotografou Plutão', 'Photographed Pluto', 'Fotografió Plutón'], ['Levou turistas à Lua', 'Took tourists to the Moon', 'Llevó turistas a la Luna']], 0,
      ['Foi o primeiro teste real de defesa planetária: a órbita de Dimorphos ficou 32 minutos mais curta.', 'It was the first real planetary defense test: Dimorphos\'s orbit got 32 minutes shorter.', 'Fue la primera prueba real de defensa planetaria: la órbita de Dimorphos se acortó 32 minutos.']) },
  brecha: {
    fact: K('Em 2018, um furo de cerca de 2 mm numa nave Soyuz acoplada à Estação Espacial fez a pressão cair aos poucos. A tripulação achou o furo e o selou com selante epóxi e gaze.',
      'In 2018 a hole about 2 mm wide in a Soyuz docked to the Space Station made the pressure drop slowly. The crew found it and sealed it with epoxy sealant and gauze.',
      'En 2018 un agujero de unos 2 mm en una Soyuz acoplada a la Estación Espacial hizo bajar la presión poco a poco. La tripulación lo encontró y lo selló con sellador epoxi y gasa.'),
    quiz: Q('ev:brecha', '', ['Com o que a tripulação selou o furo na Soyuz em 2018?', 'What did the crew use to seal the hole in the Soyuz in 2018?', '¿Con qué selló la tripulación el agujero de la Soyuz en 2018?'],
      [['Selante epóxi e gaze', 'Epoxy sealant and gauze', 'Sellador epoxi y gasa'], ['Fita adesiva comum', 'Regular tape', 'Cinta adhesiva común'], ['Chiclete', 'Chewing gum', 'Chicle'], ['Não selaram, voltaram à Terra', 'They didn\'t, they went back to Earth', 'No lo sellaron, volvieron a la Tierra']], 0,
      ['O furo tinha só 2 mm, mas no espaço até um vazamento pequeno vai esvaziando o ar.', 'The hole was only 2 mm, but in space even a small leak slowly drains the air.', 'El agujero tenía solo 2 mm, pero en el espacio hasta una fuga pequeña va vaciando el aire.']) },
  combFalta: {
    fact: K('Missões de longa distância economizam combustível usando a gravidade dos planetas: a Voyager 2 passou por Júpiter, Saturno, Urano e Netuno ganhando velocidade como num estilingue.',
      'Long-distance missions save fuel using planetary gravity: Voyager 2 flew past Jupiter, Saturn, Uranus and Neptune, gaining speed like a slingshot.',
      'Las misiones de larga distancia ahorran combustible con la gravedad de los planetas: la Voyager 2 pasó por Júpiter, Saturno, Urano y Neptuno ganando velocidad como con una honda.'),
    quiz: Q('ev:combFalta', '', ['Como uma sonda pode ganhar velocidade sem gastar combustível?', 'How can a probe gain speed without burning fuel?', '¿Cómo puede una sonda ganar velocidad sin gastar combustible?'],
      [['Passando perto de um planeta (assistência gravitacional)', 'Flying close to a planet (gravity assist)', 'Pasando cerca de un planeta (asistencia gravitatoria)'], ['Abrindo uma vela de pano', 'Opening a cloth sail', 'Abriendo una vela de tela'], ['Desligando os motores', 'Turning off the engines', 'Apagando los motores'], ['Não é possível', 'It is not possible', 'No es posible']], 0,
      ['A gravidade do planeta "puxa" e lança a sonda: foi assim que a Voyager 2 visitou quatro planetas gigantes.', 'The planet\'s gravity "pulls" and flings the probe: that is how Voyager 2 visited four giant planets.', 'La gravedad del planeta "tira" y lanza la sonda: así la Voyager 2 visitó cuatro planetas gigantes.']) },
  combVaz: {
    fact: K('A sonda Dawn usou propulsão iônica: gastava só cerca de 3,25 mg de xenônio por segundo e, mesmo assim, visitou dois mundos, Vesta e Ceres.',
      'The Dawn probe used ion propulsion: it burned only about 3.25 mg of xenon per second and still visited two worlds, Vesta and Ceres.',
      'La sonda Dawn usó propulsión iónica: gastaba solo unos 3,25 mg de xenón por segundo y aun así visitó dos mundos, Vesta y Ceres.'),
    quiz: Q('ev:combVaz', '', ['Que tipo de motor a sonda Dawn usou para visitar Vesta e Ceres?', 'What kind of engine did the Dawn probe use to visit Vesta and Ceres?', '¿Qué tipo de motor usó la sonda Dawn para visitar Vesta y Ceres?'],
      [['Propulsão iônica (xenônio)', 'Ion propulsion (xenon)', 'Propulsión iónica (xenón)'], ['Motor a vapor', 'Steam engine', 'Motor a vapor'], ['Hélice', 'Propeller', 'Hélice'], ['Vela solar de papel', 'Paper solar sail', 'Vela solar de papel']], 0,
      ['O empurrão é fraquinho, mas dura meses: economia enorme de combustível.', 'The push is tiny, but it lasts for months: huge fuel savings.', 'El empuje es muy débil, pero dura meses: un ahorro enorme de combustible.']) },
  oxigenio: {
    fact: K('Na Estação Espacial, o oxigênio vem da água: um gerador separa a água em hidrogênio e oxigênio por eletrólise. Em 2023, o suporte à vida da estação passou a recuperar 98% da água.',
      'On the Space Station, oxygen comes from water: a generator splits water into hydrogen and oxygen by electrolysis. In 2023 the station\'s life support reached 98% water recovery.',
      'En la Estación Espacial el oxígeno viene del agua: un generador separa el agua en hidrógeno y oxígeno por electrólisis. En 2023 el soporte vital de la estación llegó a recuperar el 98 % del agua.'),
    quiz: Q('ev:oxigenio', '', ['De onde vem o oxigênio que os astronautas respiram na Estação Espacial?', 'Where does the oxygen astronauts breathe on the Space Station come from?', '¿De dónde viene el oxígeno que respiran los astronautas en la Estación Espacial?'],
      [['Da água, por eletrólise', 'From water, by electrolysis', 'Del agua, por electrólisis'], ['De plantas no teto', 'From plants on the ceiling', 'De plantas en el techo'], ['Do espaço lá fora', 'From space outside', 'Del espacio exterior'], ['De garrafas trazidas todo dia', 'From bottles brought every day', 'De botellas traídas cada día']], 0,
      ['A eletrólise separa H₂O em hidrogênio e oxigênio. Por isso água é tão preciosa a bordo.', 'Electrolysis splits H₂O into hydrogen and oxygen. That is why water is so precious on board.', 'La electrólisis separa el H₂O en hidrógeno y oxígeno. Por eso el agua es tan valiosa a bordo.']) },
  painel: {
    fact: K('No espaço profundo, as naves são guiadas pela Deep Space Network: antenas de até 70 m na Califórnia, na Espanha e na Austrália, separadas por cerca de 120° para nunca perder o sinal.',
      'In deep space, spacecraft are guided by the Deep Space Network: antennas up to 70 m (230 ft) wide in California, Spain and Australia, about 120° apart so the signal is never lost.',
      'En el espacio profundo, las naves se guían con la Deep Space Network: antenas de hasta 70 m en California, España y Australia, separadas unos 120° para no perder nunca la señal.'),
    quiz: Q('ev:painel', '', ['Por que as antenas da Deep Space Network ficam em três continentes?', 'Why are the Deep Space Network antennas on three continents?', '¿Por qué las antenas de la Deep Space Network están en tres continentes?'],
      [['Para sempre ter uma virada para a nave enquanto a Terra gira', 'So one always faces the ship while Earth rotates', 'Para que siempre una apunte a la nave mientras la Tierra gira'], ['Para dividir o custo', 'To split the cost', 'Para dividir el costo'], ['Por causa do clima', 'Because of the weather', 'Por el clima'], ['É só coincidência', 'It is just a coincidence', 'Es pura coincidencia']], 0,
      ['Separadas por ~120°, uma delas sempre enxerga a nave, de dia ou de noite.', 'About 120° apart, one of them can always see the ship, day or night.', 'Separadas ~120°, una de ellas siempre ve la nave, de día o de noche.']) },
  lixo: {
    fact: K('Na Estação Espacial, o lixo é guardado em naves de carga que, depois de desacopladas, queimam na reentrada na atmosfera. No espaço, nada some sozinho.',
      'On the Space Station, trash is packed into cargo ships that burn up on reentry after undocking. In space, nothing just goes away.',
      'En la Estación Espacial la basura se guarda en naves de carga que, tras desacoplarse, se queman al reentrar en la atmósfera. En el espacio nada desaparece solo.'),
    quiz: Q('ev:lixo', '', ['O que acontece com o lixo da Estação Espacial?', 'What happens to trash on the Space Station?', '¿Qué pasa con la basura de la Estación Espacial?'],
      [['Vai numa nave de carga que queima na reentrada', 'It goes on a cargo ship that burns up on reentry', 'Va en una nave de carga que se quema al reentrar'], ['É jogado pela janela', 'It is thrown out the window', 'Se tira por la ventana'], ['Fica flutuando para sempre', 'It floats around forever', 'Flota para siempre'], ['Vira combustível na hora', 'It instantly becomes fuel', 'Se convierte en combustible al instante']], 0,
      ['Nada pode ser simplesmente "jogado fora" no espaço: tudo precisa de um destino planejado.', 'Nothing can just be "thrown away" in space: everything needs a planned destination.', 'En el espacio nada se puede "tirar" sin más: todo necesita un destino planeado.']) },
  radio: {
    fact: K('Um sinal de rádio leva de 3 a 22 minutos para ir da Terra a Marte. A Voyager 1, a nave mais distante já lançada, está a cerca de um dia-luz da Terra.',
      'A radio signal takes 3 to 22 minutes to travel from Earth to Mars. Voyager 1, the most distant spacecraft ever launched, is about one light-day from Earth.',
      'Una señal de radio tarda de 3 a 22 minutos en ir de la Tierra a Marte. La Voyager 1, la nave más lejana jamás lanzada, está a cerca de un día luz de la Tierra.'),
    quiz: Q('controle:1', '', ['Quanto tempo leva um sinal de rádio de Marte até a Terra (um sentido)?', 'How long does a radio signal take from Mars to Earth (one way)?', '¿Cuánto tarda una señal de radio de Marte a la Tierra (un sentido)?'],
      [['De 3 a 22 minutos', 'From 3 to 22 minutes', 'De 3 a 22 minutos'], ['Menos de 1 segundo', 'Under 1 second', 'Menos de 1 segundo'], ['Cerca de 2 dias', 'About 2 days', 'Cerca de 2 días'], ['Exatamente 1 hora', 'Exactly 1 hour', 'Exactamente 1 hora']], 0,
      ['A distância entre os planetas muda o tempo todo; por isso naves precisam decidir sozinhas.', 'The distance between planets keeps changing; that is why ships must decide on their own.', 'La distancia entre planetas cambia todo el tiempo; por eso las naves deben decidir solas.']) },
  contaminacao: {
    fact: K('O sistema de recuperação de água da Estação Espacial transforma suor, umidade do ar e até urina em água potável, mais limpa que a de muitas torneiras na Terra.',
      'The Space Station\'s water recovery system turns sweat, cabin humidity and even urine into drinking water that is cleaner than many taps on Earth.',
      'El sistema de recuperación de agua de la Estación Espacial convierte el sudor, la humedad del aire e incluso la orina en agua potable, más limpia que la de muchos grifos de la Tierra.'),
    quiz: Q('ev:contaminacao', '', ['Que porcentagem da água a Estação Espacial consegue recuperar desde 2023?', 'What share of its water can the Space Station recover since 2023?', '¿Qué porcentaje del agua recupera la Estación Espacial desde 2023?'],
      [['98%', '98%', '98 %'], ['10%', '10%', '10 %'], ['50%', '50%', '50 %'], ['0%: a água vem toda da Terra', '0%: all water comes from Earth', '0 %: toda el agua viene de la Tierra']], 0,
      ['Reciclar quase tudo é a única forma de viajar longe: cada litro trazido da Terra é caro.', 'Recycling almost everything is the only way to travel far: every liter brought from Earth is costly.', 'Reciclar casi todo es la única forma de viajar lejos: cada litro traído de la Tierra es caro.']) },
  traje: {
    fact: K('As caminhadas espaciais duram em média 6 horas e meia. Em 2013, água vazou para dentro do capacete do astronauta Luca Parmitano e a caminhada foi abortada às pressas.',
      'Spacewalks last about 6.5 hours on average. In 2013, water leaked into astronaut Luca Parmitano\'s helmet and the spacewalk was quickly aborted.',
      'Las caminatas espaciales duran en promedio 6 horas y media. En 2013 entró agua en el casco del astronauta Luca Parmitano y la caminata se abortó de urgencia.'),
    quiz: Q('ev:traje', '', ['Quanto dura, em média, uma caminhada espacial?', 'How long does a spacewalk last on average?', '¿Cuánto dura en promedio una caminata espacial?'],
      [['Cerca de 6 horas e meia', 'About 6.5 hours', 'Unas 6 horas y media'], ['5 minutos', '5 minutes', '5 minutos'], ['3 dias', '3 days', '3 días'], ['1 semana', '1 week', '1 semana']], 0,
      ['O traje é uma nave em miniatura: ar, temperatura e pressão precisam funcionar o tempo todo.', 'The suit is a tiny spacecraft: air, temperature and pressure must work the whole time.', 'El traje es una nave en miniatura: aire, temperatura y presión deben funcionar todo el tiempo.']) },
  doenca: {
    fact: K('Na microgravidade, os fluidos do corpo sobem para a cabeça: o rosto incha, o nariz entope e alguns astronautas têm alterações nos olhos.',
      'In microgravity, body fluids shift toward the head: faces get puffy, noses get stuffy and some astronauts develop eye changes.',
      'En microgravedad, los fluidos del cuerpo suben a la cabeza: la cara se hincha, la nariz se tapa y algunos astronautas sufren cambios en los ojos.'),
    quiz: Q('ev:doenca', '', ['Por que o rosto dos astronautas incha no espaço?', 'Why do astronauts\' faces get puffy in space?', '¿Por qué se hincha la cara de los astronautas en el espacio?'],
      [['Os fluidos do corpo sobem para a cabeça', 'Body fluids shift toward the head', 'Los fluidos del cuerpo suben a la cabeza'], ['Comem sal demais', 'They eat too much salt', 'Comen demasiada sal'], ['Por causa do frio', 'Because of the cold', 'Por el frío'], ['É alergia ao capacete', 'It is a helmet allergy', 'Es alergia al casco']], 0,
      ['Sem gravidade puxando para baixo, sangue e líquidos se espalham de outro jeito pelo corpo.', 'Without gravity pulling down, blood and fluids spread through the body differently.', 'Sin gravedad tirando hacia abajo, la sangre y los líquidos se reparten de otra forma.']) },
  tempestade: {
    fact: K('Fora da proteção magnética da Terra, uma tempestade solar é perigosa. Na cápsula Orion, a tripulação monta um abrigo no centro da nave usando os próprios sacos de carga como blindagem.',
      'Outside Earth\'s magnetic shield, a solar storm is dangerous. In the Orion capsule, the crew builds a shelter in the middle of the ship using their own cargo bags as shielding.',
      'Fuera de la protección magnética de la Tierra, una tormenta solar es peligrosa. En la cápsula Orion, la tripulación arma un refugio en el centro de la nave con sus propias bolsas de carga como blindaje.'),
    quiz: Q('ev:tempestade', '', ['Na cápsula Orion, como a tripulação se protege de uma tempestade solar?', 'In the Orion capsule, how does the crew protect itself from a solar storm?', 'En la cápsula Orion, ¿cómo se protege la tripulación de una tormenta solar?'],
      [['Monta um abrigo com os sacos de carga', 'Builds a shelter out of cargo bags', 'Arma un refugio con las bolsas de carga'], ['Usa óculos escuros', 'Wears sunglasses', 'Usa gafas de sol'], ['Abre as janelas', 'Opens the windows', 'Abre las ventanas'], ['Não faz nada', 'Does nothing', 'No hace nada']], 0,
      ['Massa entre você e a radiação ajuda a bloquear partículas: água, comida e carga viram escudo.', 'Mass between you and the radiation helps block particles: water, food and cargo become a shield.', 'La masa entre usted y la radiación ayuda a bloquear partículas: agua, comida y carga se vuelven escudo.']) },
};
// os temas da gameplay também entram no Quiz do menu
Object.values(EV_LESSONS).forEach(x => { if (!QUIZ_BANK.some(q => q.q.pt === x.quiz.q.pt)) QUIZ_BANK.push(x.quiz); });
const END_LESSONS = [
  () => K(`Já foram confirmados ${EXO_COUNT.toLocaleString('pt-BR')} exoplanetas, e nenhum deles foi confirmado como habitável.`, `${EXO_COUNT.toLocaleString('en-US')} exoplanets have been confirmed, and none of them has been confirmed as habitable.`, `Ya se confirmaron ${EXO_COUNT.toLocaleString('es-ES')} exoplanetas, y ninguno se ha confirmado como habitable.`),
  () => K('O exoplaneta mais próximo, Proxima Centauri b, fica a 4,2 anos-luz. Na velocidade da Voyager 1 (17 km/s), a viagem levaria uns 75 mil anos.', 'The closest exoplanet, Proxima Centauri b, is 4.2 light-years away. At Voyager 1\'s speed (17 km/s), the trip would take about 75,000 years.', 'El exoplaneta más cercano, Proxima Centauri b, está a 4,2 años luz. A la velocidad de la Voyager 1 (17 km/s), el viaje tardaría unos 75 mil años.'),
  () => K('2024 foi o ano mais quente já registrado na Terra. Cuidar do único planeta habitável que conhecemos ainda é a missão mais importante.', '2024 was the warmest year on record on Earth. Taking care of the only habitable planet we know is still the most important mission.', '2024 fue el año más cálido registrado en la Tierra. Cuidar el único planeta habitable que conocemos sigue siendo la misión más importante.'),
];

function lessonOf(rec) { return rec && rec.ev ? EV_LESSONS[rec.ev] : null; }

// depois de cada desafio: escolhe a lição (o tema do desafio; se já viu, uma do Quiz)
{
  const _close = closeEvent;
  closeEvent = function () {
    const ev = S && S.event; const type = ev && ev.type;
    _close();
    if (!type || !S) return;
    S.lessons = S.lessons || [];
    let rec = null;
    if (EV_LESSONS[type] && !S.lessons.some(x => x.ev === type)) rec = { ev: type };
    if (!rec) return;
    rec.at = S.journeyTime || 0; S.lessons.push(rec); S.lessonLast = rec; S.v++;
  };
}
// cartão do computador: só conta a curiosidade (as perguntas ficam no Quiz da tela inicial)
function lessonCard() {
  if (!S || !S.lessonLast || !['ship', 'colony'].includes(S.scene) || (S.event && S.event.phase !== 'result')) return '';
  const rec = S.lessonLast; const ls = lessonOf(rec); if (!ls || !ls.fact) return '';
  if ((S.journeyTime || 0) - rec.at > 40 || U.lessonHide === rec.at) return '';
  if (U.lessonMarked !== rec.at) { U.lessonMarked = rec.at; learnMark(ls.quiz.l); } // vale bônus no Quiz
  return `<div class="lesson-card"><button class="x" data-ui="lessonClose">✕</button><b>💻 ${esc(L('Você sabia?'))}</b><p>${esc(L(ls.fact))}</p><small class="muted">${esc(L('Tema aprendido: vale bônus no Quiz da tela inicial.'))}</small></div>`;
}
UIH.lessonClose = () => { if (S && S.lessonLast) U.lessonHide = S.lessonLast.at; };
// o que já foi aprendido nesta jornada (painel do computador e relatório final)
function lessonList() { return ((S && S.lessons) || []).map(lessonOf).filter(Boolean).map(ls => ls.fact); }
function lessonReport() {
  const list = lessonList().concat(END_LESSONS.map(f => f()));
  return `<div class="lesson-report"><h4>💻 ${esc(L('O que você aprendeu nesta jornada'))}</h4>${list.map(t => `<div class="nf"><p>${esc(L(t))}</p></div>`).join('')}</div>`;
}
