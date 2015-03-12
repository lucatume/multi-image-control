(function ( $, window, _, undefined ) {
	"use strict";

	api.MultiImage = api.Control.extend( {
		ready: function () {
			console.log( 'Hello World!' );
		}
	} );

	$.extend( api.controlConstructor, {multi_image: api.MultiImage} );

	$( document ).ready( function () {

	} )
})( jQuery, window, window._ );
