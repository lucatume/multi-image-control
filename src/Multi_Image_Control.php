<?php

class tad_Multi_Image_Control extends WP_Customize_Control
{
    
    public $type = 'multi-image';
    
    public function __construct($manager, $id, $args = array())
    {
        parent::__construct($manager, $id, $args);
        $this->enqueue();
    }
    
    public function enqueue()
    {
        wp_enqueue_script('tad-multi-image-control');
        wp_enqueue_style('tad-multi-image-control');
        wp_localize_script('tad-multi-image-control', '_tadMultiImageControl', array(
            'remove_all_images_label' => __('Remove all images', 'mic') ,
            'remove_one_image_label' => __('Remove the image', 'mic') ,
            'remove_n_images_label' => __('Remove the images', 'mic')
        ));
    }
    
    public function to_json()
    {
        parent::to_json();
        $this->json['value'] = $this->value();
        $this->json['srcs'] = $this->get_srcs();
        $this->json['link'] = $this->get_link();
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
    
    protected function get_srcs()
    {
        $imageSrcs = explode(',', $this->value());
        if (!is_array($imageSrcs)) {
            $imageSrcs = array();
            
            return $imageSrcs;
        }
        
        return $imageSrcs;
    }
}
