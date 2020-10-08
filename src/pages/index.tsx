import React, { useState, useCallback, useEffect } from "react";

import { SEO } from "../components/seo";
import { Minesweeper, beginner, intermediate, expert, Game, GameStatus } from "../components/minesweeper";

import { initialSunken, MouseButtons, Sunken } from "../utils/sunken";

import icon from "../images/icon.png";


/**
 * Index page
 */
const Index = (): JSX.Element => {
  const [ sunken, setSunken ] = useState<Sunken>(initialSunken);
  const [ scale, setScale ] = useState(100);
  const [ game, setGame ] = useState<Game>(beginner);
  const [ status, setStatus ] = useState<GameStatus>(GameStatus.NEW);
  const [ time, setTime ] = useState(0);


  // Game status handler
  const handleStusChange = useCallback((status: GameStatus) => {
    setStatus(status);
  }, []);

  // Time handler
  const handleTimeChange = useCallback((time: number) => {
    setTime(time);
  }, []);


  // Return page
  return (
    <div className="flex flex-col bg-teal w-full h-full">
      {/* SEO component */}
      <SEO />

      {/* Header */}
      <header className="bg-navy text-white border-b border-black cursor-default w-full">
        <img src={icon} className="inline box-content bg-silver border-r border-black w-8 h-8 mr-1" />
        <h1 className="inline text-xl align-middle font-bold my-auto">
          Web Minesweeper
        </h1>
      </header>

      {/* Menubar */}
      <div className="bg-white text-sm font-bold whitespace-no-wrap border-b border-black">
        {/* Game menu */}
        <div className="relative inline-block">
          <div>
            <button type="button" className="font-bold focus:outline-none cursor-default px-2">Game</button>
            <div className="hidden absolute z-10 bg-white border border-black">
              <button type="button" className="block font-bold focus:outline-none cursor-default px-2">New</button>
              <div className="border-b border-black my-1" />
              <button type="button" className="block font-bold focus:outline-none cursor-default px-2">Beginner</button>
              <button type="button" className="block font-bold focus:outline-none cursor-default px-2">Intermediate</button>
              <button type="button" className="block font-bold focus:outline-none cursor-default px-2">Expert</button>
              <button type="button" className="block font-bold focus:outline-none cursor-default px-2">Custom...</button>
              <div className="border-b border-black my-1" />
              <button type="button" className="block font-bold focus:outline-none cursor-default px-2">Marks (?)</button>
              <button type="button" className="block font-bold focus:outline-none cursor-default px-2">Scale...</button>
              <div className="border-b border-black my-1" />
              <button type="button" className="block font-bold focus:outline-none cursor-default px-2">Best Times...</button>
            </div>
          </div>
        </div>

        {/* Help menu */}
        <div className="relative inline-block">
          <div>
            <button type="button" className="font-bold focus:outline-none cursor-default px-2">Help</button>
            <div className="hidden absolute z-10 bg-white border border-black">
              <button type="button" className="block font-bold focus:outline-none cursor-default px-2">How to play</button>
              <button type="button" className="block font-bold focus:outline-none cursor-default px-2">Controls</button>
              <div className="border-b border-black my-1" />
              <button type="button" className="block font-bold focus:outline-none cursor-default px-2">About</button>
            </div>
          </div>
        </div>
      </div>

      {/* Game */}
      <div className="flex-grow overflow-x-auto">
        <Minesweeper game={game} scale={scale / 100} onStatusChange={handleStusChange} onTimeChange={handleTimeChange} className="m-6" />
      </div>

      {/* Footer */}
      <footer className="bg-white text-right text-sm font-bold border-t border-black cursor-default px-2 w-full">
        Rows: {game.rows} Columns: {game.columns} Mines: {game.mines} Scale: {scale}%
      </footer>
    </div>
  );
};

export default Index;
