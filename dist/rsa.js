require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// prng4.js - uses Arcfour as a PRNG
class Arcfour {
	constructor() {
		this.i = 0;
		this.j = 0;
		this.S = new Array();
	}

	// Initialize arcfour context from key, an array of ints, each from [0..255]
	init(key) {
		var i, j, t;
		for(i = 0; i < 256; ++i) this.S[i] = i;

		j = 0;

		for(i = 0; i < 256; ++i) {
			j = (j + this.S[i] + key[i % key.length]) & 255;
			t = this.S[i];
			this.S[i] = this.S[j];
			this.S[j] = t;
		}

		this.i = 0;
		this.j = 0;
	}

	next() {
		var t;
		this.i = (this.i + 1) & 255;
		this.j = (this.j + this.S[this.i]) & 255;
		t = this.S[this.i];
		this.S[this.i] = this.S[this.j];
		this.S[this.j] = t;

		return this.S[(t + this.S[this.i]) & 255];
	}
}

module.exports = Arcfour;

},{}],2:[function(require,module,exports){
const BigInteger = require('./BigInteger');

// Barrett modular reduction
class Barrett {
	constructor(m) {
		// setup Barrett
		this.r2 = nbi();
		this.q3 = nbi();
		var r = new BigInteger()._newInstanceFromInt(1);
		r.dlShiftTo(2 * m.t, this.r2);
		this.mu = this.r2.divide(m);
		this.m = m;
	}

	convert(x) {
		if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
		else if(x.compareTo(this.m) < 0) return x;
		else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
	}

	revert(x) {
		return x;
	}

	// x = x mod m (HAC 14.42)
	reduce(x) {
		x.drShiftTo(this.m.t-1,this.r2);
		if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
		this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
		this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
		while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
		x.subTo(this.r2,x);
		while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
	}

	// r = x^2 mod m; x != r
	sqrTo(x,r) {
		x.squareTo(r);
		this.reduce(r);
	}

	// r = x*y mod m; x,y != r
	mulTo(x, y, r) {
		x.multiplyTo(y, r);
		this.reduce(r);
	}
}

module.exports = Barrett;

},{"./BigInteger":3}],3:[function(require,module,exports){
const Barrett    = require('./Barrett');
const Classic    = require('./Classic');
const Montgomery = require('./Montgomery');
const NullExp    = require('./NullExp');

// Maybe cleanup

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c==null)?-1:c;
}

// returns bit length of the integer x
function nbits(x) {
	var r = 1,
		t;
	if ((t = x >>> 16) != 0) {
		x = t;
		r += 16;
	}
	if ((t = x >> 8) != 0) {
		x = t;
		r += 8;
	}
	if ((t = x >> 4) != 0) {
		x = t;
		r += 4;
	}
	if ((t = x >> 2) != 0) {
		x = t;
		r += 2;
	}
	if ((t = x >> 1) != 0) {
		x = t;
		r += 1;
	}
	return r;
}

class BigInteger {
	constructor(a, b, c) {
		this.DB = 28;
		this.DM = ((1 << this.DB) - 1);
		this.DV = (1 << this.DB);

		this.BI_FP = 52;
		this.FV = Math.pow(2, this.BI_FP);
		this.F1 = this.BI_FP - this.DB;
		this.F2 = 2 * this.DB - this.BI_FP;

		if(a != null) {
			if("number" == typeof a) {
				this.fromNumber(a,b,c);
			} else if(b == null && "string" != typeof a) {
				this.fromString(a,256);
			} else {
				this.fromString(a,b);
			}
		}
	}

	// AKA function nbi() { }
	_newInstance() {
		return new BigInteger(null);
	}

	// AKA this.nbv()
	_newInstanceFromInt(i) {
		var r = this._newInstance();
		r.fromInt(i);
		return r;
	}

	// am: Compute w_j += (x*this_i), propagate carries,
	// c is initial carry, returns final carry.
	// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
	am(i, x, w, j, c, n) {
		var xl = x & 0x3fff,
			xh = x >> 14;
		while (--n >= 0) {
			var l = this[i] & 0x3fff;
			var h = this[i++] >> 14;
			var m = xh * l + h * xl;
			l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
			c = (l >> 28) + (m >> 14) + xh * h;
			w[j++] = l & 0xfffffff;
		}
		return c;
	}

	// (protected) copy this to r
	copyTo(r) {
		for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
		r.t = this.t;
		r.s = this.s;
	}

	// (protected) set from integer value x, -DV <= x < DV
	fromInt(x) {
		this.t = 1;
		this.s = (x < 0) ? -1 : 0;
		if (x > 0) this[0] = x;
		else if (x < -1) this[0] = x + this.DV;
		else this.t = 0;
	}

	// (protected) set from string and radix
	fromString(s, b) {
		var k;
		if (b == 16) k = 4;
		else if (b == 8) k = 3;
		else if (b == 256) k = 8; // byte array
		else if (b == 2) k = 1;
		else if (b == 32) k = 5;
		else if (b == 4) k = 2;
		else {
			this.fromRadix(s, b);
			return;
		}
		this.t = 0;
		this.s = 0;
		var i = s.length,
			mi = false,
			sh = 0;
		while (--i >= 0) {
			var x = (k == 8) ? s[i] & 0xff : intAt(s, i);
			if (x < 0) {
				if (s.charAt(i) == "-") mi = true;
				continue;
			}
			mi = false;
			if (sh == 0)
				this[this.t++] = x;
			else if (sh + k > this.DB) {
				this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
				this[this.t++] = (x >> (this.DB - sh));
			} else
				this[this.t - 1] |= x << sh;
			sh += k;
			if (sh >= this.DB) sh -= this.DB;
		}
		if (k == 8 && (s[0] & 0x80) != 0) {
			this.s = -1;
			if (sh > 0) this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
		}

		this.clamp();
		if (mi) this._newInstanceFromInt(0).subTo(this, this);
	}

