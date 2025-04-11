// client/src/components/PlayerScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import { evaluateGuess, updateKeyboardStatuses, TILE_STATUS } from '../utils/wordUtils';
import { VALID_GUESSES_SET } from '../data/ValidGuesses';
import './../App.css';

const MAX_GUESSES = 10;
const WORD_LENGTH = 5;
const REVEAL_ANIMATION_DURATION = 900; // ms

function PlayerScreen({ playerIndex, solution, onWin, onLose, isActive = true, isGameOverGlobal }) {
    const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(''));
    const [evaluations, setEvaluations] = useState(Array(MAX_GUESSES).fill(null));
    const [currentGuess, setCurrentGuess] = useState('');
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const [keyboardStatuses, setKeyboardStatuses] = useState({});
    const [isMyGameOver, setIsMyGameOver] = useState(false);
    const [message, setMessage] = useState('');
    const [shakeRowIndex, setShakeRowIndex] = useState(-1);
    const [revealingRowIndex, setRevealingRowIndex] = useState(-1);

    const messageTimeoutRef = useRef(null);
    const animationTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        };
    }, []);

    const showMessage = useCallback((msg, duration = 1500) => {
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        setMessage(msg);
        messageTimeoutRef.current = setTimeout(() => {
            setMessage('');
            messageTimeoutRef.current = null;
        }, duration);
    }, []);

    const triggerShake = () => {
        setShakeRowIndex(currentRowIndex);
        setTimeout(() => setShakeRowIndex(-1), 600);
    };

    const handleKeyPress = useCallback((key) => {
        if (revealingRowIndex !== -1 || isMyGameOver || !isActive || isGameOverGlobal) return;

        if (key === 'ENTER') {
            if (currentGuess.length !== WORD_LENGTH) {
                showMessage('Not enough letters'); triggerShake(); return;
            }
            if (!VALID_GUESSES_SET.has(currentGuess)) {
                showMessage('Not in word list'); triggerShake(); return;
            }
            submitGuess();
        } else if (key === 'BACKSPACE') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/i.test(key)) {
            const newLetter = key.toUpperCase();
            setCurrentGuess(prev => prev + newLetter);
        }
    }, [currentGuess, revealingRowIndex, isMyGameOver, isActive, isGameOverGlobal, solution, currentRowIndex]);


    const submitGuess = () => {
        const guess = currentGuess;
        const evaluation = evaluateGuess(guess, solution);
        const submittedRowIndex = currentRowIndex;

        setGuesses(prev => { const next = [...prev]; next[submittedRowIndex] = guess; return next; });
        setEvaluations(prev => { const next = [...prev]; next[submittedRowIndex] = evaluation; return next; });
        setKeyboardStatuses(prev => updateKeyboardStatuses(prev, guess, evaluation));
        setCurrentGuess('');
        setRevealingRowIndex(submittedRowIndex);

        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = setTimeout(() => {
            setRevealingRowIndex(-1);

            if (guess === solution) {
                setIsMyGameOver(true);
                onWin(playerIndex);
            } else if (submittedRowIndex + 1 >= MAX_GUESSES) {
                setIsMyGameOver(true);
                onLose(playerIndex);
            } else {
                setCurrentRowIndex(prev => prev + 1);
            }
            animationTimeoutRef.current = null;
        }, REVEAL_ANIMATION_DURATION);
    };

     useEffect(() => {
        if (isMyGameOver || !isActive || isGameOverGlobal) return;
        const handleKeyDown = (event) => {
            if (revealingRowIndex !== -1) return;
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            if (event.key === 'Enter') handleKeyPress('ENTER');
            else if (event.key === 'Backspace') handleKeyPress('BACKSPACE');
            else if (event.key.length === 1 && event.key.match(/^[a-z]$/i)) handleKeyPress(event.key.toUpperCase());
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
     }, [handleKeyPress, isActive, isMyGameOver, isGameOverGlobal, revealingRowIndex]);


    return (
        <div className={`player-area ${(!isActive || isGameOverGlobal) && !isMyGameOver ? 'inactive' : ''}`}>
           <div className="message-container">
               {message && <div className="message">{message}</div>}
           </div>

           {/* --- SOLUTION DISPLAY REMOVED FROM HERE --- */}
           {/* {isMyGameOver && !evaluations[guesses.findIndex(g => g === solution)]?.every(s => s === TILE_STATUS.CORRECT) && <div className="solution-display">Word: {solution}</div>} */}

           <Grid
               maxGuesses={MAX_GUESSES}
               guesses={guesses}
               evaluations={evaluations}
               currentGuess={currentGuess}
               currentRowIndex={currentRowIndex}
               isRevealingRow={revealingRowIndex}
               shakeRowIndex={shakeRowIndex}
           />
           <Keyboard
               onKeyPress={handleKeyPress}
               keyboardStatuses={keyboardStatuses}
           />
        </div>
    );
}

export default PlayerScreen;