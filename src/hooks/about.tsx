import React, { useRef, useState, useCallback } from "react";
import { Button } from "../components/button";

import { Modal } from "../components/modal";

import icon from "../images/icon.png";


/**
 * About component properties interface
 */
interface Props {
  readonly onClose: () => void;
}


/**
 * About component
 *
 * @param props About properties
 */
const About = ({ onClose }: Props) => {
  const submitButton = useRef<HTMLButtonElement>(null);


  // Return modal
  return (
    <Modal onClose={onClose} className="flex text-sm md:text-base m-6">
      {/* Icon */}
      <img src={icon} className="inline box-content w-8 h-8 mr-4" />

      <div className="font-bold">
        <h2 className="mb-6">Web minesweeper</h2>

        <p>
          Web version of the classic minesweeper. Developed from scratch using
          Gatsby and TailwindCSS. Inspired by the version of Robert Donner and
          Curt Johnson for Microsoft Windows 3.11.
        </p>
        <hr className="border-b-2 border-black my-3" />
        <p className="mb-1">
          Licensed under the <a href="https://github.com/erincones/web-minesweeper/blob/master/LICENSE" className="text-navy visited:text-purple">MIT license</a>.
        </p>
        <p className="mb-1">
          Source code: <a href="https://github.com/erincones/web-minesweeper" className="text-navy break-all visited:text-purple">https://github.com/erincones/web-minesweeper</a>
        </p>
        <p className="mb-4">
          Copyright © 2020 Erick Rincones.
        </p>

        <div className="text-center">
          <Button ref={submitButton} next={submitButton} onClick={onClose} className="mx-4">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};


/**
 * About modal hook
 */
export const useAbout = (): [ () => JSX.Element | null , () => void ] => {
  const [ show, setShow ] = useState(false);

  // Close modal
  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  // Open modal
  const open = useCallback(() => {
    setShow(true);
  }, []);

  // About modal
  const about = useCallback(() =>
    show ? <About onClose={handleClose} /> : null
  , [ show, handleClose ]);


  // Return hook
  return [ about, open ];
};
