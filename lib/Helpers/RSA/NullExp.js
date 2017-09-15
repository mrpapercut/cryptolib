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
