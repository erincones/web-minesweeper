import React, { useState } from "react";

import { SEO } from "../components/seo";
import { Minesweeper, beginner, Game } from "../components/minesweeper";


/**
 * Index page
 */
const Index = (): JSX.Element => {
  const [ scale, setScale ] = useState(100);
  const [ game, setGame ] = useState<Game>(beginner);

  // Return page
  return (
    <>
      <SEO />
      <Minesweeper game={game} scale={scale / 100} />
    </>
  );
};

export default Index;
