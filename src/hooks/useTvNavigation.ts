import { useState, useEffect, useCallback, useRef } from "react";
import { FocusItem, PageType } from "../types";

export function useTvNavigation(
  activePage: PageType,
  setActivePage: (p: PageType) => void,
  focusList: FocusItem[],
  onExecute: (item: FocusItem) => void,
  videoPlayerOpen: boolean,
  closePlayer: () => void
) {
  const [currentId, setCurrentId] = useState<string>("sidebar-home");
  
  // Keep ref to avoid stale closure in keyboard event listener
  const focusListRef = useRef<FocusItem[]>(focusList);
  useEffect(() => {
    focusListRef.current = focusList;
  }, [focusList]);

  const activePageRef = useRef<PageType>(activePage);
  useEffect(() => {
    activePageRef.current = activePage;
  }, [activePage]);

  const playerOpenRef = useRef<boolean>(videoPlayerOpen);
  useEffect(() => {
    playerOpenRef.current = videoPlayerOpen;
  }, [videoPlayerOpen]);

  // Reset focus to top-left of main content or current page's sidebar item when page changes
  useEffect(() => {
    if (activePage) {
      setCurrentId(`sidebar-${activePage}`);
    }
  }, [activePage]);

  // Command execution helper
  const triggerAction = useCallback((item: FocusItem) => {
    if (!item) return;
    
    // Default system handlers for quick navigation
    if (item.actionType === "navigate") {
      const pageTo = item.actionData as PageType;
      setActivePage(pageTo);
    } else {
      // Pass other triggers (search, play, action) up to the main App processor
      onExecute(item);
    }
  }, [setActivePage, onExecute]);

  // Core spatial navigation calculator
  const moveFocus = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const list = focusListRef.current;
    const current = list.find(f => f.id === currentId);
    if (!current) {
      // Recovery fallback
      if (list.length > 0) {
        setCurrentId(list[0].id);
      }
      return;
    }

    let nextItem: FocusItem | undefined;

    if (direction === "UP") {
      if (current.section === "sidebar") {
        // Find sidebar item above
        nextItem = list.find(
          f => f.section === "sidebar" && f.row === current.row - 1
        );
      } else {
        // Find main content item in the row above
        const targetRow = current.row - 1;
        // Search items in targetRow, try to match col, or closest col, or first available
        const rowItems = list.filter(f => f.section === "main" && f.row === targetRow);
        if (rowItems.length > 0) {
          nextItem = rowItems.find(f => f.col === current.col) || rowItems[0];
        }
      }
    } else if (direction === "DOWN") {
      if (current.section === "sidebar") {
        // Find sidebar item below
        nextItem = list.find(
          f => f.section === "sidebar" && f.row === current.row + 1
        );
      } else {
        // Find main content item in the row below
        const targetRow = current.row + 1;
        const rowItems = list.filter(f => f.section === "main" && f.row === targetRow);
        if (rowItems.length > 0) {
          nextItem = rowItems.find(f => f.col === current.col) || rowItems[0];
        }
      }
    } else if (direction === "LEFT") {
      if (current.section === "main") {
        if (current.col === 0) {
          // Transition: Main -> Sidebar
          // Highlight the sidebar item representing the current active page
          nextItem = list.find(f => f.id === `sidebar-${activePageRef.current}`);
        } else {
          // Stay inside main, move col left
          nextItem = list.find(
            f => f.section === "main" && f.row === current.row && f.col === current.col - 1
          );
        }
      }
      // If already in sidebar, LEFT does nothing.
    } else if (direction === "RIGHT") {
      if (current.section === "sidebar") {
        // Transition: Sidebar -> Main
        // Find the first main content item (row: 0, col: 0) or row closest to sidebar index
        const mainItems = list.filter(f => f.section === "main");
        if (mainItems.length > 0) {
          // Prefer matching row if exists, otherwise top row
          const matchedRowItems = mainItems.filter(f => f.row === current.row);
          if (matchedRowItems.length > 0) {
            nextItem = matchedRowItems.find(f => f.col === 0) || matchedRowItems[0];
          } else {
            nextItem = mainItems.find(f => f.row === 0 && f.col === 0) || mainItems[0];
          }
        }
      } else {
        // Move col right within main content
        nextItem = list.find(
          f => f.section === "main" && f.row === current.row && f.col === current.col + 1
        );
      }
    }

    if (nextItem) {
      setCurrentId(nextItem.id);
    }
  }, [currentId]);

  // Back action logic for Tv
  const triggerBack = useCallback(() => {
    if (playerOpenRef.current) {
      closePlayer();
    } else if (focusListRef.current.find(f => f.id === currentId)?.section === "main") {
      // If in main, return focus to Sidebar
      const sidebarItem = focusListRef.current.find(f => f.id === `sidebar-${activePageRef.current}`);
      if (sidebarItem) setCurrentId(sidebarItem.id);
    }
  }, [currentId, closePlayer]);

  // Bind hardware keyboard and Tizen remote controllers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If input text element is currently focused under native browser, let normal typing happen, EXCEPT arrow keys or escape
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");

      if (isTyping) {
        // Allow text cursor navigation inside the input box normally.
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          return;
        }
        // Exit typing focus cleanly if moving vertically out of the text field.
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          (activeEl as HTMLElement).blur();
        }
      }

      // Handle Tizen & general key codes
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          moveFocus("UP");
          break;
        case "ArrowDown":
          e.preventDefault();
          moveFocus("DOWN");
          break;
        case "ArrowLeft":
          e.preventDefault();
          moveFocus("LEFT");
          break;
        case "ArrowRight":
          e.preventDefault();
          moveFocus("RIGHT");
          break;
        case "Enter":
          // Trigger click
          if (isTyping) {
            // let form handle or trigger search
            break;
          }
          e.preventDefault();
          const target = focusListRef.current.find(f => f.id === currentId);
          if (target) {
            triggerAction(target);
          }
          break;
        case "Escape":
        case "Backspace":
          // Escape or backspace or Tizen back button (10009)
          if (isTyping) {
            // Blur input to return focus to spatial controls
            (activeEl as HTMLElement).blur();
            e.preventDefault();
          } else {
            e.preventDefault();
            triggerBack();
          }
          break;
        // Native Tizen Back button numeric remote key codes:
        default:
          if (e.keyCode === 10009 || e.keyCode === 461 || e.keyCode === 27) {
            e.preventDefault();
            triggerBack();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentId, moveFocus, triggerAction, triggerBack]);

  return {
    currentFocusId: currentId,
    setFocusedId: setCurrentId,
    moveFocus,
    triggerEnter: () => {
      const target = focusListRef.current.find(f => f.id === currentId);
      if (target) triggerAction(target);
    },
    triggerBack
  };
}
