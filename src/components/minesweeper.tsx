import React, { useState, useMemo, useCallback, MouseEvent, useEffect, CSSProperties } from "react";
import { Corners } from "./corners";

import { LCD } from "./lcd";


/**
 * Minesweeper properties interface
 */
export interface Props {
  readonly game?: Game;
  readonly scale?: number;
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
  readonly data: Data;
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
enum Status {
  NEW = 1,
  EXPLODED = 2,
  WIN = 4,
  GAME_OVER = 6
}

/**
 * Cell data enumeration
 */
enum Data {
  RAISED,
  FLAG,
  MARK,
  SUNKEN,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT
}

/**
 * Mouse buttons enumeration
 */
enum Buttons {
  NONE = 0,
  PRIMARY = 1,
  SECONDARY = 2,
  AUXILIAR = 4,
  SUNKEN = 5,
  ANY = 7
}


/**
 * Minesweeper component
 *
 * @param props Minesweeper properties
 */
export const Minesweeper = ({ game = { rows: 9, columns: 9, mines: 10 }, scale = 1 }: Props): JSX.Element => {
  const [ { rows, columns, mines }, setGame ] = useState<Game>(game);
  const [ sunken, setSunken ] = useState<Sunken>({ source: ``, target: ``, buttons: Buttons.NONE });
  const [ status, setStatus ] = useState(Status.NEW);
  const [ flags, setFlags ] = useState(0);
  const [ raised, setRaised ] = useState(rows * columns);
  const [ board, setBoard ] = useState<Cell[]>([]);


  // Fix game
  useEffect(() => {
    const rows = Math.min(Math.max(game.rows, 8), 24);
    const columns = Math.min(Math.max(game.columns, 8), 30);
    const mines = Math.min(Math.max(game.mines, 10), (rows - 1) * (columns - 1));

    setGame({ rows, columns, mines });
    setStatus(Status.NEW);
    setFlags(0);
    setRaised(rows * columns);
  }, [ game ]);

  // New game
  useEffect(() => {
    const cells = rows * columns;
    const board = Array<Cell>(cells).fill({ data: Data.RAISED, empty: true });
    let remaining = mines;

    while (remaining > 0) {
      const mine = Math.trunc(Math.random() * cells);

      if (board[mine].empty) {
        board[mine] = { data: Data.RAISED, empty: false };
        remaining--;
      }
    }

    setBoard(board);
  }, [ rows, columns, mines ]);

  // Global mouse up listener
  useEffect(() => {
    const handleMouseUp = (event: globalThis.MouseEvent) => {
      // Prevent default and get target
      event.preventDefault();
      const target = event.target as HTMLElement;


      // Update sunken
      setSunken(event.buttons === Buttons.NONE ? {
        source: ``,
        target: ``,
        buttons: Buttons.NONE
      } : {
        source: sunken.source,
        target: sunken.target,
        buttons: sunken.buttons ^ event.buttons
      });
    };

    document.addEventListener(`mouseup`, handleMouseUp);
    return () => { document.removeEventListener(`mouseup`, handleMouseUp); };
  }, [ sunken.source, sunken.target, sunken.buttons ]);


  // Mouse down handler
  const handleMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    // Prevent default and get target
    event.preventDefault();
    const target = event.target as HTMLElement;

    // Check target and buttons
    if (
      (event.buttons === Buttons.SECONDARY) &&
      ((target.id.length !== 0) && (target.id !== `f`))
    ) {
      // Get the current data
      const id = parseInt(target.id);
      const currentData = board[id].data;
      let newData: Data;

      // Get the new data and update flags
      switch (currentData) {
        case Data.RAISED: newData = Data.FLAG; setFlags(flags + 1); break;
        case Data.FLAG:   newData = Data.MARK; setFlags(flags - 1); break;
        case Data.MARK:   newData = Data.RAISED; break;
        default: newData = currentData;
      }

      // Update board
      setBoard(board.map((cell, i) => id !== i ? cell : {
        data: newData,
        empty: cell.empty
      }));
    }

    // Update sunken
    setSunken({
      source: sunken.source.length ? sunken.source : target.id,
      target: target.id,
      buttons: sunken.buttons | event.buttons
    });
  }, [ sunken.source, sunken.buttons, flags, board ]);

  // Mouse enter handler
  const handleMouseEnter = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    // Prevent default, get the current target and source
    event.preventDefault();
    const target = event.currentTarget;
    const source = sunken.source.length !== 0;
    const face = target.id === `f`;

    // Update sunken
    if ((source || !face) && (event.buttons !== Buttons.NONE)) {
      setSunken({
        source: source ? sunken.source : target.id,
        target: target.id,
        buttons: event.buttons
      });
    }
  }, [ sunken.source ]);

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

  // Context menu handler
  const handleContextMenu = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);


  // Styles
  const style = useMemo<Style>(() => {
    const backgroundSize = `${104 * scale}px ${133 * scale}px`;

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

  // Game over
  const gameOver = useMemo(() =>
    (status & Status.GAME_OVER) !== 0
  , [ status ]);

  // Source face
  const sourceFace = useMemo(() =>
    sunken.source === `f`
  , [ sunken.source ]);

  // Buttons raised
  const buttonsRaised = useMemo(() =>
    (sunken.buttons & Buttons.SUNKEN) === Buttons.NONE
  , [ sunken.buttons ]);

  // Face class
  const faceClass = useMemo(() => {
    // Sunken face
    if ((sunken.source === `f`) && (sunken.target === `f`) && (sunken.buttons === Buttons.PRIMARY)) {
      return `face-sunken`;
    }

    // Status game
    switch (status) {
      case Status.EXPLODED: return `face-dead`;
      case Status.WIN: return `face-win`;
      default: return (sunken.source !== `f`) && ((sunken.buttons & Buttons.PRIMARY) !== Buttons.NONE) ? `face-surprised` : `face-smile`;
    }
  }, [ status, sunken.source, sunken.target, sunken.buttons ]);


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
          <LCD number={0} sprite={style.sprite} styles={{ container: style.time, corners: style.corners1, digit: style.digit }} />
        </div>


        {/* Board */}
        <div onMouseLeave={handleMouseLeave} className="relative flex flex-wrap border-sunken" style={style.board}>
          <Corners type="sunken" sprite={style.sprite} style={style.corners3} />

          {/* Cells */}
          {board.map((cell, i) => {
            const id = i.toString();
            const mine = gameOver && !cell.empty;
            const raised = gameOver || sourceFace || buttonsRaised || (sunken.target !== id);
            let cellClass: string;

            switch (cell.data) {
              case Data.RAISED: cellClass = mine ? `cell-mine` : raised ? `cell-raised` : `cell-0`; break;
              case Data.FLAG:   cellClass = mine ? `cell-mine-wrong` : `cell-flag`; break;
              case Data.MARK:   cellClass = raised ? `cell-mark` : `cell-mark-sunken`; break;
              case Data.SUNKEN: cellClass = mine ? `cell-mine-exploded` : `cell-0`; break;
              case Data.ONE:    cellClass = `cell-1`; break;
              case Data.TWO:    cellClass = `cell-2`; break;
              case Data.THREE:  cellClass = `cell-3`; break;
              case Data.FOUR:   cellClass = `cell-4`; break;
              case Data.FIVE:   cellClass = `cell-5`; break;
              case Data.SIX:    cellClass = `cell-6`; break;
              case Data.SEVEN:  cellClass = `cell-7`; break;
              case Data.EIGHT:  cellClass = `cell-8`; break;
              default: cellClass = `cell-raised`;
            }

            return <button key={i} id={id} type="button" onMouseEnter={handleMouseEnter} className={`${style.sprite} ${cellClass} cursor-default focus:outline-none`} style={style.cell} />;
          })}
        </div>
      </div>
    </div>
  );
};

