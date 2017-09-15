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
