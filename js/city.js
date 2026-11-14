// ============================================================
//  A TERRA EM COLAPSO — cidade explorável (história inicial)
//  8 edifícios com painéis educativos (dados da NASA), 8 NPCs com
//  diálogos e um Diário do Explorador que rende bônus de verba.
// ============================================================
'use strict';

const CITY_BUILDINGS = [
  { id: 'casa', x: 260, w: 84, h: 66, col: '#5a4a3a', roof: '#3a2f26', icon: '🏠', name: K('Seu apartamento', 'Your apartment', 'Tu apartamento'),
    tabs: [
      { t: K('Noticiário', 'News', 'Noticias'), b: K('O telejornal repete: IQA 312, 46 °C, racionamento de água nível 4. Cientistas lembram que satélites da NASA observam a Terra todos os dias — do CO₂ no ar ao gelo nos polos. A atmosfera tem hoje mais de 420 ppm de CO₂, contra ≈ 280 ppm antes da era industrial (NASA/NOAA).', 'The newscast repeats: AQI 312, 46 °C, water rationing level 4. Scientists remind us that NASA satellites watch Earth every day — from CO₂ in the air to ice at the poles. The atmosphere now holds over 420 ppm of CO₂, versus ≈ 280 ppm before the industrial era (NASA/NOAA).', 'El noticiero repite: ICA 312, 46 °C, racionamiento de agua nivel 4. Los científicos recuerdan que los satélites de la NASA observan la Tierra a diario, del CO₂ en el aire al hielo en los polos. La atmósfera tiene hoy más de 420 ppm de CO₂, frente a ≈ 280 ppm antes de la era industrial (NASA/NOAA).') },
      { t: K('Janela', 'Window', 'Ventana'), b: K('Da janela, a névoa cobre os prédios. Desde o fim do século XIX a temperatura média global subiu ≈ 1,2 °C (NASA GISS), e o nível do mar sobe cerca de 3,4 mm por ano em média desde 1993 — hoje mais rápido. O gelo do Ártico no fim do verão diminui ≈ 12% por década.', 'Through the window, haze covers the buildings. Since the late 1800s global average temperature has risen ≈ 1.2 °C (NASA GISS), and sea level has risen about 3.4 mm a year on average since 1993 — faster today. End-of-summer Arctic sea ice shrinks ≈ 12% per decade.', 'Por la ventana la neblina cubre los edificios. Desde fines del siglo XIX la temperatura media global subió ≈ 1,2 °C (NASA GISS) y el nivel del mar sube unos 3,4 mm al año de media desde 1993, hoy más rápido. El hielo ártico de fin de verano disminuye ≈ 12% por década.') },
      { t: K('Mochila', 'Backpack', 'Mochila'), b: K('Você separa o que levar: uma foto, uma semente, o rádio antigo. Colocar 1 kg em órbita custa milhares de dólares — por isso, numa nave, tudo precisa ter função. Quanto mais leve a carga, mais longe a nave chega.', 'You pick what to take: a photo, a seed, the old radio. Putting 1 kg in orbit costs thousands of dollars — so on a ship, everything needs a purpose. The lighter the cargo, the farther the ship goes.', 'Elige qué llevar: una foto, una semilla, la radio vieja. Poner 1 kg en órbita cuesta miles de dólares, por eso en una nave todo debe tener una función. Cuanto más liviana la carga, más lejos llega la nave.') },
    ] },
  { id: 'mercado', x: 640, w: 100, h: 58, col: '#4a5a6a', roof: '#2a3a52', icon: '💧', name: K('Mercado da Água', 'Water Market', 'Mercado del Agua'),
    tabs: [
      { t: K('A fila', 'The queue', 'La cola'), b: K('Racionamento nível 4: 20 litros por pessoa por dia, para beber, cozinhar e se lavar. Na ISS a água também é contada gota a gota — mas lá ela é reciclada: em 2023 o sistema alcançou 98% de recuperação, transformando até suor e urina em água potável (NASA).', 'Rationing level 4: 20 liters per person per day to drink, cook and wash. On the ISS water is counted drop by drop too — but it is recycled: in 2023 the system reached 98% recovery, turning even sweat and urine into drinking water (NASA).', 'Racionamiento nivel 4: 20 litros por persona al día para beber, cocinar y lavarse. En la ISS el agua también se cuenta gota a gota, pero se recicla: en 2023 el sistema alcanzó un 98% de recuperación, convirtiendo hasta el sudor y la orina en agua potable (NASA).') },
      { t: K('Aquíferos', 'Aquifers', 'Acuíferos'), b: K('Os satélites GRACE e GRACE-FO da NASA medem minúsculas variações na gravidade para descobrir quanta água subterrânea e gelo cada região ganha ou perde. A Groenlândia perde cerca de 270 bilhões de toneladas de gelo por ano; a Antártida, cerca de 150 bilhões.', 'NASA\'s GRACE and GRACE-FO satellites measure tiny changes in gravity to find how much groundwater and ice each region gains or loses. Greenland loses about 270 billion tons of ice a year; Antarctica about 150 billion.', 'Los satélites GRACE y GRACE-FO de la NASA miden minúsculas variaciones de la gravedad para saber cuánta agua subterránea y hielo gana o pierde cada región. Groenlandia pierde unos 270.000 millones de toneladas de hielo al año; la Antártida, unos 150.000 millones.') },
      { t: K('Peso da água', 'Weight of water', 'Peso del agua'), b: K('1 litro de água pesa 1 kg. Levar 600 litros numa nave significa 600 kg a mais para lançar e frear. Por isso quem recicla viaja mais longe: no jogo, o reciclador de ciclo fechado vale ouro.', '1 liter of water weighs 1 kg. Carrying 600 liters on a ship means 600 kg more to launch and brake. That is why recyclers travel farther: in the game, the closed-loop recycler is gold.', '1 litro de agua pesa 1 kg. Llevar 600 litros en una nave son 600 kg más para lanzar y frenar. Por eso quien recicla viaja más lejos: en el juego el reciclador de ciclo cerrado vale oro.') },
    ] },
  { id: 'observatorio', x: 1060, w: 96, h: 78, col: '#3a4468', roof: '#24304f', icon: '🔭', name: K('Observatório Pontes', 'Pontes Observatory', 'Observatorio Pontes'),
    tabs: [
      { t: K('Trânsito', 'Transit', 'Tránsito'), b: K('Quando um planeta passa na frente da estrela, o brilho cai um pouquinho. Foi assim que o telescópio Kepler (2009–2018) encontrou mais de 2.600 planetas. O satélite TESS (2018) continua a busca em estrelas próximas.', 'When a planet crosses in front of its star, the brightness dips slightly. That is how the Kepler telescope (2009–2018) found over 2,600 planets. The TESS satellite (2018) continues the search around nearby stars.', 'Cuando un planeta pasa frente a su estrella, el brillo cae un poquito. Así el telescopio Kepler (2009–2018) encontró más de 2.600 planetas. El satélite TESS (2018) continúa la búsqueda en estrellas cercanas.') },
      { t: K('Velocidade radial', 'Radial velocity', 'Velocidad radial'), b: K('A gravidade do planeta faz a estrela “balançar”, e a cor da luz muda de leve (efeito Doppler). Assim foi achado Proxima Centauri b, em 2016, a 4,2 anos-luz. Com a tecnologia atual, uma sonda como a Voyager 1 levaria cerca de 75 mil anos para chegar lá.', 'The planet\'s gravity makes the star “wobble” and the color of its light shifts slightly (Doppler effect). That is how Proxima Centauri b was found in 2016, 4.2 light-years away. With current technology, a probe like Voyager 1 would need about 75,000 years to get there.', 'La gravedad del planeta hace “tambalear” a la estrella y el color de su luz cambia levemente (efecto Doppler). Así se halló Próxima Centauri b en 2016, a 4,2 años luz. Con la tecnología actual, una sonda como la Voyager 1 tardaría unos 75.000 años en llegar.') },
      { t: K('Zona habitável', 'Habitable zone', 'Zona habitable'), b: K('É a faixa em que a água pode ficar líquida na superfície. Mas não basta: contam a atmosfera, o campo magnético e as erupções da estrela. O NASA Exoplanet Archive já lista mais de 6.000 exoplanetas confirmados — poucos parecem habitáveis.', 'It is the band where water can stay liquid on the surface. It is not enough: atmosphere, magnetic field and the star\'s flares matter too. The NASA Exoplanet Archive lists over 6,000 confirmed exoplanets — few look habitable.', 'Es la franja donde el agua puede ser líquida en la superficie. No basta: cuentan la atmósfera, el campo magnético y las erupciones de la estrella. El NASA Exoplanet Archive ya lista más de 6.000 exoplanetas confirmados; pocos parecen habitables.') },
      { t: K('Pontes-01', 'Pontes-01', 'Pontes-01'), b: K('Os observatórios do mundo se uniram e encontraram Pontes-01: raio ≈ 1,04 vezes o da Terra, temperatura de equilíbrio ≈ 268 K e uma estrela calma. O telescópio James Webb estuda a luz que atravessa atmosferas distantes para descobrir seus gases. Pontes-01 é a nossa melhor — e única — esperança.', 'Observatories across the world joined forces and found Pontes-01: radius ≈ 1.04 times Earth\'s, equilibrium temperature ≈ 268 K and a calm star. The James Webb telescope studies light passing through distant atmospheres to find their gases. Pontes-01 is our best — and only — hope.', 'Los observatorios del mundo se unieron y hallaron Pontes-01: radio ≈ 1,04 veces el de la Tierra, temperatura de equilibrio ≈ 268 K y una estrella tranquila. El telescopio James Webb estudia la luz que atraviesa atmósferas lejanas para descubrir sus gases. Pontes-01 es nuestra mejor —y única— esperanza.') },
    ] },
  { id: 'clinica', x: 1480, w: 92, h: 62, col: '#6a5a5a', roof: '#4a3a3a', icon: '✚', name: K('Clínica Respira', 'Breathe Clinic', 'Clínica Respira'),
    tabs: [
      { t: K('O ar da cidade', 'City air', 'El aire de la ciudad'), b: K('Índice de qualidade do ar acima de 300 é “perigoso”. A NASA mede poluentes do espaço — o instrumento TEMPO (lançado em 2023) faz uma medição por hora sobre a América do Norte. Na nave, o ar também é um recurso: a filtragem precisa ser vigiada.', 'An air quality index above 300 is “hazardous”. NASA measures pollutants from space — the TEMPO instrument (launched in 2023) takes one measurement every hour over North America. On a ship, air is a resource too: filtering must be watched.', 'Un índice de calidad del aire superior a 300 es “peligroso”. La NASA mide contaminantes desde el espacio: el instrumento TEMPO (lanzado en 2023) toma una medición por hora sobre Norteamérica. En una nave el aire también es un recurso: hay que vigilar el filtrado.') },
      { t: K('Corpo sem peso', 'Weightless body', 'Cuerpo sin peso'), b: K('Sem gravidade os ossos perdem de 1% a 1,5% de massa por mês e os músculos enfraquecem; os fluidos sobem para a cabeça (rosto inchado, dor de cabeça). Por isso os astronautas treinam cerca de 2 horas por dia. O paramédico da sua nave vai lidar com isso.', 'Without gravity bones lose 1–1.5% of their mass per month and muscles weaken; fluids shift to the head (puffy face, headache). That is why astronauts exercise about 2 hours a day. Your ship\'s paramedic will deal with this.', 'Sin gravedad los huesos pierden de 1% a 1,5% de masa por mes y los músculos se debilitan; los fluidos suben a la cabeza (cara hinchada, dolor de cabeza). Por eso los astronautas entrenan unas 2 horas al día. El paramédico de su nave se ocupará de esto.') },
      { t: K('Radiação', 'Radiation', 'Radiación'), b: K('Na Terra recebemos ≈ 3 mSv por ano. Na ISS, um astronauta recebe cerca de 80 mSv em 6 meses; fora da proteção do campo magnético da Terra é ainda mais. Tempestades solares exigem um abrigo blindado — no jogo, os dormitórios.', 'On Earth we receive ≈ 3 mSv a year. On the ISS an astronaut gets about 80 mSv in 6 months; outside Earth\'s magnetic protection it is even more. Solar storms call for a shielded shelter — in the game, the dormitories.', 'En la Tierra recibimos ≈ 3 mSv al año. En la ISS un astronauta recibe unos 80 mSv en 6 meses; fuera de la protección del campo magnético terrestre es aún más. Las tormentas solares exigen un refugio blindado: en el juego, los dormitorios.') },
    ] },
  { id: 'controle', x: 1900, w: 108, h: 80, col: '#34506a', roof: '#1e3248', icon: '📡', name: K('Centro de Controle da Missão', 'Mission Control Center', 'Centro de Control de la Misión'),
    tabs: [
      { t: K('Rede de Espaço Profundo', 'Deep Space Network', 'Red del Espacio Profundo'), b: K('A DSN da NASA tem três complexos — Goldstone (EUA), Madri (Espanha) e Canberra (Austrália) — separados por ≈ 120° de longitude. Assim, enquanto a Terra gira, sempre há uma antena gigante enxergando a sua nave.', 'NASA\'s DSN has three complexes — Goldstone (USA), Madrid (Spain) and Canberra (Australia) — about 120° apart in longitude. As Earth turns, one giant antenna can always see your ship.', 'La DSN de la NASA tiene tres complejos —Goldstone (EE. UU.), Madrid (España) y Canberra (Australia)— separados ≈ 120° de longitud. Así, mientras la Tierra gira, siempre hay una antena gigante viendo su nave.') },
      { t: K('Atraso do sinal', 'Signal delay', 'Retraso de la señal'), b: K('O rádio viaja à velocidade da luz, mas o espaço é enorme: de Marte o sinal leva de 3 a 22 minutos; da Voyager 1, quase um dia inteiro. Por isso a nave precisa de autonomia: a Terra aconselha, mas o Comandante decide.', 'Radio travels at the speed of light, but space is huge: from Mars the signal takes 3 to 22 minutes; from Voyager 1, almost a whole day. That is why the ship needs autonomy: Earth advises, but the Commander decides.', 'La radio viaja a la velocidad de la luz, pero el espacio es enorme: desde Marte la señal tarda de 3 a 22 minutos; desde la Voyager 1, casi un día entero. Por eso la nave necesita autonomía: la Tierra aconseja, pero el Comandante decide.') },
      { t: K('Sua tripulação', 'Your crew', 'Tu tripulación'), b: K('Seis especialistas vão com você: paramédico, navegador, agricultor/engenheiro genético, dois engenheiros e o pesquisador chefe. Cada um tem gostos, alergias e humor. Cuide de todos: tripulantes felizes trabalham melhor — e nesta missão, mortes derrubam a moral de todo mundo.', 'Six specialists go with you: paramedic, navigator, farmer/genetic engineer, two engineers and the chief researcher. Each has tastes, allergies and moods. Take care of everyone: happy crew work better — and in this mission, deaths pull everyone\'s morale down.', 'Seis especialistas van con usted: paramédico, navegante, agricultor/ingeniero genético, dos ingenieros y el investigador jefe. Cada uno tiene gustos, alergias y ánimo. Cuide de todos: una tripulación feliz trabaja mejor, y en esta misión las muertes hunden la moral de todos.') },
    ] },
  { id: 'recicla', x: 2300, w: 100, h: 56, col: '#3e5a44', roof: '#2a4030', icon: '♻', name: K('Central de Reciclagem', 'Recycling Plant', 'Central de Reciclaje'),
    tabs: [
      { t: K('Ciclo fechado', 'Closed loop', 'Ciclo cerrado'), b: K('No espaço não existe “jogar fora”. O sistema de suporte à vida da ISS (ECLSS) recicla água e gera oxigênio; o que sobra vira insumo. Numa viagem longa, cada átomo precisa dar mais de uma volta.', 'In space there is no “away”. The ISS life-support system (ECLSS) recycles water and makes oxygen; leftovers become inputs. On a long trip, every atom must go around more than once.', 'En el espacio no existe “tirar”. El sistema de soporte vital de la ISS (ECLSS) recicla agua y genera oxígeno; lo que sobra se vuelve insumo. En un viaje largo cada átomo debe dar más de una vuelta.') },
      { t: K('Lixo espacial', 'Space trash', 'Basura espacial'), b: K('O lixo da ISS vai embora em naves de carga, como a Cygnus, que queimam na reentrada. Numa nave de longo alcance isso não é possível: restos de comida viram adubo, plástico vira filamento para impressão 3D, e o resto é compactado — ou ejetado.', 'ISS trash leaves on cargo ships like Cygnus, which burn up on reentry. On a long-range ship that is not possible: food scraps become compost, plastic becomes 3D-printing filament, and the rest is compacted — or ejected.', 'La basura de la ISS se va en naves de carga, como la Cygnus, que se queman al reentrar. En una nave de largo alcance eso no es posible: los restos de comida se vuelven abono, el plástico filamento para impresión 3D y el resto se compacta, o se expulsa.') },
      { t: K('Oxigênio', 'Oxygen', 'Oxígeno'), b: K('Um astronauta respira cerca de 0,84 kg de O₂ por dia. A ISS o produz quebrando a água por eletrólise. Em Marte, o instrumento MOXIE (rover Perseverance) fez O₂ a partir do CO₂ da atmosfera: 122 gramas no total, entre 2021 e 2023.', 'An astronaut breathes about 0.84 kg of O₂ a day. The ISS makes it by splitting water through electrolysis. On Mars, the MOXIE instrument (Perseverance rover) made O₂ from the atmosphere\'s CO₂: 122 grams in total, between 2021 and 2023.', 'Un astronauta respira unos 0,84 kg de O₂ por día. La ISS lo produce separando el agua por electrólisis. En Marte, el instrumento MOXIE (rover Perseverance) hizo O₂ a partir del CO₂ de la atmósfera: 122 gramos en total, entre 2021 y 2023.') },
    ] },
  { id: 'sementes', x: 2690, w: 104, h: 54, col: '#4a6a4a', roof: '#35523a', icon: '🌱', name: K('Banco de Sementes', 'Seed Bank', 'Banco de Semillas'),
    tabs: [
      { t: K('Alface no espaço', 'Lettuce in space', 'Lechuga en el espacio'), b: K('Em 2015, no experimento Veggie, astronautas da ISS comeram alface cultivada em órbita. Plantas dão comida, oxigênio e ainda ajudam o psicológico de quem passa meses longe de casa (NASA).', 'In 2015, in the Veggie experiment, ISS astronauts ate lettuce grown in orbit. Plants give food, oxygen and even help the mental health of people spending months away from home (NASA).', 'En 2015, en el experimento Veggie, los astronautas de la ISS comieron lechuga cultivada en órbita. Las plantas dan comida, oxígeno y hasta ayudan al bienestar de quien pasa meses lejos de casa (NASA).') },
      { t: K('Pimentas', 'Chile peppers', 'Chiles'), b: K('Em 2021 a NASA colheu pimentas Hatch na ISS (Plant Habitat-04). A comida da nave é sem graça; um toque de pimenta melhora o humor — e no jogo, o Navegador adora apimentado!', 'In 2021 NASA harvested Hatch chile peppers on the ISS (Plant Habitat-04). Ship food is bland; a bit of chile lifts the mood — and in the game, the Navigator loves spicy!', 'En 2021 la NASA cosechó chiles Hatch en la ISS (Plant Habitat-04). La comida de la nave es insípida; un toque de chile levanta el ánimo, ¡y en el juego el Navegante adora lo picante!') },
      { t: K('Sem gravidade, sem solo', 'No gravity, no soil', 'Sin gravedad, sin suelo'), b: K('Sem gravidade a água não escorre: as raízes precisam de luz LED, nutrientes e ventilação controlados. E em outro mundo o solo pode ser tóxico — o solo de Marte tem percloratos, detectados pela sonda Phoenix em 2008. Por isso levamos um banco de sementes.', 'Without gravity water does not drain: roots need controlled LED light, nutrients and airflow. And on another world the soil can be toxic — Martian soil has perchlorates, detected by the Phoenix lander in 2008. That is why we carry a seed bank.', 'Sin gravedad el agua no escurre: las raíces necesitan luz LED, nutrientes y ventilación controlados. Y en otro mundo el suelo puede ser tóxico: el suelo de Marte tiene percloratos, detectados por la sonda Phoenix en 2008. Por eso llevamos un banco de semillas.') },
    ] },
  { id: 'alistamento', x: 3100, w: 110, h: 84, col: '#3a4f7a', roof: '#22345a', icon: '🚀', name: K('Centro de Alistamento Pontes-01', 'Pontes-01 Enlistment Center', 'Centro de Alistamiento Pontes-01'),
    tabs: [
      { t: K('A missão', 'The mission', 'La misión'), b: K('Centenas de naves partem ao mesmo tempo. A sua tem destino Pontes-01. Você vai gerenciar recursos, tripulação e rota, enfrentar asteroides, radiação, falhas e o estresse de todos a bordo. O jogo tem apenas um final: se ele não for alcançado, a missão falha.', 'Hundreds of ships leave at the same time. Yours is bound for Pontes-01. You will manage resources, crew and route, facing asteroids, radiation, failures and everyone\'s stress on board. The game has only one ending: if it is not reached, the mission fails.', 'Cientos de naves parten al mismo tiempo. La suya tiene destino Pontes-01. Gestionará recursos, tripulación y ruta, y enfrentará asteroides, radiación, fallas y el estrés de todos a bordo. El juego tiene un solo final: si no se alcanza, la misión fracasa.') },
      { t: K('Verba e bônus', 'Budget & bonus', 'Presupuesto y bono'), b: K('Você terá 45 pontos de verba e 5 espaços de módulo: não dá para ter tudo. Quem explora a cidade, lê os painéis e conversa com as pessoas chega mais preparado: cada 10 descobertas no Diário do Explorador rendem +1 ponto de verba (máx. +3).', 'You will have 45 budget points and 5 module slots: you cannot have everything. Those who explore the city, read the panels and talk to people arrive better prepared: every 10 discoveries in the Explorer\'s Diary earn +1 budget point (max +3).', 'Tendrá 45 puntos de presupuesto y 5 espacios de módulo: no se puede tener todo. Quien explora la ciudad, lee los paneles y conversa con la gente llega mejor preparado: cada 10 descubrimientos en el Diario del Explorador dan +1 punto de presupuesto (máx. +3).') },
    ] },
];

