import React from "react";

import { SEO } from "../components/seo";
import { Minesweeper } from "../components/minesweeper";


/**
 * Index page
 */
const Index = (): JSX.Element => (
  <>
    <SEO />
    <Minesweeper scale={1} />
  </>
);

export default Index;
