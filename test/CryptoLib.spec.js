'use strict';

var chai = require('chai'),
    path = require('path'),
    expect = chai.expect;

var getFilePath = function(filename) {
    return path.join(__dirname, '..', 'lib', filename);
}

const CryptoLib = require(getFilePath('CryptoLib'));
const WordArray = require(getFilePath('WordArray'));
const Latin1    = require(getFilePath('./Encoders/Latin1'));

const wordArray = new WordArray();

describe('CryptoLib', function() {
	describe('Ciphers', function() {
		const encrypted = {
			AES: {
				length: 44
			},
			DES: {
				length: 44
			},
			TripleDes: {
				length: 44
			},
			Rabbit: {
				length: 40
			},
			RC4: {
				length: 40
			},
			RC4Drop: {
				length: 40
			}
		};

		for (let cipher in encrypted) {
			describe(cipher, function() {
				const encryptedStr = CryptoLib[cipher].encrypt('Hello world!', 'foobar').toString();

				it('should encrypt string', function() {
					expect(encryptedStr.length).to.equal(encrypted[cipher].length);
				});

				it('should decrypt string to original', function() {
					expect(CryptoLib[cipher].decrypt(encryptedStr, 'foobar').toString(Latin1)).to.equal('Hello world!');
				});
			});
		}
	});

	describe('Encoders', function() {
		const encoded = {
			Base64: 'SGVsbG8gd29ybGQh',
			Hex: '48656c6c6f20776f726c6421',
			Latin1: 'Hello world!',
			Utf8: 'Hello world!',
			Utf16: '䡥汬漠睯牬搡',
			Utf16BE: '䡥汬漠睯牬搡',
			Utf16LE: '效汬⁯潷汲Ⅴ'
		}

		for (let str in encoded) {
			describe(str, function() {
				let myStr = CryptoLib.Encoder.Latin1.parse(unescape(encodeURIComponent('Hello world!')));

				it('should stringify to match the pre-encoded string', function() {
					expect(CryptoLib.Encoder[str].stringify(myStr).toString()).to.equal(encoded[str]);
				});

				it('should parse to match the original string', function() {
					expect(CryptoLib.Encoder[str].parse(encoded[str]).toString()).to.equal(myStr.toString());
				});
			});
		}
	});

	describe('Hashers', function() {
		const hashes = {
			MD5: '86fb269d190d2c85f6e0468ceca42a20',
			RIPEMD160: '7f772647d88750add82d8e1a7a3e5c0902a346a3',
			SHA1: 'd3486ae9136e7856bc42212385ea797094475802',
			SHA224: '7e81ebe9e604a0c97fef0e4cfe71f9ba0ecba13332bde953ad1c66e4',
			SHA256: 'c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a',
			SHA384: '86255fa2c36e4b30969eae17dc34c772cbebdfc58b58403900be87614eb1a34b8780263f255eb5e65ca9bbb8641cccfe',
			SHA512: 'f6cde2a0f819314cdde55fc227d8d7dae3d28cc556222a0a8ad66d91ccad4aad6094f517a2182360c9aacf6a3dc323162cb6fd8cdffedb0fe038f55e85ffb5b6',
			SHA3: '4010e792acb33c767f1bd0a49619769bf044eef2e8aca32717149dbc95e2b27ddc24aa8528c6a7f2a18b926c45d0aff290c18f1edfa04fce3ce91b7c69f3e5f5'
		}

		for (let hasher in hashes) {
			describe(hasher, function() {
				it('should match the precalculated hash', function() {
					expect(CryptoLib[hasher]('Hello world!').toString()).to.equal(hashes[hasher]);
				});
			});
		}
	});

	describe('Hashers with HMAC', function() {
		const message = 'Hello world!';
		const key = 'foobar';

		const hashes = {
			HMAC_MD5: '197786ad5a5a186e1c57ffab8de78de6',
			HMAC_RIPEMD160: '52419296d2a46d3675a9aaaeff7d68c75d2f41c1',
			HMAC_SHA1: '8dd350dd2c990c6ec9033b60ad6f41bd29d5c5cf',
			HMAC_SHA224: 'edb140a5e37cccfe8e526a09879dba9013731cd5d5db075791b1d2ee',
			HMAC_SHA256: '28d4e22bf0598af9d6f21d7079427396e62d162dabf3cfe71946795d576c9fa9',
			HMAC_SHA384: '267884f4974040096177745e950e692e4cb29fde5d4b730e8c5501374bf06ccd94604c50a81db420ffe4b39403708cfa',
			HMAC_SHA512: '65bb3d2c37c1ff3b3c0aec3f9b7673d4ee1ce7873d5cef89f12e1a97ed2aee94d52dc5166b789150e643a14209c33eabdea36e3e3eb54c45e0cdbe0e41d07f4e',
			HMAC_SHA3: '789db8a3b1246a4a337909337f4119b9530443f4e0fa2cd6a544aef58e226ea13fa52509fdaad02ef6c8c3a157fbf1399c1e832e5432494060a3c8d0c07a2cac'
		}

		for (let hasher in hashes) {
			describe(hasher, function() {
				it('should match the precalculated hash', function() {
					expect(CryptoLib[hasher](message, key).toString()).to.equal(hashes[hasher]);
				});
			});
		}
	});

	describe('Key Derivers', function() {
		const message = 'Hello world!';
		const key = 'foobar';

		describe('EvpKDF', function() {
			it('should return correct hex-string', function() {
				expect(CryptoLib.EvpKDF(message, key).toString()).to.equal('9eea7c53efe4571fec80019633766b9f');
			});
		});

		describe('PBKDF2', function() {
			it('should return correct hex-string', function() {
				expect(CryptoLib.PBKDF2(message, key).toString()).to.equal('0b5554c7d3271e67600bf65bcb670e9a');
			});
		});
	});

	describe('Packers', function() {

	});
});
