import closure from 'rollup-plugin-closure-compiler-js';

export default {
	input: 'lib/rollup/AES.js',
	output: {
		file: 'dist/AES.js',
		name: 'AES',
		format: 'iife'
	},
	name: 'AES',
	plugins: [
		/*closure({
			compilationLevel: 'ADVANCED'
		})*/
	]
}
