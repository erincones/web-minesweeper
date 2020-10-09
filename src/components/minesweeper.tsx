import React, { useState, useMemo, useCallback, useEffect, MouseEvent, CSSProperties } from "react";

import { useInterval } from "../hooks/interval";

import { Corners } from "./corners";
import { LCD } from "./lcd";

import { initialSunken, MouseButtons, Sunken } from "../utils/sunken";
import { noop } from "../utils/helpers";


/**
 * Minesweeper properties interface
 */
interface Props {
  readonly game?: Game;
  readonly marks?: boolean;
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
 * Game level
 */
export enum Level {
  BEGINNER,
  INTERMEDIATE,
  EXPERT,
  CUSTOM
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
  CLEAN = 16,
  FLAG = 32,
  MARK = 64,
  SINKABLE = 80
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
 * Inicial cell state
 */
const initialCell: Cell = { data: CellData.CLEAN, empty: true };


/**
 * Minesweeper component
 *
 * @param props Minesweeper properties
 */
export const Minesweeper = ({ game = beginner, marks = true, scale = 1, onFlagsChange = noop, onTimeChange = noop, onStatusChange = noop }: Props): JSX.Element => {
  const [ { rows, columns, mines }, setGame ] = useState<Game>(game);
  const [ sunken, setSunken ] = useState<Sunken>(initialSunken);
  const [ status, setStatus ] = useState(GameStatus.NEW);
  const [ flags, setFlags ] = useState(0);
  const [ time, setTime ] = useState(0);
  const [ raised, setRaised ] = useState(0);
  const [ board, setBoard ] = useState<Cell[]>([]);
  const timer = useInterval(() => { setTime(time => time + 1); }, 1000, false);


  // Cells
  const cells = rows * columns;

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
  const sinkAround = ((sunken.buttons & MouseButtons.AUXILIAR) === MouseButtons.AUXILIAR) || ((sunken.buttons & MouseButtons.BOTH) === MouseButtons.BOTH);


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
      sprite: scale < 1 ? `sprite` : `sprite pixelated`,
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


  // Get cells around target
  const cellsAround = useCallback((target: number) => {
    const around: number[] = [];
    const col = target % columns;
    let pos: number;

    // Top and bottom
    pos = target - columns;
    if (pos >= 0) {
      around.push(target - columns);
    }

    pos = target + columns;
    if (pos < cells) {
      around.push(pos);
    }

    // Check left border
    if (col > 0) {
      // Left
      around.push(target - 1);

      // Top left
      pos = target - columns - 1;
      if (pos >= 0) {
        around.push(pos);
      }

      // Bottom left
      pos = target + columns - 1;
      if (pos < cells) {
        around.push(pos);
      }
    }

    // Check right border
    if (col < (columns - 1)) {
      // Right
      around.push(target + 1);

      // Top right
      pos = target - columns + 1;
      if (pos >= 0) {
        around.push(pos);
      }

      // Bottom right
      pos = target + columns + 1;
      if (pos < cells) {
        around.push(pos);
      }
    }

    // Return cells
    return around;
  }, [ columns, cells ]);

  // Check if a cell is raised
  const isRaised = useCallback((cell: number, target: number) => {
    // Current target
    if (cell === target) {
      return false;
    }

    // Out of range cells
    return !sinkAround || !cellsAround(target).some(target => target === cell);
  }, [ sinkAround, cellsAround ]);

  // Sink the target cell
  const sink = useCallback((field: Cell[], target: number, raised: number) => {
    const cell = field[target];
    let remaining = raised;

    // Empty cell
    if (cell.empty) {
      // Count mines around
      const around = cellsAround(target);
      const data: CellData = around.reduce((accum, cell) =>
        field[cell].empty ? accum : accum + 1, 0
      );

      // Update board
      field[target] = { data , empty: true };
      remaining--;

      // Sink cells around
      if (data === CellData.SUNKEN) {
        let newBoard = { field, remaining };

        around.forEach(cell => {
          if ((field[cell].data & CellData.SINKABLE) !== CellData.SUNKEN) {
            newBoard = sink(newBoard.field, cell, newBoard.remaining);
          }
        });

        return newBoard;
      }

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
  }, [ mines, timer, cellsAround ]);

  // Context menu handler
  const handleContextMenu = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  // Mouse enter handler
  const handleMouseEnter = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    // Prevent default, get the current target and source
    event.preventDefault();
    const target = event.currentTarget;
    const source = target.dataset.mwid === undefined ? `` : target.dataset.mwid;
    const origin = source.length !== 0;

    // Update focus and sunken
    if ((origin || (source !== `f`)) && ((sunken.buttons & MouseButtons.SUNKEN) !== MouseButtons.NONE)) {
      target.focus();
      setSunken({
        source: origin ? sunken.source : source,
        target: source,
        buttons: event.buttons
      });
    }
  }, [ sunken.source, sunken.buttons ]);

