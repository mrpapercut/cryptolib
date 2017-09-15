var AES = (function () {
'use strict';

function F() {}

class Base {
    constructor() {}

    extend(overrides) {
        F.prototype = this;
        var subtype = new F();
        if (overrides) subtype.mixIn(overrides);
        if (!subtype.hasOwnProperty("init")) {
            subtype.init = function() {
                subtype.$super.init.apply(this, arguments);
            };
        }
        subtype.init.prototype = subtype;
        subtype.$super = this;
        return subtype;
    }

    create() {
        var instance = this.extend();
        instance.init.apply(instance, arguments);
        return instance;
    }

    init() {}

    mixIn(properties) {
        for (var propertyName in properties) {
            if (properties.hasOwnProperty(propertyName)) {
                this[propertyName] = properties[propertyName];
            }
        }

        if (properties.hasOwnProperty("toString")) {
            this.toString = properties.toString;
        }
    }

    clone() {
        return this.extend().init.prototype.extend(this);
    }
}

class WordArray extends Base {
    constructor() {
        super();
    }

    init(words, sigBytes) {
        words = this.words = words || [];
        if (sigBytes != undefined) {
            this.sigBytes = sigBytes;
        } else {
            this.sigBytes = words.length * 4;
        }

        return this;
    }

    toString(encoder) {
        return (encoder ? encoder.stringify : function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
            }
            return hexChars.join("");
        })(this);
    }

    concat(wordArray) {
        var thisWords = this.words;
        var thatWords = wordArray.words;
        var thisSigBytes = this.sigBytes;
        var thatSigBytes = wordArray.sigBytes;
        this.clamp();

        if (thisSigBytes % 4) {
            for (var i = 0; i < thatSigBytes; i++) {
                var thatByte =
                    (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                thisWords[(thisSigBytes + i) >>> 2] |=
                    thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
            }
        } else if (thatWords.length > 0xffff) {
            for (var i = 0; i < thatSigBytes; i += 4) {
                thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
            }
        } else {
            thisWords.push.apply(thisWords, thatWords);
        }
        this.sigBytes += thatSigBytes;
        return this;
    }

    clamp() {
        var words = this.words;
        var sigBytes = this.sigBytes;
        words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
        words.length = Math.ceil(sigBytes / 4);
    }

    clone() {
        var clone = super.clone.call(this);
        clone.words = this.words.slice(0);
        return clone;
    }

    random(nBytes) {
        var words = [];
        for (var i = 0; i < nBytes; i += 4) {
            words.push((Math.random() * 0x100000000) | 0);
        }

        return new WordArray().init(words, nBytes);
    }
}

const Latin1 = {
	stringify: function (wordArray) {
		var words = wordArray.words;
		var sigBytes = wordArray.sigBytes;
		var latin1Chars = [];
		for (var i = 0; i < sigBytes; i++) {
			var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
			latin1Chars.push(String.fromCharCode(bite));
		}
		return latin1Chars.join('');
	},

	parse: function (latin1Str) {
		var latin1StrLength = latin1Str.length;
		var words = [];
		for (var i = 0; i < latin1StrLength; i++) {
			words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
		}
		return new WordArray().init(words, latin1StrLength);
	}
};

const UTF8 = {
	stringify: function (wordArray) {
		try {
			return decodeURIComponent(escape(Latin1.stringify(wordArray)));
		} catch (e) {
			throw new Error('Malformed UTF-8 data');
		}
	},
	parse: function (utf8Str) {
		return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	}
};

class BufferedBlockAlgorithm extends Base {
    constructor() {
        super();

        this._minBufferSize = 0;
        this._nDataBytes = 0;
        this._data = new WordArray().init();
    }

    reset() {
        this._data = new WordArray().init();
        this._nDataBytes = 0;
    }

    _append(data) {
        if (typeof data == "string") {
            data = UTF8.parse(data);
        }
        this._data.concat(data);
        this._nDataBytes += data.sigBytes;
    }

    _process(doFlush) {
        var data = this._data;
        var dataWords = data.words;
        var dataSigBytes = data.sigBytes;
        var blockSize = this.blockSize;
        var blockSizeBytes = blockSize * 4;

        var nBlocksReady = dataSigBytes / blockSizeBytes;
        if (doFlush) {
            nBlocksReady = Math.ceil(nBlocksReady);
        } else {
            nBlocksReady = Math.max(
                (nBlocksReady | 0) - this._minBufferSize,
                0
            );
        }
        var nWordsReady = nBlocksReady * blockSize;
        var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
        if (nWordsReady) {
            for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                this._doProcessBlock(dataWords, offset);
            }
            var processedWords = dataWords.splice(0, nWordsReady);
            data.sigBytes -= nBytesReady;
        }
        return new WordArray().init(processedWords, nBytesReady);
    }

    clone() {
        var clone = super.clone.call(this);
        clone._data = this._data.clone();

        return clone;
    }
}

const charMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const Base64 = {
    stringify: function (wordArray) {
        // Shortcuts
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;
        var map = charMap;

        // Clamp excess bits
        wordArray.clamp();

        // Convert
        var base64Chars = [];
        for (var i = 0; i < sigBytes; i += 3) {
            var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
            var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
            var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

            var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

            for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
            }
        }

        // Add padding
        var paddingChar = map.charAt(64);
        if (paddingChar) {
            while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
            }
        }

        return base64Chars.join('');
    },

    parse: function (base64Str) {
        // Shortcuts
        var base64StrLength = base64Str.length;
        var map = charMap;

        // Ignore padding
        var paddingChar = map.charAt(64);
        if (paddingChar) {
            var paddingIndex = base64Str.indexOf(paddingChar);
            if (paddingIndex != -1) {
                base64StrLength = paddingIndex;
            }
        }

        // Convert
        var words = [];
        var nBytes = 0;
        for (var i = 0; i < base64StrLength; i++) {
            if (i % 4) {
                var bits1 = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
                var bits2 = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
                words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                nBytes++;
            }
        }

        return new WordArray().create(words, nBytes);
    }
};

/**
 * A collection of cipher parameters.
 *
 * @property {WordArray} ciphertext The raw ciphertext.
 * @property {WordArray} key The key to this ciphertext.
 * @property {WordArray} iv The IV used in the ciphering operation.
 * @property {WordArray} salt The salt used with a key derivation function.
 * @property {Cipher} algorithm The cipher algorithm.
 * @property {Mode} mode The block mode used in the ciphering operation.
 * @property {Padding} padding The padding scheme used in the ciphering operation.
 * @property {number} blockSize The block size of the cipher.
 * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
 */
class CipherParams extends Base {
	constructor() {
		super();
	}

	/**
	 * Initializes a newly created cipher params object.
	 *
	 * @param {Object} cipherParams An object with any of the possible cipher parameters.
	 *
	 * @example
	 *
	 *     var cipherParams = CryptoJS.lib.CipherParams.create({
	 *         ciphertext: ciphertextWordArray,
	 *         key: keyWordArray,
	 *         iv: ivWordArray,
	 *         salt: saltWordArray,
	 *         algorithm: CryptoJS.algo.AES,
	 *         mode: CryptoJS.mode.CBC,
	 *         padding: CryptoJS.pad.PKCS7,
	 *         blockSize: 4,
	 *         formatter: CryptoJS.format.OpenSSL
	 *     });
	 */
	init(cipherParams) {
		this.mixIn(cipherParams);
	}

	/**
	 * Converts this cipher params object to a string.
	 *
	 * @param {Format} formatter (Optional) The formatting strategy to use.
	 *
	 * @return {string} The stringified cipher params.
	 *
	 * @throws Error If neither the formatter nor the default formatter is set.
	 *
	 * @example
	 *
	 *     var string = cipherParams + '';
	 *     var string = cipherParams.toString();
	 *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
	 */
	toString(formatter) {
		return (formatter || this.formatter).stringify(this);
	}
}

