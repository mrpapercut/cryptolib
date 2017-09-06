'use strict';

var chai = require('chai'),
    path = require('path'),
    expect = chai.expect;

var getFilePath = function(filename) {
    return path.join(__dirname, '..', 'lib', filename);
}

const CryptoLib = require(getFilePath('CryptoLib'));
const WordArray = require(getFilePath('WordArray'));

const wordArray = new WordArray();

describe('CryptoLib', function() {
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
});
