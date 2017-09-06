const Base64 = require('./Encoders/Base64');
const Hex    = require('./Encoders/Hex');
const Latin1 = require('./Encoders/Latin1');
const UTF8   = require('./Encoders/UTF8');
const UTF16  = require('./Encoders/UTF16');

const Encoder = {
	Base64:  Base64,
	Hex:     Hex,
	Latin1:  Latin1,
	Utf8:    UTF8,
	Utf16:   UTF16.UTF16BE,
	Utf16BE: UTF16.UTF16BE,
	Utf16LE: UTF16.UTF16LE
}

module.exports = Encoder;
