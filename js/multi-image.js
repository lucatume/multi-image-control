/*! theAverageDeve libraries - v0.1.0
 * https://github.com/lucatume/tad-libs-for-wordpress
 * Copyright (c) 2014; * Licensed GPLv2+ */
function RemoveAction(parent) {
    this.parent = parent;
    this.removeButton = jQuery('<span></span>');
    this.removeButton.attr('class', 'removeIcon');
    this.removeButton.append(jQuery('<a>x</a>'));

    this.removeButton.on('click', function(event) {
        event.preventDefault();
        var item = jQuery(this).parent(),
            root = item.closest('.customize-control-multi-image'),
            input = root.find('input.multi-images-control-input'),
            urls = [];
        item.remove();
        jQuery(root).find('.thumbnail').each(function(index, el) {
            urls.push(jQuery(this).data('src'));
        });
        input.val(urls.reverse()).trigger('change');
        input.trigger('updateThumbnails', {
            urls: urls
        });
    });

    this.parent.append(this.removeButton);
}

function MultiImageControl(root) {
    /**
     * The jQuery object that references a single multi imagec control
     *
     * @type {jQuery object}
     */
    this.root = root;
    /**
     * The hidden input that will store the images urls, that's linked to
     * the Backbone
     *
     * @type {jQuery object}
     */
    this.store = root.find('input.multi-images-control-input');
    this.uploadButtton = root.find('.multi-images-upload');
    this.removeButton = root.find('.multi-images-remove');
    this.thumbnails = root.find('ul.thumbnails');

    this.start = function() {
        // clicking the upload button will open the media frame
        // and update the input field value
        this.uploadButtton.on('click', function(evt) {
            var file_frame, store = jQuery(this).closest('.customize-control-multi-image').find('input.multi-images-control-input');

            evt.preventDefault();

            // file frame already created, return
            if (file_frame) {
                file_frame.open();
                return;
            }

            // create the file frame
            file_frame = wp.media.frames.file_frame = wp.media({
                title: jQuery(this).data('uploader_title'),
                button: jQuery(this).data('uploader_button_text'),
                multiple: true,
                library: {
                    type: 'image'
                }
            });

            // get the selected attachments when user selects
            file_frame.on('select', function(evt) {
                var selected = file_frame.state().get('selection').toJSON(),
                    urls = [];
                for (var i = selected.length - 1; i >= 0; i--) {
                    urls.push(selected[i].url);
                }
                store.val(urls).trigger('change');
                store.trigger('updateThumbnails', {
                    urls: urls
                });
            });
            // open the file frame
            file_frame.open();
        });

        // remove all images when the remove images button is pressed
        this.removeButton.on('click', function(evt) {
            var root, thumbnails, store, selected, urls = [];

            root = jQuery(this).closest('.customize-control-multi-image');
            thumbnails = root.find('.thumbnails');
            store = root.find('input.multi-images-control-input');

            evt.preventDefault();

            selected = thumbnails.find('.thumbnail.selected');

            if (selected.length === 0) {
                urls = '';
            } else {
                thumbnails.find('.thumbnail:not(.selected)').each(function() {
                    urls.push(jQuery(this).data('src'));
                });
            }
            store.val(urls).trigger('change');
            store.trigger('updateThumbnails', {
                urls: urls
            });
        });

        this.removeButton.on('updateLabelAndVisibility', function(evt) {
            var button, thumbnails, thumbs, selected, count;
            button = jQuery(this);
            thumbnails = button.closest('.customize-control-multi-image').find('.thumbnails');
            thumbs = thumbnails.find('.thumbnail');
            if (thumbs.length === 0) {
                button.hide();
                return;
            }
            button.show();
            selected = thumbnails.find('.thumbnail.selected');
            count = selected.length;
            if (count === 0) {
                button.text('Remove all images');
            } else if (count === 1) {
                button.text('Remove the image');
            } else if (count >= 2) {
                button.text('Remove ' + count + ' images');
            }
        });

        // update the images when the input value changes
        this.store.on('updateThumbnails', function(evt, args) {
            var root, thumbnails, urls = args.urls;
            root = jQuery(this).closest('.customize-control-multi-image');
            thumbnails = root.find('.thumbnails');
            // remove old images
            thumbnails.empty();
            // for each image url in the value create and append an image element to the list
            for (var i = urls.length - 1; i >= 0; i--) {
                var li = jQuery('<li/>');
                li.attr('style', 'background-image:url(' + urls[i] + ');');
                li.attr('class', 'thumbnail');
                li.attr('data-src', urls[i]);
                thumbnails.append(li);
            }
            // update or hide the remove images button
            root.find('.multi-images-remove').trigger('updateLabelAndVisibility');
        });

        // make the images sortable
        this.thumbnails.sortable({
            items: '> li',
            axis: 'y',
            opacity: 0.6,
            distance: 3,
            cursor: 'move',
            delay: 150,
            tolerance: 'pointer',
            update: function(evt, ui) {
                var t = jQuery(this),
                    urls = [],
                    input;
                jQuery(t.find('li')).each(function() {
                    var li = jQuery(this);
                    urls.push(li.data('src'));
                    li.removeClass('no-list');
                });
                input = t.closest('.customize-control-multi-image').find('input.multi-images-control-input');
                input.val(urls).trigger('change');
                t.sortable('refreshPositions');
            },
            start: function(evt, ui) {
                var thumbnails = jQuery(this);
                thumbnails.find('li').each(function() {
                    jQuery(this).addClass('no-list');
                    jQuery(this).removeClass('selected');
                });
                // trigger the remove button label refresh
                thumbnails.closest('.customize-control-multi-image').find('.multi-images-remove').trigger('updateLabelAndVisibility');
            }
        }).disableSelection();

        // make the list items clickable
        jQuery('.customize-control-multi-image .thumbnails').on('click', '.thumbnail', function() {
            var li = jQuery(this),
                removeButton = li.closest('.customize-control-multi-image').find('.multi-images-remove').first();
            // toggle the selected class
            li.toggleClass('selected');
            // append or remove the icons from the item
            if (li.hasClass('selected')) {
                new RemoveAction(li);
            } else {
                li.empty();
            }
            // trigger the update of the remove button
            removeButton.trigger('updateLabelAndVisibility');
        });

        // bootstrap the remove button label and visibility
        this.removeButton.trigger('updateLabelAndVisibility');
    };
}

jQuery(document).ready(function($) {
    "use strict";
    // bootstrap all the multi image controls
    $(".customize-control-multi-image").each(function() {
        new MultiImageControl($(this)).start();
    });
});