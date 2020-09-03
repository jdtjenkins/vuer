import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
	input: 'dist\\service-worker.js',
	output: {
		file: 'dist\\service-worker.js',
		format: 'umd',
		minifyInternalExports: true,
		compact: true,
		inlineDynamicImports: true,
	},
	plugins: [
		nodeResolve(),
		terser(),
	],
};
