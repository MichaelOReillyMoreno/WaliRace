//=========================================================================
// HUD funtions
//=========================================================================
var Hud = new function() 
{
	this.end_txt        = document.getElementById('end');          // our end message div
	this.points_txt     = document.getElementById('points');       // our points message div
	this.words_txt      = document.getElementById('words');        // our words message div
	this.walinwos_div   = document.getElementById('walinwas');     // our walinwas div
	this.walinwos_txt   = document.getElementById('walinwasTxt');  // our walinwas message div
	this.walinwas_img   = document.getElementById('walinwaImg');   // our img walinwa div
	this.arrow_right    = document.getElementById('arrowRight'); 
	this.arrow_left     = document.getElementById('arrowLeft'); 
	this.loading        = document.getElementById('loader'); 
	this.loader_screen  = document.getElementById('loaderScreen'); 
	this.life_hud       = document.getElementById('lifeHud'); 
	this.powerUp1       = document.getElementById('powerUp1'); 
	this.powerUp2       = document.getElementById('powerUp2'); 
	this.body           = document.getElementById('body'); 
	this.tips           = document.getElementById('tips'); 
	this.buttonEnd = null;

	var points_text_norm_size;
	var points_text_max_size;
	var points_text_min_size;

	var walinwos_text_norm_size;
	var walinwos_text_max_size;

	var points_duration_anim;
	var points_current_life_anim;

	var walinwos_duration_anim;
	var walinwos_current_life_anim;

	var frame_duration = 20;

	var is_resizing = false;

	var points_is_in_animation = false;
	var walinwos_is_in_animation = false;

	var hud_height;
	var hud_width;
	
	var tip_visible = false;
	var tips_texts = ["¡Cuidado con las gladiadoras, te perseguirán hasta fuera de la pista!",
	 			      "¡Los gladiadores son muy rápidos, cuidado cuando se acerquen!", 
				      "Recuerda: también puedes mover tu carro girando la <i>tablet.</i>",
	 		          "¡Coge las palabras correctas para ganar más walinwos!",
	 		          "Recuerda: si te sales fuera de la pista demasiado frenarás y perderás una vida."];
	
	this.Resize = function() 
	{
		is_resizing = true;

		canvas.style.height = canvas.scrollWidth / aspect_ratio + "px";

		hud_height = canvas.scrollHeight; 
		hud_width = canvas.scrollWidth;
		
		if((window.innerHeight - canvas.scrollHeight) > 10)
		{
			canvas.style.marginTop = (window.innerHeight - canvas.scrollHeight) / 2 + "px"; 
		}
		else
		{
			canvas.style.marginTop = "0px";
		}
		
		bounding_client_left = canvas.getBoundingClientRect().left;
		bounding_client_top  = (canvas.getBoundingClientRect().top > 0) ? canvas.getBoundingClientRect().top : 0;

		points_text_norm_size      = (hud_height / 15);
		points_text_max_size       =  points_text_norm_size * 1.15;
		points_text_min_size       =  points_text_norm_size * 0.9;

		walinwos_text_norm_size    = (hud_height / 25);
		walinwos_text_max_size     =  walinwos_text_norm_size * 1.25;

		this.points_txt.style.marginLeft    = (hud_width / 40)         + "px";
		this.points_txt.style.marginTop     =  bounding_client_top     + (hud_height / 40) + "px";
		this.points_txt.style.fontSize      =  points_text_norm_size    + "px";
		
		this.words_txt.style.lineHeight     = (hud_height / 18)        + "px";
		this.words_txt.style.marginLeft     =  (hud_width / 7)         + "px";
		this.words_txt.style.marginTop      =  bounding_client_top     + (hud_height / 32) + "px";
		this.words_txt.style.fontSize       = (hud_height / 18)        + "px";
		this.words_txt.style.maxWidth       = (hud_width / 1.5)        + "px";
		
		this.walinwos_div.style.marginRight = (hud_width / 50)         + "px";
		this.walinwos_div.style.width       = (hud_width / 10)         + "px";
		this.walinwos_div.style.marginTop   =  bounding_client_top     + (hud_height / 40) + "px";
		this.walinwos_div.style.fontSize    =  walinwos_text_norm_size + "px";
		this.walinwas_img.style.width       = (hud_width / 40)         + "px";      

		this.arrow_right.style.width        = (hud_width / 12)         + "px";     
		this.arrow_left.style.width         = (hud_width / 12)         + "px";    
		this.arrow_left.style.marginTop     =  bounding_client_top     + (hud_height / 2.2) + "px"; 
		this.arrow_right.style.marginTop    =  bounding_client_top     + (hud_height / 2.2) + "px";    
		 
		this.arrow_left.style.padding       = (hud_height / 30)        + "px"; 
		this.arrow_right.style.padding      = (hud_height / 30)        + "px";  
			
		this.life_hud.style.width           = (hud_width / 13)         + "px";   
		this.life_hud.style.height          = (hud_width / 13)         + "px";   
		this.life_hud.style.marginLeft      = (hud_width / 50)         + "px";
		this.life_hud.style.marginTop       =  bounding_client_top     + (hud_height / 5) + "px";
		
		this.powerUp1.style.width           = (hud_width / 11)         + "px";   
		this.powerUp1.style.height          = (hud_width / 11)         + "px";   
		this.powerUp1.style.marginLeft      = (hud_width / 8)          + "px";
		this.powerUp1.style.marginTop       =  bounding_client_top     + (hud_height / 1.26) + "px";
		
		this.powerUp2.style.width           = (hud_width / 11)         + "px";   
		this.powerUp2.style.height          = (hud_width / 11)         + "px";   
		this.powerUp2.style.marginRight     = (hud_width / 8)          + "px";
		this.powerUp2.style.marginTop       =  bounding_client_top     + (hud_height / 1.26) + "px";
		
		if(game_is_end && this.buttonEnd) 
		{
			this.Resize_dead_hud();
		}	
		else if(is_loading)
		{
			this.Resize_load_hud();
		}
		
		half_contex = (hud_width / 2) + canvas.getBoundingClientRect().left;

		is_resizing = false;
	}

	this.Resize_load_hud = function() 
	{
		if((window.innerHeight - hud_height) < 0)
		{
			this.loader_screen.style.height = hud_height;
		}
		  
		this.loading.style.marginTop = (window.innerHeight / 2.7)   + "px";

		var border_width = 0;

		if(window.innerWidth > window.innerHeight)
		{
			border_width = Math.floor((window.innerWidth / 60));

			this.loading.style.width          = Math.floor((window.innerWidth / 10)) + "px";     
			this.loading.style.height         = Math.floor((window.innerWidth / 10)) + "px"; 
			this.loading.style.border         = border_width + "px solid #f3f3f3";     
			this.loading.style.borderTop      = border_width + "px solid #3498db"; 
		}
		else
		{
			border_width = Math.floor((window.innerHeight / 60));

			this.loading.style.width          = Math.floor((window.innerHeight / 10)) + "px";     
			this.loading.style.height         = Math.floor((window.innerHeight / 10)) + "px"; 
			this.loading.style.border         = border_width + "px solid #f3f3f3";     
			this.loading.style.borderTop      = border_width + "px solid #3498db"; 
		}

		this.loading.style.marginLeft     = ((window.innerWidth - (parseInt(this.loading.style.width, 10) + (border_width * 2))) / 2) + "px";   

		this.tips.style.marginBottom      = (window.innerHeight / 17)   + "px";


		if(!tip_visible)
		{
			this.tips.innerHTML = Util.Random_choice(tips_texts);
			tip_visible = true;
		}
	}

	this.Resize_dead_hud = function() 
	{
		this.end_txt.style.width          = (hud_width / 2.4) + "px"; 
		this.end_txt.style.marginTop      = bounding_client_top + (hud_height / 5) + "px";
		this.end_txt.style.fontSize       = (hud_height / 15)  + "px";
		this.end_txt.style.padding        = (hud_height / 7)   + "px";
		this.end_txt.style.paddingTop     = (hud_height / 8)  + "px";
		
		this.buttonEnd.style.fontSize     = (hud_height / 25)  + "px";
		this.buttonEnd.style.padding      = (hud_height / 35)  + "px";
		this.buttonEnd.style.margin       = (hud_height / 35)  + "px";
		
		this.buttonEnd.style.marginBottom = (hud_height / 17)  + "px";
		
		this.buttonEnd.style.boxShadow    = (hud_height / 120) + "px " + (hud_height / 120) + "px " + (hud_height / 120) 
		+ "px rgba(124,84,62,1)," + (hud_height / 60) + "px "  + (hud_height / 60) + "px " + (hud_height / 60) + "px rgba(0,0,0,.5)";

		var margin_left = (hud_width - ((parseInt(this.end_txt.style.paddingLeft, 10) * 2) + parseInt(this.end_txt.style.width, 10))) / 2;

		this.end_txt.style.marginLeft     = margin_left + "px";
	}
	
	this.Hide_hud = function() 
	{
		this.words_txt.style.display    = "none";
		this.walinwos_div.style.display = "none";
		this.points_txt.style.display   = "none";
		this.powerUp1.style.display     = "none";
		this.powerUp2.style.display     = "none";
		this.life_hud.style.display     = "none";
	}
	
	this.Hide_loading = function() 
	{
		this.loading.style.display = "none";
		this.loader_screen.style.display = "none";
	}
	
	this.Start_loading = function() 
	{
		this.loader_screen.style.zIndex = "19";//coloco el fondo detras de el simbolo de cargando
	}

	this.Animation_points = function(dutation, is_positive) 
	{
		if(!is_resizing && !points_is_in_animation)//que una animacion no bloqueee la otra
		{	
			points_is_in_animation = true;
			points_duration_anim = (dutation/ 2) * decive_type_mod;
			points_current_life_anim = 0;

			var final_color  = (is_positive) ? correct_color_hud : wrong_color_hud;
			var points_text_anim_size   = (is_positive) ? points_text_max_size : points_text_min_size;

			var animation = setInterval(function()
							{
								var points_font_size = parseInt(Hud.points_txt.style.fontSize, 10);

								if((is_positive && (points_font_size < points_text_max_size)) || (!is_positive && (points_font_size > points_text_min_size)))
								{
									Interpolation_txt_points(points_text_norm_size, points_text_anim_size, initial_color, final_color);
								}										
								else
								{
									clearInterval(animation); 
									points_current_life_anim = 0;


									animation = setInterval(function()
									{
										var points_font_size = parseInt(Hud.points_txt.style.fontSize, 10);

										if((is_positive && (points_font_size > points_text_norm_size)) || (!is_positive && (points_font_size < points_text_norm_size)))
										{
											Interpolation_txt_points(points_text_anim_size, points_text_norm_size, final_color, initial_color);
										}
										else
										{
											points_is_in_animation = false;
											clearInterval(animation); 
										}
									}, frame_duration);
								}
							}, frame_duration);
		}
	}

	this.Animation_walinwos = function(dutation) 
	{
		if(!is_resizing && !walinwos_is_in_animation)//que una animacion no bloqueee la otra
		{	
			walinwos_is_in_animation = true;
			walinwos_duration_anim = (dutation/ 2)  * decive_type_mod;
			walinwos_current_life_anim = 0;

			var animation = setInterval(function()
				{
					var walinwos_font_size = parseInt(Hud.walinwos_div.style.fontSize, 10);

					if(walinwos_font_size < walinwos_text_max_size)
					{
						Interpolation_txt_walinwos(walinwos_text_norm_size, walinwos_text_max_size);
					}										
					else
					{
						clearInterval(animation); 
						walinwos_current_life_anim = 0;


						animation = setInterval(function()
						{
							var walinwos_font_size = parseInt(Hud.walinwos_div.style.fontSize, 10);

							if(walinwos_font_size > walinwos_text_norm_size)
							{
								Interpolation_txt_walinwos(walinwos_text_max_size, walinwos_text_norm_size);
							}
							else
							{
								walinwos_is_in_animation = false;
								clearInterval(animation); 
							}
						}, frame_duration);
					}
				}, frame_duration);
		}
	}


	function Interpolation_txt_points (initial_size, final_size,initial_color, final_color) 
	{	
		points_current_life_anim += frame_duration;
		var t = points_current_life_anim / points_duration_anim;

		Hud.points_txt.style.fontSize = Util.Lerp(initial_size, final_size, t) + "px";
		Hud.points_txt.style.color = Util.Lerp_color(initial_color, final_color, t);

	}

		function Interpolation_txt_walinwos (initial_size, final_size) 
	{	
		walinwos_current_life_anim += frame_duration;
		var t = walinwos_current_life_anim / walinwos_duration_anim;

		Hud.walinwos_div.style.fontSize = Util.Lerp(initial_size, final_size, t) + "px";

	}
}