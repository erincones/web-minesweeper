import React, { useState, useCallback, useEffect, MouseEvent, KeyboardEvent, useRef } from "react";

import { initialSunken, MouseButtons, Sunken } from "../utils/sunken";


/**
 * Menu bar properties interface
 */
interface Props {
  readonly entries: MenuEntry[];
}


/**
 * Menu bar entries interface
 */
export interface MenuEntry {
  readonly label: string;
  readonly items: (EntryItem | `separator`)[];
}

/**
 * Entry item interface
 */
interface EntryItem {
  readonly label: string;
  readonly callback: () => void;
  readonly checked?: boolean;
}


/**
 * Separator component
 */
const Separator = () => <div data-mbtype="separator" className="border-b border-black my-1" />;

/**
 * Check mark component
 */
const CheckMark = () => <span data-mbtype="checkmark" className="inline-block w-4 -ml-4">&#x2713;</span>;


/**
 * Menu bar component
 *
 * @param props Menu bar component properties
 */
export const MenuBar = ({ entries }: Props): JSX.Element => {
  const [ sunken, setSunken ] = useState<Sunken>(initialSunken);
  const [ close, setClose ] = useState(false);
  const [ open, setOpen ] = useState(NaN);
  const [ focus, setFocus ] = useState(false);
  const menubar = useRef<HTMLDivElement>(null as never);


  // Fire item callback
  const fire = useCallback((entry: number, item: number) => {
    // Get target
    const target = entries[entry].items[item];

    // Fire callback
    if (target !== `separator`) {
      target.callback();
      setOpen(NaN);
    }
  }, [ entries ]);


  // Entry key down
  const handleEntryKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
    // Prevent default and get the current target
    event.preventDefault();
    const target = event.currentTarget;

    // Check key
    switch (event.key) {
      // Next menu entry
      case `ArrowRight`:
        if (target.parentNode?.nextSibling?.firstChild instanceof HTMLElement) {
          target.parentNode.nextSibling.firstChild.focus();
        }
        return;

      // Previous menu entry
      case `ArrowLeft`:
        if (target.parentNode?.previousSibling?.firstChild instanceof HTMLElement) {
          target.parentNode.previousSibling.firstChild.focus();
        }
        return;

      // Open dropdown
      case ` `:
      case `Enter`:
        setOpen(parseInt(target.dataset.mbid as string));
        setFocus(true);
    }
  }, []);

  // Item key down handler
  const handleItemKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
    // Prevent default and get the current target
    event.preventDefault();
    const target = event.currentTarget;
    const parent = target.parentNode as HTMLElement;

    // Check key
    switch (event.key) {
      // Next item
      case `ArrowDown`:
        for (let next = target.nextSibling; next !== target; next = next === null ? parent.firstChild : next.nextSibling) {
          if ((next instanceof HTMLElement) && (next.dataset.mbtype === `item`)) {
            next.focus();
            return;
          }
        }
        return;

      // Previous item
      case `ArrowUp`:
        for (let prev = target.previousSibling; prev !== target; prev = prev === null ? parent.lastChild : prev.previousSibling) {
          if ((prev instanceof HTMLElement) && (prev.dataset.mbtype === `item`)) {
            prev.focus();
            return;
          }
        }
        return;

      // Next menu entry
      case `ArrowRight`:
        setOpen(open => open === (entries.length - 1) ? 0 : open + 1);
        setFocus(true);
        return;

      // Previous menu entry
      case `ArrowLeft`:
        setOpen(open => open === 0 ? entries.length - 1 : open - 1);
        setFocus(true);
        return;

      // Fire callback
      case ` `:
      case `Enter`:
        fire(open, parseInt(target.dataset.mbid as string));
        return;

      // Close dropdown
      case `Escape`:
        setOpen(NaN);
    }
  }, [ entries.length, open, fire ]);

  // Context menu handler
  const handleContextMenu = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  // Mouse enter handler
  const handleMouseEnter = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    // Prevent default, get the current target and source
    event.preventDefault();
    const target = event.currentTarget;
    const source = target.dataset.mbid === undefined ? `` : target.dataset.mbid;

    // Focus element
    if ((source.length !== 0) && ((sunken.buttons & MouseButtons.SUNKEN) !== MouseButtons.NONE)) {
      // Update open
      if (target.dataset.mbtype === `entry`) {
        setOpen(parseInt(source));
      }

      // Update focus and sunken
      target.focus();
      setSunken({
        source: sunken.source,
        target: source,
        buttons: event.buttons
      });
    }
  }, [ sunken.source, sunken.buttons ]);


  // Global mouse down handler
  useEffect(() => {
    const handleMouseDown = (event: globalThis.MouseEvent) => {
      // Prevent default and get target
      event.preventDefault();
      const target = event.target as HTMLElement;
      const source = target.dataset.mbid === undefined ? `` : target.dataset.mbid;
      const id = parseInt(source);

      // Blur active element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // Check type
      if ((event.buttons & MouseButtons.PRIMARY) === MouseButtons.PRIMARY) {
        switch (target.dataset.mbtype) {
          // Menu entry
          case `entry`:
            // Focus element
            target.focus();

            // Update close and open
            setClose(open === id);
            setOpen(id);

            // Update sunken
            setSunken({
              source: `entry${source}`,
              target: `entry${source}`,
              buttons: event.buttons
            });
            return;

          // Entry item
          case `item`:
            // Focus element
            target.focus();

            // Update sunken
            setSunken({
              source: `item${source}`,
              target: `item${source}`,
              buttons: event.buttons
            });
            return;

          case `separator`:
          case `dropdown`:
            setSunken({
              source: ``,
              target: ``,
              buttons: event.buttons
            });
            break;

          // Other element
          default:
            // Update open and sunken
            setOpen(NaN);
            setSunken({
              source: ``,
              target: ``,
              buttons: event.buttons
            });
        }
      }

      // Other buttons
      else {
        setSunken({
          source: ``,
          target: ``,
          buttons: event.buttons
        });
      }
    };

    // Register handler
    document.addEventListener(`mousedown`, handleMouseDown);


    // Remove handler
    return () => {
      document.removeEventListener(`mousedown`, handleMouseDown);
    };
  }, [ open ]);

  // Global mouse up handler
  useEffect(() => {
    const handleMouseUp = (event: globalThis.MouseEvent) => {
      // Prevent default and get target
      event.preventDefault();
      const target = event.target;
      const button = sunken.buttons ^ event.buttons;

      // Check target
      if (!(target instanceof HTMLElement)) {
        return;
      }

      // Blur active element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // Check type
      if (button === MouseButtons.PRIMARY) {
        switch (target.dataset.mbtype) {
          // Menu entry
          case `entry`:
            // Close current entry or focus first item
            close ? setOpen(NaN) : setFocus(true);
            break;

          // Entry item
          case `item`:
            // Fire callback
            fire(open, parseInt(target.dataset.mbid as string));
            break;

          // Focus first item
          case `separator`:
            setFocus(true);
            break;

          // Focus first item
          case `dropdown`:
            setFocus(true);
            break;

          // Other element
          default: setOpen(NaN);
        }
      }

      // Update sunken
      setSunken(sunken => event.buttons === MouseButtons.NONE ? {
        source: ``,
        target: ``,
        buttons: MouseButtons.NONE
      } : {
        source: sunken.source,
        target: sunken.target,
        buttons: event.buttons
      });
    };

    // Register handler
    document.addEventListener(`mouseup`, handleMouseUp);


    // Remove handler
    return () => {
      document.removeEventListener(`mouseup`, handleMouseUp);
    };
  }, [ entries, sunken, close, open, fire ]);

  // Focus dropdown
  useEffect(() => {
    // Focus item and reset
    if (!isNaN(open) && focus) {
      ((menubar.current.childNodes[open].lastChild as HTMLElement).firstChild as HTMLElement).focus();
      setFocus(false);
    }
  }, [ open, focus ]);


  // Return menu bar
  return (
    <div ref={menubar} onContextMenu={handleContextMenu} className="bg-white text-sm font-bold whitespace-no-wrap border-b border-black">
      {entries.map(({ label, items }, i) => {
        const drop = open === i;

        return (
          <div key={label} className="relative inline-block">
            {/* Menu entry */}
            <button data-mbtype="entry" data-mbid={i} type="button" onKeyDown={handleEntryKeyDown} onMouseEnter={handleMouseEnter} className={`${drop ? `bg-navy text-white ` : ``}font-bold focus:outline-none focus:bg-navy focus:text-white cursor-default px-2`}>
              {label}
            </button>

            {/* Entry items */}
            {drop &&
              <div data-mbtype="dropdown" className="absolute z-10 bg-white border border-black">
                {items.map((item, i) => (
                  item === `separator` ?
                    // Separator
                    <Separator key={i} /> :

                    // Item
                    <button key={item.label} data-mbtype="item" data-mbid={i} type="button" onKeyDown={handleItemKeyDown} onMouseEnter={handleMouseEnter} className="block text-left font-bold focus:outline-none focus:bg-navy focus:text-white cursor-default pl-4 pr-6 w-full">
                      {item.checked && <CheckMark />}
                      {item.label}
                    </button>
                ))}
              </div>
            }
          </div>
        );
      })}
    </div>
  );
};
