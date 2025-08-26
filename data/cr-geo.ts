// data/cr-geo.ts
// Costa Rica geo data (starter set). Extend freely.
// Structure: Province -> Canton -> District[]

export type CRGeo = Record<string, Record<string, string[]>>

export const CR_GEO: CRGeo = {
  // ────────────────────────── San José ──────────────────────────
  'San José': {
    'San José': [
      'Carmen','Merced','Hospital','Catedral','Zapote',
      'San Francisco de Dos Ríos','Uruca','Mata Redonda',
      'Pavas','Hatillo','San Sebastián'
    ],
    'Escazú': ['Escazú Centro','San Rafael','San Antonio'],
    'Desamparados': [
      'Desamparados Centro','San Miguel','San Juan de Dios','San Rafael Arriba',
      'San Antonio','Frailes','Patarrá','San Cristóbal','Rosario','Damas',
      'San Rafael Abajo','Gravilias','Los Guido'
    ],
    'Puriscal': ['Santiago','Mercedes Sur','Barbacoas','Grifo Alto'],
    'Tarrazú': ['San Marcos','San Lorenzo','San Carlos'],
    'Aserrí': ['Aserrí Centro','Tarbaca','Vuelta de Jorco','San Gabriel'],
    'Mora': ['Colón','Guayabo','Tabarcia','Piedras Negras'],
    'Goicoechea': ['Guadalupe','San Francisco','Calle Blancos','Mata de Plátano'],
    'Santa Ana': ['Santa Ana Centro','Salitral','Pozos','Uruca','Piedades','Brasil'],
    'Alajuelita': ['Alajuelita Centro','San Josecito','San Antonio','Concepción','San Felipe'],
    'Vázquez de Coronado': ['San Isidro','San Rafael','Dulce Nombre de Jesús','Patalillo','Cascajal'],
    'Acosta': ['San Ignacio','Guaitil','Palmichal','Cangrejal','Sabanillas'],
    'Tibás': ['San Juan','Cinco Esquinas','Anselmo Llorente','León XIII','Colima'],
    'Moravia': ['San Vicente','San Jerónimo','La Trinidad'],
    'Montes de Oca': ['San Pedro','Sabanilla','Mercedes','San Rafael'],
    'Turrubares': ['San Pablo','San Pedro','San Juan de Mata','San Luis','Cárara'],
    'Dota': ['Santa María','Jardín','Copey'],
    'Curridabat': ['Curridabat','Granadilla','Sánchez','Tirrases'],
    'Pérez Zeledón': ['San Isidro de El General','Daniel Flores','Rivas','San Pedro','Platanares','Pejibaye'],
    'León Cortés': ['San Pablo','San Andrés','Llano Bonito','San Isidro','Santa Cruz','San Antonio'],
  },

  // ────────────────────────── Alajuela ──────────────────────────
  'Alajuela': {
    'Alajuela': ['Alajuela Centro','San José','Carrizal','San Antonio','Guácima','San Isidro','Sabanilla'],
    'San Ramón': ['San Ramón Centro','Santiago','San Juan','Piedades Norte','Alfaro','Volio'],
    'Grecia': ['Grecia Centro','San Isidro','San José','San Roque','Tacares','Puente de Piedra'],
    'Atenas': ['Atenas Centro','Jesús','Mercedes','San Isidro','Concepción','San José'],
    'Naranjo': ['Naranjo Centro','San Miguel','San José','Cirrí Sur','San Jerónimo'],
    'Palmares': ['Palmares Centro','Zaragoza','Buenos Aires','Santiago','Candelaria','Esquipulas'],
    'Poás': ['San Pedro','San Juan','San Rafael','Carrillos','Sabana Redonda'],
    'Orotina': ['Orotina Centro','El Mastate','Hacienda Vieja','Coyolar','La Ceiba'],
    'San Carlos': ['Quesada','Florencia','Buenavista','Aguas Zarcas','Pital','La Fortuna','Venecia'],
    'Zarcero': ['Zarcero Centro','Laguna','Tapezco','Guadalupe','Palmira','Zapote','Brisas'],
    'Sarchí': ['Sarchí Norte','Sarchí Sur','Toro Amarillo','San Pedro','Rodríguez'],
    'Upala': ['Upala','Aguas Claras','San José (Pizote)','Delicias','Yolillal','Canalete'],
    'Los Chiles': ['Los Chiles','Caño Negro','El Amparo','San Jorge'],
    'Guatuso': ['San Rafael','Buenavista','Cote','Katira'],
  },

  // ────────────────────────── Cartago ──────────────────────────
  'Cartago': {
    'Cartago': ['Oriental','Occidental','Carmen','San Nicolás','Aguacaliente','Guadalupe','Corralillo','Tierra Blanca','Dulce Nombre','Llano Grande','Quebradilla'],
    'Paraíso': ['Paraíso Centro','Santiago','Orosi','Cachí','Llanos de Santa Lucía'],
    'La Unión': ['Tres Ríos','San Diego','San Juan','San Rafael','Concepción','Dulce Nombre','San Ramón','Río Azul'],
    'Jiménez': ['Juan Viñas','Tucurrique','Pejibaye'],
    'Turrialba': ['Turrialba Centro','La Suiza','Peralta','Santa Cruz','Santa Teresita','Pavones','Tuis'],
    'Alvarado': ['Pacayas','Cervantes','Capellades'],
    'Oreamuno': ['San Rafael (Oreamuno)','Cot','Potrero Cerrado','Cipreses','Santa Rosa'],
    'El Guarco': ['El Tejar','San Isidro','Tobosi','Patio de Agua'],
  },

  // ────────────────────────── Heredia ──────────────────────────
  'Heredia': {
    'Heredia': ['Heredia Centro','Mercedes','San Francisco','Ulloa','Vara Blanca'],
    'Barva': ['Barva Centro','San Pedro','San Pablo','San Roque','Santa Lucía','San José de la Montaña'],
    'Santo Domingo': ['Santo Domingo Centro','San Vicente','San Miguel','Paracito','Santo Tomás','Santa Rosa','Tures','Pará'],
    'Santa Bárbara': ['Santa Bárbara Centro','San Pedro','San Juan','Jesús','Santo Domingo','Purabá'],
    'San Rafael': ['San Rafael Centro','San Josecito','Santiago','Ángeles','Concepción'],
    'San Isidro': ['San Isidro Centro','San José','Concepción','San Francisco'],
    'Belén': ['San Antonio','La Ribera','La Asunción'],
    'Flores': ['San Joaquín','Barrantes','Llorente'],
    'San Pablo': ['San Pablo Centro','Rincón de Sabanilla'],
  },

  // ────────────────────────── Guanacaste ───────────────────────
  'Guanacaste': {
    'Liberia': ['Liberia Centro','Cañas Dulces','Mayorga','Nacascolo','Curubandé'],
    'Nicoya': ['Nicoya Centro','Mansión','San Antonio','Quebrada Honda','Sámara','Nosara','Belén de Nosarita'],
    'Santa Cruz': ['Santa Cruz Centro','Bolsón','Veintisiete de Abril','Tamarindo','Santa Bárbara'],
    'Bagaces': ['Bagaces Centro','Fortuna','Mogote','Río Naranjo'],
    'Carrillo': ['Filadelfia','Palmira','Sardinal','Belén'],
    'Cañas': ['Cañas Centro','Palmira','San Miguel','Bebedero','Porozal'],
    'Abangares': ['Las Juntas','Sierra','San Juan','Colorado'],
    'Tilarán': ['Tilarán Centro','Quebrada Grande','Tronadora','Arenal','Tierras Morenas','Líbano'],
    'Nandayure': ['Carmona','Santa Rita','Porvenir','Bejuco'],
    'La Cruz': ['La Cruz Centro','Santa Cecilia','Garita','Santa Elena'],
    'Hojancha': ['Hojancha Centro','Monte Romo','Puerto Carrillo','Huacas','Matambú'],
  },

  // ────────────────────────── Puntarenas ───────────────────────
  'Puntarenas': {
    'Puntarenas': ['Puntarenas Centro','Pitahaya','Chomes','Lepanto','Paquera','Manzanillo','Guacimal','Barranca','Monte Verde','Isla del Coco'],
    'Esparza': ['Espíritu Santo','San Juan Grande','Macacona','San Rafael','San Jerónimo','Caldera'],
    'Buenos Aires': ['Buenos Aires Centro','Volcán','Potrero Grande','Boruca','Pilas','Colinas','Chánguena','Biolley','Brunka'],
    'Montes de Oro': ['Miramar','La Unión','San Isidro'],
    'Osa': ['Cortés','Palmar','Sierpe','Bahía Ballena','Piedras Blancas'],
    'Quepos': ['Quepos Centro','Savegre','Naranjito'],
    'Golfito': ['Golfito Centro','Puerto Jiménez','Guaycará','Pavón'],
    'Coto Brus': ['San Vito','Sabalito','Aguabuena','Limoncito','Pittier','Gutiérrez Braun'],
    'Parrita': ['Parrita Centro','Sardinal','Parrita (rural)'],
    'Corredores': ['Corredor','La Cuesta','Canoas','Laurel'],
    'Garabito': ['Jacó','Tárcoles'],
  },

  // ────────────────────────── Limón ────────────────────────────
  'Limón': {
    'Limón': ['Limón Centro','Valle La Estrella','Río Blanco','Matama'],
    'Pococí': ['Guápiles','Jiménez','Rita','Roxana','Cariari','Colorado','La Colonia'],
    'Siquirres': ['Siquirres Centro','Pacuarito','Florida','Germania','Cairo','Alegría'],
    'Talamanca': ['Bratsi','Sixaola','Cahuita','Telire'],
    'Matina': ['Matina Centro','Batán','Carrandi'],
    'Guácimo': ['Guácimo Centro','Mercedes','Pocora','Río Jiménez','Duacarí'],
  },
}

export const PROVINCES = Object.keys(CR_GEO)
