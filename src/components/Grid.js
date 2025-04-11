import React from 'react';
import Row from './Row';
import './../App.css';

function Grid({ maxGuesses = 10, // Default set to 10, but PlayerScreen provides it
               guesses = [],
               evaluations = [],
               currentGuess = '',
               currentRowIndex = 0,
               isRevealingRow = -1,
               shakeRowIndex = -1 }) {
  const rows = [];

  // Use the passed maxGuesses prop for the loop limit
  for (let i = 0; i < maxGuesses; i++) {
    const isCurrentActiveInputRow = (i === currentRowIndex && isRevealingRow !== i);
    // If this row is the one actively being typed into, use currentGuess.
    // Otherwise, use the stored guess from the guesses array for this index.
    const guessString = isCurrentActiveInputRow ? currentGuess : (guesses[i] || ''); // Default to empty string

    rows.push(
      <Row
        key={i} // Using index as key is acceptable here as order doesn't change
        guess={guessString} // Pass the determined guess string
        evaluation={evaluations[i]}
        isRevealing={i === isRevealingRow}
        hasError={i === shakeRowIndex}
        rowIndex={i}
      />
    );
  }
  return <div className="grid">{rows}</div>;
}

export default Grid;