import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
			},
			width: {
				paragraph: 'min(70ch, 100% - 2rem)'
			},
			colors: {
				primary: {
					100: 'hsl(245, 100%, 95%)',
					200: 'hsl(245, 100%, 90%)',
					300: 'hsl(244, 100%, 85%)',
					400: 'hsl(244, 100%, 80%)',
					500: 'hsl(244, 100%, 75%)',
					600: 'hsl(244, 50%, 60%)',
					700: 'hsl(244, 34%, 45%)',
					800: 'hsl(245, 34%, 30%)',
					900: 'hsl(245, 34%, 15%)'
				},
				secondary: {
					100: 'hsl(40, 100%, 91%)',
					200: 'hsl(40, 100%, 83%)',
					300: 'hsl(40, 100%, 74%)',
					400: 'hsl(40, 100%, 65%)',
					500: 'hsl(40, 100%, 56%)',
					600: 'hsl(40, 77%, 45%)',
					700: 'hsl(40, 78%, 34%)',
					800: 'hsl(40, 77%, 23%)',
					900: 'hsl(40, 79%, 11%)'
				},
				neutral: {
					100: 'hsl(0 0% 100%)',
					200: 'hsl(0 0% 94%)',
					300: 'hsl(240, 14%, 42%)',
					400: 'hsl(240, 19%, 45%)',
					500: 'hsl(240, 19%, 55%)',
					600: 'hsl(240, 5%, 13%)',
					700: 'hsl(240, 6%, 7%)',
					800: 'hsl(240, 5%, 4%)',
					900: 'hsl(0 0% 0%)'
				},
				semantic: {
					success: 'hsl(148, 100%, 50%)',
					// danger: 'hsl(0, 100%, 63%)'
					danger: 'hsl(0, 100%, 68%)'
				}
			},
			fontFamily: {
				inherit: 'inherit'
			},
			screens: {
				small: '30em',
				medium: '45em',
				large: '65em'
			}
		}
	},
	plugins: []
}

export default config
