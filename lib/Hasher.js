const BufferedBlockAlgorithm = require('./BufferedBlockAlgorithm');
const HMAC = require('./Hashers/hmac');

class Hasher extends BufferedBlockAlgorithm {
    constructor() {
        super();

        this.cfg = super.extend();
        this.blockSize = 512 / 32;
    }

    init(cfg) {
        this.cfg = this.cfg.extend(cfg);
        this.reset();
    }

    reset() {
        super.reset.call(this);
        this._doReset();
    }

    update(messageUpdate) {
        this._append(messageUpdate);
        this._process();
        return this;
    }

    finalize(messageUpdate) {
        if (messageUpdate) this._append(messageUpdate);
        var hash = this._doFinalize();
        return hash;
    }

    _createHelper(hasher) {
        return function(message, cfg) {
            return new hasher.init(cfg).finalize(message);
        };
    }

    _createHmacHelper(hasher) {
        return function(message, key) {
			const hmac = new HMAC().algo();
			hmac.init(hasher, key);
            return hmac.finalize(message);
        };
    }
}

module.exports = Hasher;
