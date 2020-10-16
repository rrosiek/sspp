const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.svelte", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        "christmas-gold": "#cb9e61",
        "christmas-red": "#ce2f36",
        "christmas-dark-red": "#7f3037",
      },
      fontFamily: {
        sans: ["Lora", ...defaultTheme.fontFamily.sans],
        serif: ["Josefin\\ Sans", ...defaultTheme.fontFamily.sans],
      },
      fontSize: { "7xl": "6rem" },
      opacity: { 20: "0.2" },
    },
  },
  plugins: [require("@tailwindcss/ui")],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
    standardFontWeights: true,
    defaultLineHeights: true,
  },
};
