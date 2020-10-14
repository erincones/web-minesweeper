const { colors } = require(`tailwindcss/defaultTheme`);

const outline = require(`./tailwindcss-plugins/outline`);
const breakWord = require(`./tailwindcss-plugins/break-word`);
const imageRendering = require(`./tailwindcss-plugins/image-rendering`);


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
      spacing: {
        "2px": `2px`
      },
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
      },
      maxWidth: {
        "4/5": `80%`
      },
      maxHeight: {
        "4/5": `80%`
      }
    }
  },
  variants: {
    textColor: [ `responsive`, `hover`, `focus`, `visited` ],
    outline: [ `responsive`, `hover`, `focus`, `active` ],
    borderColor: [ `responsive`, `hover`, `focus`, `active`],
    borderWidth: [ `responsive`, `focus`, `active` ],
    margin: [ `responsive`, `active` ]
  },
  plugins: [
    outline,
    breakWord,
    imageRendering
  ],
  corePlugins: {
    outline: false,
    wordBreak: false,
    animation: false
  }
};
