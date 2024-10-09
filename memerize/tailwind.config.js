import daisyui from "daisyui";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        color1: "#231F20", // warna hitam
        color2: "#C9D1D9", // warna text
        color3: "#0D1117", // warna sidebar
        color4: "#05080D", // warna navbar
        color5: "#21262D", // sidebar hover
        color6: "#161B22", // navbar hover
      },
    },
  },
  plugins: [daisyui],
};
export default config;
