const WordArray = require('../WordArray');

/**
 * PKCS #5/7 padding strategy.
 */
class Pkcs7 {
	/**
	 * Pads data using the algorithm defined in PKCS #5/7.
	 *
	 * @param {WordArray} data The data to pad.
	 * @param {number} blockSize The multiple that the data should be padded to.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
	 */
	pad(data, blockSize) {
		// Shortcut
		var blockSizeBytes = blockSize * 4;

		// Count padding bytes
		var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

		// Create padding word
		var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

		// Create padding
		var paddingWords = [];
		for (var i = 0; i < nPaddingBytes; i += 4) {
			paddingWords.push(paddingWord);
		}
		var padding = new WordArray().create(paddingWords, nPaddingBytes);

		// Add padding
		data.concat(padding);
	}

	/**
	 * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
	 *
	 * @param {WordArray} data The data to unpad.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     CryptoJS.pad.Pkcs7.unpad(wordArray);
	 */
	unpad(data) {
		// Get number of padding bytes from last byte
		var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

		// Remove padding
		data.sigBytes -= nPaddingBytes;
	}
}

module.exports = Pkcs7;
