import { useRef, useCallback } from "react";


/**
 * Typed store interface
 */
interface TypedStore {
  getBoolean: (key: string, def?: boolean) => boolean;
  getNumber: (key: string, def?: number) => number;
  getString: (key: string, def?: string) => string;
  getObject: <T>(key: string, def?: T) => T;
  setBoolean: (key: string, value: boolean) => void;
  setNumber: (key: string, value: number) => void;
  setString: (key: string, value: string) => void;
  setObject: (key: string, value: unknown) => void;
}


/**
 * Typed store hook
 */
export const useTypedStore = (): TypedStore => {
  // Get boolean item
  const getBoolean = useCallback((key: string, def = false) => {
    const value = localStorage.getItem(key);
    console.log(value);
    return value === null ? def : value === `1`;
  }, []);

  // Get number item
  const getNumber = useCallback((key: string, def = NaN) => {
    const value = localStorage.getItem(key);
    return value === null ? def : Number(value);
  }, []);

  // Get string item
  const getString = useCallback((key: string, def = ``) => {
    const value = localStorage.getItem(key);
    return value === null ? def : value;
  }, []);

  // Get object item
  const getObject = useCallback((key: string, def = {}) => {
    const value = localStorage.getItem(key);
    return value === null ? def : JSON.parse(value);
  }, []);


  // Set boolean item
  const setBoolean = useCallback((key: string, value: boolean) => {
    localStorage.setItem(key, value ? `1` : `0`);
  }, []);

  // Set number item
  const setNumber = useCallback((key: string, value: number) => {
    localStorage.setItem(key, value.toString());
  }, []);

  // Set number item
  const setString = useCallback((key: string, value: string) => {
    localStorage.setItem(key, value);
  }, []);

  // Set number item
  const setObject = useCallback((key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);


  // Hook
  const store = useRef<TypedStore>({
    getBoolean,
    getNumber,
    getString,
    getObject,
    setBoolean,
    setNumber,
    setString,
    setObject
  });

  return store.current;
};
