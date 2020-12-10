/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");

module.exports = {
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
      },
    },
  },
  purge: ["./src/**/*.html", "./src/**/*.vue", "./src/**/*.jsx"],
  variants: {},
  plugins: [],
};
