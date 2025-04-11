// client/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import PlayerScreen from './components/PlayerScreen';
import GameSetup from './components/GameSetup';
// Import the popup component (adjust name if you renamed the function)
import GameOverPopup from './components/GameOverScreen';
import './App.css';

const NUM_PLAYERS = 2;

function App() {
    const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'gameOver'
    const [solution, setSolution] = useState('');
    const [playerFinished, setPlayerFinished] = useState([false, false]);
    const [winnerIndex, setWinnerIndex] = useState(null);

    const handleGameStart = useCallback((word) => {
        console.log("Starting game with word:", word);
        setSolution(word.toUpperCase());
        setPlayerFinished([false, false]);
        setWinnerIndex(null);
        setGameState('playing');
    }, []);

    const handleWin = useCallback((playerIndex) => {
        if (gameState === 'playing') {
            console.log(`Player ${playerIndex + 1} wins!`);
            setWinnerIndex(playerIndex);
            const finished = [...playerFinished];
            finished[playerIndex] = true;
            setPlayerFinished(finished);
            setGameState('gameOver');
        }
    }, [gameState, playerFinished]);

    const handleLose = useCallback((playerIndex) => {
         if (gameState === 'playing') {
            console.log(`Player ${playerIndex + 1} ran out of guesses.`);
            const finished = [...playerFinished];
            finished[playerIndex] = true;
            setPlayerFinished(finished);

            const otherPlayerIndex = 1 - playerIndex;
            if (finished[otherPlayerIndex]) {
                if (winnerIndex === null) {
                     console.log("Game over - Draw!");
                }
                setGameState('gameOver');
            }
         }
    }, [gameState, playerFinished, winnerIndex]);


    const handlePlayAgain = useCallback(() => {
        setGameState('setup');
        setSolution('');
    }, []);

    return (
        <div className="App">
             <header>
                 <h1 className="title">Word Race</h1>
             </header>

            {/* Render GameSetup or the Game Area */}
            {gameState === 'setup' && <GameSetup onGameStart={handleGameStart} />}

            {(gameState === 'playing' || gameState === 'gameOver') && solution && (
                // Keep rendering the game area even when game is over so popup overlays it
                <main className="game-container">
                    <PlayerScreen
                        key={`p0-${solution}`}
                        playerIndex={0}
                        solution={solution}
                        onWin={handleWin}
                        onLose={handleLose}
                        isActive={gameState === 'playing'}
                        isGameOverGlobal={gameState === 'gameOver'}
                    />
                    <PlayerScreen
                        key={`p1-${solution}`}
                        playerIndex={1}
                        solution={solution}
                        onWin={handleWin}
                        onLose={handleLose}
                        isActive={gameState === 'playing'}
                        isGameOverGlobal={gameState === 'gameOver'}
                    />
                </main>
            )}

            {/* Render the Popup Overlay when game is over */}
            {gameState === 'gameOver' && (
                <GameOverPopup // Use the imported popup component
                    winnerIndex={winnerIndex}
                    solution={solution}
                    onPlayAgain={handlePlayAgain}
                />
            )}
        </div>
    );
}

export default App;