	// (protected) clamp off excess high words
	clamp() {
		var c = this.s & this.DM;
		while (this.t > 0 && this[this.t - 1] == c) --this.t;
	}

	// (protected) r = this << n*DB
	dlShiftTo(n, r) {
		var i;
		for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
		for (i = n - 1; i >= 0; --i) r[i] = 0;
		r.t = this.t + n;
		r.s = this.s;
	}

	// (protected) r = this << n
	drShiftTo(n, r) {
		for (var i = n; i < this.t; ++i) r[i - n] = this[i];
		r.t = Math.max(this.t - n, 0);
		r.s = this.s;
	}

	// (protected) r = this << n
	lShiftTo(n, r) {
		var bs = n % this.DB;
		var cbs = this.DB - bs;
		var bm = (1 << cbs) - 1;
		var ds = Math.floor(n / this.DB),
			c = (this.s << bs) & this.DM,
			i;
		for (i = this.t - 1; i >= 0; --i) {
			r[i + ds + 1] = (this[i] >> cbs) | c;
			c = (this[i] & bm) << bs;
		}
		for (i = ds - 1; i >= 0; --i) r[i] = 0;
		r[ds] = c;
		r.t = this.t + ds + 1;
		r.s = this.s;
		r.clamp();
	}

	// (protected) r = this >> n
	rShiftTo(n, r) {
		r.s = this.s;
		var ds = Math.floor(n / this.DB);
		if (ds >= this.t) {
			r.t = 0;
			return;
		}
		var bs = n % this.DB;
		var cbs = this.DB - bs;
		var bm = (1 << bs) - 1;
		r[0] = this[ds] >> bs;
		for (var i = ds + 1; i < this.t; ++i) {
			r[i - ds - 1] |= (this[i] & bm) << cbs;
			r[i - ds] = this[i] >> bs;
		}
		if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
		r.t = this.t - ds;
		r.clamp();
	}

	// (protected) r = this - a
	subTo(a, r) {
		var i = 0,
			c = 0,
			m = Math.min(a.t, this.t);
		while (i < m) {
			c += this[i] - a[i];
			r[i++] = c & this.DM;
			c >>= this.DB;
		}
		if (a.t < this.t) {
			c -= a.s;
			while (i < this.t) {
				c += this[i];
				r[i++] = c & this.DM;
				c >>= this.DB;
			}
			c += this.s;
		} else {
			c += this.s;
			while (i < a.t) {
				c -= a[i];
				r[i++] = c & this.DM;
				c >>= this.DB;
			}
			c -= a.s;
		}
		r.s = (c < 0) ? -1 : 0;
		if (c < -1) r[i++] = this.DV + c;
		else if (c > 0) r[i++] = c;
		r.t = i;
		r.clamp();
	}

	// (protected) r = this * a, r != this,a (HAC 14.12)
	// "this" should be the larger one if appropriate.
	multiplyTo(a, r) {
		var x = this.abs(),
			y = a.abs();
		var i = x.t;
		r.t = i + y.t;
		while (--i >= 0) r[i] = 0;
		for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
		r.s = 0;
		r.clamp();
		if (this.s != a.s) this._newInstanceFromInt(0).subTo(r, r);
	}

