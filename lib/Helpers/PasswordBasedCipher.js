const SerializableCipher = require('./SerializableCipher');
const OpenSSLKdf = require('./OpenSSLKdf');

/**
 * A serializable cipher wrapper that derives the key from a password,
 * and returns ciphertext as a serializable cipher params object.
 */
class PasswordBasedCipher extends SerializableCipher {
	constructor() {
		super();
		this.cfg = new SerializableCipher().cfg.extend({
			kdf: new OpenSSLKdf()
		});
	}

	/**
	 * Encrypts a message using a password.
	 *
	 * @param {Cipher} cipher The cipher algorithm to use.
	 * @param {WordArray|string} message The message to encrypt.
	 * @param {string} password The password.
	 * @param {Object} cfg (Optional) The configuration options to use for this operation.
	 *
	 * @return {CipherParams} A cipher params object.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
	 *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
	 */
	encrypt(cipher, message, password, cfg) {
		// Apply config defaults
		cfg = this.cfg.extend(cfg);

		// Derive key and other params
		var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

		// Add IV to config
		cfg.iv = derivedParams.iv;

		// Encrypt
		var ciphertext = new SerializableCipher().encrypt.call(this, cipher, message, derivedParams.key, cfg);

		// Mix in derived params
		ciphertext.mixIn(derivedParams);

		return ciphertext;
	}

	/**
	 * Decrypts serialized ciphertext using a password.
	 *
	 * @param {Cipher} cipher The cipher algorithm to use.
	 * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	 * @param {string} password The password.
	 * @param {Object} cfg (Optional) The configuration options to use for this operation.
	 *
	 * @return {WordArray} The plaintext.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
	 *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
	 */
	decrypt(cipher, ciphertext, password, cfg) {
		// Apply config defaults
		cfg = this.cfg.extend(cfg);

		// Convert string to CipherParams
		ciphertext = this._parse(ciphertext, cfg.format);

		// Derive key and other params
		var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

		// Add IV to config
		cfg.iv = derivedParams.iv;

		// Decrypt
		var plaintext = new SerializableCipher().decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

		return plaintext;
	}
}

module.exports = PasswordBasedCipher;
