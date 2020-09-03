import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
	input: 'dist/service-worker.js',
	output: {
		dir: 'dist',
		format: 'cjs',
		minifyInternalExports: true,
		compact: true,
		inlineDynamicImports: true,
	},
	plugins: [
		nodeResolve(),
		terser(),
	],
};
