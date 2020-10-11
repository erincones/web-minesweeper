const plugin = require(`tailwindcss/plugin`);


/**
 * Default outline configuration
 */
const outlineConfig = {
  theme: {
    outlineStyle: {
      default: `solid`,
      none: `none`,
      hidden: `hidden`,
      dotted: `dotted`,
      dashed: `dashed`,
      double: `double`,
      groove: `groove`,
      ridge: `ridge`,
      inset: `inset`,
      outset: `outset`,
      initial: `initial`
    },
    outlineColor: theme => {
      const colors = {};
      Object.entries(theme(`colors`, {})).forEach(([ color, val ]) => {
        if (typeof val === `string`) {
          colors[color] = val;
        }
        else {
          Object.entries(val).forEach(([ modifier, val ]) => {
            if (modifier === `default`) {
              colors[color] = val;
            }
            else {
              colors[`${color}-${modifier}`] = val;
            }
          });
        }
      });

      return colors;
    },
    outlineWidth: theme => theme(`borderWidth`),
    outlineOffset: {}
  },
  variants: {
    imageRendering: [ `responsive`, `hover`, `focus` ]
  }
};

/**
 * Outline plugin
 *
 * @param {Object} helpers TailwindCSS helper functions
 */
const outlinePlugin = ({ addUtilities, theme, variants, e }) => {
  // Get configuration
  const outline = {
    style: theme(`outlineStyle`),
    color: theme(`outlineColor`),
    width: theme(`outlineWidth`),
    offset: theme(`outlineOffset`),
    variants: variants(`outline`)
  };


  // Utilities
  const utilities = {};
  const base = {};


  // Set default style
  if (outline.style.default !== undefined) {
    base.outlineStyle = outline.style.default;
  }

  if (outline.color.default !== undefined) {
    base.outlineColor = outline.color.default;
  }

  if (outline.width.default !== undefined) {
    base.outlineWidth = outline.width.default;
  }

  if (outline.offset.default !== undefined) {
    base.outlineOffset = outline.offset.default;
  }

  utilities[`.outline`] = base;


  // Set outline styles
  Object.entries(outline.style).forEach(([ key, val ]) => {
    utilities[`.${e(`outline-${key}`)}`] = { outlineStyle: val };
  });

  // Set outline colors
  Object.entries(outline.color).forEach(([ key, val ]) => {
    utilities[`.${e(`outline-${key}`)}`] = { outlineColor: val };
  });

  // Set outline widths
  Object.entries(outline.width).forEach(([ key, val ]) => {
    utilities[`.${e(`outline-${key}`)}`] = { outlineWidth: val };
  });

  // Set outline offsets
  Object.entries(outline.offset).forEach(([ key, val ]) => {
    utilities[`.${e(`outline-offset-${key}`)}`] = { outlineOffset: val };
  });


  // Add utilities
  addUtilities(utilities, outline.variants);
};


module.exports = plugin(outlinePlugin, outlineConfig);