const CITY_NPCS = [
  { id: 'lia', x: 520, seed: 11, name: 'Dona Lia', role: K('Vendedora de água', 'Water seller', 'Vendedora de agua'),
    say: [K('Racionamento nível 4… Cada gota conta. Você viu como os astronautas reciclam até o suor?', 'Rationing level 4… every drop counts. Did you see how astronauts recycle even their sweat?', 'Racionamiento nivel 4… cada gota cuenta. ¿Vio cómo los astronautas reciclan hasta el sudor?'), K('A NASA diz: “o café de ontem é o café de amanhã”. Brincadeira de quem recicla a água da ISS!', 'NASA jokes: “yesterday\'s coffee is tomorrow\'s coffee”. A joke from people who recycle ISS water!', 'La NASA bromea: “el café de ayer es el café de mañana”. ¡Broma de quienes reciclan el agua de la ISS!'), K('Leve água no coração, Comandante.', 'Carry water in your heart, Commander.', 'Lleve agua en el corazón, Comandante.')] },
  { id: 'teo', x: 940, seed: 23, name: 'Dr. Teo', role: K('Astrofísico', 'Astrophysicist', 'Astrofísico'),
    say: [K('Quando eu era criança contava estrelas. Hoje contamos planetas: já passam de 6.000 os exoplanetas confirmados!', 'As a kid I counted stars. Today we count planets: over 6,000 exoplanets are confirmed!', 'De niño contaba estrellas. Hoy contamos planetas: ¡ya pasan de 6.000 los exoplanetas confirmados!'), K('Nem todo planeta “parecido com a Terra” é bom. Perto de anãs vermelhas, as erupções da estrela podem arrancar a atmosfera.', 'Not every “Earth-like” planet is good. Near red dwarfs, the star\'s flares can strip the atmosphere.', 'No todo planeta “parecido a la Tierra” es bueno. Cerca de enanas rojas las erupciones pueden arrancar la atmósfera.'), K('Se um dia na estação alguém lhe oferecer um planeta “perfeito”… confira os dados antes de acelerar!', 'If one day at the station someone offers you a “perfect” planet… check the data before you accelerate!', 'Si un día en la estación le ofrecen un planeta “perfecto”… ¡revise los datos antes de acelerar!')] },
  { id: 'mari', x: 780, seed: 37, name: 'Mari', role: K('Estudante, 9 anos', 'Student, age 9', 'Estudiante, 9 años'),
    say: [K('Meu professor disse que o astronauta Scott Kelly passou 340 dias na ISS e voltou ~5 cm mais alto!', 'My teacher said astronaut Scott Kelly spent 340 days on the ISS and came back ~5 cm taller!', '¡Mi profesor dijo que el astronauta Scott Kelly pasó 340 días en la ISS y volvió ~5 cm más alto!'), K('Sem gravidade a coluna se estica. Mas depois volta ao normal. Eu queria ver estrelas sem poluição…', 'Without gravity the spine stretches. But it goes back to normal. I wish I could see stars without pollution…', 'Sin gravedad la columna se estira. Pero luego vuelve a la normalidad. Quisiera ver estrellas sin contaminación…'), K('Promete que vai mandar uma foto de Pontes-01?', 'Promise you\'ll send a photo of Pontes-01?', '¿Promete que enviará una foto de Pontes-01?')] },
  { id: 'ramos', x: 1250, seed: 41, name: 'Sr. Ramos', role: K('Engenheiro aposentado', 'Retired engineer', 'Ingeniero jubilado'),
    say: [K('Vi o pouso do Perseverance em Marte, em 2021, pela TV: os “7 minutos de terror” da descida, tudo sozinho, sem ninguém na Terra poder ajudar.', 'I watched the Perseverance Mars landing in 2021 on TV: the “7 minutes of terror” of the descent, all alone, with nobody on Earth able to help.', 'Vi el aterrizaje de Perseverance en Marte en 2021 por la tele: los “7 minutos de terror” del descenso, todo solo, sin nadie en la Tierra que pudiera ayudar.'), K('Depois disso o helicóptero Ingenuity voou 72 vezes em Marte, bem mais que as 5 previstas. Quem projeta bem, sobra margem.', 'After that the Ingenuity helicopter flew 72 times on Mars, far more than the 5 planned. Good design leaves margin.', 'Después el helicóptero Ingenuity voló 72 veces en Marte, bastante más que las 5 previstas. Quien diseña bien deja margen.'), K('Conselho de velho: leve peças sobressalentes!', 'An old-timer\'s advice: bring spare parts!', 'Consejo de viejo: ¡lleve piezas de repuesto!')] },
  { id: 'bia', x: 1620, seed: 53, name: 'Bia', role: K('Enfermeira', 'Nurse', 'Enfermera'),
    say: [K('No espaço os remédios também envelhecem mais rápido, por causa da radiação. A nave precisa renovar o estoque.', 'In space medicines also age faster because of radiation. The ship must renew its stock.', 'En el espacio los medicamentos también envejecen más rápido por la radiación. La nave debe renovar el stock.'), K('Se alguém ficar com enjoo, dor de cabeça ou febre: meça, compare os sintomas e só então escolha o remédio.', 'If someone gets nausea, headache or fever: measure, compare symptoms and only then pick the medicine.', 'Si alguien tiene náuseas, dolor de cabeza o fiebre: mida, compare los síntomas y solo entonces elija el medicamento.')] },
  { id: 'gui', x: 2100, seed: 61, name: 'Gui', role: K('Programador', 'Programmer', 'Programador'),
    say: [K('Eu escrevo software de navegação. Um grau de erro na partida vira milhões de km de erro na chegada.', 'I write navigation software. One degree of error at departure becomes millions of km at arrival.', 'Escribo software de navegación. Un grado de error en la partida son millones de km de error en la llegada.'), K('A sonda DSOC da NASA já mandou vídeo por laser de 31 milhões de km, a 267 Mbps. Rádio é o passado!', 'NASA\'s DSOC test sent laser video from 31 million km at 267 Mbps. Radio is the past!', '¡La prueba DSOC de la NASA mandó video por láser desde 31 millones de km a 267 Mbps. La radio es el pasado!')] },
  { id: 'nina', x: 2480, seed: 71, name: 'Profa. Nina', role: K('Professora de ciências', 'Science teacher', 'Profesora de ciencias'),
    say: [K('Na Terra, a atmosfera regula a temperatura de graça. Numa nave tudo tem custo: calor só sai por radiação.', 'On Earth the atmosphere regulates temperature for free. On a ship everything has a cost: heat only leaves by radiation.', 'En la Tierra la atmósfera regula la temperatura gratis. En una nave todo tiene un costo: el calor solo sale por radiación.'), K('Por isso é mais fácil manter a Terra habitável do que habitar outro planeta. Lembre disso lá longe.', 'That is why it is easier to keep Earth habitable than to inhabit another planet. Remember that out there.', 'Por eso es más fácil mantener habitable la Tierra que habitar otro planeta. Recuerde eso allá lejos.')] },
  { id: 'beto', x: 2880, seed: 83, name: 'Tio Beto', role: K('Feirante de sementes', 'Seed vendor', 'Vendedor de semillas'),
    say: [K('Batata, soja, alface, pimenta… Alface cresce em 4 dias, batata demora mais, mas rende mais. Planejar a horta é planejar a viagem.', 'Potato, soy, lettuce, chile… Lettuce grows in 4 days, potato takes longer but yields more. Planning the garden is planning the trip.', 'Papa, soja, lechuga, chile… La lechuga crece en 4 días, la papa tarda más pero rinde más. Planificar la huerta es planificar el viaje.'), K('Ah! E não esqueça das alergias da tripulação. Soja para quem é alérgico? Nem pensar.', 'Oh! And don\'t forget the crew\'s allergies. Soy for someone allergic? No way.', '¡Ah! Y no olvide las alergias de la tripulación. ¿Soja para un alérgico? Ni pensar.')] },
];

