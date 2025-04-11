import React from 'react';
import './../App.css';

function Key({ value, status = '', onClick, isLarge = false }) {

  // This function calls the parent's handler passed via the `onClick` prop
  const triggerParentOnClick = () => {
    onClick(value);
  };

  // Specific handler for the touch event
  const handleTouchStart = (event) => {
    // Prevent the browser from firing a 'click' event after this 'touchstart'
    event.preventDefault();
    // Call the same logic as a click
    triggerParentOnClick();
  };

  const className = `key ${status} ${isLarge ? 'large' : ''}`;

  return (
    <button
      className={className}
      // onClick is still useful for mouse users and accessibility (e.g., keyboard activation)
      onClick={triggerParentOnClick}
      // onTouchStart handles the touch interaction and prevents the subsequent click
      onTouchStart={handleTouchStart}
    >
      {value === 'BACKSPACE' ? '⌫' : value}
    </button>
  );
}

export default Key;