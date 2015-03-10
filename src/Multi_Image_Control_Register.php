<?php


	class tad_Multi_Image_Control_Register {

		public function register_textdomain() {
			load_plugin_textdomain( 'tad_mic', false, dirname( dirname( __FILE__ ) ) . '/languages' );
		}

		public function register_scripts_and_styles() {
			$postfix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			$js_src = plugins_url( '/js/multi-image' . $postfix . '.js', dirname( __FILE__ ) );
			$css_src = plugins_url( '/css/multi-image' . $postfix . '.css', dirname( __FILE__ ) );
			wp_register_script( 'tad-multi-image-control', $js_src, array( 'jquery', 'backbone', 'underscore' ) );
			wp_register_style( 'tad-multi-image-control', $css_src );
		}

		public function register_control_type( WP_Customize_Manager $wp_customize ) {
			$wp_customize->register_control_type( 'tad_Multi_Image_Control' );
		}
	}