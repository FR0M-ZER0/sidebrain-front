/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				background: '#F8F9FC',
				foreground: '#151D32',
				primary: '#0056C8',
				'primary-soft': '#EEF1FF',
				'progress-track': '#D9E2FF',
				muted: '#41495B',
			},
		},
	},
	plugins: [],
}
