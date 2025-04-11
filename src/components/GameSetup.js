// client/src/components/GameSetup.js
import React, { useState } from 'react';
import axios from 'axios';
import './../App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const WORD_LENGTH = 5;

function GameSetup({ onGameStart }) {
  const [customWord, setCustomWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCustomWordChange = (e) => {
    const word = e.target.value.toUpperCase();
    if (word.length <= WORD_LENGTH && /^[A-Z]*$/i.test(word)) {
         setCustomWord(word);
         if (error) setError(''); // Clear error on valid input change
    }
  };

  const validateAndStartCustom = () => {
    setError(''); // Clear previous errors
    if (customWord.length !== WORD_LENGTH) {
      setError(`Word must be exactly ${WORD_LENGTH} letters long.`);
      return;
    }
    if (!/^[A-Z]+$/i.test(customWord)) {
        setError('Word must contain only letters.');
        return;
    }
    // Optional: Add check against VALID_GUESSES_SET here if you want custom words to be real words
    // if (!VALID_GUESSES_SET.has(customWord)) {
    //    setError('Custom word is not in the valid word list.');
    //    return;
    // }

    onGameStart(customWord);
  };

  const startWithRandomWord = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/words/random`);
      if (response.data && response.data.word) {
          onGameStart(response.data.word.toUpperCase());
      } else {
          setError('Received invalid word from server.');
          setIsLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch random word:', err);
      setError('Could not fetch random word. Check server connection.');
      setIsLoading(false);
    }
    // No need to set isLoading false here if onGameStart changes the view
  };

  return (
    <div className="setup-screen">
      <h2>Choose Wordle Challenge</h2>

      <div>
        <button onClick={startWithRandomWord} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Start with Random Word'}
        </button>
      </div>

      <div className="custom-word-section">
        <p>Or have one player enter a {WORD_LENGTH}-letter word:</p>
        <input
          type="text" // Keep as text to see input
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
         <div className="error-message">{error || ''} </div> {/* Display error or nbsp to maintain height */}
      </div>
    </div>
  );
}

export default GameSetup;