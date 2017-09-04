const Latin1 = require('./Latin1');

const UTF8 = {
	stringify: function (wordArray) {
		try {
			return decodeURIComponent(escape(Latin1.stringify(wordArray)));
		} catch (e) {
			throw new Error('Malformed UTF-8 data');
		}
	},
	parse: function (utf8Str) {
		return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	}
}

module.exports = UTF8;
