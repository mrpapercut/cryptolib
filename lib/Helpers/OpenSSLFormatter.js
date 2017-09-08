const Base64 = require('../Encoders/Base64');
const CipherParams = require('./CipherParams');
const WordArray = require('../WordArray');

class OpenSSLFormatter {
	/**
	 * Converts a cipher params object to an OpenSSL-compatible string.
	 *
	 * @param {CipherParams} cipherParams The cipher params object.
	 *
	 * @return {string} The OpenSSL-compatible string.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
	 */
	stringify(cipherParams) {
		// Shortcuts
		var ciphertext = cipherParams.ciphertext;
		var salt = cipherParams.salt;

		// Format
		if (salt) {
			var wordArray = new WordArray().create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
		} else {
			var wordArray = ciphertext;
		}

		return wordArray.toString(Base64);
	}

	/**
	 * Converts an OpenSSL-compatible string to a cipher params object.
	 *
	 * @param {string} openSSLStr The OpenSSL-compatible string.
	 *
	 * @return {CipherParams} The cipher params object.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
	 */
	parse(openSSLStr) {
		// Parse base64
		var ciphertext = Base64.parse(openSSLStr);

		// Shortcut
		var ciphertextWords = ciphertext.words;

		// Test for salt
		if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
			// Extract salt
			var salt = new WordArray().create(ciphertextWords.slice(2, 4));

			// Remove salt from ciphertext
			ciphertextWords.splice(0, 4);
			ciphertext.sigBytes -= 16;
		}

		return new CipherParams().create({ ciphertext: ciphertext, salt: salt });
	}
}

module.exports = OpenSSLFormatter;
