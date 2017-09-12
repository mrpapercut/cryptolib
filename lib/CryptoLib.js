const CryptoLib = {};

// Encoders
const Encoder     = require('./Encoder');
CryptoLib.Encoder   = Encoder;

// Hashers
const Hasher      = require("./Hasher");
const md5         = require("./Hashers/md5");
const ripemd160   = require("./Hashers/ripemd160.js");
const sha1        = require("./Hashers/sha1");
const sha224      = require("./Hashers/sha224");
const sha256      = require("./Hashers/sha256");
const sha384      = require("./Hashers/sha384");
const sha512      = require("./Hashers/sha512");
const sha3        = require("./Hashers/sha3");

CryptoLib.MD5       = new Hasher()._createHelper(new md5().algo());
CryptoLib.RIPEMD160 = new Hasher()._createHelper(new ripemd160().algo());
CryptoLib.SHA1      = new Hasher()._createHelper(new sha1().algo());
CryptoLib.SHA224    = new Hasher()._createHelper(new sha224().algo());
CryptoLib.SHA256    = new Hasher()._createHelper(new sha256().algo());
CryptoLib.SHA384    = new Hasher()._createHelper(new sha384().algo());
CryptoLib.SHA512    = new Hasher()._createHelper(new sha512().algo());
CryptoLib.SHA3      = new Hasher()._createHelper(new sha3().algo());

// Hashers with HMAC
CryptoLib.HMAC_MD5       = new Hasher()._createHmacHelper(new md5().algo());
CryptoLib.HMAC_RIPEMD160 = new Hasher()._createHmacHelper(new ripemd160().algo());
CryptoLib.HMAC_SHA1      = new Hasher()._createHmacHelper(new sha1().algo());
CryptoLib.HMAC_SHA224    = new Hasher()._createHmacHelper(new sha224().algo());
CryptoLib.HMAC_SHA256    = new Hasher()._createHmacHelper(new sha256().algo());
CryptoLib.HMAC_SHA384    = new Hasher()._createHmacHelper(new sha384().algo());
CryptoLib.HMAC_SHA512    = new Hasher()._createHmacHelper(new sha512().algo());
CryptoLib.HMAC_SHA3      = new Hasher()._createHmacHelper(new sha3().algo());

// Ciphers
const BlockCipher  = require('./Helpers/BlockCipher');
const StreamCipher = require('./Helpers/StreamCipher');
const AES          = require('./Ciphers/aes');
const DES          = require('./Ciphers/des');
const Rabbit       = require('./Ciphers/rabbit');
const RC4          = require('./Ciphers/rc4');
const RC4Drop      = require('./Ciphers/rc4drop');
const TripleDes    = require('./Ciphers/tripledes');

CryptoLib.AES        = new BlockCipher()._createHelper(new AES().algo());
CryptoLib.DES        = new BlockCipher()._createHelper(new DES().algo());
CryptoLib.TripleDes  = new BlockCipher()._createHelper(new TripleDes().algo());

CryptoLib.Rabbit     = new StreamCipher()._createHelper(new Rabbit().algo());
CryptoLib.RC4        = new StreamCipher()._createHelper(new RC4().algo());
CryptoLib.RC4Drop    = new StreamCipher()._createHelper(new RC4Drop().algo());

// Packers

// Key Derivers
const EvpKDF = require('./Helpers/EvpKDF');
CryptoLib.EvpKDF = function (password, salt, cfg) {
	const evpkdf = new EvpKDF().algo();
	return evpkdf.create(cfg).compute(password, salt);
}

const PBKDF2 = require('./Helpers/PBKDF2');
CryptoLib.PBKDF2 = function (password, salt, cfg) {
	const pbkdf2 = new PBKDF2().algo();
	return pbkdf2.create(cfg).compute(password, salt);
}

module.exports = CryptoLib;
