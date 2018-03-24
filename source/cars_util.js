//=========================================================================
// cars funtions
//=========================================================================

function Update_cars(dt) 
{
	var n, car, old_segment, new_segment;
	
	for(n = 0 ; n < total_cars ; n++) 
	{
		car          = cars[n];
		old_segment  = Find_segment(car.z);
		car.z        = Util.Increase(car.z, dt * car.speed, track_length);
		car.percent  = Util.Percent_remaining(car.z, segment_length); // useful for interpolation during Rendering phase
		new_segment  = Find_segment(car.z);
		
		if (old_segment != new_segment) 
		{
			index = old_segment.cars.indexOf(car);
			old_segment.cars.splice(index, 1);
			new_segment.cars.push(car);
		}
		
		car.time_frame += dt;
		if(car.time_frame >= duration_frame)
		{
			car.time_frame = 0;
			if (car.current_frame < num_frames_carriages)
			{
				car.current_frame ++;
			}
			else
			{
				car.current_frame = 0;
			}
		}
		
		if(setAside_active && (new_segment.index - Player.segment.index) < draw_distance && car.offset > -0.85 && car.offset < 0.85)
		{			
			car.offset += (car.offset < 0) ? (dt  * speed_percent * -1.2) : (dt  * speed_percent * 1.2);	
			
			if(!car.setAside)
				car.setAside = true;
		}
		else if(!setAside_active && car.attacking && ((car.can_go_out) || (Player.X > -0.9 && Player.X < 0.9)))
		{		
			Attack(car, new_segment, dt);
		}
		else if(!setAside_active && !car.attacking)
		{
			car.offset += Update_car_offset(car, old_segment);
		}
	}

	Check_aggressive_cars();
}

function Attack(car, new_segment, dt) 
{	
	if(Math.abs(car.offset - Player.X) > 0.15)
	{
		if(car.offset > Player.X && car.lateral_speed > -car.max_lateralSpeed)
		{
			car.lateral_speed -= car.lateral_accel;
		}
		else if(car.offset < Player.X && car.lateral_speed < car.max_lateralSpeed)
		{
			car.lateral_speed += car.lateral_accel;
		}
	}
	else if(car.lateral_speed < -0.55 && car.lateral_speed != 0)
	{
		car.lateral_speed += car.lateral_accel;
	}
	else if(car.lateral_speed > 0.55  && car.lateral_speed != 0)
	{
		car.lateral_speed -= car.lateral_accel;
	}
	else if(car.lateral_speed != 0)
	{
		car.lateral_speed = 0;
	}
	
	car.offset  += dt  * speed_percent * car.lateral_speed;
	

	if(Math.abs(new_segment.index - Player.segment.index) > distance_toAttack)
	{
		car.lateral_speed = 0;
		car.attacking = false;
	}
}

function Check_aggressive_cars() 
{	
	var car;

	segment_checked = ((Player.segment.index + distance_toAttack) < segments.length) ? (Player.segment.index + distance_toAttack) : 
																					   (Player.segment.index + distance_toAttack) - segments.length;

	area_toAttack = segment_checked - 20;
	
	for (var n_segment = segment_checked ; n_segment >= area_toAttack ; n_segment--)
	{
		if(n_segment > 0)
		{
			for (var n_car = 0 ; n_car < segments[n_segment].cars.length ; n_car++)
			{
				car = segments[n_segment].cars[n_car];

				if(car.is_aggressive && ! car.attacking)
				{
					segments[n_segment].cars[n_car].attacking = true;
				}
			}		
		}	
	}
}

