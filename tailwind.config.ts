import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        turquoise: '#27D9CF',
        brand: '#27D9CF',
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
} satisfies Config
