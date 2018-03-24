//=========================================================================
// Player utils
//=========================================================================

var Player = new function() 
{
	
	this.X = 0;                       // player x offset from center of road (-1 to 1 to stay independent of road_width)
	this.Z = (camera_height * camera_depth);                    // player relative this.Z distance from camera (computed)
	this.W = 0;
	this.position = 0; 
	this.segment = null;	
	
	//life vars
	this.life = 3;

	//player invincible time vars
	this.player_isVisible = true;
	
	var is_invincible = false;
	var invincible_time = 0;
	var invincible_duration = 3;
	var time_to_blink = 0;
	var blink_duration = 0.3;
	
	//lateral speed vars
	var brake_lateral_increment = 1;
	var max_lateralSpeed = 1.5;
	var lateral_speed = 0;
	var lateral_accel = 0.4;
	
	var dt;
	var word_segment;
	
	var n, car, car_W, sprite, sprite_W, word;
	
	//acceleration vars
	var accel           =  max_speed/5;         // acceleration rate - tuned until it 'felt' right
	var time_accel      =  max_speed/7000;      // acceleration over time
	var decel_force     =  2;
	var offRoad_decel   =  -speed/decel_force; // off road deceleration is somewhere in between
	var off_road_Limit  =  0;                  // Limit when off road deceleration no longer applies (e.g. you can always go at least this speed even when off road)
	var off_road_calculated = false;
	var centrifugal     = 0.23;                // centrifugal force multiplier when going around curves
	
	//vars brake
	var previous_speed = 0;
	var brake_dir = 0;

	var has_crash = false;
	
	
	this.PowerUp1_brake = function() 
	{
		if(!brakeOn_disable)
		{
			brake_dir = 0;
			previous_speed = def_speed;
			def_speed = def_speed /1.5;
			brake_lateral_increment = 3.5;
			
			brakeOn_disable = true;
			brakeOn_active = true;
			
			Hud.powerUp1.style.filter = "grayscale(100%)";
			setTimeout(function()
			{				
				setTimeout(function(){ sparkes_direction = SPARKS.NONE; }, 500); 	
				brakeOn_active = false;
				def_speed = previous_speed
				brake_lateral_increment = 1;
				
				setTimeout(function()
				{
					Hud.powerUp1.style.filter = "grayscale(0%)";
					brakeOn_disable = false; 	
				}, 
				  powerUp1_recoil);
			}, 
			  powerUp1_duration);
		}
	}

	this.PowerUp1_set_aside = function() 
	{
		if(!setAside_disable)
		{
			setAside_disable = true;
			setAside_active = true;
			
			Hud.powerUp2.style.filter = "grayscale(100%)";
			setTimeout(function()
			{
				setAside_active = false;
				
				setTimeout(function()
				{
					Hud.powerUp2.style.filter = "grayscale(0%)";
					setAside_disable = false; 	
				}, 
				  powerUp2_recoil);
			}, 
			  powerUp2_duration);
		}
	}
	
	this.Invincible_State = function() 
	{
		time_to_blink += dt;

		if(time_to_blink > 	blink_duration)
		{
			time_to_blink = 0;
			this.player_isVisible = !this.player_isVisible;
		}

		if(timer > invincible_time)
		{
			this.player_isVisible = true;
			is_invincible = false;
		}
	}
	
	this.Deceleration_calculation = function()
	{			
			if (((this.X < -1) || (this.X > 1)) && off_road_calculated == false)
			{
				offRoad_decel = -speed/decel_force;
				off_road_calculated = true;
			}
			else if(((this.X > -1) || (this.X < 1))  && off_road_calculated == true)
			{
				off_road_calculated = false;
			}
	}
	
	this.Life_lost = function()
	{
		this.life--;
		
		if(this.life >= 0)
			Hud.life_hud.style.backgroundImage =  'url("images/vidas' + encodeURI(Player.life) + "" + 
												   encodeURI((GAME_3_VERSION > 1) ? "-1" : "") + '.png")';
		
		invincible_time = timer + invincible_duration;
		is_invincible = true;
		
		if(this.life <= 0)
		{	
			game_is_end = true;
			setTimeout(function(){ End_game(); }, 1000); 			
		}
	}
	
	this.Check_collisions_cars = function()
	{
		for(n = 0 ; n < this.segment.cars.length ; n++) 
		{
			car  = this.segment.cars[n];
			car_W = car.sprite.w * SPRITES.SCALE;
			if (speed > car.speed) 
			{
			  if (Util.Overlap(this.X, this.W, car.offset, car_W, 0.8) && !is_invincible) 
			  {
				speed = car.speed * (car.speed/speed);
				
				this.position = Util.Increase(car.z, -this.Z, track_length);
				this.Life_lost();
				break;
			  }
			}
		}
	}
	
	this.Check_collisions_words = function()
	{
		for(i = 8; i > 1; i--)
		{
			word_segment = Find_segment_at_distance_from_player(i);
			
			if(word_segment.word != null && !word_segment.word.disable)
			{
				word = word_segment.word;
				wordW = word.num_leters  * 0.095;

				if (Util.Overlap(this.X, this.W, word.offset + (wordW / 2), wordW, 1)) 
				{
					if(word.is_correct)	
					{
						points += GAME_3_POINTS_PICK_WORD_CORRECT;	
						Hud.Animation_points(800, true);
					}								
					else
					{
						points -= GAME_3_POINTS_PICK_WORD_WRONG;
						Hud.Animation_points(800, false);

						if(points < 0)
							points = 0;
					}

					Animation_word(word, word_segment, dt);						
				}
			}
		}
	}

	this.Check_collisions_obstacles = function()
	{
    	if (((this.X < -1) || (this.X > 1)) && this.segment.sprite) 
   		{
			var sprite_W = this.segment.sprite.source.w * SPRITES.SCALE * 2;

			if (Util.Overlap(this.X, this.W, this.segment.sprite.offset + sprite_W/2 * (this.segment.sprite.offset > 0 ? 1 : -1), sprite_W)) 
			{
					this.position = Util.Increase(Player.segment.p1.world.z, -this.Z, track_length); // stop in front of sprite (at front of segment)
					lateral_speed = 0;
					has_crash = true;

					setTimeout(function() 
					{
						if(!is_invincible && !game_is_end)
						{
							Player.Life_lost();

							if(!game_is_end)
							{
								speed = def_speed / 20;
								Player.X = 0;
								has_crash = false;
							}
						}	
					}, 1000);
			}
        }
        
    }
	
	
	this.Input = function()
	{
		if (key_left || input_direction == Direction_X_AXIS.LEFT)
		{
			if (lateral_speed > -max_lateralSpeed)
				lateral_speed -= lateral_accel;
		}
		else if (key_right || input_direction == Direction_X_AXIS.RIGHT)
		{
			if (lateral_speed < max_lateralSpeed)
				lateral_speed += lateral_accel;	
		}
		else if(lateral_speed < -0.65 && lateral_speed != 0)
		{
			lateral_speed += lateral_accel;
		}
		else if(lateral_speed > 0.65  && lateral_speed != 0)
		{
			lateral_speed -= lateral_accel;
		}
		else if(lateral_speed != 0)
		{
			lateral_speed = 0;
		}
		
		this.X += (dx * lateral_speed * brake_lateral_increment);
	}
	
	this.Update = function(_dt)
	{
		dt = _dt
		this.W = SPRITES.PLAYER_STRAIGHT.w * SPRITES.SCALE;
		word_segment = Find_segment_at_distance_from_player(7);
		this.segment = Find_segment(this.position + this.Z);
		
		if(is_invincible)
		{
			this.Invincible_State();
		}

		this.position = Util.Increase(this.position, dt * speed, track_length);

		if(!has_crash)
			this.Input();
		
		if(def_speed < max_speed && !brakeOn_active)
		{
			def_speed += time_accel;
		}
		else if(brakeOn_active)
		{
			if(brake_dir == 0)
			{
				if (key_left || input_direction == Direction_X_AXIS.LEFT)
				{
					brake_dir = -1;
					sparkes_direction = SPARKS.RIGHT;
				}
				else if (key_right || input_direction == Direction_X_AXIS.RIGHT)
				{
					brake_dir = 1;
					sparkes_direction = SPARKS.LEFT;
				}
				else
				{
					sparkes_direction = SPARKS.BOTH;
				}
			}
			if((lateral_speed > 0 && brake_dir == -1) || (lateral_speed < 0 && brake_dir == 1))
			{
				brake_lateral_increment = 1;
			}
		}
		
		this.X = this.X - ((dx * 2) * speed_percent * this.segment.curve * centrifugal);

		if (((this.X < -1) || (this.X > 1)) && speed > off_road_Limit)
		{
			speed = Util.Accelerate(speed, offRoad_decel, dt);
		}
		else if (((this.X > -1) || (this.X < 1)) && (speed < def_speed)  && (speed > off_road_Limit))
		{
			speed = Util.Accelerate(speed, accel, dt);
		}
		else if (speed == 0 && !is_invincible)
		{	
			this.Life_lost();
			
			if(!game_is_end)
			{
				this.X = 0;
				speed = def_speed / 20;
			}
		}
		
		this.X = Util.Limit(this.X, -3, 3);     // dont ever let it go too far out of bounds
		speed   = Util.Limit(speed, 0, def_speed); // or exceed max_speed
		
		this.Check_collisions_cars();
		this.Check_collisions_words();
		this.Check_collisions_obstacles();
	}
}