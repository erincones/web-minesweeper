import React, { useRef, useState, useCallback } from "react";

import { Modal } from "../components/modal";
import { Button } from "../components/button";


/**
 * Controls component properties interface
 */
interface Props {
  readonly onClose: () => void;
}


/**
 * Controls component
 *
 * @param props Controls properties
 */
const Controls = ({ onClose }: Props) => {
  const submitButton = useRef<HTMLButtonElement>(null);


  // Return modal
  return (
    <Modal onClose={onClose} className="text-sm md:text-base font-bold pt-6 px-5 pb-3">
      <h2 className="text-center mb-5">Controls</h2>

      <h3 className="mb-2">General</h3>
      <dl>
        <dd>Press the happy face</dd>
        <dt className="font-normal ml-2">Start new game.</dt>
      </dl>

      <hr className="border-b-2 border-black my-4" />

      <h3 className="mb-2">Desktop</h3>
      <dl>
        <dt>Left click</dt>
        <dd className="font-normal ml-2">Discover empty square.</dd>

        <dt>Right click</dt>
        <dd className="font-normal ml-2">Toggle flag and question marks.</dd>

        <dt>Both click or mouse wheel</dt>
        <dd className="font-normal ml-2">Reveal squares around number.</dd>
      </dl>

      <hr className="border-b-2 border-black my-4" />

      <h3 className="mb-2">Mobile</h3>
      <dl className="mb-4">
        <dt>Coming soon</dt>
        <dd className="font-normal ml-2">For now, just touch an square cell to discover it.</dd>
      </dl>


      <div className="text-center">
        <Button ref={submitButton} next={submitButton} onClick={onClose} className="mx-4">
          Close
        </Button>
      </div>
    </Modal>
  );
};


/**
 * Controls modal hook
 */
export const useControls = (): [ () => JSX.Element | null , () => void ] => {
  const [ show, setShow ] = useState(false);

  // Close modal
  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  // Open modal
  const open = useCallback(() => {
    setShow(true);
  }, []);

  // Controls modal
  const controls = useCallback(() =>
    show ? <Controls onClose={handleClose} /> : null
  , [ show, handleClose ]);


  // Return hook
  return [ controls, open ];
};
