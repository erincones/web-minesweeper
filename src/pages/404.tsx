import React, { useEffect } from "react";
import { navigate } from "gatsby";

import { SEO } from "../components/seo";


/**
 * Error 404 page
 */
const Error404 = (): JSX.Element => {
  useEffect(() => {
    navigate(`/`);
  }, []);

  return <SEO />;
};

export default Error404;
