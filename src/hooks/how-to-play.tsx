import React, { useRef, useState, useCallback } from "react";

import { Modal } from "../components/modal";
import { Button } from "../components/button";


/**
 * How to play component properties interface
 */
interface Props {
  readonly onClose: () => void;
}


/**
 * How to play component
 *
 * @param props How to play properties
 */
const HowToPlay = ({ onClose }: Props) => {
  const submitButton = useRef<HTMLButtonElement>(null);


  // Return modal
  return (
    <Modal onClose={onClose} className="text-sm md:text-base font-bold pt-6 px-5 pb-3">
      <h2 className="text-center mb-5">How To Play</h2>

      <p className="font-normal mb-2">
        The object of Minesweeper is to correctly mark all mines as quickly as
        possible without uncovering one. The following section explains how to
        play the game.
      </p>

      <dl className="mb-4">
        <dd>To choose a skill level</dd>
        <dt className="font-normal ml-2">
          From the Game menu, choose Beginner, Intermediate, or Expert. The
          higher the skill level, the longer the mine field.
        </dt>

        <dd>To start a new game</dd>
        <dt className="font-normal ml-2">
          From the Game menu, choose New game. Or you can click the yellow
          &quot;happy face&quot; at the top of the game board.
        </dt>

        <dd>To locate mines</dd>
        <dt className="font-normal ml-2">
          <ol className="list-decimal ml-4">
            <li>
              To uncover a square, select it using the left mouse button. If the
              square is a mine, you lose.
            </li>
            <li>
              If the square isn&apos;t a mine, a number appears. This number
              represents the number of mines in the surrounding eight squares.
            </li>
            <li>
              To mark a square as a mine, select it with the right mouse button. <br />
              To mark a square you are uncertain about, point to it and click
              twice with the right mouse button. This marks the square with a
              question mark (?). Later, you can either mark the square as a
              mine, or uncover it.
            </li>
          </ol>
        </dt>
      </dl>

      <p className="font-normal mb-4">
        For a more detailed description, visit <a className="text-navy break-all visited:text-purple font-bold focus:outline focus:outline-dotted focus:outline-gray" href="http://www.minesweeper.info/wiki/Strategy">the Strategy article of the MinesweeperWiki</a>.
      </p>


      <div className="text-center">
        <Button ref={submitButton} next={submitButton} onClick={onClose} className="mx-4">
          Close
        </Button>
      </div>
    </Modal>
  );
};


/**
 * How to play modal hook
 */
export const useHowToPlay = (): [ () => JSX.Element | null , () => void ] => {
  const [ show, setShow ] = useState(false);

  // Close modal
  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  // Open modal
  const open = useCallback(() => {
    setShow(true);
  }, []);

  // How to play modal
  const howToPlay = useCallback(() =>
    show ? <HowToPlay onClose={handleClose} /> : null
  , [ show, handleClose ]);


  // Return hook
  return [ howToPlay, open ];
};
