import React, { useRef, useState, useCallback, KeyboardEvent, ChangeEvent } from "react";

import { Modal } from "../components/modal";
import { Button } from "../components/button";

import { noop } from "../utils/helpers";


/**
 * Base component properties interface
 */
interface Props {
  readonly scale: number;
}

/**
 * Customize properties interface
 */
interface ScaleProps extends Props {
  readonly onChange: (scale: number) => void;
  readonly onClose: () => void;
}


/**
 * Scale component
 *
 * @param props Customize properties
 */
const Scale = ({ scale, onChange, onClose }: ScaleProps): JSX.Element => {
  const halfInput = useRef<HTMLButtonElement>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const [ zoom, setZoom ] = useState(scale.toString());


  // Change scale
  const change = useCallback((scale: number) =>
    () => { onChange(scale); }
  , [ onChange ]);

  // Scale change handler
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    // Change scale
    const scaled = parseInt(event.target.value);

    if (!isNaN(scaled)) {
      onChange(Math.min(Math.max(scaled, 50), 500));
    }

    // Update zoom
    setZoom(event.target.value.slice(0, 3));
  }, [ onChange ]);

  // Key down handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.key === `Tab`) && event.shiftKey) {
      event.preventDefault();
      submitButton.current?.focus();
    }
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    onClose();
  }, [ onClose ]);


  // Return modal
  return (
    <Modal onClose={handleClose} className="text-sm md:text-base font-bold pt-6 px-5 pb-3">
      {/* Title */}
      <h2 className="text-center mb-5">Scale</h2>

      <form noValidate onSubmit={handleClose}>
        {/* Input fields */}
        <div className="flex">
          <div className="flex">
            <button ref={halfInput} id="half" type="button" autoFocus={zoom === `50`} onClick={change(50)} onKeyDown={handleKeyDown} className="border border-black rounded-full my-auto focus:outline focus:outline-dotted focus:outline-gray mr-2 w-4 h-4">
              <span className={`${scale === 50 ? `block` : `hidden`} bg-black rounded-full w-2 h-2 mx-auto`} />
            </button>
          </div>
          <label htmlFor="half">50%</label>
        </div>
        <div className="flex">
          <div className="flex">
            <button id="full" type="button" autoFocus={zoom === `100`} onClick={change(100)} className="border border-black rounded-full my-auto focus:outline focus:outline-dotted focus:outline-gray mr-2 w-4 h-4">
              <span className={`${scale === 100 ? `block` : `hidden`} bg-black rounded-full w-2 h-2 mx-auto`} />
            </button>
          </div>
          <label htmlFor="full">100%</label>
        </div>
        <div className="flex">
          <div className="flex">
            <button id="double" type="button" autoFocus={zoom === `200`} onClick={change(200)} className="border border-black rounded-full my-auto focus:outline focus:outline-dotted focus:outline-gray mr-2 w-4 h-4">
              <span className={`${scale === 200 ? `block` : `hidden`} bg-black rounded-full w-2 h-2 mx-auto`} />
            </button>
          </div>
          <label htmlFor="double">200%</label>
        </div>
        <div className="flex">
          <div className="flex">
            <button id="triple" type="button" autoFocus={zoom === `300`} onClick={change(300)} className="border border-black rounded-full my-auto focus:outline focus:outline-dotted focus:outline-gray mr-2 w-4 h-4">
              <span className={`${scale === 300 ? `block` : `hidden`} bg-black rounded-full w-2 h-2 mx-auto`} />
            </button>
          </div>
          <label htmlFor="triple">300%</label>
        </div>
        <div className="flex mb-2">
          <label htmlFor="custom" className="mr-4 ml-6">Custom:</label>
          <input id="custom" value={zoom} size={3} inputMode="numeric" onChange={handleChange} className="leading-none font-bold border border-black outline-none p-1" />
        </div>

        {/* Submit button */}
        <div className="text-center">
          <Button ref={submitButton} next={halfInput} className="mx-4">
            Close
          </Button>
        </div>
      </form>
    </Modal>
  );
};


/**
 * Scale modal hook
 *
 * @param onChange Change handler
 */
export const useScale = (onChange: (scale: number) => void = noop): [ (props: Props) => JSX.Element | null , () => void ] => {
  const [ show, setShow ] = useState(false);

  // Close modal
  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  // Open modal
  const open = useCallback(() => {
    setShow(true);
  }, []);

  // Customize modal
  const scale = useCallback(({ scale }: Props) =>
    show ? <Scale scale={scale} onChange={onChange} onClose={handleClose} /> : null
  , [ show, onChange, handleClose ]);


  // Return hook
  return [ scale, open ];
};
