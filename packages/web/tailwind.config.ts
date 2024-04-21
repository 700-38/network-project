import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        project_black: '#1d1e20',
        project_white: '#ffffff',
        project_gray: '#3f4041',
        project_light_gray: '#848486',
        project_blue: '#1371ff',
        project_dark_blue: '#0f63e1',
        project_purple: 'rgb(116, 41, 255)', // rgb(164, 4, 255)
        project_dark_purple: 'rgb(80, 0, 225)',
      },
    },
  },
  plugins: [require('daisyui')],
};
export default config;
