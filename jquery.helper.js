/* Helper.js */

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

jQuery.fn.outerHtml = function() {
    return $('<div />').append($(this).clone()).html();
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
