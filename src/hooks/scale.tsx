import React, { useRef, useState, useCallback, FocusEvent } from "react";

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
  const fullInput = useRef<HTMLButtonElement>(null);
  const tripleInput = useRef<HTMLButtonElement>(null);
  const submitButton = useRef<HTMLButtonElement>(null);


  // Scale change handler
  const handleChange = useCallback((zoom: number) =>
    () => { onChange(zoom); }
  , [ onChange ]);


  // Blur handler
  const handleBlur = useCallback((event: FocusEvent<HTMLButtonElement>) => {
    if ((submitButton.current !== null) && (event.relatedTarget !== fullInput.current)) {
      event.preventDefault();
      submitButton.current.focus();
    }
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    onClose();
  }, [ onClose ]);


  // Return modal
  return (
    <Modal onClose={handleClose} className="font-bold pt-6 px-5 pb-3">
      {/* Title */}
      <h2 className="text-center mb-5">Scale</h2>

      <form noValidate onSubmit={handleClose}>
        <input name="scale" type="hidden" value={scale} />

        {/* Input fields */}
        <div className="flex">
          <div className="flex">
            <button ref={halfInput} id="half" type="button" onClick={handleChange(50)} onBlur={handleBlur} className="border border-black rounded-full my-auto mr-2 w-4 h-4">
              <span className={`${scale === 50 ? `block` : `hidden`} bg-black rounded-full w-2 h-2 mx-auto`} />
            </button>
          </div>
          <label htmlFor="half" className="inline-block">50%</label>
        </div>
        <div className="flex">
          <div className="flex">
            <button ref={fullInput} id="full" type="button" onClick={handleChange(100)} className="border border-black rounded-full my-auto mr-2 w-4 h-4">
              <span className={`${scale === 100 ? `block` : `hidden`} bg-black rounded-full w-2 h-2 mx-auto`} />
            </button>
          </div>
          <label htmlFor="full" className="inline-block">100%</label>
        </div>
        <div className="flex items-stretch">
          <div className="flex">
            <button id="fullHalf" type="button" onClick={handleChange(150)} className="border border-black rounded-full my-auto mr-2 w-4 h-4">
              <span className={`${scale === 150 ? `block` : `hidden`} bg-black rounded-full w-2 h-2 mx-auto`} />
            </button>
          </div>
          <label htmlFor="fullHalf" className="inline-block">150%</label>
        </div>
        <div className="flex items-stretch">
          <div className="flex">
            <button id="double" type="button" onClick={handleChange(200)} className="border border-black rounded-full my-auto mr-2 w-4 h-4">
              <span className={`${scale === 200 ? `block` : `hidden`} bg-black rounded-full w-2 h-2 mx-auto`} />
            </button>
          </div>
          <label htmlFor="double" className="inline-block">200%</label>
        </div>
        <div className="flex items-stretch mb-2">
          <div className="flex">
            <button ref={tripleInput} id="triple" type="button" onClick={handleChange(300)} className="border border-black rounded-full my-auto mr-2 w-4 h-4">
              <span className={`${scale === 300 ? `block` : `hidden`} bg-black rounded-full w-2 h-2 mx-auto`} />
            </button>
          </div>
          <label htmlFor="triple" className="inline-block">300%</label>
        </div>

        {/* Submit button */}
        <div className="text-center">
          <Button ref={submitButton} next={halfInput} prev={tripleInput} className="mx-4">
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
  const scale = useCallback((show: boolean) =>
    show ? ({ scale }: Props) => <Scale scale={scale} onChange={onChange} onClose={handleClose} /> : () => null
  , [ onChange, handleClose ]);


  // Return hook
  return [ scale(show), open ];
};
