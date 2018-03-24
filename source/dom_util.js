
var Dom_util = 
{

  get:  function(id)                     { return ((id instanceof HTMLElement) || (id === document)) ? id : document.getElementById(id); },
  set:  function(id, html)               { Dom_util.get(id).innerHTML = html;                        },
  on:   function(ele, type, fn, capture) { Dom_util.get(ele).addEventListener(type, fn, capture);    },
  un:   function(ele, type, fn, capture) { Dom_util.get(ele).removeEventListener(type, fn, capture); },
  show: function(ele, type)              { Dom_util.get(ele).style.display = (type || 'block');      },
  blur: function(ev)                     { ev.target.blur();                                    },

  Add_class_name:    function(ele, name)     { Dom_util.Toggle_class_name(ele, name, true);  },
  Remove_class_name: function(ele, name)     { Dom_util.Toggle_class_name(ele, name, false); },
  Toggle_class_name: function(ele, name, on) 
  {
    ele = Dom_util.get(ele);
    var classes = ele.className.split(' ');
    var n = classes.indexOf(name);
    on = (typeof on == 'undefined') ? (n < 0) : on;
    if (on && (n < 0))
      classes.push(name);
    else if (!on && (n >= 0))
      classes.splice(n, 1);
    ele.className = classes.join(' ');
  }
}