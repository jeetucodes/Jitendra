import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					light: 'hsl(275, 95%, 85%)',
					dark: 'hsl(275, 95%, 60%)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				code: {
					lilac: '#BA68FF',
					lilacBright: '#D395FF', 
					blue: '#65B2FF',
					blueBright: '#89C6FF',
					green: '#3ECAA6',
					greenBright: '#6EDDC1',
					pink: '#FF6B9F',
					pinkBright: '#FF8DB7',
					yellow: '#FFCB6B',
					cyan: '#5CE1E6',
					purple: '#9B87F5',
					violet: '#A78BFA',
					indigo: '#7679FF',
				}
			},
			fontFamily: {
				sans: ['Montserrat', 'Inter', 'sans-serif'],
				serif: ['Playfair Display', 'serif'],
				display: ['Italiana', 'serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'scale-up': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				'rotate-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'matrix-flow': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100%)' },
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '1', boxShadow: '0 0 15px rgba(59, 130, 246, 0.7)' },
					'50%': { opacity: '0.7', boxShadow: '0 0 30px rgba(59, 130, 246, 0.9)' },
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'25%': { transform: 'translateY(-5px) rotate(1deg)' },
					'75%': { transform: 'translateY(5px) rotate(-1deg)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-100% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 15px 2px rgba(59, 130, 246, 0.4)' },
					'50%': { boxShadow: '0 0 20px 5px rgba(59, 130, 246, 0.7)' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'fade-in': 'fade-in 0.8s ease-out forwards',
				'fade-in-left': 'fade-in-left 0.8s ease-out forwards',
				'fade-in-right': 'fade-in-right 0.8s ease-out forwards',
				'scale-up': 'scale-up 0.8s ease-out forwards',
				'rotate-slow': 'rotate-slow 30s linear infinite',
				'matrix-flow': 'matrix-flow 8s linear infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'float-slow': 'float-slow 7s ease-in-out infinite',
				'shimmer': 'shimmer 8s infinite linear',
				'glow-pulse': 'glow-pulse 3s infinite ease-in-out',
			},
			transitionTimingFunction: {
				'bounce-in-out': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
				'smooth-in': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'circuit-pattern': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M20 70 L30 70 L30 30 L60 30 L60 50 L40 50\" stroke=\"%233B82F622\" stroke-width=\"1\" fill=\"none\"/%3E%3Ccircle cx=\"20\" cy=\"70\" r=\"3\" fill=\"%233B82F622\"/%3E%3Ccircle cx=\"40\" cy=\"50\" r=\"3\" fill=\"%233B82F622\"/%3E%3C/svg%3E')",
				'grid-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0 L60 0 L60 60 L0 60 Z\" stroke=\"%233B82F611\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M15 0 L15 60\" stroke=\"%233B82F609\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M30 0 L30 60\" stroke=\"%233B82F609\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M45 0 L45 60\" stroke=\"%233B82F609\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M0 15 L60 15\" stroke=\"%233B82F609\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M0 30 L60 30\" stroke=\"%233B82F609\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M0 45 L60 45\" stroke=\"%233B82F609\" stroke-width=\"0.5\" fill=\"none\"/%3E%3C/svg%3E')",
				'coderain': 'linear-gradient(180deg, rgba(59, 130, 246, 0.15) 0%, rgba(105, 174, 255, 0.15) 100%)',
				'tech-grid': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0 L100 0 L100 100 L0 100 Z\" stroke=\"%233B82F611\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M25 0 L25 100\" stroke=\"%233B82F608\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M50 0 L50 100\" stroke=\"%233B82F608\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M75 0 L75 100\" stroke=\"%233B82F608\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M0 25 L100 25\" stroke=\"%233B82F608\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M0 50 L100 50\" stroke=\"%233B82F608\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M0 75 L100 75\" stroke=\"%233B82F608\" stroke-width=\"0.5\" fill=\"none\"/%3E%3C/svg%3E')",
			},
			boxShadow: {
				'accent-glow': '0 0 15px rgba(59, 130, 246, 0.5)',
				'accent-glow-lg': '0 0 30px rgba(59, 130, 246, 0.7)',
				'neon': '0 0 5px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
				'neon-lg': '0 0 10px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
