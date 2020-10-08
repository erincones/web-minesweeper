/**
 * Sunken interface
 */
export interface Sunken {
  readonly source: string;
  readonly target: string;
  readonly buttons: number;
}

/**
 * Mouse button enumeration
 */
export enum MouseButtons {
  NONE = 0,
  PRIMARY = 1,
  SECONDARY = 2,
  BOTH = 3,
  AUXILIAR = 4,
  SUNKEN = 5,
  ANY = 7
}


/**
 * Initial sunken state
 */
export const initialSunken: Sunken = {
  source: ``,
  target: ``,
  buttons: MouseButtons.NONE
};
