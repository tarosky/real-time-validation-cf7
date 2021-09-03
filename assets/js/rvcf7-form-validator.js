/*!
 * Realtime validation helper for CF7.
 */

const $ = jQuery;
const { sprintf } = wp.i18n;

function printMessage( input, messages, key ) {
	let message = '';
	if ( false === key ) {
		message = messages;
	} else if ( ! messages[key] ) {
		// key specified but not exists.
		return;
	} else {
		message = messages[key];
	}
	let $span = $( input ).next( '.wpcf7-not-valid-tip' );
	if ( ! $span.length ) {
		$span = $( '<span class="wpcf7-not-valid-tip" aria-hidden="true"></span>' );
		$( input ).after( $span );
	}
	$span.text( message );
}


// function clearMessage( input ) {
// 	$( input ).next( '.wpcf7-not-valid-tip' ).val();
// }

function validate( input ) {
	if ( $( input ).hasClass( 'wpcf7-not-valid' ) ) {
		$( input ).removeClass( 'wpcf7-not-valid' );
	}
}

function invalidate( input ) {
	if ( ! $( input ).hasClass( 'wpcf7-not-valid' ) ) {
		$( input ).addClass( 'wpcf7-not-valid' );
	}
}

/**
 * Detect if value is numeric.
 *
 * @param {string} value
 * @returns {boolean}
 */
function isNumeric( value ) {
	return /^[e0-9.\-,+]+$/.test( value );
}

jQuery( document ).ready( function () {

	// If input or text fields found, add required attributes.
	$( '.wpcf7-validates-as-required' ).each( function( index, input ) {
		switch ( input.tagName.toLowerCase() ) {
			case 'input':
			case 'textarea':
			case 'select':
				input.required = true;
				break;
		}
	} );

	// Listen validation.
	$( '.wpcf7' ).each( function( index, form ) {
		// Get message.
		const messages = JSON.parse( $( form ).find( '.rvcf7-messages' ).val() );

		// Required fields.
		$( form ).find( 'input[required], select[required], textarea[required]' ).each( function( i, input ) {
			if ( ! $( input ).val().length ) {
				printMessage( input, messages, 'invalid_required' );
			}
		} ).on( 'change keyup', function( e ) {
			if ( ! e.target.value.length ) {
				printMessage( this, messages, 'invalid_required' );
			} else {
				validate( this );
			}
		} );
		// URL
		$( form ).find( 'input[type="url"]' ).keydown( function( e ) {
			if ( ! e.target.value.length ) {
				// If empty, leave nothing.
				return;
			}
			// Check if url matches.
			if ( ! /^https?:\/\/.*$/.test( e.target.value ) ) {
				printMessage( this, messages, 'invalid_url' );
				invalidate( this );
			} else {
				validate( this );
			}
		} );
		// TEL
		$( form ).find( 'input[type="tel"]' ).keydown( function( e ) {
			if ( ! e.target.value.length ) {
				// If empty, leave nothing.
				return;
			}
			// Check if tel matches.
			if ( ! /[+0-9 \-()]+$/.test( e.target.value ) ) {
				printMessage( this, messages, 'invalid_tel' );
				invalidate( this );
			} else {
				validate( this );
			}
		} );
		// Number
		$( form ).find( 'input[type="number"]' ).on( 'change keyup', function( e ) {
			if ( !e.target.value.length ) {
				// If empty, leave nothing.
				return;
			}
			const val = e.target.value;
			const max = e.target.max;
			const min = e.target.min;
			// Check number format.
			if ( ! isNumeric( val ) ) {
				// Mal format.
				printMessage( this, messages, 'invalid_number' );
			} else if ( isNumeric( max ) || isNumeric( min ) ) {
				// Max or Min.
				if ( isNumeric( max ) && parseFloat( val ) > max ) {
					// Too big.
					printMessage( this, sprintf( messages.number_bigger, max ), false );
					invalidate( this );
				} else if ( isNumeric( min ) && parseFloat( val ) < min ) {
					// Too small
					printMessage( this, sprintf( messages.number_smaller, min ), false );
					invalidate( this );
				} else {
					// No error.
					validate( this );
				}
			} else {
				// No error.
				validate( this );
			}
		} );

		// Text with length.
		$( form ).find( 'input[minlength], input[maxlength], textarea[minlength], textarea[maxlength]' ).on( 'change keyup', function() {
			const val = $( this ).val().length;
			if ( ! val ) {
				// Do nothing.
				return;
			}
			const max = $( this ).attr( 'maxlength' );
			const min = $( this ).attr( 'minlength' );
			if ( isNumeric( max ) && parseInt( max, 10 ) < val ) {
				// Too long.
				printMessage( this, sprintf( messages.char_too_long, max ), false );
				invalidate( this );
			} else if ( isNumeric( min ) && parseInt( min, 10 ) > val ) {
				// Too short.
				printMessage( this, sprintf( messages.char_too_short, min), false );
				invalidate( this );
			} else {
				// Valid.
				validate( this );
			}
		} );

		// TODO: Date fields seem to valid

		// Checkbox.
		$( form ).find( '.wpcf7-checkbox.wpcf7-validates-as-required' ).each( function( i, checkboxes ) {
			printMessage( checkboxes, messages, 'invalid_required' );
			if ( ! $( checkboxes ).find( 'input:checked' ).length ) {
				$( checkboxes ).addClass( 'wpcf7-not-valid' );
			}
			$( checkboxes ).find( 'input[type="checkbox"]' ).change( function() {
				if ( $( checkboxes ).find( 'input:checked' ).length ) {
					validate( checkboxes );
				} else {
					invalidate( checkboxes );
				}
			} );
		} );

		// TODO: Checkbox with limitation.
	} );

} );
