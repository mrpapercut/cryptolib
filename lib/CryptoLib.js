const Hasher = require('./Hasher');

// Hashers
const md5    = require('./Hashers/md5');
const sha256 = require('./Hashers/sha256');
const sha384 = require('./Hashers/sha384');
const sha512 = require('./Hashers/sha512');
exports.MD5    = new Hasher()._createHelper(new md5().algo());
exports.SHA256 = new Hasher()._createHelper(new sha256().algo());
exports.SHA384 = new Hasher()._createHelper(new sha384().algo());
exports.SHA512 = new Hasher()._createHelper(new sha512().algo());
