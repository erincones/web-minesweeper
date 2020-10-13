import React, { useState, useCallback } from "react";

import { Modal } from "../components/modal";


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


  // Return modal
  return (
    <Modal onClose={onClose}>

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
