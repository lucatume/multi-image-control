<?php

class tad_Multi_Image_Control extends WP_Customize_Control
{

    public $type = 'multi_image';
    
    public function __construct($manager, $id, $args = array())
    {
        parent::__construct($manager, $id, $args);
    }
    
    public function enqueue()
    {
	    wp_enqueue_script('multi-image-control-js');
        wp_enqueue_style('multi-image-control-css');
        wp_localize_script('multi-image-control-js', '_MultiImageControl', array(
            'remove_all_images_label' => __('Remove all images', 'mic') ,
            'remove_one_image_label' => __('Remove the image', 'mic') ,
            'remove_n_images_label' => __('Remove the images', 'mic')
        ));
    }
    
    public function to_json()
    {
        parent::to_json();
        $this->json['l10n']['upload_button_label'] = __('Upload', 'mic');
        $this->json['l10n']['remove_all_button_label'] = __('Remove all', 'mic');
    }

    public function render_content()
    {
        // no op
    }
    
    protected function content_template()
    {
        echo file_get_contents(dirname(__FILE__) . '/templates/multi-image-control.tmpl');
    }
}
