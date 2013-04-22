/*

Simpatico - Resize images to fill or fit container

Version 	: 0.1
Repository 	: https://github.com/andrewtibbetts/Simpatico
Author 		: Andrew Tibbetts
License 	: MIT, GPL

*/

(function( $ ){

var simpatico_defaults = {
	'view' : 'fill', // fit or fill
	'anchor_x' : 'center', // left, center, right
	'anchor_y' : 'middle' // top, middle, bottom
};

$.fn.simpatico = function( opts ) {

	this.each((function(){

		function fit_width(dims,o) {
		
			dims.newW = dims.conW; // set destination width to container width
			dims.newH = ( dims.conW/dims.imgW ) * dims.imgH; // calculate new image height
			
			// calculate top and bottom
			switch (o.anchor_y) {
				case 'top':
					dims.newT = 0;
						break;
				case 'middle':
					switch (o.view) {
						case 'fit':
							dims.newT = ( ( dims.conH - dims.newH ) / 2 );
								break;
						case 'fill':
							dims.newT = ( ( dims.newH - dims.conH ) / 2 ) * -1;
								break;
					}
						break;
				case 'bottom':
					dims.newT = dims.conH - dims.newH;
						break;
			}
		
			// ignore anchor_x since image will fit horizontally
			dims.newL = 0;
			
			return dims;
		}

		function fit_height(dims,o) {
		
			dims.newW = ( dims.conH/dims.imgH ) * dims.imgW; // calculate new image width
			dims.newH = dims.conH; // set destination height to container height
			
			// calulate left and right
			switch (o.anchor_x) {
				case 'left':
					dims.newL = 0;
						break;
				case 'center':
					switch (o.view) {
						case 'fit':
							dims.newL = ( ( dims.conW - dims.newW ) / 2 );
								break;
						case 'fill':
							dims.newL = ( ( dims.newW - dims.conW ) / 2 ) * -1;
								break;
					}
						break;
				case 'right':
					dims.newL = dims.conW - dims.newW;
			}
			
			// ignore anchor_y since image will fit vertically
			dims.newT = 0;
			
			return dims;
		}
		
		function img_is_landscapier(dims) {
			var imgA = dims.imgW/dims.imgH;
			var conA = dims.conW/dims.conH;
			if ( imgA > conA ) return true; // the image is more 'landscapey' than the container
			else return false; // the image is more 'portraity' than the container
		}
		
		return function(){

			// init dimensions object
			var dims = {
				conW: 0, // container width
				conH: 0, // container height
				imgW: 0, // image width
				imgH: 0, // image height
				newW: 0, // destination width
				newH: 0, // destination height
				newT: 0, // destination top
				newL: 0  // destination left
			}
	
			// defaults
			var o = $.extend({}, simpatico_defaults, opts);
	
			// set container object and get it's width and height
			var $container = $(this);
			dims.conW = $container.width();
			dims.conH = $container.height();
	
			// set some styles on the container in case they aren't in .css file 
			// and then find any 'img' decendants and iterate through them
			$container.css({ overflow: 'hidden' }).find('img').each(function(){
	
				var $image = $(this); // set image object
	
				// create and load a temp image to get unaffected width and height
				$('<img src="'+$image.attr('src')+'" />').load(function(){
	
					dims.imgW = this.width; // get image width (gotta use js as jquery fails)
					dims.imgH = this.height; // get image height (gotta use js as jquery fails)
					
					switch (o.view) {
						case 'fit': // show the whole image
							if ( img_is_landscapier(dims) )
								fit_width(dims,o);
							else
								fit_height(dims,o);
								break;
						default: // 'fill', leave no empty space in container
							if ( img_is_landscapier(dims) )
								fit_height(dims,o);
							else
								fit_width(dims,o);
								break;
					}
					console.log(o);

					// apply new styles to the image. done!
					$image.width(dims.newW).height(dims.newH).css({ position: 'absolute', top: dims.newT, left: dims.newL });
	
				});
			});
		};
	})());
}

})( jQuery );