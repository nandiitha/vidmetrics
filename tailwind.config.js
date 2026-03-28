/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['DM Mono', 'monospace'],
        serif: ['Fraunces', 'serif'],
      },
      colors: {
        accent: '#0F9D74',
        'accent-dim': '#0a7a5a',
        surface: '#0e0e0e',
        panel: '#161616',
        border: '#262626',
        muted: '#888780',
      },
    },
  },
  plugins: [],
}