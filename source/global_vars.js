var Direction_X_AXIS = 
{
    RIGHT: 1,
    LEFT:  2,
	NONE:  3
}

var SPARKS = 
{
    RIGHT: 1,
    LEFT:  2,
	BOTH:  3,
	NONE:  4
}

var DECIVE = 
{
    NO_DETECT: 1,
    PHONE:     2,
	TABLET:    3
}

//barra de carga
var game_is_end = false;

var end_loading, start_loading;

start_loading = new Date();

//WALINWA VARS****************1*******

var GAME_3_WALIS                    = 0;
var GAME_3_WALIS_INCREASE           = 2;
var GAME_3_MAX_WALIS                = 50;
var GAME_3_POINTS_WALI_INCREASE     = 100;
var GAME_3_POINTS_PICK_WORD_CORRECT = 50;
var GAME_3_POINTS_PICK_WORD_WRONG   = 25;
var GAME_3_ONLINE_DATA;
var WORDS_PROBABILITY = 20;
if (typeof callBackGame3 === 'undefined')
	var callBackGame3 = null;

if (typeof GAME_3_URL_SOURCE === 'undefined')
	GAME_3_URL_SOURCE = "PLEASE_ADD_AN_URL";

if (typeof GAME_3_ID_USER === 'undefined')
	GAME_3_ID_USER    = "0";

if (typeof GAME_3_IDCOINT === 'undefined')
	GAME_3_IDCOINT    = 0;

if (typeof GAME_3_VERSION === 'undefined')
	GAME_3_VERSION    = 3;


//WALINWA VARS************************

var ctx           = canvas.getContext('2d'); // ...and its drawing context
var aspect_ratio  = 1.858;
var fps           = 30;                      // how many 'Update' frames per second
var step          = 1/fps;                   // how long is each frame (in seconds)
var width         = canvas.scrollWidth;      // logical canvas width

var half_contex;//calculado en resize
var is_loading  = true;
Hud.Start_loading();
Hud.Resize();//Necesario redimensionar antes de coger la altura
window.addEventListener("resize", function(){Hud.Resize()}, false); 

var height          = canvas.scrollHeight;     // logical canvas height
var sky_speed       = 0.001;                   // background sky layer scroll speed when going around curve (or up hill)
var parallax1_speed = 0.002;                   // background hill layer scroll speed when going around curve (or up hill)
var parallax2_speed = 0.0022;                   // background tree layer scroll speed when going around curve (or up hill)

var sky_offset      = 0;                       // current sky scroll offset
var tier1_offset    = 0;                       // current hill scroll offset
var tier2_offset    = 0;                       // current tree scroll offset

var sky_position    = 0;                     // current sky scroll offset
var tier1_position  = (height / 8);          // grada de arriba
var tier2_position  = (height / 2.5);          // grada de abajo

var segments        = [];                      // array of road segments

//cars vars
var cars            = [];                      // array of cars on the road
var total_cars      = 80;                     // total number of cars on the road
var max_cars        = 110;
var num_cars_to_add = 5;
var points_to_add_cars = 20;

var background      = null;                    // our background image (loaded below)
var sprites         = null;                    // our spritesheet (loaded below)
var resolution      = height/1920;            // scaling factor to provide resolution independence (computed)
var road_width      = 2000;                    // actually half the roads width, easier math if the road spans from -road_width to +road_width
var segment_length  = 200;                     // length of a single segment
var rumble_length   = 3;                       // number of segments per red/white rumble strip
var track_length    = null;                    // z length of entire track (computed)
var lanes           = 3;                       // number of lanes
var field_of_view   = 100;                     // angle (degrees) for field of view
var camera_height   = 1000;                    // z height of camera
var camera_depth    = 1 / Math.tan((field_of_view/2) * Math.PI/180);  // z distance camera is from screen (computed)
var draw_distance   = 110;                     // number of segments to draw
var fog_density     = 4;                       // exponential fog density

//player state vars
var max_speed       =  (segment_length/step) * 1.1;      // top speed (ensure we can't move more than 1 segment in a single frame to make collision detection easier)
var def_speed       =  max_speed / 2.5;
var speed           =  def_speed;                 // current speed

var key_left        = false;
var key_right       = false;
var input_direction = Direction_X_AXIS.NONE;	
var sparkes_direction = SPARKS.NONE;
//position in segment and colision vars

var speed_percent;
var dx;
var start_position;

var segment_checked      = 0;
var distance_toAttack    = 55;
var area_toAttack        = 20;

var timer                = 0;

// points vars
var max_time_to_point    = 1.5;
var min_time_to_point    = 0.3;
var next_point_time      = max_time_to_point;
var time_to_point        = 0;
var points               = 0;
var points_to_get_walinwos = GAME_3_POINTS_WALI_INCREASE;

//frame vars
var num_frames_carriages = 3;
var num_frames_player    = 3;
var current_frame        = 0;
var time_frame           = 0;

var num_frames_sparks    = 3;
var current_frame_sparks = 0;

var min_duration_frame   = 0.2;
var max_duration_frame   = 0.3;
var duration_frame       = max_duration_frame;

//acelerometre vars
var is_inTouch           = false;

var accel_X              = 0;
var accel_Y              = 0;
var accel_Z              = 0;

var current_accel_value  = 0;
var previous_accel_value = 0;
var accel_variation      = 0;
var dead_zone            = 0.5;//discart zone of acelerometre changes
var dead_zone_variation  = 0.115;
var is_apple_product = false;
var gravity;

var decive_type          = DECIVE.NO_DETECT;	

//powerUp1
var brakeOn_disable      = false;
var brakeOn_active       = false;
var powerUp1_duration    = 300;
var powerUp1_recoil      = 5000;

//powerUp1
var setAside_disable     = false;
var setAside_active      = false;
var powerUp2_duration    = 2000;
var powerUp2_recoil      = 15000;

//text colors
var initial_color     = ["254","254","254"];
var wrong_color       = ["235",  "0",  "0"];
var correct_color     = ["6",  "218", "76"];
var wrong_color_hud   = ["235",  "0",  "0"];
var correct_color_hud = ["153","255", "51"];

var pos_column = 1;

canvas.width             = width;
canvas.height            = height;