/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Base2 = __webpack_require__(1);

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WordArray = function (_Base) {
    _inherits(WordArray, _Base);

    function WordArray() {
        _classCallCheck(this, WordArray);

        return _possibleConstructorReturn(this, (WordArray.__proto__ || Object.getPrototypeOf(WordArray)).call(this));
    }

    _createClass(WordArray, [{
        key: "init",
        value: function init(words, sigBytes) {
            words = this.words = words || [];
            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }

            return this;
        }
    }, {
        key: "toString",
        value: function toString(encoder) {
            return (encoder ? encoder.stringify : function (wordArray) {
                var words = wordArray.words;
                var sigBytes = wordArray.sigBytes;
                var hexChars = [];
                for (var i = 0; i < sigBytes; i++) {
                    var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                    hexChars.push((bite >>> 4).toString(16));
                    hexChars.push((bite & 0x0f).toString(16));
                }
                return hexChars.join("");
            })(this);
        }
    }, {
        key: "concat",
        value: function concat(wordArray) {
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;
            this.clamp();

            if (thisSigBytes % 4) {
                for (var i = 0; i < thatSigBytes; i++) {
                    var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                    thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
                }
            } else if (thatWords.length > 0xffff) {
                for (var i = 0; i < thatSigBytes; i += 4) {
                    thisWords[thisSigBytes + i >>> 2] = thatWords[i >>> 2];
                }
            } else {
                thisWords.push.apply(thisWords, thatWords);
            }
            this.sigBytes += thatSigBytes;
            return this;
        }
    }, {
        key: "clamp",
        value: function clamp() {
            var words = this.words;
            var sigBytes = this.sigBytes;
            words[sigBytes >>> 2] &= 0xffffffff << 32 - sigBytes % 4 * 8;
            words.length = Math.ceil(sigBytes / 4);
        }
    }, {
        key: "clone",
        value: function clone() {
            var clone = _get(WordArray.prototype.__proto__ || Object.getPrototypeOf(WordArray.prototype), "clone", this).call(this);
            clone.words = this.words.slice(0);
            return clone;
        }
    }, {
        key: "random",
        value: function random(nBytes) {
            var words = [];
            for (var i = 0; i < nBytes; i += 4) {
                words.push(Math.random() * 0x100000000 | 0);
            }

            return new WordArray().init(words, nBytes);
        }
    }]);

    return WordArray;
}(_Base3.default);

exports.default = WordArray;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function F() {}

var Base = function () {
    function Base() {
        _classCallCheck(this, Base);
    }

    _createClass(Base, [{
        key: "extend",
        value: function extend(overrides) {
            F.prototype = this;
            var subtype = new F();
            if (overrides) subtype.mixIn(overrides);
            if (!subtype.hasOwnProperty("init")) {
                subtype.init = function () {
                    subtype.$super.init.apply(this, arguments);
                };
            }
            subtype.init.prototype = subtype;
            subtype.$super = this;
            return subtype;
        }
    }, {
        key: "create",
        value: function create() {
            var instance = this.extend();
            instance.init.apply(instance, arguments);
            return instance;
        }
    }, {
        key: "init",
        value: function init() {}
    }, {
        key: "mixIn",
        value: function mixIn(properties) {
            for (var propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                    this[propertyName] = properties[propertyName];
                }
            }

            if (properties.hasOwnProperty("toString")) {
                this.toString = properties.toString;
            }
        }
    }, {
        key: "clone",
        value: function clone() {
            return this.extend().init.prototype.extend(this);
        }
    }]);

    return Base;
}();

exports.default = Base;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BufferedBlockAlgorithm = __webpack_require__(10);

var _BufferedBlockAlgorithm2 = _interopRequireDefault(_BufferedBlockAlgorithm);

var _hmac = __webpack_require__(11);

var _hmac2 = _interopRequireDefault(_hmac);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hasher = function (_BufferedBlockAlgorit) {
    _inherits(Hasher, _BufferedBlockAlgorit);

    function Hasher() {
        _classCallCheck(this, Hasher);

        var _this = _possibleConstructorReturn(this, (Hasher.__proto__ || Object.getPrototypeOf(Hasher)).call(this));

        _this.cfg = _get(Hasher.prototype.__proto__ || Object.getPrototypeOf(Hasher.prototype), 'extend', _this).call(_this);
        _this.blockSize = 512 / 32;
        return _this;
    }

    _createClass(Hasher, [{
        key: 'init',
        value: function init(cfg) {
            this.cfg = this.cfg.extend(cfg);
            this.reset();
        }
    }, {
        key: 'reset',
        value: function reset() {
            _get(Hasher.prototype.__proto__ || Object.getPrototypeOf(Hasher.prototype), 'reset', this).call(this);
            this._doReset();
        }
    }, {
        key: 'update',
        value: function update(messageUpdate) {
            this._append(messageUpdate);
            this._process();
            return this;
        }
    }, {
        key: 'finalize',
        value: function finalize(messageUpdate) {
            if (messageUpdate) this._append(messageUpdate);
            var hash = this._doFinalize();
            return hash;
        }
    }, {
        key: '_createHelper',
        value: function _createHelper(hasher) {
            return function (message, cfg) {
                return new hasher.init(cfg).finalize(message);
            };
        }
    }, {
        key: '_createHmacHelper',
        value: function _createHmacHelper(hasher) {
            return function (message, key) {
                var hmac = new _hmac2.default().algo();
                hmac.init(hasher, key);
                return hmac.finalize(message);
            };
        }
    }]);

    return Hasher;
}(_BufferedBlockAlgorithm2.default);

exports.default = Hasher;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Base = __webpack_require__(1);

var _Base2 = _interopRequireDefault(_Base);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var x64Core = {
    Word: new _Base2.default().extend({
        init: function init(high, low) {
            this.high = high;
            this.low = low;
        }
    }),

    WordArray: new _Base2.default().extend({
        init: function init(words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 8;
            }
        },

        toX32: function toX32() {
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

            return new _WordArray2.default().create(x32Words, this.sigBytes);
        },

        clone: function clone() {
            var clone = new _Base2.default().clone.call(this);

            // Clone "words" array
            var words = clone.words = this.words.slice(0);

            // Clone each X64Word object
            var wordsLength = words.length;
            for (var i = 0; i < wordsLength; i++) {
                words[i] = words[i].clone();
            }

            return clone;
        }
    })
};

exports.default = x64Core;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CipherCore = __webpack_require__(14);

var _CipherCore2 = _interopRequireDefault(_CipherCore);

var _CBC = __webpack_require__(34);

var _CBC2 = _interopRequireDefault(_CBC);

var _Pkcs = __webpack_require__(36);

var _Pkcs2 = _interopRequireDefault(_Pkcs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BlockCipher = function (_Cipher) {
	_inherits(BlockCipher, _Cipher);

	function BlockCipher() {
		_classCallCheck(this, BlockCipher);

		var _this = _possibleConstructorReturn(this, (BlockCipher.__proto__ || Object.getPrototypeOf(BlockCipher)).call(this));

		_this.cfg = new _CipherCore2.default().cfg.extend({
			mode: new _CBC2.default(),
			padding: new _Pkcs2.default()
		});

		_this.blockSize = 128 / 32;
		return _this;
	}

	_createClass(BlockCipher, [{
		key: 'reset',
		value: function reset() {
			// Reset cipher
			_get(BlockCipher.prototype.__proto__ || Object.getPrototypeOf(BlockCipher.prototype), 'reset', this).call(this);

			// Shortcuts
			var cfg = this.cfg;
			var iv = cfg.iv;
			var mode = cfg.mode;

			// Reset block mode
			if (this._xformMode == this._ENC_XFORM_MODE) {
				var modeCreator = mode.createEncryptor;
			} else /* if (this._xformMode == this._DEC_XFORM_MODE) */{
					var modeCreator = mode.createDecryptor;

					// Keep at least one block in the buffer for unpadding
					this._minBufferSize = 1;
				}
			this._mode = modeCreator.call(mode, this, iv && iv.words);
		}
	}, {
		key: '_doProcessBlock',
		value: function _doProcessBlock(words, offset) {
			this._mode.processBlock(words, offset);
		}
	}, {
		key: '_doFinalize',
		value: function _doFinalize() {
			// Shortcut
			var padding = this.cfg.padding;

			// Finalize
			if (this._xformMode == this._ENC_XFORM_MODE) {
				// Pad data
				padding.pad(this._data, this.blockSize);

				// Process final blocks
				var finalProcessedBlocks = this._process(!!'flush');
			} else /* if (this._xformMode == this._DEC_XFORM_MODE) */{
					// Process final blocks
					var finalProcessedBlocks = this._process(!!'flush');

					// Unpad data
					padding.unpad(finalProcessedBlocks);
				}

			return finalProcessedBlocks;
		}
	}]);

	return BlockCipher;
}(_CipherCore2.default);

exports.default = BlockCipher;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Latin = __webpack_require__(9);

var _Latin2 = _interopRequireDefault(_Latin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UTF8 = {
	stringify: function stringify(wordArray) {
		try {
			return decodeURIComponent(escape(_Latin2.default.stringify(wordArray)));
		} catch (e) {
			throw new Error('Malformed UTF-8 data');
		}
	},
	parse: function parse(utf8Str) {
		return _Latin2.default.parse(unescape(encodeURIComponent(utf8Str)));
	}
};

exports.default = UTF8;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base2 = __webpack_require__(1);

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A collection of cipher parameters.
 *
 * @property {WordArray} ciphertext The raw ciphertext.
 * @property {WordArray} key The key to this ciphertext.
 * @property {WordArray} iv The IV used in the ciphering operation.
 * @property {WordArray} salt The salt used with a key derivation function.
 * @property {Cipher} algorithm The cipher algorithm.
 * @property {Mode} mode The block mode used in the ciphering operation.
 * @property {Padding} padding The padding scheme used in the ciphering operation.
 * @property {number} blockSize The block size of the cipher.
 * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
 */
var CipherParams = function (_Base) {
	_inherits(CipherParams, _Base);

	function CipherParams() {
		_classCallCheck(this, CipherParams);

		return _possibleConstructorReturn(this, (CipherParams.__proto__ || Object.getPrototypeOf(CipherParams)).call(this));
	}

	/**
  * Initializes a newly created cipher params object.
  *
  * @param {Object} cipherParams An object with any of the possible cipher parameters.
  *
  * @example
  *
  *     var cipherParams = CryptoJS.lib.CipherParams.create({
  *         ciphertext: ciphertextWordArray,
  *         key: keyWordArray,
  *         iv: ivWordArray,
  *         salt: saltWordArray,
  *         algorithm: CryptoJS.algo.AES,
  *         mode: CryptoJS.mode.CBC,
  *         padding: CryptoJS.pad.PKCS7,
  *         blockSize: 4,
  *         formatter: CryptoJS.format.OpenSSL
  *     });
  */


	_createClass(CipherParams, [{
		key: 'init',
		value: function init(cipherParams) {
			this.mixIn(cipherParams);
		}

		/**
   * Converts this cipher params object to a string.
   *
   * @param {Format} formatter (Optional) The formatting strategy to use.
   *
   * @return {string} The stringified cipher params.
   *
   * @throws Error If neither the formatter nor the default formatter is set.
   *
   * @example
   *
   *     var string = cipherParams + '';
   *     var string = cipherParams.toString();
   *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
   */

	}, {
		key: 'toString',
		value: function toString(formatter) {
			return (formatter || this.formatter).stringify(this);
		}
	}]);

	return CipherParams;
}(_Base3.default);

exports.default = CipherParams;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CipherCore = __webpack_require__(14);

var _CipherCore2 = _interopRequireDefault(_CipherCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StreamCipher = function (_Cipher) {
	_inherits(StreamCipher, _Cipher);

	function StreamCipher() {
		_classCallCheck(this, StreamCipher);

		var _this = _possibleConstructorReturn(this, (StreamCipher.__proto__ || Object.getPrototypeOf(StreamCipher)).call(this));

		_this.blockSize = 1;
		return _this;
	}

	_createClass(StreamCipher, [{
		key: '_doFinalize',
		value: function _doFinalize() {
			// Process partial blocks
			var finalProcessedBlocks = this._process(!!'flush');

			return finalProcessedBlocks;
		}
	}]);

	return StreamCipher;
}(_CipherCore2.default);

exports.default = StreamCipher;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var charMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

var Base64 = {
    stringify: function stringify(wordArray) {
        // Shortcuts
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;
        var map = charMap;

        // Clamp excess bits
        wordArray.clamp();

        // Convert
        var base64Chars = [];
        for (var i = 0; i < sigBytes; i += 3) {
            var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
            var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 0xff;
            var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 0xff;

            var triplet = byte1 << 16 | byte2 << 8 | byte3;

            for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 0x3f));
            }
        }

        // Add padding
        var paddingChar = map.charAt(64);
        if (paddingChar) {
            while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
            }
        }

        return base64Chars.join('');
    },

    parse: function parse(base64Str) {
        // Shortcuts
        var base64StrLength = base64Str.length;
        var map = charMap;

        // Ignore padding
        var paddingChar = map.charAt(64);
        if (paddingChar) {
            var paddingIndex = base64Str.indexOf(paddingChar);
            if (paddingIndex != -1) {
                base64StrLength = paddingIndex;
            }
        }

        // Convert
        var words = [];
        var nBytes = 0;
        for (var i = 0; i < base64StrLength; i++) {
            if (i % 4) {
                var bits1 = map.indexOf(base64Str.charAt(i - 1)) << i % 4 * 2;
                var bits2 = map.indexOf(base64Str.charAt(i)) >>> 6 - i % 4 * 2;
                words[nBytes >>> 2] |= (bits1 | bits2) << 24 - nBytes % 4 * 8;
                nBytes++;
            }
        }

        return new _WordArray2.default().create(words, nBytes);
    }
};

exports.default = Base64;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Latin1 = {
	stringify: function stringify(wordArray) {
		var words = wordArray.words;
		var sigBytes = wordArray.sigBytes;
		var latin1Chars = [];
		for (var i = 0; i < sigBytes; i++) {
			var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
			latin1Chars.push(String.fromCharCode(bite));
		}
		return latin1Chars.join('');
	},

	parse: function parse(latin1Str) {
		var latin1StrLength = latin1Str.length;
		var words = [];
		for (var i = 0; i < latin1StrLength; i++) {
			words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << 24 - i % 4 * 8;
		}
		return new _WordArray2.default().init(words, latin1StrLength);
	}
};

exports.default = Latin1;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Base2 = __webpack_require__(1);

var _Base3 = _interopRequireDefault(_Base2);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

var _UTF = __webpack_require__(5);

var _UTF2 = _interopRequireDefault(_UTF);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BufferedBlockAlgorithm = function (_Base) {
    _inherits(BufferedBlockAlgorithm, _Base);

    function BufferedBlockAlgorithm() {
        _classCallCheck(this, BufferedBlockAlgorithm);

        var _this = _possibleConstructorReturn(this, (BufferedBlockAlgorithm.__proto__ || Object.getPrototypeOf(BufferedBlockAlgorithm)).call(this));

        _this._minBufferSize = 0;
        _this._nDataBytes = 0;
        _this._data = new _WordArray2.default().init();
        return _this;
    }

    _createClass(BufferedBlockAlgorithm, [{
        key: 'reset',
        value: function reset() {
            this._data = new _WordArray2.default().init();
            this._nDataBytes = 0;
        }
    }, {
        key: '_append',
        value: function _append(data) {
            if (typeof data == "string") {
                data = _UTF2.default.parse(data);
            }
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
        }
    }, {
        key: '_process',
        value: function _process(doFlush) {
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;

            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
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
            return new _WordArray2.default().init(processedWords, nBytesReady);
        }
    }, {
        key: 'clone',
        value: function clone() {
            var clone = _get(BufferedBlockAlgorithm.prototype.__proto__ || Object.getPrototypeOf(BufferedBlockAlgorithm.prototype), 'clone', this).call(this);
            clone._data = this._data.clone();

            return clone;
        }
    }]);

    return BufferedBlockAlgorithm;
}(_Base3.default);

exports.default = BufferedBlockAlgorithm;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base = __webpack_require__(1);

var _Base2 = _interopRequireDefault(_Base);

var _UTF = __webpack_require__(5);

var _UTF2 = _interopRequireDefault(_UTF);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HMAC = function () {
	function HMAC() {
		_classCallCheck(this, HMAC);
	}

	_createClass(HMAC, [{
		key: 'algo',
		value: function algo() {
			return new _Base2.default().extend({
				/**
     * Initializes a newly created HMAC.
     *
     * @param {Hasher} hasher The hash algorithm to use.
     * @param {WordArray|string} key The secret key.
     *
     * @example
     *
     *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
     */
				init: function init(hasher, key) {
					// Init hasher
					hasher = this._hasher = new hasher.init();

					// Convert string to WordArray, else assume WordArray already
					if (typeof key == 'string') {
						key = _UTF2.default.parse(key);
					}

					// Shortcuts
					var hasherBlockSize = hasher.blockSize;
					var hasherBlockSizeBytes = hasherBlockSize * 4;

					// Allow arbitrary length keys
					if (key.sigBytes > hasherBlockSizeBytes) {
						key = hasher.finalize(key);
					}

					// Clamp excess bits
					key.clamp();

					// Clone key for inner and outer pads
					var oKey = this._oKey = key.clone();
					var iKey = this._iKey = key.clone();

					// Shortcuts
					var oKeyWords = oKey.words;
					var iKeyWords = iKey.words;

					// XOR keys with pad constants
					for (var i = 0; i < hasherBlockSize; i++) {
						oKeyWords[i] ^= 0x5c5c5c5c;
						iKeyWords[i] ^= 0x36363636;
					}
					oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

					// Set initial values
					this.reset();
				},

				/**
     * Resets this HMAC to its initial state.
     *
     * @example
     *
     *     hmacHasher.reset();
     */
				reset: function reset() {
					// Shortcut
					var hasher = this._hasher;

					// Reset
					hasher.reset();
					hasher.update(this._iKey);
				},

				/**
     * Updates this HMAC with a message.
     *
     * @param {WordArray|string} messageUpdate The message to append.
     *
     * @return {HMAC} This HMAC instance.
     *
     * @example
     *
     *     hmacHasher.update('message');
     *     hmacHasher.update(wordArray);
     */
				update: function update(messageUpdate) {
					this._hasher.update(messageUpdate);

					// Chainable
					return this;
				},

				/**
     * Finalizes the HMAC computation.
     * Note that the finalize operation is effectively a destructive, read-once operation.
     *
     * @param {WordArray|string} messageUpdate (Optional) A final message update.
     *
     * @return {WordArray} The HMAC.
     *
     * @example
     *
     *     var hmac = hmacHasher.finalize();
     *     var hmac = hmacHasher.finalize('message');
     *     var hmac = hmacHasher.finalize(wordArray);
     */
				finalize: function finalize(messageUpdate) {
					// Shortcut
					var hasher = this._hasher;

					// Compute HMAC
					var innerHash = hasher.finalize(messageUpdate);
					hasher.reset();
					var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

					return hmac;
				}
			});
		}
	}]);

	return HMAC;
}();

exports.default = HMAC;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hasher2 = __webpack_require__(2);

var _Hasher3 = _interopRequireDefault(_Hasher2);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var T = [];

for (var i = 0; i < 64; i++) {
	T[i] = Math.abs(Math.sin(i + 1)) * 0x100000000 | 0;
}

var FF = function FF(a, b, c, d, x, s, t) {
	var n = a + (b & c | ~b & d) + x + t;
	return (n << s | n >>> 32 - s) + b;
};

var GG = function GG(a, b, c, d, x, s, t) {
	var n = a + (b & d | c & ~d) + x + t;
	return (n << s | n >>> 32 - s) + b;
};

var HH = function HH(a, b, c, d, x, s, t) {
	var n = a + (b ^ c ^ d) + x + t;
	return (n << s | n >>> 32 - s) + b;
};

var II = function II(a, b, c, d, x, s, t) {
	var n = a + (c ^ (b | ~d)) + x + t;
	return (n << s | n >>> 32 - s) + b;
};

var MD5 = function (_Hasher) {
	_inherits(MD5, _Hasher);

	function MD5() {
		_classCallCheck(this, MD5);

		var _this = _possibleConstructorReturn(this, (MD5.__proto__ || Object.getPrototypeOf(MD5)).call(this));

		_this.T = T;
		return _this;
	}

	/**
  * MD5 hash algorithm.
  */


	_createClass(MD5, [{
		key: 'algo',
		value: function algo() {
			return new _Hasher3.default().extend({
				_doReset: function _doReset() {
					this._hash = new _WordArray2.default().init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
				},

				_doProcessBlock: function _doProcessBlock(M, offset) {
					// Swap endian
					for (var i = 0; i < 16; i++) {
						// Shortcuts
						var offset_i = offset + i;
						var M_offset_i = M[offset_i];

						M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
					}

					// Shortcuts
					var H = this._hash.words;

					var M_offset_0 = M[offset + 0];
					var M_offset_1 = M[offset + 1];
					var M_offset_2 = M[offset + 2];
					var M_offset_3 = M[offset + 3];
					var M_offset_4 = M[offset + 4];
					var M_offset_5 = M[offset + 5];
					var M_offset_6 = M[offset + 6];
					var M_offset_7 = M[offset + 7];
					var M_offset_8 = M[offset + 8];
					var M_offset_9 = M[offset + 9];
					var M_offset_10 = M[offset + 10];
					var M_offset_11 = M[offset + 11];
					var M_offset_12 = M[offset + 12];
					var M_offset_13 = M[offset + 13];
					var M_offset_14 = M[offset + 14];
					var M_offset_15 = M[offset + 15];

					// Working varialbes
					var a = H[0];
					var b = H[1];
					var c = H[2];
					var d = H[3];

					// Computation
					a = FF(a, b, c, d, M_offset_0, 7, T[0]);
					d = FF(d, a, b, c, M_offset_1, 12, T[1]);
					c = FF(c, d, a, b, M_offset_2, 17, T[2]);
					b = FF(b, c, d, a, M_offset_3, 22, T[3]);
					a = FF(a, b, c, d, M_offset_4, 7, T[4]);
					d = FF(d, a, b, c, M_offset_5, 12, T[5]);
					c = FF(c, d, a, b, M_offset_6, 17, T[6]);
					b = FF(b, c, d, a, M_offset_7, 22, T[7]);
					a = FF(a, b, c, d, M_offset_8, 7, T[8]);
					d = FF(d, a, b, c, M_offset_9, 12, T[9]);
					c = FF(c, d, a, b, M_offset_10, 17, T[10]);
					b = FF(b, c, d, a, M_offset_11, 22, T[11]);
					a = FF(a, b, c, d, M_offset_12, 7, T[12]);
					d = FF(d, a, b, c, M_offset_13, 12, T[13]);
					c = FF(c, d, a, b, M_offset_14, 17, T[14]);
					b = FF(b, c, d, a, M_offset_15, 22, T[15]);

					a = GG(a, b, c, d, M_offset_1, 5, T[16]);
					d = GG(d, a, b, c, M_offset_6, 9, T[17]);
					c = GG(c, d, a, b, M_offset_11, 14, T[18]);
					b = GG(b, c, d, a, M_offset_0, 20, T[19]);
					a = GG(a, b, c, d, M_offset_5, 5, T[20]);
					d = GG(d, a, b, c, M_offset_10, 9, T[21]);
					c = GG(c, d, a, b, M_offset_15, 14, T[22]);
					b = GG(b, c, d, a, M_offset_4, 20, T[23]);
					a = GG(a, b, c, d, M_offset_9, 5, T[24]);
					d = GG(d, a, b, c, M_offset_14, 9, T[25]);
					c = GG(c, d, a, b, M_offset_3, 14, T[26]);
					b = GG(b, c, d, a, M_offset_8, 20, T[27]);
					a = GG(a, b, c, d, M_offset_13, 5, T[28]);
					d = GG(d, a, b, c, M_offset_2, 9, T[29]);
					c = GG(c, d, a, b, M_offset_7, 14, T[30]);
					b = GG(b, c, d, a, M_offset_12, 20, T[31]);

					a = HH(a, b, c, d, M_offset_5, 4, T[32]);
					d = HH(d, a, b, c, M_offset_8, 11, T[33]);
					c = HH(c, d, a, b, M_offset_11, 16, T[34]);
					b = HH(b, c, d, a, M_offset_14, 23, T[35]);
					a = HH(a, b, c, d, M_offset_1, 4, T[36]);
					d = HH(d, a, b, c, M_offset_4, 11, T[37]);
					c = HH(c, d, a, b, M_offset_7, 16, T[38]);
					b = HH(b, c, d, a, M_offset_10, 23, T[39]);
					a = HH(a, b, c, d, M_offset_13, 4, T[40]);
					d = HH(d, a, b, c, M_offset_0, 11, T[41]);
					c = HH(c, d, a, b, M_offset_3, 16, T[42]);
					b = HH(b, c, d, a, M_offset_6, 23, T[43]);
					a = HH(a, b, c, d, M_offset_9, 4, T[44]);
					d = HH(d, a, b, c, M_offset_12, 11, T[45]);
					c = HH(c, d, a, b, M_offset_15, 16, T[46]);
					b = HH(b, c, d, a, M_offset_2, 23, T[47]);

					a = II(a, b, c, d, M_offset_0, 6, T[48]);
					d = II(d, a, b, c, M_offset_7, 10, T[49]);
					c = II(c, d, a, b, M_offset_14, 15, T[50]);
					b = II(b, c, d, a, M_offset_5, 21, T[51]);
					a = II(a, b, c, d, M_offset_12, 6, T[52]);
					d = II(d, a, b, c, M_offset_3, 10, T[53]);
					c = II(c, d, a, b, M_offset_10, 15, T[54]);
					b = II(b, c, d, a, M_offset_1, 21, T[55]);
					a = II(a, b, c, d, M_offset_8, 6, T[56]);
					d = II(d, a, b, c, M_offset_15, 10, T[57]);
					c = II(c, d, a, b, M_offset_6, 15, T[58]);
					b = II(b, c, d, a, M_offset_13, 21, T[59]);
					a = II(a, b, c, d, M_offset_4, 6, T[60]);
					d = II(d, a, b, c, M_offset_11, 10, T[61]);
					c = II(c, d, a, b, M_offset_2, 15, T[62]);
					b = II(b, c, d, a, M_offset_9, 21, T[63]);

					// Intermediate hash value
					H[0] = H[0] + a | 0;
					H[1] = H[1] + b | 0;
					H[2] = H[2] + c | 0;
					H[3] = H[3] + d | 0;
				},

				_doFinalize: function _doFinalize() {
					// Shortcuts
					var data = this._data;
					var dataWords = data.words;

					var nBitsTotal = this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;

					// Add padding
					dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;

					var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
					var nBitsTotalL = nBitsTotal;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 0x00ff00ff | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 0xff00ff00;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 0x00ff00ff | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 0xff00ff00;

					data.sigBytes = (dataWords.length + 1) * 4;

					// Hash final blocks
					this._process();

					// Shortcuts
					var hash = this._hash;
					var H = hash.words;

					// Swap endian
					for (var i = 0; i < 4; i++) {
						// Shortcut
						var H_i = H[i];

						H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
					}

					// Return final computed hash
					return hash;
				},

				clone: function clone() {
					var clone = new _Hasher3.default().clone.call(this);
					clone._hash = this._hash.clone();

					return clone;
				}
			});
		}
	}]);

	return MD5;
}(_Hasher3.default);

