<?php

namespace Tarosky\RealTimeValidation\Controllers;


use Tarosky\RealTimeValidation\Pattern\Singleton;

/**
 * Form renderer.
 *
 * @package rvcf7
 */
class FormRenderer extends Singleton {

	private $extra_style = false;

	/**
	 * @inheritDoc
	 */
	protected function init() {
		add_filter( 'wpcf7_form_response_output', [ $this, 'form_response' ], 10, 5 );
	}

	/**
	 * Add extra form objects.
	 *
	 * @param string             $html    HTML string.
	 * @param string             $class   Class object.
	 * @param string             $content String content.
	 * @param \WPCF7_ContactForm $wpcf7   Form instance.
	 * @param string             $status  Status. 'init' or something.
	 * @return string
	 */
	public function form_response( $html, $class, $content, $wpcf7, $status ) {
		if ( ! is_admin() ) {
			// Enqueue helper.
			wp_enqueue_script( 'rvcf7-form-validator' );
			// Pass messages to JS.
			$messages = $wpcf7->prop( 'messages' );
			$messages = array_merge( $messages, [
				// translators: %s is maximum number.
				'number_bigger'  => __( 'Number should be %s and smaller.', 'rvcf7' ),
				// translators: %s is minimum number.
				'number_smaller' => __( 'Number should be %s and bigger.', 'rvcf7' ),
				// translators: %s is character count.
				'char_too_long'  => __( 'This field should be %s characters and shorter.', 'rvcf7' ),
				// translators: %s is character count.
				'char_too_short' => __( 'This field should be %s characters and longer.', 'rvcf7' ),
			] );
			$html    .= sprintf( '<textarea type="hidden" class="rvcf7-messages" style="display:none;">%s</textarea>', esc_textarea( json_encode( $messages ) ) );
			// Enqueue style.
			wp_enqueue_style( 'rvcf7-form' );
			// Do extra styles.
			if ( ! $this->extra_style ) {
				$this->extra_style = true;
				$this->render_extra_style();
			}
		}
		return $html;
	}

	/**
	 * Render extra style.
	 */
	public function render_extra_style() {
		// TODO: Integrate with customizer.
	}
}
