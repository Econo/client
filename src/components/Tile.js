// client/src/components/Tile.js
import React from 'react';
import './../App.css'; // Make sure CSS providing text color is correctly imported/applied

function Tile({ letter = '', status = 'empty', isRevealing = false, isFilled = false, rowIndex, colIndex }) {
  let classNames = ['tile'];
  if (!isRevealing && status !== 'empty' && status !== 'editing') classNames.push(status);
  if (isFilled && status === 'empty' && !isRevealing) classNames.push('filled');
  if (isRevealing) {
    classNames.push('reveal');
    if (status !== 'empty' && status !== 'editing') classNames.push(status);
  }

  // console.log(`Tile Render [${rowIndex}-${colIndex}]: Letter='${letter}', Status=${status}, Revealing=${isRevealing}`);

  // Ensure the letter is always rendered inside the div
  return (
    <div className={classNames.join(' ')}>
      {letter}
    </div>
  );
}

// Ensure no React.memo
export default Tile;