class OpenSSLFormatter {
	/**
	 * Converts a cipher params object to an OpenSSL-compatible string.
	 *
	 * @param {CipherParams} cipherParams The cipher params object.
	 *
	 * @return {string} The OpenSSL-compatible string.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
	 */
	stringify(cipherParams) {
		// Shortcuts
		var ciphertext = cipherParams.ciphertext;
		var salt = cipherParams.salt;

		// Format
		if (salt) {
			var wordArray = new WordArray().create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
		} else {
			var wordArray = ciphertext;
		}

		return wordArray.toString(Base64);
	}

	/**
	 * Converts an OpenSSL-compatible string to a cipher params object.
	 *
	 * @param {string} openSSLStr The OpenSSL-compatible string.
	 *
	 * @return {CipherParams} The cipher params object.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
	 */
	parse(openSSLStr) {
		// Parse base64
		var ciphertext = Base64.parse(openSSLStr);

		// Shortcut
		var ciphertextWords = ciphertext.words;

		// Test for salt
		if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
			// Extract salt
			var salt = new WordArray().create(ciphertextWords.slice(2, 4));

			// Remove salt from ciphertext
			ciphertextWords.splice(0, 4);
			ciphertext.sigBytes -= 16;
		}

		return new CipherParams().create({ ciphertext: ciphertext, salt: salt });
	}
}

