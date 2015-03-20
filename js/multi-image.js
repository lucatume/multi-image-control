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
				api.Events.trigger( 'mic:urls-available', urls );
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
		empty_urls: function () {
			api.Events.trigger( 'mic:urls-available', [] );
		},
		handle_visibility: function ( urls ) {
			if ( urls.length ) {
				this.$el.show();
				return;
			}
			this.$el.hide();
		},
		initialize: function () {
			this.$el.on( 'click', this.empty_urls );
			api.Events.bind( 'mic:urls-available', _.bind( this.handle_visibility, this ) );
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
		initialize: function () {
			this.model.on( 'change reset set', this.render, this );
		},
		get_urls: function ( el ) {
			var urls = [],
				thumbnails = $( el ).find( 'li.thumbnail' );
			_.each( thumbnails, function ( thumbnail ) {
				urls.push( $( thumbnail ).data( 'src' ) );
			} );

			return urls;
		},
		make_sortable: function () {
			var self = this;
			this.$el.sortable( {
				update: function () {
					api.Events.trigger( 'mic:urls-available', self.get_urls( this ) );
				}
			} ).disableSelection();
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
			this.make_sortable();
			return this;
		}
	} );

	api.MultiImage = api.Control.extend( {
		prepare_setting_urls: function ( urls ) {
			urls = urls.length ? urls.join( ',' ) : '';
			return urls;
		}, update_setting: function ( urls ) {
			this.setting.set( this.prepare_setting_urls( urls ) );
		},
		udpdate_srcs_collection: function ( urls ) {
			var new_srcs = [];
			_.each( urls, function ( url ) {
				new_srcs.push( new Src( {collection: this.srcs, src: url} ) );
			}, this );
			this.srcs.reset( new_srcs );
		},
		update: function ( urls ) {
			this.update_setting( urls );
			this.udpdate_srcs_collection( urls );
		},
		extract_setting_urls: function () {
			var urls = this.setting.get().length ? this.setting.get().split( ',' ) : [];
			return urls;
		}, ready: function () {
			this.upload_button = new MIC_Upload_Button( {el: this.container.find( 'a.upload' )} );
			this.remove_button = new MIC_Remove_Button( {model: this, el: this.container.find( 'a.remove' )} );

			this.srcs = new Srcs_Collection();
			this.thumbnails = new Thumbnails_View( {model: this.srcs, el: this.container.find( 'ul.thumbnails' )} );

			api.Events.bind( 'mic:urls-available', _.bind( this.update, this ) );
			api.Events.trigger( 'mic:urls-available', this.extract_setting_urls() );
		}
	} );

	$.extend( api.controlConstructor, {multi_image: api.MultiImage} );

})( jQuery, window, window._ );
