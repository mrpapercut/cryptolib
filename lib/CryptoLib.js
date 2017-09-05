// Hashers
const Hasher      = require('./Hasher');
const md5         = require('./Hashers/md5');
const ripemd160   = require('./Hashers/ripemd160.js');
const sha224      = require('./Hashers/sha224');
const sha256      = require('./Hashers/sha256');
const sha384      = require('./Hashers/sha384');
const sha512      = require('./Hashers/sha512');
const sha3        = require('./Hashers/sha3');

exports.MD5       = new Hasher()._createHelper(new md5().algo());
exports.RIPEMD160 = new Hasher()._createHelper(new ripemd160().algo());
exports.SHA224    = new Hasher()._createHelper(new sha224().algo());
exports.SHA256    = new Hasher()._createHelper(new sha256().algo());
exports.SHA384    = new Hasher()._createHelper(new sha384().algo());
exports.SHA512    = new Hasher()._createHelper(new sha512().algo());
exports.SHA3      = new Hasher()._createHelper(new sha3().algo());
