import React, { useState, useCallback } from "react";

import { Modal } from "../components/modal";


/**
 * Controlls component properties interface
 */
interface Props {
  readonly onClose: () => void;
}


/**
 * Controlls component
 *
 * @param props Controlls properties
 */
const Controlls = ({ onClose }: Props) => {


  // Return modal
  return (
    <Modal onClose={onClose}>

    </Modal>
  );
};


/**
 * Controlls modal hook
 */
export const useControlls = (): [ () => JSX.Element | null , () => void ] => {
  const [ show, setShow ] = useState(false);

  // Close modal
  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  // Open modal
  const open = useCallback(() => {
    setShow(true);
  }, []);

  // Controlls modal
  const controlls = useCallback(() =>
    show ? <Controlls onClose={handleClose} /> : null
  , [ show, handleClose ]);


  // Return hook
  return [ controlls, open ];
};
