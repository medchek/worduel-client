/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");

module.exports = {
  // mode: "jit",
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        bgray: colors.blueGray,
        tgray: colors.trueGray,
      },
    },
  },
  purge: ["./src/**/*.html", "./src/**/*.vue"],
  variants: {},
  plugins: [],
};
