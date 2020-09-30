/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */


// SEO constants
const siteMetadata = {
  author: `Erick Rincones`,
  title: `Web Minesweeper`,
  name: `Minesweeper`,
  description: `Web version of the classic minesweeper`,
  generator: `gatsby`,
  keywords: [ `minesweeper`, `web`, `react`, `gatsby` ],
  ogType: `website`,
  twitterType: `summary_large_image`,
  twitterUser: `@ErickRincones`,
  image: `cover.png`,
  imageW: 1920,
  imageH: 1080,
  url: `https://erincones.github.io/web-minesweeper/`
};

module.exports = {
  pathPrefix: `/web-minesweeper`,
  siteMetadata: siteMetadata,
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: siteMetadata.title,
        short_name: siteMetadata.name,
        description: siteMetadata.description,
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
