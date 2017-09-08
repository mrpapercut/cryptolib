const Cipher = require('../CipherCore');

class StreamCipher extends Cipher {
	constructor() {
		super();
		this.blockSize = 1;
	}

	_doFinalize: function () {
		// Process partial blocks
		var finalProcessedBlocks = this._process(!!'flush');

		return finalProcessedBlocks;
	}
}

module.exports = StreamCipher;