exports.default = MD5;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hasher2 = __webpack_require__(2);

var _Hasher3 = _interopRequireDefault(_Hasher2);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var W = [];

var SHA1 = function (_Hasher) {
    _inherits(SHA1, _Hasher);

    function SHA1() {
        _classCallCheck(this, SHA1);

        return _possibleConstructorReturn(this, (SHA1.__proto__ || Object.getPrototypeOf(SHA1)).call(this));
    }

    _createClass(SHA1, [{
        key: 'algo',
        value: function algo() {
            return new _Hasher3.default().extend({
                _doReset: function _doReset() {
                    this._hash = new _WordArray2.default().init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
                },

                _doProcessBlock: function _doProcessBlock(M, offset) {
                    // Shortcut
                    var H = this._hash.words;

                    // Working variables
                    var a = H[0];
                    var b = H[1];
                    var c = H[2];
                    var d = H[3];
                    var e = H[4];

                    // Computation
                    for (var i = 0; i < 80; i++) {
                        if (i < 16) {
                            W[i] = M[offset + i] | 0;
                        } else {
                            var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                            W[i] = n << 1 | n >>> 31;
                        }

                        var t = (a << 5 | a >>> 27) + e + W[i];
                        if (i < 20) {
                            t += (b & c | ~b & d) + 0x5a827999;
                        } else if (i < 40) {
                            t += (b ^ c ^ d) + 0x6ed9eba1;
                        } else if (i < 60) {
                            t += (b & c | b & d | c & d) - 0x70e44324;
                        } else /* if (i < 80) */{
                                t += (b ^ c ^ d) - 0x359d3e2a;
                            }

                        e = d;
                        d = c;
                        c = b << 30 | b >>> 2;
                        b = a;
                        a = t;
                    }

                    // Intermediate hash value
                    H[0] = H[0] + a | 0;
                    H[1] = H[1] + b | 0;
                    H[2] = H[2] + c | 0;
                    H[3] = H[3] + d | 0;
                    H[4] = H[4] + e | 0;
                },

                _doFinalize: function _doFinalize() {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
                    dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
                    dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
                    data.sigBytes = dataWords.length * 4;

                    // Hash final blocks
                    this._process();

                    // Return final computed hash
                    return this._hash;
                },

                clone: function clone() {
                    var clone = _Hasher3.default.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                }
            });
        }
    }]);

    return SHA1;
}(_Hasher3.default);

exports.default = SHA1;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Base = __webpack_require__(1);

var _Base2 = _interopRequireDefault(_Base);

var _BufferedBlockAlgorithm = __webpack_require__(10);

var _BufferedBlockAlgorithm2 = _interopRequireDefault(_BufferedBlockAlgorithm);

var _PasswordBasedCipher = __webpack_require__(31);

var _PasswordBasedCipher2 = _interopRequireDefault(_PasswordBasedCipher);

var _SerializableCipher = __webpack_require__(15);

var _SerializableCipher2 = _interopRequireDefault(_SerializableCipher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CipherCore = function (_BufferedBlockAlgorit) {
	_inherits(CipherCore, _BufferedBlockAlgorit);

	function CipherCore() {
		_classCallCheck(this, CipherCore);

		var _this = _possibleConstructorReturn(this, (CipherCore.__proto__ || Object.getPrototypeOf(CipherCore)).call(this));

		_this.cfg = new _Base2.default().extend();

		_this.keySize = 128 / 32;
		_this.ivSize = 128 / 32;

		_this._ENC_XFORM_MODE = 1;
		_this._DEC_XFORM_MODE = 2;
		return _this;
	}

	_createClass(CipherCore, [{
		key: 'createEncryptor',
		value: function createEncryptor(key, cfg) {
			return this.create(this._ENC_XFORM_MODE, key, cfg);
		}
	}, {
		key: 'createDecryptor',
		value: function createDecryptor(key, cfg) {
			return this.create(this._DEC_XFORM_MODE, key, cfg);
		}
	}, {
		key: 'init',
		value: function init(xformMode, key, cfg) {
			// Apply config defaults
			this.cfg = this.cfg.extend(cfg);

			// Store transform mode and key
			this._xformMode = xformMode;
			this._key = key;

			// Set initial values
			this.reset();
		}
	}, {
		key: 'reset',
		value: function reset() {
			// Reset data buffer
			_get(CipherCore.prototype.__proto__ || Object.getPrototypeOf(CipherCore.prototype), 'reset', this).call(this);

			// Perform concrete-cipher logic
			this._doReset();
		}
	}, {
		key: 'process',
		value: function process(dataUpdate) {
			// Append
			this._append(dataUpdate);

			// Process available blocks
			return this._process();
		}
	}, {
		key: 'finalize',
		value: function finalize(dataUpdate) {
			// Final data update
			if (dataUpdate) {
				this._append(dataUpdate);
			}

			// Perform concrete-cipher logic
			var finalProcessedData = this._doFinalize();

			return finalProcessedData;
		}
	}, {
		key: '_createHelper',
		value: function _createHelper(cipher) {
			function selectCipherStrategy(key) {
				if (typeof key == 'string') {
					return _PasswordBasedCipher2.default;
				} else {
					return _SerializableCipher2.default;
				}
			}

			return function (cipher) {
				return {
					encrypt: function encrypt(message, key, cfg) {
						var cipherStrategy = selectCipherStrategy(key);
						return new cipherStrategy().encrypt(cipher, message, key, cfg);
					},

					decrypt: function decrypt(ciphertext, key, cfg) {
						var cipherStrategy = selectCipherStrategy(key);
						return new cipherStrategy().decrypt(cipher, ciphertext, key, cfg);
					}
				};
			}(cipher);
		}
	}]);

	return CipherCore;
}(_BufferedBlockAlgorithm2.default);

exports.default = CipherCore;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Base2 = __webpack_require__(1);

var _Base3 = _interopRequireDefault(_Base2);

var _OpenSSLFormatter = __webpack_require__(32);

var _OpenSSLFormatter2 = _interopRequireDefault(_OpenSSLFormatter);

var _CipherParams = __webpack_require__(6);

var _CipherParams2 = _interopRequireDefault(_CipherParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SerializableCipher = function (_Base) {
	_inherits(SerializableCipher, _Base);

	function SerializableCipher() {
		_classCallCheck(this, SerializableCipher);

		var _this = _possibleConstructorReturn(this, (SerializableCipher.__proto__ || Object.getPrototypeOf(SerializableCipher)).call(this));

		_this.cfg = _get(SerializableCipher.prototype.__proto__ || Object.getPrototypeOf(SerializableCipher.prototype), 'extend', _this).call(_this, {
			format: new _OpenSSLFormatter2.default()
		});
		return _this;
	}

	/**
  * Encrypts a message.
  *
  * @param {Cipher} cipher The cipher algorithm to use.
  * @param {WordArray|string} message The message to encrypt.
  * @param {WordArray} key The key.
  * @param {Object} cfg (Optional) The configuration options to use for this operation.
  *
  * @return {CipherParams} A cipher params object.
  *
  * @static
  *
  * @example
  *
  *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
  *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
  *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
  */


	_createClass(SerializableCipher, [{
		key: 'encrypt',
		value: function encrypt(cipher, message, key, cfg) {
			// Apply config defaults
			cfg = this.cfg.extend(cfg);

			// Encrypt
			var encryptor = cipher.createEncryptor(key, cfg);
			var ciphertext = encryptor.finalize(message);

			// Shortcut
			var cipherCfg = encryptor.cfg;

			// Create and return serializable cipher params
			return new _CipherParams2.default().create({
				ciphertext: ciphertext,
				key: key,
				iv: cipherCfg.iv,
				algorithm: cipher,
				mode: cipherCfg.mode,
				padding: cipherCfg.padding,
				blockSize: cipher.blockSize,
				formatter: cfg.format
			});
		}

		/**
   * Decrypts serialized ciphertext.
   *
   * @param {Cipher} cipher The cipher algorithm to use.
   * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
   * @param {WordArray} key The key.
   * @param {Object} cfg (Optional) The configuration options to use for this operation.
   *
   * @return {WordArray} The plaintext.
   *
   * @static
   *
   * @example
   *
   *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
   *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
   */

	}, {
		key: 'decrypt',
		value: function decrypt(cipher, ciphertext, key, cfg) {
			// Apply config defaults
			cfg = this.cfg.extend(cfg);

			// Convert string to CipherParams
			ciphertext = this._parse(ciphertext, cfg.format);

			// Decrypt
			var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

			return plaintext;
		}

		/**
   * Converts serialized ciphertext to CipherParams,
   * else assumed CipherParams already and returns ciphertext unchanged.
   *
   * @param {CipherParams|string} ciphertext The ciphertext.
   * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
   *
   * @return {CipherParams} The unserialized ciphertext.
   *
   * @static
   *
   * @example
   *
   *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
   */

	}, {
		key: '_parse',
		value: function _parse(ciphertext, format) {
			if (typeof ciphertext == 'string') {
				return format.parse(ciphertext, this);
			} else {
				return ciphertext;
			}
		}
	}]);

	return SerializableCipher;
}(_Base3.default);

exports.default = SerializableCipher;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base = __webpack_require__(1);

var _Base2 = _interopRequireDefault(_Base);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

var _md = __webpack_require__(12);

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var base = new _Base2.default();

var EvpKDF = function () {
	function EvpKDF() {
		_classCallCheck(this, EvpKDF);
	}

	_createClass(EvpKDF, [{
		key: 'algo',
		value: function algo() {
			return base.extend({
				/**
     * Configuration options.
     *
     * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
     * @property {Hasher} hasher The hash algorithm to use. Default: MD5
     * @property {number} iterations The number of iterations to perform. Default: 1
     */
				cfg: base.extend({
					keySize: 128 / 32,
					hasher: new _md2.default().algo(),
					iterations: 1
				}),

				/**
     * Initializes a newly created key derivation function.
     *
     * @param {Object} cfg (Optional) The configuration options to use for the derivation.
     *
     * @example
     *
     *     var kdf = CryptoJS.algo.EvpKDF.create();
     *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
     *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
     */
				init: function init(cfg) {
					this.cfg = this.cfg.extend(cfg);
				},

				/**
     * Derives a key from a password.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     *
     * @return {WordArray} The derived key.
     *
     * @example
     *
     *     var key = kdf.compute(password, salt);
     */
				compute: function compute(password, salt) {
					// Shortcut
					var cfg = this.cfg;

					// Init hasher
					var hasher = cfg.hasher.create();

					// Initial values
					var derivedKey = new _WordArray2.default().create();

					// Shortcuts
					var derivedKeyWords = derivedKey.words;
					var keySize = cfg.keySize;
					var iterations = cfg.iterations;

					// Generate key
					while (derivedKeyWords.length < keySize) {
						if (block) {
							hasher.update(block);
						}
						var block = hasher.update(password).finalize(salt);
						hasher.reset();

						// Iterations
						for (var i = 1; i < iterations; i++) {
							block = hasher.finalize(block);
							hasher.reset();
						}

						derivedKey.concat(block);
					}
					derivedKey.sigBytes = keySize * 4;

					return derivedKey;
				}
			});
		}
	}]);

	return EvpKDF;
}();

exports.default = EvpKDF;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

var _BlockCipher = __webpack_require__(4);

var _BlockCipher2 = _interopRequireDefault(_BlockCipher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Permuted Choice 1 constants
var PC1 = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4];

// Permuted Choice 2 constants
var PC2 = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32];

// Cumulative bit shift constants
var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

// SBOXes and round permutation constants
var SBOX_P = [{ 0x0: 0x808200, 0x10000000: 0x8000, 0x20000000: 0x808002, 0x30000000: 0x2, 0x40000000: 0x200, 0x50000000: 0x808202, 0x60000000: 0x800202, 0x70000000: 0x800000, 0x80000000: 0x202, 0x90000000: 0x800200, 0xa0000000: 0x8200, 0xb0000000: 0x808000, 0xc0000000: 0x8002, 0xd0000000: 0x800002, 0xe0000000: 0x0, 0xf0000000: 0x8202, 0x8000000: 0x0, 0x18000000: 0x808202, 0x28000000: 0x8202, 0x38000000: 0x8000, 0x48000000: 0x808200, 0x58000000: 0x200, 0x68000000: 0x808002, 0x78000000: 0x2, 0x88000000: 0x800200, 0x98000000: 0x8200, 0xa8000000: 0x808000, 0xb8000000: 0x800202, 0xc8000000: 0x800002, 0xd8000000: 0x8002, 0xe8000000: 0x202, 0xf8000000: 0x800000, 0x1: 0x8000, 0x10000001: 0x2, 0x20000001: 0x808200, 0x30000001: 0x800000, 0x40000001: 0x808002, 0x50000001: 0x8200, 0x60000001: 0x200, 0x70000001: 0x800202, 0x80000001: 0x808202, 0x90000001: 0x808000, 0xa0000001: 0x800002, 0xb0000001: 0x8202, 0xc0000001: 0x202, 0xd0000001: 0x800200, 0xe0000001: 0x8002, 0xf0000001: 0x0, 0x8000001: 0x808202, 0x18000001: 0x808000, 0x28000001: 0x800000, 0x38000001: 0x200, 0x48000001: 0x8000, 0x58000001: 0x800002, 0x68000001: 0x2, 0x78000001: 0x8202, 0x88000001: 0x8002, 0x98000001: 0x800202, 0xa8000001: 0x202, 0xb8000001: 0x808200, 0xc8000001: 0x800200, 0xd8000001: 0x0, 0xe8000001: 0x8200, 0xf8000001: 0x808002 }, { 0x0: 0x40084010, 0x1000000: 0x4000, 0x2000000: 0x80000, 0x3000000: 0x40080010, 0x4000000: 0x40000010, 0x5000000: 0x40084000, 0x6000000: 0x40004000, 0x7000000: 0x10, 0x8000000: 0x84000, 0x9000000: 0x40004010, 0xa000000: 0x40000000, 0xb000000: 0x84010, 0xc000000: 0x80010, 0xd000000: 0x0, 0xe000000: 0x4010, 0xf000000: 0x40080000, 0x800000: 0x40004000, 0x1800000: 0x84010, 0x2800000: 0x10, 0x3800000: 0x40004010, 0x4800000: 0x40084010, 0x5800000: 0x40000000, 0x6800000: 0x80000, 0x7800000: 0x40080010, 0x8800000: 0x80010, 0x9800000: 0x0, 0xa800000: 0x4000, 0xb800000: 0x40080000, 0xc800000: 0x40000010, 0xd800000: 0x84000, 0xe800000: 0x40084000, 0xf800000: 0x4010, 0x10000000: 0x0, 0x11000000: 0x40080010, 0x12000000: 0x40004010, 0x13000000: 0x40084000, 0x14000000: 0x40080000, 0x15000000: 0x10, 0x16000000: 0x84010, 0x17000000: 0x4000, 0x18000000: 0x4010, 0x19000000: 0x80000, 0x1a000000: 0x80010, 0x1b000000: 0x40000010, 0x1c000000: 0x84000, 0x1d000000: 0x40004000, 0x1e000000: 0x40000000, 0x1f000000: 0x40084010, 0x10800000: 0x84010, 0x11800000: 0x80000, 0x12800000: 0x40080000, 0x13800000: 0x4000, 0x14800000: 0x40004000, 0x15800000: 0x40084010, 0x16800000: 0x10, 0x17800000: 0x40000000, 0x18800000: 0x40084000, 0x19800000: 0x40000010, 0x1a800000: 0x40004010, 0x1b800000: 0x80010, 0x1c800000: 0x0, 0x1d800000: 0x4010, 0x1e800000: 0x40080010, 0x1f800000: 0x84000 }, { 0x0: 0x104, 0x100000: 0x0, 0x200000: 0x4000100, 0x300000: 0x10104, 0x400000: 0x10004, 0x500000: 0x4000004, 0x600000: 0x4010104, 0x700000: 0x4010000, 0x800000: 0x4000000, 0x900000: 0x4010100, 0xa00000: 0x10100, 0xb00000: 0x4010004, 0xc00000: 0x4000104, 0xd00000: 0x10000, 0xe00000: 0x4, 0xf00000: 0x100, 0x80000: 0x4010100, 0x180000: 0x4010004, 0x280000: 0x0, 0x380000: 0x4000100, 0x480000: 0x4000004, 0x580000: 0x10000, 0x680000: 0x10004, 0x780000: 0x104, 0x880000: 0x4, 0x980000: 0x100, 0xa80000: 0x4010000, 0xb80000: 0x10104, 0xc80000: 0x10100, 0xd80000: 0x4000104, 0xe80000: 0x4010104, 0xf80000: 0x4000000, 0x1000000: 0x4010100, 0x1100000: 0x10004, 0x1200000: 0x10000, 0x1300000: 0x4000100, 0x1400000: 0x100, 0x1500000: 0x4010104, 0x1600000: 0x4000004, 0x1700000: 0x0, 0x1800000: 0x4000104, 0x1900000: 0x4000000, 0x1a00000: 0x4, 0x1b00000: 0x10100, 0x1c00000: 0x4010000, 0x1d00000: 0x104, 0x1e00000: 0x10104, 0x1f00000: 0x4010004, 0x1080000: 0x4000000, 0x1180000: 0x104, 0x1280000: 0x4010100, 0x1380000: 0x0, 0x1480000: 0x10004, 0x1580000: 0x4000100, 0x1680000: 0x100, 0x1780000: 0x4010004, 0x1880000: 0x10000, 0x1980000: 0x4010104, 0x1a80000: 0x10104, 0x1b80000: 0x4000004, 0x1c80000: 0x4000104, 0x1d80000: 0x4010000, 0x1e80000: 0x4, 0x1f80000: 0x10100 }, { 0x0: 0x80401000, 0x10000: 0x80001040, 0x20000: 0x401040, 0x30000: 0x80400000, 0x40000: 0x0, 0x50000: 0x401000, 0x60000: 0x80000040, 0x70000: 0x400040, 0x80000: 0x80000000, 0x90000: 0x400000, 0xa0000: 0x40, 0xb0000: 0x80001000, 0xc0000: 0x80400040, 0xd0000: 0x1040, 0xe0000: 0x1000, 0xf0000: 0x80401040, 0x8000: 0x80001040, 0x18000: 0x40, 0x28000: 0x80400040, 0x38000: 0x80001000, 0x48000: 0x401000, 0x58000: 0x80401040, 0x68000: 0x0, 0x78000: 0x80400000, 0x88000: 0x1000, 0x98000: 0x80401000, 0xa8000: 0x400000, 0xb8000: 0x1040, 0xc8000: 0x80000000, 0xd8000: 0x400040, 0xe8000: 0x401040, 0xf8000: 0x80000040, 0x100000: 0x400040, 0x110000: 0x401000, 0x120000: 0x80000040, 0x130000: 0x0, 0x140000: 0x1040, 0x150000: 0x80400040, 0x160000: 0x80401000, 0x170000: 0x80001040, 0x180000: 0x80401040, 0x190000: 0x80000000, 0x1a0000: 0x80400000, 0x1b0000: 0x401040, 0x1c0000: 0x80001000, 0x1d0000: 0x400000, 0x1e0000: 0x40, 0x1f0000: 0x1000, 0x108000: 0x80400000, 0x118000: 0x80401040, 0x128000: 0x0, 0x138000: 0x401000, 0x148000: 0x400040, 0x158000: 0x80000000, 0x168000: 0x80001040, 0x178000: 0x40, 0x188000: 0x80000040, 0x198000: 0x1000, 0x1a8000: 0x80001000, 0x1b8000: 0x80400040, 0x1c8000: 0x1040, 0x1d8000: 0x80401000, 0x1e8000: 0x400000, 0x1f8000: 0x401040 }, { 0x0: 0x80, 0x1000: 0x1040000, 0x2000: 0x40000, 0x3000: 0x20000000, 0x4000: 0x20040080, 0x5000: 0x1000080, 0x6000: 0x21000080, 0x7000: 0x40080, 0x8000: 0x1000000, 0x9000: 0x20040000, 0xa000: 0x20000080, 0xb000: 0x21040080, 0xc000: 0x21040000, 0xd000: 0x0, 0xe000: 0x1040080, 0xf000: 0x21000000, 0x800: 0x1040080, 0x1800: 0x21000080, 0x2800: 0x80, 0x3800: 0x1040000, 0x4800: 0x40000, 0x5800: 0x20040080, 0x6800: 0x21040000, 0x7800: 0x20000000, 0x8800: 0x20040000, 0x9800: 0x0, 0xa800: 0x21040080, 0xb800: 0x1000080, 0xc800: 0x20000080, 0xd800: 0x21000000, 0xe800: 0x1000000, 0xf800: 0x40080, 0x10000: 0x40000, 0x11000: 0x80, 0x12000: 0x20000000, 0x13000: 0x21000080, 0x14000: 0x1000080, 0x15000: 0x21040000, 0x16000: 0x20040080, 0x17000: 0x1000000, 0x18000: 0x21040080, 0x19000: 0x21000000, 0x1a000: 0x1040000, 0x1b000: 0x20040000, 0x1c000: 0x40080, 0x1d000: 0x20000080, 0x1e000: 0x0, 0x1f000: 0x1040080, 0x10800: 0x21000080, 0x11800: 0x1000000, 0x12800: 0x1040000, 0x13800: 0x20040080, 0x14800: 0x20000000, 0x15800: 0x1040080, 0x16800: 0x80, 0x17800: 0x21040000, 0x18800: 0x40080, 0x19800: 0x21040080, 0x1a800: 0x0, 0x1b800: 0x21000000, 0x1c800: 0x1000080, 0x1d800: 0x40000, 0x1e800: 0x20040000, 0x1f800: 0x20000080 }, { 0x0: 0x10000008, 0x100: 0x2000, 0x200: 0x10200000, 0x300: 0x10202008, 0x400: 0x10002000, 0x500: 0x200000, 0x600: 0x200008, 0x700: 0x10000000, 0x800: 0x0, 0x900: 0x10002008, 0xa00: 0x202000, 0xb00: 0x8, 0xc00: 0x10200008, 0xd00: 0x202008, 0xe00: 0x2008, 0xf00: 0x10202000, 0x80: 0x10200000, 0x180: 0x10202008, 0x280: 0x8, 0x380: 0x200000, 0x480: 0x202008, 0x580: 0x10000008, 0x680: 0x10002000, 0x780: 0x2008, 0x880: 0x200008, 0x980: 0x2000, 0xa80: 0x10002008, 0xb80: 0x10200008, 0xc80: 0x0, 0xd80: 0x10202000, 0xe80: 0x202000, 0xf80: 0x10000000, 0x1000: 0x10002000, 0x1100: 0x10200008, 0x1200: 0x10202008, 0x1300: 0x2008, 0x1400: 0x200000, 0x1500: 0x10000000, 0x1600: 0x10000008, 0x1700: 0x202000, 0x1800: 0x202008, 0x1900: 0x0, 0x1a00: 0x8, 0x1b00: 0x10200000, 0x1c00: 0x2000, 0x1d00: 0x10002008, 0x1e00: 0x10202000, 0x1f00: 0x200008, 0x1080: 0x8, 0x1180: 0x202000, 0x1280: 0x200000, 0x1380: 0x10000008, 0x1480: 0x10002000, 0x1580: 0x2008, 0x1680: 0x10202008, 0x1780: 0x10200000, 0x1880: 0x10202000, 0x1980: 0x10200008, 0x1a80: 0x2000, 0x1b80: 0x202008, 0x1c80: 0x200008, 0x1d80: 0x0, 0x1e80: 0x10000000, 0x1f80: 0x10002008 }, { 0x0: 0x100000, 0x10: 0x2000401, 0x20: 0x400, 0x30: 0x100401, 0x40: 0x2100401, 0x50: 0x0, 0x60: 0x1, 0x70: 0x2100001, 0x80: 0x2000400, 0x90: 0x100001, 0xa0: 0x2000001, 0xb0: 0x2100400, 0xc0: 0x2100000, 0xd0: 0x401, 0xe0: 0x100400, 0xf0: 0x2000000, 0x8: 0x2100001, 0x18: 0x0, 0x28: 0x2000401, 0x38: 0x2100400, 0x48: 0x100000, 0x58: 0x2000001, 0x68: 0x2000000, 0x78: 0x401, 0x88: 0x100401, 0x98: 0x2000400, 0xa8: 0x2100000, 0xb8: 0x100001, 0xc8: 0x400, 0xd8: 0x2100401, 0xe8: 0x1, 0xf8: 0x100400, 0x100: 0x2000000, 0x110: 0x100000, 0x120: 0x2000401, 0x130: 0x2100001, 0x140: 0x100001, 0x150: 0x2000400, 0x160: 0x2100400, 0x170: 0x100401, 0x180: 0x401, 0x190: 0x2100401, 0x1a0: 0x100400, 0x1b0: 0x1, 0x1c0: 0x0, 0x1d0: 0x2100000, 0x1e0: 0x2000001, 0x1f0: 0x400, 0x108: 0x100400, 0x118: 0x2000401, 0x128: 0x2100001, 0x138: 0x1, 0x148: 0x2000000, 0x158: 0x100000, 0x168: 0x401, 0x178: 0x2100400, 0x188: 0x2000001, 0x198: 0x2100000, 0x1a8: 0x0, 0x1b8: 0x2100401, 0x1c8: 0x100401, 0x1d8: 0x400, 0x1e8: 0x2000400, 0x1f8: 0x100001 }, { 0x0: 0x8000820, 0x1: 0x20000, 0x2: 0x8000000, 0x3: 0x20, 0x4: 0x20020, 0x5: 0x8020820, 0x6: 0x8020800, 0x7: 0x800, 0x8: 0x8020000, 0x9: 0x8000800, 0xa: 0x20800, 0xb: 0x8020020, 0xc: 0x820, 0xd: 0x0, 0xe: 0x8000020, 0xf: 0x20820, 0x80000000: 0x800, 0x80000001: 0x8020820, 0x80000002: 0x8000820, 0x80000003: 0x8000000, 0x80000004: 0x8020000, 0x80000005: 0x20800, 0x80000006: 0x20820, 0x80000007: 0x20, 0x80000008: 0x8000020, 0x80000009: 0x820, 0x8000000a: 0x20020, 0x8000000b: 0x8020800, 0x8000000c: 0x0, 0x8000000d: 0x8020020, 0x8000000e: 0x8000800, 0x8000000f: 0x20000, 0x10: 0x20820, 0x11: 0x8020800, 0x12: 0x20, 0x13: 0x800, 0x14: 0x8000800, 0x15: 0x8000020, 0x16: 0x8020020, 0x17: 0x20000, 0x18: 0x0, 0x19: 0x20020, 0x1a: 0x8020000, 0x1b: 0x8000820, 0x1c: 0x8020820, 0x1d: 0x20800, 0x1e: 0x820, 0x1f: 0x8000000, 0x80000010: 0x20000, 0x80000011: 0x800, 0x80000012: 0x8020020, 0x80000013: 0x20820, 0x80000014: 0x20, 0x80000015: 0x8020000, 0x80000016: 0x8000000, 0x80000017: 0x8000820, 0x80000018: 0x8020820, 0x80000019: 0x8000020, 0x8000001a: 0x8000800, 0x8000001b: 0x0, 0x8000001c: 0x20800, 0x8000001d: 0x820, 0x8000001e: 0x20020, 0x8000001f: 0x8020800 }];

// Masks that select the SBOX input
var SBOX_MASK = [0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000, 0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f];

// Swap bits across the left and right words
function exchangeLR(offset, mask) {
	var t = (this._lBlock >>> offset ^ this._rBlock) & mask;
	this._rBlock ^= t;
	this._lBlock ^= t << offset;
}

function exchangeRL(offset, mask) {
	var t = (this._rBlock >>> offset ^ this._lBlock) & mask;
	this._lBlock ^= t;
	this._rBlock ^= t << offset;
}

var DES = function () {
	function DES() {
		_classCallCheck(this, DES);
	}

	_createClass(DES, [{
		key: 'algo',
		value: function algo() {
			return new _BlockCipher2.default().extend({
				_doReset: function _doReset() {
					// Shortcuts
					var key = this._key;
					var keyWords = key.words;

					// Select 56 bits according to PC1
					var keyBits = [];
					for (var i = 0; i < 56; i++) {
						var keyBitPos = PC1[i] - 1;
						keyBits[i] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
					}

					// Assemble 16 subkeys
					var subKeys = this._subKeys = [];
					for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
						// Create subkey
						var subKey = subKeys[nSubKey] = [];

						// Shortcut
						var bitShift = BIT_SHIFTS[nSubKey];

						// Select 48 bits according to PC2
						for (var i = 0; i < 24; i++) {
							// Select from the left 28 key bits
							subKey[i / 6 | 0] |= keyBits[(PC2[i] - 1 + bitShift) % 28] << 31 - i % 6;

							// Select from the right 28 key bits
							subKey[4 + (i / 6 | 0)] |= keyBits[28 + (PC2[i + 24] - 1 + bitShift) % 28] << 31 - i % 6;
						}

						// Since each subkey is applied to an expanded 32-bit input,
						// the subkey can be broken into 8 values scaled to 32-bits,
						// which allows the key to be used without expansion
						subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;
						for (var i = 1; i < 7; i++) {
							subKey[i] = subKey[i] >>> (i - 1) * 4 + 3;
						}
						subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
					}

					// Compute inverse subkeys
					var invSubKeys = this._invSubKeys = [];
					for (var i = 0; i < 16; i++) {
						invSubKeys[i] = subKeys[15 - i];
					}
				},

				encryptBlock: function encryptBlock(M, offset) {
					this._doCryptBlock(M, offset, this._subKeys);
				},

				decryptBlock: function decryptBlock(M, offset) {
					this._doCryptBlock(M, offset, this._invSubKeys);
				},

				_doCryptBlock: function _doCryptBlock(M, offset, subKeys) {
					// Get input
					this._lBlock = M[offset];
					this._rBlock = M[offset + 1];

					// Initial permutation
					exchangeLR.call(this, 4, 0x0f0f0f0f);
					exchangeLR.call(this, 16, 0x0000ffff);
					exchangeRL.call(this, 2, 0x33333333);
					exchangeRL.call(this, 8, 0x00ff00ff);
					exchangeLR.call(this, 1, 0x55555555);

					// Rounds
					for (var round = 0; round < 16; round++) {
						// Shortcuts
						var subKey = subKeys[round];
						var lBlock = this._lBlock;
						var rBlock = this._rBlock;

						// Feistel function
						var f = 0;
						for (var i = 0; i < 8; i++) {
							f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
						}
						this._lBlock = rBlock;
						this._rBlock = lBlock ^ f;
					}

					// Undo swap from last round
					var t = this._lBlock;
					this._lBlock = this._rBlock;
					this._rBlock = t;

					// Final permutation
					exchangeLR.call(this, 1, 0x55555555);
					exchangeRL.call(this, 8, 0x00ff00ff);
					exchangeRL.call(this, 2, 0x33333333);
					exchangeLR.call(this, 16, 0x0000ffff);
					exchangeLR.call(this, 4, 0x0f0f0f0f);

					// Set output
					M[offset] = this._lBlock;
					M[offset + 1] = this._rBlock;
				},

				keySize: 64 / 32,

				ivSize: 64 / 32,

				blockSize: 64 / 32
			});
		}
	}]);

	return DES;
}();

