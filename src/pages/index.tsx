import React, { useState } from "react";

import { SEO } from "../components/seo";
import { Minesweeper, Game } from "../components/minesweeper";


/**
 * Index page
 */
const Index = (): JSX.Element => {
  const [ scale, setScale ] = useState(100);
  const [ { rows, columns, mines }, setGame ] = useState<Game>({ rows: 9, columns: 9, mines: 10 });

  return (
    <>
      <SEO />
      <Minesweeper game={{ rows, columns, mines }} scale={scale / 100} />
    </>
  );
};

export default Index;
