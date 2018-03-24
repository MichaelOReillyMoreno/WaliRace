	//=========================================================================
	// canvas Rendering helpers
	//=========================================================================

var Render = 
{

	polygon: function(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) 
	{
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineTo(x3, y3);
		ctx.lineTo(x4, y4);
		ctx.closePath();
		ctx.fill();
	},

	//---------------------------------------------------------------------------

	segment: function(ctx, width, lanes, x1, y1, w1, x2, y2, w2, fog, color) 
	{
		var r1 = Render.rumbleWidth(w1, lanes),
			r2 = Render.rumbleWidth(w2, lanes),
			l1 = Render.laneMarkerWidth(w1, lanes),
			l2 = Render.laneMarkerWidth(w2, lanes),
			lanew1, lanew2, lanex1, lanex2, lane;

		ctx.fillStyle = color.grass;
		ctx.fillRect(0, y2, width, y1 - y2);

		Render.polygon(ctx, x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2, color.rumble);
		Render.polygon(ctx, x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2, color.rumble);
		Render.polygon(ctx, x1-w1,    y1, x1+w1, y1, x2+w2, y2, x2-w2,    y2, color.road);

		if (color.lane) 
		{
			lanew1 = w1*2/lanes;
			lanew2 = w2*2/lanes;
			lanex1 = x1 - w1 + lanew1;
			lanex2 = x2 - w2 + lanew2;
			
			for(lane = 1 ; lane < lanes ; lanex1 += lanew1, lanex2 += lanew2, lane++)
				Render.polygon(ctx, lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, color.lane);
		}

		Render.fog(ctx, 0, y1, width, y2-y1, fog);
	},

  //---------------------------------------------------------------------------

	background: function(ctx, background, width, height, layer, rotation, offset, position) 
	{
		rotation = rotation || 0;
		offset   = offset   || 0;

		var imageW = layer.w ;
		var imageH = layer.h * 2;

		var sourceX = layer.x + Math.floor(layer.w * rotation);
		var sourceY = layer.y
		var sourceW = Math.min(imageW, layer.x+layer.w-sourceX);
		var sourceH = imageH;

		var destX = 0;
		var destY = offset + position;
		var destW = Math.floor(width * (sourceW/imageW));
		var destH = height;

		ctx.drawImage(background, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH);

		if (sourceW < imageW)
			ctx.drawImage(background, layer.x, sourceY, imageW-sourceW, sourceH, destW-1, destY, width-destW, destH);
	},

  //---------------------------------------------------------------------------

	sprite: function(ctx, width, height, resolution, road_width, sprites, sprite, scale, destX, destY, offsetX, offsetY, clipY, current_frame) 
	{
		//  scale for Projection AND relative to road_width (for tweakUI)
		var destW  = (sprite.w * scale * width/2) * (SPRITES.SCALE * road_width);
		var destH  = (sprite.h * scale * width/2) * (SPRITES.SCALE * road_width);

		destX = destX + (destW * (offsetX || 0));
		destY = destY + (destH * (offsetY || 0));

		var clipH = clipY ? Math.max(0, destY+destH-clipY) : 0;

		if (clipH < destH)
		  ctx.drawImage(sprites, sprite.x + (current_frame * sprite.w), sprite.y, sprite.w, sprite.h - (sprite.h * clipH/destH), destX, destY, destW, destH - clipH);
	},

	//---------------------------------------------------------------------------

	player: function(ctx, width, height, resolution, road_width, sprites, speed_percent, scale, destX, destY, updown) 
	{

		var bounce = (1.5 * Math.random() * speed_percent * resolution) * Util.Random_choice([-1,1]);

		Render.sprite(ctx, width, height, resolution, road_width, sprites, SPRITES.PLAYER_STRAIGHT, scale, destX, destY + bounce, -0.5, -1, null, current_frame);

		if(sparkes_direction != SPARKS.NONE)
		{
			if(sparkes_direction == SPARKS.LEFT)
			{
				Render.sprite(ctx, width, height, resolution, road_width, sprites, SPRITES.SPARKSLEFT, scale, destX * 0.745, destY + bounce, -0.5, -1, null, current_frame_sparks);
			}
			else if(sparkes_direction == SPARKS.RIGHT)
			{
				Render.sprite(ctx, width, height, resolution, road_width, sprites, SPRITES.SPARKSRIGHT,scale, destX * 1.267, destY + bounce, -0.5, -1, null, current_frame_sparks);
			}
			else if(sparkes_direction == SPARKS.BOTH)
			{
				Render.sprite(ctx, width, height, resolution, road_width, sprites, SPRITES.SPARKSLEFT, scale, destX * 0.745, destY + bounce, -0.5, -1, null, current_frame_sparks);
				Render.sprite(ctx, width, height, resolution, road_width, sprites, SPRITES.SPARKSRIGHT,scale, destX * 1.267, destY + bounce, -0.5, -1, null, current_frame_sparks);
			}
		}		
 },
  
  //---------------------------------------------------------------------------
  
   word: function(txt, x, y, scale, clip, color) 
   {
		var font_size = scale * fontMultiplier;

		ctx.font = font_size + "px Francois One";
		ctx.fillStyle = color;

		ctx.save();
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, clip);
		ctx.clip();
		

		
		ctx.fillStyle = color;
		ctx.fillText(txt, x, y);
		
		ctx.fillStyle = "#828282";
		ctx.lineWidth = 5000 * scale;
		ctx.strokeText(txt, x, y);
		
		ctx.restore();
   },

  //---------------------------------------------------------------------------

	fog: function(ctx, x, y, width, height, fog) 
	{
		if (fog < 1) 
		{
			ctx.globalAlpha = (1-fog)
			ctx.fillStyle = COLORS.FOG;
			ctx.fillRect(x, y, width, height);
			ctx.globalAlpha = 1;
		}
	},

	rumbleWidth:     function(Projectedroad_width, lanes) { return Projectedroad_width/Math.max(6,  2*lanes); },
	laneMarkerWidth: function(Projectedroad_width, lanes) { return Projectedroad_width/Math.max(32, 8*lanes); }
}