exports.default = DES;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StreamCipher = __webpack_require__(7);

var _StreamCipher2 = _interopRequireDefault(_StreamCipher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function generateKeystreamWord() {
	// Shortcuts
	var S = this._S;
	var i = this._i;
	var j = this._j;

	// Generate keystream word
	var keystreamWord = 0;
	for (var n = 0; n < 4; n++) {
		i = (i + 1) % 256;
		j = (j + S[i]) % 256;

		// Swap
		var t = S[i];
		S[i] = S[j];
		S[j] = t;

		keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
	}

	// Update counters
	this._i = i;
	this._j = j;

	return keystreamWord;
}

var RC4 = function () {
	function RC4() {
		_classCallCheck(this, RC4);
	}

	_createClass(RC4, [{
		key: 'algo',
		value: function algo() {
			return new _StreamCipher2.default().extend({
				_doReset: function _doReset() {
					// Shortcuts
					var key = this._key;
					var keyWords = key.words;
					var keySigBytes = key.sigBytes;

					// Init sbox
					var S = this._S = [];
					for (var i = 0; i < 256; i++) {
						S[i] = i;
					}

					// Key setup
					for (var i = 0, j = 0; i < 256; i++) {
						var keyByteIndex = i % keySigBytes;
						var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 0xff;

						j = (j + S[i] + keyByte) % 256;

						// Swap
						var t = S[i];
						S[i] = S[j];
						S[j] = t;
					}

					// Counters
					this._i = this._j = 0;
				},

				_doProcessBlock: function _doProcessBlock(M, offset) {
					M[offset] ^= generateKeystreamWord.call(this);
				},

				keySize: 256 / 32,

				ivSize: 0
			});
		}
	}]);

	return RC4;
}();

exports.default = RC4;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CryptoLib = {};

// Encoders
var Encoder = __webpack_require__(20);
CryptoLib.Encoder = Encoder;

// Hashers
var Hasher = __webpack_require__(2);
var md5 = __webpack_require__(12);
var ripemd160 = __webpack_require__(23);
var sha1 = __webpack_require__(13);
var sha224 = __webpack_require__(24);
var sha256 = __webpack_require__(26);
var sha384 = __webpack_require__(27);
var sha512 = __webpack_require__(29);
var sha3 = __webpack_require__(30);

CryptoLib.MD5 = new Hasher()._createHelper(new md5().algo());
CryptoLib.RIPEMD160 = new Hasher()._createHelper(new ripemd160().algo());
CryptoLib.SHA1 = new Hasher()._createHelper(new sha1().algo());
CryptoLib.SHA224 = new Hasher()._createHelper(new sha224().algo());
CryptoLib.SHA256 = new Hasher()._createHelper(new sha256().algo());
CryptoLib.SHA384 = new Hasher()._createHelper(new sha384().algo());
CryptoLib.SHA512 = new Hasher()._createHelper(new sha512().algo());
CryptoLib.SHA3 = new Hasher()._createHelper(new sha3().algo());

// Hashers with HMAC
CryptoLib.HMAC_MD5 = new Hasher()._createHmacHelper(new md5().algo());
CryptoLib.HMAC_RIPEMD160 = new Hasher()._createHmacHelper(new ripemd160().algo());
CryptoLib.HMAC_SHA1 = new Hasher()._createHmacHelper(new sha1().algo());
CryptoLib.HMAC_SHA224 = new Hasher()._createHmacHelper(new sha224().algo());
CryptoLib.HMAC_SHA256 = new Hasher()._createHmacHelper(new sha256().algo());
CryptoLib.HMAC_SHA384 = new Hasher()._createHmacHelper(new sha384().algo());
CryptoLib.HMAC_SHA512 = new Hasher()._createHmacHelper(new sha512().algo());
CryptoLib.HMAC_SHA3 = new Hasher()._createHmacHelper(new sha3().algo());

// Ciphers
var BlockCipher = __webpack_require__(4);
var StreamCipher = __webpack_require__(7);
var AES = __webpack_require__(37);
var DES = __webpack_require__(17);
var Rabbit = __webpack_require__(38);
var RC4 = __webpack_require__(18);
var RC4Drop = __webpack_require__(39);
var TripleDes = __webpack_require__(40);

CryptoLib.AES = new BlockCipher()._createHelper(new AES().algo());
CryptoLib.DES = new BlockCipher()._createHelper(new DES().algo());
CryptoLib.TripleDes = new BlockCipher()._createHelper(new TripleDes().algo());

CryptoLib.Rabbit = new StreamCipher()._createHelper(new Rabbit().algo());
CryptoLib.RC4 = new StreamCipher()._createHelper(new RC4().algo());
CryptoLib.RC4Drop = new StreamCipher()._createHelper(new RC4Drop().algo());

// Extra (standalone) ciphers
var Blowfish = __webpack_require__(41);
var Twofish = __webpack_require__(42);
// const RSA = require('./Ciphers/RSA');

CryptoLib.Blowfish = new Blowfish()._createHelper();
CryptoLib.Twofish = new Twofish()._createHelper();
// CryptoLib.RSA = new RSA()._createHelper();

// Packers

// Key Derivers
var EvpKDF = __webpack_require__(16);
CryptoLib.EvpKDF = function (password, salt, cfg) {
	var evpkdf = new EvpKDF().algo();
	return evpkdf.create(cfg).compute(password, salt);
};

var PBKDF2 = __webpack_require__(43);
CryptoLib.PBKDF2 = function (password, salt, cfg) {
	var pbkdf2 = new PBKDF2().algo();
	return pbkdf2.create(cfg).compute(password, salt);
};

module.exports = CryptoLib;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Base = __webpack_require__(8);

var _Base2 = _interopRequireDefault(_Base);

var _Hex = __webpack_require__(21);

var _Hex2 = _interopRequireDefault(_Hex);

var _Latin = __webpack_require__(9);

var _Latin2 = _interopRequireDefault(_Latin);

var _UTF = __webpack_require__(5);

var _UTF2 = _interopRequireDefault(_UTF);

var _UTF3 = __webpack_require__(22);

var _UTF4 = _interopRequireDefault(_UTF3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Encoder = {
	Base64: _Base2.default,
	Hex: _Hex2.default,
	Latin1: _Latin2.default,
	Utf8: _UTF2.default,
	Utf16: _UTF4.default.UTF16BE,
	Utf16BE: _UTF4.default.UTF16BE,
	Utf16LE: _UTF4.default.UTF16LE
};

exports.default = Encoder;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Hex = {
    stringify: function stringify(wordArray) {
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;
        var hexChars = [];
        for (var i = 0; i < sigBytes; i++) {
            var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
            hexChars.push((bite >>> 4).toString(16));
            hexChars.push((bite & 0x0f).toString(16));
        }
        return hexChars.join("");
    },

    parse: function parse(hexStr) {
        // Shortcut
        var hexStrLength = hexStr.length;

        // Convert
        var words = [];
        for (var i = 0; i < hexStrLength; i += 2) {
            words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
        }

        return new _WordArray2.default().init(words, hexStrLength / 2);
    }
};

exports.default = Hex;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function swapEndian(word) {
    return word << 8 & 0xff00ff00 | word >>> 8 & 0x00ff00ff;
}

var UTF16BE = {
    stringify: function stringify(wordArray) {
        // Shortcuts
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;

        // Convert
        var utf16Chars = [];
        for (var i = 0; i < sigBytes; i += 2) {
            var codePoint = words[i >>> 2] >>> 16 - i % 4 * 8 & 0xffff;
            utf16Chars.push(String.fromCharCode(codePoint));
        }

        return utf16Chars.join('');
    },

    parse: function parse(utf16Str) {
        // Shortcut
        var utf16StrLength = utf16Str.length;

        // Convert
        var words = [];
        for (var i = 0; i < utf16StrLength; i++) {
            words[i >>> 1] |= utf16Str.charCodeAt(i) << 16 - i % 2 * 16;
        }

        return new _WordArray2.default().create(words, utf16StrLength * 2);
    }
};

var UTF16LE = {
    stringify: function stringify(wordArray) {
        // Shortcuts
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;

        // Convert
        var utf16Chars = [];
        for (var i = 0; i < sigBytes; i += 2) {
            var codePoint = swapEndian(words[i >>> 2] >>> 16 - i % 4 * 8 & 0xffff);
            utf16Chars.push(String.fromCharCode(codePoint));
        }

        return utf16Chars.join('');
    },
    parse: function parse(utf16Str) {
        // Shortcut
        var utf16StrLength = utf16Str.length;

        // Convert
        var words = [];
        for (var i = 0; i < utf16StrLength; i++) {
            words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << 16 - i % 2 * 16);
        }

        return new _WordArray2.default().create(words, utf16StrLength * 2);
    }
};

exports.default = {
    UTF16BE: UTF16BE,
    UTF16LE: UTF16LE
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hasher2 = __webpack_require__(2);

var _Hasher3 = _interopRequireDefault(_Hasher2);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var wordArray = new _WordArray2.default();

// Constants table
var _zl = wordArray.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]);
var _zr = wordArray.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]);
var _sl = wordArray.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]);
var _sr = wordArray.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]);

var _hl = wordArray.create([0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
var _hr = wordArray.create([0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

// Helpers
function f1(x, y, z) {
    return x ^ y ^ z;
}

function f2(x, y, z) {
    return x & y | ~x & z;
}

function f3(x, y, z) {
    return (x | ~y) ^ z;
}

function f4(x, y, z) {
    return x & z | y & ~z;
}

function f5(x, y, z) {
    return x ^ (y | ~z);
}

function rotl(x, n) {
    return x << n | x >>> 32 - n;
}

var RIPEMD160 = function (_Hasher) {
    _inherits(RIPEMD160, _Hasher);

    function RIPEMD160() {
        _classCallCheck(this, RIPEMD160);

        return _possibleConstructorReturn(this, (RIPEMD160.__proto__ || Object.getPrototypeOf(RIPEMD160)).call(this));
    }

    _createClass(RIPEMD160, [{
        key: "algo",
        value: function algo() {
            return new _Hasher3.default().extend({
                _doReset: function _doReset() {
                    this._hash = wordArray.create([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
                },

                _doProcessBlock: function _doProcessBlock(M, offset) {
                    // Swap endian
                    for (var i = 0; i < 16; i++) {
                        // Shortcuts
                        var offset_i = offset + i;
                        var M_offset_i = M[offset_i];

                        // Swap
                        M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
                    }
                    // Shortcut
                    var H = this._hash.words;
                    var hl = _hl.words;
                    var hr = _hr.words;
                    var zl = _zl.words;
                    var zr = _zr.words;
                    var sl = _sl.words;
                    var sr = _sr.words;

                    // Working variables
                    var al, bl, cl, dl, el;
                    var ar, br, cr, dr, er;

                    ar = al = H[0];
                    br = bl = H[1];
                    cr = cl = H[2];
                    dr = dl = H[3];
                    er = el = H[4];
                    // Computation
                    var t;
                    for (var i = 0; i < 80; i += 1) {
                        t = al + M[offset + zl[i]] | 0;
                        if (i < 16) {
                            t += f1(bl, cl, dl) + hl[0];
                        } else if (i < 32) {
                            t += f2(bl, cl, dl) + hl[1];
                        } else if (i < 48) {
                            t += f3(bl, cl, dl) + hl[2];
                        } else if (i < 64) {
                            t += f4(bl, cl, dl) + hl[3];
                        } else {
                            // if (i<80) {
                            t += f5(bl, cl, dl) + hl[4];
                        }
                        t = t | 0;
                        t = rotl(t, sl[i]);
                        t = t + el | 0;
                        al = el;
                        el = dl;
                        dl = rotl(cl, 10);
                        cl = bl;
                        bl = t;

                        t = ar + M[offset + zr[i]] | 0;
                        if (i < 16) {
                            t += f5(br, cr, dr) + hr[0];
                        } else if (i < 32) {
                            t += f4(br, cr, dr) + hr[1];
                        } else if (i < 48) {
                            t += f3(br, cr, dr) + hr[2];
                        } else if (i < 64) {
                            t += f2(br, cr, dr) + hr[3];
                        } else {
                            // if (i<80) {
                            t += f1(br, cr, dr) + hr[4];
                        }
                        t = t | 0;
                        t = rotl(t, sr[i]);
                        t = t + er | 0;
                        ar = er;
                        er = dr;
                        dr = rotl(cr, 10);
                        cr = br;
                        br = t;
                    }
                    // Intermediate hash value
                    t = H[1] + cl + dr | 0;
                    H[1] = H[2] + dl + er | 0;
                    H[2] = H[3] + el + ar | 0;
                    H[3] = H[4] + al + br | 0;
                    H[4] = H[0] + bl + cr | 0;
                    H[0] = t;
                },

                _doFinalize: function _doFinalize() {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
                    dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 0x00ff00ff | (nBitsTotal << 24 | nBitsTotal >>> 8) & 0xff00ff00;
                    data.sigBytes = (dataWords.length + 1) * 4;

                    // Hash final blocks
                    this._process();

                    // Shortcuts
                    var hash = this._hash;
                    var H = hash.words;

                    // Swap endian
                    for (var i = 0; i < 5; i++) {
                        // Shortcut
                        var H_i = H[i];

                        // Swap
                        H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
                    }

                    // Return final computed hash
                    return hash;
                },

                clone: function clone() {
                    var clone = _Hasher3.default.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                }
            });
        }
    }]);

    return RIPEMD160;
}(_Hasher3.default);

exports.default = RIPEMD160;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

var _SHA2 = __webpack_require__(25);

var _SHA3 = _interopRequireDefault(_SHA2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sha256 = new _SHA3.default().algo();

var SHA224 = function (_SHA) {
    _inherits(SHA224, _SHA);

    function SHA224() {
        _classCallCheck(this, SHA224);

        return _possibleConstructorReturn(this, (SHA224.__proto__ || Object.getPrototypeOf(SHA224)).call(this));
    }

    _createClass(SHA224, [{
        key: 'algo',
        value: function algo() {
            return sha256.extend({
                _doReset: function _doReset() {
                    this._hash = new _WordArray2.default().init([0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4]);
                },

                _doFinalize: function _doFinalize() {
                    var hash = sha256._doFinalize.call(this);

                    hash.sigBytes -= 4;

                    return hash;
                }
            });
        }
    }]);

    return SHA224;
}(_SHA3.default);

exports.default = SHA224;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hasher2 = __webpack_require__(2);

var _Hasher3 = _interopRequireDefault(_Hasher2);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H = [];
var K = [];
(function () {
	function isPrime(n) {
		var sqrtN = Math.sqrt(n);
		for (var factor = 2; factor <= sqrtN; factor++) {
			if (!(n % factor)) {
				return false;
			}
		}

		return true;
	}

	function getFractionalBits(n) {
		return (n - (n | 0)) * 0x100000000 | 0;
	}

	var n = 2;
	var nPrime = 0;
	while (nPrime < 64) {
		if (isPrime(n)) {
			if (nPrime < 8) {
				H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
			}
			K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

			nPrime++;
		}

		n++;
	}
})();
var W = [];

var SHA256 = function (_Hasher) {
	_inherits(SHA256, _Hasher);

	function SHA256() {
		_classCallCheck(this, SHA256);

		return _possibleConstructorReturn(this, (SHA256.__proto__ || Object.getPrototypeOf(SHA256)).call(this));
	}

	_createClass(SHA256, [{
		key: 'algo',
		value: function algo() {
			return new _Hasher3.default().extend({
				_doReset: function _doReset() {
					this._hash = new _WordArray2.default().init(H.slice(0));
				},

				_doProcessBlock: function _doProcessBlock(M, offset) {
					var H = this._hash.words;
					var a = H[0];
					var b = H[1];
					var c = H[2];
					var d = H[3];
					var e = H[4];
					var f = H[5];
					var g = H[6];
					var h = H[7];

					// Computation
					for (var i = 0; i < 64; i++) {
						if (i < 16) {
							W[i] = M[offset + i] | 0;
						} else {
							var gamma0x = W[i - 15];
							var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;

							var gamma1x = W[i - 2];
							var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;

							W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
						}

						var ch = e & f ^ ~e & g;
						var maj = a & b ^ a & c ^ b & c;

						var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
						var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);

						var t1 = h + sigma1 + ch + K[i] + W[i];
						var t2 = sigma0 + maj;

						h = g;
						g = f;
						f = e;
						e = d + t1 | 0;
						d = c;
						c = b;
						b = a;
						a = t1 + t2 | 0;
					}

					// Intermediate hash value
					H[0] = H[0] + a | 0;
					H[1] = H[1] + b | 0;
					H[2] = H[2] + c | 0;
					H[3] = H[3] + d | 0;
					H[4] = H[4] + e | 0;
					H[5] = H[5] + f | 0;
					H[6] = H[6] + g | 0;
					H[7] = H[7] + h | 0;
				},

				_doFinalize: function _doFinalize() {
					// Shortcuts
					var data = this._data;
					var dataWords = data.words;

					var nBitsTotal = this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;

					// Add padding
					dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
					data.sigBytes = dataWords.length * 4;

					// Hash final blocks
					this._process();

					// Return final computed hash
					return this._hash;
				},

				clone: function clone() {
					var clone = C.lib.Hasher.clone.call(this);
					clone._hash = this._hash.clone();

					return clone;
				}
			});
		}
	}]);

	return SHA256;
}(_Hasher3.default);

exports.default = SHA256;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hasher2 = __webpack_require__(2);

var _Hasher3 = _interopRequireDefault(_Hasher2);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H = [];
var K = [];
(function () {
	function isPrime(n) {
		var sqrtN = Math.sqrt(n);
		for (var factor = 2; factor <= sqrtN; factor++) {
			if (!(n % factor)) {
				return false;
			}
		}

		return true;
	}

	function getFractionalBits(n) {
		return (n - (n | 0)) * 0x100000000 | 0;
	}

	var n = 2;
	var nPrime = 0;
	while (nPrime < 64) {
		if (isPrime(n)) {
			if (nPrime < 8) {
				H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
			}
			K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

			nPrime++;
		}

		n++;
	}
})();
var W = [];

var SHA256 = function (_Hasher) {
	_inherits(SHA256, _Hasher);

	function SHA256() {
		_classCallCheck(this, SHA256);

		return _possibleConstructorReturn(this, (SHA256.__proto__ || Object.getPrototypeOf(SHA256)).call(this));
	}

	_createClass(SHA256, [{
		key: 'algo',
		value: function algo() {
			return new _Hasher3.default().extend({
				_doReset: function _doReset() {
					this._hash = new _WordArray2.default().init(H.slice(0));
				},

				_doProcessBlock: function _doProcessBlock(M, offset) {
					var H = this._hash.words;
					var a = H[0];
					var b = H[1];
					var c = H[2];
					var d = H[3];
					var e = H[4];
					var f = H[5];
					var g = H[6];
					var h = H[7];

					// Computation
					for (var i = 0; i < 64; i++) {
						if (i < 16) {
							W[i] = M[offset + i] | 0;
						} else {
							var gamma0x = W[i - 15];
							var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;

							var gamma1x = W[i - 2];
							var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;

							W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
						}

						var ch = e & f ^ ~e & g;
						var maj = a & b ^ a & c ^ b & c;

						var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
						var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);

						var t1 = h + sigma1 + ch + K[i] + W[i];
						var t2 = sigma0 + maj;

						h = g;
						g = f;
						f = e;
						e = d + t1 | 0;
						d = c;
						c = b;
						b = a;
						a = t1 + t2 | 0;
					}

					// Intermediate hash value
					H[0] = H[0] + a | 0;
					H[1] = H[1] + b | 0;
					H[2] = H[2] + c | 0;
					H[3] = H[3] + d | 0;
					H[4] = H[4] + e | 0;
					H[5] = H[5] + f | 0;
					H[6] = H[6] + g | 0;
					H[7] = H[7] + h | 0;
				},

				_doFinalize: function _doFinalize() {
					// Shortcuts
					var data = this._data;
					var dataWords = data.words;

					var nBitsTotal = this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;

					// Add padding
					dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
					data.sigBytes = dataWords.length * 4;

					// Hash final blocks
					this._process();

					// Return final computed hash
					return this._hash;
				},

				clone: function clone() {
					var clone = C.lib.Hasher.clone.call(this);
					clone._hash = this._hash.clone();

					return clone;
				}
			});
		}
	}]);

	return SHA256;
}(_Hasher3.default);

exports.default = SHA256;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hasher = __webpack_require__(2);

var _Hasher2 = _interopRequireDefault(_Hasher);

var _x64Core = __webpack_require__(3);

var _x64Core2 = _interopRequireDefault(_x64Core);

var _SHA2 = __webpack_require__(28);

var _SHA3 = _interopRequireDefault(_SHA2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var X64Word = _x64Core2.default.Word;
var X64WordArray = _x64Core2.default.WordArray;

var sha512 = new _SHA3.default().algo();

var SHA384 = function (_SHA) {
    _inherits(SHA384, _SHA);

    function SHA384() {
        _classCallCheck(this, SHA384);

        return _possibleConstructorReturn(this, (SHA384.__proto__ || Object.getPrototypeOf(SHA384)).call(this));
    }

    _createClass(SHA384, [{
        key: 'algo',
        value: function algo() {
            return sha512.extend({
                _doReset: function _doReset() {
                    this._hash = new X64WordArray.init([new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507), new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939), new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511), new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)]);
                },

                _doFinalize: function _doFinalize() {
                    var hash = sha512._doFinalize.call(this);

                    hash.sigBytes -= 16;

                    return hash;
                }
            });
        }
    }]);

    return SHA384;
}(_SHA3.default);

exports.default = SHA384;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hasher2 = __webpack_require__(2);

var _Hasher3 = _interopRequireDefault(_Hasher2);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

var _x64Core = __webpack_require__(3);

var _x64Core2 = _interopRequireDefault(_x64Core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var X64Word = _x64Core2.default.Word;
var X64WordArray = _x64Core2.default.WordArray;

function X64Word_create() {
    return X64Word.create.apply(X64Word, arguments);
}

// Constants
var K = [X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd), X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc), X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019), X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118), X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe), X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2), X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1), X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694), X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3), X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65), X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483), X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5), X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210), X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4), X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725), X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70), X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926), X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df), X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8), X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b), X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001), X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30), X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910), X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8), X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53), X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8), X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb), X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3), X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60), X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec), X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9), X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b), X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207), X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178), X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6), X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b), X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493), X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c), X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a), X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)];

