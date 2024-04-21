/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    './src/**/*.{html,js,jsx}',
  ],
  content: [
    './src/**/*.{html,js,jsx}',
  ],
  theme: {
    extend: {
      height: {
        'custom': '60rem'
      },
      colors:{
        // 'blue': ''
      },
      backgroundImage: {
      },
    },
  },
  plugins: [],
};
