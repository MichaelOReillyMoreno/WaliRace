//=========================================================================
// Render THE GAME WORLD
//=========================================================================

function World_render() 
{
  var base_segment   = Find_segment(Player.position);
  var base_percent   = Util.Percent_remaining(Player.position, segment_length);
  var playerSegment  = Find_segment(Player.position + Player.Z);
  var player_percent = Util.Percent_remaining(Player.position + Player.Z, segment_length);
  var player_Y       = Util.Interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, player_percent);
  var max_Y          = height;

  var x  = 0;
  var dx = - (base_segment.curve * base_percent);

  ctx.clearRect(0, 0, width, height);

  Render.background(ctx, background, width, height, BACKGROUND.SKY, sky_offset,  resolution * sky_speed  * player_Y, sky_position);
  Render.background(ctx, background, width, height, BACKGROUND.PARALLAX_2, tier1_offset, resolution * parallax1_speed.peed * player_Y, tier1_position);
  Render.background(ctx, background, width, height, BACKGROUND.PARALLAX_1, tier2_offset, resolution  * parallax2_speed.peed * player_Y, tier2_position);

  var n, i, segment, car, sprite, sprite_scale, sprite_X, sprite_Y;

  for(n = 0 ; n < draw_distance ; n++) 
  {

	segment        = segments[(base_segment.index + n) % segments.length];
	segment.looped = segment.index < base_segment.index;
	segment.fog    = Util.Exponential_fog(n/draw_distance, fog_density);
	segment.clip   = max_Y;

	Util.Project(segment.p1, (Player.X * road_width) - x,      player_Y + camera_height, Player.position - (segment.looped ? track_length : 0), camera_depth, width, height, road_width);
	Util.Project(segment.p2, (Player.X * road_width) - x - dx, player_Y + camera_height, Player.position - (segment.looped ? track_length : 0), camera_depth, width, height, road_width);

	x  = x + dx;
	dx = dx + segment.curve;

	if ((segment.p1.camera.z <= camera_depth)         || // behind us
		(segment.p2.screen.y >= segment.p1.screen.y) || // back face cull
		(segment.p2.screen.y >= max_Y))                  // clip by (already Rendered) hill
	  continue;

	Render.segment(ctx, width, lanes,
				   segment.p1.screen.x,
				   segment.p1.screen.y,
				   segment.p1.screen.w,
				   segment.p2.screen.x,
				   segment.p2.screen.y,
				   segment.p2.screen.w,
				   segment.fog,
				   segment.color);

	max_Y = segment.p1.screen.y;
  }

  for(n = (draw_distance-1) ; n > 0 ; n--) 
  {
	segment = segments[(base_segment.index + n) % segments.length];

	for(i = 0 ; i < segment.cars.length ; i++) 
	{
	  car         = segment.cars[i];
	  sprite      = car.sprite;
	  sprite_scale = Util.Interpolate(segment.p1.screen.scale, segment.p2.screen.scale, car.percent);
	  sprite_X     = Util.Interpolate(segment.p1.screen.x,     segment.p2.screen.x,     car.percent) + (sprite_scale * car.offset * road_width * width/2);
	  sprite_Y     = Util.Interpolate(segment.p1.screen.y,     segment.p2.screen.y,     car.percent);
	  
	  Render.sprite(ctx, width, height, resolution, road_width, sprites, car.sprite, sprite_scale, sprite_X, sprite_Y, -0.5, -1, segment.clip, car.current_frame);
	}

	if(segment.sprite)
	{

		sprite       = segment.sprite;
		sprite_scale = segment.p1.screen.scale;
		sprite_X     = segment.p1.screen.x + (sprite_scale * sprite.offset * road_width * width / 2);
		sprite_Y     = segment.p1.screen.y;// + (sprite_scale * 20000);

		Render.sprite(ctx, width, height, resolution, road_width, sprites, sprite.source, sprite_scale * 2, sprite_X, sprite_Y, (sprite.offset < 0 ? -1 : 0), -1, segment.clip, 0);
	}
	
	if(segment.word != null)
	{
		var p = segment.p1;
		var word = segment.word;
		
		Render.word(word.content, p.screen.x  + (p.screen.scale * word.offset * road_width * width/2), p.screen.y - word.pos_Y, p.screen.scale, segment.clip, word.color);
	}

	if (segment == playerSegment && Player.player_isVisible) 
	{
	    Render.player(ctx, width, height, resolution, road_width, sprites, speed/max_speed,
					camera_depth/Player.Z,
					width/2,
					(height/2) - (camera_depth/Player.Z * Util.Interpolate(playerSegment.p1.camera.y, playerSegment.p2.camera.y, player_percent) * height/2));
	}
  }
}

function Find_segment(z) 
{
  return segments[Math.floor(z/segment_length) % segments.length]; 
}

function Find_segment_at_distance_from_player(distance) 
{	 
	var index_player =  Player.segment.index;

	if((index_player + distance) < segments.length)
		return segments[(index_player + distance)]; 
	else
		return segments[(index_player + distance) - segments.length]; 
}