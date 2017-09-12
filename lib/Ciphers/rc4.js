const StreamCipher = require('../Helpers/StreamCipher');

function generateKeystreamWord() {
	// Shortcuts
	var S = this._S;
	var i = this._i;
	var j = this._j;

	// Generate keystream word
	var keystreamWord = 0;
	for (var n = 0; n < 4; n++) {
		i = (i + 1) % 256;
		j = (j + S[i]) % 256;

		// Swap
		var t = S[i];
		S[i] = S[j];
		S[j] = t;

		keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
	}

	// Update counters
	this._i = i;
	this._j = j;

	return keystreamWord;
}

class RC4 {
	constructor() {}

	algo() {
		return new StreamCipher().extend({
			_doReset: function () {
				// Shortcuts
				var key = this._key;
				var keyWords = key.words;
				var keySigBytes = key.sigBytes;

				// Init sbox
				var S = this._S = [];
				for (var i = 0; i < 256; i++) {
					S[i] = i;
				}

				// Key setup
				for (var i = 0, j = 0; i < 256; i++) {
					var keyByteIndex = i % keySigBytes;
					var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

					j = (j + S[i] + keyByte) % 256;

					// Swap
					var t = S[i];
					S[i] = S[j];
					S[j] = t;
				}

				// Counters
				this._i = this._j = 0;
			},

			_doProcessBlock: function (M, offset) {
				M[offset] ^= generateKeystreamWord.call(this);
			},

			keySize: 256/32,

			ivSize: 0
		});
	}
}

module.exports = RC4;
