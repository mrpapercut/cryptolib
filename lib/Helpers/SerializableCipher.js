const Base = require('../Base');
const OpenSSLFormatter = require('./OpenSSLFormatter');
const CipherParams = require('./CipherParams');

class SerializableCipher extends Base {
	constructor() {
		super();

		this.cfg = super.extend({
			format: OpenSSLFormatter
		});
	}

	/**
	 * Encrypts a message.
	 *
	 * @param {Cipher} cipher The cipher algorithm to use.
	 * @param {WordArray|string} message The message to encrypt.
	 * @param {WordArray} key The key.
	 * @param {Object} cfg (Optional) The configuration options to use for this operation.
	 *
	 * @return {CipherParams} A cipher params object.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
	 *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
	 *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	 */
	encrypt(cipher, message, key, cfg) {
		// Apply config defaults
		cfg = this.cfg.extend(cfg);

		// Encrypt
		var encryptor = cipher.createEncryptor(key, cfg);
		var ciphertext = encryptor.finalize(message);

		// Shortcut
		var cipherCfg = encryptor.cfg;

		// Create and return serializable cipher params
		return new CipherParams().create({
			ciphertext: ciphertext,
			key: key,
			iv: cipherCfg.iv,
			algorithm: cipher,
			mode: cipherCfg.mode,
			padding: cipherCfg.padding,
			blockSize: cipher.blockSize,
			formatter: cfg.format
		});
	}

	/**
	 * Decrypts serialized ciphertext.
	 *
	 * @param {Cipher} cipher The cipher algorithm to use.
	 * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	 * @param {WordArray} key The key.
	 * @param {Object} cfg (Optional) The configuration options to use for this operation.
	 *
	 * @return {WordArray} The plaintext.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	 *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	 */
	decrypt(cipher, ciphertext, key, cfg) {
		// Apply config defaults
		cfg = this.cfg.extend(cfg);

		// Convert string to CipherParams
		ciphertext = this._parse(ciphertext, cfg.format);

		// Decrypt
		var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

		return plaintext;
	}

	/**
	 * Converts serialized ciphertext to CipherParams,
	 * else assumed CipherParams already and returns ciphertext unchanged.
	 *
	 * @param {CipherParams|string} ciphertext The ciphertext.
	 * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
	 *
	 * @return {CipherParams} The unserialized ciphertext.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
	 */
	_parse(ciphertext, format) {
		if (typeof ciphertext == 'string') {
			return format.parse(ciphertext, this);
		} else {
			return ciphertext;
		}
	}
}

module.exports = SerializableCipher;
