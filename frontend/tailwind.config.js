module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			gridTemplateRows: {
				20: 'repeat(20, minmax(0, 1fr))',
				25: 'repeat(25, minmax(0, 1fr))',
			},
		},
	},
	plugins: [],
}
