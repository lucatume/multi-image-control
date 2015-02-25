<?php
	spl_autoload_register( 'tad_autoload' );
	function tad_autoload( $class ) {
		$map = array(
			'tad_Multi_Image_Control' => '/src/Multi_Image_Control.php',
			'tad_Multi_Image_Control_Register' => '/src/Multi_Image_Control_Register.php',
		);
		if ( isset( $map[ $class ] ) && file_exists( $file = dirname( __FILE__ ) . $map[ $class ] ) ) {
			include $file;
		}
	}