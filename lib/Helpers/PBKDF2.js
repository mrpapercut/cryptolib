import Base      from '../Base';
import WordArray from '../WordArray';
import HMAC      from '../Hashers/hmac';
import SHA1      from '../Hashers/sha1';

class PBKDF2 {
	constructor() {

	}

	algo() {
		return new Base().extend({
			/**
			 * Configuration options.
			 *
			 * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
			 * @property {Hasher} hasher The hasher to use. Default: SHA1
			 * @property {number} iterations The number of iterations to perform. Default: 1
			 */
			cfg: new Base().extend({
				keySize: 128/32,
				hasher: new SHA1().algo(),
				iterations: 1
			}),

			/**
			 * Initializes a newly created key derivation function.
			 *
			 * @param {Object} cfg (Optional) The configuration options to use for the derivation.
			 *
			 * @example
			 *
			 *     var kdf = CryptoJS.algo.PBKDF2.create();
			 *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
			 *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
			 */
			init: function (cfg) {
				this.cfg = this.cfg.extend(cfg);
			},

			/**
			 * Computes the Password-Based Key Derivation Function 2.
			 *
			 * @param {WordArray|string} password The password.
			 * @param {WordArray|string} salt A salt.
			 *
			 * @return {WordArray} The derived key.
			 *
			 * @example
			 *
			 *     var key = kdf.compute(password, salt);
			 */
			compute: function (password, salt) {
				// Shortcut
				var cfg = this.cfg;

				// Init HMAC
				var hmac = new HMAC().algo().create(cfg.hasher, password);

				// Initial values
				var derivedKey = new WordArray().create();
				var blockIndex = new WordArray().create([0x00000001]);

				// Shortcuts
				var derivedKeyWords = derivedKey.words;
				var blockIndexWords = blockIndex.words;
				var keySize = cfg.keySize;
				var iterations = cfg.iterations;

				// Generate key
				while (derivedKeyWords.length < keySize) {
					var block = hmac.update(salt).finalize(blockIndex);
					hmac.reset();

					// Shortcuts
					var blockWords = block.words;
					var blockWordsLength = blockWords.length;

					// Iterations
					var intermediate = block;
					for (var i = 1; i < iterations; i++) {
						intermediate = hmac.finalize(intermediate);
						hmac.reset();

						// Shortcut
						var intermediateWords = intermediate.words;

						// XOR intermediate with block
						for (var j = 0; j < blockWordsLength; j++) {
							blockWords[j] ^= intermediateWords[j];
						}
					}

					derivedKey.concat(block);
					blockIndexWords[0]++;
				}
				derivedKey.sigBytes = keySize * 4;

				return derivedKey;
			}
		})
	}
}

export default PBKDF2;
