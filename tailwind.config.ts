import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f1',
          100: '#ffdfdf',
          200: '#ffc5c5',
          300: '#ff9d9d',
          400: '#ff6464',
          500: '#fd0100', // Official Brand Red
          600: '#dc0100',
          700: '#b90100',
          800: '#990100',
          900: '#7f0100',
          950: '#450000',
          DEFAULT: "#fd0100",
        },
        secondary: {
          50: '#f4f5f9',
          100: '#e9ebf2',
          200: '#c8cedf',
          300: '#a7b1cb',
          400: '#6577a4',
          500: '#1d284b', // Official Brand Navy
          600: '#1a2444',
          700: '#161e39',
          800: '#11182d',
          900: '#0e1325',
          950: '#090d19',
          DEFAULT: "#1d284b",
        },
        accent: {
          50: '#f5f5fc',
          100: '#ecedf9',
          200: '#ced1f0',
          300: '#b0b5e7',
          400: '#747dd4',
          500: '#3f3f95', // Official Brand Blue
          600: '#393986',
          700: '#2f2f70',
          800: '#262659',
          900: '#1f1f49',
          DEFAULT: "#3f3f95",
        },
        "primary-dark": "#b90100",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};

export default config;
