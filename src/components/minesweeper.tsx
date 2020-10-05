import React, { useState, useMemo, useCallback, MouseEvent, useEffect, CSSProperties } from "react";

import { useInterval } from "../hooks/interval";

import { Corners } from "./corners";
import { LCD } from "./lcd";

import { noop } from "../utils/helpers";


/**
 * Minesweeper properties interface
 */
export interface Props {
  readonly game?: Game;
  readonly scale?: number;
  readonly onFlagsChange?: (flags: number) => void;
  readonly onTimeChange?: (time: number) => void;
  readonly onStatusChange?: (status: GameStatus) => void;
}

/**
 * Game interface
 */
export interface Game {
  readonly rows: number;
  readonly columns: number;
  readonly mines: number;
}

/**
 * Sunken interface
 */
interface Sunken {
  readonly source: string;
  readonly target: string;
  readonly buttons: number;
}

/**
 * Cell interface
 */
interface Cell {
  readonly data: CellData;
  readonly empty: boolean;
}

/**
 * Custom style interface
 */
interface Style {
  readonly sprite: `sprite pixelated` | `sprite`;
  container: CSSProperties;
  corners1: CSSProperties;
  corners2: CSSProperties;
  corners3: CSSProperties;
  game: CSSProperties;
  header: CSSProperties;
  mines: CSSProperties;
  time: CSSProperties;
  digit: CSSProperties;
  face: CSSProperties;
  board: CSSProperties;
  cell:CSSProperties;
}


/**
 * Game status enumeration
 */
export enum GameStatus {
  PLAYING = 0,
  NEW = 1,
  EXPLODED = 2,
  WIN = 4,
  GAME_OVER = 6
}

/**
 * Cell data enumeration
 */
enum CellData {
  SUNKEN = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  SURROUNDED = 15,
  CLEAN = 16,
  FLAG = 32,
  MARK = 64,
  SINKABLE = 80
}

/**
 * Mouse button enumeration
 */
enum MouseButtons {
  NONE = 0,
  PRIMARY = 1,
  SECONDARY = 2,
  BOTH = 3,
  AUXILIAR = 4,
  SUNKEN = 5,
  ANY = 7
}


/**
 * 8x8 board with 10 mines
 */
export const beginnerClassic: Game = { rows: 8, columns: 8, mines: 10 };

/**
 * 9x9 board with 10 mines
 */
export const beginner: Game = { rows: 9, columns: 9, mines: 10 };

/**
 * 16x16 board with 40 mines
 */
export const intermediate: Game = { rows: 16, columns: 16, mines: 40 };

/**
 * 16x30 board with 40 mines
 */
export const expert: Game = { rows: 16, columns: 30, mines: 99 };


/**
 * Initial sunken state
 */
const initialSunken: Sunken = { source: ``, target: ``, buttons: MouseButtons.NONE };

/**
 * Inicial cell state
 */
const initialCell: Cell = { data: CellData.CLEAN, empty: true };


/**
 * Minesweeper component
 *
 * @param props Minesweeper properties
 */
