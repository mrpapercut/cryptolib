const BlockCipherMode = require('./BlockCipherMode');

class CBC extends BlockCipherMode {
	constructor() {
		super();

		this.Encryptor = this.extend({
			/**
			 * Processes the data block at offset.
			 *
			 * @param {Array} words The data words to operate on.
			 * @param {number} offset The offset where the block starts.
			 *
			 * @example
			 *
			 *     mode.processBlock(data.words, offset);
			 */
			processBlock: function (words, offset) {
				// Shortcuts
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;

				// XOR and encrypt
				this.xorBlock(words, offset, blockSize);
				cipher.encryptBlock(words, offset);

				// Remember this block to use with next block
				this._prevBlock = words.slice(offset, offset + blockSize);
			}
		});

		/**
		 * CBC decryptor.
		 */
		this.Decryptor = this.extend({
			/**
			 * Processes the data block at offset.
			 *
			 * @param {Array} words The data words to operate on.
			 * @param {number} offset The offset where the block starts.
			 *
			 * @example
			 *
			 *     mode.processBlock(data.words, offset);
			 */
			processBlock: function (words, offset) {
				// Shortcuts
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;

				// Remember this block to use with next block
				var thisBlock = words.slice(offset, offset + blockSize);

				// Decrypt and XOR
				cipher.decryptBlock(words, offset);
				this.xorBlock(words, offset, blockSize);

				// This block becomes the previous block
				this._prevBlock = thisBlock;
			}
		});
	}

	xorBlock(words, offset, blockSize) {
		// Shortcut
		var iv = this._iv;

		// Choose mixing block
		if (iv) {
			var block = iv;

			// Remove IV for subsequent blocks
			this._iv = undefined;
		} else {
			var block = this._prevBlock;
		}

		// XOR blocks
		for (var i = 0; i < blockSize; i++) {
			words[offset + i] ^= block[i];
		}
	}
}

module.exports = CBC;