class SerializableCipher extends Base {
	constructor() {
		super();

		this.cfg = super.extend({
			format: new OpenSSLFormatter()
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

class HMAC {
	constructor() {

	}

	algo() {
		return new Base().extend({
			/**
			 * Initializes a newly created HMAC.
			 *
			 * @param {Hasher} hasher The hash algorithm to use.
			 * @param {WordArray|string} key The secret key.
			 *
			 * @example
			 *
			 *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
			 */
			init: function (hasher, key) {
				// Init hasher
				hasher = this._hasher = new hasher.init();

				// Convert string to WordArray, else assume WordArray already
				if (typeof key == 'string') {
					key = UTF8.parse(key);
				}

				// Shortcuts
				var hasherBlockSize = hasher.blockSize;
				var hasherBlockSizeBytes = hasherBlockSize * 4;

				// Allow arbitrary length keys
				if (key.sigBytes > hasherBlockSizeBytes) {
					key = hasher.finalize(key);
				}

				// Clamp excess bits
				key.clamp();

				// Clone key for inner and outer pads
				var oKey = this._oKey = key.clone();
				var iKey = this._iKey = key.clone();

				// Shortcuts
				var oKeyWords = oKey.words;
				var iKeyWords = iKey.words;

				// XOR keys with pad constants
				for (var i = 0; i < hasherBlockSize; i++) {
					oKeyWords[i] ^= 0x5c5c5c5c;
					iKeyWords[i] ^= 0x36363636;
				}
				oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

				// Set initial values
				this.reset();
			},

			/**
			 * Resets this HMAC to its initial state.
			 *
			 * @example
			 *
			 *     hmacHasher.reset();
			 */
			reset: function () {
				// Shortcut
				var hasher = this._hasher;

				// Reset
				hasher.reset();
				hasher.update(this._iKey);
			},

			/**
			 * Updates this HMAC with a message.
			 *
			 * @param {WordArray|string} messageUpdate The message to append.
			 *
			 * @return {HMAC} This HMAC instance.
			 *
			 * @example
			 *
			 *     hmacHasher.update('message');
			 *     hmacHasher.update(wordArray);
			 */
			update: function (messageUpdate) {
				this._hasher.update(messageUpdate);

				// Chainable
				return this;
			},

			/**
			 * Finalizes the HMAC computation.
			 * Note that the finalize operation is effectively a destructive, read-once operation.
			 *
			 * @param {WordArray|string} messageUpdate (Optional) A final message update.
			 *
			 * @return {WordArray} The HMAC.
			 *
			 * @example
			 *
			 *     var hmac = hmacHasher.finalize();
			 *     var hmac = hmacHasher.finalize('message');
			 *     var hmac = hmacHasher.finalize(wordArray);
			 */
			finalize: function (messageUpdate) {
				// Shortcut
				var hasher = this._hasher;

				// Compute HMAC
				var innerHash = hasher.finalize(messageUpdate);
				hasher.reset();
				var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

				return hmac;
			}
		});
	}
}

class Hasher extends BufferedBlockAlgorithm {
    constructor() {
        super();

        this.cfg = super.extend();
        this.blockSize = 512 / 32;
    }

    init(cfg) {
        this.cfg = this.cfg.extend(cfg);
        this.reset();
    }

    reset() {
        super.reset.call(this);
        this._doReset();
    }

    update(messageUpdate) {
        this._append(messageUpdate);
        this._process();
        return this;
    }

    finalize(messageUpdate) {
        if (messageUpdate) this._append(messageUpdate);
        var hash = this._doFinalize();
        return hash;
    }

    _createHelper(hasher) {
        return function(message, cfg) {
            return new hasher.init(cfg).finalize(message);
        };
    }

    _createHmacHelper(hasher) {
        return function(message, key) {
			const hmac = new HMAC().algo();
			hmac.init(hasher, key);
            return hmac.finalize(message);
        };
    }
}

const T = [];

for (var i = 0; i < 64; i++) {
	T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
}

const FF = (a, b, c, d, x, s, t) => {
	var n = a + ((b & c) | (~b & d)) + x + t;
	return ((n << s) | (n >>> (32 - s))) + b;
};

const GG = (a, b, c, d, x, s, t) => {
	var n = a + ((b & d) | (c & ~d)) + x + t;
	return ((n << s) | (n >>> (32 - s))) + b;
};

const HH = (a, b, c, d, x, s, t) => {
	var n = a + (b ^ c ^ d) + x + t;
	return ((n << s) | (n >>> (32 - s))) + b;
};

const II = (a, b, c, d, x, s, t) => {
	var n = a + (c ^ (b | ~d)) + x + t;
	return ((n << s) | (n >>> (32 - s))) + b;
};

class MD5 extends Hasher {
	constructor() {
		super();

		this.T = T;
	}

    /**
     * MD5 hash algorithm.
     */
    algo() {
		return new Hasher().extend({
			_doReset: function () {
				this._hash = new WordArray().init([
					0x67452301, 0xefcdab89,
					0x98badcfe, 0x10325476
				]);
			},

			_doProcessBlock: function (M, offset) {
				// Swap endian
				for (var i = 0; i < 16; i++) {
					// Shortcuts
					var offset_i = offset + i;
					var M_offset_i = M[offset_i];

					M[offset_i] = (
						(((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
						(((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
					);
				}

				// Shortcuts
				var H = this._hash.words;

				var M_offset_0  = M[offset + 0];
				var M_offset_1  = M[offset + 1];
				var M_offset_2  = M[offset + 2];
				var M_offset_3  = M[offset + 3];
				var M_offset_4  = M[offset + 4];
				var M_offset_5  = M[offset + 5];
				var M_offset_6  = M[offset + 6];
				var M_offset_7  = M[offset + 7];
				var M_offset_8  = M[offset + 8];
				var M_offset_9  = M[offset + 9];
				var M_offset_10 = M[offset + 10];
				var M_offset_11 = M[offset + 11];
				var M_offset_12 = M[offset + 12];
				var M_offset_13 = M[offset + 13];
				var M_offset_14 = M[offset + 14];
				var M_offset_15 = M[offset + 15];

				// Working varialbes
				var a = H[0];
				var b = H[1];
				var c = H[2];
				var d = H[3];

				// Computation
				a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
				d = FF(d, a, b, c, M_offset_1,  12, T[1]);
				c = FF(c, d, a, b, M_offset_2,  17, T[2]);
				b = FF(b, c, d, a, M_offset_3,  22, T[3]);
				a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
				d = FF(d, a, b, c, M_offset_5,  12, T[5]);
				c = FF(c, d, a, b, M_offset_6,  17, T[6]);
				b = FF(b, c, d, a, M_offset_7,  22, T[7]);
				a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
				d = FF(d, a, b, c, M_offset_9,  12, T[9]);
				c = FF(c, d, a, b, M_offset_10, 17, T[10]);
				b = FF(b, c, d, a, M_offset_11, 22, T[11]);
				a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
				d = FF(d, a, b, c, M_offset_13, 12, T[13]);
				c = FF(c, d, a, b, M_offset_14, 17, T[14]);
				b = FF(b, c, d, a, M_offset_15, 22, T[15]);

				a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
				d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
				c = GG(c, d, a, b, M_offset_11, 14, T[18]);
				b = GG(b, c, d, a, M_offset_0,  20, T[19]);
				a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
				d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
				c = GG(c, d, a, b, M_offset_15, 14, T[22]);
				b = GG(b, c, d, a, M_offset_4,  20, T[23]);
				a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
				d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
				c = GG(c, d, a, b, M_offset_3,  14, T[26]);
				b = GG(b, c, d, a, M_offset_8,  20, T[27]);
				a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
				d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
				c = GG(c, d, a, b, M_offset_7,  14, T[30]);
				b = GG(b, c, d, a, M_offset_12, 20, T[31]);

				a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
				d = HH(d, a, b, c, M_offset_8,  11, T[33]);
				c = HH(c, d, a, b, M_offset_11, 16, T[34]);
				b = HH(b, c, d, a, M_offset_14, 23, T[35]);
				a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
				d = HH(d, a, b, c, M_offset_4,  11, T[37]);
				c = HH(c, d, a, b, M_offset_7,  16, T[38]);
				b = HH(b, c, d, a, M_offset_10, 23, T[39]);
				a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
				d = HH(d, a, b, c, M_offset_0,  11, T[41]);
				c = HH(c, d, a, b, M_offset_3,  16, T[42]);
				b = HH(b, c, d, a, M_offset_6,  23, T[43]);
				a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
				d = HH(d, a, b, c, M_offset_12, 11, T[45]);
				c = HH(c, d, a, b, M_offset_15, 16, T[46]);
				b = HH(b, c, d, a, M_offset_2,  23, T[47]);

				a = II(a, b, c, d, M_offset_0,  6,  T[48]);
				d = II(d, a, b, c, M_offset_7,  10, T[49]);
				c = II(c, d, a, b, M_offset_14, 15, T[50]);
				b = II(b, c, d, a, M_offset_5,  21, T[51]);
				a = II(a, b, c, d, M_offset_12, 6,  T[52]);
				d = II(d, a, b, c, M_offset_3,  10, T[53]);
				c = II(c, d, a, b, M_offset_10, 15, T[54]);
				b = II(b, c, d, a, M_offset_1,  21, T[55]);
				a = II(a, b, c, d, M_offset_8,  6,  T[56]);
				d = II(d, a, b, c, M_offset_15, 10, T[57]);
				c = II(c, d, a, b, M_offset_6,  15, T[58]);
				b = II(b, c, d, a, M_offset_13, 21, T[59]);
				a = II(a, b, c, d, M_offset_4,  6,  T[60]);
				d = II(d, a, b, c, M_offset_11, 10, T[61]);
				c = II(c, d, a, b, M_offset_2,  15, T[62]);
				b = II(b, c, d, a, M_offset_9,  21, T[63]);

				// Intermediate hash value
				H[0] = (H[0] + a) | 0;
				H[1] = (H[1] + b) | 0;
				H[2] = (H[2] + c) | 0;
				H[3] = (H[3] + d) | 0;
			},

			_doFinalize: function () {
				// Shortcuts
				var data = this._data;
				var dataWords = data.words;

				var nBitsTotal = this._nDataBytes * 8;
				var nBitsLeft = data.sigBytes * 8;

				// Add padding
				dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

				var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
				var nBitsTotalL = nBitsTotal;
				dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
					(((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
					(((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
				);
				dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
					(((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
					(((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
				);

				data.sigBytes = (dataWords.length + 1) * 4;

				// Hash final blocks
				this._process();

				// Shortcuts
				var hash = this._hash;
				var H = hash.words;

				// Swap endian
				for (var i = 0; i < 4; i++) {
					// Shortcut
					var H_i = H[i];

					H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
						   (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
				}

				// Return final computed hash
				return hash;
			},

			clone: function () {
				var clone = new Hasher().clone.call(this);
				clone._hash = this._hash.clone();

				return clone;
			}
		});
    }
}

const base = new Base();

class EvpKDF {
	constructor() {

	}

	algo() {
		return base.extend({
			/**
			 * Configuration options.
			 *
			 * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
			 * @property {Hasher} hasher The hash algorithm to use. Default: MD5
			 * @property {number} iterations The number of iterations to perform. Default: 1
			 */
			cfg: base.extend({
				keySize: 128/32,
				hasher: new MD5().algo(),
				iterations: 1
			}),

			/**
			 * Initializes a newly created key derivation function.
			 *
			 * @param {Object} cfg (Optional) The configuration options to use for the derivation.
			 *
			 * @example
			 *
			 *     var kdf = CryptoJS.algo.EvpKDF.create();
			 *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
			 *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
			 */
			init: function (cfg) {
				this.cfg = this.cfg.extend(cfg);
			},

			/**
			 * Derives a key from a password.
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

				// Init hasher
				var hasher = cfg.hasher.create();

				// Initial values
				var derivedKey = new WordArray().create();

				// Shortcuts
				var derivedKeyWords = derivedKey.words;
				var keySize = cfg.keySize;
				var iterations = cfg.iterations;

				// Generate key
				while (derivedKeyWords.length < keySize) {
					if (block) {
						hasher.update(block);
					}
					var block = hasher.update(password).finalize(salt);
					hasher.reset();

					// Iterations
					for (var i = 1; i < iterations; i++) {
						block = hasher.finalize(block);
						hasher.reset();
					}

					derivedKey.concat(block);
				}
				derivedKey.sigBytes = keySize * 4;

				return derivedKey;
			}
		});
	}
}

class OpenSSLKdf {
	/**
	 * Derives a key and IV from a password.
	 *
	 * @param {string} password The password to derive from.
	 * @param {number} keySize The size in words of the key to generate.
	 * @param {number} ivSize The size in words of the IV to generate.
	 * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
	 *
	 * @return {CipherParams} A cipher params object with the key, IV, and salt.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
	 *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
	 */
	execute(password, keySize, ivSize, salt) {
		// Generate random salt
		if (!salt) {
			salt = new WordArray().random(64/8);
		}

		// Derive key and IV
		var key = new EvpKDF().algo().create({ keySize: keySize + ivSize }).compute(password, salt);

		// Separate key and IV
		var iv = new WordArray().create(key.words.slice(keySize), ivSize * 4);
		key.sigBytes = keySize * 4;

		// Return params
		return new CipherParams().create({ key: key, iv: iv, salt: salt });
	}
}

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

class CBC extends BlockCipherMode {
	constructor() {
		super();

		this.Encryptor = this.extend({
			/**
			 * Processes the data block at offset.
			 *
			 * @param {Array} words The data words to operate on.
			 * @param {number} offset The offset where the block starts.
			 *
			 * @example
			 *
			 *     mode.processBlock(data.words, offset);
			 */
			processBlock: function (words, offset) {
				// Shortcuts
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;

				// XOR and encrypt
				this.xorBlock(words, offset, blockSize);
				cipher.encryptBlock(words, offset);

				// Remember this block to use with next block
				this._prevBlock = words.slice(offset, offset + blockSize);
			}
		});

		/**
		 * CBC decryptor.
		 */
		this.Decryptor = this.extend({
			/**
			 * Processes the data block at offset.
			 *
			 * @param {Array} words The data words to operate on.
			 * @param {number} offset The offset where the block starts.
			 *
			 * @example
			 *
			 *     mode.processBlock(data.words, offset);
			 */
			processBlock: function (words, offset) {
				// Shortcuts
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;

				// Remember this block to use with next block
				var thisBlock = words.slice(offset, offset + blockSize);

				// Decrypt and XOR
				cipher.decryptBlock(words, offset);
				this.xorBlock(words, offset, blockSize);

				// This block becomes the previous block
				this._prevBlock = thisBlock;
			}
		});
	}

	xorBlock(words, offset, blockSize) {
		// Shortcut
		var iv = this._iv;

		// Choose mixing block
		if (iv) {
			var block = iv;

			// Remove IV for subsequent blocks
			this._iv = undefined;
		} else {
			var block = this._prevBlock;
		}

		// XOR blocks
		for (var i = 0; i < blockSize; i++) {
			words[offset + i] ^= block[i];
		}
	}
}

/**
 * PKCS #5/7 padding strategy.
 */
class Pkcs7 {
	/**
	 * Pads data using the algorithm defined in PKCS #5/7.
	 *
	 * @param {WordArray} data The data to pad.
	 * @param {number} blockSize The multiple that the data should be padded to.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
	 */
	pad(data, blockSize) {
		// Shortcut
		var blockSizeBytes = blockSize * 4;

		// Count padding bytes
		var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

		// Create padding word
		var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

		// Create padding
		var paddingWords = [];
		for (var i = 0; i < nPaddingBytes; i += 4) {
			paddingWords.push(paddingWord);
		}
		var padding = new WordArray().create(paddingWords, nPaddingBytes);

		// Add padding
		data.concat(padding);
	}

	/**
	 * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
	 *
	 * @param {WordArray} data The data to unpad.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     CryptoJS.pad.Pkcs7.unpad(wordArray);
	 */
	unpad(data) {
		// Get number of padding bytes from last byte
		var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

		// Remove padding
		data.sigBytes -= nPaddingBytes;
	}
}

class BlockCipher extends CipherCore {
	constructor() {
		super();

		this.cfg = new CipherCore().cfg.extend({
			mode: new CBC(),
			padding: new Pkcs7()
		});

		this.blockSize = 128/32;
	}

	reset() {
		// Reset cipher
		super.reset.call(this);

		// Shortcuts
		var cfg = this.cfg;
		var iv = cfg.iv;
		var mode = cfg.mode;

		// Reset block mode
		if (this._xformMode == this._ENC_XFORM_MODE) {
			var modeCreator = mode.createEncryptor;
		} else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
			var modeCreator = mode.createDecryptor;

			// Keep at least one block in the buffer for unpadding
			this._minBufferSize = 1;
		}
		this._mode = modeCreator.call(mode, this, iv && iv.words);
	}

	_doProcessBlock(words, offset) {
		this._mode.processBlock(words, offset);
	}

	_doFinalize() {
		// Shortcut
		var padding = this.cfg.padding;

		// Finalize
		if (this._xformMode == this._ENC_XFORM_MODE) {
			// Pad data
			padding.pad(this._data, this.blockSize);

			// Process final blocks
			var finalProcessedBlocks = this._process(!!'flush');
		} else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
			// Process final blocks
			var finalProcessedBlocks = this._process(!!'flush');

			// Unpad data
			padding.unpad(finalProcessedBlocks);
		}

		return finalProcessedBlocks;
	}
}

// Lookup tables
var SBOX = [];
var INV_SBOX = [];
var SUB_MIX_0 = [];
var SUB_MIX_1 = [];
var SUB_MIX_2 = [];
var SUB_MIX_3 = [];
var INV_SUB_MIX_0 = [];
var INV_SUB_MIX_1 = [];
var INV_SUB_MIX_2 = [];
var INV_SUB_MIX_3 = [];

// Compute lookup tables
(function () {
	// Compute double table
	var d = [];
	for (var i = 0; i < 256; i++) {
		if (i < 128) {
			d[i] = i << 1;
		} else {
			d[i] = (i << 1) ^ 0x11b;
		}
	}

	// Walk GF(2^8)
	var x = 0;
	var xi = 0;
	for (var i = 0; i < 256; i++) {
		// Compute sbox
		var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
		sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
		SBOX[x] = sx;
		INV_SBOX[sx] = x;

		// Compute multiplication
		var x2 = d[x];
		var x4 = d[x2];
		var x8 = d[x4];

		// Compute sub bytes, mix columns tables
		var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
		SUB_MIX_0[x] = (t << 24) | (t >>> 8);
		SUB_MIX_1[x] = (t << 16) | (t >>> 16);
		SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
		SUB_MIX_3[x] = t;

		// Compute inv sub bytes, inv mix columns tables
		var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
		INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
		INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
		INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
		INV_SUB_MIX_3[sx] = t;

		// Compute next counter
		if (!x) {
			x = xi = 1;
		} else {
			x = x2 ^ d[d[d[x8 ^ x2]]];
			xi ^= d[d[xi]];
		}
	}
}());

// Precomputed Rcon lookup
var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

class AES$2 {
	constructor() {}

	algo() {
		return new BlockCipher().extend({
			_doReset: function () {
				// Shortcuts
				var key = this._key;
				var keyWords = key.words;
				var keySize = key.sigBytes / 4;

				// Compute number of rounds
				var nRounds = this._nRounds = keySize + 6;

				// Compute number of key schedule rows
				var ksRows = (nRounds + 1) * 4;

				// Compute key schedule
				var keySchedule = this._keySchedule = [];
				for (var ksRow = 0; ksRow < ksRows; ksRow++) {
					if (ksRow < keySize) {
						keySchedule[ksRow] = keyWords[ksRow];
					} else {
						var t = keySchedule[ksRow - 1];

						if (!(ksRow % keySize)) {
							// Rot word
							t = (t << 8) | (t >>> 24);

							// Sub word
							t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

							// Mix Rcon
							t ^= RCON[(ksRow / keySize) | 0] << 24;
						} else if (keySize > 6 && ksRow % keySize == 4) {
							// Sub word
							t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
						}

						keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
					}
				}

				// Compute inv key schedule
				var invKeySchedule = this._invKeySchedule = [];
				for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
					var ksRow = ksRows - invKsRow;

					if (invKsRow % 4) {
						var t = keySchedule[ksRow];
					} else {
						var t = keySchedule[ksRow - 4];
					}

					if (invKsRow < 4 || ksRow <= 4) {
						invKeySchedule[invKsRow] = t;
					} else {
						invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
												   INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
					}
				}
			},

			encryptBlock: function (M, offset) {
				this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
			},

			decryptBlock: function (M, offset) {
				// Swap 2nd and 4th rows
				var t = M[offset + 1];
				M[offset + 1] = M[offset + 3];
				M[offset + 3] = t;

				this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

				// Inv swap 2nd and 4th rows
				var t = M[offset + 1];
				M[offset + 1] = M[offset + 3];
				M[offset + 3] = t;
			},

			_doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
				// Shortcut
				var nRounds = this._nRounds;

				// Get input, add round key
				var s0 = M[offset]     ^ keySchedule[0];
				var s1 = M[offset + 1] ^ keySchedule[1];
				var s2 = M[offset + 2] ^ keySchedule[2];
				var s3 = M[offset + 3] ^ keySchedule[3];

				// Key schedule row counter
				var ksRow = 4;

				// Rounds
				for (var round = 1; round < nRounds; round++) {
					// Shift rows, sub bytes, mix columns, add round key
					var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
					var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
					var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
					var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

					// Update state
					s0 = t0;
					s1 = t1;
					s2 = t2;
					s3 = t3;
				}

				// Shift rows, sub bytes, add round key
				var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
				var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
				var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
				var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

				// Set output
				M[offset]     = t0;
				M[offset + 1] = t1;
				M[offset + 2] = t2;
				M[offset + 3] = t3;
			},

			keySize: 256/32
		});
	}
}

const AES         = new BlockCipher()._createHelper(new AES$2().algo());

return AES;

}());
