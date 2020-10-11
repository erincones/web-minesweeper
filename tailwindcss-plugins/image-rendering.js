const plugin = require(`tailwindcss/plugin`);


/**
 * Default image rendering configuration
 */
const imageRenderingConfig = {
  theme: {
    imageRendering: {
      auto: `auto`,
      pixelated: `pixelated`,
      "crisp-edges": `crisp-edges`
    }
  },
  variants: {
    imageRendering: [ `responsive` ]
  }
};

/**
 * Image rendering plugin
 *
 * @param {Object} helpers TailwindCSS helper functions
 */
const imageRenderingPlugin = ({ addUtilities, theme, variants, e }) => {
  // Get configuration
  const imageRendering = {
    utilities: theme(`imageRendering`),
    variants: variants(`imageRendering`)
  };


  // Utilities
  const utilities = {};

  // Set utilities
  Object.entries(imageRendering.utilities).forEach(([ key, val ]) => {
    utilities[`.${e(`rendering-${key}`)}`] = { imageRendering: val };
  });


  // Add utilities
  addUtilities(utilities, imageRendering.variants);
};


module.exports = plugin(imageRenderingPlugin, imageRenderingConfig);
