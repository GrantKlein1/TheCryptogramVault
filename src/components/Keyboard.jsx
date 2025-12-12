import React from 'react';
import { ALPHABET } from '../lib/gameLogic';

function Keyboard({ onSelectLetter, selectedLetter, usedLetters }) {
    return (
        <div className="keyboard">
            {ALPHABET.split('').map(char => (
                <button
                    key={char}
                    className={`key ${selectedLetter === char ? 'selected' : ''} ${usedLetters.has(char) ? 'used' : ''}`}
                    onClick={() => onSelectLetter(char)}
                >
                    {char}
                </button>
            ))}
        </div>
    );
}

export default Keyboard;
