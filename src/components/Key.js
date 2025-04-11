// client/src/components/Key.js
import React from 'react';
import './../App.css';

function Key({ value, status = '', onClick, isLarge = false }) {
  const handleClick = (event) => {
    // Optional: Prevent default behavior if it causes issues (like double tap zoom)
    // event.preventDefault();
    onClick(value);
  };

  const className = `key ${status} ${isLarge ? 'large' : ''}`;

  return (
    <button
      className={className}
      onClick={handleClick} // Standard click for mouse/accessibility
      onTouchStart={handleClick} // Trigger immediately on touch
    >
      {value === 'BACKSPACE' ? '⌫' : value}
    </button>
  );
}

export default Key;