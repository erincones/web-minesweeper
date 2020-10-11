import React, { forwardRef, useCallback, ButtonHTMLAttributes, KeyboardEvent, FocusEvent, useState, useMemo, ForwardRefRenderFunction, MutableRefObject } from "react";


/**
 * Button properties interface
 */
interface Props {
  readonly children: string;
  readonly type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
  readonly next?: MutableRefObject<HTMLElement | null>;
  readonly prev?: MutableRefObject<HTMLElement | null>;
  readonly className?: string;
}


/**
 * Button component
 *
 * @param props Button properties
 */
const Component: ForwardRefRenderFunction<HTMLButtonElement, Props> = ({ children, type = `submit`, next, prev, className }: Props, ref): JSX.Element => {
  const [ focus, setFocus ] = useState(false);

  // Syles
  const styles = useMemo(() => {
    const pos = focus ?
      { top: -4, right: -2, bottom: -2, left: -4 } :
      { top: -3, right: -3, bottom: -3, left: -3 };

    return {
      text: `leading-none${focus ? ` outline outline-dotted outline-gray` : ``}`,
      topLeft: { top: pos.top, left: pos.left },
      topRight: { top: pos.top, right: pos.right },
      bottomLeft: { bottom: pos.bottom, left: pos.left },
      bottomRight: { bottom: pos.bottom, right: pos.right }
    };
  }, [ focus ]);


  // Key down handler
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === `Tab`) {
      event.preventDefault();

      if (event.shiftKey) {
        if (prev?.current instanceof HTMLElement) {
          prev.current.focus();
        }
      }
      else if (next?.current instanceof HTMLElement) {
        next.current.focus();
      }
    }
  }, [ next, prev ]);

  // Focus handler
  const handleFocus = useCallback(() => {
    setFocus(true);
  }, []);

  // Blur handler
  const handleBlur = useCallback((event: FocusEvent<HTMLButtonElement>) => {
    // Focus the next element
    if ((event.relatedTarget !== next?.current) && (event.relatedTarget !== prev?.current) && (next?.current instanceof HTMLElement)) {
      event.preventDefault();
      next.current.focus();
    }

    // Blur button
    setFocus(false);
  }, [ next, prev ]);


  // Return button
  return (
    <button ref={ref} type={type} onKeyDown={handleKeyDown} onFocus={handleFocus} onBlur={handleBlur} className="relative font-bold bg-silver border-2 outline outline-black border-raised focus:outline focus:outline-black active:outline-2 active:border-b-0 active:border-r-0 active:border-gray active:mb-2px active:mr-2px">
      {/* Corners */}
      <div className="absolute bg-white w-px h-px" style={styles.topLeft}/>
      <div className="absolute bg-white w-px h-px" style={styles.topRight}/>
      <div className="absolute bg-white w-px h-px" style={styles.bottomLeft}/>
      <div className="absolute bg-white w-px h-px" style={styles.bottomRight}/>

      {/* Text */}
      <div className={className}>
        <span className={styles.text}>{children}</span>
      </div>
    </button>
  );
};


Component.displayName = `Button`;
export const Button = forwardRef(Component);
