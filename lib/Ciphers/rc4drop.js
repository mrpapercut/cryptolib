import RC4 from './rc4';

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

const rc4 = new RC4().algo();

class RC4Drop {
	constructor() {}

	algo() {
		return rc4.extend({
			/**
			 * Configuration options.
			 *
			 * @property {number} drop The number of keystream words to drop. Default 192
			 */
			cfg: rc4.cfg.extend({
				drop: 192
			}),

			_doReset: function () {
				rc4._doReset.call(this);

				// Drop
				for (var i = this.cfg.drop; i > 0; i--) {
					generateKeystreamWord.call(this);
				}
			}
		});
	}
}

export default RC4Drop;