const CITY_TOTAL = CITY_BUILDINGS.reduce((s, b) => s + b.tabs.length, 0) + CITY_NPCS.length;
const cityCount = () => (U.earth ? Object.keys(U.earth.read).length : 0);
const cityBonus = () => Math.min(3, Math.floor(cityCount() / 10));

function cityInit() {
  U.earth = { t: 0, limit: Save.data.settings.fastEarth ? 45 : 240, p: { x: 80, face: 1, moving: false, walkT: 0 }, read: {}, panel: null, tab: 0, dialog: null, diary: false };
  U.comms = 0;
}
function cityNear() {
  const E = U.earth, px = E.p.x;
  let best = null, bd = 44;
  for (const b of CITY_BUILDINGS) { const d = Math.abs(b.x - px); if (d < bd) { bd = d; best = { type: 'b', o: b }; } }
  for (const n of CITY_NPCS) { const d = Math.abs(n.x - px); if (d < Math.min(bd, 34)) { bd = d; best = { type: 'n', o: n }; } }
  return best;
}
function cityBusy() { const E = U.earth; return !!(E && (E.panel || E.dialog || E.diary)); }
function tickCity(dt) {
  const E = U.earth; if (!E || U.comms) return;
  if (!cityBusy()) {
    E.t += dt;
    const p = E.p; const dx = ((keys.ArrowRight || keys.KeyD) ? 1 : 0) - ((keys.ArrowLeft || keys.KeyA) ? 1 : 0);
    if (dx) { p.x = clamp(p.x + dx * 62 * dt, 20, EARTH_W - 20); p.face = dx; p.moving = true; p.walkT += dt; } else p.moving = false;
    if (E.t >= E.limit) cityComms();
  } else E.p.moving = false;
}
function cityComms() {
  U.comms = 1; U.earth.panel = null; U.earth.dialog = null; U.earth.diary = false; Sfx.alarm();
  Narrator.say('Você foi selecionado para uma missão espacial para salvar o futuro da humanidade.');
}
function cityInteract() {
  const E = U.earth; if (!E || U.comms) return;
  if (E.dialog) return UIH.cityNext();
  if (E.panel || E.diary) return;
  const n = cityNear(); if (!n) return;
  Sfx.click();
  if (n.type === 'b') { E.panel = n.o.id; E.tab = 0; E.read[n.o.id + ':0'] = 1; }
  else { E.dialog = { id: n.o.id, i: 0 }; E.read['npc:' + n.o.id] = 1; }
}
function cityEsc() { const E = U.earth; if (!E) return; if (E.dialog) E.dialog = null; else if (E.panel) E.panel = null; else if (E.diary) E.diary = false; }

