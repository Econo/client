// client/src/utils/wordUtils.js
export const TILE_STATUS = {
  ABSENT: 'absent',
  PRESENT: 'present',
  CORRECT: 'correct',
  EMPTY: 'empty',
  EDITING: 'editing'
};

export function evaluateGuess(guess, solution) {
  const splitSolution = solution.split('');
  const splitGuess = guess.split('');
  const result = Array(solution.length).fill(TILE_STATUS.ABSENT); // Start all as absent
  const solutionCharsTaken = Array(solution.length).fill(false); // Track used solution letters

  // Pass 1: Check for correct letters (green)
  splitGuess.forEach((letter, i) => {
      if (letter === splitSolution[i]) {
          result[i] = TILE_STATUS.CORRECT;
          solutionCharsTaken[i] = true;
      }
  });

  // Pass 2: Check for present letters (yellow)
  splitGuess.forEach((letter, i) => {
      if (result[i] === TILE_STATUS.CORRECT) return; // Already marked correct

      let indexOfPresentChar = -1;
      // Find the first available match in the solution
      for (let j = 0; j < splitSolution.length; j++) {
          if (!solutionCharsTaken[j] && splitSolution[j] === letter) {
              indexOfPresentChar = j;
              break; // Found the first available match
          }
      }

      if (indexOfPresentChar !== -1) {
          result[i] = TILE_STATUS.PRESENT;
          solutionCharsTaken[indexOfPresentChar] = true; // Mark this solution char as used
      }
  });

  return result; // e.g., ['correct', 'present', 'absent', 'absent', 'correct']
}

// Helper to update keyboard letter statuses
export function updateKeyboardStatuses(statuses, guess, evaluation) {
   const newStatuses = { ...statuses };
   guess.split('').forEach((letter, i) => {
       const currentStatus = newStatuses[letter];
       const newStatus = evaluation[i];

       // Determine the best status for the key
       switch (currentStatus) {
           case TILE_STATUS.CORRECT:
               break; // Correct is highest precedence
           case TILE_STATUS.PRESENT:
               if (newStatus === TILE_STATUS.CORRECT) {
                   newStatuses[letter] = TILE_STATUS.CORRECT;
               }
               break;
           case TILE_STATUS.ABSENT:
               if (newStatus === TILE_STATUS.CORRECT || newStatus === TILE_STATUS.PRESENT) {
                   newStatuses[letter] = newStatus;
               }
               break;
           default: // No status yet
               newStatuses[letter] = newStatus;
               break;
       }
   });
   return newStatuses;
}