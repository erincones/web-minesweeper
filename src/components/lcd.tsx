import React, { useMemo, CSSProperties } from "react";
import { Corners } from "./corners";


/**
 * LCD properties interface
 */
interface Props {
  readonly number: number;
  readonly sprite?: `sprite` | `sprite pixelated`;
  readonly styles: {
    readonly container: CSSProperties;
    readonly corners: CSSProperties;
    readonly digit: CSSProperties;
  };
}


// Get digit class
const digitClass = (digit: number): string => {
  switch (digit) {
    case 0: return `digit-0`;
    case 1: return `digit-1`;
    case 2: return `digit-2`;
    case 3: return `digit-3`;
    case 4: return `digit-4`;
    case 5: return `digit-5`;
    case 6: return `digit-6`;
    case 7: return `digit-7`;
    case 8: return `digit-8`;
    case 9: return `digit-9`;
    default: return ``;
  }
};


/**
 * LCD component
 *
 * @param props LCD properties
 */
export const LCD = ({ number, sprite = `sprite`, styles }: Props): JSX.Element => {
  // Number digits
  const digits = useMemo(() => {
    if (number < 0) {
      const value = Math.min(-number, 99);
      return [
        `digit-minus`,
        digitClass(Math.trunc(value / 10)),
        digitClass(value % 10)
      ];
    }
    else {
      const value = Math.min(number, 999);
      return [
        digitClass(Math.trunc(value / 100)),
        digitClass(Math.trunc(value / 10) % 10),
        digitClass(value % 10)
      ];
    }
  }, [ number ]);


  // Return LCD
  return (
    <div className="relative flex border-sunken mb-auto" style={styles.container}>
      <Corners type="flat" style={styles.corners} />

      {/* Digits */}
      <div className={`${sprite} ${digits[0]}`} style={styles.digit} />
      <div className={`${sprite} ${digits[1]}`} style={styles.digit} />
      <div className={`${sprite} ${digits[2]}`} style={styles.digit} />
    </div>
  );
};