// ---------- desenho ----------
function drawCity(dt, cam) {
  const E = U.earth; const near = cityNear();
  for (const b of CITY_BUILDINGS) {
    const x = Math.round(b.x - cam); if (x < -90 || x > VW + 90) continue;
    const G = GROUND; const r = (a, y, w, h, c) => { cx.fillStyle = c; cx.fillRect(Math.round(x + a), Math.round(y), w, h); };
    const hw = Math.round(b.w / 2);
    r(-hw, G - b.h, b.w, b.h, b.col); r(-hw - 3, G - b.h - 5, b.w + 6, 6, b.roof); r(-hw, G - b.h, b.w, 2, 'rgba(255,255,255,0.12)');
    // janelas
    for (let wy = G - b.h + 10; wy < G - 24; wy += 12) for (let wx = -hw + 8; wx < hw - 8; wx += 14) { if (Math.abs(wx) < 10 && wy > G - 40) continue; r(wx, wy, 7, 6, hash(wx + b.x, wy, 3) > 0.5 ? '#e8c660' : '#1e1a16'); }
    // porta iluminada
    r(-8, G - 24, 16, 24, '#171310'); r(-6, G - 22, 12, 22, '#ffd98a'); r(-1, G - 22, 2, 22, '#9a7a40');
    const hot = near && near.type === 'b' && near.o === b;
    if (hot) { cx.strokeStyle = '#ffd34c'; cx.lineWidth = 1; cx.strokeRect(x - hw - 2.5, G - b.h - 7.5, b.w + 5, b.h + 8); }
    // adornos
    if (b.id === 'observatorio') { cx.fillStyle = '#5a6a98'; cx.beginPath(); cx.arc(x, G - b.h - 5, 26, Math.PI, 0); cx.fill(); cx.fillStyle = '#0c1020'; cx.fillRect(x - 3, G - b.h - 31, 6, 26); cx.fillStyle = '#cfd6e6'; cx.fillRect(x + 8, G - b.h - 40 + Math.sin(R.t) * 2, 3, 22); }
    if (b.id === 'clinica') { r(-hw + 8, G - b.h + 6, 18, 18, '#fff'); r(-hw + 15, G - b.h + 8, 4, 14, '#e03030'); r(-hw + 10, G - b.h + 13, 14, 4, '#e03030'); }
    if (b.id === 'controle') { r(hw - 18, G - b.h - 26, 2, 22, '#aaa'); cx.fillStyle = '#e8ecf6'; cx.beginPath(); cx.ellipse(x + hw - 17, G - b.h - 28, 14, 6, -0.4, 0, 7); cx.fill(); r(-hw + 6, G - b.h + 6, 30, 16, '#0a1a2e'); r(-hw + 8, G - b.h + 8, 26, 12, (Math.floor(R.t * 2) % 2) ? '#2fd7ff' : '#1a8ab0'); }
    if (b.id === 'mercado') { for (let i = 0; i < 8; i++) r(-hw + i * 13, G - 36, 13, 10, i % 2 ? '#2f78c8' : '#e8e8f0'); r(-hw + 6, G - 14, 12, 14, '#3a5a8a'); r(-hw + 8, G - 12, 8, 3, '#6fb4ff'); }
    if (b.id === 'recicla') { for (let i = 0; i < 3; i++) { r(-hw + 6 + i * 16, G - 16, 12, 16, ['#2f8a4a', '#2f78c8', '#d8b030'][i]); } r(hw - 26, G - b.h - 18, 6, 18, '#2a3a2a'); r(hw - 30, G - b.h - 22, 14, 6, '#5fd35f'); }
    if (b.id === 'sementes') { r(-hw + 4, G - b.h + 8, b.w - 8, b.h - 12, 'rgba(160,230,255,0.18)'); for (let i = 0; i < 6; i++) { r(-hw + 10 + i * 15, G - 14 - (i * 5 % 8), 2, 10 + (i * 5 % 8), '#3fa84a'); r(-hw + 7 + i * 15, G - 16 - (i * 5 % 8), 8, 3, '#5fd35f'); } }
    if (b.id === 'alistamento') { r(hw - 12, G - b.h - 30, 2, 30, '#aaa'); r(hw - 10, G - b.h - 30, 14, 9, '#ff4a5a'); r(-hw + 8, G - b.h + 6, 12, 28, '#e8e8f0'); r(-hw + 11, G - b.h + 2, 6, 6, '#e03030'); r(-hw + 8, G - b.h + 30, 5, 8, '#ff9411'); }
    if (b.id === 'casa') { r(hw - 16, G - b.h - 14, 8, 14, '#2a2420'); r(-hw + 4, G - 30, 20, 3, '#555'); }
    // placa
    const nm = T(L(b.name)); cx.font = '8px "Silkscreen", monospace'; const w = Math.min(130, Math.ceil(cx.measureText(nm).width) + 10);
    r(-w / 2, G - b.h - 20 - (b.id === 'observatorio' || b.id === 'controle' || b.id === 'alistamento' ? 28 : 0), w, 12, '#101014');
    text(nm, x, G - b.h - 18 - (b.id === 'observatorio' || b.id === 'controle' || b.id === 'alistamento' ? 28 : 0), '#ffcf6a', 8, 'center');
    const done = b.tabs.every((_, i) => E.read[b.id + ':' + i]);
    if (done) text('✔', x + hw - 6, G - b.h + 2, '#46e08a', 10, 'center');
    if (hot) text('[E]', x, G - 30, '#ffd34c', 8, 'center');
  }
  // NPCs com nome
  for (const n of CITY_NPCS) {
    if (!n.av) n.av = randomAvatar(() => { n.s = ((n.s || n.seed) * 16807) % 2147483647; return n.s / 2147483647; });
    n.ph = (n.ph || n.seed) + dt; const talk = E.dialog && E.dialog.id === n.id;
    const x = Math.round(n.x - cam); if (x < -30 || x > VW + 30) continue;
    const face = E.p.x < n.x ? -1 : 1;
    drawChar(n.av, 'civil', x, GROUND, talk || Math.abs(E.p.x - n.x) < 60 ? face : (Math.sin(n.ph * 0.3) > 0 ? 1 : -1), 0, 'happy', true);
    const seen = E.read['npc:' + n.id];
    if (!seen) text('!', x, GROUND - SPR_H - 12 + Math.sin(R.t * 4) * 2, '#ffd34c', 10, 'center');
    const hot = near && near.type === 'n' && near.o === n;
    if (hot) text('[E] ' + n.name, x, GROUND - SPR_H - 12, '#fff', 8, 'center');
  }
}

