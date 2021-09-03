<?php

namespace Tarosky\RealTimeValidation\Utility;

/**
 * Conditional functions.
 */
trait Conditions {

	/**
	 * Is Contact Form 7 exists?
	 *
	 * @return bool
	 */
	public function is_cf7_available() {
		return defined( 'WPCF7_VERSION' );
	}
}
