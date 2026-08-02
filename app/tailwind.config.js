/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F99139',
        },
        ink: {
          DEFAULT: '#000000',
        },
        muted: {
          DEFAULT: '#828282',
        },
        line: {
          DEFAULT: '#E0E0E0',
          light: '#E6E6E6',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F7F7F7',
          press: '#EEEEEE',
          placeholder: '#E9E9EB',
        },
      },
      fontFamily: {
        inter: ['Inter_400Regular', 'sans-serif'],
        'inter-medium': ['Inter_500Medium', 'sans-serif'],
        'inter-semibold': ['Inter_600SemiBold', 'sans-serif'],
        'inter-bold': ['Inter_700Bold', 'sans-serif'],
        'inter-extrabold': ['Inter_800ExtraBold', 'sans-serif'],
      },
      boxShadow: {
        'tab-bar': '0px -0.5px 0px 0px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
