// client/src/components/GameOverScreen.js
import React from 'react';
import './../App.css'; // Ensure CSS is imported

// Renamed component for clarity, though file name can stay GameOverScreen.js
function GameOverPopup({ winnerIndex, solution, onPlayAgain }) {
    let message;
    if (winnerIndex === null) {
        message = "It's a Draw!";
    } else {
        message = `Player ${winnerIndex + 1} Wins! 🎉`;
    }

    return (
        // Outer overlay div
        <div className="game-over-popup-overlay">
            {/* Inner content box div */}
            <div className="game-over-popup-content">
                <h2>Game Over!</h2>
                <h3>{message}</h3>
                {/* Always display the solution in the popup */}
                <p className="popup-solution">
                    The word was: <strong>{solution}</strong>
                </p>
                <button onClick={onPlayAgain}>Play Again?</button>
            </div>
        </div>
    );
}

export default GameOverPopup; // Export the renamed component if you changed it
// Or keep export default GameOverScreen; if you didn't rename the function