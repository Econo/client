import React, { useRef } from 'react'; // Import useRef
import './../App.css';

function Key({ value, status = '', onClick, isLarge = false }) {
  // Ref to track if the current interaction was initiated by touch
  const touchStarted = useRef(false);

  // The core function to call the parent's handler
  const triggerParentOnClick = () => {
    // console.log(`Triggering action for: ${value}`); // Debug log
    onClick(value);
  };

  // Handler for touch start
  const handleTouchStart = (event) => {
    // console.log(`Touch Start: ${value}`); // Debug log
    // Still prevent default to stop potential scrolling, zooming, or unwanted click events
    event.preventDefault();
    // Mark that this interaction sequence was initiated by touch
    touchStarted.current = true;
    // Trigger the action immediately on touch start
    triggerParentOnClick();
  };

  // Handler for touch end
  const handleTouchEnd = () => {
    // console.log(`Touch End: ${value} - Resetting flag`); // Debug log
    // When the finger is lifted, reset the flag shortly after.
    // This ensures that if a 'click' event *still* fires slightly later,
    // it will see the flag as false and won't trigger the action again.
    // A minimal timeout can help bridge any tiny gap between touchEnd and a potential click.
    // If issues persist, you might remove the timeout or adjust its duration.
    setTimeout(() => {
        touchStarted.current = false;
    }, 50); // Reset after a very short delay (e.g., 50ms)
  };

  // Handler for click events (mouse users, accessibility)
  const handleClick = () => {
    // console.log(`Click: ${value} - Touch Started Flag: ${touchStarted.current}`); // Debug log
    // If the 'touchStarted' flag is false, it means touch didn't initiate
    // this action (e.g., it was a real mouse click), so we trigger the action.
    // If the flag is true, it means onTouchStart already handled it, so we do nothing.
    if (!touchStarted.current) {
      triggerParentOnClick();
    }
    // The flag will be reset by onTouchEnd anyway.
  };

  const className = `key ${status} ${isLarge ? 'large' : ''}`;

  return (
    <button
      className={className}
      onClick={handleClick}         // Handles clicks (potentially after touch end)
      onTouchStart={handleTouchStart} // Handles touch press, sets flag, triggers action
      onTouchEnd={handleTouchEnd}     // Resets the flag after touch release
      // onContextMenu={(e) => e.preventDefault()} // Optional: Prevent context menu on long press
    >
      {value === 'BACKSPACE' ? '⌫' : value}
    </button>
  );
}

export default Key;