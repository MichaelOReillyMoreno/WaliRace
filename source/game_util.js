if (!window.requestAnimationFrame) 
{ 
  window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                 window.mozRequestAnimationFrame    || 
                                 window.oRequestAnimationFrame      || 
                                 window.msRequestAnimationFrame     || 
                                 function(callback, element) {
                                   window.setTimeout(callback, 1000 / 60);
                                 }
}

//=========================================================================
// GAME helpers
//=========================================================================

var Game = 
{

  run: function(options) 
  {

    Game.Load_images(options.images, function(images) {

    options.ready(images); // tell caller to initialize itself because images are loaded and we're ready to rumble
	
      var canvas = options.canvas,    // canvas Render target is provided by caller
          Update = options.Update,    // method to Update game logic is provided by caller
          Render = options.Render,    // method to Render the game is provided by caller
          step   = options.step,      // fixed frame step (1/fps) is specified by caller
          now    = null,
          last   = Util.Timestamp(),
          dt     = 0,
          gdt    = 0;

      function frame() 
	  {
        now = Util.Timestamp();
        dt  = Math.min(1, (now - last) / 1000); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
        gdt = gdt + dt;
        while (gdt > step) {
          gdt = gdt - step;
          Update(step);
        }
        World_render();
        last = now;
        requestAnimationFrame(frame, canvas);
      }
      frame(); // lets get this party started
    });
  },

  //---------------------------------------------------------------------------

  Load_images: function(names, callback) { // load multiple images and callback when ALL images have loaded
    var result = [];
    var count  = names.length;

    var onload = function() {
      if (--count == 0)
        callback(result);
    };

    for(var n = 0 ; n < names.length ; n++) {
      var name = names[n];
      result[n] = document.createElement('img');
      Dom_util.on(result[n], 'load', onload);
      result[n].src = "images/" + name + ".png";
    }
  },

  //---------------------------------------------------------------------------
	cancelTouch: function(evt) 
	{
		input_direction = Direction_X_AXIS.NONE;		

		Hud.arrow_left.style.opacity = "0.4";
		Hud.arrow_right.style.opacity = "0.4";
		is_inTouch = false;			
	},
	
	CheckDeciveTipe: function() 
	{
		var accel_X_abs = Math.abs(accel_X);
		var accel_Y_abs = Math.abs(accel_Y);
		var accel_Z_abs = Math.abs(accel_Z);

		if(accel_Y_abs > accel_X_abs && accel_Y_abs > accel_Z_abs)
		{
			is_apple_product = Game.Is_iPhone_or_iPad();
			decive_type_mod = 0.2;
			decive_type = (window.innerWidth < window.innerHeight) ? DECIVE.PHONE : DECIVE.TABLET;
		}
		else if(accel_X_abs > accel_Y_abs && accel_X_abs > accel_Z_abs)
		{
			is_apple_product = Game.Is_iPhone_or_iPad();
			decive_type_mod = 0.2;
			decive_type = (window.innerWidth < window.innerHeight) ? DECIVE.TABLET : DECIVE.PHONE;
		}
	},

	Add_keys_listener: function() 
	{
		Dom_util.on(document, 'keydown', 
			function(ev) 
			{ 
				if(ev.keyCode == KEY.CTRL && GAME_3_VERSION >= 1)
				{
					Player.PowerUp1_brake();
				}
				else if(ev.keyCode == KEY.SHIFT && GAME_3_VERSION >= 3)		
				{
					Player.PowerUp1_set_aside();
				}
				
				if(ev.keyCode == KEY.LEFT || ev.keyCode == KEY.A)		
				{
					key_left  = true;
					key_right = false;
				}
				
				if(ev.keyCode == KEY.RIGHT || ev.keyCode == KEY.D)		
				{
					key_right = true;
					key_left  = false;
				}					
			} 
		);
		Dom_util.on(document, 'keyup', 
			function(ev) 
			{ 
				if(ev.keyCode == KEY.LEFT || ev.keyCode == KEY.A)		
				{
					key_left  = false;
				}	
				else if(ev.keyCode == KEY.RIGHT || ev.keyCode == KEY.D)		
				{
					key_right  = false;
				}					
			} 
		);
	},

	Add_touchs_listener : function ()
	{
		Dom_util.on(powerUp1, 'touchstart', function(evt) 
		{ 
			Player.PowerUp1_brake();
		} );
		
		Dom_util.on(powerUp2, 'touchstart', function(evt) 
		{ 
			Player.PowerUp1_set_aside();
		} );
		
		Dom_util.on(canvas, 'touchstart', function(evt) 
		{ 
			var rect = canvas.getBoundingClientRect();

			var touches = evt.changedTouches;

			for (var i = 0; i < touches.length; i++) 
			{
				
				if(touches[i].pageX < (half_contex))
				{
					input_direction = Direction_X_AXIS.LEFT;
					Hud.arrow_left.style.opacity = "0.7";
				}
				else
				{
					input_direction = Direction_X_AXIS.RIGHT;
					Hud.arrow_right.style.opacity = "0.7";
				}
				
				is_inTouch = true;
			}
		} );
		
		Dom_util.on(canvas, 'mousedown', function(evt) 
		{ 
			var rect = canvas.getBoundingClientRect();
			var x = evt.clientX;


			if(x < (half_contex))
			{
				input_direction = Direction_X_AXIS.LEFT;
				Hud.arrow_left.style.opacity = "0.7";
			}
			else
			{
				input_direction = Direction_X_AXIS.RIGHT;
				Hud.arrow_right.style.opacity = "0.7";
			}
			
			is_inTouch = true;
		} );
		
		Dom_util.on(canvas, 'touchend', function(evt) {Game.cancelTouch(evt) ;}, false );
		
		Dom_util.on(canvas, 'touchleave', function(evt) {Game.cancelTouch(evt) ;}, false );
		
		Dom_util.on(canvas, 'touchcancel', function(evt) {Game.cancelTouch(evt) ;}, false );
		
		Dom_util.on(canvas, 'mouseout', function(evt) {Game.cancelTouch(evt) ;}, false );
		
		Dom_util.on(canvas, 'mouseup', function(evt) {Game.cancelTouch(evt) ;}, false );
		
	},

	Is_iPhone_or_iPad: function()
	{
		if (navigator && navigator.userAgent && navigator.userAgent != null) 
		{
			var strUserAgent = navigator.userAgent.toLowerCase();
			var arrMatches = strUserAgent.match(/(iphone|ipod|ipad)/);
			if (arrMatches != null) 
				 return true;
		}
	
		return false;
   	},

	Check_Version: function(keys) 
	{
		if(GAME_3_VERSION < 3)
		{
			Hud.powerUp2.style.display = "none";
			
			if(GAME_3_VERSION < 2)
			{
				Player.life--;
				
				var dir_img = 'url("images/vidas' + encodeURI(Player.life) + '.png")';
				Hud.life_hud.style.backgroundImage =  'url("images/vidas2.png")';
				
				if(GAME_3_VERSION < 1)
				{
					Hud.powerUp1.style.display = "none";
				}
			}
		}
	},	
	Add_orientation_listener : function ()
	{
		window.addEventListener('devicemotion', function(evt) 
		{ 	
			setTimeout(function(evt)
			{
				if(!is_inTouch)
				{
					accel_X = Math.round(evt.accelerationIncludingGravity.x * 10) / 10;
					accel_Y = Math.round(evt.accelerationIncludingGravity.y * 10) / 10;	
					accel_Z = Math.round(evt.accelerationIncludingGravity.z * 10) / 10;	
					
					if(decive_type == DECIVE.NO_DETECT)
					{
						Game.CheckDeciveTipe();
					}
					else
					{
						
						if(decive_type == DECIVE.PHONE)
						{
							current_accel_value = (window.innerWidth < window.innerHeight) ? accel_X : -accel_Y;
							gravity = (window.innerWidth < window.innerHeight) ? accel_Y : accel_X;
							
						}
						else if(decive_type == DECIVE.TABLET)
						{	
							current_accel_value = (window.innerWidth < window.innerHeight) ? accel_Y : accel_X;
							gravity = (window.innerWidth < window.innerHeight) ? accel_X : accel_Y;
						}
						
						accel_variation =  Math.abs(previous_accel_value - current_accel_value);
						
						if((!is_apple_product && gravity > 0) || (is_apple_product && gravity > 0))	
						{
							if(current_accel_value > - dead_zone && current_accel_value < dead_zone)//false y 0.7
							{
								input_direction = Direction_X_AXIS.NONE;		
	
							}
							else if(current_accel_value > dead_zone && accel_variation > dead_zone_variation && input_direction != Direction_X_AXIS.LEFT)
							{
								input_direction = Direction_X_AXIS.LEFT;
							}
							else if(current_accel_value < - dead_zone && accel_variation > dead_zone_variation  && input_direction != Direction_X_AXIS.RIGHT)
							{
								input_direction = Direction_X_AXIS.RIGHT;
							}
							else if(current_accel_value > dead_zone && input_direction == Direction_X_AXIS.LEFT)
							{
								input_direction = Direction_X_AXIS.LEFT;
							}
							else if(current_accel_value < - dead_zone && input_direction == Direction_X_AXIS.RIGHT)
							{
								input_direction = Direction_X_AXIS.RIGHT;
							}
							else
							{
								input_direction = Direction_X_AXIS.NONE;
							}
						}
						else if((!is_apple_product && gravity < 0) || (is_apple_product && gravity < 0))	
						{
							if(current_accel_value > - dead_zone && current_accel_value < dead_zone)
							{
								input_direction = Direction_X_AXIS.NONE;		
	
							}
							else if(current_accel_value > dead_zone && accel_variation > dead_zone_variation && input_direction != Direction_X_AXIS.RIGHT)
							{
								input_direction = Direction_X_AXIS.RIGHT;
							}
							else if(current_accel_value < - dead_zone && accel_variation > dead_zone_variation  && input_direction != Direction_X_AXIS.LEFT)
							{
								input_direction = Direction_X_AXIS.LEFT;
							}
							else if(current_accel_value > dead_zone && input_direction == Direction_X_AXIS.RIGHT)
							{
								input_direction = Direction_X_AXIS.RIGHT;
							}
							else if(current_accel_value < - dead_zone && input_direction == Direction_X_AXIS.LEFT)
							{
								input_direction = Direction_X_AXIS.LEFT;
							}
							else
							{
								input_direction = Direction_X_AXIS.NONE;
							}
						}					
					}
					
					previous_accel_value = current_accel_value;
				}
			 }, 100, evt);
		 } );
	}
}