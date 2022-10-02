/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'primary' : '#FFC639',
				'secondary' : '#881226',
				'info' : '#F13D9E',
				'sky' : "#32B7E8",
				'dark' : "#151515"
			  }
		},
	},
	plugins: [],
}
