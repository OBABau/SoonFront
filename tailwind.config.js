/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/**/*.{html,js}", "./src/pages/*.html", "./src/pages/**/*.html", "./src/index.html","index.html" ],
  theme: {
    extend: {
      boxShadow: {
        'top': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
        'all-sides': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06), 4px 0 6px -1px rgba(0, 0, 0, 0.1), -4px 0 6px -1px rgba(0, 0, 0, 0.1)',
      },
      colors: {
        skyBlue: '#69b2c4',
        oceanBlue: '#093955',
        deepBlue: '#1A4F6E',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

