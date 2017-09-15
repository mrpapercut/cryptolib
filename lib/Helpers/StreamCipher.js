import Cipher from '../CipherCore';

class StreamCipher extends Cipher {
	constructor() {
		super();
		this.blockSize = 1;
	}

	_doFinalize() {
		// Process partial blocks
		var finalProcessedBlocks = this._process(!!'flush');

		return finalProcessedBlocks;
	}
}

export default StreamCipher;
