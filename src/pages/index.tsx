import React, { useState, useMemo, useCallback } from "react";

import { SEO } from "../components/seo";
import { Minesweeper, beginner, intermediate, expert, Game, Level, GameStatus } from "../components/minesweeper";
import { MenuBar, MenuEntry } from "../components/menu-bar";

import { noop } from "../utils/helpers";

import icon from "../images/icon.png";


/**
 * Index page
 */
const Index = (): JSX.Element => {
  const [ game, setGame ] = useState<Game>(beginner);
  const [ level, setLevel ] = useState(Level.BEGINNER);
  const [ status, setStatus ] = useState<GameStatus>(GameStatus.NEW);
  const [ marks, setMarks ] = useState(true);
  const [ time, setTime ] = useState(0);
  const [ scale, setScale ] = useState(100);


  // New game callback
  const newGame = useCallback(() => {
    setGame({ ...game });
  }, [ game ]);

  // Change level callback
  const changeLevel = useCallback((level: Level) => {
    switch (level) {
      case Level.BEGINNER:     return () => { setLevel(level); setGame(beginner); };
      case Level.INTERMEDIATE: return () => { setLevel(level); setGame(intermediate); };
      case Level.EXPERT:       return () => { setLevel(level); setGame(expert); };
      default: return () => { setLevel(Level.EXPERT); };
    }
  }, []);

  // Toogle marks callback
  const toggleMarks = useCallback(() => {
    setMarks(marks => !marks);
  }, []);


  // Menu entries
  const menuEntries = useMemo<MenuEntry[]>(() => ([
    {
      label: `Game`,
      items: [
        {
          label: `New`,
          callback: newGame
        },
        `separator`,
        {
          label: `Beginner`,
          callback: changeLevel(Level.BEGINNER),
          checked: level === Level.BEGINNER
        },
        {
          label: `Intermediate`,
          callback: changeLevel(Level.INTERMEDIATE),
          checked: level === Level.INTERMEDIATE
        },
        {
          label: `Expert`,
          callback: changeLevel(Level.EXPERT),
          checked: level === Level.EXPERT
        },
        {
          label: `Custom...`,
          callback: noop,
          checked: level === Level.CUSTOM
        },
        `separator`,
        {
          label: `Marks (?)`,
          callback: toggleMarks,
          checked: marks
        },
        {
          label: `Scale...`,
          callback: noop
        },
        `separator`,
        {
          label: `Best Times...`,
          callback: noop
        }
      ]
    },
    {
      label: `Help`,
      items: [
        {
          label: `How to play`,
          callback: noop
        },
        {
          label: `Controls`,
          callback: noop
        },
        `separator`,
        {
          label: `About`,
          callback: noop
        }
      ]
    }
  ]), [ level, marks, newGame, changeLevel, toggleMarks ]);


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
        <h1 className="inline text-xl align-middle font-bold my-auto">Web Minesweeper</h1>
      </header>

      {/* Menubar */}
      <MenuBar entries={menuEntries} />

      {/* Game */}
      <div className="flex-grow overflow-x-auto">
        <Minesweeper game={game} marks={marks} scale={scale / 100} onStatusChange={handleStusChange} onTimeChange={handleTimeChange} className="m-6" />
      </div>

      {/* Footer */}
      <footer className="bg-white text-right text-sm font-bold border-t border-black cursor-default px-2 w-full">
        Rows: {game.rows}&ensp;Columns: {game.columns}&ensp;Mines: {game.mines}&ensp;Scale: {scale}%
      </footer>
    </div>
  );
};

export default Index;
