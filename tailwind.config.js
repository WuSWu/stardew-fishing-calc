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
        'custom': '80rem'
      },
      zIndex: {
        '1': '1',
        '2': '2',
        '3': '3'
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
