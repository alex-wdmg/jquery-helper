/* Helper.js v1.3.0 */

(function($) {
    $.fn.preLoadImages = function(cb) {
        var urls = [], promises = [], $imgs = $(this).find('img');
        $imgs.each(function(){
            var promise = $.Deferred();
            var img = new Image();
            img.onload = function(){
                promise.resolve(img.src);
            };
            img.src = $(this).attr('src');
            promises.push(promise);
        });
        $.when.apply(null, promises).done(cb);
    }
})(jQuery);

String.prototype.trim = String.prototype.trim || function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
};

jQuery.fn.swap = function(b) {
    b = jQuery(b)[0];
    var a = this[0],
        a2 = a.cloneNode(true),
        stack = this;

    stack[0] = a2;
    return this.pushStack( stack );
};

jQuery.fn.viewport = function() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return {
		width: e[a+'Width'],
		height: e[a+'Height']
	};
}

jQuery.fn.getStyle = function(elem, prop, debug) {
	var value = jQuery(elem).css(prop);
	var debug = (debug) ? true : false;
	
	if(debug)
		console.log(prop+': '+value);
	
    return this.css(prop, value);
};

jQuery.fn.isEmpty = function() {
    return !jQuery.trim(this.html());
};

jQuery.fn.size = function() {
    var length = jQuery(this).length;
	if (length)
    	return length;
	else
		return 0;
};

(function() {
	this.leadZero = function (number, period, debug) {
		var number = number || 0,
			period = period || 10,
			debug = debug || false,
			result;
		
		result = (parseInt(number) < parseInt(period) ? '0' : '') + number;
		
		if(debug)
			console.log('leadZero: '+result);
		
		return result;
	};
})();

(function() {
	this.uniqID = function (prefix, entropy, numeric, debug) {
		var prefix = prefix || '',
			entropy = entropy || false,
			numeric = numeric || false,
			debug = debug || false,
			result;

		this.seed = function (s, w) {
			s = parseInt(s, 10).toString(16);
			return w < s.length ? s.slice(s.length - w) : 
			(w > s.length) ? new Array(1 + (w - s.length)).join('0') + s : s;
		};
		
		if(numeric)
			result = prefix + (String.fromCharCode(Math.floor(Math.random() * 11)) + Math.floor(Math.random() * 1000000)).trim();
		else
			result = prefix + (this.seed(parseInt((new Date().getTime() / 1000), 10), 8) + this.seed(Math.floor(Math.random() * 0x75bcd15) + 1, 5)).trim();
		
		if (entropy)
			result += (Math.random() * 10).toFixed(8).toString();

		if(debug)
			console.log('uniqID: '+result);
		
		return result;
	};
})();

(function($) {
	$.fn.horizontalScroll = function (amount, mixin) {
		mixin = mixin || false;
		amount = amount || 120;
		$(this).bind("DOMMouseScroll mousewheel", function (event) {
			var oEvent = event.originalEvent, 
				direction = oEvent.detail ? oEvent.detail * -amount : oEvent.wheelDelta, 
				position = $(this).scrollLeft();
			position += direction > 0 ? -amount : amount;
			$(this).scrollLeft(position);

			if(mixin && position == ($(this).scrollLeft() + amount))
				return;
			else if(mixin && position == -(amount))
				return;
			else
				event.preventDefault();
		});
	}
})(jQuery);

jQuery.fn.outerHtml = function() {
    return jQuery('<div />').append(jQuery(this).clone()).html();
};

jQuery.fn.readingTime = function(amount, debug) {
    var post = this[0],
		amount = jQuery(amount)[0] || 120,
		debug = (debug) ? true : false,
		estimated_time;
		
		var words = jQuery(post).text().toString().replace(/\r\n?|\n/g, ' ').replace(/ {2,}/g, ' ').replace(/^ /, '').replace(/ $/, '').split(' ').length;
		var minutes = Math.floor(words / amount);
		var seconds = Math.floor(words % amount / (amount / 60));

		if (1 <= minutes)
			estimated_time = minutes + ' minute' + (minutes == 1 ? '' : 's') + ', ' + seconds + ' second' + (seconds == 1 ? '' : 's');
		else
			estimated_time = minutes + ' second' + (minutes == 1 ? '' : 's');
		
		if(debug)
			console.log('readingTime() words: ' + words + ', reading by' + estimated_time);

		return estimated_time;
};

