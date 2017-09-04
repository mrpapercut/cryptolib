const Hex    = require('./Hex');
const Latin1 = require('./Latin1');
const UTF8   = require('./UTF8');

const Encoder = {
	Hex: Hex,
	Latin1: Latin1,
	Utf8: UTF8
}

module.exports = Encoder;
