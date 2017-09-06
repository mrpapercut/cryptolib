const Base      = require("./Base");
const WordArray = require("./WordArray");
const UTF8      = require("./Encoders/UTF8");

class BufferedBlockAlgorithm extends Base {
    constructor() {
        super();

        this._minBufferSize = 0;
        this._nDataBytes = 0;
        this._data = new WordArray().init();
    }

    reset() {
        this._data = new WordArray().init();
        this._nDataBytes = 0;
    }

    _append(data) {
        if (typeof data == "string") {
            data = UTF8.parse(data);
        }
        this._data.concat(data);
        this._nDataBytes += data.sigBytes;
    }

    _process(doFlush) {
        var data = this._data;
        var dataWords = data.words;
        var dataSigBytes = data.sigBytes;
        var blockSize = this.blockSize;
        var blockSizeBytes = blockSize * 4;

        var nBlocksReady = dataSigBytes / blockSizeBytes;
        if (doFlush) {
            nBlocksReady = Math.ceil(nBlocksReady);
        } else {
            nBlocksReady = Math.max(
                (nBlocksReady | 0) - this._minBufferSize,
                0
            );
        }
        var nWordsReady = nBlocksReady * blockSize;
        var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
        if (nWordsReady) {
            for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                this._doProcessBlock(dataWords, offset);
            }
            var processedWords = dataWords.splice(0, nWordsReady);
            data.sigBytes -= nBytesReady;
        }
        return new WordArray().init(processedWords, nBytesReady);
    }

    clone() {
        var clone = super.clone.call(this);
        clone._data = this._data.clone();

        return clone;
    }
}

module.exports = BufferedBlockAlgorithm;