	// (protected) r = this^2, r != this (HAC 14.16)
	squareTo(r) {
		var x = this.abs();
		var i = r.t = 2 * x.t;
		while (--i >= 0) r[i] = 0;
		for (i = 0; i < x.t - 1; ++i) {
			var c = x.am(i, x[i], r, 2 * i, 0, 1);
			if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
				r[i + x.t] -= x.DV;
				r[i + x.t + 1] = 1;
			}
		}
		if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
		r.s = 0;
		r.clamp();
	}

	// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
	// r != q, this != m.  q or r may be null.
	divRemTo(m, q, r) {
		var pm = m.abs();
		if (pm.t <= 0) return;
		var pt = this.abs();
		if (pt.t < pm.t) {
			if (q != null) q.fromInt(0);
			if (r != null) this.copyTo(r);
			return;
		}
		if (r == null) r = this._newInstance();
		var y = this._newInstance(),
			ts = this.s,
			ms = m.s;
		var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
		if (nsh > 0) {
			pm.lShiftTo(nsh, y);
			pt.lShiftTo(nsh, r);
		} else {
			pm.copyTo(y);
			pt.copyTo(r);
		}
		var ys = y.t;
		var y0 = y[ys - 1];
		if (y0 == 0) return;
		var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
		var d1 = this.FV / yt,
			d2 = (1 << this.F1) / yt,
			e = 1 << this.F2;
		var i = r.t,
			j = i - ys,
			t = (q == null) ? this._newInstance() : q;
		y.dlShiftTo(j, t);
		if (r.compareTo(t) >= 0) {
			r[r.t++] = 1;
			r.subTo(t, r);
		}
		this._newInstanceFromInt(1).dlShiftTo(ys, t);
		t.subTo(y, y); // "negative" y so we can replace sub with am later
		while (y.t < ys) y[y.t++] = 0;
		while (--j >= 0) {
			// Estimate quotient digit
			var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
			if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
				y.dlShiftTo(j, t);
				r.subTo(t, r);
				while (r[i] < --qd) r.subTo(t, r);
			}
		}
		if (q != null) {
			r.drShiftTo(ys, q);
			if (ts != ms) this._newInstanceFromInt(0).subTo(q, q);
		}
		r.t = ys;
		r.clamp();
		if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
		if (ts < 0) this._newInstanceFromInt(0).subTo(r, r);
	}

	// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
	// justification:
	//         xy == 1 (mod m)
	//         xy =  1+km
	//   xy(2-xy) = (1+km)(1-km)
	// x[y(2-xy)] = 1-k^2m^2
	// x[y(2-xy)] == 1 (mod m^2)
	// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
	// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
	// JS multiply "overflows" differently from C/C++, so care is needed here.
	invDigit() {
		if (this.t < 1) return 0;
		var x = this[0];
		if ((x & 1) == 0) return 0;
		var y = x & 3; // y == 1/x mod 2^2
		y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
		y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
		y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
		// last step - calculate inverse mod DV directly;
		// assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
		y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
		// we really want the negative inverse, and -DV < y < DV
		return (y > 0) ? this.DV - y : -y;
	}

	// (protected) true if this is even, false if I can't even
	isEven() {
		return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
	}

	// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
	exp(e, z) {
		if (e > 0xffffffff || e < 1) return this._newInstanceFromInt(1);
		var r = this._newInstance(),
			r2 = this._newInstance(),
			g = z.convert(this),
			i = nbits(e) - 1;
		g.copyTo(r);
		while (--i >= 0) {
			z.sqrTo(r, r2);
			if ((e & (1 << i)) > 0) z.mulTo(r2, g, r);
			else {
				var t = r;
				r = r2;
				r2 = t;
			}
		}
		return z.revert(r);
	}

	// (protected) return x s.t. r^x < DV
	chunkSize(r) {
		return Math.floor(Math.LN2 * this.DB / Math.log(r));
	}

	// (protected) convert to radix string
	toRadix(b) {
		if (b == null) b = 10;
		if (this.signum() == 0 || b < 2 || b > 36) return "0";
		var cs = this.chunkSize(b);
		var a = Math.pow(b, cs);
		var d = this._newInstanceFromInt(a),
			y = nbi(),
			z = nbi(),
			r = "";
		this.divRemTo(d, y, z);
		while (y.signum() > 0) {
			r = (a + z.intValue()).toString(b).substr(1) + r;
			y.divRemTo(d, y, z);
		}
		return z.intValue().toString(b) + r;
	}

	// (protected) convert from radix string
	fromRadix(s, b) {
		this.fromInt(0);
		if (b == null) b = 10;
		var cs = this.chunkSize(b);
		var d = Math.pow(b, cs),
			mi = false,
			j = 0,
			w = 0;
		for (var i = 0; i < s.length; ++i) {
			var x = intAt(s, i);
			if (x < 0) {
				if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
				continue;
			}
			w = b * w + x;
			if (++j >= cs) {
				this.dMultiply(d);
				this.dAddOffset(w, 0);
				j = 0;
				w = 0;
			}
		}
		if (j > 0) {
			this.dMultiply(Math.pow(b, j));
			this.dAddOffset(w, 0);
		}
		if (mi) ZERO.subTo(this, this);
	}

	// (protected) alternate constructor
	fromNumber(a, b, c) {
		if ("number" == typeof b) {
			// new BigInteger(int,int,RNG)
			if (a < 2) this.fromInt(1);
			else {
				this.fromNumber(a, c);
				if (!this.testBit(a - 1)) // force MSB set
					this.bitwiseTo(ONE.shiftLeft(a - 1), op_or, this);
				if (this.isEven()) this.dAddOffset(1, 0); // force odd
				while (!this.isProbablePrime(b)) {
					this.dAddOffset(2, 0);
					if (this.bitLength() > a) this.subTo(ONE.shiftLeft(a - 1), this);
				}
			}
		} else {
			// new BigInteger(int,RNG)
			var x = new Array(),
				t = a & 7;
			x.length = (a >> 3) + 1;
			b.nextBytes(x);
			if (t > 0) x[0] &= ((1 << t) - 1);
			else x[0] = 0;
			this.fromString(x, 256);
		}
	}

	// (protected) r = this op a (bitwise)
	bitwiseTo(a, op, r) {
		var i, f, m = Math.min(a.t, this.t);
		for (i = 0; i < m; ++i) r[i] = op(this[i], a[i]);
		if (a.t < this.t) {
			f = a.s & this.DM;
			for (i = m; i < this.t; ++i) r[i] = op(this[i], f);
			r.t = this.t;
		} else {
			f = this.s & this.DM;
			for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);
			r.t = a.t;
		}
		r.s = op(this.s, a.s);
		r.clamp();
	}

	// (protected) this op (1<<n)
	changeBit(n, op) {
		var r = ONE.shiftLeft(n);
		this.bitwiseTo(r, op, r);
		return r;
	}

	// (protected) r = this + a
	addTo(a, r) {
		var i = 0,
			c = 0,
			m = Math.min(a.t, this.t);
		while (i < m) {
			c += this[i] + a[i];
			r[i++] = c & this.DM;
			c >>= this.DB;
		}
		if (a.t < this.t) {
			c += a.s;
			while (i < this.t) {
				c += this[i];
				r[i++] = c & this.DM;
				c >>= this.DB;
			}
			c += this.s;
		} else {
			c += this.s;
			while (i < a.t) {
				c += a[i];
				r[i++] = c & this.DM;
				c >>= this.DB;
			}
			c += a.s;
		}
		r.s = (c < 0) ? -1 : 0;
		if (c > 0) r[i++] = c;
		else if (c < -1) r[i++] = this.DV + c;
		r.t = i;
		r.clamp();
	}

	// (protected) this *= n, this >= 0, 1 < n < DV
	dMultiply(n) {
		this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
		++this.t;
		this.clamp();
	}

	// (protected) this += n << w words, this >= 0
	dAddOffset(n, w) {
		if (n == 0) return;
		while (this.t <= w) this[this.t++] = 0;
		this[w] += n;
		while (this[w] >= this.DV) {
			this[w] -= this.DV;
			if (++w >= this.t) this[this.t++] = 0;
			++this[w];
		}
	}

	// (protected) r = lower n words of "this * a", a.t <= n
	// "this" should be the larger one if appropriate.
	multiplyLowerTo(a, n, r) {
		var i = Math.min(this.t + a.t, n);
		r.s = 0; // assumes a,this >= 0
		r.t = i;
		while (i > 0) r[--i] = 0;
		var j;
		for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
		for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i);
		r.clamp();
	}

	// (protected) r = "this * a" without lower n words, n > 0
	// "this" should be the larger one if appropriate.
	multiplyUpperTo(a, n, r) {
		--n;
		var i = r.t = this.t + a.t - n;
		r.s = 0; // assumes a,this >= 0
		while (--i >= 0) r[i] = 0;
		for (i = Math.max(n - this.t, 0); i < a.t; ++i)
			r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
		r.clamp();
		r.drShiftTo(1, r);
	}

	// (protected) this % n, n < 2^26
	modInt(n) {
		if (n <= 0) return 0;
		var d = this.DV % n,
			r = (this.s < 0) ? n - 1 : 0;
		if (this.t > 0)
			if (d == 0) r = this[0] % n;
			else
				for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
		return r;
	}

	// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
	millerRabin(t) {
		var n1 = this.subtract(ONE);
		var k = n1.getLowestSetBit();
		if (k <= 0) return false;
		var r = n1.shiftRight(k);
		t = (t + 1) >> 1;
		if (t > lowprimes.length) t = lowprimes.length;
		var a = nbi();
		for (var i = 0; i < t; ++i) {
			//Pick bases at random, instead of starting at 2
			a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
			var y = a.modPow(r, this);
			if (y.compareTo(ONE) != 0 && y.compareTo(n1) != 0) {
				var j = 1;
				while (j++ < k && y.compareTo(n1) != 0) {
					y = y.modPowInt(2, this);
					if (y.compareTo(ONE) == 0) return false;
				}
				if (y.compareTo(n1) != 0) return false;
			}
		}
		return true;
	}

	// PUBLIC FUNCTIONS

	// (public) return string representation in given radix
	toString(b) {
		if (this.s < 0) return "-" + this.negate().toString(b);
		var k;
		if (b == 16) k = 4;
		else if (b == 8) k = 3;
		else if (b == 2) k = 1;
		else if (b == 32) k = 5;
		else if (b == 4) k = 2;
		else return this.toRadix(b);
		var km = (1 << k) - 1,
			d, m = false,
			r = "",
			i = this.t;
		var p = this.DB - (i * this.DB) % k;
		if (i-- > 0) {
			if (p < this.DB && (d = this[i] >> p) > 0) {
				m = true;
				r = int2char(d);
			}
			while (i >= 0) {
				if (p < k) {
					d = (this[i] & ((1 << p) - 1)) << (k - p);
					d |= this[--i] >> (p += this.DB - k);
				} else {
					d = (this[i] >> (p -= k)) & km;
					if (p <= 0) {
						p += this.DB;
						--i;
					}
				}
				if (d > 0) m = true;
				if (m) r += int2char(d);
			}
		}
		return m ? r : "0";
	}

	// (public) -this
	negate() {
		var r = this._newInstance();
		this._newInstanceFromInt(0).subTo(this, r);
		return r;
	}

	// (public) |this|
	abs() {
		return (this.s < 0) ? this.negate() : this;
	}

	// (public) return + if this > a, - if this < a, 0 if equal
	compareTo(a) {
		var r = this.s - a.s;
		if (r != 0) return r;
		var i = this.t;
		r = i - a.t;
		if (r != 0) return (this.s < 0) ? -r : r;
		while (--i >= 0)
			if ((r = this[i] - a[i]) != 0) return r;
		return 0;
	}

	// (public) return the number of bits in "this"
	bitLength() {
		if (this.t <= 0) return 0;
		return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
	}

	// (public) this mod a
	mod(a) {
		var r = this._newInstance();
		this.abs().divRemTo(a, null, r);
		if (this.s < 0 && r.compareTo(this._newInstanceFromInt(0)) > 0) a.subTo(r, r);
		return r;
	}

	// (public) this^e % m, 0 <= e < 2^32
	modPowInt(e, m) {
		var z;
		if (e < 256 || m.isEven()) z = new Classic(m);
		else z = new Montgomery(m);
		return this.exp(e, z);
	}

	// (public)
	clone() {
		var r = this._newInstance();
		this.copyTo(r);
		return r;
	}

	// (public) return value as integer
	intValue() {
		if (this.s < 0) {
			if (this.t == 1) return this[0] - this.DV;
			else if (this.t == 0) return -1;
		} else if (this.t == 1) return this[0];
		else if (this.t == 0) return 0;
		// assumes 16 < DB < 32
		return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
	}

	// (public) return value as byte
	byteValue() {
		return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
	}

	// (public) return value as short (assumes DB>=16)
	shortValue() {
		return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
	}

	// (public) 0 if this == 0, 1 if this > 0
	sigNum() {
		if (this.s < 0) return -1;
		else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
		else return 1;
	}

	// (public) convert to bigendian byte array
	toByteArray() {
		var i = this.t,
			r = new Array();
		r[0] = this.s;
		var p = this.DB - (i * this.DB) % 8,
			d, k = 0;
		if (i-- > 0) {
			if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p)
				r[k++] = d | (this.s << (this.DB - p));
			while (i >= 0) {
				if (p < 8) {
					d = (this[i] & ((1 << p) - 1)) << (8 - p);
					d |= this[--i] >> (p += this.DB - 8);
				} else {
					d = (this[i] >> (p -= 8)) & 0xff;
					if (p <= 0) {
						p += this.DB;
						--i;
					}
				}
				if ((d & 0x80) != 0) d |= -256;
				if (k == 0 && (this.s & 0x80) != (d & 0x80)) ++k;
				if (k > 0 || d != this.s) r[k++] = d;
			}
		}
		return r;
	}

	equals(a) {
		return (this.compareTo(a) == 0);
	}

	min(a) {
		return (this.compareTo(a) < 0) ? this : a;
	}

	max(a) {
		return (this.compareTo(a) > 0) ? this : a;
	}

	// (public) this & a
	and(a) {
		const op_and = (x, y) => x & y;
		var r = this._newInstance();
		this.bitwiseTo(a, op_and, r);
		return r;
	}

	// (public) this | a
	or(a) {
		const op_or = (x, y) => x | y;
		var r = this._newInstance();
		this.bitwiseTo(a, op_or, r);
		return r;
	}

	// (public) this ^ a
	xor(a) {
		const op_xor = (x, y) => x ^ y;
		var r = this._newInstance();
		this.bitwiseTo(a, op_xor, r);
		return r;
	}

	// (public) this & ~a
	andNot(a) {
		const op_andnot = (x, y) => x & ~y;
		var r = this._newInstance();
		this.bitwiseTo(a, op_andnot, r);
		return r;
	}

	// (public) ~this
	not() {
		var r = this._newInstance();
		for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];
		r.t = this.t;
		r.s = ~this.s;
		return r;
	}

	// (public) this << n
	shiftLeft(n) {
		var r = this._newInstance();
		if (n < 0) this.rShiftTo(-n, r);
		else this.lShiftTo(n, r);
		return r;
	}

	// (public) this >> n
	shiftRight(n) {
		var r = this._newInstance();
		if (n < 0) this.lShiftTo(-n, r);
		else this.rShiftTo(n, r);
		return r;
	}

	// (public) returns index of lowest 1-bit (or -1 if none)
	getLowestSetBit() {
		// return index of lowest 1-bit in x, x < 2^31
		const lbit = x => {
			if (x == 0) return -1;
			var r = 0;
			if ((x & 0xffff) == 0) {
				x >>= 16;
				r += 16;
			}
			if ((x & 0xff) == 0) {
				x >>= 8;
				r += 8;
			}
			if ((x & 0xf) == 0) {
				x >>= 4;
				r += 4;
			}
			if ((x & 3) == 0) {
				x >>= 2;
				r += 2;
			}
			if ((x & 1) == 0) ++r;
			return r;
		}

		for (var i = 0; i < this.t; ++i)
			if (this[i] != 0) return i * this.DB + lbit(this[i]);
		if (this.s < 0) return this.t * this.DB;
		return -1;
	}

	// (public) return number of set bits
	bitCount() {
		// return number of 1 bits in x
		const cbit = x => {
			var r = 0;
			while (x != 0) {
				x &= x - 1;
				++r;
			}
			return r;
		}

		var r = 0,
			x = this.s & this.DM;
		for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);
		return r;
	}

	// (public) true if nth bit is set
	testBit(n) {
		var j = Math.floor(n / this.DB);
		if (j >= this.t) return (this.s != 0);
		return ((this[j] & (1 << (n % this.DB))) != 0);
	}

	// (public) this | (1<<n)
	setBit(n) {
		const op_or = (x, y) => x | y;
		return this.changeBit(n, op_or);
	}

	// (public) this & ~(1<<n)
	clearBit(n) {
		const op_andnot = (x, y) => x & ~y;
		return this.changeBit(n, op_andnot);
	}

	// (public) this ^ (1<<n)
	flipBit(n) {
		const op_xor = (x, y) => x ^ y;
		return this.changeBit(n, op_xor);
	}

	// (public) this + a
	add(a) {
		var r = this._newInstance();
		this.addTo(a, r);
		return r;
	}

	// (public) this - a
	subtract(a) {
		var r = this._newInstance();
		this.subTo(a, r);
		return r;
	}

	// (public) this * a
	multiply(a) {
		var r = this._newInstance();
		this.multiplyTo(a, r);
		return r;
	}

	// (public) this^2
	square() {
		var r = this._newInstance();
		this.squareTo(r);
		return r;
	}

	// (public) this / a
	divide(a) {
		var r = this._newInstance();
		this.divRemTo(a, r, null);
		return r;
	}

	// (public) this % a
	remainder(a) {
		var r = this._newInstance();
		this.divRemTo(a, null, r);
		return r;
	}

	// (public) [this/a,this%a]
	divideAndRemainder(a) {
		var q = this._newInstance(),
			r = this._newInstance();
		this.divRemTo(a, q, r);
		return new Array(q, r);
	}

	// (public) this^e
	pow(e) {
		return this.exp(e, new NullExp());
	}

	// (public) this^e % m (HAC 14.85)
	modPow(e, m) {
		var i = e.bitLength(),
			k, r = this._newInstanceFromInt(1),
			z;
		if (i <= 0) return r;
		else if (i < 18) k = 1;
		else if (i < 48) k = 3;
		else if (i < 144) k = 4;
		else if (i < 768) k = 5;
		else k = 6;
		if (i < 8)
			z = new Classic(m);
		else if (m.isEven())
			z = new Barrett(m);
		else
			z = new Montgomery(m);

		// precomputation
		var g = new Array(),
			n = 3,
			k1 = k - 1,
			km = (1 << k) - 1;
		g[1] = z.convert(this);
		if (k > 1) {
			var g2 = this._newInstance();
			z.sqrTo(g[1], g2);
			while (n <= km) {
				g[n] = this._newInstance();
				z.mulTo(g2, g[n - 2], g[n]);
				n += 2;
			}
		}

		var j = e.t - 1,
			w, is1 = true,
			r2 = this._newInstance(),
			t;
		i = nbits(e[j]) - 1;
		while (j >= 0) {
			if (i >= k1) w = (e[j] >> (i - k1)) & km;
			else {
				w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
				if (j > 0) w |= e[j - 1] >> (this.DB + i - k1);
			}

			n = k;
			while ((w & 1) == 0) {
				w >>= 1;
				--n;
			}
			if ((i -= n) < 0) {
				i += this.DB;
				--j;
			}
			if (is1) { // ret == 1, don't bother squaring or multiplying it
				g[w].copyTo(r);
				is1 = false;
			} else {
				while (n > 1) {
					z.sqrTo(r, r2);
					z.sqrTo(r2, r);
					n -= 2;
				}
				if (n > 0) z.sqrTo(r, r2);
				else {
					t = r;
					r = r2;
					r2 = t;
				}
				z.mulTo(r2, g[w], r);
			}

			while (j >= 0 && (e[j] & (1 << i)) == 0) {
				z.sqrTo(r, r2);
				t = r;
				r = r2;
				r2 = t;
				if (--i < 0) {
					i = this.DB - 1;
					--j;
				}
			}
		}
		return z.revert(r);
	}

	// (public) 1/this % m (HAC 14.61)
	modInverse(m) {
		var ac = m.isEven();
		if ((this.isEven() && ac) || m.signum() == 0) return ZERO;
		var u = m.clone(),
			v = this.clone();
		var a = this._newInstanceFromInt(1),
			b = this._newInstanceFromInt(0),
			c = this._newInstanceFromInt(0),
			d = this._newInstanceFromInt(1);
		while (u.signum() != 0) {
			while (u.isEven()) {
				u.rShiftTo(1, u);
				if (ac) {
					if (!a.isEven() || !b.isEven()) {
						a.addTo(this, a);
						b.subTo(m, b);
					}
					a.rShiftTo(1, a);
				} else if (!b.isEven()) b.subTo(m, b);
				b.rShiftTo(1, b);
			}
			while (v.isEven()) {
				v.rShiftTo(1, v);
				if (ac) {
					if (!c.isEven() || !d.isEven()) {
						c.addTo(this, c);
						d.subTo(m, d);
					}
					c.rShiftTo(1, c);
				} else if (!d.isEven()) d.subTo(m, d);
				d.rShiftTo(1, d);
			}
			if (u.compareTo(v) >= 0) {
				u.subTo(v, u);
				if (ac) a.subTo(c, a);
				b.subTo(d, b);
			} else {
				v.subTo(u, v);
				if (ac) c.subTo(a, c);
				d.subTo(b, d);
			}
		}
		if (v.compareTo(ONE) != 0) return ZERO;
		if (d.compareTo(m) >= 0) return d.subtract(m);
		if (d.signum() < 0) d.addTo(m, d);
		else return d;
		if (d.signum() < 0) return d.add(m);
		else return d;
	}

	// (public) gcd(this,a) (HAC 14.54)
	gcd(a) {
		var x = (this.s < 0) ? this.negate() : this.clone();
		var y = (a.s < 0) ? a.negate() : a.clone();
		if (x.compareTo(y) < 0) {
			var t = x;
			x = y;
			y = t;
		}
		var i = x.getLowestSetBit(),
			g = y.getLowestSetBit();
		if (g < 0) return x;
		if (i < g) g = i;
		if (g > 0) {
			x.rShiftTo(g, x);
			y.rShiftTo(g, y);
		}
		while (x.signum() > 0) {
			if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
			if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
			if (x.compareTo(y) >= 0) {
				x.subTo(y, x);
				x.rShiftTo(1, x);
			} else {
				y.subTo(x, y);
				y.rShiftTo(1, y);
			}
		}
		if (g > 0) y.lShiftTo(g, y);
		return y;
	}

	// (public) test primality with certainty >= 1-.5^t
	isProbablePrime(t) {
		var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
		var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];

		var i, x = this.abs();
		if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
			for (i = 0; i < lowprimes.length; ++i)
				if (x[0] == lowprimes[i]) return true;
			return false;
		}
		if (x.isEven()) return false;
		i = 1;
		while (i < lowprimes.length) {
			var m = lowprimes[i],
				j = i + 1;
			while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
			m = x.modInt(m);
			while (i < j)
				if (m % lowprimes[i++] == 0) return false;
		}
		return x.millerRabin(t);
	}
}

