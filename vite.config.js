import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		basicSsl(),
	],
	base: '/vuer/',
	server: {
		port: 3000,
		https: true,
		cors: true,
		host: 'localhost',
	},
	build: {
		outDir: 'dist',
	}
})
