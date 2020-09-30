import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";


// Site interface
interface Site {
  site: {
    siteMetadata: {
      author: string,
      title: string,
      name: string,
      description: string,
      generator: string,
      keywords: string[],
      ogType: string,
      twitterType: string,
      twitterUser: string,
      image: string,
      imageW: number,
      imageH: number,
      url: string
    }
  }
}


// Metadata query
const query = graphql`query SEO {
  site {
    siteMetadata {
      author
      title
      name
      description
      generator
      keywords
      ogType
      twitterType
      twitterUser
      image
      imageW
      imageH
      url
    }
  }
}`;


/**
 * SEO component
 */
export const SEO = (): JSX.Element => {
  // Get the site metadata
  const meta = useStaticQuery<Site>(query).site.siteMetadata;
  const image = `${meta.url}${meta.image}`;


  // Return helmet
  return (
    <Helmet>
      <meta name="application-name" content={meta.name} />
      <meta name="author" content={meta.author} />
      <meta name="description" content={meta.description} />
      <meta name="generator" content={meta.generator} />
      <meta name="keywords" content={meta.keywords.join(`, `)} />

      <meta property="og:type" content={meta.ogType} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={meta.imageW.toString()} />
      <meta property="og:image:height" content={meta.imageH.toString()} />

      <meta name="twitter:card" content={meta.twitterType} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:creator" content={meta.twitterUser} />
      <meta name="twitter:image" content={image} />

      <title>{meta.title}</title>
    </Helmet>
  );
};
