const { guessProductionMode } = require("@ngneat/tailwind");
const colors = require("tailwindcss/colors");

module.exports = {
  prefix: "",
  purge: {
    enabled: guessProductionMode(),
    content: ["./src/**/*.{html,ts}"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      red: "#ff0000",
      gray: colors.coolGray,
      blue: colors.lightBlue,
      white: colors.white,
      black: "#000000",
    },
    minHeight: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
      12: "3rem",
    },
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        manage: "1fr auto auto",
        syntax: "auto 1fr",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
