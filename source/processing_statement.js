
function Statement_paint(statement) 
{	
	var processed_statement;
	var beging_statement_str = "Evita las palabras ";
	var beging_statement_end = beging_statement_str.length + 3;
	var beging_statement_start = statement.indexOf(beging_statement_str);

	var end_statement_str = " y recoge todas las que puedas ";
	var end_statement_start = statement.indexOf(end_statement_str);

	if(beging_statement_start >= 0 && end_statement_start >= 0)
	{
		var end_statement_end = end_statement_start + end_statement_str.length + 3;

		var wrong_words = statement.substring(beging_statement_end, end_statement_start);

		var correct_words = statement.substring(end_statement_end, statement.length);
		
		var two_types_1 = statement.indexOf(" o ");
		var two_types_2 = statement.lastIndexOf(" o ");
		
		if(statement.substring(beging_statement_end, end_statement_start) == statement.substring(end_statement_end, statement.length))
		{
			beging_statement_end -= 3;
			wrong_words = statement.substring(beging_statement_end, end_statement_start);
			
			end_statement_end -= 3;
			correct_words = statement.substring(end_statement_end, statement.length)
		}

		if(two_types_1 >= 0 && (two_types_1 > beging_statement_end) && (two_types_1 < (beging_statement_end + wrong_words.length)) && two_types_2 >= 0 && (two_types_2 > end_statement_end) && (two_types_2 < statement.length))
		{		
			processed_statement = statement.substring(0, beging_statement_end) + "<div style='color:#e82e2e; display: inline;'>" +
								  statement.substring(beging_statement_end, two_types_1) + "</div>" + " o " +
								  "<div style='color:#e82e2e; display: inline;'>" + statement.substring(two_types_1 + 2, end_statement_start) + "</div>" +
								  statement.substring(end_statement_start, end_statement_end) + "<div style='color:#73d83e; display: inline;'>" +
								  statement.substring(end_statement_end, two_types_2) + "</div>" + " o " + "<div style='color:#73d83e; display: inline;'>" +
								  statement.substring(two_types_2 + 2, statement.length)+ "</div>";
		}
		else
		{
			processed_statement = statement.substring(0, beging_statement_end) + "<div style='color:#e82e2e; display: inline;'>" +
								  wrong_words + "</div>" + statement.substring(end_statement_start, end_statement_end) + 
								  "<div style='color:#73d83e; display: inline;'>" + correct_words + "</div>";
		}

		Hud.words_txt.innerHTML = processed_statement;
	}
	else
	{
		Hud.words_txt.innerHTML = statement;
	}

}
