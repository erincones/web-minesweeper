import React, { useState, useCallback } from "react";

import { Modal } from "../components/modal";


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


  // Return modal
  return (
    <Modal onClose={onClose}>

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
