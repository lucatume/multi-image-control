(function ( $, window, _ ) {
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
				multiple: true,
				library: {
					type: 'image'
				}
			} );

			// get the selected attachments when user selects
			file_frame.on( 'select', function () {
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

	var MIC_Upload_Button = Backbone.View.extend( {
		tagName: 'a',
		initialize: function () {
			this.$el.on( 'click', ImageFileFrame.open );
		}
	} );

	var MIC_Remove_Button = Backbone.View.extend( {
		tagName: 'a',
		initialize: function () {
			//this.listenTo( this.model, 'change', this.render );
		},
		get_new_html: function () {

		},
		render: function () {
			var html = this.get_new_html();
			this.$el.html( html );
		}
	} );

	var Src = Backbone.Model.extend( {} );

	var Srcs_Collection = Backbone.Collection.extend( {
		model: Src
	} );

	var Thumbnail_View = Backbone.View.extend( {
		tagName: 'li',
		className: 'thumbnail'
	} );

	var Thumbnails_View = Backbone.View.extend( {
		make_sortable: function () {
			this.$el.sortable().disableSelection();
		},
		render: function () {
			this.$el.empty();
			var srcs = this.model.models;
			_.each( srcs, function ( src ) {
				var _src = src.attributes.src;
				var thumbnail = new Thumbnail_View( {
					attributes: {
						style: 'background-image: url(' + _src + ')',
						'data-src': _src
					}
				} );
				this.$el.append( thumbnail.$el );
			}, this );

			return this;
		}
	} );

	api.MultiImage = api.Control.extend( {
		update: function ( urls ) {
			if ( urls.length === 0 ) {
				return;
			}
			var new_srcs = [];
			_.each( urls, function ( url ) {
				new_srcs.push( new Src( {collection: this.srcs, src: url} ) );
			}, this );
			this.srcs.reset( new_srcs );

			this.thumbnails.render().make_sortable();
		},
		ready: function () {
			this.upload_button = new MIC_Upload_Button( {el: this.container.find( 'a.upload' )} );
			this.remove_button = new MIC_Remove_Button( {model: this, el: this.container.find( 'a.remove' )} );
			this.srcs = new Srcs_Collection();
			this.thumbnails = new Thumbnails_View( {model: this.srcs, el: this.container.find( 'ul.thumbnails' )} );

			api.Events.bind( 'multi-image-control:urls-available', _.bind( this.update, this ) );

			// render the initial state
			if ( this.setting.get() === '' ) {
				return;
			}
			var urls = this.setting.get().split( ',' );
			this.update( urls );
		}
	} );

	$.extend( api.controlConstructor, {multi_image: api.MultiImage} );

})( jQuery, window, window._ );
