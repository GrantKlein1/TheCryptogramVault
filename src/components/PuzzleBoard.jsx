import React from 'react';
import { ALPHABET } from '../lib/gameLogic';

function PuzzleBoard({ encryptedText, userGuesses, focusedIndex, conflictIndex, blockedChars, onCellClick }) {
    // Split into words but keep track of original indices
    let currentIndex = 0;
    const words = encryptedText.split(' ').map(word => {
        const wordObj = {
            text: word,
            startIndex: currentIndex
        };
        currentIndex += word.length + 1; // +1 for space
        return wordObj;
    });

    return (
        <div className="puzzle-board">
            {words.map((wordObj, wordIdx) => (
                <div key={wordIdx} className="word">
                    {wordObj.text.split('').map((char, charIdx) => {
                        const globalIndex = wordObj.startIndex + charIdx;
                        const isLetter = ALPHABET.includes(char);
                        const guess = userGuesses[char] || '';
                        const isFocused = globalIndex === focusedIndex;
                        const isConflict = globalIndex === conflictIndex;
                        const isBlocked = blockedChars && blockedChars.has(char);

                        // Highlight if it's the same encrypted character as the focused one
                        const focusedChar = focusedIndex !== null && focusedIndex < encryptedText.length ? encryptedText[focusedIndex] : null;
                        const isSameChar = focusedChar && char === focusedChar;

                        const isApostrophe = char === "'";

                        return (
                            <div
                                key={globalIndex}
                                className={`letter-slot ${isLetter ? 'interactive' : 'punctuation'} ${isApostrophe ? 'apostrophe' : ''} ${isFocused ? 'focused' : ''} ${isSameChar ? 'active' : ''} ${isConflict ? 'conflict' : ''} ${isBlocked ? 'blocked' : ''}`}
                                onClick={() => isLetter && !isBlocked && onCellClick(globalIndex)}
                            >
                                <div className="guess">{isLetter ? (isBlocked ? '🔒' : guess) : ''}</div>
                                <div className="encrypted">{char}</div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default PuzzleBoard;
