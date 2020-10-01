const { colors } = require(`tailwindcss/defaultTheme`);

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: {
    mode: `all`,
    content: [
      `src/**/*.html`,
      `src/**/*.js`,
      `src/**/*.ts`,
      `src/**/*.jsx`,
      `src/**/*.tsx`,
    ]
  },
  theme: {
    extend: {
      colors: {
        maroon: `#800000`,
        green: { ...colors.green, default: `#008000` },
        olive: `#808000`,
        navy: `#000080`,
        purple: { ...colors.purple, default: `#800080` },
        teal: { ...colors.teal, default: `#008080` },
        silver: `#c0c0c0`,
        gray: { ...colors.gray, default: `#808080` },
        red: { ...colors.gray, default: `#ff0000` },
        lime: `#00ff00`,
        yellow: { ...colors.yellow, default: `#ffff00` },
        blue: { ...colors.blue, default: `#0000ff` },
        fuchsia: `#ff00ff`,
        aqua: `#00ffff`
      }
    }
  },
  variants: {},
  plugins: [],
  corePlugins: {
    animation: false
  }
};
