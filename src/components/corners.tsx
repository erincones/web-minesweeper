import React, { CSSProperties, useMemo } from "react";


/**
 * Corners properties interface
 */
interface Props {
  readonly type: `raised` | `sunken` | `flat`;
  readonly sprite?: `sprite` | `sprite pixelated`;
  readonly style: CSSProperties;
}


/**
 * Corners element
 *
 * @param props Corners properties
 */
export const Corners = ({ type, sprite = `sprite`, style }: Props): JSX.Element => {
  // Corners classes
  const className = useMemo(() => {
    switch (type) {
      case `raised`: return `${sprite} corner-raised`;
      case `sunken`: return `${sprite} corner-sunken`;
      default: return `bg-silver`;
    }
  }, [ type, sprite ]);

  // Corners styles
  const styles = useMemo(() => {
    const position = -(style.width as number);

    return {
      topRight: {
        ...style,
        top: position,
        right: position
      },
      bottomLeft: {
        ...style,
        bottom: position,
        left: position
      }
    };
  }, [ style ]);


  // Return corners
  return (
    <>
      <div className={`absolute ${className}`} style={styles.topRight} />
      <div className={`absolute ${className}`} style={styles.bottomLeft} />
    </>
  );
};
