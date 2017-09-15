import Base from '../Base';

class BlockCipherMode extends Base {
	constructor() {
		super();
	}

	/**
	 * Creates this mode for encryption.
	 *
	 * @param {Cipher} cipher A block cipher instance.
	 * @param {Array} iv The IV words.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
	 */
	createEncryptor(cipher, iv) {
		return this.Encryptor.create(cipher, iv);
	}

	/**
	 * Creates this mode for decryption.
	 *
	 * @param {Cipher} cipher A block cipher instance.
	 * @param {Array} iv The IV words.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
	 */
	createDecryptor(cipher, iv) {
		return this.Decryptor.create(cipher, iv);
	}

	/**
	 * Initializes a newly created mode.
	 *
	 * @param {Cipher} cipher A block cipher instance.
	 * @param {Array} iv The IV words.
	 *
	 * @example
	 *
	 *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
	 */
	init(cipher, iv) {
		this._cipher = cipher;
		this._iv = iv;
	}
}

export default BlockCipherMode;
