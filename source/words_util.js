//=========================================================================
// words funtions
//=========================================================================

var palabras_Ok_legth = 0;
var palabras_err_legth = 0;

var fontMultiplier = 250000;

var anim_word_frame_duration = 3;

var Increase_in_Y = 0;

var max_speed_to_interpolate = 6500;

//en moviles tiene q ir mas rapido la animacion
var decive_type_mod= 1;

var next_type_of_word = false;
var prev_type_of_word = false;
var count_same_type_word = 1;

function Get_word(num_segment) 
{
	if(GAME_3_ONLINE_DATA && (num_segment > 120) && (Math.random() * 100 < WORDS_PROBABILITY) && (num_segment % 20 == 0))
	{
		next_type_of_word = (Math.random() * 100 < 50) ? true : false;
		
		if(prev_type_of_word == next_type_of_word)
		{
			if(count_same_type_word >= 3)
			{
				count_same_type_word = 1;
				next_type_of_word = !next_type_of_word;
			}
			
			count_same_type_word++;
		}
		else
		{
			count_same_type_word = 1;
		}
		
		prev_type_of_word = next_type_of_word;
		
		return Create_word(next_type_of_word);
	}
	return null;
}

function Create_word(type) 
{
	var _content = (type) ?  Get_Ok_word()  : Get_wrong_word();
	var _num_leters = _content.length;
	
	var word =
	{
		is_correct: type,
		content: _content, 
		offset : Math.random() * Util.Random_choice([-0.6, 0.6]),
		num_leters : _num_leters,
		color : "rgb(254, 254, 254)",
		pos_Y : 6,
		disable : false,
		life_time : 0
	}
	
	return word;
}

function Spawn_rand_word(type)
{
	var word_spawn_segment = Player.segment.index;
	
	while(word_spawn_segment >= Player.segment.index || segments[word_spawn_segment].word != null)
	{
		word_spawn_segment = Math.floor(Math.random() * segments.length);
	}
	
	segments[word_spawn_segment].word = Create_word(type);
}

function Get_Ok_word() 
{	
	var n = Math.floor(Math.random() * palabras_Ok_legth);
	return GAME_3_ONLINE_DATA.palabrasOk[n];
}

function Get_wrong_word() 
{	
	var n = Math.floor(Math.random() * palabras_err_legth);
	return GAME_3_ONLINE_DATA.palabrasErr[n];
}

function Get_words() 
{
	// Online data load  
	var word_data_temp = null;
	$.ajaxSetup({
		async: false
	})
	$.get(GAME_3_URL_SOURCE + "/PATH.../", function (data) 
	{
		word_data_temp = JSON.parse(data);
	});
	GAME_3_ONLINE_DATA = word_data_temp;
	
	if (GAME_3_ONLINE_DATA != null)
	{
		palabras_Ok_legth = GAME_3_ONLINE_DATA.palabrasOk.length;
		palabras_err_legth = GAME_3_ONLINE_DATA.palabrasErr.length;

		Statement_paint(GAME_3_ONLINE_DATA.enunciado);
		return true;
	}
	
	return false;
}


function Save_result(points) {
    // Online data load  
    var word_data_temp = null;
    $.ajaxSetup({
        async: false
    })
    var sent = false;
    $.post(GAME_3_URL_SOURCE + "/PATH.../", function (data) {
        sent = true;
    });       

    return sent;
}

function Animation_word(word, segment, dt) 
{	
	var animation = null;
	word.disable = true;

	Increase_in_Y = 0.0001 * def_speed;
	
	var color = (word.is_correct) ? correct_color : wrong_color;
	
	var anim_word_duration = Math.floor(15000 *  (1.5 - speed_percent) * dt);

	if(def_speed < max_speed_to_interpolate)
	{	
		var color_change_duration = (anim_word_duration * 0.4)  * decive_type_mod;
		animation = setInterval(function(){Animation_word_color_interp(word, color, color_change_duration) }, anim_word_frame_duration);
	}
	else
	{

		animation = setInterval(function(){Animation_word_noColor_interp(word, color) }, anim_word_frame_duration);
	}

	setTimeout(function() { clearInterval(animation); segment.word = null; Spawn_rand_word(word.is_correct);}, anim_word_duration);
}

function Animation_word_color_interp(word, final_color, color_change_duration) 
{
	word.life_time += anim_word_frame_duration;
	var word_percent = word.life_time / color_change_duration;
	
	word.color = Util.Lerp_color(initial_color, final_color, word_percent);

	word.pos_Y += Increase_in_Y;
}

function Animation_word_noColor_interp(word, final_color) 
{	
	word.color = "rgb(" + final_color[0] + ", " + final_color[1] + ", " + final_color[2] + ")";
	word.pos_Y += Increase_in_Y;
}