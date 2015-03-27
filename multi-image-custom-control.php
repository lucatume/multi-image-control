<?php
	/**
	 * Plugin Name: Multi Image Theme Customizer Control
	 * Plugin URI: http://theAverageDev.com
	 * Description: A Theme Customizer control that allows managing and sorting multiple images.
	 * Version: 1.0
	 * Author: Luca Tumedei <luca@theaveragedev.com>
	 * Author URI: http://theAverageDev.com
	 * License: GPL 2.0
	 */

	include dirname( __FILE__ ) . '/autoload.php';

	$register = new tad_Multi_Image_Control_Register();

	// register the plugin textdomain
	add_action( 'plugins_loaded', array( $register, 'register_textdomain' ) );
	// register the plugin scripts
	add_action( 'admin_enqueue_scripts', array( $register, 'register_scripts_and_styles' ) );
	// register the control type
	add_action('customize_register', array($register, 'register_control_type'));
