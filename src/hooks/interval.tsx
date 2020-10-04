import { useState, useEffect, useCallback, useRef, Dispatch, SetStateAction } from "react";


/**
 * Interval interface
 */
export interface Interval {
  readonly handler: () => void;
  readonly tick: number;
  readonly running: boolean;
  readonly setHandler: (handler: () => void) => void;
  readonly setTick: Dispatch<SetStateAction<number>>;
  readonly setRunning: (running: boolean) => void
}


/**
 * Interval hook
 *
 * @param handler Handler function
 * @param tick Milliseconds between handler calls
 * @param running Running status
 */
export const useInterval = (handler: () => void, tick: number, start = true): Interval => {
  const callback = useRef(handler);
  const interval = useRef(0);
  const [ period, setPeriod ] = useState(tick);
  const [ running, setRunning ] = useState(start);


  // Update handler
  const setHandler = useCallback((handler: () => void) => {
    callback.current = handler;
  }, []);

  // Clear interval
  const clear = useCallback(() => {
    window.clearInterval(interval.current);
  }, []);


  // Update handler effect
  useEffect(() => {
    // Clear previous interval
    if (interval.current !== 0) {
      clear();
    }

    // Set new interval
    interval.current = running ? window.setInterval(() => { callback.current(); }, period) : 0;

    // Clear interval
    return clear;
  }, [ running, period, clear ]);

  // Update period and running status effect
  useEffect(() => {
    const tick = Math.max(10, period);
    setPeriod(period > 0 ? tick : 0);
    setRunning(running && (tick > 0));
  }, [ period, running ]);


  return {
    handler: callback.current,
    tick: period,
    running: running,
    setHandler: setHandler,
    setTick: setPeriod,
    setRunning: setRunning
  };
};
