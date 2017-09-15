import WordArray from '../WordArray';
import BlockCipher from '../Helpers/BlockCipher';
import DES from './des';

class TripleDes {
	constructor() {}

	algo() {
		return new BlockCipher().extend({
			_doReset: function () {
				// Shortcuts
				var key = this._key;
				var keyWords = key.words;

				// Create DES instances
				this._des1 = new DES().algo().createEncryptor(new WordArray().create(keyWords.slice(0, 2)));
				this._des2 = new DES().algo().createEncryptor(new WordArray().create(keyWords.slice(2, 4)));
				this._des3 = new DES().algo().createEncryptor(new WordArray().create(keyWords.slice(4, 6)));
			},

			encryptBlock: function (M, offset) {
				this._des1.encryptBlock(M, offset);
				this._des2.decryptBlock(M, offset);
				this._des3.encryptBlock(M, offset);
			},

			decryptBlock: function (M, offset) {
				this._des3.decryptBlock(M, offset);
				this._des2.encryptBlock(M, offset);
				this._des1.decryptBlock(M, offset);
			},

			keySize: 192/32,

			ivSize: 64/32,

			blockSize: 64/32
		});
	}
}

export default TripleDes;
