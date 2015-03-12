(function ( $, window, _, undefined ) {
	"use strict";

	// create the Backbone Events object
	var MultiImageEvents = {}, api = wp.customize;

	_.extend( MultiImageEvents, Backbone.Events );

	var ImageFileFrame = {
		open: function () {
			var file_frame = wp.media.frames.file_frame;

			// file frame already created, return
			if ( file_frame ) {
				file_frame.open();
				return;
			}

			// create the file frame
			file_frame = wp.media.frames.file_frame = wp.media( {
				//title: $( this ).data( 'uploader_title' ),
				//button: $( this ).data( 'uploader_button_text' ),
				multiple: true,
				library: {
					type: 'image'
				}
			} );

			// get the selected attachments when user selects
			file_frame.on( 'select', function ( evt ) {
				var selected = file_frame.state().get( 'selection' ).toJSON(),
					urls = [];
				_.each( selected, function ( attachment ) {
					urls.push( attachment.url );
				} );
				MultiImageEvents.trigger( 'multi-image-control:urls-available', urls );
			} );

			// open the file frame
			file_frame.open();
		}
	};


	var MultiImageControl = function ( $control, data ) {

		this.$store = $control.find( data.selectors.store );
		this.$upload_buttton = $control.find( data.selectors.upload_button );
		this.$remove_button = $control.find( data.selectors.remove_button );
		this.$thumbnails = $control.find( data.selectors.thumbnails );

		this.update_urls = function ( urls ) {
			this.$store.val( urls );
			wp.customize.trigger( 'change' );
		};

		this.get_thumbnail_for = function ( url ) {
			var th = $( '<li/>' );
			th.attr( 'style', 'background-image:url(' + url + ');' );
			th.attr( 'class', 'thumbnail' );
			th.attr( 'data-src', url );

			return th;
		};

		this.update_thumbnails = function ( urls ) {
			var self = this;
			self.$thumbnails.empty();
			_.each( urls, function ( url ) {
				self.$thumbnails.append( self.get_thumbnail_for( url ) );
			} );
		};

		this.clear_urls = function () {
			this.$store.val( '' );
			this.update_thumbnails( [] );
		};

		this.clear_thumbnails = function () {
			this.$thumbnails.empty();
		};

		this.get_stored_urls = function () {
			return this.$store.val();
		}

		this.init = function () {
			var self = this;

			this.$upload_buttton.on( 'click', function ( evt ) {
				ImageFileFrame.open();
			} );

			MultiImageEvents.on( 'multi-image-control:urls-available', function ( urls ) {
				self.update_urls( urls );
				self.update_thumbnails( urls );
			} );

			this.$remove_button.on( 'click', function () {
				self.clear_urls();
				self.clear_thumbnails();
			} );

			// make the images sortable
			this.$thumbnails.sortable( {
				items: '> li',
				axis: 'y',
				opacity: 0.6,
				distance: 3,
				cursor: 'move',
				delay: 150,
				tolerance: 'pointer',
				update: function () {
					var thumbnails = $( this ).find( data.selectors.thumbnail ),
						urls = [];
					_.each( thumbnails, function ( thumbnail ) {
						var $thumbnail = $( thumbnail );
						urls.push( $thumbnail.data( 'src' ) );
						$thumbnail.removeClass( 'no-list' );
					} );
					MultiImageEvents.trigger( 'multi-image-control:urls-available', urls );
				},
				start: function () {
					var thumbnails = $( this ).find( data.selectors.thumbnail );
					_.each( thumbnails, function ( th ) {
						$( th ).addClass( 'no-list' ).removeClass( 'selected' );
					} );
				}
			} ).disableSelection();

			// make the list items clickable
			this.$thumbnails.on( 'click', function () {
				var $li = $( this );
				$li.toggleClass( 'selected' );
				// append or remove the icons from the item
				if ( $li.hasClass( 'selected' ) ) {
					new RemoveAction( $li );
				} else {
					$li.empty();
				}
			} );

			// first thumbnails render
			MultiImageEvents.trigger( 'multi-image-control:urls-available', this.get_stored_urls() );
		};
	};

	api.MultiImage = api.Control.extend( {
		ready: function () {
			console.log( 'Hello World!' );
		}
	} );

	$.extend( api.controlConstructor, {multi_image: api.MultiImage} );

	$( document ).ready( function () {

		//var data = {};
		//
		//data.selectors = {};
		//data.selectors.store = 'input[type="hidden"][name="store"]';
		//data.selectors.upload_button = '.upload';
		//data.selectors.remove_button = '.remove';
		//data.selectors.thumbnails = 'ul.thumbnails';
		//data.selectors.thumbnail = 'li.thumbnail';
		//
		//// bootstrap all the multi image controls
		//var events = wp.customize.Events;
		//events.bind( 'multi-image-control:rendered', function () {
		//	$( '.customize-control-multi-image' ).each( function ( i, control ) {
		//		setTimeout( function () {
		//			var $control = $( control );
		//			//new MultiImageControl( $control, data ).init();
		//		}, 25 );
		//	} );
		//} );
	} )
})( jQuery, window, window._ );