// Reusable objects
var W = [];
(function () {
    for (var i = 0; i < 80; i++) {
        W[i] = X64Word_create();
    }
})();

var SHA512 = function (_Hasher) {
    _inherits(SHA512, _Hasher);

    function SHA512() {
        _classCallCheck(this, SHA512);

        return _possibleConstructorReturn(this, (SHA512.__proto__ || Object.getPrototypeOf(SHA512)).call(this));
    }

    _createClass(SHA512, [{
        key: 'algo',
        value: function algo() {
            return new _Hasher3.default().extend({
                _doReset: function _doReset() {
                    this._hash = new X64WordArray.init([new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b), new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1), new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f), new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)]);
                },

                _doProcessBlock: function _doProcessBlock(M, offset) {
                    // Shortcuts
                    var H = this._hash.words;

                    var H0 = H[0];
                    var H1 = H[1];
                    var H2 = H[2];
                    var H3 = H[3];
                    var H4 = H[4];
                    var H5 = H[5];
                    var H6 = H[6];
                    var H7 = H[7];

                    var H0h = H0.high;
                    var H0l = H0.low;
                    var H1h = H1.high;
                    var H1l = H1.low;
                    var H2h = H2.high;
                    var H2l = H2.low;
                    var H3h = H3.high;
                    var H3l = H3.low;
                    var H4h = H4.high;
                    var H4l = H4.low;
                    var H5h = H5.high;
                    var H5l = H5.low;
                    var H6h = H6.high;
                    var H6l = H6.low;
                    var H7h = H7.high;
                    var H7l = H7.low;

                    // Working variables
                    var ah = H0h;
                    var al = H0l;
                    var bh = H1h;
                    var bl = H1l;
                    var ch = H2h;
                    var cl = H2l;
                    var dh = H3h;
                    var dl = H3l;
                    var eh = H4h;
                    var el = H4l;
                    var fh = H5h;
                    var fl = H5l;
                    var gh = H6h;
                    var gl = H6l;
                    var hh = H7h;
                    var hl = H7l;

                    // Rounds
                    for (var i = 0; i < 80; i++) {
                        // Shortcut
                        var Wi = W[i];

                        // Extend message
                        if (i < 16) {
                            var Wih = Wi.high = M[offset + i * 2] | 0;
                            var Wil = Wi.low = M[offset + i * 2 + 1] | 0;
                        } else {
                            // Gamma0
                            var gamma0x = W[i - 15];
                            var gamma0xh = gamma0x.high;
                            var gamma0xl = gamma0x.low;
                            var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
                            var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25);

                            // Gamma1
                            var gamma1x = W[i - 2];
                            var gamma1xh = gamma1x.high;
                            var gamma1xl = gamma1x.low;
                            var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
                            var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26);

                            // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
                            var Wi7 = W[i - 7];
                            var Wi7h = Wi7.high;
                            var Wi7l = Wi7.low;

                            var Wi16 = W[i - 16];
                            var Wi16h = Wi16.high;
                            var Wi16l = Wi16.low;

                            var Wil = gamma0l + Wi7l;
                            var Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
                            var Wil = Wil + gamma1l;
                            var Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
                            var Wil = Wil + Wi16l;
                            var Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);

                            Wi.high = Wih;
                            Wi.low = Wil;
                        }

                        var chh = eh & fh ^ ~eh & gh;
                        var chl = el & fl ^ ~el & gl;
                        var majh = ah & bh ^ ah & ch ^ bh & ch;
                        var majl = al & bl ^ al & cl ^ bl & cl;

                        var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
                        var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
                        var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
                        var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9);

                        // t1 = h + sigma1 + ch + K[i] + W[i]
                        var Ki = K[i];
                        var Kih = Ki.high;
                        var Kil = Ki.low;

                        var t1l = hl + sigma1l;
                        var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
                        var t1l = t1l + chl;
                        var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
                        var t1l = t1l + Kil;
                        var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
                        var t1l = t1l + Wil;
                        var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);

                        // t2 = sigma0 + maj
                        var t2l = sigma0l + majl;
                        var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);

                        // Update working variables
                        hh = gh;
                        hl = gl;
                        gh = fh;
                        gl = fl;
                        fh = eh;
                        fl = el;
                        el = dl + t1l | 0;
                        eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
                        dh = ch;
                        dl = cl;
                        ch = bh;
                        cl = bl;
                        bh = ah;
                        bl = al;
                        al = t1l + t2l | 0;
                        ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
                    }

                    // Intermediate hash value
                    H0l = H0.low = H0l + al;
                    H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
                    H1l = H1.low = H1l + bl;
                    H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
                    H2l = H2.low = H2l + cl;
                    H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
                    H3l = H3.low = H3l + dl;
                    H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
                    H4l = H4.low = H4l + el;
                    H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
                    H5l = H5.low = H5l + fl;
                    H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
                    H6l = H6.low = H6l + gl;
                    H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
                    H7l = H7.low = H7l + hl;
                    H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
                },

                _doFinalize: function _doFinalize() {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
                    dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
                    dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
                    data.sigBytes = dataWords.length * 4;

                    // Hash final blocks
                    this._process();

                    // Convert hash to 32-bit word array before returning
                    var hash = this._hash.toX32();

                    // Return final computed hash
                    return hash;
                },

                clone: function clone() {
                    var clone = _Hasher3.default.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                },

                blockSize: 1024 / 32
            });
        }
    }]);

    return SHA512;
}(_Hasher3.default);

exports.default = SHA512;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hasher2 = __webpack_require__(2);

var _Hasher3 = _interopRequireDefault(_Hasher2);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

var _x64Core = __webpack_require__(3);

var _x64Core2 = _interopRequireDefault(_x64Core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var X64Word = _x64Core2.default.Word;
var X64WordArray = _x64Core2.default.WordArray;

function X64Word_create() {
    return X64Word.create.apply(X64Word, arguments);
}

// Constants
var K = [X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd), X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc), X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019), X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118), X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe), X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2), X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1), X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694), X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3), X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65), X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483), X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5), X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210), X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4), X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725), X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70), X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926), X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df), X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8), X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b), X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001), X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30), X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910), X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8), X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53), X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8), X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb), X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3), X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60), X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec), X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9), X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b), X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207), X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178), X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6), X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b), X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493), X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c), X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a), X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)];

// Reusable objects
var W = [];
(function () {
    for (var i = 0; i < 80; i++) {
        W[i] = X64Word_create();
    }
})();

var SHA512 = function (_Hasher) {
    _inherits(SHA512, _Hasher);

    function SHA512() {
        _classCallCheck(this, SHA512);

        return _possibleConstructorReturn(this, (SHA512.__proto__ || Object.getPrototypeOf(SHA512)).call(this));
    }

    _createClass(SHA512, [{
        key: 'algo',
        value: function algo() {
            return new _Hasher3.default().extend({
                _doReset: function _doReset() {
                    this._hash = new X64WordArray.init([new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b), new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1), new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f), new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)]);
                },

                _doProcessBlock: function _doProcessBlock(M, offset) {
                    // Shortcuts
                    var H = this._hash.words;

                    var H0 = H[0];
                    var H1 = H[1];
                    var H2 = H[2];
                    var H3 = H[3];
                    var H4 = H[4];
                    var H5 = H[5];
                    var H6 = H[6];
                    var H7 = H[7];

                    var H0h = H0.high;
                    var H0l = H0.low;
                    var H1h = H1.high;
                    var H1l = H1.low;
                    var H2h = H2.high;
                    var H2l = H2.low;
                    var H3h = H3.high;
                    var H3l = H3.low;
                    var H4h = H4.high;
                    var H4l = H4.low;
                    var H5h = H5.high;
                    var H5l = H5.low;
                    var H6h = H6.high;
                    var H6l = H6.low;
                    var H7h = H7.high;
                    var H7l = H7.low;

                    // Working variables
                    var ah = H0h;
                    var al = H0l;
                    var bh = H1h;
                    var bl = H1l;
                    var ch = H2h;
                    var cl = H2l;
                    var dh = H3h;
                    var dl = H3l;
                    var eh = H4h;
                    var el = H4l;
                    var fh = H5h;
                    var fl = H5l;
                    var gh = H6h;
                    var gl = H6l;
                    var hh = H7h;
                    var hl = H7l;

                    // Rounds
                    for (var i = 0; i < 80; i++) {
                        // Shortcut
                        var Wi = W[i];

                        // Extend message
                        if (i < 16) {
                            var Wih = Wi.high = M[offset + i * 2] | 0;
                            var Wil = Wi.low = M[offset + i * 2 + 1] | 0;
                        } else {
                            // Gamma0
                            var gamma0x = W[i - 15];
                            var gamma0xh = gamma0x.high;
                            var gamma0xl = gamma0x.low;
                            var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
                            var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25);

                            // Gamma1
                            var gamma1x = W[i - 2];
                            var gamma1xh = gamma1x.high;
                            var gamma1xl = gamma1x.low;
                            var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
                            var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26);

                            // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
                            var Wi7 = W[i - 7];
                            var Wi7h = Wi7.high;
                            var Wi7l = Wi7.low;

                            var Wi16 = W[i - 16];
                            var Wi16h = Wi16.high;
                            var Wi16l = Wi16.low;

                            var Wil = gamma0l + Wi7l;
                            var Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
                            var Wil = Wil + gamma1l;
                            var Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
                            var Wil = Wil + Wi16l;
                            var Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);

                            Wi.high = Wih;
                            Wi.low = Wil;
                        }

                        var chh = eh & fh ^ ~eh & gh;
                        var chl = el & fl ^ ~el & gl;
                        var majh = ah & bh ^ ah & ch ^ bh & ch;
                        var majl = al & bl ^ al & cl ^ bl & cl;

                        var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
                        var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
                        var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
                        var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9);

                        // t1 = h + sigma1 + ch + K[i] + W[i]
                        var Ki = K[i];
                        var Kih = Ki.high;
                        var Kil = Ki.low;

                        var t1l = hl + sigma1l;
                        var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
                        var t1l = t1l + chl;
                        var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
                        var t1l = t1l + Kil;
                        var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
                        var t1l = t1l + Wil;
                        var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);

                        // t2 = sigma0 + maj
                        var t2l = sigma0l + majl;
                        var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);

                        // Update working variables
                        hh = gh;
                        hl = gl;
                        gh = fh;
                        gl = fl;
                        fh = eh;
                        fl = el;
                        el = dl + t1l | 0;
                        eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
                        dh = ch;
                        dl = cl;
                        ch = bh;
                        cl = bl;
                        bh = ah;
                        bl = al;
                        al = t1l + t2l | 0;
                        ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
                    }

                    // Intermediate hash value
                    H0l = H0.low = H0l + al;
                    H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
                    H1l = H1.low = H1l + bl;
                    H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
                    H2l = H2.low = H2l + cl;
                    H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
                    H3l = H3.low = H3l + dl;
                    H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
                    H4l = H4.low = H4l + el;
                    H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
                    H5l = H5.low = H5l + fl;
                    H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
                    H6l = H6.low = H6l + gl;
                    H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
                    H7l = H7.low = H7l + hl;
                    H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
                },

                _doFinalize: function _doFinalize() {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
                    dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
                    dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
                    data.sigBytes = dataWords.length * 4;

                    // Hash final blocks
                    this._process();

                    // Convert hash to 32-bit word array before returning
                    var hash = this._hash.toX32();

                    // Return final computed hash
                    return hash;
                },

                clone: function clone() {
                    var clone = _Hasher3.default.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                },

                blockSize: 1024 / 32
            });
        }
    }]);

    return SHA512;
}(_Hasher3.default);

exports.default = SHA512;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hasher2 = __webpack_require__(2);

var _Hasher3 = _interopRequireDefault(_Hasher2);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

var _x64Core = __webpack_require__(3);

