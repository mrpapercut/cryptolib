'use strict';

var chai = require('chai'),
    path = require('path'),
    expect = chai.expect;

var getFilePath = function(filename) {
    return path.join(__dirname, '..', 'lib', filename);
}

var getNewInstance = function() {
    var instance = require(getFilePath('CryptoLib'));
    return new instance();
}

var CryptoLib;

/*
const cryptolib = new CryptoLib();

/** Tests
 * Hashes of "Hello world!"
 * MD5:    86fb269d190d2c85f6e0468ceca42a20
 * SHA256: c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a
 * SHA384: 86255fa2c36e4b30969eae17dc34c772cbebdfc58b58403900be87614eb1a34b8780263f255eb5e65ca9bbb8641cccfe
 * SHA512: f6cde2a0f819314cdde55fc227d8d7dae3d28cc556222a0a8ad66d91ccad4aad6094f517a2182360c9aacf6a3dc323162cb6fd8cdffedb0fe038f55e85ffb5b6
 *
console.log('MD5:', cryptolib.algo.MD5('Hello world!').toString() === '86fb269d190d2c85f6e0468ceca42a20');
console.log('SHA256:', cryptolib.algo.SHA256('Hello world!').toString() === 'c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a');
console.log('SHA384:', cryptolib.algo.SHA384('Hello world!').toString() === '86255fa2c36e4b30969eae17dc34c772cbebdfc58b58403900be87614eb1a34b8780263f255eb5e65ca9bbb8641cccfe');
console.log('SHA512:', cryptolib.algo.SHA512('Hello world!').toString() === 'f6cde2a0f819314cdde55fc227d8d7dae3d28cc556222a0a8ad66d91ccad4aad6094f517a2182360c9aacf6a3dc323162cb6fd8cdffedb0fe038f55e85ffb5b6');
*/

describe('CryptoLib', function() {
	describe('Hashers', function() {
		describe('MD5', function() {
			CryptoLib = getNewInstance();

			it('should return correct hash', function() {
				expect(CryptoLib.algo.MD5('Hello world!').toString()).to.equal('86fb269d190d2c85f6e0468ceca42a20');
			});
		});

		describe('SHA256', function() {
			CryptoLib = getNewInstance();

			it('should return correct hash', function() {
				expect(CryptoLib.algo.SHA256('Hello world!').toString()).to.equal('c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a');
			});
		});

		/*
		describe('SHA384', function() {
			CryptoLib = getNewInstance();

			it('should return correct hash', function() {
				expect(CryptoLib.algo.SHA384('Hello world!').toString()).to.equal('86255fa2c36e4b30969eae17dc34c772cbebdfc58b58403900be87614eb1a34b8780263f255eb5e65ca9bbb8641cccfe');
			});
		});
        */

		describe('SHA512', function() {
			CryptoLib = getNewInstance();

			it('should return correct hash', function() {
				expect(CryptoLib.algo.SHA512('Hello world!').toString()).to.equal('f6cde2a0f819314cdde55fc227d8d7dae3d28cc556222a0a8ad66d91ccad4aad6094f517a2182360c9aacf6a3dc323162cb6fd8cdffedb0fe038f55e85ffb5b6');
			});
		});

        /*
		describe('SHA3', function() {
			CryptoLib = getNewInstance();

			it('should return hash ???', function() {
				expect(CryptoLib.algo.SHA3('Hello world!').toString()).to.equal('???');
			});
		});
		*/
	});
});
