// client/src/components/Row.js
import React from 'react';
import Tile from './Tile';
import './../App.css';

const WORD_LENGTH = 5;

function Row({ guess = '', evaluation = [], isRevealing = false, hasError = false, rowIndex }) {
  const tiles = [];
  // console.log(`Row Render [${rowIndex}]: Guess='${guess}', Revealing=${isRevealing}`);

  for (let i = 0; i < WORD_LENGTH; i++) {
    // Directly use the character from the guess prop. If guess is shorter, this will be undefined.
    const letter = guess[i] || ''; // Ensure letter is always a string
    const status = evaluation ? evaluation[i] : (letter ? 'editing' : 'empty');
    const isFilled = !!letter;

    tiles.push(
      <Tile
        key={i}
        letter={letter} // Pass the letter string
        status={status}
        isRevealing={isRevealing}
        isFilled={isFilled}
        rowIndex={rowIndex}
        colIndex={i}
      />
    );
  }
  const rowClass = `row ${hasError ? 'shake' : ''}`;
  return <div className={rowClass}>{tiles}</div>;
}

// Ensure no React.memo
export default Row;