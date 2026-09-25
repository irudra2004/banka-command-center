/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: '#081426',
          navy: '#0b2038',
          card: '#0f2744',
          border: '#1b3b64',
          blue: '#1a56db',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          crimson: '#ef4444',
          lightBg: '#f1f5f9',
          lightCard: '#ffffff',
          lightBorder: '#cbd5e1',
          textMuted: '#64748b',
          textDark: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'gov-lg': '0 10px 25px -5px rgba(11, 32, 56, 0.12), 0 8px 10px -6px rgba(11, 32, 56, 0.08)',
        'gov-glow': '0 0 15px rgba(26, 86, 219, 0.25)',
        'alert-glow': '0 0 20px rgba(239, 68, 68, 0.4)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
};
