import React, { useCallback, HTMLAttributes, MouseEvent, KeyboardEvent } from "react";

import { noop } from "../utils/helpers";


/**
 * Modal properties interfaces
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
    <div tabIndex={-1} onKeyDown={handleKeyDown} className="fixed inset-0 z-10">
      <div onClick={handleClick} className="flex items-center justify-center h-full">
        <div className="break-words bg-white border-4 border-navy outline outline-black overflow-y-auto cursor-default max-w-4/5 max-h-4/5">
          <div {...props }>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
