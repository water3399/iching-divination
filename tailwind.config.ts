import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#090909',
        zen: '#121212',
        gold: '#D4AF37',
        jade: '#214236'
      },
      boxShadow: {
        aura: '0 0 40px rgba(212,175,55,0.35)'
      }
    }
  },
  plugins: []
};

export default config;
