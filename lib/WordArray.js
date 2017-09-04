const CryptoBase = require('./CryptoBase');
const Hex = require('./Encoder/Hex');

class WordArray extends CryptoBase {
	constructor() {
		super();
	}

	init(words, sigBytes) {
		words = this.words = words || [];
		if (sigBytes != undefined) {
			this.sigBytes = sigBytes;
		} else {
			this.sigBytes = words.length * 4;
		}

		return this;
	}

	toString(encoder) {
		return (encoder || Hex).stringify(this);
	}

	concat(wordArray) {
		var thisWords = this.words;
		var thatWords = wordArray.words;
		var thisSigBytes = this.sigBytes;
		var thatSigBytes = wordArray.sigBytes;
		this.clamp();

		if (thisSigBytes % 4) {
			for (var i = 0; i < thatSigBytes; i++) {
				var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
				thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
			}
		} else if (thatWords.length > 0xffff) {
			for (var i = 0; i < thatSigBytes; i += 4) {
				thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
			}
		} else {
			thisWords.push.apply(thisWords, thatWords);
		}
		this.sigBytes += thatSigBytes;
		return this;
	}

	clamp() {
		var words = this.words;
		var sigBytes = this.sigBytes;
		words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
		words.length = Math.ceil(sigBytes / 4);
	}

	clone() {
		var clone = _base.clone.call(this);
		clone.words = this.words.slice(0);
		return clone;
	}

	random(nBytes) {
		var words = [];
		for (var i = 0; i < nBytes; i += 4) {
			words.push((Math.random() * 0x100000000) | 0);
		}

		return new WordArray().init(words, nBytes);
	}
}

module.exports = WordArray;