var declOfNum = (function() {
	// https://gist.github.com/realmyst/1262561
    var cases = [2, 0, 1, 1, 1, 2];
    var declOfNumSubFunction = function(titles, number) {
        number = Math.abs(number);
        return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    }
    return function(_titles) {
        if (arguments.length === 1) {
            return function(_number) {
                return declOfNumSubFunction(_titles, _number)
            }
        } else {
            return declOfNumSubFunction.apply(null, arguments)
        }
    }
})();

jQuery.fn.autoCurrying = function(number, titles, onlyends, debug) {
	var $elem = jQuery(this),
		_number = (number) ? number : false,
		_titles = (titles) ? titles : false,
		onlyends = (onlyends) ? true : false,
		debug = (debug) ? true : false;
	
	if(debug)
		console.log(_number +' '+  declOfNum(_titles, _number));
	
	if(onlyends)
    	return $elem.text(declOfNum(_titles, _number));
	else
    	return $elem.text(_number +' '+  declOfNum(_titles, _number));
	
};


jQuery.fn.cloneItems = function(selector, num, debug) {
	var $elem = jQuery(this),
		num = (num) ? num : 2,
		debug = (debug) ? true : false;

		$elem.find(selector).each(function () {
			var $item = $(this);
			for (var i = 1; i < num; i++) {
				$item.after($(this).clone());
			}
		});
	
		if(debug)
			console.log($elem);
	
		return $elem;
};


jQuery.fn.splitClone = function(selector, num, debug) {
	var $elem = jQuery(this),
		num = (num) ? num : 2,
		debug = (debug) ? true : false;

		$elem.find(selector).each(function () {
			var $item = $(this);
			for (var i = 1; i < num; i++) {
				$item = $item.next();
				if (!$item.length) {
					$item = $(this).siblings(':first');
				}
				$item.children(':first-child').clone().appendTo($(this));
			}
		});
	
		if(debug)
			console.log($elem);
	
		return $elem;
};


jQuery.fn.detectCollisions = function(selector, debug) {
	var $elem = jQuery(this),
    	$target = jQuery(selector),
		debug = (debug) ? true : false;
	
	var c = {
		offsetX1: $elem.offset().left,
		offsetY1: $elem.offset().top,
		height1: $elem.outerHeight(true),
		width1: $elem.outerWidth(true),
		boundingBoxY1: $elem.offset().top + $elem.outerHeight(true),
		boundingBoxX1: $elem.offset().left + $elem.outerWidth(true),
		offsetX2: $target.offset().left + 1,
		offsetY2: $target.offset().top + 1,
		height2: $target.outerHeight(true),
		width2: $target.outerWidth(true),
		boundingBoxY2: $target.offset().top + 1 + $target.outerHeight(true),
		boundingBoxX2: $target.offset().left + 1 + $target.outerWidth(true)
	};

	if(debug)
		console.log(c);

	if (c.boundingBoxY1 < c.offsetY2 || c.offsetX1 > c.boundingBoxY2 || c.boundingBoxX1 < c.offsetX2 || c.offsetX1 > c.boundingBoxX2)
		return false;
	else
		return true;
};

