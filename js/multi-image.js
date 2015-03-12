(function ( $, window, _, undefined ) {
	"use strict";

	var api = window.wp.customize;

	api.MultiImage = api.Control.extend( {
		ready: function () {
			console.log( 'Hello World!' );
		}
	} );

	$.extend( api.controlConstructor, {multi_image: api.MultiImage} );

	$( document ).ready( function () {

	} )
})( jQuery, window, window._ );
