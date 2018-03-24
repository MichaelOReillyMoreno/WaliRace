//=============================================================================
// RACING GAME CONSTANTS
//=============================================================================

var ROAD = 
{
  LENGTH: { NONE: 0, SHORT:  25, MEDIUM:  50, LONG:  100 },
  HILL:   { NONE: 0, LOW:    10, MEDIUM:  20, HIGH:   30 },
  CURVE:  { NONE: 0, EASY:    2, MEDIUM:   4, HARD:    6 }
};

var KEY = 
{
  LEFT:  37,
  UP:    38,
  RIGHT: 39,
  DOWN:  40,
  A:     65,
  D:     68,
  S:     83,
  W:     87,
  SHIFT: 16,
  CTRL:  17
};

var COLORS = 
{
  SKY:  '#72D7EE',
  TREE: '#005108',
  FOG:  '#5d481f',
  LIGHT:  { road: '#ede1c9', grass: '#cba762', rumble: '#ac966d'   },
  DARK:   { road: '#e3d0ab', grass: '#c19744', rumble: '#f2e9d8'   }
};

var BACKGROUND = 
{

 //fondo en segundo plano
  PARALLAX_2: { x:   35, y:   801, w: 1283, h: 254 },
 //fondo ede cielo
  SKY:   { x:   35, y: 311, w: 1280, h: 480 },
 //fondo en primer plano
  PARALLAX_1: { x:   35, y: 40, w: 1278, h: 246 }
};

var SCALE = 0.2;

var SPRITES = 
{
	
  //Carros enemigos
  
	CARRIAGE01:             { x: 5,   y:  470, w: 250, h:  230 },
	CARRIAGE02:             { x: 5,   y:  705, w: 252, h:  230 },
	CARRIAGE03:             { x: 5,   y:  940, w: 252, h:  230 },
	CARRIAGE04:             { x: 5,   y:    0, w: 282, h:  230 },
	CARRIAGE05:             { x: 5,   y:  235, w: 282, h:  230 },

	SPARKSLEFT:             { x: 534, y: 1410, w: 131, h:  123 },
	SPARKSRIGHT:            { x: 5,   y: 1410, w: 131, h:  123 },

	OBSTACLE01:             { x: 37,  y: 1538, w: 102, h:  228 },//spqr erguido ok
	OBSTACLE02:             { x: 297, y: 1538, w: 195, h:  130 },//Carro marron ok
	OBSTACLE03:             { x: 590, y: 1538, w: 111, h:  215 },//columna erguida
	OBSTACLE04:             { x: 790, y: 1538, w: 234, h:  200 },//piedra grande
	OBSTACLE05:             { x: 292, y: 1703, w: 208, h:  127 },//columnas
	OBSTACLE06:             { x: 782, y: 1773, w: 232, h:  121 },//carro azul
	OBSTACLE07:             { x: 519, y: 1789, w: 184, h:  100 },//rueda verde
	OBSTACLE08:             { x: 12,  y: 1813, w: 175, h:  117 },//tres piedras
	OBSTACLE09:             { x: 184, y: 1861, w: 136, h:  127 },//spqr roto
	OBSTACLE10:             { x: 342, y: 1861, w: 113, h:   73 },//rueda marron

	PLAYER_STRAIGHT:        { x: 5,   y: 1175, w: 252, h:  230 }
};

SPRITES.SCALE = SCALE * (1/SPRITES.PLAYER_STRAIGHT.w) // the reference sprite width should be 1/3rd the (half-)road_width

SPRITES.CARRIAGES = [SPRITES.CARRIAGE01, SPRITES.CARRIAGE02, SPRITES.CARRIAGE03, SPRITES.CARRIAGE04, SPRITES.CARRIAGE05];
SPRITES.OBSTACLES = [SPRITES.OBSTACLE01, SPRITES.OBSTACLE02, SPRITES.OBSTACLE04, SPRITES.OBSTACLE05, SPRITES.OBSTACLE06, SPRITES.OBSTACLE07, SPRITES.OBSTACLE08, SPRITES.OBSTACLE09,  SPRITES.OBSTACLE10];