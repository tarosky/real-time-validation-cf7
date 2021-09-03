<?php

namespace Tarosky\RealTimeValidation;


use Tarosky\RealTimeValidation\Controllers\FormRenderer;
use Tarosky\RealTimeValidation\Pattern\Singleton;
use Tarosky\RealTimeValidation\Utility\Conditions;

/**
 * Bootstrap
 *
 * @package rvcf7
 */
class Bootstrap extends Singleton {

	use Conditions;

	/**
	 * @inheritDoc
	 */
	protected function init() {
		if ( ! $this->is_cf7_available() ) {
			// No CF7, do nothing.
			return;
		}
		add_action( 'init', [ $this, 'register_assets' ], 20 );
		// Renderer.
		FormRenderer::get_instance();
	}

	/**
	 * Register assets.
	 */
	public function register_assets() {
		$base    = rvcf7_url() . '/dist';
		$version = rvcf7_version();
		// Form helper.
		wp_register_script( 'rvcf7-form-validator', $base . '/js/rvcf7-form-validator.js', [ 'jquery', 'wp-i18n' ], $version, true );
		// Form styles.
		wp_register_style( 'rvcf7-form', $base . '/css/rvcf7-form.css', [], $version );
	}
}
