// Encoders
const Encoder     = require('./Encoder');
// const Base64      = require('./Encoders/Base64');
// const Hex         = require('./Encoders/Hex');
// const Latin1      = require('./Encoders/Latin1');
// const UTF8        = require('./Encoders/UTF8');
// const UTF16BE     = require('./Encoders/UTF16').UTF16BE;
// const UTF16LE     = require('./Encoders/UTF16').UTF16LE;
exports.Encoder   = Encoder;

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

exports.MD5       = new Hasher()._createHelper(new md5().algo());
exports.RIPEMD160 = new Hasher()._createHelper(new ripemd160().algo());
exports.SHA1      = new Hasher()._createHelper(new sha1().algo());
exports.SHA224    = new Hasher()._createHelper(new sha224().algo());
exports.SHA256    = new Hasher()._createHelper(new sha256().algo());
exports.SHA384    = new Hasher()._createHelper(new sha384().algo());
exports.SHA512    = new Hasher()._createHelper(new sha512().algo());
exports.SHA3      = new Hasher()._createHelper(new sha3().algo());

// Hashers with HMAC
exports.HMAC_MD5       = new Hasher()._createHmacHelper(new md5().algo());
exports.HMAC_RIPEMD160 = new Hasher()._createHmacHelper(new ripemd160().algo());
exports.HMAC_SHA1      = new Hasher()._createHmacHelper(new sha1().algo());
exports.HMAC_SHA224    = new Hasher()._createHmacHelper(new sha224().algo());
exports.HMAC_SHA256    = new Hasher()._createHmacHelper(new sha256().algo());
exports.HMAC_SHA384    = new Hasher()._createHmacHelper(new sha384().algo());
exports.HMAC_SHA512    = new Hasher()._createHmacHelper(new sha512().algo());
exports.HMAC_SHA3      = new Hasher()._createHmacHelper(new sha3().algo());

// Ciphers

// Packers

// Helpers
const EvpKDF = require('./EvpKDF');
exports.EvpKDF = function (password, salt, cfg) {
	const evpkdf = new EvpKDF().algo();
	return evpkdf.create(cfg).compute(password, salt);
}
