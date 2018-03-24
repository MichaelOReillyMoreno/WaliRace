//=========================================================================
// Update THE GAME WORLD
//=========================================================================

function Update(dt) 
{		
	timer += dt;
	time_to_point += dt;
	
	speed_percent = speed/max_speed;
	dx = dt * speed_percent; // at top speed, should be able to cross from left to right (-1 to 1) in 1 second
	
	start_position = Player.position;
	
	Update_cars(dt);
	
	if(!game_is_end)
	{			
		time_frame += dt;
		if(time_frame >= duration_frame)
		{
			time_frame = 0;
			if (current_frame < num_frames_player)
			{
				current_frame ++;
			}
			else
			{
				current_frame = 0;
			}
			
			if(sparkes_direction != SPARKS.NONE && current_frame_sparks < num_frames_sparks)
			{
				current_frame_sparks ++;
			}
			else
			{
				current_frame_sparks = 0;
			}
		}
		
		if(time_to_point > next_point_time)
		{ 
			Add_point();
			Player.Deceleration_calculation();
		}
		
		Player.Update(dt);
	}

	sky_offset  = Util.Increase(sky_offset,  sky_speed  * Player.segment.curve * (Player.position-start_position)/segment_length, 1);
	tier1_offset = Util.Increase(tier1_offset, parallax1_speed * Player.segment.curve * (Player.position-start_position)/segment_length, 1);
	tier2_offset = Util.Increase(tier2_offset, parallax2_speed * Player.segment.curve * (Player.position-start_position)/segment_length, 1);
	
}

function Add_point()
{
	next_point_time = Util.Interpolate(max_time_to_point, min_time_to_point, speed_percent);
				
	time_to_point = 0;
	points++;

	Hud.points_txt.textContent = points;
	
	if((points % points_to_add_cars == 0) && ((total_cars + num_cars_to_add) <= max_cars))
	{
		Add_cars(num_cars_to_add);
	}
	
	if(points > points_to_get_walinwos && GAME_3_WALIS < GAME_3_MAX_WALIS)
	{
		Hud.Animation_walinwos(700);
		GAME_3_WALIS += GAME_3_WALIS_INCREASE;
		Hud.walinwos_txt.textContent = GAME_3_WALIS;

		points_to_get_walinwos += GAME_3_POINTS_WALI_INCREASE;
	}
	
	duration_frame = Math.round(Util.Interpolate(max_duration_frame, min_duration_frame, speed_percent) * 100) / 100;
}

function Quick_game() {
    for (i = 0; i < 5; i++) 
	{
        if (Save_result(points)) 
		{
            break;
        }
    }
    if (callBackGame3 != null) 
	{
        window.setTimeout(callBackGame3, 500);
    }
}

function End_game() {
    Hud.end_txt.innerHTML = "Has conseguido " + points + " puntos " + " <br/> " + "Has ganado " + GAME_3_WALIS + " walinwos" + " <br/> " +
        "<button type='button' onclick='Quick_game()' id='buttonEnd'>Continuar</button>";
    speed = 0;

    Hud.buttonEnd = Dom_util.get('buttonEnd');

    Hud.Resize_dead_hud();

    Hud.Hide_hud();
}

//=========================================================================
// THE GAME LOOP
//=========================================================================

Game.run
({
  canvas: canvas, Render: Render, Update: Update, step: step,
  images: ["background", "sprites"],
  ready: function(images)
  {
	background = images[0];
	sprites    = images[1];
	reset();
  }
});

function reset() 
{	
	Hud.Resize();
	var dataURL = GAME_3_URL_SOURCE + "/PATH...";
	var words_get_from_server = false;

	for (i = 0; i < 5; i++) 
	{
		words_get_from_server = Get_words();
		
		if(words_get_from_server)
			break;
	}

	Game.Check_Version();
	Game.Add_keys_listener();
	Game.Add_touchs_listener();
	Game.Add_orientation_listener();

	var game_is_end = false;

	end_loading = new Date();

	Reset_road(); // only rebuild road when necessary
	
	Player.segment = Find_segment(Player.position + Player.Z);	

	var wait_to_start = 2000 - (end_loading.getTime() - start_loading.getTime());

	if(wait_to_start < 0)
		wait_to_start = 0;
	
	setTimeout(function() {	Hud.Hide_loading(); is_loading = false; }, wait_to_start);
}
