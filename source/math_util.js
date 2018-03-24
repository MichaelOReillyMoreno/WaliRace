//=========================================================================
// general purpose helpers (mostly math)
//=========================================================================

var Util = 
{

  Timestamp:        function()                  { return new Date().getTime();                                    },
  ToInt:            function(obj, def)          { if (obj !== null) { var x = parseInt(obj, 10); if (!isNaN(x)) return x; } return Util.ToInt(def, 0);    },
  ToFloat:          function(obj, def)          { if (obj !== null) { var x = parseFloat(obj);   if (!isNaN(x)) return x; } return Util.ToFloat(def, 0.0); },
  Limit:            function(value, min, max)   { return Math.max(min, Math.min(value, max));                     },
  Random_int:       function(min, max)          { return Math.round(Util.Interpolate(min, max, Math.random()));   },
  Random_float:     function(min, max)          { return Util.Interpolate(min, max, Math.random());               },
  Random_choice:    function(options)           { return options[Util.Random_int(0, options.length-1)];           },
  Random_choice_between: function(options, min, max) { return options[Util.Random_int(min, max)];                 },
  Percent_remaining:function(n, total)          { return (n%total)/total;                                         },
  Accelerate:       function(v, accel, dt)      { return v + (accel * dt);                                        },
  Interpolate:      function(a,b,percent)       { return a + (b-a)*percent                                        },
  Ease_in:          function(a,b,percent)       { return a + (b-a)*Math.pow(percent,2);                           },
  Ease_out:         function(a,b,percent)       { return a + (b-a)*(1-Math.pow(1-percent,2));                     },
  Ease_inOut:       function(a,b,percent)       { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);        },
  Exponential_fog:  function(distance, density) { return 1 / (Math.pow(Math.E, (distance * distance * density))); },

  Increase:  function(start, increment, max) { // with looping
    var result = start + increment;
    while (result >= max)
      result -= max;
    while (result < 0)
      result += max;
    return result;
  },

  Project: function(p, camera_X, camera_Y, camera_Z, camera_depth, width, height, road_width) {
    p.camera.x     = (p.world.x || 0) - camera_X;
    p.camera.y     = (p.world.y || 0) - camera_Y;
    p.camera.z     = (p.world.z || 0) - camera_Z;
    p.screen.scale = camera_depth/p.camera.z;
    p.screen.x     = Math.round((width/2)  + (p.screen.scale * p.camera.x  * width/2));
    p.screen.y     = Math.round((height/2) - (p.screen.scale * p.camera.y  * height/2));
    p.screen.w     = Math.round(             (p.screen.scale * road_width   * width/2));
  },

  Overlap: function(x1, w1, x2, w2, percent) 
  {
    var half = (percent || 1)/2;
    var min1 = x1 - (w1*half);
    var max1 = x1 + (w1*half);
    var min2 = x2 - (w2*half);
    var max2 = x2 + (w2*half);
    return ! ((max1 < min2) || (min1 > max2));
  },

  Lerp: function(v0, v1, t) 
  {
	return Math.floor((1 - t) * v0 + t * v1);
  },

  Lerp_color: function(initial_color, final_color, t)
  {
  		return "rgb(" + Util.Lerp(initial_color[0], final_color[0], t) + ", " + Util.Lerp(initial_color[1], final_color[1], t) +
				 ", " + Util.Lerp(initial_color[2], final_color[2], t) + ")";
  }
}