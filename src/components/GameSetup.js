// client/src/components/GameSetup.js
import React, { useState } from 'react';
// Import only the Set
import { VALID_GUESSES_SET } from '../data/ValidGuesses';
import './../App.css';

const WORD_LENGTH = 5;

function GameSetup({ onGameStart }) {
  const [customWord, setCustomWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCustomWordChange = (e) => {
    const word = e.target.value.toUpperCase();
    if (word.length <= WORD_LENGTH && /^[A-Z]*$/i.test(word)) {
         setCustomWord(word);
         if (error) setError('');
    }
  };

  const validateAndStartCustom = () => {
    setError('');
    if (customWord.length !== WORD_LENGTH) {
      setError(`Word must be exactly ${WORD_LENGTH} letters long.`);
      return;
    }
    if (!/^[A-Z]+$/i.test(customWord)) {
        setError('Word must contain only letters.');
        return;
    }
    // Optional: Add check against VALID_GUESSES_SET if custom words must be real words
    // if (!VALID_GUESSES_SET.has(customWord)) {
    //    setError('Custom word is not in the valid word list.');
    //    return;
    // }

    onGameStart(customWord);
  };

  // --- Updated startWithRandomWord function using the Set ---
  const startWithRandomWord = () => {
    setIsLoading(true);
    setError('');

    if (!VALID_GUESSES_SET || VALID_GUESSES_SET.size === 0) {
        setError('Word list is empty. Cannot start random game.');
        setIsLoading(false);
        return;
    }

    // Convert the Set to an Array to allow random index access
    const validGuessesArray = Array.from(VALID_GUESSES_SET);

    // Select a random word from the newly created array
    const randomIndex = Math.floor(Math.random() * validGuessesArray.length);
    const randomWord = validGuessesArray[randomIndex];

    // Ensure it's uppercase (it should be already if the Set contains uppercase words)
    const finalWord = randomWord.toUpperCase();

    // Simulate a brief delay if desired, otherwise call onGameStart directly
    setTimeout(() => {
        onGameStart(finalWord);
        // No need to setIsLoading(false) if onGameStart changes the view
    }, 100); // Small delay (e.g., 100ms) for visual feedback

    // Or call directly without timeout:
    // onGameStart(finalWord);
  };
  // --- End Updated Function ---


  return (
    <div className="setup-screen">
      <h2>Choose Wordle Challenge</h2>

      <div>
        <button onClick={startWithRandomWord} disabled={isLoading}>
          {isLoading ? 'Starting...' : 'Start with Random Word'}
        </button>
      </div>

      <div className="custom-word-section">
        <p>Or have one player enter a {WORD_LENGTH}-letter word:</p>
        <input
          type="text"
          value={customWord}
          onChange={handleCustomWordChange}
          maxLength={WORD_LENGTH}
          placeholder="ENTER WORD"
          aria-label={`Enter ${WORD_LENGTH}-letter custom word`}
        />
         <button onClick={validateAndStartCustom} disabled={isLoading || customWord.length !== WORD_LENGTH}>
          Start with Custom Word
        </button>
         <span className="warning">WARNING: Both players will see this word!</span>
         <div className="error-message">{error || ''} </div>
      </div>
    </div>
  );
}

export default GameSetup;