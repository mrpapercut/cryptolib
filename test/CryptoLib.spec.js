'use strict';

var chai = require('chai'),
    path = require('path'),
    expect = chai.expect;

var getFilePath = function(filename) {
    return path.join(__dirname, '..', 'lib', filename);
}

const CryptoLib = require(getFilePath('CryptoLib'));
console.log(CryptoLib);

describe('CryptoLib', function() {
	describe('Hashers', function() {
		describe('MD5', function() {
			it('should return correct hash', function() {
				expect(CryptoLib.MD5('Hello world!').toString()).to.equal('86fb269d190d2c85f6e0468ceca42a20');
			});
		});

		describe('SHA256', function() {
			it('should return correct hash', function() {
				expect(CryptoLib.SHA256('Hello world!').toString()).to.equal('c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a');
			});
		});

		describe('SHA384', function() {
			it('should return correct hash', function() {
				expect(CryptoLib.SHA384('Hello world!').toString()).to.equal('86255fa2c36e4b30969eae17dc34c772cbebdfc58b58403900be87614eb1a34b8780263f255eb5e65ca9bbb8641cccfe');
			});
		});

		describe('SHA512', function() {
			it('should return correct hash', function() {
				expect(CryptoLib.SHA512('Hello world!').toString()).to.equal('f6cde2a0f819314cdde55fc227d8d7dae3d28cc556222a0a8ad66d91ccad4aad6094f517a2182360c9aacf6a3dc323162cb6fd8cdffedb0fe038f55e85ffb5b6');
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
