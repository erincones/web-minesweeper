import React, { useState, useMemo, useCallback, useEffect } from "react";

import { SEO } from "../components/seo";
import { MenuBar, MenuEntry } from "../components/menu-bar";
import { Minesweeper, beginner, intermediate, expert, Game, Level, GameStatus } from "../components/minesweeper";

import { useTypedStore } from "../hooks/typed-store";
import { useCustomize } from "../hooks/customize";
import { useScale } from "../hooks/scale";

import { noop } from "../utils/helpers";

import icon from "../images/icon.png";


/**
 * Index page
 */
const Index = (): JSX.Element => {
  const store = useTypedStore();

  const [ game, setGame ] = useState<Game>(() => store.getObject(`game`, beginner));
  const [ level, setLevel ] = useState<Level>(() => store.getNumber(`level`, Level.BEGINNER));
  const [ status, setStatus ] = useState<GameStatus>(GameStatus.NEW);
  const [ marks, setMarks ] = useState(() => store.getBoolean(`marks`, true));
  const [ time, setTime ] = useState(0);
  const [ scale, setScale ] = useState(() => store.getNumber(`scale`, 100));
  const [ showStatusBar, setShowStatusBar ] = useState(() => store.getBoolean(`showstatusbar`, true));

  const [ Customize, openCustomize ] = useCustomize(setGame);
  const [ Scale, openScale ] = useScale(setScale);


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
      default: return () => { setLevel(Level.CUSTOM); openCustomize(); };
    }
  }, [ openCustomize ]);

  // Toogle marks callback
  const toggleMarks = useCallback(() => {
    setMarks(marks => !marks);
  }, []);

  // Toggle status bar
  const toggleStatusBar = useCallback(() => {
    setShowStatusBar(statusBar => !statusBar);
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
          callback: changeLevel(Level.CUSTOM),
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
          callback: openScale
        },
        `separator`,
        {
          label: `Status Bar`,
          callback: toggleStatusBar,
          checked: showStatusBar
        },
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
  ]), [ level, marks, showStatusBar, newGame, changeLevel, toggleMarks, openScale, toggleStatusBar ]);


  // Game status handler
  const handleStusChange = useCallback((status: GameStatus) => {
    setStatus(status);
  }, []);

  // Time handler
  const handleTimeChange = useCallback((time: number) => {
    setTime(time);
  }, []);


  // Store preferences
  useEffect(() => {
    store.setObject(`game`, game);
    store.setNumber(`level`, level);
    store.setBoolean(`marks`, marks);
    store.setNumber(`scale`, scale);
    store.setBoolean(`showstatusbar`, showStatusBar);
  }, [ store, game, level, marks, scale, showStatusBar ]);


  // Return page
  return (
    <div className="flex flex-col fixed bg-teal w-full h-full">
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
      <div className="flex-grow overflow-auto">
        <div className="inline-block m-6">
          <Minesweeper game={game} marks={marks} scale={scale / 100} onStatusChange={handleStusChange} onTimeChange={handleTimeChange} />
        </div>
      </div>

      {/* Status bar */}
      {showStatusBar && (
        <footer className="bg-white text-right text-sm font-bold border-t border-black cursor-default px-2 w-full">
          Rows: {game.rows}&ensp;Columns: {game.columns}&ensp;Mines: {game.mines}&ensp;Scale: {scale}%
        </footer>
      )}

      {/* Modals */}
      <Customize game={game} />
      <Scale scale={scale} />
    </div>
  );
};

export default Index;
