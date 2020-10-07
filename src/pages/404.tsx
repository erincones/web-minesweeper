import React, { useEffect } from "react";
import { navigate } from "gatsby";

import { SEO } from "../components/seo";


/**
 * Error 404 page
 */
const Error404 = (): JSX.Element => {
  // Navigate to home
  useEffect(() => {
    navigate(`/`);
  }, []);


  // Return empty page
  return <SEO />;
};

export default Error404;
