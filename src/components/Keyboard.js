// client/src/components/Keyboard.js
import React from 'react';
import Key from './Key';

const KEY_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

function Keyboard({ onKeyPress, keyboardStatuses = {} }) {
  const handleKeyPress = (key) => {
    onKeyPress(key); // Let parent handle logic (ENTER, BACKSPACE, letter)
  };

  return (
    <div className="keyboard">
      {KEY_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((keyVal) => (
            <Key
              key={keyVal}
              value={keyVal}
              status={keyboardStatuses[keyVal]} // Get status from parent
              onClick={handleKeyPress}
              isLarge={keyVal === 'ENTER' || keyVal === 'BACKSPACE'}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;