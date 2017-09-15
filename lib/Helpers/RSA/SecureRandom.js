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
