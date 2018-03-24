//=========================================================================
// BUILD ROAD GEOMETRY
//=========================================================================

function Last_Y() { return (segments.length == 0) ? 0 : segments[segments.length-1].p2.world.y; }

function Add_segment(curve, y) 
{
  var n = segments.length;
  segments.push({
	  index: n,
		 p1: { world: { y: Last_Y(), z:  n   *segment_length }, camera: {}, screen: {} },
		 p2: { world: { y: y,       z: (n+1)*segment_length }, camera: {}, screen: {} },
	  curve: curve,
	  sprite: null,
	   cars: [],
	   word: Get_word(n),
	  color: Math.floor(n/rumble_length)%2 ? COLORS.DARK : COLORS.LIGHT
  });
}


function Add_road(enter, hold, leave, curve, y) 
{
  var start_Y   = Last_Y();
  var end_Y     = start_Y + (Util.ToInt(y, 0) * segment_length);
  var n, total = enter + hold + leave;
  for(n = 0 ; n < enter ; n++)
	Add_segment(Util.Ease_in(0, curve, n/enter), Util.Ease_inOut(start_Y, end_Y, n/total));
  for(n = 0 ; n < hold  ; n++)
	Add_segment(curve, Util.Ease_inOut(start_Y, end_Y, (enter+n)/total));
  for(n = 0 ; n < leave ; n++)
	Add_segment(Util.Ease_inOut(curve, 0, n/leave), Util.Ease_inOut(start_Y, end_Y, (enter+hold+n)/total));
}

var ROAD = {
  LENGTH: { NONE: 0, SHORT:  25, MEDIUM:   50, LONG:  100 },
  HILL:   { NONE: 0, LOW:    20, MEDIUM:   40, HIGH:   60 },
  CURVE:  { NONE: 0, EASY:    2, MEDIUM:    4, HARD:    6 }
};

function Add_straight(num) {
  num = num || ROAD.LENGTH.MEDIUM;
  Add_road(num, num, num, 0, 0);
}

function Add_hill(num, height) {
  num    = num    || ROAD.LENGTH.MEDIUM;
  height = height || ROAD.HILL.MEDIUM;
  Add_road(num, num, num, 0, height);
}

function Add_curve(num, curve, height) {
  num    = num    || ROAD.LENGTH.MEDIUM;
  curve  = curve  || ROAD.CURVE.MEDIUM;
  height = height || ROAD.HILL.NONE;
  Add_road(num, num, num, curve, height);
}
	
function Add_low_rolling_PARALLAX_2(num, height) {
  num    = num    || ROAD.LENGTH.SHORT;
  height = height || ROAD.HILL.LOW;
  Add_road(num, num, num,  0,                height/2);
  Add_road(num, num, num,  0,               -height);
  Add_road(num, num, num,  ROAD.CURVE.EASY,  height);
  Add_road(num, num, num,  0,                0);
  Add_road(num, num, num, -ROAD.CURVE.EASY,  height/2);
  Add_road(num, num, num,  0,                0);
}

function AddS_curves() {
  Add_road(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.NONE);
  Add_road(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.HARD,  ROAD.HILL.MEDIUM);
  Add_road(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.MEDIUM,   -ROAD.HILL.LOW);
  Add_road(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.MEDIUM);
  Add_road(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.HARD, -ROAD.HILL.MEDIUM);
}

function Add_bumps() {
  Add_road(10, 10, 10, 0,  5);
  Add_road(10, 10, 10, 0, -2);
  Add_road(10, 10, 10, 0, -5);
  Add_road(10, 10, 10, 0,  8);
  Add_road(10, 10, 10, 0,  5);
  Add_road(10, 10, 10, 0, -7);
  Add_road(10, 10, 10, 0,  5);
  Add_road(10, 10, 10, 0, -2);
}

function Add_down_hill_to_end(num) {
  num = num || 200;
  Add_road(num, num, num, -ROAD.CURVE.EASY, -Last_Y()/segment_length);
}

function Add_sprite(n)
{
	if(n % 50 == 0 || n % 51 == 0)
	{
		pos_column = -pos_column;
		
		return { source: SPRITES.OBSTACLE03, offset: pos_column * Util.Random_float(1.1, 1.3)};
	}
	else if((Math.random() * 100 < 30) && (n % 5 == 0) && n > 110)
	{
		return { source: Util.Random_choice(SPRITES.OBSTACLES), offset: Util.Random_choice([1, -1]) * Util.Random_float(1.2, 1.7)};
	}

	return null;
}

function Reset_sprites() 
{
	for(n = 0 ; n < (segments.length) ; n++) 
	{
		segments[n].sprite = Add_sprite(n);
	}

}

function Reset_road() 
{
  segments = [];
  
  Add_straight(ROAD.LENGTH.SHORT);
  Add_low_rolling_PARALLAX_2();

  AddS_curves();
  Add_curve(ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.HIGH);
  
  Add_bumps();
  Add_low_rolling_PARALLAX_2();

  Add_bumps();
  Add_hill(ROAD.LENGTH.LONG, -ROAD.HILL.MEDIUM);
  Add_straight();
  
  AddS_curves();

  Add_down_hill_to_end();

  Reset_sprites();
  Reset_cars();

  track_length = segments.length * segment_length;
}