var _x64Core2 = _interopRequireDefault(_x64Core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var X64Word = _x64Core2.default.Word;
// const X64WordArray = x64Core.WordArray;

// Constants tables
var RHO_OFFSETS = [];
var PI_INDEXES = [];
var ROUND_CONSTANTS = [];

// Compute Constants
(function () {
	// Compute rho offset constants
	var x = 1,
	    y = 0;
	for (var t = 0; t < 24; t++) {
		RHO_OFFSETS[x + 5 * y] = (t + 1) * (t + 2) / 2 % 64;

		var newX = y % 5;
		var newY = (2 * x + 3 * y) % 5;
		x = newX;
		y = newY;
	}

	// Compute pi index constants
	for (var x = 0; x < 5; x++) {
		for (var y = 0; y < 5; y++) {
			PI_INDEXES[x + 5 * y] = y + (2 * x + 3 * y) % 5 * 5;
		}
	}

	// Compute round constants
	var LFSR = 0x01;
	for (var i = 0; i < 24; i++) {
		var roundConstantMsw = 0;
		var roundConstantLsw = 0;

		for (var j = 0; j < 7; j++) {
			if (LFSR & 0x01) {
				var bitPosition = (1 << j) - 1;
				if (bitPosition < 32) {
					roundConstantLsw ^= 1 << bitPosition;
				} else /* if (bitPosition >= 32) */{
						roundConstantMsw ^= 1 << bitPosition - 32;
					}
			}

			// Compute next LFSR
			if (LFSR & 0x80) {
				// Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
				LFSR = LFSR << 1 ^ 0x71;
			} else {
				LFSR <<= 1;
			}
		}

		ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
	}
})();

// Reusable objects for temporary values
var T = [];
(function () {
	for (var i = 0; i < 25; i++) {
		T[i] = X64Word.create();
	}
})();

var SHA3 = function (_Hasher) {
	_inherits(SHA3, _Hasher);

	function SHA3() {
		_classCallCheck(this, SHA3);

		return _possibleConstructorReturn(this, (SHA3.__proto__ || Object.getPrototypeOf(SHA3)).call(this));
	}

	_createClass(SHA3, [{
		key: 'algo',
		value: function algo() {
			var hasher = new _Hasher3.default();
			return hasher.extend({
				/**
     * Configuration options.
     *
     * @property {number} outputLength
     *   The desired number of bits in the output hash.
     *   Only values permitted are: 224, 256, 384, 512.
     *   Default: 512
     */
				cfg: hasher.cfg.extend({
					outputLength: 512
				}),

				_doReset: function _doReset() {
					var state = this._state = [];
					for (var i = 0; i < 25; i++) {
						state[i] = new X64Word.init();
					}

					this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
				},

				_doProcessBlock: function _doProcessBlock(M, offset) {
					// Shortcuts
					var state = this._state;
					var nBlockSizeLanes = this.blockSize / 2;

					// Absorb
					for (var i = 0; i < nBlockSizeLanes; i++) {
						// Shortcuts
						var M2i = M[offset + 2 * i];
						var M2i1 = M[offset + 2 * i + 1];

						// Swap endian
						M2i = (M2i << 8 | M2i >>> 24) & 0x00ff00ff | (M2i << 24 | M2i >>> 8) & 0xff00ff00;
						M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 0x00ff00ff | (M2i1 << 24 | M2i1 >>> 8) & 0xff00ff00;

						// Absorb message into state
						var lane = state[i];
						lane.high ^= M2i1;
						lane.low ^= M2i;
					}

					// Rounds
					for (var round = 0; round < 24; round++) {
						// Theta
						for (var x = 0; x < 5; x++) {
							// Mix column lanes
							var tMsw = 0,
							    tLsw = 0;
							for (var y = 0; y < 5; y++) {
								var lane = state[x + 5 * y];
								tMsw ^= lane.high;
								tLsw ^= lane.low;
							}

							// Temporary values
							var Tx = T[x];
							Tx.high = tMsw;
							Tx.low = tLsw;
						}
						for (var x = 0; x < 5; x++) {
							// Shortcuts
							var Tx4 = T[(x + 4) % 5];
							var Tx1 = T[(x + 1) % 5];
							var Tx1Msw = Tx1.high;
							var Tx1Lsw = Tx1.low;

							// Mix surrounding columns
							var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
							var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);
							for (var y = 0; y < 5; y++) {
								var lane = state[x + 5 * y];
								lane.high ^= tMsw;
								lane.low ^= tLsw;
							}
						}

						// Rho Pi
						for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
							// Shortcuts
							var lane = state[laneIndex];
							var laneMsw = lane.high;
							var laneLsw = lane.low;
							var rhoOffset = RHO_OFFSETS[laneIndex];

							// Rotate lanes
							if (rhoOffset < 32) {
								var tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
								var tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
							} else /* if (rhoOffset >= 32) */{
									var tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
									var tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
								}

							// Transpose lanes
							var TPiLane = T[PI_INDEXES[laneIndex]];
							TPiLane.high = tMsw;
							TPiLane.low = tLsw;
						}

						// Rho pi at x = y = 0
						var T0 = T[0];
						var state0 = state[0];
						T0.high = state0.high;
						T0.low = state0.low;

						// Chi
						for (var x = 0; x < 5; x++) {
							for (var y = 0; y < 5; y++) {
								// Shortcuts
								var laneIndex = x + 5 * y;
								var lane = state[laneIndex];
								var TLane = T[laneIndex];
								var Tx1Lane = T[(x + 1) % 5 + 5 * y];
								var Tx2Lane = T[(x + 2) % 5 + 5 * y];

								// Mix rows
								lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
								lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
							}
						}

						// Iota
						var lane = state[0];
						var roundConstant = ROUND_CONSTANTS[round];
						lane.high ^= roundConstant.high;
						lane.low ^= roundConstant.low;;
					}
				},

				_doFinalize: function _doFinalize() {
					// Shortcuts
					var data = this._data;
					var dataWords = data.words;
					var nBitsTotal = this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;
					var blockSizeBits = this.blockSize * 32;

					// Add padding
					dataWords[nBitsLeft >>> 5] |= 0x1 << 24 - nBitsLeft % 32;
					dataWords[(Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 0x80;
					data.sigBytes = dataWords.length * 4;

					// Hash final blocks
					this._process();

					// Shortcuts
					var state = this._state;
					var outputLengthBytes = this.cfg.outputLength / 8;
					var outputLengthLanes = outputLengthBytes / 8;

					// Squeeze
					var hashWords = [];
					for (var i = 0; i < outputLengthLanes; i++) {
						// Shortcuts
						var lane = state[i];
						var laneMsw = lane.high;
						var laneLsw = lane.low;

						// Swap endian
						laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 0x00ff00ff | (laneMsw << 24 | laneMsw >>> 8) & 0xff00ff00;
						laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 0x00ff00ff | (laneLsw << 24 | laneLsw >>> 8) & 0xff00ff00;

						// Squeeze state to retrieve hash
						hashWords.push(laneLsw);
						hashWords.push(laneMsw);
					}

					// Return final computed hash
					return new _WordArray2.default().init(hashWords, outputLengthBytes);
				},

				clone: function clone() {
					var clone = hasher.clone.call(this);

					var state = clone._state = this._state.slice(0);
					for (var i = 0; i < 25; i++) {
						state[i] = state[i].clone();
					}

					return clone;
				}
			});
		}
	}]);

	return SHA3;
}(_Hasher3.default);

exports.default = SHA3;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SerializableCipher2 = __webpack_require__(15);

var _SerializableCipher3 = _interopRequireDefault(_SerializableCipher2);

var _OpenSSLKdf = __webpack_require__(33);

var _OpenSSLKdf2 = _interopRequireDefault(_OpenSSLKdf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A serializable cipher wrapper that derives the key from a password,
 * and returns ciphertext as a serializable cipher params object.
 */
var PasswordBasedCipher = function (_SerializableCipher) {
	_inherits(PasswordBasedCipher, _SerializableCipher);

	function PasswordBasedCipher() {
		_classCallCheck(this, PasswordBasedCipher);

		var _this = _possibleConstructorReturn(this, (PasswordBasedCipher.__proto__ || Object.getPrototypeOf(PasswordBasedCipher)).call(this));

		_this.cfg = new _SerializableCipher3.default().cfg.extend({
			kdf: new _OpenSSLKdf2.default()
		});
		return _this;
	}

	/**
  * Encrypts a message using a password.
  *
  * @param {Cipher} cipher The cipher algorithm to use.
  * @param {WordArray|string} message The message to encrypt.
  * @param {string} password The password.
  * @param {Object} cfg (Optional) The configuration options to use for this operation.
  *
  * @return {CipherParams} A cipher params object.
  *
  * @static
  *
  * @example
  *
  *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
  *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
  */


	_createClass(PasswordBasedCipher, [{
		key: 'encrypt',
		value: function encrypt(cipher, message, password, cfg) {
			// Apply config defaults
			cfg = this.cfg.extend(cfg);

			// Derive key and other params
			var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

			// Add IV to config
			cfg.iv = derivedParams.iv;

			// Encrypt
			var ciphertext = new _SerializableCipher3.default().encrypt.call(this, cipher, message, derivedParams.key, cfg);

			// Mix in derived params
			ciphertext.mixIn(derivedParams);

			return ciphertext;
		}

		/**
   * Decrypts serialized ciphertext using a password.
   *
   * @param {Cipher} cipher The cipher algorithm to use.
   * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
   * @param {string} password The password.
   * @param {Object} cfg (Optional) The configuration options to use for this operation.
   *
   * @return {WordArray} The plaintext.
   *
   * @static
   *
   * @example
   *
   *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
   *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
   */

	}, {
		key: 'decrypt',
		value: function decrypt(cipher, ciphertext, password, cfg) {
			// Apply config defaults
			cfg = this.cfg.extend(cfg);

			// Convert string to CipherParams
			ciphertext = this._parse(ciphertext, cfg.format);

			// Derive key and other params
			var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

			// Add IV to config
			cfg.iv = derivedParams.iv;

			// Decrypt
			var plaintext = new _SerializableCipher3.default().decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

			return plaintext;
		}
	}]);

	return PasswordBasedCipher;
}(_SerializableCipher3.default);

exports.default = PasswordBasedCipher;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base = __webpack_require__(8);

var _Base2 = _interopRequireDefault(_Base);

var _CipherParams = __webpack_require__(6);

var _CipherParams2 = _interopRequireDefault(_CipherParams);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OpenSSLFormatter = function () {
	function OpenSSLFormatter() {
		_classCallCheck(this, OpenSSLFormatter);
	}

	_createClass(OpenSSLFormatter, [{
		key: 'stringify',

		/**
   * Converts a cipher params object to an OpenSSL-compatible string.
   *
   * @param {CipherParams} cipherParams The cipher params object.
   *
   * @return {string} The OpenSSL-compatible string.
   *
   * @static
   *
   * @example
   *
   *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
   */
		value: function stringify(cipherParams) {
			// Shortcuts
			var ciphertext = cipherParams.ciphertext;
			var salt = cipherParams.salt;

			// Format
			if (salt) {
				var wordArray = new _WordArray2.default().create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
			} else {
				var wordArray = ciphertext;
			}

			return wordArray.toString(_Base2.default);
		}

		/**
   * Converts an OpenSSL-compatible string to a cipher params object.
   *
   * @param {string} openSSLStr The OpenSSL-compatible string.
   *
   * @return {CipherParams} The cipher params object.
   *
   * @static
   *
   * @example
   *
   *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
   */

	}, {
		key: 'parse',
		value: function parse(openSSLStr) {
			// Parse base64
			var ciphertext = _Base2.default.parse(openSSLStr);

			// Shortcut
			var ciphertextWords = ciphertext.words;

			// Test for salt
			if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
				// Extract salt
				var salt = new _WordArray2.default().create(ciphertextWords.slice(2, 4));

				// Remove salt from ciphertext
				ciphertextWords.splice(0, 4);
				ciphertext.sigBytes -= 16;
			}

			return new _CipherParams2.default().create({ ciphertext: ciphertext, salt: salt });
		}
	}]);

	return OpenSSLFormatter;
}();

exports.default = OpenSSLFormatter;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CipherParams = __webpack_require__(6);

var _CipherParams2 = _interopRequireDefault(_CipherParams);

var _EvpKDF = __webpack_require__(16);

var _EvpKDF2 = _interopRequireDefault(_EvpKDF);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OpenSSLKdf = function () {
	function OpenSSLKdf() {
		_classCallCheck(this, OpenSSLKdf);
	}

	_createClass(OpenSSLKdf, [{
		key: 'execute',

		/**
   * Derives a key and IV from a password.
   *
   * @param {string} password The password to derive from.
   * @param {number} keySize The size in words of the key to generate.
   * @param {number} ivSize The size in words of the IV to generate.
   * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
   *
   * @return {CipherParams} A cipher params object with the key, IV, and salt.
   *
   * @static
   *
   * @example
   *
   *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
   *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
   */
		value: function execute(password, keySize, ivSize, salt) {
			// Generate random salt
			if (!salt) {
				salt = new _WordArray2.default().random(64 / 8);
			}

			// Derive key and IV
			var key = new _EvpKDF2.default().algo().create({ keySize: keySize + ivSize }).compute(password, salt);

			// Separate key and IV
			var iv = new _WordArray2.default().create(key.words.slice(keySize), ivSize * 4);
			key.sigBytes = keySize * 4;

			// Return params
			return new _CipherParams2.default().create({ key: key, iv: iv, salt: salt });
		}
	}]);

	return OpenSSLKdf;
}();

exports.default = OpenSSLKdf;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BlockCipherMode2 = __webpack_require__(35);

var _BlockCipherMode3 = _interopRequireDefault(_BlockCipherMode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CBC = function (_BlockCipherMode) {
	_inherits(CBC, _BlockCipherMode);

	function CBC() {
		_classCallCheck(this, CBC);

		var _this = _possibleConstructorReturn(this, (CBC.__proto__ || Object.getPrototypeOf(CBC)).call(this));

		_this.Encryptor = _this.extend({
			/**
    * Processes the data block at offset.
    *
    * @param {Array} words The data words to operate on.
    * @param {number} offset The offset where the block starts.
    *
    * @example
    *
    *     mode.processBlock(data.words, offset);
    */
			processBlock: function processBlock(words, offset) {
				// Shortcuts
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;

				// XOR and encrypt
				this.xorBlock(words, offset, blockSize);
				cipher.encryptBlock(words, offset);

				// Remember this block to use with next block
				this._prevBlock = words.slice(offset, offset + blockSize);
			}
		});

		/**
   * CBC decryptor.
   */
		_this.Decryptor = _this.extend({
			/**
    * Processes the data block at offset.
    *
    * @param {Array} words The data words to operate on.
    * @param {number} offset The offset where the block starts.
    *
    * @example
    *
    *     mode.processBlock(data.words, offset);
    */
			processBlock: function processBlock(words, offset) {
				// Shortcuts
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;

				// Remember this block to use with next block
				var thisBlock = words.slice(offset, offset + blockSize);

				// Decrypt and XOR
				cipher.decryptBlock(words, offset);
				this.xorBlock(words, offset, blockSize);

				// This block becomes the previous block
				this._prevBlock = thisBlock;
			}
		});
		return _this;
	}

	_createClass(CBC, [{
		key: 'xorBlock',
		value: function xorBlock(words, offset, blockSize) {
			// Shortcut
			var iv = this._iv;

			// Choose mixing block
			if (iv) {
				var block = iv;

				// Remove IV for subsequent blocks
				this._iv = undefined;
			} else {
				var block = this._prevBlock;
			}

			// XOR blocks
			for (var i = 0; i < blockSize; i++) {
				words[offset + i] ^= block[i];
			}
		}
	}]);

	return CBC;
}(_BlockCipherMode3.default);

exports.default = CBC;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base2 = __webpack_require__(1);

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BlockCipherMode = function (_Base) {
	_inherits(BlockCipherMode, _Base);

	function BlockCipherMode() {
		_classCallCheck(this, BlockCipherMode);

		return _possibleConstructorReturn(this, (BlockCipherMode.__proto__ || Object.getPrototypeOf(BlockCipherMode)).call(this));
	}

	/**
  * Creates this mode for encryption.
  *
  * @param {Cipher} cipher A block cipher instance.
  * @param {Array} iv The IV words.
  *
  * @static
  *
  * @example
  *
  *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
  */


	_createClass(BlockCipherMode, [{
		key: 'createEncryptor',
		value: function createEncryptor(cipher, iv) {
			return this.Encryptor.create(cipher, iv);
		}

		/**
   * Creates this mode for decryption.
   *
   * @param {Cipher} cipher A block cipher instance.
   * @param {Array} iv The IV words.
   *
   * @static
   *
   * @example
   *
   *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
   */

	}, {
		key: 'createDecryptor',
		value: function createDecryptor(cipher, iv) {
			return this.Decryptor.create(cipher, iv);
		}

		/**
   * Initializes a newly created mode.
   *
   * @param {Cipher} cipher A block cipher instance.
   * @param {Array} iv The IV words.
   *
   * @example
   *
   *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
   */

	}, {
		key: 'init',
		value: function init(cipher, iv) {
			this._cipher = cipher;
			this._iv = iv;
		}
	}]);

	return BlockCipherMode;
}(_Base3.default);

exports.default = BlockCipherMode;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * PKCS #5/7 padding strategy.
 */
var Pkcs7 = function () {
	function Pkcs7() {
		_classCallCheck(this, Pkcs7);
	}

	_createClass(Pkcs7, [{
		key: 'pad',

		/**
   * Pads data using the algorithm defined in PKCS #5/7.
   *
   * @param {WordArray} data The data to pad.
   * @param {number} blockSize The multiple that the data should be padded to.
   *
   * @static
   *
   * @example
   *
   *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
   */
		value: function pad(data, blockSize) {
			// Shortcut
			var blockSizeBytes = blockSize * 4;

			// Count padding bytes
			var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

			// Create padding word
			var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;

			// Create padding
			var paddingWords = [];
			for (var i = 0; i < nPaddingBytes; i += 4) {
				paddingWords.push(paddingWord);
			}
			var padding = new _WordArray2.default().create(paddingWords, nPaddingBytes);

			// Add padding
			data.concat(padding);
		}

		/**
   * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
   *
   * @param {WordArray} data The data to unpad.
   *
   * @static
   *
   * @example
   *
   *     CryptoJS.pad.Pkcs7.unpad(wordArray);
   */

	}, {
		key: 'unpad',
		value: function unpad(data) {
			// Get number of padding bytes from last byte
			var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff;

			// Remove padding
			data.sigBytes -= nPaddingBytes;
		}
	}]);

	return Pkcs7;
}();

exports.default = Pkcs7;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BlockCipher = __webpack_require__(4);

var _BlockCipher2 = _interopRequireDefault(_BlockCipher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Lookup tables
var SBOX = [];
var INV_SBOX = [];
var SUB_MIX_0 = [];
var SUB_MIX_1 = [];
var SUB_MIX_2 = [];
var SUB_MIX_3 = [];
var INV_SUB_MIX_0 = [];
var INV_SUB_MIX_1 = [];
var INV_SUB_MIX_2 = [];
var INV_SUB_MIX_3 = [];

// Compute lookup tables
(function () {
	// Compute double table
	var d = [];
	for (var i = 0; i < 256; i++) {
		if (i < 128) {
			d[i] = i << 1;
		} else {
			d[i] = i << 1 ^ 0x11b;
		}
	}

	// Walk GF(2^8)
	var x = 0;
	var xi = 0;
	for (var i = 0; i < 256; i++) {
		// Compute sbox
		var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
		sx = sx >>> 8 ^ sx & 0xff ^ 0x63;
		SBOX[x] = sx;
		INV_SBOX[sx] = x;

		// Compute multiplication
		var x2 = d[x];
		var x4 = d[x2];
		var x8 = d[x4];

		// Compute sub bytes, mix columns tables
		var t = d[sx] * 0x101 ^ sx * 0x1010100;
		SUB_MIX_0[x] = t << 24 | t >>> 8;
		SUB_MIX_1[x] = t << 16 | t >>> 16;
		SUB_MIX_2[x] = t << 8 | t >>> 24;
		SUB_MIX_3[x] = t;

		// Compute inv sub bytes, inv mix columns tables
		var t = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
		INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
		INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
		INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
		INV_SUB_MIX_3[sx] = t;

		// Compute next counter
		if (!x) {
			x = xi = 1;
		} else {
			x = x2 ^ d[d[d[x8 ^ x2]]];
			xi ^= d[d[xi]];
		}
	}
})();

// Precomputed Rcon lookup
var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

var AES = function () {
	function AES() {
		_classCallCheck(this, AES);
	}

	_createClass(AES, [{
		key: 'algo',
		value: function algo() {
			return new _BlockCipher2.default().extend({
				_doReset: function _doReset() {
					// Shortcuts
					var key = this._key;
					var keyWords = key.words;
					var keySize = key.sigBytes / 4;

					// Compute number of rounds
					var nRounds = this._nRounds = keySize + 6;

					// Compute number of key schedule rows
					var ksRows = (nRounds + 1) * 4;

					// Compute key schedule
					var keySchedule = this._keySchedule = [];
					for (var ksRow = 0; ksRow < ksRows; ksRow++) {
						if (ksRow < keySize) {
							keySchedule[ksRow] = keyWords[ksRow];
						} else {
							var t = keySchedule[ksRow - 1];

							if (!(ksRow % keySize)) {
								// Rot word
								t = t << 8 | t >>> 24;

								// Sub word
								t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff];

								// Mix Rcon
								t ^= RCON[ksRow / keySize | 0] << 24;
							} else if (keySize > 6 && ksRow % keySize == 4) {
								// Sub word
								t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff];
							}

							keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
						}
					}

					// Compute inv key schedule
					var invKeySchedule = this._invKeySchedule = [];
					for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
						var ksRow = ksRows - invKsRow;

						if (invKsRow % 4) {
							var t = keySchedule[ksRow];
						} else {
							var t = keySchedule[ksRow - 4];
						}

						if (invKsRow < 4 || ksRow <= 4) {
							invKeySchedule[invKsRow] = t;
						} else {
							invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 0xff]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
						}
					}
				},

				encryptBlock: function encryptBlock(M, offset) {
					this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
				},

				decryptBlock: function decryptBlock(M, offset) {
					// Swap 2nd and 4th rows
					var t = M[offset + 1];
					M[offset + 1] = M[offset + 3];
					M[offset + 3] = t;

					this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

					// Inv swap 2nd and 4th rows
					var t = M[offset + 1];
					M[offset + 1] = M[offset + 3];
					M[offset + 3] = t;
				},

				_doCryptBlock: function _doCryptBlock(M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
					// Shortcut
					var nRounds = this._nRounds;

					// Get input, add round key
					var s0 = M[offset] ^ keySchedule[0];
					var s1 = M[offset + 1] ^ keySchedule[1];
					var s2 = M[offset + 2] ^ keySchedule[2];
					var s3 = M[offset + 3] ^ keySchedule[3];

					// Key schedule row counter
					var ksRow = 4;

					// Rounds
					for (var round = 1; round < nRounds; round++) {
						// Shift rows, sub bytes, mix columns, add round key
						var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[s1 >>> 16 & 0xff] ^ SUB_MIX_2[s2 >>> 8 & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
						var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[s2 >>> 16 & 0xff] ^ SUB_MIX_2[s3 >>> 8 & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
						var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[s3 >>> 16 & 0xff] ^ SUB_MIX_2[s0 >>> 8 & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
						var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[s0 >>> 16 & 0xff] ^ SUB_MIX_2[s1 >>> 8 & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

						// Update state
						s0 = t0;
						s1 = t1;
						s2 = t2;
						s3 = t3;
					}

					// Shift rows, sub bytes, add round key
					var t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 0xff] << 16 | SBOX[s2 >>> 8 & 0xff] << 8 | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
					var t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 0xff] << 16 | SBOX[s3 >>> 8 & 0xff] << 8 | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
					var t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 0xff] << 16 | SBOX[s0 >>> 8 & 0xff] << 8 | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
					var t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 0xff] << 16 | SBOX[s1 >>> 8 & 0xff] << 8 | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

					// Set output
					M[offset] = t0;
					M[offset + 1] = t1;
					M[offset + 2] = t2;
					M[offset + 3] = t3;
				},

				keySize: 256 / 32
			});
		}
	}]);

	return AES;
}();

exports.default = AES;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StreamCipher = __webpack_require__(7);

