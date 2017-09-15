import WordArray from '../WordArray';
import SHA256  from './SHA256';

const sha256 = new SHA256().algo();

class SHA224 extends SHA256 {
    constructor() {
        super();
    }

    algo() {
        return sha256.extend({
            _doReset: function () {
				this._hash = new WordArray().init([
					0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
					0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
				]);
            },

            _doFinalize: function () {
                var hash = sha256._doFinalize.call(this);

                hash.sigBytes -= 4;

                return hash;
            }
        });
    }
}

export default SHA224;
