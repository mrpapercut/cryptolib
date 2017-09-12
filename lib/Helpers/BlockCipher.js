const Cipher = require('../CipherCore');

const CBC = require('./CBC');
const Pkcs7 = require('./Pkcs7');

class BlockCipher extends Cipher {
	constructor() {
		super();

		this.cfg = new Cipher().cfg.extend({
			mode: new CBC(),
			padding: new Pkcs7()
		});

		this.blockSize = 128/32
	}

	reset() {
		// Reset cipher
		super.reset.call(this);

		// Shortcuts
		var cfg = this.cfg;
		var iv = cfg.iv;
		var mode = cfg.mode;

		// Reset block mode
		if (this._xformMode == this._ENC_XFORM_MODE) {
			var modeCreator = mode.createEncryptor;
		} else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
			var modeCreator = mode.createDecryptor;

			// Keep at least one block in the buffer for unpadding
			this._minBufferSize = 1;
		}
		this._mode = modeCreator.call(mode, this, iv && iv.words);
	}

	_doProcessBlock(words, offset) {
		this._mode.processBlock(words, offset);
	}

	_doFinalize() {
		// Shortcut
		var padding = this.cfg.padding;

		// Finalize
		if (this._xformMode == this._ENC_XFORM_MODE) {
			// Pad data
			padding.pad(this._data, this.blockSize);

			// Process final blocks
			var finalProcessedBlocks = this._process(!!'flush');
		} else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
			// Process final blocks
			var finalProcessedBlocks = this._process(!!'flush');

			// Unpad data
			padding.unpad(finalProcessedBlocks);
		}

		return finalProcessedBlocks;
	}
}

module.exports = BlockCipher;
