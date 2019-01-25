/* Helper.js v1.6.1 */

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

String.prototype.replaceAll = function(search, replace) {
	var string = this;  
	if (typeof search === "object") {
		for (var i = 0; i < search.length; i++) {
			string = string.replace(new RegExp(search[i], "g"), replace[i]);
		}
	} else if (typeof search === "string") {
		string.replace(new RegExp(search, 'g'), replace);
	}
	return string;
};

jQuery.fn.swap = function(b) {
    b = jQuery(b)[0];
    var a = this[0],
        a2 = a.cloneNode(true),
        stack = this;

    stack[0] = a2;
    return this.pushStack( stack );
};

(function($) {
	$.fn.isInViewport = function(debug) {
		var debug = (debug) ? true : false;
		var $window = $(window);

		var _this = $(this);
		if(!_this && debug) {
			console.log('isOnScreen: element undefined.');
			return false;
		}


		var viewport = {
			top: ($window.scrollTop() || document.body.scrollTop || document.documentElement.scrollTop),
			left: ($window.scrollLeft() || document.body.scrollLeft || document.documentElement.scrollLeft)
		};
		viewport.right = viewport.left + ($window.width() || Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.body.clientWidth, document.documentElement.clientWidth));
		viewport.bottom = viewport.top + ($window.height() || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight));

		if(debug)
			console.log('Viewport have bounds, top: '+viewport.top+', left: '+viewport.left+', right: '+viewport.right+', bottom: '+viewport.bottom);

		var bounds = {
			top: Math.round(_this.offset().top),
			left: Math.round(_this.offset().left),
		};
		bounds.right = Math.round(bounds.left + _this.outerWidth());
		bounds.bottom = Math.round(bounds.top + _this.outerHeight());

		if(debug)
			console.log('Element have bounds, top: '+bounds.top+', left: '+bounds.left+', right: '+bounds.right+', bottom: '+bounds.bottom);

		var inviewport = !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom);

		if(debug)
			console.log('Element in viewport: '+inviewport);

		return inviewport;
	}
})(jQuery);

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

jQuery.fn.id = function() {
    if(this.attr('class'))
        return "#"+jQuery.trim(this.attr('id'));
    else
        return null;
};