export const Minesweeper = ({ game = beginner, scale = 1, onFlagsChange = noop, onTimeChange = noop, onStatusChange = noop }: Props): JSX.Element => {
  const [ { rows, columns, mines }, setGame ] = useState<Game>(game);
  const [ sunken, setSunken ] = useState<Sunken>(initialSunken);
  const [ status, setStatus ] = useState(GameStatus.NEW);
  const [ flags, setFlags ] = useState(0);
  const [ time, setTime ] = useState(0);
  const [ raised, setRaised ] = useState(0);
  const [ board, setBoard ] = useState<Cell[]>([]);
  const timer = useInterval(() => { setTime(time => time + 1); }, 1000, false);


  //

  // Exploded
  const exploded = (status & GameStatus.EXPLODED) === GameStatus.EXPLODED;

  // Win
  const win = (status & GameStatus.WIN) === GameStatus.WIN;

  // Game over
  const gameOver = (status & GameStatus.GAME_OVER) !== GameStatus.PLAYING;

  // Source face
  const sourceFace = sunken.source === `f`;

  // Buttons raised
  const buttonsRaised = (sunken.buttons & MouseButtons.SUNKEN) === MouseButtons.NONE;

  // Target ID
  const target = parseInt(sunken.target);

  // Sunken around target
  const around = ((sunken.buttons & MouseButtons.AUXILIAR) === MouseButtons.AUXILIAR) || ((sunken.buttons & MouseButtons.BOTH) === MouseButtons.BOTH);

  // Face class
  const faceClass = useMemo(() => {
    // Sunken face
    if ((sunken.source === `f`) && (sunken.target === `f`) && ((sunken.buttons & MouseButtons.PRIMARY) === MouseButtons.PRIMARY)) {
      return `face-sunken`;
    }

    // Status game
    switch (status) {
      case GameStatus.EXPLODED: return `face-dead`;
      case GameStatus.WIN: return `face-win`;
      default: return (sunken.source !== `f`) && ((sunken.buttons & MouseButtons.SUNKEN) !== MouseButtons.NONE) ? `face-surprised` : `face-smile`;
    }
  }, [ status, sunken ]);

  // Styles
  const style = useMemo<Style>(() => {
    const backgroundSize = `${101 * scale}px ${116 * scale}px`;

    return {
      sprite: scale > 1 ? `sprite pixelated` : `sprite`,
      container: {
        borderWidth: 1 * scale
      },
      corners1: {
        width: scale,
        height: scale,
      },
      corners2: {
        width: 2 * scale,
        height: 2 * scale,
        backgroundSize: backgroundSize
      },
      corners3: {
        width: 3 * scale,
        height: 3 * scale,
        backgroundSize: backgroundSize
      },
      game: {
        borderWidth: 3 * scale,
        padding: 6 * scale
      },
      header: {
        borderWidth: 2 * scale,
        padding: `${4 * scale}px ${3 * scale}px ${3 * scale}px`,
        marginBottom: 6 * scale
      },
      mines: {
        borderWidth: scale,
        marginLeft: 2 * scale
      },
      time: {
        borderWidth: scale,
        marginRight: 4 * scale
      },
      digit: {
        width: 13 * scale,
        height: 23 * scale,
        backgroundSize: backgroundSize
      },
      face: {
        width: 26 * scale,
        height: 26 * scale,
        backgroundSize: backgroundSize
      },
      board: {
        width: 6 * scale + 16 * scale * columns,
        borderWidth: 3 * scale
      },
      cell: {
        width: 16 * scale,
        height: 16 * scale,
        backgroundSize: backgroundSize
      }
    };
  }, [ scale, columns ]);


  // Check if a cell is raised
  const isRaised = useCallback((cell: number, target: number) => {
    // Current target
    if (cell === target) {
      return false;
    }

    // Look around
    if (around) {
      // Up and down
      if ((cell === (target - columns)) || (cell === (target + columns))) {
        return false;
      }

      // Get current column
      const col = target % columns;

      // Left
      if (
        (col > 0) &&                          // Check left border
        ((cell === (target - 1)) ||           // Left
        (cell === (target - columns - 1)) ||  // Top left
        (cell === (target + columns - 1)))    // Bottom left
      ) {
        return false;
      }

      // Right
      if (
        (col < columns - 1) &&                // Check right border
        ((cell === (target + 1)) ||           // Right
        (cell === (target - columns + 1)) ||  // Top right
        (cell === (target + columns + 1)))    // Bottom rght
      ) {
        return false;
      }
    }

    // Out of range cells
    return true;
  }, [ columns, around ]);

  // Sink the target cell
  const sink = useCallback((field: Cell[], target: number, raised: number) => {
    const cell = field[target];
    let remaining = raised;

    // Empty cell
    if (cell.empty) {
      remaining--;
      field[target] = { data: CellData.SUNKEN, empty: true };


      // Win game
      if (remaining === mines) {
        setStatus(GameStatus.WIN);
        timer.setRunning(false);
      }
    }

    // Mine cell
    else {
      // Sink cell
      field[target] = { data: CellData.SUNKEN, empty: false };

      // Stop game
      setStatus(GameStatus.EXPLODED);
      timer.setRunning(false);
    }

    // Return the field
    return { field, remaining };
  }, [ mines, timer ]);

  // Context menu handler
  const handleContextMenu = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  // Mouse enter handler
  const handleMouseEnter = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    // Prevent default, get the current target and source
    event.preventDefault();
    const target = event.currentTarget;
    const source = sunken.source.length !== 0;

    // Update sunken
    if ((source || (target.id !== `f`)) && ((sunken.buttons & MouseButtons.SUNKEN) !== MouseButtons.NONE)) {
      setSunken({
        source: source ? sunken.source : target.id,
        target: target.id,
        buttons: event.buttons
      });
    }
  }, [ sunken.source, sunken.buttons ]);

  // Mouse leave handler
  const handleMouseLeave = useCallback((event: MouseEvent<HTMLElement>) => {
    if (sunken.source.length !== 0) {
      setSunken({
        source: sunken.source,
        target: ``,
        buttons: event.buttons
      });
    }
  }, [ sunken.source ]);

  // Mouse down handler
  const handleMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    // Prevent default and get target
    event.preventDefault();
    const target = event.target as HTMLElement;

    // Check target and buttons
    if (
      (event.buttons === MouseButtons.SECONDARY) &&
      ((target.id.length !== 0) && (target.id !== `f`))
    ) {
      // Get the current data
      const id = parseInt(target.id);
      const { data } = board[id];
      let newData: CellData;

      // Get the new data and update flags
      switch (data) {
        case CellData.CLEAN: newData = CellData.FLAG; setFlags(flags + 1); break;
        case CellData.FLAG:  newData = CellData.MARK; setFlags(flags - 1); break;
        case CellData.MARK:  newData = CellData.CLEAN; break;
        default: newData = data;
      }

      // Update board
      setBoard(board.map((cell, i) =>
        id !== i ? cell : { data: newData, empty: cell.empty }
      ));
    }

    // Update sunken
    setSunken({
      source: sunken.source.length ? sunken.source : target.id,
      target: target.id,
      buttons: sunken.buttons | event.buttons
    });
  }, [ sunken.source, sunken.buttons, flags, board ]);


  // Global mouse up handler
  useEffect(() => {
    // Mouse up handler
    const handleMouseUp = (event: globalThis.MouseEvent) => {
      // Prevent default and get target
      event.preventDefault();
      const target = event.target as HTMLElement;
      const button = sunken.buttons ^ event.buttons;

      // Face target with primary button
      if (target.id === `f`) {
        if (button === MouseButtons.PRIMARY) {
          setStatus(GameStatus.NEW);
        }
      }

      // Cell target
      else if (!gameOver && (target.id.length !== 0)) {
        // Get cell
        const id = parseInt(target.id);
        const field = [ ...board ];
        const { data, empty } = field[id];

        // Sink around
        if ((button === MouseButtons.AUXILIAR) || ((sunken.buttons & MouseButtons.BOTH) === MouseButtons.BOTH)) {
          if ((data & CellData.SURROUNDED) !== CellData.SUNKEN) {
            const newBoard = sink(field, id, button);
            setBoard(newBoard.field);
            setRaised(newBoard.remaining);
          }
        }

        // Single
        else if ((button === MouseButtons.PRIMARY) && ((data & CellData.SINKABLE) !== CellData.SUNKEN)) {
          const field = [ ...board ];

          // New game
          if (status === GameStatus.NEW) {
            // Reallocate mine
            if (!empty) {
              const cells = rows * columns;
              let dest = Math.trunc(Math.random() * cells);
              field[id] = initialCell;

              while (!field[id].empty) {
                dest = Math.trunc(Math.random() * cells);
              }

              field[dest] = { data: CellData.CLEAN, empty: false };
            }

            // Start game
            setStatus(GameStatus.PLAYING);
            timer.setRunning(true);
          }

          // Sink cell
          const newBoard = sink(field, id, raised);
          setBoard(newBoard.field);
          setRaised(newBoard.remaining);
        }
      }

      // Update sunken
      setSunken(sunken => event.buttons === MouseButtons.NONE ? {
        source: ``,
        target: ``,
        buttons: MouseButtons.NONE
      } : {
        source: sunken.source,
        target: sunken.target,
        buttons: event.buttons
      });
    };

    // Register handler
    document.addEventListener(`mouseup`, handleMouseUp);


    // Remove handler
    return () => {
      document.removeEventListener(`mouseup`, handleMouseUp);
    };
  }, [ rows, columns, sunken, status, gameOver, raised, board, timer, sink ]);

  // Fix game
  useEffect(() => {
    // Clamp values
    const rows = Math. min(Math.max(game.rows, 8), 24);
    const columns = Math.min(Math.max(game.columns, 8), 30);
    const mines = Math.min(Math.max(game.mines, 10), (rows - 1) * (columns - 1));

    // Reset game
    setGame({ rows, columns, mines });
    setStatus(GameStatus.NEW);
  }, [ game ]);

  // New game
  useEffect(() => {
    // Check new game
    if (status !== GameStatus.NEW) {
      return;
    }

    // Create empty board
    const cells = rows * columns;
    const board = Array<Cell>(cells).fill(initialCell);
    let remaining = mines;

    // Put mines
    while (remaining > 0) {
      const mine = Math.trunc(Math.random() * cells);

      if (board[mine].empty) {
        board[mine] = { data: CellData.CLEAN, empty: false };
        remaining--;
      }
    }

    // Update game
    setBoard(board);
    setFlags(0);
    setTime(0);
    setRaised(rows * columns);
    timer.setRunning(false);
  }, [ status, rows, columns, mines, timer ]);

  // Handle flags change
  useEffect(() => {
    onFlagsChange(flags);
  }, [ onFlagsChange, flags ]);

  // Handle time change
  useEffect(() => {
    onTimeChange(time);
  }, [ onTimeChange, time ]);

  // Handle status change
  useEffect(() => {
    onStatusChange(status);
  }, [ onStatusChange, status ]);


  // Return the minesweeper game
  return (
    <div onMouseDown={handleMouseDown} onContextMenu={handleContextMenu} className="inline-block border-black" style={style.container}>
      <div className="relative bg-silver border-raised" style={style.game}>
        <Corners type="raised" sprite={style.sprite} style={style.corners3} />

        {/* Header */}
        <div className="relative flex justify-between border-sunken" style={style.header}>
          <Corners type="sunken" sprite={style.sprite} style={style.corners2} />

          {/* LCDs and face */}
          <LCD number={mines - flags} sprite={style.sprite} styles={{ container: style.mines, corners: style.corners1, digit: style.digit }} />
          <button id="f" type="button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`${style.sprite} face ${faceClass} cursor-default focus:outline-none`} style={style.face} />
          <LCD number={time} sprite={style.sprite} styles={{ container: style.time, corners: style.corners1, digit: style.digit }} />
        </div>


        {/* Board */}
        <div onMouseLeave={handleMouseLeave} className="relative flex flex-wrap border-sunken" style={style.board}>
          <Corners type="sunken" sprite={style.sprite} style={style.corners3} />

          {/* Cells */}
          {board.map((cell, i) => {
            const mine = exploded && !cell.empty;
            const raised = gameOver || sourceFace || buttonsRaised || isRaised(i, target);
            let cellClass: string;

            switch (cell.data) {
              case CellData.CLEAN:  cellClass = mine ? `cell-mine` : win ? `cell-flag` : raised ? `cell-clean` : `cell-0`; break;
              case CellData.FLAG:   cellClass = !gameOver || mine ? `cell-flag` : `cell-mine-wrong`; break;
              case CellData.MARK:   cellClass = raised ? `cell-mark` : `cell-mark-sunken`; break;
              case CellData.SUNKEN: cellClass = mine ? `cell-mine-exploded` : `cell-0`; break;
              case CellData.ONE:    cellClass = `cell-1`; break;
              case CellData.TWO:    cellClass = `cell-2`; break;
              case CellData.THREE:  cellClass = `cell-3`; break;
              case CellData.FOUR:   cellClass = `cell-4`; break;
              case CellData.FIVE:   cellClass = `cell-5`; break;
              case CellData.SIX:    cellClass = `cell-6`; break;
              case CellData.SEVEN:  cellClass = `cell-7`; break;
              case CellData.EIGHT:  cellClass = `cell-8`; break;
              default: cellClass = `cell-clean`;
            }

            return <button key={i} id={i.toString()} type="button" onMouseEnter={handleMouseEnter} className={`${style.sprite} ${cellClass} cursor-default focus:outline-none`} style={style.cell} />;
          })}
        </div>
      </div>
    </div>
  );
};