  // Mouse leave handler
  const handleMouseLeave = useCallback((event: MouseEvent<HTMLElement>) => {
    if (sunken.source.length !== 0) {
      // Blur active element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // Update sunken
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
    const source = target.dataset.mwid === undefined ? `` : target.dataset.mwid;

    // Blur active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Focus target
    if (source.length !== 0) {
      target.focus();
    }

    // Check target and buttons
    if (
      (event.buttons === MouseButtons.SECONDARY) &&
      ((source.length !== 0) && (source !== `f`))
    ) {
      // Get the current data
      const id = parseInt(source);
      const { data } = board[id];
      let newData: CellData;

      // Get the new data and update flags
      switch (data) {
        case CellData.CLEAN: newData = CellData.FLAG; setFlags(flags + 1); break;
        case CellData.FLAG:  newData = marks ? CellData.MARK : CellData.CLEAN; setFlags(flags - 1); break;
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
      source: sunken.source.length !== 0 ? sunken.source : source,
      target: source,
      buttons: sunken.buttons | event.buttons
    });
  }, [ sunken.source, sunken.buttons, flags, marks, board ]);


  // Global mouse up handler
  useEffect(() => {
    // Mouse up handler
    const handleMouseUp = (event: globalThis.MouseEvent) => {
      // Prevent default and get target
      event.preventDefault();
      const target = event.target;
      const button = sunken.buttons ^ event.buttons;

      // Check target
      if (!(target instanceof HTMLElement)) {
        return;
      }

      // Get source
      const source = target.dataset.mwid === undefined ? `` : target.dataset.mwid;

      // Face target with primary button
      if (source === `f`) {
        if (button === MouseButtons.PRIMARY) {
          setStatus(GameStatus.NEW);
          setRaised(NaN);
        }
      }

      // Cell target
      else if (!gameOver && (source.length !== 0)) {
        // Check target
        const id = parseInt(source);
        const field = [ ...board ];
        const { data, empty } = field[id];

        // Sink around
        if ((button === MouseButtons.AUXILIAR) || ((sunken.buttons & MouseButtons.BOTH) === MouseButtons.BOTH)) {
          if ((data & CellData.SEVEN) !== CellData.SUNKEN) {
            const around = cellsAround(id);
            const flags = around.reduce((accum, cell) =>
              field[cell].data === CellData.FLAG ? accum + 1 : accum, 0
            );

            // Sink cells
            if (data === flags) {
              let newBoard = { field, remaining: raised };

              around.filter(cell =>
                (field[cell].data & CellData.SINKABLE) !== CellData.SUNKEN
              ).forEach(cell => {
                if ((newBoard.field[cell].data & CellData.SINKABLE) !== CellData.SUNKEN) {
                  newBoard = sink(newBoard.field, cell, newBoard.remaining);
                }
              });

              // Update board
              setBoard(newBoard.field);
              setRaised(newBoard.remaining);
            }
          }
        }

        // Single
        else if ((button === MouseButtons.PRIMARY) && ((data & CellData.SINKABLE) !== CellData.SUNKEN)) {
          const field = [ ...board ];

          // New game
          if (status === GameStatus.NEW) {
            // Reallocate mine
            if (!empty) {
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

          // Sink cell and update board
          const newBoard = sink(field, id, raised);
          setBoard(newBoard.field);
          setRaised(newBoard.remaining);
        }
      }

      // Blur active element
      else if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
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
  }, [ rows, columns, cells, sunken, status, gameOver, raised, board, timer, cellsAround, sink ]);

  // Fix game
  useEffect(() => {
    // Clamp values
    const rows = Math. min(Math.max(game.rows, 8), 24);
    const columns = Math.min(Math.max(game.columns, 8), 30);
    const mines = Math.min(Math.max(game.mines, 10), (rows - 1) * (columns - 1));

    // Reset game
    setGame({ rows, columns, mines });
    setStatus(GameStatus.NEW);
    setRaised(NaN);
  }, [ game ]);

  // New game
  useEffect(() => {
    // Check new game
    if ((status !== GameStatus.NEW) && !isNaN(raised)) {
      return;
    }

    // Create empty board
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
    setRaised(cells);
    timer.setRunning(false);
  }, [ status, rows, columns, cells, mines, raised, timer ]);

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
    <div className="inline-block border-black" style={style.container}>
      <div onMouseDown={handleMouseDown} onContextMenu={handleContextMenu} className="relative bg-silver border-raised" style={style.game}>
        <Corners type="raised" sprite={style.sprite} style={style.corners3} />

        {/* Header */}
        <div className="relative flex justify-between border-sunken" style={style.header}>
          <Corners type="sunken" sprite={style.sprite} style={style.corners2} />

          {/* LCDs and face */}
          <LCD number={mines - flags} sprite={style.sprite} styles={{ container: style.mines, corners: style.corners1, digit: style.digit }} />
          <button data-mwid="f" type="button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`${style.sprite} face ${faceClass} cursor-default focus:outline-none`} style={style.face} />
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
              case CellData.FLAG:   cellClass = exploded && cell.empty ? `cell-mine-wrong` : `cell-flag`; break;
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

            return <button key={i} data-mwid={i.toString()} type="button" onMouseEnter={handleMouseEnter} className={`${style.sprite} ${cellClass} cursor-default focus:outline-none`} style={style.cell} />;
          })}
        </div>
      </div>
    </div>
  );
};
