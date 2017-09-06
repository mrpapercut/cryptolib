const WordArray = require('../WordArray');

const Latin1 = {
	stringify: function (wordArray) {
		var words = wordArray.words;
		var sigBytes = wordArray.sigBytes;
		var latin1Chars = [];
		for (var i = 0; i < sigBytes; i++) {
			var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
			latin1Chars.push(String.fromCharCode(bite));
		}
		return latin1Chars.join('');
	},

	parse: function (latin1Str) {
		var latin1StrLength = latin1Str.length;
		var words = [];
		for (var i = 0; i < latin1StrLength; i++) {
			words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
		}
		return new WordArray().init(words, latin1StrLength);
	}
}

module.exports = Latin1;
