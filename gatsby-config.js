/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  pathPrefix: `/web-minesweeper`,
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Web Minesweeper`,
        short_name: `Minesweeper`,
        description: `Web version of the classic minesweeper`,
        lang: `en`,
        display: `standalone`,
        theme_color: `#000000`,
        background_color: `#FFFFFF`,
        icon: `src/images/icon.png`
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [
          require(`postcss-import`),
          require(`tailwindcss`),
          require(`postcss-preset-env`)({ stage: 1 }),
          require(`cssnano`)({
            preset: [
              `default`,
              { discardComments: { removeAll: true } }
            ]
          })
        ]
      }
    }
  ]
};
