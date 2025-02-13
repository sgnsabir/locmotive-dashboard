// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // include all files in pages folder
    "./components/**/*.{js,ts,jsx,tsx}", // include all files in components folder
    "./src/**/*.{js,ts,jsx,tsx}", // if you have additional source files
  ],
  theme: {
    extend: {
      // Extend your theme here if needed
    },
  },
  plugins: [],
};

export default config;
