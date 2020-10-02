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
  readonly active: number;
  readonly sunken: boolean;
}

/**
 * Cell interface
 */
interface Cell {
  readonly state: `new` | `flag` | `interrogation` | `exploded` | number,
  readonly empty: boolean
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
 * Get the face class
 *
 * @param sunken Sunken status
 * @param status Game status
 */
const faceClass = (sunken: Sunken, status: string): string => {
  // Other than face
  if (sunken.active !== -1) {
    return sunken.sunken ? `face-surprised` : `face-smile`;
  }

  // Sunken face
  if (sunken.sunken) {
    return `face-sunken`;
  }

  // Game status
  switch (status) {
    case `dead`: return `face-dead`;
    case `win`: return `face-win`;
    default: return `face-smile`;
  }
};

/**
 * Get cell class
 *
 * @param cell Board cell
 * @param status Game status
 */
const cellClass = (cell: Cell, sunken: boolean, status: string): string => {
  const isSunken = sunken && status === `playing`;
  const mine = status === `exploded` && !cell.empty;

  switch (cell.state) {
    case `new`: return mine ? `cell-mine` : isSunken ? `cell-empty` : `cell-new`;
    case `flag`: return mine ? `cell-mine-wrong` : `cell-flag`;
    case `interrogation`: return isSunken ? `cell-interrogation-sunken` : `cell-interrogation`;
    case `exploded`: return `cell-mine-exploded`;
    case 0: return `cell-empty`;
    case 1: return `cell-1`;
    case 2: return `cell-2`;
    case 3: return `cell-3`;
    case 4: return `cell-4`;
    case 5: return `cell-5`;
    case 6: return `cell-6`;
    case 7: return `cell-7`;
    case 8: return `cell-8`;
    default: return `cell-new`;
  }
};


/**
 * Minesweeper component
 *
 * @param props Minesweeper properties
 */
export const Minesweeper = ({ game = { rows: 9, columns: 9, mines: 10 }, scale = 1 }: Props): JSX.Element => {
  const [ { rows, columns, mines }, setGame ] = useState<Game>(game);
  const [ exploded, setExploded ] = useState(false);
  const [ sunken, setSunken ] = useState<Sunken>({ active: NaN, sunken: false });
  const [ board, setBoard ] = useState<Cell[]>([]);


  // Fix game
  useEffect(() => {
    const rows = Math.min(Math.max(game.rows, 8), 24);
    const columns = Math.min(Math.max(game.columns, 8), 30);
    const mines = Math.min(Math.max(game.mines, 10), (rows - 1) * (columns - 1));

    setGame({ rows, columns, mines });
  }, [ game ]);

  // New game
  useEffect(() => {
    const cells = rows * columns;
    const board = Array<Cell>(cells).fill({ state: `new`, empty: true });
    let remaining = mines;

    while (remaining > 0) {
      const mine = Math.trunc(Math.random() * cells);

      if (board[mine].empty) {
        board[mine] = { state: `new`, empty: false };
        remaining--;
      }
    }

    setBoard(board);
  }, [ rows, columns, mines ]);

  // Global mouse up listener
  useEffect(() => {
    const handleMouseUp = (event: globalThis.MouseEvent) => {
      event.preventDefault();

      const id = parseInt((event.target as HTMLElement).id);
      console.log(`Mouse up: [ ${id}, ${event.buttons} ]`);

      setSunken({ active: NaN, sunken: false });
    };

    document.addEventListener(`mouseup`, handleMouseUp);
    return () => { document.removeEventListener(`mouseup`, handleMouseUp); };
  }, []);


  // Mouse down
  const handleMouseDown = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const id = parseInt(target.id);

    console.log(`Mouse down: [ ${id}, ${event.buttons} ]`);

    setSunken({ active: id, sunken: true });
  }, []);

  // Mouse enter callback
  const handleMouseEnter = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!isNaN(sunken.active) && (event.buttons !== 0)) {
      const target = event.currentTarget;
      const id = parseInt(target.id);

      console.log(`Mouse enter: [ ${sunken.active}, ${id}, ${event.buttons} ]`);

      if ((sunken.active < 0) === (id < 0)) {
        setSunken({ active: id, sunken: (event.buttons & 1) === 1 });
      }
    }
  }, [ sunken.active ]);

  // Mouse leave callback
  const handleMouseLeave = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!isNaN(sunken.active) && (event.buttons > 0)) {
      const target = event.currentTarget;
      const id = parseInt(target.id);

      console.log(`Mouse leave: [ ${sunken.active}, ${id}, ${event.buttons} ]`);

      if ((sunken.active < 0) === (id < 0)) {
        setSunken({ active: id, sunken: false });
      }
    }
  }, [ sunken.active ]);

  // Context menu callback
  const handleContextMenu = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);


  // Game status
  const status = useMemo(() => {
    if (exploded) {
      return `exploded`;
    }

    let sunkens = 0;

    for (const cell of board) {
      if (typeof cell.state === `number`) {
        sunkens++;
      }
    }

    return sunkens < (rows * columns - mines) ? `playing` : `win`;
  }, [ exploded, board, rows, columns, mines ]);

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


  // Return the minesweeper game
  return (
    <div onContextMenu={e => { handleContextMenu(e); }} className="inline-block border-black" style={style.container}>
      <div className="relative bg-silver border-raised" style={style.game}>
        <Corners type="raised" sprite={style.sprite} style={style.corners3} />

        {/* Header */}
        <div className="relative flex justify-between border-sunken" style={style.header}>
          <Corners type="sunken" sprite={style.sprite} style={style.corners2} />

          {/* LCDs and face */}
          <LCD number={mines} sprite={style.sprite} styles={{ container: style.mines, corners: style.corners1, digit: style.digit }} />
          <button id="-1" type="button" onMouseDown={e => { handleMouseDown(e); }} onMouseEnter={e => { handleMouseEnter(e); }} onMouseLeave={e => { handleMouseLeave(e); }} className={`${style.sprite} face ${faceClass(sunken, status)} cursor-default focus:outline-none`} style={style.face} />
          <LCD number={0} sprite={style.sprite} styles={{ container: style.time, corners: style.corners1, digit: style.digit }} />
        </div>


        {/* Board */}
        <div className="relative flex flex-wrap border-sunken" style={style.board}>
          <Corners type="sunken" sprite={style.sprite} style={style.corners3} />

          {/* Cells */}
          {board.map((cell, i) => (
            <button key={i} id={i.toString()} type="button" onMouseDown={e => { handleMouseDown(e); }} onMouseEnter={e => { handleMouseEnter(e); }} onMouseLeave={e => { handleMouseLeave(e); }} className={`${style.sprite} ${cellClass(cell, (sunken.active === i) && sunken.sunken, status)} cursor-default focus:outline-none`} style={style.cell} />
          ))}
        </div>
      </div>
    </div>
  );
};

