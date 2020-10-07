module.exports = {
  purge: ["./src/**/*.svelte", "./public/**/*.html"],
  theme: {},
  plugins: [require("@tailwindcss/ui")],
  future: {
    // purgeLayersByDefault: true,
    // removeDeprecatedGapUtilities: true,
  },
};
