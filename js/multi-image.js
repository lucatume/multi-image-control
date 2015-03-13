(function ( $, window, _, undefined ) {
	"use strict";

	var api = window.wp.customize;

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
				api.Events.trigger( 'multi-image-control:urls-available', urls );
			} );

			// open the file frame
			file_frame.open();
		}
	};

	api.MultiImage = api.Control.extend( {
		ready: function () {
			this.$store = this.container.find( 'input[type="hidden"][name="store"]' );
			this.$upload_button = this.container.find( '.upload' );
			this.$remove_button = this.container.find( '.remove' );
			this.$thumbnails = this.container.find( 'ul.thumbnails' );
			this.$thumbnail = this.container.find( 'li.thumbnail' );

			var self = this;
			api.Events.bind( 'multi-image-control:urls-available', function ( urls ) {
				self.update_urls( urls );
				self.update_thumbnails( urls );
			} );

			this.$upload_button.on( 'click', function ( evt ) {
				ImageFileFrame.open();
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
					api.Events.trigger( 'multi-image-control:urls-available', urls );
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
					//new RemoveAction( $li );
				} else {
					$li.empty();
				}
			} );
		},

		update_urls: function ( urls ) {
			this.$store.val( urls );
			wp.customize.trigger( 'change' );
		},

		get_thumbnail_for: function ( url ) {
			var th = $( '<li/>' );
			th.attr( 'style', 'background-image:url(' + url + ');' );
			th.attr( 'class', 'thumbnail' );
			th.attr( 'data-src', url );

			return th;
		},

		update_thumbnails: function ( urls ) {
			this.$thumbnails.empty();
			var self = this;
			_.each( urls, function ( url ) {
				self.$thumbnails.append( self.get_thumbnail_for( url ) );
			} );
		},

		clear_urls: function () {
			this.$store.val( '' );
			this.update_thumbnails( [] );
		},

		clear_thumbnails: function () {
			this.$thumbnails.empty();
		},

		get_stored_urls: function () {
			return this.$store.val();
		}
	} );

	$.extend( api.controlConstructor, {multi_image: api.MultiImage} );

	$( document ).ready( function () {

	} )
})( jQuery, window, window._ );
