/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");

module.exports = {
  // mode: "jit",
  variants: {
    extend: {
      backgroundColor: ["active"],
      textColor: ["active"],
    },
  },
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        bgray: colors.blueGray,
        tgray: colors.trueGray,
        emerald: colors.emerald,
        cyan: colors.cyan,
      },
      borderWidth: {
        "6": "6px",
      },
      height: {
        "18": "4.5rem",
        "9/10": "90%",
      },
      width: {
        "9/10": "90%",
      },
      strokeWidth: {
        "3": "3",
        "5": "5",
        "10": "10",
        "15": "15",
      },
    },
  },
  purge: ["./src/**/*.html", "./src/**/*.vue"],
  plugins: [],
};
