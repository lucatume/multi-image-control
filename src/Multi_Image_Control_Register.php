<?php


	class tad_Multi_Image_Control_Register {

		public function register_textdomain() {
			load_plugin_textdomain( 'tad_mic', false, dirname( dirname( __FILE__ ) ) . '/languages' );
		}

		public function register_scripts_and_styles() {
			$postfix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			$js_src = plugins_url( '/js/multi-image' . $postfix . '.js', __FILE__ );
			$css_src = plugins_url( '/css/multi-image' . $postfix . '.css', __FILE__ );
			wp_register_script( 'tad-multi-image-control-js', $js_src, array( 'jquery' ) );
			wp_register_style( 'tad-multi-image-control-css', $css_src );
		}
	}