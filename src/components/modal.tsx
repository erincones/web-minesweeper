import React, { useCallback, HTMLAttributes, MouseEvent, KeyboardEvent } from "react";

import { noop } from "../utils/helpers";


/**
 * Model properties interfaces
 */
interface Props extends HTMLAttributes<HTMLDivElement> {
  readonly onClose?: () => void;
}


/**
 * Modal component
 *
 * @param props Modal properties
 */
export const Modal = ({ children, onClose = noop, ...props }: Props): JSX.Element => {
  // Close callback
  const close = useCallback(() => {
    onClose();
  }, [ onClose ]);

  // Click handler
  const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) {
      event.preventDefault();
      close();
    }
  }, [ close ]);

  // Key down handler
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === `Escape`) {
      close();
    }
  }, [ close ]);


  // Return modal
  return (
    <div onKeyDown={handleKeyDown} className="fixed inset-0 z-10 overflow-y-auto">
      <div onClick={handleClick} className="flex justify-center min-h-full">
        <div className="bg-white border-4 border-navy outline outline-black cursor-default m-auto">
          <div {...props }>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