jQuery.fn.splitByWidth = function(selector, destination, offset, outer, debug) {

	var summaryWidth = 0,
		container = $(this),
		$destination = (destination) ? $(destination) : false,
		offset = (offset) ? offset : 0,
		outer = (outer) ? true : false,
		debug = (debug) ? true : false,
		countainerWidth = (outer) ? $(container).outerWidth(true) : $(container).width(),
		debug = (debug) ? true : false;

	if(offset)
		summaryWidth = offset;

	if(debug && outer)
		console.log('Countainer outer width: '+countainerWidth);
	else if(debug)
		console.log('Countainer width: '+countainerWidth);

	$(this).find(selector).each(function() {
		
		var elementWidth = (outer) ? $(this).outerWidth(true) : $(this).width();
		summaryWidth = summaryWidth + elementWidth;

		if (summaryWidth >= countainerWidth) {
			
			if($destination)
				$destination.append($(this).outerHtml());

			if(debug)
				console.log('Element out of container width and has been removed.');
			
			$(this).remove();
		}

	});

	if(debug && outer)
		console.log('Summary outer width: '+summaryWidth);
	else if(debug)
		console.log('Summary width: '+summaryWidth);

	return this;
};

jQuery.fn.splitByHeight = function(selector, destination, offset, outer, debug) {

	var summaryHeight = 0,
		container = $(this),
		$destination = (destination) ? $(destination) : false,
		offset = (offset) ? offset : 0,
		outer = (outer) ? true : false,
		debug = (debug) ? true : false,
		countainerHeight = (outer) ? $(container).outerHeight(true) : $(container).height(),
		debug = (debug) ? true : false;

	if(offset)
		summaryHeight = offset;

	if(debug && outer)
		console.log('Countainer outer height: '+countainerHeight);
	else if(debug)
		console.log('Countainer height: '+countainerHeight);

	$(this).find(selector).each(function() {
		
		var elementHeight = (outer) ? $(this).outerHeight(true) : $(this).height();
		summaryHeight = summaryHeight + elementHeight;

		if (summaryHeight >= countainerHeight) {
			
			if($destination)
				$destination.append($(this).outerHtml());

			if(debug)
				console.log('Element out of container height and has been removed.');
			
			$(this).remove();
		}

	});

	if(debug && outer)
		console.log('Summary outer height: '+summaryHeight);
	else if(debug)
		console.log('Summary height: '+summaryHeight);

	return this;
};


function readCookie(name) {
    var cookies = document.cookie.split('; '),
    vars = {}, indx, cookie;
    
    for (indx = cookies.length - 1; indx >= 0; indx--) {
        cookie = cookies[indx].split('=');
        vars[cookie[0]] = cookie[1];
    }
    
    return vars[name];
}

function locationHash(param) {
	var vars = {};
	window.location.href.replace(location.hash, '').replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function(m, key, value) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if (param) {
		return vars[param] ? vars[param] : null;
	}
	return vars;
}

/* jQuery.browser */
var matched, browser;
jQuery.uaMatch = function(ua) {
    ua = ua.toLowerCase();
    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [];
    return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
    };
};
matched = jQuery.uaMatch( navigator.userAgent );
browser = {};
if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if (browser.chrome) {
    browser.webkit = true;
} else if (browser.webkit) {
    browser.safari = true;
}
jQuery.browser = browser;


// Smooth scroll plugin
function smoothScroll() {

	if (window.addEventListener)
		window.addEventListener('DOMMouseScroll', wheel, false);

	window.onmousewheel = document.onmousewheel = wheel;

	var hb = {
		sTop: 0,
		sDelta: 0
	};

	function wheel(event) {

		var distance = jQuery.browser.webkit ? 60 : 120;
		if (event.wheelDelta)
			delta = event.wheelDelta / 120;
		else if (event.detail)
			delta = -event.detail / 3;

		hb.sTop = jQuery(window).scrollTop();
		hb.sDelta = hb.sDelta + delta * distance;

		jQuery(hb).stop().animate({
			sTop: jQuery(window).scrollTop() - hb.sDelta,
			sDelta: 0
		}, {
			duration: 200,
			easing: 'linear',
			step: function(now, ex) {
				if (ex.prop == 'sTop') jQuery('html, body').scrollTop(now)
			},
		});

		if (event.preventDefault)
			event.preventDefault();

		event.returnValue = false
	}

}