const ZERO = new BigInteger()._newInstanceFromInt(0);
const ONE = new BigInteger()._newInstanceFromInt(1);

module.exports = BigInteger;

},{"./Barrett":2,"./Classic":4,"./Montgomery":5,"./NullExp":6}],4:[function(require,module,exports){
// Modular reduction using "classic" algorithm

class Classic {
	constructor(m) {
		this.m = m;
	}

	convert(x) {
		if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
		else return x;
	}

	revert(x) {
		return x;
	}

	reduce(x) {
		x.divRemTo(this.m, null, x);
	}

	mulTo(x, y, r) {
		x.multiplyTo(y, r);
		this.reduce(r);
	}

	sqrTo(x, r) {
		x.squareTo(r);
		this.reduce(r);
	}
}

module.exports = Classic;

},{}],5:[function(require,module,exports){
const BigInteger2 = require('./BigInteger');

class Montgomery {
	constructor(m) {
		this.m = m;
		this.mp = m.invDigit();
		this.mpl = this.mp & 0x7fff;
		this.mph = this.mp >> 15;
		this.um = (1 << (m.DB - 15)) - 1;
		this.mt2 = 2 * m.t;
	}

	// xR mod m
	convert(x) {
		var r = x._newInstance(); // new BigInteger();
		x.abs().dlShiftTo(this.m.t, r);
		r.divRemTo(this.m, null, r);
		if (x.s < 0 && r.compareTo(r._newInstanceFromInt(0)) > 0) this.m.subTo(r, r);
		return r;
	}

	// x/R mod m
	revert(x) {
		var r = x._newInstance(); // new BigInteger();
		x.copyTo(r);
		this.reduce(r);
		return r;
	}

	// x = x/R mod m (HAC 14.32)
	reduce(x) {
		while (x.t <= this.mt2) // pad x so am has enough room later
			x[x.t++] = 0;
		for (var i = 0; i < this.m.t; ++i) {
			// faster way of calculating u0 = x[i]*mp mod DV
			var j = x[i] & 0x7fff;
			var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
			// use am to combine the multiply-shift-add into one call
			j = i + this.m.t;
			x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
			// propagate carry
			while (x[j] >= x.DV) {
				x[j] -= x.DV;
				x[++j]++;
			}
		}
		x.clamp();
		x.drShiftTo(this.m.t, x);
		if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
	}

	// r = "x^2/R mod m"; x != r
	sqrTo(x, r) {
		x.squareTo(r);
		this.reduce(r);
	}

	// r = "xy/R mod m"; x,y != r
	mulTo(x, y, r) {
		x.multiplyTo(y, r);
		this.reduce(r);
	}
}

module.exports = Montgomery;

},{"./BigInteger":3}],6:[function(require,module,exports){
// A "null" reducer
class NullExp {
	constructory() {
		this.nop = x => x;
		this.convert = this.nop;
		this.revert = this.nop;
	}

	mulTo(x, y, r) {
		x.multiplyTo(y, r);
	}

	sqrTo(x, r) {
		x.squareTo(r);
	}
}

module.exports = NullExp;

},{}],7:[function(require,module,exports){
// Originally rng.js

const Arcfour = require('./Arcfour'); // Originally prng4.js

// Random number generator - requires a PRNG backend, e.g. prng4.js
class SecureRandom {
	constructor() {
		this.rng_state = undefined;
		this.rng_pool = undefined;
		this.rng_pptr = undefined;

		// Pool size must be a multiple of 4 and greater than 32.
		// An array of bytes the size of the pool will be passed to init()
		this.rng_psize = 256;

		this.init();
	}

	init() {
		// Initialize the pool with junk if needed.
		if (this.rng_pool == null) {
			this.rng_pool = new Array();
			this.rng_pptr = 0;
			var t;

			if(window.crypto && window.crypto.getRandomValues) {
				// Use webcrypto if available
				var ua = new Uint8Array(32);
				window.crypto.getRandomValues(ua);
				for(t = 0; t < 32; ++t)
				this.rng_pool[this.rng_pptr++] = ua[t];
			}

			while(this.rng_pptr < this.rng_psize) {  // extract some randomness from Math.random()
				t = Math.floor(65536 * Math.random());
				this.rng_pool[this.rng_pptr++] = t >>> 8;
				this.rng_pool[this.rng_pptr++] = t & 255;
			}

			this.rng_pptr = 0;
			this.rng_seed_time();
		}
	}

	// Mix in a 32-bit integer into the pool
	rng_seed_int(x) {
		this.rng_pool[this.rng_pptr++] ^= x & 255;
		this.rng_pool[this.rng_pptr++] ^= (x >> 8) & 255;
		this.rng_pool[this.rng_pptr++] ^= (x >> 16) & 255;
		this.rng_pool[this.rng_pptr++] ^= (x >> 24) & 255;
		if(this.rng_pptr >= this.rng_psize) this.rng_pptr -= this.rng_psize;
	}

	// Mix in the current time (w/milliseconds) into the pool
	rng_seed_time() {
		this.rng_seed_int(new Date().getTime());
	}

	rng_get_byte() {
		if (this.rng_state == null) {
			this.rng_seed_time();
			this.rng_state = new Arcfour();
			this.rng_state.init(this.rng_pool);

			for(this.rng_pptr = 0; this.rng_pptr < this.rng_pool.length; ++this.rng_pptr)
				this.rng_pool[this.rng_pptr] = 0;
			this.rng_pptr = 0;
		}
		// TODO: allow reseeding after first request
		return this.rng_state.next();
	}

	nextBytes(ba) {
		var i;
		for(i = 0; i < ba.length; ++i) ba[i] = this.rng_get_byte();
	}
}

module.exports = SecureRandom;

},{"./Arcfour":1}],"RSAKey":[function(require,module,exports){
const BigInteger = require('../Helpers/RSA/BigInteger');
const SecureRandom  = require('../Helpers/RSA/SecureRandom');

const ZERO = new BigInteger().ZERO;
const ONE = new BigInteger().ONE;

class RSAKey {
	constructor() {
		this.n = null;
		this.e = 0;
		this.d = null;
		this.p = null;
		this.q = null;
		this.dmp1 = null;
		this.dmq1 = null;
		this.coeff = null;
	}

	parseBigInt(str, r) {
		return new BigInteger(str, r);
	}

	// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
	pkcs1pad2(s, n) {
		if (n < s.length + 11) { // TODO: fix for utf-8
			console.error("Message too long for RSA");
			return null;
		}
		var ba = new Array();
		var i = s.length - 1;
		while (i >= 0 && n > 0) {
			var c = s.charCodeAt(i--);
			if (c < 128) { // encode using utf-8
				ba[--n] = c;
			} else if ((c > 127) && (c < 2048)) {
				ba[--n] = (c & 63) | 128;
				ba[--n] = (c >> 6) | 192;
			} else {
				ba[--n] = (c & 63) | 128;
				ba[--n] = ((c >> 6) & 63) | 128;
				ba[--n] = (c >> 12) | 224;
			}
		}
		ba[--n] = 0;
		var rng = new SecureRandom();
		var x = new Array();
		while (n > 2) { // random non-zero pad
			x[0] = 0;
			while (x[0] == 0) rng.nextBytes(x);
			ba[--n] = x[0];
		}
		ba[--n] = 2;
		ba[--n] = 0;
		return new BigInteger(ba);
	}

	// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
	pkcs1unpad2(d, n) {
		var b = d.toByteArray();
		var i = 0;
		while (i < b.length && b[i] == 0) ++i;
		if (b.length - i != n - 1 || b[i] != 2)
			return null;
		++i;
		while (b[i] != 0)
			if (++i >= b.length) return null;
		var ret = "";
		while (++i < b.length) {
			var c = b[i] & 255;
			if (c < 128) { // utf-8 decode
				ret += String.fromCharCode(c);
			} else if ((c > 191) && (c < 224)) {
				ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
				++i;
			} else {
				ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
				i += 2;
			}
		}
		return ret;
	}

	// Perform raw public operation on "x": return x^e (mod n)
	doPublic(x) {
		return x.modPowInt(this.e, this.n);
	}

	// Set the public key fields N and e from hex strings
	setPublic(N, E) {
		if (N != null && E != null && N.length > 0 && E.length > 0) {
			this.n = this.parseBigInt(N, 16);
			this.e = parseInt(E, 16);
		} else {
			console.error("Invalid RSA public key");
		}
	}

	// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
	encrypt(text) {
		var m = this.pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
		if (m == null) return null;

		var c = this.doPublic(m);
		if (c == null) return null;

		var h = c.toString(16);
		if ((h.length & 1) == 0) return h;
		else return "0" + h;
	}

	// Perform raw private operation on "x": return x^d (mod n)
	doPrivate(x) {
		if (this.p == null || this.q == null)
			return x.modPow(this.d, this.n);

		// TODO: re-calculate any missing CRT params
		var xp = x.mod(this.p).modPow(this.dmp1, this.p);
		var xq = x.mod(this.q).modPow(this.dmq1, this.q);

		while (xp.compareTo(xq) < 0)
			xp = xp.add(this.p);
		return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
	}

	// Set the private key fields N, e, and d from hex strings
	setPrivate(N, E, D) {
		if (N != null && E != null && N.length > 0 && E.length > 0) {
			this.n = this.parseBigInt(N, 16);
			this.e = parseInt(E, 16);
			this.d = this.parseBigInt(D, 16);
		} else
			console.error("Invalid RSA private key");
	}

	// Set the private key fields N, e, d and CRT params from hex strings
	setPrivateEx(N, E, D, P, Q, DP, DQ, C) {
		if (N != null && E != null && N.length > 0 && E.length > 0) {
			this.n = this.parseBigInt(N, 16);
			this.e = parseInt(E, 16);
			this.d = this.parseBigInt(D, 16);
			this.p = this.parseBigInt(P, 16);
			this.q = this.parseBigInt(Q, 16);
			this.dmp1 = this.parseBigInt(DP, 16);
			this.dmq1 = this.parseBigInt(DQ, 16);
			this.coeff = this.parseBigInt(C, 16);
		} else {
			// TODO: Fix errors
			console.error("Invalid RSA private key");
		}
	}

	// Generate a new random private key B bits long, using public expt E
	generate(B, E) {
		var rng = new SecureRandom();
		var qs = B >> 1;
		this.e = parseInt(E, 16);
		var ee = new BigInteger(E, 16);
		for (;;) {
			for (;;) {
				this.p = new BigInteger(B - qs, 1, rng);
				if (this.p.subtract(ONE).gcd(ee).compareTo(ONE) == 0 && this.p.isProbablePrime(10)) break;
			}
			for (;;) {
				this.q = new BigInteger(qs, 1, rng);
				if (this.q.subtract(ONE).gcd(ee).compareTo(ONE) == 0 && this.q.isProbablePrime(10)) break;
			}
			if (this.p.compareTo(this.q) <= 0) {
				var t = this.p;
				this.p = this.q;
				this.q = t;
			}
			var p1 = this.p.subtract(ONE);
			var q1 = this.q.subtract(ONE);
			var phi = p1.multiply(q1);
			if (phi.gcd(ee).compareTo(ONE) == 0) {
				this.n = this.p.multiply(this.q);
				this.d = ee.modInverse(phi);
				this.dmp1 = this.d.mod(p1);
				this.dmq1 = this.d.mod(q1);
				this.coeff = this.q.modInverse(this.p);
				break;
			}
		}
	}

	// Return the PKCS#1 RSA decryption of "ctext".
	// "ctext" is an even-length hex string and the output is a plain string.
	decrypt(ctext) {
		var c = this.parseBigInt(ctext, 16);
		var m = this.doPrivate(c);
		if (m == null) return null;
		return this.pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
	}
}

module.exports = RSAKey;

},{"../Helpers/RSA/BigInteger":3,"../Helpers/RSA/SecureRandom":7}]},{},[]);
