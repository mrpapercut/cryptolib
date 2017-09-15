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
