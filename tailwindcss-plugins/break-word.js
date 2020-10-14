const plugin = require(`tailwindcss/plugin`);


/**
 * Image rendering plugin
 *
 * @param {Object} helpers TailwindCSS helper functions
 */
const breakWord = ({ addUtilities, variants }) => {
  addUtilities({
    ".break-normal": {
      overflowWrap: `normal`,
      wordBreak: `normal`
    },
    ".break-words": {
      overflowWrap: `break-word`,
      wordBreak: `break-word`
    },
    ".break-all": {
      wordBreak: `break-all`
    },
    ".truncate": {
      overflow: `hidden`,
      textOverflow: `ellipsis`,
      whiteSpace: `nowrap`
    }
  }, variants(`breakWord`));
};


module.exports = plugin(breakWord);
