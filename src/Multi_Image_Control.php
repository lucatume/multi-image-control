<?php


	class tad_Multi_Image_Control extends \WP_Customize_Control {

		public $type = 'multi-image';

		public function __construct( $manager, $id, $args = array() ) {
			parent::__construct( $manager, $id, $args );
			$this->enqueue();
		}

		public function enqueue() {
			wp_enqueue_media();
			wp_enqueue_script( 'tad-multi-image-control-js' );
			wp_enqueue_style( 'multi-image-control-css' );
		}

		public function render_content() {
			// get the set values if any
			$imageSrcs = explode( ',', $this->value() );
			if ( ! is_array( $imageSrcs ) ) {
				$imageSrcs = array();
			}
			$this->the_title();
			$this->the_buttons();
			$this->the_uploaded_images( $imageSrcs );
		}

		protected function the_title() {
			$label = $this->label;
			include $this->get_template( 'titles' );
		}

		protected function get_images() {
			$options = $this->value();
			if ( ! isset( $options['image_sources'] ) ) {
				return '';
			}

			return $options['image_sources'];
		}

		public function the_buttons() {
			$value = $this->value();
			$link = $this->get_link();
			include $this->get_template( 'buttons' );
		}

		public function the_uploaded_images( $srcs = array() ) {
			include $this->get_template( 'images' );
		}

		private function get_template( $template ) {
			return dirname( dirname( __FILE__ ) ) . '/templates/' . $template . '.php';
		}
	}
