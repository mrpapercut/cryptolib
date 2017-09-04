
const CryptoBase = require('./CryptoBase');
const BufferedBlockAlgorithm = require('./BufferedBlockAlgorithm');
const Hasher = require('./Hasher');
const Encoder = require('./Encoder');
const x64Core = require('./x64-core');

// Hashers
const MD5    = require('./Hashers/md5');
const SHA256 = require('./Hashers/sha256');
const SHA384 = require('./Hashers/sha384');
const SHA512 = require('./Hashers/sha512');

class CryptoLib {
	constructor() {
		this.Hasher = new Hasher();
		this.Encoder = Encoder;
		this.algo = {
			MD5: this.Hasher._createHelper(new MD5().algo()),
			SHA256: this.Hasher._createHelper(new SHA256().algo()),
			SHA384: this.Hasher._createHelper(new SHA384().algo()),
			SHA512: this.Hasher._createHelper(new SHA512().algo()),
		};
		this.x64 = x64Core;
	}
}

module.exports = CryptoLib;
