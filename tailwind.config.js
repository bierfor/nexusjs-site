/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{nx,ts,js,md}",
    "./src/content/**/*.md",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        accent2: 'var(--accent2)',
        'accent-muted': 'var(--accent-muted)',
        green: 'var(--green)',
        amber: 'var(--amber)',
        red: 'var(--red)',
        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        muted: 'var(--muted)',
      },
      fontFamily: {
        sans: 'var(--sans)',
        mono: 'var(--mono)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
    },
  },
  plugins: [],
}
