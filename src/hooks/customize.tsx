import React, { useRef, useState, useCallback, ChangeEvent, KeyboardEvent } from "react";

import { Game } from "../components/minesweeper";
import { Modal } from "../components/modal";
import { Button } from "../components/button";

import { noop } from "../utils/helpers";


/**
 * Base component properties interface
 */
interface Props {
  readonly game: Game;
}

/**
 * Customize properties interface
 */
interface CustomizeProps extends Props {
  readonly onClose: (game: Game) => void;
}


/**
 * Customize component
 *
 * @param props Customize properties
 */
const Customize = ({ game, onClose }: CustomizeProps): JSX.Element => {
  const heightInput = useRef<HTMLInputElement>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const [ height, setHeight ] = useState(game.rows.toString());
  const [ width, setWidth ] = useState(game.columns.toString());
  const [ mines, setMines ] = useState(game.mines.toString());


  // Rows change handler
  const handleHeightChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setHeight(event.target.value.slice(0, 3));
  }, []);

  // Columns change handler
  const handleWidthChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setWidth(event.target.value.slice(0, 3));
  }, []);

  // Mines change handler
  const handleMinesChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMines(event.target.value.slice(0, 3));
  }, []);

  // Key down handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.key === `Tab`) && event.shiftKey) {
      event.preventDefault();
      submitButton.current?.focus();
    }
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    onClose(game);
  }, [ game, onClose ]);

  // Handle submit
  const handleSubmit = () => {
    // Parse values
    const rows = parseInt(height);
    const cols = parseInt(width);
    const bombs = parseInt(mines);

    // Set fixed values
    onClose({
      rows:    isNaN(rows) ? 8 : rows,
      columns: isNaN(cols) ? 8 : cols,
      mines:   isNaN(bombs) ? 10 : bombs
    });
  };


  // Return modal
  return (
    <Modal onClose={handleClose} className="text-sm md:text-base font-bold pt-6 px-5 pb-3">
      {/* Title */}
      <h2 className="text-center mb-5">Custom Field</h2>

      <form noValidate onSubmit={handleSubmit}>
        <div className="flex items-stretch">
          {/* Input fields */}
          <table className="mr-4 md:mr-8">
            <tbody>
              <tr>
                <td><label htmlFor="height" className="mr-2 md:mr-4">Height:</label></td>
                <td><input ref={heightInput} id="height" autoFocus value={height} size={3} inputMode="numeric" onChange={handleHeightChange} onKeyDown={handleKeyDown} className="leading-none font-bold border border-black outline-none p-1 mb-1" /></td>
              </tr>
              <tr>
                <td><label htmlFor="width" className="mr-2 md:mr-4">Width:</label></td>
                <td><input id="width" value={width} size={3} inputMode="numeric" onChange={handleWidthChange} className="leading-none font-bold border border-black outline-none p-1 mb-1" /></td>
              </tr>
              <tr>
                <td><label htmlFor="mines" className="mr-2 md:mr-4">Mines:</label></td>
                <td><input id="mines" value={mines} size={3} inputMode="numeric" onChange={handleMinesChange} className="leading-none font-bold border border-black outline-none p-1" /></td>
              </tr>
            </tbody>
          </table>

          {/* Submit button */}
          <Button ref={submitButton} next={heightInput} className="mx-4">
            Ok
          </Button>
        </div>
      </form>
    </Modal>
  );
};


/**
 * Customize modal hook
 *
 * @param onClose Close handler
 */
export const useCustomize = (onClose: (game: Game) => void = noop): [ (props: Props) => JSX.Element | null , () => void ] => {
  const [ show, setShow ] = useState(false);

  // Close modal
  const handleClose = useCallback((game: Game) => {
    onClose(game);
    setShow(false);
  }, [ onClose ]);

  // Open modal
  const open = useCallback(() => {
    setShow(true);
  }, []);

  // Customize modal
  const customize = useCallback(({ game }: Props) =>
    show ? <Customize game={game} onClose={handleClose} /> : null
  , [ show, handleClose ]);


  // Return hook
  return [ customize, open ];
};
