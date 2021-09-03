<?php
/**
Plugin Name: Real Time Validation for Contact Form 7
Plugin URI: https://wordpress.org/plugins/real-time-validation-cf7/
Description: Add realtime validation for Contact Form 7.
Author: Tarosky INC.
Version: nightly
Author URI: https://tarosky.co.jp/
License: GPL3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html
Text Domain: rvcf7
Domain Path: /languages
 */

defined( 'ABSPATH' ) or die();

/**
 * Init plugins.
 */
function rvcf7_init() {
	// Register translations.
	load_plugin_textdomain( 'rvcf7', false, basename( __DIR__ ) . '/languages' );
	// Boostrap.
	require __DIR__ . '/vendor/autoload.php';
	\Tarosky\RealTimeValidation\Bootstrap::get_instance();
}

/**
 * Get URL.
 *
 * @return string
 */
function rvcf7_url() {
	return untrailingslashit( plugin_dir_url( __FILE__ ) );
}

/**
 * Get version.
 *
 * @return string
 */
function rvcf7_version() {
	static $version = null;
	if ( is_null( $version ) ) {
		$data    = get_file_data( __FILE__, [
			'version' => 'Version',
		] );
		$version = $data['version'];
	}
	return $version;
}

// Register hooks.
add_action( 'plugins_loaded', 'rvcf7_init' );