var _StreamCipher2 = _interopRequireDefault(_StreamCipher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Reusable objects
var S = [];
var C_ = [];
var G = [];

function nextState() {
	// Shortcuts
	var X = this._X;
	var C = this._C;

	// Save old counter values
	for (var i = 0; i < 8; i++) {
		C_[i] = C[i];
	}

	// Calculate new counter values
	C[0] = C[0] + 0x4d34d34d + this._b | 0;
	C[1] = C[1] + 0xd34d34d3 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
	C[2] = C[2] + 0x34d34d34 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
	C[3] = C[3] + 0x4d34d34d + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
	C[4] = C[4] + 0xd34d34d3 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
	C[5] = C[5] + 0x34d34d34 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
	C[6] = C[6] + 0x4d34d34d + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
	C[7] = C[7] + 0xd34d34d3 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
	this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;

	// Calculate the g-values
	for (var i = 0; i < 8; i++) {
		var gx = X[i] + C[i];

		// Construct high and low argument for squaring
		var ga = gx & 0xffff;
		var gb = gx >>> 16;

		// Calculate high and low result of squaring
		var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
		var gl = ((gx & 0xffff0000) * gx | 0) + ((gx & 0x0000ffff) * gx | 0);

		// High XOR low
		G[i] = gh ^ gl;
	}

	// Calculate new state values
	X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
	X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
	X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
	X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
	X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
	X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
	X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
	X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
}

var Rabbit = function () {
	function Rabbit() {
		_classCallCheck(this, Rabbit);
	}

	_createClass(Rabbit, [{
		key: 'algo',
		value: function algo() {
			return new _StreamCipher2.default().extend({
				blockSize: 128 / 32,
				ivSize: 64 / 32,

				_doReset: function _doReset() {
					// Shortcuts
					var K = this._key.words;
					var iv = this.cfg.iv;

					// Swap endian
					for (var i = 0; i < 4; i++) {
						K[i] = (K[i] << 8 | K[i] >>> 24) & 0x00ff00ff | (K[i] << 24 | K[i] >>> 8) & 0xff00ff00;
					}

					// Generate initial state values
					var X = this._X = [K[0], K[3] << 16 | K[2] >>> 16, K[1], K[0] << 16 | K[3] >>> 16, K[2], K[1] << 16 | K[0] >>> 16, K[3], K[2] << 16 | K[1] >>> 16];

					// Generate initial counter values
					var C = this._C = [K[2] << 16 | K[2] >>> 16, K[0] & 0xffff0000 | K[1] & 0x0000ffff, K[3] << 16 | K[3] >>> 16, K[1] & 0xffff0000 | K[2] & 0x0000ffff, K[0] << 16 | K[0] >>> 16, K[2] & 0xffff0000 | K[3] & 0x0000ffff, K[1] << 16 | K[1] >>> 16, K[3] & 0xffff0000 | K[0] & 0x0000ffff];

					// Carry bit
					this._b = 0;

					// Iterate the system four times
					for (var i = 0; i < 4; i++) {
						nextState.call(this);
					}

					// Modify the counters
					for (var i = 0; i < 8; i++) {
						C[i] ^= X[i + 4 & 7];
					}

					// IV setup
					if (iv) {
						// Shortcuts
						var IV = iv.words;
						var IV_0 = IV[0];
						var IV_1 = IV[1];

						// Generate four subvectors
						var i0 = (IV_0 << 8 | IV_0 >>> 24) & 0x00ff00ff | (IV_0 << 24 | IV_0 >>> 8) & 0xff00ff00;
						var i2 = (IV_1 << 8 | IV_1 >>> 24) & 0x00ff00ff | (IV_1 << 24 | IV_1 >>> 8) & 0xff00ff00;
						var i1 = i0 >>> 16 | i2 & 0xffff0000;
						var i3 = i2 << 16 | i0 & 0x0000ffff;

						// Modify counter values
						C[0] ^= i0;
						C[1] ^= i1;
						C[2] ^= i2;
						C[3] ^= i3;
						C[4] ^= i0;
						C[5] ^= i1;
						C[6] ^= i2;
						C[7] ^= i3;

						// Iterate the system four times
						for (var i = 0; i < 4; i++) {
							nextState.call(this);
						}
					}
				},

				_doProcessBlock: function _doProcessBlock(M, offset) {
					// Shortcut
					var X = this._X;

					// Iterate the system
					nextState.call(this);

					// Generate four keystream words
					S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
					S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
					S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
					S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;

					for (var i = 0; i < 4; i++) {
						// Swap endian
						S[i] = (S[i] << 8 | S[i] >>> 24) & 0x00ff00ff | (S[i] << 24 | S[i] >>> 8) & 0xff00ff00;

						// Encrypt
						M[offset + i] ^= S[i];
					}
				}
			});
		}
	}]);

	return Rabbit;
}();

exports.default = Rabbit;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rc = __webpack_require__(18);

var _rc2 = _interopRequireDefault(_rc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function generateKeystreamWord() {
	// Shortcuts
	var S = this._S;
	var i = this._i;
	var j = this._j;

	// Generate keystream word
	var keystreamWord = 0;
	for (var n = 0; n < 4; n++) {
		i = (i + 1) % 256;
		j = (j + S[i]) % 256;

		// Swap
		var t = S[i];
		S[i] = S[j];
		S[j] = t;

		keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
	}

	// Update counters
	this._i = i;
	this._j = j;

	return keystreamWord;
}

var rc4 = new _rc2.default().algo();

var RC4Drop = function () {
	function RC4Drop() {
		_classCallCheck(this, RC4Drop);
	}

	_createClass(RC4Drop, [{
		key: 'algo',
		value: function algo() {
			return rc4.extend({
				/**
     * Configuration options.
     *
     * @property {number} drop The number of keystream words to drop. Default 192
     */
				cfg: rc4.cfg.extend({
					drop: 192
				}),

				_doReset: function _doReset() {
					rc4._doReset.call(this);

					// Drop
					for (var i = this.cfg.drop; i > 0; i--) {
						generateKeystreamWord.call(this);
					}
				}
			});
		}
	}]);

	return RC4Drop;
}();

exports.default = RC4Drop;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

var _BlockCipher = __webpack_require__(4);

var _BlockCipher2 = _interopRequireDefault(_BlockCipher);

var _des = __webpack_require__(17);

var _des2 = _interopRequireDefault(_des);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TripleDes = function () {
	function TripleDes() {
		_classCallCheck(this, TripleDes);
	}

	_createClass(TripleDes, [{
		key: 'algo',
		value: function algo() {
			return new _BlockCipher2.default().extend({
				_doReset: function _doReset() {
					// Shortcuts
					var key = this._key;
					var keyWords = key.words;

					// Create DES instances
					this._des1 = new _des2.default().algo().createEncryptor(new _WordArray2.default().create(keyWords.slice(0, 2)));
					this._des2 = new _des2.default().algo().createEncryptor(new _WordArray2.default().create(keyWords.slice(2, 4)));
					this._des3 = new _des2.default().algo().createEncryptor(new _WordArray2.default().create(keyWords.slice(4, 6)));
				},

				encryptBlock: function encryptBlock(M, offset) {
					this._des1.encryptBlock(M, offset);
					this._des2.decryptBlock(M, offset);
					this._des3.encryptBlock(M, offset);
				},

				decryptBlock: function decryptBlock(M, offset) {
					this._des3.decryptBlock(M, offset);
					this._des2.encryptBlock(M, offset);
					this._des1.decryptBlock(M, offset);
				},

				keySize: 192 / 32,

				ivSize: 64 / 32,

				blockSize: 64 / 32
			});
		}
	}]);

	return TripleDes;
}();

exports.default = TripleDes;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Blowfish = function () {
				function Blowfish() {
								_classCallCheck(this, Blowfish);

								this.sBox0 = null;
								this.sBox1 = null;
								this.sBox2 = null;
								this.sBox3 = null;
								this.pArray = null;
								this.key = null;
								this.mode = 'ecb';
								this.iv = 'IAMWEASEL';
								this.keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

								this._initBox0();
								this._initBox1();
								this._initBox2();
								this._initBox3();
								this._initPArray();
				}

				_createClass(Blowfish, [{
								key: 'init',
								value: function init(key, mode) {
												this.key = key || null;
												this.mode = mode || 'ecb';

												this.generateSubkeys(key);
								}
				}, {
								key: '_initBox0',
								value: function _initBox0() {
												this.sBox0 = [0xd1310ba6, 0x98dfb5ac, 0x2ffd72db, 0xd01adfb7, 0xb8e1afed, 0x6a267e96, 0xba7c9045, 0xf12c7f99, 0x24a19947, 0xb3916cf7, 0x0801f2e2, 0x858efc16, 0x636920d8, 0x71574e69, 0xa458fea3, 0xf4933d7e, 0x0d95748f, 0x728eb658, 0x718bcd58, 0x82154aee, 0x7b54a41d, 0xc25a59b5, 0x9c30d539, 0x2af26013, 0xc5d1b023, 0x286085f0, 0xca417918, 0xb8db38ef, 0x8e79dcb0, 0x603a180e, 0x6c9e0e8b, 0xb01e8a3e, 0xd71577c1, 0xbd314b27, 0x78af2fda, 0x55605c60, 0xe65525f3, 0xaa55ab94, 0x57489862, 0x63e81440, 0x55ca396a, 0x2aab10b6, 0xb4cc5c34, 0x1141e8ce, 0xa15486af, 0x7c72e993, 0xb3ee1411, 0x636fbc2a, 0x2ba9c55d, 0x741831f6, 0xce5c3e16, 0x9b87931e, 0xafd6ba33, 0x6c24cf5c, 0x7a325381, 0x28958677, 0x3b8f4898, 0x6b4bb9af, 0xc4bfe81b, 0x66282193, 0x61d809cc, 0xfb21a991, 0x487cac60, 0x5dec8032, 0xef845d5d, 0xe98575b1, 0xdc262302, 0xeb651b88, 0x23893e81, 0xd396acc5, 0x0f6d6ff3, 0x83f44239, 0x2e0b4482, 0xa4842004, 0x69c8f04a, 0x9e1f9b5e, 0x21c66842, 0xf6e96c9a, 0x670c9c61, 0xabd388f0, 0x6a51a0d2, 0xd8542f68, 0x960fa728, 0xab5133a3, 0x6eef0b6c, 0x137a3be4, 0xba3bf050, 0x7efb2a98, 0xa1f1651d, 0x39af0176, 0x66ca593e, 0x82430e88, 0x8cee8619, 0x456f9fb4, 0x7d84a5c3, 0x3b8b5ebe, 0xe06f75d8, 0x85c12073, 0x401a449f, 0x56c16aa6, 0x4ed3aa62, 0x363f7706, 0x1bfedf72, 0x429b023d, 0x37d0d724, 0xd00a1248, 0xdb0fead3, 0x49f1c09b, 0x075372c9, 0x80991b7b, 0x25d479d8, 0xf6e8def7, 0xe3fe501a, 0xb6794c3b, 0x976ce0bd, 0x04c006ba, 0xc1a94fb6, 0x409f60c4, 0x5e5c9ec2, 0x196a2463, 0x68fb6faf, 0x3e6c53b5, 0x1339b2eb, 0x3b52ec6f, 0x6dfc511f, 0x9b30952c, 0xcc814544, 0xaf5ebd09, 0xbee3d004, 0xde334afd, 0x660f2807, 0x192e4bb3, 0xc0cba857, 0x45c8740f, 0xd20b5f39, 0xb9d3fbdb, 0x5579c0bd, 0x1a60320a, 0xd6a100c6, 0x402c7279, 0x679f25fe, 0xfb1fa3cc, 0x8ea5e9f8, 0xdb3222f8, 0x3c7516df, 0xfd616b15, 0x2f501ec8, 0xad0552ab, 0x323db5fa, 0xfd238760, 0x53317b48, 0x3e00df82, 0x9e5c57bb, 0xca6f8ca0, 0x1a87562e, 0xdf1769db, 0xd542a8f6, 0x287effc3, 0xac6732c6, 0x8c4f5573, 0x695b27b0, 0xbbca58c8, 0xe1ffa35d, 0xb8f011a0, 0x10fa3d98, 0xfd2183b8, 0x4afcb56c, 0x2dd1d35b, 0x9a53e479, 0xb6f84565, 0xd28e49bc, 0x4bfb9790, 0xe1ddf2da, 0xa4cb7e33, 0x62fb1341, 0xcee4c6e8, 0xef20cada, 0x36774c01, 0xd07e9efe, 0x2bf11fb4, 0x95dbda4d, 0xae909198, 0xeaad8e71, 0x6b93d5a0, 0xd08ed1d0, 0xafc725e0, 0x8e3c5b2f, 0x8e7594b7, 0x8ff6e2fb, 0xf2122b64, 0x8888b812, 0x900df01c, 0x4fad5ea0, 0x688fc31c, 0xd1cff191, 0xb3a8c1ad, 0x2f2f2218, 0xbe0e1777, 0xea752dfe, 0x8b021fa1, 0xe5a0cc0f, 0xb56f74e8, 0x18acf3d6, 0xce89e299, 0xb4a84fe0, 0xfd13e0b7, 0x7cc43b81, 0xd2ada8d9, 0x165fa266, 0x80957705, 0x93cc7314, 0x211a1477, 0xe6ad2065, 0x77b5fa86, 0xc75442f5, 0xfb9d35cf, 0xebcdaf0c, 0x7b3e89a0, 0xd6411bd3, 0xae1e7e49, 0x00250e2d, 0x2071b35e, 0x226800bb, 0x57b8e0af, 0x2464369b, 0xf009b91e, 0x5563911d, 0x59dfa6aa, 0x78c14389, 0xd95a537f, 0x207d5ba2, 0x02e5b9c5, 0x83260376, 0x6295cfa9, 0x11c81968, 0x4e734a41, 0xb3472dca, 0x7b14a94a, 0x1b510052, 0x9a532915, 0xd60f573f, 0xbc9bc6e4, 0x2b60a476, 0x81e67400, 0x08ba6fb5, 0x571be91f, 0xf296ec6b, 0x2a0dd915, 0xb6636521, 0xe7b9f9b6, 0xff34052e, 0xc5855664, 0x53b02d5d, 0xa99f8fa1, 0x08ba4799, 0x6e85076a];
								}
				}, {
								key: '_initBox1',
								value: function _initBox1() {
												this.sBox1 = [0x4b7a70e9, 0xb5b32944, 0xdb75092e, 0xc4192623, 0xad6ea6b0, 0x49a7df7d, 0x9cee60b8, 0x8fedb266, 0xecaa8c71, 0x699a17ff, 0x5664526c, 0xc2b19ee1, 0x193602a5, 0x75094c29, 0xa0591340, 0xe4183a3e, 0x3f54989a, 0x5b429d65, 0x6b8fe4d6, 0x99f73fd6, 0xa1d29c07, 0xefe830f5, 0x4d2d38e6, 0xf0255dc1, 0x4cdd2086, 0x8470eb26, 0x6382e9c6, 0x021ecc5e, 0x09686b3f, 0x3ebaefc9, 0x3c971814, 0x6b6a70a1, 0x687f3584, 0x52a0e286, 0xb79c5305, 0xaa500737, 0x3e07841c, 0x7fdeae5c, 0x8e7d44ec, 0x5716f2b8, 0xb03ada37, 0xf0500c0d, 0xf01c1f04, 0x0200b3ff, 0xae0cf51a, 0x3cb574b2, 0x25837a58, 0xdc0921bd, 0xd19113f9, 0x7ca92ff6, 0x94324773, 0x22f54701, 0x3ae5e581, 0x37c2dadc, 0xc8b57634, 0x9af3dda7, 0xa9446146, 0x0fd0030e, 0xecc8c73e, 0xa4751e41, 0xe238cd99, 0x3bea0e2f, 0x3280bba1, 0x183eb331, 0x4e548b38, 0x4f6db908, 0x6f420d03, 0xf60a04bf, 0x2cb81290, 0x24977c79, 0x5679b072, 0xbcaf89af, 0xde9a771f, 0xd9930810, 0xb38bae12, 0xdccf3f2e, 0x5512721f, 0x2e6b7124, 0x501adde6, 0x9f84cd87, 0x7a584718, 0x7408da17, 0xbc9f9abc, 0xe94b7d8c, 0xec7aec3a, 0xdb851dfa, 0x63094366, 0xc464c3d2, 0xef1c1847, 0x3215d908, 0xdd433b37, 0x24c2ba16, 0x12a14d43, 0x2a65c451, 0x50940002, 0x133ae4dd, 0x71dff89e, 0x10314e55, 0x81ac77d6, 0x5f11199b, 0x043556f1, 0xd7a3c76b, 0x3c11183b, 0x5924a509, 0xf28fe6ed, 0x97f1fbfa, 0x9ebabf2c, 0x1e153c6e, 0x86e34570, 0xeae96fb1, 0x860e5e0a, 0x5a3e2ab3, 0x771fe71c, 0x4e3d06fa, 0x2965dcb9, 0x99e71d0f, 0x803e89d6, 0x5266c825, 0x2e4cc978, 0x9c10b36a, 0xc6150eba, 0x94e2ea78, 0xa5fc3c53, 0x1e0a2df4, 0xf2f74ea7, 0x361d2b3d, 0x1939260f, 0x19c27960, 0x5223a708, 0xf71312b6, 0xebadfe6e, 0xeac31f66, 0xe3bc4595, 0xa67bc883, 0xb17f37d1, 0x018cff28, 0xc332ddef, 0xbe6c5aa5, 0x65582185, 0x68ab9802, 0xeecea50f, 0xdb2f953b, 0x2aef7dad, 0x5b6e2f84, 0x1521b628, 0x29076170, 0xecdd4775, 0x619f1510, 0x13cca830, 0xeb61bd96, 0x0334fe1e, 0xaa0363cf, 0xb5735c90, 0x4c70a239, 0xd59e9e0b, 0xcbaade14, 0xeecc86bc, 0x60622ca7, 0x9cab5cab, 0xb2f3846e, 0x648b1eaf, 0x19bdf0ca, 0xa02369b9, 0x655abb50, 0x40685a32, 0x3c2ab4b3, 0x319ee9d5, 0xc021b8f7, 0x9b540b19, 0x875fa099, 0x95f7997e, 0x623d7da8, 0xf837889a, 0x97e32d77, 0x11ed935f, 0x16681281, 0x0e358829, 0xc7e61fd6, 0x96dedfa1, 0x7858ba99, 0x57f584a5, 0x1b227263, 0x9b83c3ff, 0x1ac24696, 0xcdb30aeb, 0x532e3054, 0x8fd948e4, 0x6dbc3128, 0x58ebf2ef, 0x34c6ffea, 0xfe28ed61, 0xee7c3c73, 0x5d4a14d9, 0xe864b7e3, 0x42105d14, 0x203e13e0, 0x45eee2b6, 0xa3aaabea, 0xdb6c4f15, 0xfacb4fd0, 0xc742f442, 0xef6abbb5, 0x654f3b1d, 0x41cd2105, 0xd81e799e, 0x86854dc7, 0xe44b476a, 0x3d816250, 0xcf62a1f2, 0x5b8d2646, 0xfc8883a0, 0xc1c7b6a3, 0x7f1524c3, 0x69cb7492, 0x47848a0b, 0x5692b285, 0x095bbf00, 0xad19489d, 0x1462b174, 0x23820e00, 0x58428d2a, 0x0c55f5ea, 0x1dadf43e, 0x233f7061, 0x3372f092, 0x8d937e41, 0xd65fecf1, 0x6c223bdb, 0x7cde3759, 0xcbee7460, 0x4085f2a7, 0xce77326e, 0xa6078084, 0x19f8509e, 0xe8efd855, 0x61d99735, 0xa969a7aa, 0xc50c06c2, 0x5a04abfc, 0x800bcadc, 0x9e447a2e, 0xc3453484, 0xfdd56705, 0x0e1e9ec9, 0xdb73dbd3, 0x105588cd, 0x675fda79, 0xe3674340, 0xc5c43465, 0x713e38d8, 0x3d28f89e, 0xf16dff20, 0x153e21e7, 0x8fb03d4a, 0xe6e39f2b, 0xdb83adf7];
								}
				}, {
								key: '_initBox2',
								value: function _initBox2() {
												this.sBox2 = [0xe93d5a68, 0x948140f7, 0xf64c261c, 0x94692934, 0x411520f7, 0x7602d4f7, 0xbcf46b2e, 0xd4a20068, 0xd4082471, 0x3320f46a, 0x43b7d4b7, 0x500061af, 0x1e39f62e, 0x97244546, 0x14214f74, 0xbf8b8840, 0x4d95fc1d, 0x96b591af, 0x70f4ddd3, 0x66a02f45, 0xbfbc09ec, 0x03bd9785, 0x7fac6dd0, 0x31cb8504, 0x96eb27b3, 0x55fd3941, 0xda2547e6, 0xabca0a9a, 0x28507825, 0x530429f4, 0x0a2c86da, 0xe9b66dfb, 0x68dc1462, 0xd7486900, 0x680ec0a4, 0x27a18dee, 0x4f3ffea2, 0xe887ad8c, 0xb58ce006, 0x7af4d6b6, 0xaace1e7c, 0xd3375fec, 0xce78a399, 0x406b2a42, 0x20fe9e35, 0xd9f385b9, 0xee39d7ab, 0x3b124e8b, 0x1dc9faf7, 0x4b6d1856, 0x26a36631, 0xeae397b2, 0x3a6efa74, 0xdd5b4332, 0x6841e7f7, 0xca7820fb, 0xfb0af54e, 0xd8feb397, 0x454056ac, 0xba489527, 0x55533a3a, 0x20838d87, 0xfe6ba9b7, 0xd096954b, 0x55a867bc, 0xa1159a58, 0xcca92963, 0x99e1db33, 0xa62a4a56, 0x3f3125f9, 0x5ef47e1c, 0x9029317c, 0xfdf8e802, 0x04272f70, 0x80bb155c, 0x05282ce3, 0x95c11548, 0xe4c66d22, 0x48c1133f, 0xc70f86dc, 0x07f9c9ee, 0x41041f0f, 0x404779a4, 0x5d886e17, 0x325f51eb, 0xd59bc0d1, 0xf2bcc18f, 0x41113564, 0x257b7834, 0x602a9c60, 0xdff8e8a3, 0x1f636c1b, 0x0e12b4c2, 0x02e1329e, 0xaf664fd1, 0xcad18115, 0x6b2395e0, 0x333e92e1, 0x3b240b62, 0xeebeb922, 0x85b2a20e, 0xe6ba0d99, 0xde720c8c, 0x2da2f728, 0xd0127845, 0x95b794fd, 0x647d0862, 0xe7ccf5f0, 0x5449a36f, 0x877d48fa, 0xc39dfd27, 0xf33e8d1e, 0x0a476341, 0x992eff74, 0x3a6f6eab, 0xf4f8fd37, 0xa812dc60, 0xa1ebddf8, 0x991be14c, 0xdb6e6b0d, 0xc67b5510, 0x6d672c37, 0x2765d43b, 0xdcd0e804, 0xf1290dc7, 0xcc00ffa3, 0xb5390f92, 0x690fed0b, 0x667b9ffb, 0xcedb7d9c, 0xa091cf0b, 0xd9155ea3, 0xbb132f88, 0x515bad24, 0x7b9479bf, 0x763bd6eb, 0x37392eb3, 0xcc115979, 0x8026e297, 0xf42e312d, 0x6842ada7, 0xc66a2b3b, 0x12754ccc, 0x782ef11c, 0x6a124237, 0xb79251e7, 0x06a1bbe6, 0x4bfb6350, 0x1a6b1018, 0x11caedfa, 0x3d25bdd8, 0xe2e1c3c9, 0x44421659, 0x0a121386, 0xd90cec6e, 0xd5abea2a, 0x64af674e, 0xda86a85f, 0xbebfe988, 0x64e4c3fe, 0x9dbc8057, 0xf0f7c086, 0x60787bf8, 0x6003604d, 0xd1fd8346, 0xf6381fb0, 0x7745ae04, 0xd736fccc, 0x83426b33, 0xf01eab71, 0xb0804187, 0x3c005e5f, 0x77a057be, 0xbde8ae24, 0x55464299, 0xbf582e61, 0x4e58f48f, 0xf2ddfda2, 0xf474ef38, 0x8789bdc2, 0x5366f9c3, 0xc8b38e74, 0xb475f255, 0x46fcd9b9, 0x7aeb2661, 0x8b1ddf84, 0x846a0e79, 0x915f95e2, 0x466e598e, 0x20b45770, 0x8cd55591, 0xc902de4c, 0xb90bace1, 0xbb8205d0, 0x11a86248, 0x7574a99e, 0xb77f19b6, 0xe0a9dc09, 0x662d09a1, 0xc4324633, 0xe85a1f02, 0x09f0be8c, 0x4a99a025, 0x1d6efe10, 0x1ab93d1d, 0x0ba5a4df, 0xa186f20f, 0x2868f169, 0xdcb7da83, 0x573906fe, 0xa1e2ce9b, 0x4fcd7f52, 0x50115e01, 0xa70683fa, 0xa002b5c4, 0x0de6d027, 0x9af88c27, 0x773f8641, 0xc3604c06, 0x61a806b5, 0xf0177a28, 0xc0f586e0, 0x006058aa, 0x30dc7d62, 0x11e69ed7, 0x2338ea63, 0x53c2dd94, 0xc2c21634, 0xbbcbee56, 0x90bcb6de, 0xebfc7da1, 0xce591d76, 0x6f05e409, 0x4b7c0188, 0x39720a3d, 0x7c927c24, 0x86e3725f, 0x724d9db9, 0x1ac15bb4, 0xd39eb8fc, 0xed545578, 0x08fca5b5, 0xd83d7cd3, 0x4dad0fc4, 0x1e50ef5e, 0xb161e6f8, 0xa28514d9, 0x6c51133c, 0x6fd5c7e7, 0x56e14ec4, 0x362abfce, 0xddc6c837, 0xd79a3234, 0x92638212, 0x670efa8e, 0x406000e0];
								}
				}, {
								key: '_initBox3',
								value: function _initBox3() {
												this.sBox3 = [0x3a39ce37, 0xd3faf5cf, 0xabc27737, 0x5ac52d1b, 0x5cb0679e, 0x4fa33742, 0xd3822740, 0x99bc9bbe, 0xd5118e9d, 0xbf0f7315, 0xd62d1c7e, 0xc700c47b, 0xb78c1b6b, 0x21a19045, 0xb26eb1be, 0x6a366eb4, 0x5748ab2f, 0xbc946e79, 0xc6a376d2, 0x6549c2c8, 0x530ff8ee, 0x468dde7d, 0xd5730a1d, 0x4cd04dc6, 0x2939bbdb, 0xa9ba4650, 0xac9526e8, 0xbe5ee304, 0xa1fad5f0, 0x6a2d519a, 0x63ef8ce2, 0x9a86ee22, 0xc089c2b8, 0x43242ef6, 0xa51e03aa, 0x9cf2d0a4, 0x83c061ba, 0x9be96a4d, 0x8fe51550, 0xba645bd6, 0x2826a2f9, 0xa73a3ae1, 0x4ba99586, 0xef5562e9, 0xc72fefd3, 0xf752f7da, 0x3f046f69, 0x77fa0a59, 0x80e4a915, 0x87b08601, 0x9b09e6ad, 0x3b3ee593, 0xe990fd5a, 0x9e34d797, 0x2cf0b7d9, 0x022b8b51, 0x96d5ac3a, 0x017da67d, 0xd1cf3ed6, 0x7c7d2d28, 0x1f9f25cf, 0xadf2b89b, 0x5ad6b472, 0x5a88f54c, 0xe029ac71, 0xe019a5e6, 0x47b0acfd, 0xed93fa9b, 0xe8d3c48d, 0x283b57cc, 0xf8d56629, 0x79132e28, 0x785f0191, 0xed756055, 0xf7960e44, 0xe3d35e8c, 0x15056dd4, 0x88f46dba, 0x03a16125, 0x0564f0bd, 0xc3eb9e15, 0x3c9057a2, 0x97271aec, 0xa93a072a, 0x1b3f6d9b, 0x1e6321f5, 0xf59c66fb, 0x26dcf319, 0x7533d928, 0xb155fdf5, 0x03563482, 0x8aba3cbb, 0x28517711, 0xc20ad9f8, 0xabcc5167, 0xccad925f, 0x4de81751, 0x3830dc8e, 0x379d5862, 0x9320f991, 0xea7a90c2, 0xfb3e7bce, 0x5121ce64, 0x774fbe32, 0xa8b6e37e, 0xc3293d46, 0x48de5369, 0x6413e680, 0xa2ae0810, 0xdd6db224, 0x69852dfd, 0x09072166, 0xb39a460a, 0x6445c0dd, 0x586cdecf, 0x1c20c8ae, 0x5bbef7dd, 0x1b588d40, 0xccd2017f, 0x6bb4e3bb, 0xdda26a7e, 0x3a59ff45, 0x3e350a44, 0xbcb4cdd5, 0x72eacea8, 0xfa6484bb, 0x8d6612ae, 0xbf3c6f47, 0xd29be463, 0x542f5d9e, 0xaec2771b, 0xf64e6370, 0x740e0d8d, 0xe75b1357, 0xf8721671, 0xaf537d5d, 0x4040cb08, 0x4eb4e2cc, 0x34d2466a, 0x0115af84, 0xe1b00428, 0x95983a1d, 0x06b89fb4, 0xce6ea048, 0x6f3f3b82, 0x3520ab82, 0x011a1d4b, 0x277227f8, 0x611560b1, 0xe7933fdc, 0xbb3a792b, 0x344525bd, 0xa08839e1, 0x51ce794b, 0x2f32c9b7, 0xa01fbac9, 0xe01cc87e, 0xbcc7d1f6, 0xcf0111c3, 0xa1e8aac7, 0x1a908749, 0xd44fbd9a, 0xd0dadecb, 0xd50ada38, 0x0339c32a, 0xc6913667, 0x8df9317c, 0xe0b12b4f, 0xf79e59b7, 0x43f5bb3a, 0xf2d519ff, 0x27d9459c, 0xbf97222c, 0x15e6fc2a, 0x0f91fc71, 0x9b941525, 0xfae59361, 0xceb69ceb, 0xc2a86459, 0x12baa8d1, 0xb6c1075e, 0xe3056a0c, 0x10d25065, 0xcb03a442, 0xe0ec6e0e, 0x1698db3b, 0x4c98a0be, 0x3278e964, 0x9f1f9532, 0xe0d392df, 0xd3a0342b, 0x8971f21e, 0x1b0a7441, 0x4ba3348c, 0xc5be7120, 0xc37632d8, 0xdf359f8d, 0x9b992f2e, 0xe60b6f47, 0x0fe3f11d, 0xe54cda54, 0x1edad891, 0xce6279cf, 0xcd3e7e6f, 0x1618b166, 0xfd2c1d05, 0x848fd2c5, 0xf6fb2299, 0xf523f357, 0xa6327623, 0x93a83531, 0x56cccd02, 0xacf08162, 0x5a75ebb5, 0x6e163697, 0x88d273cc, 0xde966292, 0x81b949d0, 0x4c50901b, 0x71c65614, 0xe6c6c7bd, 0x327a140a, 0x45e1d006, 0xc3f27b9a, 0xc9aa53fd, 0x62a80f00, 0xbb25bfe2, 0x35bdd2f6, 0x71126905, 0xb2040222, 0xb6cbcf7c, 0xcd769c2b, 0x53113ec0, 0x1640e3d3, 0x38abbd60, 0x2547adf0, 0xba38209c, 0xf746ce76, 0x77afa1c5, 0x20756060, 0x85cbfe4e, 0x8ae88dd8, 0x7aaaf9b0, 0x4cf9aa7e, 0x1948c25c, 0x02fb8a8c, 0x01c36ae4, 0xd6ebe1f9, 0x90d4f869, 0xa65cdea0, 0x3f09252d, 0xc208e69f, 0xb74e6132, 0xce77e25b, 0x578fdfe3, 0x3ac372e6];
								}
				}, {
								key: '_initPArray',
								value: function _initPArray() {
												this.pArray = [0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344, 0xa4093822, 0x299f31d0, 0x082efa98, 0xec4e6c89, 0x452821e6, 0x38d01377, 0xbe5466cf, 0x34e90c6c, 0xc0ac29b7, 0xc97c50dd, 0x3f84d5b5, 0xb5470917, 0x9216d5d9, 0x8979fb1b];
								}
				}, {
								key: 'F',
								value: function F(xL) {
												var a = xL >>> 24;
												var b = xL << 8 >>> 24;
												var c = xL << 16 >>> 24;
												var d = xL << 24 >>> 24;

												var res = this.addMod32(this.sBox0[a], this.sBox1[b]);
												res = this.xor(res, this.sBox2[c]);
												res = this.addMod32(res, this.sBox3[d]);
												return res;
								}
				}, {
								key: 'encrypt',
								value: function encrypt(string) {
												if (this.mode === 'ecb') {
																return this.encryptECB(string);
												}

												if (this.mode === 'cbc') {
																return this.encryptCBC(string, this.iv);
												}

												throw new Error('Unknown mode');
								}
				}, {
								key: 'decrypt',
								value: function decrypt(string) {
												if (this.mode === 'ecb') {
																return this.decryptECB(string);
												}

												if (this.mode === 'cbc') {
																return this.decryptCBC(string, this.iv);
												}

												throw new Error('Unknown mode');
								}
				}, {
								key: 'encryptECB',
								value: function encryptECB(string) {
												string = this.utf8Decode(string);
												var blocks = Math.ceil(string.length / 8);

												var encryptedString = '';
												for (var i = 0; i < blocks; i++) {
																var block = string.substr(i * 8, 8);
																if (block.length < 8) {
																				var count = 8 - block.length;
																				while (0 < count--) {
																								block += '\0';
																				}
																}

																var xL, xR;
																//[xL, xR] = this.split64by32(block); does not work in IE, Chrome
																var xLxR = this.split64by32(block);
																xL = xLxR[0];
																xR = xLxR[1];

																//[xL, xR] = this.encipher(xL, xR); does not work in IE, Chrome
																xLxR = this.encipher(xL, xR);
																xL = xLxR[0];
																xR = xLxR[1];
																encryptedString += this.num2block32(xL) + this.num2block32(xR);
												}

												return encryptedString;
								}
				}, {
								key: 'decryptECB',
								value: function decryptECB(string) {
												var blocks = Math.ceil(string.length / 8);

												var decryptedString = '';
												for (var i = 0; i < blocks; i++) {
																var block = string.substr(i * 8, 8);
																if (block.length < 8) {
																				throw new Error('The encrypted string is corrupted: the length of the encrypted string must be a multiple of 8 bytes.');
																}
																var xL, xR, xLxR;

																xLxR = this.split64by32(block);
																xL = xLxR[0];
																xR = xLxR[1];

																xLxR = this.decipher(xL, xR);
																xL = xLxR[0];
																xR = xLxR[1];

																decryptedString += this.num2block32(xL) + this.num2block32(xR);
												}

												decryptedString = this.utf8Encode(decryptedString);
												return decryptedString;
								}
				}, {
								key: 'encryptCBC',
								value: function encryptCBC(string, iv) {
												string = this.utf8Decode(string);
												var blocks = Math.ceil(string.length / 8);

												var ivL, ivR, ivLivR;
												//[ivL, ivR] = this.split64by32(iv);
												ivLivR = this.split64by32(iv);
												ivL = ivLivR[0];
												ivR = ivLivR[1];

												var encryptedString = '';
												for (var i = 0; i < blocks; i++) {
																var block = string.substr(i * 8, 8);
																if (block.length < 8) {
																				var count = 8 - block.length;
																				while (0 < count--) {
																								block += '\0';
																				}
																}

																var xL, xR, xLxR;
																xLxR = this.split64by32(block);
																xL = xLxR[0];
																xR = xLxR[1];

																xL = this.xor(xL, ivL);
																xR = this.xor(xR, ivR);

																xLxR = this.encipher(xL, xR);
																xL = xLxR[0];
																xR = xLxR[1];
																//[ivL, ivR] = [xL, xR];
																encryptedString += this.num2block32(xL) + this.num2block32(xR);
																ivL = xL;
																ivR = xR;
												}

												return encryptedString;
								}
				}, {
								key: 'decryptCBC',
								value: function decryptCBC(string, iv) {

												var blocks = Math.ceil(string.length / 8);

												var ivL, ivR, ivLtmp, ivRtmp, ivLivR;

												ivLivR = this.split64by32(iv);
												ivL = ivLivR[0];
												ivR = ivLivR[1];

												var decryptedString = '';
												for (var i = 0; i < blocks; i++) {
																var block = string.substr(i * 8, 8);
																if (block.length < 8) {
																				throw new Error('The encrypted string is corrupt: the length of the encrypted string must be a multiple of 8 bytes.');
																}
																var xL, xR, xLxR;
																xLxR = this.split64by32(block);
																xL = xLxR[0];
																xR = xLxR[1];

																ivLtmp = xL;
																ivRtmp = xR;

																xLxR = this.decipher(xL, xR);
																xL = xLxR[0];
																xR = xLxR[1];

																xL = this.xor(xL, ivL);
																xR = this.xor(xR, ivR);

																ivL = ivLtmp;
																ivR = ivRtmp;
																decryptedString += this.num2block32(xL) + this.num2block32(xR);
												}

												decryptedString = this.utf8Encode(decryptedString);
												return decryptedString;
								}
				}, {
								key: 'encipher',
								value: function encipher(xL, xR) {
												var tmp;
												for (var i = 0; i < 16; i++) {
																xL = this.xor(xL, this.pArray[i]);
																xR = this.xor(this.F(xL), xR);
																tmp = xL;
																xL = xR;
																xR = tmp;
												}

												tmp = xL;
												xL = xR;
												xR = tmp;

												xR = this.xor(xR, this.pArray[16]);
												xL = this.xor(xL, this.pArray[17]);

												return [xL, xR];
								}
				}, {
								key: 'decipher',
								value: function decipher(xL, xR) {
												var tmp;

												xL = this.xor(xL, this.pArray[17]);
												xR = this.xor(xR, this.pArray[16]);

												tmp = xL;
												xL = xR;
												xR = tmp;

												for (var i = 15; i >= 0; i--) {
																tmp = xL;
																xL = xR;
																xR = tmp;
																xR = this.xor(this.F(xL), xR);
																xL = this.xor(xL, this.pArray[i]);
												}

												return [xL, xR];
								}
				}, {
								key: 'generateSubkeys',
								value: function generateSubkeys(key) {
												var data = 0;
												var k = 0;
												var i, j;

												for (i = 0; i < 18; i++) {
																for (j = 4; j > 0; j--) {
																				data = this.fixNegative(data << 8 | key.charCodeAt(k));
																				k = (k + 1) % key.length;
																}
																this.pArray[i] = this.xor(this.pArray[i], data);
																data = 0;
												}

												//var block64 = num2block32(0) + num2block32(0);
												var block64 = [0, 0];
												for (i = 0; i < 18; i += 2) {
																block64 = this.encipher(block64[0], block64[1]);
																this.pArray[i] = block64[0];
																this.pArray[i + 1] = block64[1];
												}

												for (i = 0; i < 256; i += 2) {
																block64 = this.encipher(block64[0], block64[1]);
																this.sBox0[i] = block64[0];
																this.sBox0[i + 1] = block64[1];
												}

												for (i = 0; i < 256; i += 2) {
																block64 = this.encipher(block64[0], block64[1]);
																this.sBox1[i] = block64[0];
																this.sBox1[i + 1] = block64[1];
												}

												for (i = 0; i < 256; i += 2) {
																block64 = this.encipher(block64[0], block64[1]);
																this.sBox2[i] = block64[0];
																this.sBox2[i + 1] = block64[1];
												}

												for (i = 0; i < 256; i += 2) {
																block64 = this.encipher(block64[0], block64[1]);
																this.sBox3[i] = block64[0];
																this.sBox3[i + 1] = block64[1];
												}
								}
				}, {
								key: 'block32toNum',
								value: function block32toNum(block32) {
												return this.fixNegative(block32.charCodeAt(0) << 24 | block32.charCodeAt(1) << 16 | block32.charCodeAt(2) << 8 | block32.charCodeAt(3));
								}
				}, {
								key: 'num2block32',
								value: function num2block32(num) {
												return String.fromCharCode(num >>> 24) + String.fromCharCode(num << 8 >>> 24) + String.fromCharCode(num << 16 >>> 24) + String.fromCharCode(num << 24 >>> 24);
								}
				}, {
								key: 'xor',
								value: function xor(a, b) {
												return this.fixNegative(a ^ b);
								}
				}, {
								key: 'addMod32',
								value: function addMod32(a, b) {
												return this.fixNegative(a + b | 0); // | 0 results in a 32-bit value
								}
				}, {
								key: 'fixNegative',
								value: function fixNegative(number) {
												return number >>> 0;
								}
				}, {
								key: 'split64by32',
								value: function split64by32(block64) {
												var xL = block64.substring(0, 4);
												var xR = block64.substring(4, 8);

												return [this.block32toNum(xL), this.block32toNum(xR)];
								}
				}, {
								key: 'utf8Decode',
								value: function utf8Decode(string) {
												var utftext = '';
												for (var n = 0; n < string.length; n++) {
																var c = string.charCodeAt(n);
																if (c < 128) {
																				utftext += String.fromCharCode(c);
																} else if (c > 127 && c < 2048) {
																				utftext += String.fromCharCode(c >> 6 | 192);
																				utftext += String.fromCharCode(c & 63 | 128);
																} else {
																				utftext += String.fromCharCode(c >> 12 | 224);
																				utftext += String.fromCharCode(c >> 6 & 63 | 128);
																				utftext += String.fromCharCode(c & 63 | 128);
																}
												}
												return utftext;
								}
				}, {
								key: 'utf8Encode',
								value: function utf8Encode(utftext) {
												var string = '';
												var i = 0;
												var c = 0;
												var c1 = 0;
												var c2 = 0;

												while (i < utftext.length) {

																c = utftext.charCodeAt(i);

																if (c < 128) {
																				string += String.fromCharCode(c);
																				i++;
																} else if (c > 191 && c < 224) {
																				c1 = utftext.charCodeAt(i + 1);
																				string += String.fromCharCode((c & 31) << 6 | c1 & 63);
																				i += 2;
																} else {
																				c1 = utftext.charCodeAt(i + 1);
																				c2 = utftext.charCodeAt(i + 2);
																				string += String.fromCharCode((c & 15) << 12 | (c1 & 63) << 6 | c2 & 63);
																				i += 3;
																}
												}

												return string;
								}
				}, {
								key: 'trimZeros',
								value: function trimZeros(input) {
												return input.replace(/\0+$/g, '');
								}
				}, {
								key: '_createHelper',
								value: function _createHelper() {
												var algo = new Blowfish();

												/*
            bf.init(key.value, cbc.checked ? 'cbc' : 'ecb');
            output.value = btoa(bf.encrypt(input.value));
            */

												return {
																encrypt: function encrypt(key, plaintext) {
																				algo.init(key);
																				return btoa(algo.encrypt(plaintext));
																}
												};
								}
				}]);

				return Blowfish;
}();

;

module.exports = Blowfish;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var functionUtils = function () {
	function functionUtils() {
		_classCallCheck(this, functionUtils);
	}

	_createClass(functionUtils, [{
		key: 'isAnArray',
		value: function isAnArray(someVar) {
			if (Array.isArray(someVar) || Object.prototype.toString.call(someVar) === '[object Uint8Array]') {

				return true;
			}
			return false;
		}
	}, {
		key: 'areEqual',
		value: function areEqual(first, second) {
			var firstLength = first.length,
			    secondLength = second.length,
			    diffLength,
			    arraysEqualLenghtIndex = 0;

			if (firstLength > secondLength) {
				diffLength = firstLength - secondLength;

				for (; diffLength >= 0; diffLength -= 1) {
					if (first[firstLength - diffLength]) return false;
				}
			} else if (secondLength > firstLength) {
				diffLength = secondLength - firstLength;

				for (; diffLength >= 0; diffLength -= 1) {
					if (second[secondLength - diffLength]) return false;
				}
			}

			for (; arraysEqualLenghtIndex < firstLength; arraysEqualLenghtIndex += 1) {
				if (first[arraysEqualLenghtIndex] !== second[arraysEqualLenghtIndex]) return false;
			}

			return true;
		}

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding

	}, {
		key: 'UTF8ArrToStr',
		value: function UTF8ArrToStr(aBytes) {
			var sView = '',
			    nPart,
			    nLen = aBytes.length,
			    nIdx = 0;

			for (; nIdx < nLen; nIdx += 1) {
				nPart = aBytes[nIdx];

				sView += String.fromCharCode(nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
				/* (nPart - 252 << 32) is not possible in ECMAScript! So...: */
				(nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
				(nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
				(nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
				(nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
				(nPart - 192 << 6) + aBytes[++nIdx] - 128 :
				/* nPart < 127 ? */ /* one byte */
				nPart);
			}

			return sView;
		}
	}, {
		key: 'strToUTF8Arr',
		value: function strToUTF8Arr(sDOMStr) {
			var aBytes,
			    nChr,
			    nStrLen = sDOMStr.length,
			    nArrLen = 0,
			    nMapIdx = 0,
			    nIdx = 0,
			    nChrIdx = 0,
			    paddingValue,
			    paddingIndex;

			/* mapping... */
			for (; nMapIdx < nStrLen; nMapIdx += 1) {
				nChr = sDOMStr.charCodeAt(nMapIdx);

				nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
			}

			aBytes = [];

			/* transcription... */
			for (; nIdx < nArrLen; nChrIdx += 1) {
				nChr = sDOMStr.charCodeAt(nChrIdx);

				if (nChr < 128) {
					/* one byte */
					aBytes[nIdx++] = nChr;
				} else if (nChr < 0x800) {
					/* two bytes */
					aBytes[nIdx++] = 192 + (nChr >>> 6);
					aBytes[nIdx++] = 128 + (nChr & 63);
				} else if (nChr < 0x10000) {
					/* three bytes */
					aBytes[nIdx++] = 224 + (nChr >>> 12);
					aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
					aBytes[nIdx++] = 128 + (nChr & 63);
				} else if (nChr < 0x200000) {
					/* four bytes */
					aBytes[nIdx++] = 240 + (nChr >>> 18);
					aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
					aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
					aBytes[nIdx++] = 128 + (nChr & 63);
				} else if (nChr < 0x4000000) {
					/* five bytes */
					aBytes[nIdx++] = 248 + (nChr >>> 24);
					aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
					aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
					aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
					aBytes[nIdx++] = 128 + (nChr & 63);
				} else {
					/* six bytes */
					aBytes[nIdx++] = 252 + nChr / 1073741824;
					aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
					aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
					aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
					aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
					aBytes[nIdx++] = 128 + (nChr & 63);
				}
			}

			paddingValue = aBytes.length % 16;

			if (paddingValue !== 0) {
				for (paddingIndex = 0; paddingIndex < 16 - paddingValue; paddingIndex += 1) {
					aBytes.push(0);
				}
			}

			return aBytes;
		}
	}]);

	return functionUtils;
}();

var RNG = function () {
	function RNG(seed) {
		_classCallCheck(this, RNG);

		this.m = 0x80000000; // 2**31;
		this.a = 1103515245;
		this.c = 12345;

		this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
	}

	_createClass(RNG, [{
		key: 'nextInt',
		value: function nextInt() {
			this.state = (this.a * this.state + this.c) % this.m;
			return this.state;
		}
	}, {
		key: 'nextFloat',
		value: function nextFloat() {
			// returns in range [0,1]
			return this.nextInt() / (this.m - 1);
		}
	}, {
		key: 'nextRange',
		value: function nextRange(start, end) {
			// returns in range [start, end): including start, excluding end
			// can't modulo nextInt because of weak randomness in lower bits
			var rangeSize = end - start,
			    randomUnder1 = this.nextInt() / this.m;
			return start + Math.floor(randomUnder1 * rangeSize);
		}
	}, {
		key: 'choice',
		value: function choice(array) {
			return array[this.nextRange(0, array.length)];
		}
	}]);

	return RNG;
}();

var Twofish = function () {
	function Twofish(IV) {
		_classCallCheck(this, Twofish);

		this.utils = new functionUtils();
		this.rng = new RNG();
		this.initializingVector = [];

		this.P0 = [];
		this.P1 = [];

		this.setSBoxes();

		this.P = [this.P0, this.P1];
		this.BLOCK_SIZE = 16;
		this.ROUNDS = 16;
		this.SK_STEP = 0x02020202;
		this.SK_BUMP = 0x01010101;
		this.SK_ROTL = 9;
		this.INPUT_WHITEN = 0;
		this.OUTPUT_WHITEN = this.INPUT_WHITEN + this.BLOCK_SIZE / 4;
		this.ROUND_SUBKEYS = this.OUTPUT_WHITEN + this.BLOCK_SIZE / 4; // 2*(# rounds)

		this.GF256_FDBK_2 = Math.floor(0x169 / 2);
		this.GF256_FDBK_4 = Math.floor(0x169 / 4);
		this.RS_GF_FDBK = 0x14D;
		this.MDS = this.calcMDS();

		this.equalsArray = this.utils.areEqual;
		this.byteArrayToString = this.utils.UTF8ArrToStr;
		this.stringToByteArray = this.utils.strToUTF8Arr;

		var blockSizeIndex = 0,
		    paddingIndex = 0,
		    initialLength;

		if (!IV) {
			for (blockSizeIndex = 0; blockSizeIndex < this.BLOCK_SIZE; blockSizeIndex += 1) {
				this.initializingVector.push(this.rng.nextRange(0, 256));
			}
		} else if (IV && this.utils.isAnArray(IV) && IV.length === this.BLOCK_SIZE) {
			this.initializingVector = new Uint8Array(IV);
		} else if (IV && this.utils.isAnArray(IV) && IV.length < this.BLOCK_SIZE) {
			initialLength = IV.length;
			for (paddingIndex = 0; paddingIndex < this.BLOCK_SIZE - initialLength; paddingIndex += 1) {
				IV.push(this.rng.nextRange(0, 256));
			}
			this.initializingVector = new Uint8Array(IV);
		} else if (IV && this.utils.isAnArray(IV) && IV.length > this.BLOCK_SIZE) {
			this.initializingVector = new Uint8Array(IV.slice(0, this.BLOCK_SIZE));
		} else if (!IV || !this.utils.isAnArray(IV) || IV.length < 16 || IV.length > 16) {
			throw Error('Initializing vector incorrect');
		}

		this.initializingVector = new Uint8Array(this.initializingVector);
	}

	_createClass(Twofish, [{
		key: 'calcMDS',
		value: function calcMDS() {
			var localMDS = [[], [], [], []],
			    m1 = [],
			    mX = [],
			    mY = [],
			    i,
			    j,
			    P = this.P;

			// Fixed p0/p1 permutations used in S-box lookup.
			// Change the following constant definitions, then S-boxes will automatically get changed.
			this.P_00 = 1;
			this.P_01 = 0;
			this.P_02 = 0;
			this.P_03 = this.P_01 ^ 1;
			this.P_04 = 1;
			this.P_10 = 0;
			this.P_11 = 0;
			this.P_12 = 1;
			this.P_13 = this.P_11 ^ 1;
			this.P_14 = 0;
			this.P_20 = 1;
			this.P_21 = 1;
			this.P_22 = 0;
			this.P_23 = this.P_21 ^ 1;
			this.P_24 = 0;
			this.P_30 = 0;
			this.P_31 = 1;
			this.P_32 = 1;
			this.P_33 = this.P_31 ^ 1;
			this.P_34 = 1;

			for (i = 0; i < 256; i += 1) {
				j = P[0][i] & 0xFF;
				m1[0] = j;
				mX[0] = this.mxX(j) & 0xFF;
				mY[0] = this.mxY(j) & 0xFF;

				j = P[1][i] & 0xFF;
				m1[1] = j;
				mX[1] = this.mxX(j) & 0xFF;
				mY[1] = this.mxY(j) & 0xFF;

				localMDS[0][i] = m1[this.P_00] << 0 | mX[this.P_00] << 8 | mY[this.P_00] << 16 | mY[this.P_00] << 24;
				localMDS[1][i] = mY[this.P_10] << 0 | mY[this.P_10] << 8 | mX[this.P_10] << 16 | m1[this.P_10] << 24;
				localMDS[2][i] = mX[this.P_20] << 0 | mY[this.P_20] << 8 | m1[this.P_20] << 16 | mY[this.P_20] << 24;
				localMDS[3][i] = mX[this.P_30] << 0 | m1[this.P_30] << 8 | mY[this.P_30] << 16 | mX[this.P_30] << 24;
			}

			return [new Uint32Array(localMDS[0]), new Uint32Array(localMDS[1]), new Uint32Array(localMDS[2]), new Uint32Array(localMDS[3])];
		}
	}, {
		key: 'mxX',
		value: function mxX(x) {
			return x ^ this.lfsr2(x);
		}
	}, {
		key: 'mxY',
		value: function mxY(x) {
			return x ^ this.lfsr1(x) ^ this.lfsr2(x);
		}
	}, {
		key: 'lfsr1',
		value: function lfsr1(x) {
			return x >> 1 ^ ((x & 0x01) !== 0 ? this.GF256_FDBK_2 : 0);
		}
	}, {
		key: 'lfsr2',
		value: function lfsr2(x) {
			return x >> 2 ^ ((x & 0x02) !== 0 ? this.GF256_FDBK_2 : 0) ^ ((x & 0x01) !== 0 ? this.GF256_FDBK_4 : 0);
		}
	}, {
		key: 'b0',
		value: function b0(x) {
			return x & 0xFF;
		}
	}, {
		key: 'b1',
		value: function b1(x) {
			return x >>> 8 & 0xFF;
		}
	}, {
		key: 'b2',
		value: function b2(x) {
			return x >>> 16 & 0xFF;
		}
	}, {
		key: 'b3',
		value: function b3(x) {
			return x >>> 24 & 0xFF;
		}
	}, {
		key: 'chooseB',
		value: function chooseB(x, N) {
			var result = 0;

			switch (N % 4) {
				case 0:
					result = this.b0(x);
					break;
				case 1:
					result = this.b1(x);
					break;
				case 2:
					result = this.b2(x);
					break;
				case 3:
					result = this.b3(x);
					break;
				default:
			}

			return result;
		}
	}, {
		key: 'rsRem',
		value: function rsRem(x) {
			var b = x >>> 24 & 0xFF,
			    g2 = (b << 1 ^ ((b & 0x80) !== 0 ? this.RS_GF_FDBK : 0)) & 0xFF,
			    g3 = b >>> 1 ^ ((b & 0x01) !== 0 ? this.RS_GF_FDBK >>> 1 : 0) ^ g2,
			    result = x << 8 ^ g3 << 24 ^ g2 << 16 ^ g3 << 8 ^ b;
			return result;
		}
	}, {
		key: 'rsMDSEncode',
		value: function rsMDSEncode(k0, k1) {
			var index;

			for (index = 0; index < 4; index += 1) {
				k1 = this.rsRem(k1);
			}

			k1 ^= k0;

			for (index = 0; index < 4; index += 1) {
				k1 = this.rsRem(k1);
			}

			return k1;
		}
	}, {
		key: 'f32',
		value: function f32(k64Cnt, x, k32) {
			var P = this.P;
			var MDS = this.MDS;

			var lB0 = this.b0(x),
			    lB1 = this.b1(x),
			    lB2 = this.b2(x),
			    lB3 = this.b3(x),
			    k0 = k32[0] || 0,
			    k1 = k32[1] || 0,
			    k2 = k32[2] || 0,
			    k3 = k32[3] || 0,
			    result = 0;

			switch (k64Cnt & 3) {
				case 1:
					result = MDS[0][P[this.P_01][lB0] & 0xFF ^ this.b0(k0)] ^ MDS[1][P[this.P_11][lB1] & 0xFF ^ this.b1(k0)] ^ MDS[2][P[this.P_21][lB2] & 0xFF ^ this.b2(k0)] ^ MDS[3][P[this.P_31][lB3] & 0xFF ^ this.b3(k0)];
					break;

				case 0:
					// same as 4
					lB0 = P[this.P_04][lB0] & 0xFF ^ this.b0(k3);
					lB1 = P[this.P_14][lB1] & 0xFF ^ this.b1(k3);
					lB2 = P[this.P_24][lB2] & 0xFF ^ this.b2(k3);
					lB3 = P[this.P_34][lB3] & 0xFF ^ this.b3(k3);
				/* falls through */

				case 3:
					lB0 = P[this.P_03][lB0] & 0xFF ^ this.b0(k2);
					lB1 = P[this.P_13][lB1] & 0xFF ^ this.b1(k2);
					lB2 = P[this.P_23][lB2] & 0xFF ^ this.b2(k2);
					lB3 = P[this.P_33][lB3] & 0xFF ^ this.b3(k2);
				/* falls through */

				case 2:
					result = MDS[0][P[this.P_01][P[this.P_02][lB0] & 0xFF ^ this.b0(k1)] & 0xFF ^ this.b0(k0)] ^ MDS[1][P[this.P_11][P[this.P_12][lB1] & 0xFF ^ this.b1(k1)] & 0xFF ^ this.b1(k0)] ^ MDS[2][P[this.P_21][P[this.P_22][lB2] & 0xFF ^ this.b2(k1)] & 0xFF ^ this.b2(k0)] ^ MDS[3][P[this.P_31][P[this.P_32][lB3] & 0xFF ^ this.b3(k1)] & 0xFF ^ this.b3(k0)];
					break;

				default:
			}

			return result;
		}
	}, {
		key: 'fe32',
		value: function fe32(sBox, x, R) {
			var toReturn = sBox[2 * this.chooseB(x, R)] ^ sBox[2 * this.chooseB(x, R + 1) + 1] ^ sBox[0x200 + 2 * this.chooseB(x, R + 2)] ^ sBox[0x200 + 2 * this.chooseB(x, R + 3) + 1];

			return new Uint32Array([toReturn])[0];
		}
	}, {
		key: 'xorBuffers',
		value: function xorBuffers(a, b) {
			var res = [],
			    index = 0;

			if (a && b && this.utils.isAnArray(a) && this.utils.isAnArray(b) && a.length !== b.length) {
				throw 'Buffer length must be equal';
			}

			a = new Uint8Array(a);
			b = new Uint8Array(b);

			for (index = 0; index < a.length; index += 1) {
				res[index] = (a[index] ^ b[index]) & 0xFF;
			}

			return new Uint8Array(res);
		}
	}, {
		key: 'makeKey',
		value: function makeKey(aKey) {
			var P = this.P;
			var MDS = this.MDS;

			if (!aKey || !this.utils.isAnArray(aKey)) {
				throw Error('key passed is undefined or not an array');
			}

			var keyLength = aKey.length,
			    tmpKey = [],
			    index = 0,
			    nValue,
			    limitedKey,
			    k64Cnt = keyLength / 8,
			    subkeyCnt = this.ROUND_SUBKEYS + 2 * this.ROUNDS,
			    k32e = [],
			    k32o = [],
			    sBoxKey = [],
			    i,
			    j,
			    offset = 0,
			    q,
			    A,
			    B,
			    subKeys = [],
			    lB0,
			    lB1,
			    lB2,
			    lB3,
			    sBox = [],
			    k0,
			    k1,
			    k2,
			    k3;

			if (keyLength < 8 || keyLength > 8 && keyLength < 16 || keyLength > 16 && keyLength < 24 || keyLength > 24 && keyLength < 32) {
				for (index = 0; index < aKey.length + (8 - aKey.length); index += 1) {
					nValue = aKey[index];
					if (nValue !== undefined) {
						tmpKey.push(nValue);
					} else {
						tmpKey.push(0x00);
					}
				}

				aKey = tmpKey;
			} else if (keyLength > 32) {
				limitedKey = [];

				for (index = 0; index < 32; index += 1) {
					limitedKey.push(aKey[index]);
				}

				aKey = limitedKey;
			}

			aKey = new Uint8Array(aKey);
			keyLength = aKey.length;

			for (i = 0, j = k64Cnt - 1; i < 4 && offset < keyLength; i += 1, j -= 1) {
				k32e[i] = aKey[offset++] & 0xFF | (aKey[offset++] & 0xFF) << 8 | (aKey[offset++] & 0xFF) << 16 | (aKey[offset++] & 0xFF) << 24;
				k32o[i] = aKey[offset++] & 0xFF | (aKey[offset++] & 0xFF) << 8 | (aKey[offset++] & 0xFF) << 16 | (aKey[offset++] & 0xFF) << 24;

				sBoxKey[j] = this.rsMDSEncode(k32e[i], k32o[i]);
			}

			for (i = q = 0; i < subkeyCnt / 2; i += 1, q += this.SK_STEP) {
				A = this.f32(k64Cnt, q, k32e);
				B = this.f32(k64Cnt, q + this.SK_BUMP, k32o);
				B = B << 8 | B >>> 24;
				A += B;
				subKeys[2 * i] = A;
				A += B;
				subKeys[2 * i + 1] = A << this.SK_ROTL | A >>> 32 - this.SK_ROTL;
			}

			k0 = sBoxKey[0];
			k1 = sBoxKey[1];
			k2 = sBoxKey[2];
			k3 = sBoxKey[3];

			for (i = 0; i < 256; i += 1) {
				lB0 = lB1 = lB2 = lB3 = i;

				switch (k64Cnt & 3) {
					case 1:
						sBox[2 * i] = MDS[0][P[this.P_01][lB0] & 0xFF ^ this.b0(k0)];
						sBox[2 * i + 1] = MDS[1][P[this.P_11][lB1] & 0xFF ^ this.b1(k0)];
						sBox[0x200 + 2 * i] = MDS[2][P[this.P_21][lB2] & 0xFF ^ this.b2(k0)];
						sBox[0x200 + 2 * i + 1] = MDS[3][P[this.P_31][lB3] & 0xFF ^ this.b3(k0)];
						break;

					case 0:
						lB0 = P[this.P_04][lB0] & 0xFF ^ this.b0(k3);
						lB1 = P[this.P_14][lB1] & 0xFF ^ this.b1(k3);
						lB2 = P[this.P_24][lB2] & 0xFF ^ this.b2(k3);
						lB3 = P[this.P_34][lB3] & 0xFF ^ this.b3(k3);
					/* falls through */

					case 3:
						lB0 = P[this.P_03][lB0] & 0xFF ^ this.b0(k2);
						lB1 = P[this.P_13][lB1] & 0xFF ^ this.b1(k2);
						lB2 = P[this.P_23][lB2] & 0xFF ^ this.b2(k2);
						lB3 = P[this.P_33][lB3] & 0xFF ^ this.b3(k2);
					/* falls through */

					case 2:
						sBox[2 * i] = MDS[0][P[this.P_01][P[this.P_02][lB0] & 0xFF ^ this.b0(k1)] & 0xFF ^ this.b0(k0)];
						sBox[2 * i + 1] = MDS[1][P[this.P_11][P[this.P_12][lB1] & 0xFF ^ this.b1(k1)] & 0xFF ^ this.b1(k0)];
						sBox[0x200 + 2 * i] = MDS[2][P[this.P_21][P[this.P_22][lB2] & 0xFF ^ this.b2(k1)] & 0xFF ^ this.b2(k0)];
						sBox[0x200 + 2 * i + 1] = MDS[3][P[this.P_31][P[this.P_32][lB3] & 0xFF ^ this.b3(k1)] & 0xFF ^ this.b3(k0)];
						break;

					default:
				}
			}

			return [sBox, subKeys];
		}
	}, {
		key: 'blockEncrypt',
		value: function blockEncrypt(input, inOffset, sessionKey) {
			if (input && sessionKey && this.utils.isAnArray(sessionKey) && this.utils.isAnArray(input)) {
				input = new Uint8Array(input);

				var sBox = sessionKey[0],
				    sKey = sessionKey[1],
				    x0 = input[inOffset++] & 0xFF | (input[inOffset++] & 0xFF) << 8 | (input[inOffset++] & 0xFF) << 16 | (input[inOffset++] & 0xFF) << 24,
				    x1 = input[inOffset++] & 0xFF | (input[inOffset++] & 0xFF) << 8 | (input[inOffset++] & 0xFF) << 16 | (input[inOffset++] & 0xFF) << 24,
				    x2 = input[inOffset++] & 0xFF | (input[inOffset++] & 0xFF) << 8 | (input[inOffset++] & 0xFF) << 16 | (input[inOffset++] & 0xFF) << 24,
				    x3 = input[inOffset++] & 0xFF | (input[inOffset++] & 0xFF) << 8 | (input[inOffset++] & 0xFF) << 16 | (input[inOffset++] & 0xFF) << 24,
				    t0,
				    t1,
				    k = this.ROUND_SUBKEYS,
				    R = 0;

				x0 ^= sKey[this.INPUT_WHITEN];
				x1 ^= sKey[this.INPUT_WHITEN + 1];
				x2 ^= sKey[this.INPUT_WHITEN + 2];
				x3 ^= sKey[this.INPUT_WHITEN + 3];

				for (R = 0; R < this.ROUNDS; R += 2) {
					t0 = this.fe32(sBox, x0, 0);
					t1 = this.fe32(sBox, x1, 3);

					x2 ^= t0 + t1 + sKey[k++];
					x2 = x2 >>> 1 | x2 << 31;
					x3 = x3 << 1 | x3 >>> 31;
					x3 ^= t0 + 2 * t1 + sKey[k++];

					t0 = this.fe32(sBox, x2, 0);
					t1 = this.fe32(sBox, x3, 3);
					x0 ^= t0 + t1 + sKey[k++];
					x0 = x0 >>> 1 | x0 << 31;
					x1 = x1 << 1 | x1 >>> 31;
					x1 ^= t0 + 2 * t1 + sKey[k++];
				}

				x2 ^= sKey[this.OUTPUT_WHITEN];
				x3 ^= sKey[this.OUTPUT_WHITEN + 1];
				x0 ^= sKey[this.OUTPUT_WHITEN + 2];
				x1 ^= sKey[this.OUTPUT_WHITEN + 3];

				return new Uint8Array([x2, x2 >>> 8, x2 >>> 16, x2 >>> 24, x3, x3 >>> 8, x3 >>> 16, x3 >>> 24, x0, x0 >>> 8, x0 >>> 16, x0 >>> 24, x1, x1 >>> 8, x1 >>> 16, x1 >>> 24]);
			} else {
				throw Error('input block is not an array or sessionKey is incorrect');
			}
		}
	}, {
		key: 'blockDecrypt',
		value: function blockDecrypt(input, inOffset, sessionKey) {
			if (input && sessionKey && this.utils.isAnArray(sessionKey) && this.utils.isAnArray(input)) {
				var sBox = sessionKey[0],
				    sKey = sessionKey[1],
				    x2 = input[inOffset++] & 0xFF | (input[inOffset++] & 0xFF) << 8 | (input[inOffset++] & 0xFF) << 16 | (input[inOffset++] & 0xFF) << 24,
				    x3 = input[inOffset++] & 0xFF | (input[inOffset++] & 0xFF) << 8 | (input[inOffset++] & 0xFF) << 16 | (input[inOffset++] & 0xFF) << 24,
				    x0 = input[inOffset++] & 0xFF | (input[inOffset++] & 0xFF) << 8 | (input[inOffset++] & 0xFF) << 16 | (input[inOffset++] & 0xFF) << 24,
				    x1 = input[inOffset++] & 0xFF | (input[inOffset++] & 0xFF) << 8 | (input[inOffset++] & 0xFF) << 16 | (input[inOffset++] & 0xFF) << 24,
				    k = this.ROUND_SUBKEYS + 2 * this.ROUNDS - 1,
				    t0,
				    t1,
				    R = 0;

				x2 ^= sKey[this.OUTPUT_WHITEN];
				x3 ^= sKey[this.OUTPUT_WHITEN + 1];
				x0 ^= sKey[this.OUTPUT_WHITEN + 2];
				x1 ^= sKey[this.OUTPUT_WHITEN + 3];

				for (R = 0; R < this.ROUNDS; R += 2) {
					t0 = this.fe32(sBox, x2, 0);
					t1 = this.fe32(sBox, x3, 3);
					x1 ^= t0 + 2 * t1 + sKey[k--];
					x1 = x1 >>> 1 | x1 << 31;
					x0 = x0 << 1 | x0 >>> 31;
					x0 ^= t0 + t1 + sKey[k--];
					t0 = this.fe32(sBox, x0, 0);
					t1 = this.fe32(sBox, x1, 3);
					x3 ^= t0 + 2 * t1 + sKey[k--];
					x3 = x3 >>> 1 | x3 << 31;
					x2 = x2 << 1 | x2 >>> 31;
					x2 ^= t0 + t1 + sKey[k--];
				}

				x0 ^= sKey[this.INPUT_WHITEN];
				x1 ^= sKey[this.INPUT_WHITEN + 1];
				x2 ^= sKey[this.INPUT_WHITEN + 2];
				x3 ^= sKey[this.INPUT_WHITEN + 3];

				return new Uint8Array([x0, x0 >>> 8, x0 >>> 16, x0 >>> 24, x1, x1 >>> 8, x1 >>> 16, x1 >>> 24, x2, x2 >>> 8, x2 >>> 16, x2 >>> 24, x3, x3 >>> 8, x3 >>> 16, x3 >>> 24]);
			} else {
				throw Error('input block is not an array or sessionKey is incorrect');
			}
		}
	}, {
		key: 'encrypt',
		value: function encrypt(userKey, plainText) {
			var i,
			    offset,
			    ct = [],
			    tmpBlockEncrypt;

			if (this.utils.isAnArray(userKey) && this.utils.isAnArray(plainText)) {
				userKey = new Uint8Array(userKey);
				plainText = new Uint8Array(plainText);
			} else {
				throw Error('Inputs must be an array');
			}

			userKey = this.makeKey(userKey);

			for (offset = 0; offset < plainText.length; offset += 16) {
				tmpBlockEncrypt = this.blockEncrypt(plainText, offset, userKey);

				for (i = 0; i < tmpBlockEncrypt.length; i += 1) {
					ct.push(tmpBlockEncrypt[i]);
				}
			}

			return ct;
		}
	}, {
		key: 'decrypt',
		value: function decrypt(userKey, chiperText) {
			var i,
			    offset,
			    cpt = [],
			    tmpBlockDecrypt;

			if (this.utils.isAnArray(userKey) && this.utils.isAnArray(chiperText)) {
				userKey = new Uint8Array(userKey);
				chiperText = new Uint8Array(chiperText);
			} else {
				throw Error('Inputs must be an array');
			}

			userKey = this.makeKey(userKey);

			for (offset = 0; offset < chiperText.length; offset += 16) {
				tmpBlockDecrypt = this.blockDecrypt(chiperText, offset, userKey);
				for (i = 0; i < tmpBlockDecrypt.length; i += 1) {

					cpt.push(tmpBlockDecrypt[i]);
				}
			}

			return cpt;
		}
	}, {
		key: 'encryptCBC',
		value: function encryptCBC(userKey, plainText) {
			if (this.utils.isAnArray(userKey) && this.utils.isAnArray(plainText)) {
				userKey = new Uint8Array(userKey);
				plainText = new Uint8Array(plainText);
			} else {
				throw Error('Inputs must be an array');
			}
			userKey = this.makeKey(userKey);

			var result = [],
			    loops = plainText.length / this.BLOCK_SIZE,
			    pos = 0,
			    cBuffer = [],
			    buffer1 = [],
			    buffer2 = [],
			    vector = this.initializingVector,
			    secondIndex = 0,
			    tmpCBuffer,
			    nVal,
			    position,
			    paddingIndex;

			for (var index = 0; index < loops; index += 1) {
				cBuffer = plainText.subarray(pos, pos + this.BLOCK_SIZE);
				if (cBuffer.length < this.BLOCK_SIZE) {

					tmpCBuffer = [];
					for (paddingIndex = 0; paddingIndex < this.BLOCK_SIZE; paddingIndex += 1) {

						nVal = cBuffer[paddingIndex];
						if (nVal !== undefined) {

							tmpCBuffer.push(nVal);
						} else {

							tmpCBuffer.push(0x00);
						}
					}
					cBuffer = tmpCBuffer;
				}
				buffer1 = this.xorBuffers(cBuffer, vector);
				buffer2 = this.blockEncrypt(buffer1, 0, userKey);

				for (secondIndex = pos; secondIndex < buffer2.length + pos; secondIndex += 1) {

					position = secondIndex - pos;
					if (buffer2[position] !== undefined) {

						result.splice(secondIndex, 0, buffer2[position]);
					}
				}
				vector = buffer2;
				pos += this.BLOCK_SIZE;
			}

			return result;
		}
	}, {
		key: 'decryptCBC',
		value: function decryptCBC(userKey, chiperText) {
			if (this.utils.isAnArray(userKey) && this.utils.isAnArray(chiperText)) {
				userKey = new Uint8Array(userKey);
				chiperText = new Uint8Array(chiperText);
			} else {
				throw Error('Inputs must be an array');
			}

			userKey = this.makeKey(userKey);

			var result = [],
			    loops = chiperText.length / this.BLOCK_SIZE,
			    pos = 0,
			    cBuffer = [],
			    buffer1 = [],
			    plain = [],
			    vector = this.initializingVector,
			    secondIndex = 0,
			    tmpCBuffer,
			    nVal,
			    position,
			    paddingIndex;

			for (var index = 0; index < loops; index += 1) {
				cBuffer = chiperText.subarray(pos, pos + this.BLOCK_SIZE);
				if (cBuffer.length < this.BLOCK_SIZE) {

					tmpCBuffer = [];
					for (paddingIndex = 0; paddingIndex < this.BLOCK_SIZE; paddingIndex += 1) {

						nVal = cBuffer[paddingIndex];
						if (nVal !== undefined) {

							tmpCBuffer.push(nVal);
						} else {

							tmpCBuffer.push(0x00);
						}
					}
					cBuffer = tmpCBuffer;
				}
				buffer1 = this.blockDecrypt(cBuffer, 0, userKey);
				plain = this.xorBuffers(buffer1, vector);

				for (secondIndex = pos; secondIndex < plain.length + pos; secondIndex += 1) {

					position = secondIndex - pos;
					if (plain[position] !== undefined) {

						result.splice(secondIndex, 0, plain[position]);
					}
				}
				plain = [];
				vector = cBuffer;

				pos += this.BLOCK_SIZE;
			}

			return result;
		}
	}, {
		key: 'setSBoxes',
		value: function setSBoxes() {
			// S-boxes
			this.P0 = new Uint8Array([0xA9, 0x67, 0xB3, 0xE8, 0x04, 0xFD, 0xA3, 0x76, 0x9A, 0x92, 0x80, 0x78, 0xE4, 0xDD, 0xD1, 0x38, 0x0D, 0xC6, 0x35, 0x98, 0x18, 0xF7, 0xEC, 0x6C, 0x43, 0x75, 0x37, 0x26, 0xFA, 0x13, 0x94, 0x48, 0xF2, 0xD0, 0x8B, 0x30, 0x84, 0x54, 0xDF, 0x23, 0x19, 0x5B, 0x3D, 0x59, 0xF3, 0xAE, 0xA2, 0x82, 0x63, 0x01, 0x83, 0x2E, 0xD9, 0x51, 0x9B, 0x7C, 0xA6, 0xEB, 0xA5, 0xBE, 0x16, 0x0C, 0xE3, 0x61, 0xC0, 0x8C, 0x3A, 0xF5, 0x73, 0x2C, 0x25, 0x0B, 0xBB, 0x4E, 0x89, 0x6B, 0x53, 0x6A, 0xB4, 0xF1, 0xE1, 0xE6, 0xBD, 0x45, 0xE2, 0xF4, 0xB6, 0x66, 0xCC, 0x95, 0x03, 0x56, 0xD4, 0x1C, 0x1E, 0xD7, 0xFB, 0xC3, 0x8E, 0xB5, 0xE9, 0xCF, 0xBF, 0xBA, 0xEA, 0x77, 0x39, 0xAF, 0x33, 0xC9, 0x62, 0x71, 0x81, 0x79, 0x09, 0xAD, 0x24, 0xCD, 0xF9, 0xD8, 0xE5, 0xC5, 0xB9, 0x4D, 0x44, 0x08, 0x86, 0xE7, 0xA1, 0x1D, 0xAA, 0xED, 0x06, 0x70, 0xB2, 0xD2, 0x41, 0x7B, 0xA0, 0x11, 0x31, 0xC2, 0x27, 0x90, 0x20, 0xF6, 0x60, 0xFF, 0x96, 0x5C, 0xB1, 0xAB, 0x9E, 0x9C, 0x52, 0x1B, 0x5F, 0x93, 0x0A, 0xEF, 0x91, 0x85, 0x49, 0xEE, 0x2D, 0x4F, 0x8F, 0x3B, 0x47, 0x87, 0x6D, 0x46, 0xD6, 0x3E, 0x69, 0x64, 0x2A, 0xCE, 0xCB, 0x2F, 0xFC, 0x97, 0x05, 0x7A, 0xAC, 0x7F, 0xD5, 0x1A, 0x4B, 0x0E, 0xA7, 0x5A, 0x28, 0x14, 0x3F, 0x29, 0x88, 0x3C, 0x4C, 0x02, 0xB8, 0xDA, 0xB0, 0x17, 0x55, 0x1F, 0x8A, 0x7D, 0x57, 0xC7, 0x8D, 0x74, 0xB7, 0xC4, 0x9F, 0x72, 0x7E, 0x15, 0x22, 0x12, 0x58, 0x07, 0x99, 0x34, 0x6E, 0x50, 0xDE, 0x68, 0x65, 0xBC, 0xDB, 0xF8, 0xC8, 0xA8, 0x2B, 0x40, 0xDC, 0xFE, 0x32, 0xA4, 0xCA, 0x10, 0x21, 0xF0, 0xD3, 0x5D, 0x0F, 0x00, 0x6F, 0x9D, 0x36, 0x42, 0x4A, 0x5E, 0xC1, 0xE0]);

			this.P1 = new Uint8Array([0x75, 0xF3, 0xC6, 0xF4, 0xDB, 0x7B, 0xFB, 0xC8, 0x4A, 0xD3, 0xE6, 0x6B, 0x45, 0x7D, 0xE8, 0x4B, 0xD6, 0x32, 0xD8, 0xFD, 0x37, 0x71, 0xF1, 0xE1, 0x30, 0x0F, 0xF8, 0x1B, 0x87, 0xFA, 0x06, 0x3F, 0x5E, 0xBA, 0xAE, 0x5B, 0x8A, 0x00, 0xBC, 0x9D, 0x6D, 0xC1, 0xB1, 0x0E, 0x80, 0x5D, 0xD2, 0xD5, 0xA0, 0x84, 0x07, 0x14, 0xB5, 0x90, 0x2C, 0xA3, 0xB2, 0x73, 0x4C, 0x54, 0x92, 0x74, 0x36, 0x51, 0x38, 0xB0, 0xBD, 0x5A, 0xFC, 0x60, 0x62, 0x96, 0x6C, 0x42, 0xF7, 0x10, 0x7C, 0x28, 0x27, 0x8C, 0x13, 0x95, 0x9C, 0xC7, 0x24, 0x46, 0x3B, 0x70, 0xCA, 0xE3, 0x85, 0xCB, 0x11, 0xD0, 0x93, 0xB8, 0xA6, 0x83, 0x20, 0xFF, 0x9F, 0x77, 0xC3, 0xCC, 0x03, 0x6F, 0x08, 0xBF, 0x40, 0xE7, 0x2B, 0xE2, 0x79, 0x0C, 0xAA, 0x82, 0x41, 0x3A, 0xEA, 0xB9, 0xE4, 0x9A, 0xA4, 0x97, 0x7E, 0xDA, 0x7A, 0x17, 0x66, 0x94, 0xA1, 0x1D, 0x3D, 0xF0, 0xDE, 0xB3, 0x0B, 0x72, 0xA7, 0x1C, 0xEF, 0xD1, 0x53, 0x3E, 0x8F, 0x33, 0x26, 0x5F, 0xEC, 0x76, 0x2A, 0x49, 0x81, 0x88, 0xEE, 0x21, 0xC4, 0x1A, 0xEB, 0xD9, 0xC5, 0x39, 0x99, 0xCD, 0xAD, 0x31, 0x8B, 0x01, 0x18, 0x23, 0xDD, 0x1F, 0x4E, 0x2D, 0xF9, 0x48, 0x4F, 0xF2, 0x65, 0x8E, 0x78, 0x5C, 0x58, 0x19, 0x8D, 0xE5, 0x98, 0x57, 0x67, 0x7F, 0x05, 0x64, 0xAF, 0x63, 0xB6, 0xFE, 0xF5, 0xB7, 0x3C, 0xA5, 0xCE, 0xE9, 0x68, 0x44, 0xE0, 0x4D, 0x43, 0x69, 0x29, 0x2E, 0xAC, 0x15, 0x59, 0xA8, 0x0A, 0x9E, 0x6E, 0x47, 0xDF, 0x34, 0x35, 0x6A, 0xCF, 0xDC, 0x22, 0xC9, 0xC0, 0x9B, 0x89, 0xD4, 0xED, 0xAB, 0x12, 0xA2, 0x0D, 0x52, 0xBB, 0x02, 0x2F, 0xA9, 0xD7, 0x61, 0x1E, 0xB4, 0x50, 0x04, 0xF6, 0xC2, 0x16, 0x25, 0x86, 0x56, 0x55, 0x09, 0xBE, 0x91]);
		}
	}]);

	return Twofish;
}();

module.exports = Twofish;

/** Usage:
var IV = IV = [
	180, 106, 2, 96, //b4 6a 02 60
	176, 188, 73, 34, // b0 bc 49 22
	181, 235, 7, 133, // b5 eb 07 85
	164, 183, 204, 158 // a4 b7 cc 9e;
];
var twF = twofish(IV);

var key = [
	1, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0
];

var ct = [
	20, 37, 228, 187, //14 25 e4 bb
	61, 89, 245, 87, //3d 59 f5 57
	52, 175, 38, 58, //34 af 26 3a
	96, 9, 121, 1 //60 09 79 01
];

var cpt = twF.decryptCBC(key, ct);

var probablePt = [
	94, 160, 128, 0, //5e a0 80 00
	0, 1, 6, 1, //00 01 06 01
	0, 0, 0, 0, //00 00 00 00
	0, 232, 28, 0 //00 e8 1c 00
];

console.log('cpt', cpt);
console.log('probablePT', probablePt);
*/

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base = __webpack_require__(1);

var _Base2 = _interopRequireDefault(_Base);

var _WordArray = __webpack_require__(0);

var _WordArray2 = _interopRequireDefault(_WordArray);

var _hmac = __webpack_require__(11);

var _hmac2 = _interopRequireDefault(_hmac);

var _sha = __webpack_require__(13);

var _sha2 = _interopRequireDefault(_sha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PBKDF2 = function () {
	function PBKDF2() {
		_classCallCheck(this, PBKDF2);
	}

	_createClass(PBKDF2, [{
		key: 'algo',
		value: function algo() {
			return new _Base2.default().extend({
				/**
     * Configuration options.
     *
     * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
     * @property {Hasher} hasher The hasher to use. Default: SHA1
     * @property {number} iterations The number of iterations to perform. Default: 1
     */
				cfg: new _Base2.default().extend({
					keySize: 128 / 32,
					hasher: new _sha2.default().algo(),
					iterations: 1
				}),

				/**
     * Initializes a newly created key derivation function.
     *
     * @param {Object} cfg (Optional) The configuration options to use for the derivation.
     *
     * @example
     *
     *     var kdf = CryptoJS.algo.PBKDF2.create();
     *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
     *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
     */
				init: function init(cfg) {
					this.cfg = this.cfg.extend(cfg);
				},

				/**
     * Computes the Password-Based Key Derivation Function 2.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     *
     * @return {WordArray} The derived key.
     *
     * @example
     *
     *     var key = kdf.compute(password, salt);
     */
				compute: function compute(password, salt) {
					// Shortcut
					var cfg = this.cfg;

					// Init HMAC
					var hmac = new _hmac2.default().algo().create(cfg.hasher, password);

					// Initial values
					var derivedKey = new _WordArray2.default().create();
					var blockIndex = new _WordArray2.default().create([0x00000001]);

					// Shortcuts
					var derivedKeyWords = derivedKey.words;
					var blockIndexWords = blockIndex.words;
					var keySize = cfg.keySize;
					var iterations = cfg.iterations;

					// Generate key
					while (derivedKeyWords.length < keySize) {
						var block = hmac.update(salt).finalize(blockIndex);
						hmac.reset();

						// Shortcuts
						var blockWords = block.words;
						var blockWordsLength = blockWords.length;

						// Iterations
						var intermediate = block;
						for (var i = 1; i < iterations; i++) {
							intermediate = hmac.finalize(intermediate);
							hmac.reset();

							// Shortcut
							var intermediateWords = intermediate.words;

							// XOR intermediate with block
							for (var j = 0; j < blockWordsLength; j++) {
								blockWords[j] ^= intermediateWords[j];
							}
						}

						derivedKey.concat(block);
						blockIndexWords[0]++;
					}
					derivedKey.sigBytes = keySize * 4;

					return derivedKey;
				}
			});
		}
	}]);

	return PBKDF2;
}();

exports.default = PBKDF2;

/***/ })
/******/ ]);