// ---------- interface ----------
function cityScreen() {
  const E = U.earth; const left = Math.max(0, Math.ceil(E.limit - E.t));
  if (U.comms) return commsScreen();
  const n = cityCount();
  let ov = '';
  if (E.dialog) ov = cityDialog();
  else if (E.panel) ov = cityPanel();
  else if (E.diary) ov = cityDiary();
  const near = !cityBusy() ? cityNear() : null;
  const prompt = near ? `<b>E</b> — ${near.type === 'b' ? esc(L(K('Entrar: ', 'Enter: ', 'Entrar: '))) + esc(L(near.o.name)) : esc(L(K('Conversar com ', 'Talk to ', 'Hablar con '))) + esc(near.o.name)}` : esc(L(K('← → / A D para andar · explore os prédios e converse com as pessoas', '← → / A D to walk · explore the buildings and talk to people', '← → / A D para caminar · explore los edificios y hable con la gente')));
  return `<div class="earth-hud">
    <div class="tbox tl small"><b>TERRA · 2091</b><br>Qualidade do ar: <span class="red">péssima (IQA 312)</span><br>Temperatura: <span class="orange">46 °C</span><br>Água: racionamento nível 4</div>
    <div class="tbox tr small">${esc(L(K('Explore a cidade.', 'Explore the city.', 'Explore la ciudad.')))}<br>${esc(L(K('Comunicado em', 'Announcement in', 'Comunicado en')))} <b>${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</b><br>🔍 ${esc(L(K('Descobertas', 'Discoveries', 'Descubrimientos')))}: <b>${n}/${CITY_TOTAL}</b> · ${esc(L(K('verba extra', 'extra budget', 'presupuesto extra')))}: <b>+${cityBonus()}</b><br><button class="btn tiny" data-ui="cityDiary">📓 ${esc(L(K('Diário', 'Diary', 'Diario')))} [J]</button> <button class="btn tiny" data-ui="earthSkip">⏭ ${esc(L(K('Ir ao comunicado', 'Skip to announcement', 'Ir al comunicado')))}</button></div>
    <div class="hint">${prompt}</div></div>${ov}`;
}
function cityPanel() {
  const E = U.earth; const b = CITY_BUILDINGS.find(x => x.id === E.panel); if (!b) return '';
  const tabs = b.tabs.map((t, i) => `<button class="chip ${E.tab === i ? 'on' : ''}" data-ui="cityTab" data-arg="${i}">${E.read[b.id + ':' + i] ? '✔ ' : ''}${esc(L(t.t))}</button>`).join('');
  const t = b.tabs[E.tab];
  const last = b.id === 'alistamento';
  return `<div class="modal-bg" data-ui="cityClose"><div class="panel station wide" data-stop="1"><button class="x" data-ui="cityClose">✕</button><h2>${b.icon} ${esc(L(b.name))}</h2>
    <div class="tabs">${tabs}</div><p class="citytxt">${esc(L(t.b))}</p>
    <p class="small muted">${esc(L(K('Descobertas lidas: ', 'Discoveries read: ', 'Descubrimientos leídos: ')))}${cityCount()}/${CITY_TOTAL}</p>
    <div class="row">${last ? `<button class="btn primary" data-ui="cityAccept">🚀 ${esc(L(K('Estou pronto: aceitar a missão', 'I\'m ready: accept the mission', 'Estoy listo: aceptar la misión')))}</button>` : ''}<button class="btn" data-ui="cityClose">${esc(L(K('Sair', 'Leave', 'Salir')))}</button></div></div></div>`;
}
function cityDialog() {
  const E = U.earth; const n = CITY_NPCS.find(x => x.id === E.dialog.id); if (!n) return '';
  const line = n.say[E.dialog.i];
  return `<div class="dialog"><img src="${spriteURL(n.av, 'civil', 'happy', 3)}" alt=""><div><b>${esc(n.name)}</b> <small>${esc(L(n.role))}</small><p>${esc(L(line))}</p>
    <div class="row"><button class="btn primary" data-ui="cityNext">${E.dialog.i < n.say.length - 1 ? esc(L(K('Próximo ▶', 'Next ▶', 'Siguiente ▶'))) : esc(L(K('Tchau ✔', 'Bye ✔', 'Chao ✔')))}</button></div></div></div>`;
}
function cityDiary() {
  const E = U.earth;
  return `<div class="modal-bg" data-ui="cityClose"><div class="panel station wide" data-stop="1"><button class="x" data-ui="cityClose">✕</button><h2>📓 ${esc(L(K('Diário do Explorador', 'Explorer\'s Diary', 'Diario del Explorador')))}</h2>
    <p>${esc(L(K('Cada painel lido e cada conversa é uma descoberta. A cada 10 descobertas, +1 ponto de verba para montar a nave (máx. +3).', 'Every panel read and every chat is a discovery. Every 10 discoveries give +1 budget point to build the ship (max +3).', 'Cada panel leído y cada conversación es un descubrimiento. Cada 10 descubrimientos dan +1 punto de presupuesto para armar la nave (máx. +3).')))}</p>
    <div class="kv"><span>${esc(L(K('Descobertas', 'Discoveries', 'Descubrimientos')))}</span><b>${cityCount()}/${CITY_TOTAL}</b><span>${esc(L(K('Bônus de verba', 'Budget bonus', 'Bono de presupuesto')))}</span><b>+${cityBonus()}</b></div>
    <h4>${esc(L(K('Lugares', 'Places', 'Lugares')))}</h4>${CITY_BUILDINGS.map(b => `<div class="alert ${b.tabs.every((_, i) => E.read[b.id + ':' + i]) ? 'good' : 'info'}">${b.icon} ${esc(L(b.name))} — ${b.tabs.filter((_, i) => E.read[b.id + ':' + i]).length}/${b.tabs.length}</div>`).join('')}
    <h4>${esc(L(K('Pessoas', 'People', 'Personas')))}</h4>${CITY_NPCS.map(n => `<div class="alert ${E.read['npc:' + n.id] ? 'good' : 'info'}">${E.read['npc:' + n.id] ? '✔' : '▫'} ${esc(n.name)} — ${esc(L(n.role))}</div>`).join('')}</div></div>`;
}
UIH.cityTab = i => { const E = U.earth; E.tab = +i; E.read[E.panel + ':' + i] = 1; };
UIH.cityClose = () => { const E = U.earth; E.panel = null; E.dialog = null; E.diary = false; };
UIH.cityDiary = () => { const E = U.earth; E.diary = !E.diary; E.panel = null; E.dialog = null; };
UIH.cityNext = () => { const E = U.earth; if (!E.dialog) return; const n = CITY_NPCS.find(x => x.id === E.dialog.id); if (E.dialog.i < n.say.length - 1) E.dialog.i++; else E.dialog = null; };
UIH.cityAccept = () => { cityComms(); };