function Update_car_offset(car, car_segment) 
{
	var i, j, dir, segment, other_car, other_car_W, look_ahead = 20, car_W = car.sprite.w * SPRITES.SCALE;

	// optimization, dont bother steering around other cars when 'out of sight' of the player
	if ((car_segment.index - Player.segment.index) > draw_distance)
	{	
		if(car.setAside)
		{
			car.offset = Math.random() * Util.Random_choice([-0.8, 0.8]);
		}	
		return 0;
	}


	for(i = 1 ; i < look_ahead ; i++) 
	{
		segment = segments[(car_segment.index+i)%segments.length];

		if ((segment === Player.segment) && (car.speed > speed) && (Util.Overlap(Player.X, Player.W, car.offset, car_W, 1.2))) 
		{
			dir = (car.offset > Player.X) ? 1 : -1;
			
			return dir * 1/i * (car.speed-speed)/max_speed; // the closer the cars (smaller i) and the greated the speed ratio, the larger the offset
		}

		for(j = 0 ; j < segment.cars.length ; j++) // controla si se solapa con otro coche
		{
			other_car  = segment.cars[j];
			other_car_W = other_car.sprite.w * SPRITES.SCALE;
			
			if ((car.speed > other_car.speed) && Util.Overlap(car.offset, car_W, other_car.offset, other_car_W, 1.2)) 
			{
				if(car.attacking || other_car.attacking)//si alguno está atacando, obviamos las colisiones
					break;
				
				dir = (car.offset > other_car.offset) ? 1 : -1;

				return dir * 1/i * (car.speed-other_car.speed)/ (max_speed * 0.75);
			}
		}
	}

	// if no cars ahead, but I have somehow ended up off road, then steer back on
	if((car_segment.index - Player.segment.index) > draw_distance)
	{
		if (car.offset < -0.7)
			return  0.1;
		else if (car.offset > 0.7)
			return -0.1;
	}
	
	return 0;
}

function Reset_cars() 
{
	cars = [];
	var car, segment, offset, z, sprite, speed;
	var _max_lateralSpeed, _lateral_accel, _can_go_out, type;
	
	var rnd, is_aggressive, rand_frame;
	
	for (var n = 0 ; n < max_cars ; n++)
	{
		is_aggressive = (n >= total_cars) ? true : false;
		  
		offset = Math.random() * Util.Random_choice([-0.7, 0.7]);
		z      = Math.floor(Math.random() * segments.length) * segment_length;
		speed  = Math.random() * ((def_speed * 0.5) - (def_speed / 4)) + (def_speed / 4);
		rand_frame = Math.random() * num_frames_carriages;
		
		if(is_aggressive)
		{
			type = Util.Random_int(3, 4);
			sprite = SPRITES.CARRIAGES[type];
			_can_go_out = (type == 4) ? true : false;
			
			if(_can_go_out)
			{
				_max_lateralSpeed = 1.1;
				_lateral_accel = 0.2;
			}
			else
			{
				_max_lateralSpeed = 1.3;
				_lateral_accel = 0.3;
			}

			car = { offset: offset, z: z, sprite: sprite, speed: speed, is_aggressive : is_aggressive, attacking : false,
					setAside : false,
					current_frame: rand_frame,
					time_frame: 0,
					lateral_speed : 0,
					max_lateralSpeed: _max_lateralSpeed,
					lateral_accel: _lateral_accel, 
					can_go_out : _can_go_out};
		}
		else
		{
			segment = Find_segment(z);	

			while(segment.index < 150)
			{				
				z = Math.floor(Math.random() * segments.length) * segment_length;
				segment = Find_segment(z);
			}

			sprite = Util.Random_choice_between(SPRITES.CARRIAGES, 0, 2);

			car = { offset: offset, z: z, sprite: sprite, speed: speed, is_aggressive : false,
					attacking : false, setAside : false, current_frame: rand_frame, time_frame: 0.0};

			segment.cars.push(car);			
		}
		
		cars.push(car);
    }
}

function Add_cars(n_added_cars) 
{ 
	var new_total_cars = (total_cars + n_added_cars);
	var car_segment;
	var car;

	while (total_cars < new_total_cars)
	{
		car = cars[total_cars];
		car_segment = Find_segment(car.z);

		while ((car_segment.index - Player.segment.index) < draw_distance)
		{		
			car.z = Math.floor(Math.random() * segments.length) * segment_length;
			car_segment = Find_segment(car.z);
		}

		segment = Find_segment(car.z);
		segment.cars.push(car);
		
		total_cars++
	} 
}
