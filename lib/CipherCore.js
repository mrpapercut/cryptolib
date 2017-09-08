const Base                   = require('./Base');
const BufferedBlockAlgorithm = require('./Helpers/BufferedBlockAlgorithm');
const PasswordBasedCipher    = require('./Helpers/PasswordBasedCipher');
const SerializableCipher     = require('./Helpers/SerializableCipher');

class CipherCore extends BufferedBlockAlgorithm {
	constructor() {
		super();

		this.cfg = new Base().extend();

		this.keySize = 128/32;
		this.ivSize = 128/32;

		this._ENC_XFORM_MODE = 1;
		this._DEC_XFORM_MODE = 2;
	}

	createEncryptor(key, cfg) {
		return this.create(this._ENC_XFORM_MODE, key, cfg);
	}

	createDecryptor(key, cfg) {
		return this.create(this._DEC_XFORM_MODE, key, cfg);
	}

	init(xformMode, key, cfg) {
		// Apply config defaults
		this.cfg = this.cfg.extend(cfg);

		// Store transform mode and key
		this._xformMode = xformMode;
		this._key = key;

		// Set initial values
		this.reset();
	}

	reset() {
		// Reset data buffer
		super.reset.call(this);

		// Perform concrete-cipher logic
		this._doReset();
	}

	process(dataUpdate) {
		// Append
		this._append(dataUpdate);

		// Process available blocks
		return this._process();
	}

	finalize(dataUpdate) {
		// Final data update
		if (dataUpdate) {
			this._append(dataUpdate);
		}

		// Perform concrete-cipher logic
		var finalProcessedData = this._doFinalize();

		return finalProcessedData;
	}

	_createHelper(cipher) {
		console.log(cipher);
		function selectCipherStrategy(key) {
			if (typeof key == 'string') {
				return PasswordBasedCipher;
			} else {
				return SerializableCipher;
			}
		}

		return (function (cipher) {
			return {
				encrypt: function (message, key, cfg) {
					console.log(cipher);
					const cipherStrategy = selectCipherStrategy(key);
					return new cipherStrategy().encrypt(cipher, message, key, cfg);
				},

				decrypt: function (ciphertext, key, cfg) {
					const cipherStrategy = selectCipherStrategy(key);
					return new cipherStrategy().decrypt(cipher, ciphertext, key, cfg);
				}
			};
		})(cipher);
	}
}

module.exports = CipherCore;
