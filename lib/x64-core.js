const Base = require("./Base");
const WordArray = require("./WordArray");

const x64Core = {
    Word: new Base().extend({
        init: function(high, low) {
            this.high = high;
            this.low = low;
        }
    }),

    WordArray: new Base().extend({
        init: function(words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 8;
            }
        },

        toX32: function() {
            // Shortcuts
            var x64Words = this.words;
            var x64WordsLength = x64Words.length;

            // Convert
            var x32Words = [];
            for (var i = 0; i < x64WordsLength; i++) {
                var x64Word = x64Words[i];
                x32Words.push(x64Word.high);
                x32Words.push(x64Word.low);
            }

            return new WordArray().create(x32Words, this.sigBytes);
        },

        clone: function() {
            var clone = new Base().clone.call(this);

            // Clone "words" array
            var words = (clone.words = this.words.slice(0));

            // Clone each X64Word object
            var wordsLength = words.length;
            for (var i = 0; i < wordsLength; i++) {
                words[i] = words[i].clone();
            }

            return clone;
        }
    })
};

module.exports = x64Core;