jQuery.fn.class = function() {
    if(this.attr('class'))
        return "."+this.attr('class').replace(/\s/g, ".");
    else
        return null;
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

(function($) {
	var defaults = {
		groups: 3,
		classname: ".item",
		find_elem: ".sub-item",
		min: 1
	};
	$.fn.autoGroup = function (custom, debug) {
		var debug = debug || false;
		var options = $.extend({}, defaults, custom);
		return this.each(function () {
			var elements = $(this).find(options.find_elem);
			var count = elements.length;

			if(debug)
				console.log('autoGroup count: '+count);

			if (count > 0) {
				var min = Math.ceil(count / options.groups);
				min < options.min && (min = options.min);

				var current = 0;
				var step = min;

				for (i = 0; i < options.groups; i++) {
					elements.slice(current, step).wrapAll(i + 1 == options.groups ? '<div class="' + options.classname + ' last" />' : '<div class="' + options.classname + '" />');
					current += min;
					step += min;
				}
			} else if(debug) {
				console.log('autoGroup: no have child elements for group.');
			}
		});
	};
})(jQuery);

jQuery.fn.nextOrFirst = function(selector){
    var next = this.next(selector);
    return (next.length) ? next : this.prevAll(selector).last();
};

jQuery.fn.prevOrLast = function(selector){
    var prev = this.prev(selector);
    return (prev.length) ? prev : this.nextAll(selector).last();
};

(function($) {
	$.fn.countUp = function(custom, debug) {
		var debug = debug || false;
		var options = $.extend({}, $.fn.countUp.defaults, custom);
		return this.each(function () {
			var _this = $(this);
			var loop = 0,
				current = 0,
				value = parseInt(_this.text()),
				loops = Math.ceil(options.time / options.interval),
				increment = value / loops;

			if(value > 0) {
				if(debug)
					console.log('countUp start of lops, count: '+loops);

				var intervalId = setInterval(function() {
					if (loop < loops) {
						current += increment;
						_this.text(Math.round(current));
					} else {
						clearInterval(intervalId);
						_this.text(value);

						if(debug)
							console.log('countUp end of lops, current: '+loop);

					}
					loop++;
				}, options.interval);
			} else if(debug) {
				console.log('countUp: element no have int value.');
			}
		});
	};
	$.fn.countUp.defaults = {
		interval: 100,
		time: 3000
	};
})(jQuery);

(function($) {
	$.fn.countDown = function(custom, debug) {
		var debug = debug || false;
		var options = $.extend({}, $.fn.countDown.defaults, custom);
		return this.each(function () {
			var _this = $(this);
			var loop = 0,
				current = 0,
				value = parseInt(_this.text()),
				loops = Math.ceil(options.time / options.interval),
				increment = value / loops;

			if(value > 0) {
				if(debug)
					console.log('countDown start of lops, count: '+loops);

				current = value;

				var intervalId = setInterval(function() {
					if (loop < loops) {
						current -= increment;
						_this.text(Math.round(current));
					} else {
						clearInterval(intervalId);
						_this.text(0);

						if(debug)
							console.log('countDown end of lops, current: '+loop);

					}
					loop++;
				}, options.interval);
			} else if(debug) {
				console.log('countDown: element no have int value.');
			}
		});
	};
	$.fn.countDown.defaults = {
		interval: 100,
		time: 3000
	};
})(jQuery);

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

(function($) {
	function elementText(el, separator) {
		var textContents = [];
		for (var chld = el.firstChild; chld; chld = chld.nextSibling) {

			if (chld.nodeType == 3)
				textContents.push(chld.nodeValue);

		}
		return textContents.join(separator);
	}
	$.fn.textNotChild = function(elementSeparator, nodeSeparator) {

		if (arguments.length < 2)
			nodeSeparator = "";

		if (arguments.length < 1)
			elementSeparator = "";

		return $.map(this, function(el) {
			return elementText(el, nodeSeparator);
		}).join(elementSeparator);
	}
})(jQuery);

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

var loadJSONP = (function(){
	var unique = 0;
	return function(url, callback, context) {

		var name = "_jsonp_" + unique++;

		if (url.match(/\?/))
			url += "&callback="+name;
		else
			url += "?callback="+name;

		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		window[name] = function(data) {
			callback.call((context || window), data);
			document.getElementsByTagName('head')[0].removeChild(script);
			script = null;
			delete window[name];
		};

		document.getElementsByTagName('head')[0].appendChild(script);
	};
})();

const fetchJSONP = (unique => url =>
	new Promise(rs => {
		const script = document.createElement('script');
		const name = `_jsonp_${unique++}`;

		if (url.match(/\?/)) {
			url += `&callback=${name}`;
		} else {
			url += `?callback=${name}`;
		}

		script.src = url;
		window[name] = json => {
		rs(new Response(JSON.stringify(json)));
		script.remove();
		delete window[name];
		};

		document.body.appendChild(script);
	})
)(0);

jQuery.fn.checkSVG = function() {
	if(document.createElementNS("http://www.w3.org/2000/svg", 'svg').createSVGRect !== undefined)
		return jQuery(this).removeClass('no-svg');
	else
		return jQuery(this).addClass('no-flex');
};

jQuery.fn.checkFlexbox = function() {
	if (('flexWrap' in document.documentElement.style) || ('WebkitFlexWrap' in document.documentElement.style) || ('msFlexWrap' in document.documentElement.style))
		return jQuery(this).removeClass('no-flex');
	else
		return jQuery(this).addClass('no-flex');
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

jQuery.fn.maxHeight = function(isouter, debug) {
	var isouter = (isouter) ? true : false;
	var debug = (debug) ? true : false;
    var height = 0;
    this.each(function() {

        if(isouter)
            var block_height = $(this).outerHeight();
        else
            var block_height = $(this).height();

        if(block_height > height)
            height = block_height;

    });

	if(debug)
		console.log('Max height of elements: '+height);

    return height;
}

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
