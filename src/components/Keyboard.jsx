import React from 'react';
import { ALPHABET } from '../lib/gameLogic';

function Keyboard({ onSelectLetter, selectedLetter, usedLetters }) {
    const rows = [
        "QWERTYUIOP".split(''),
        "ASDFGHJKL".split(''),
        "ZXCVBNM".split('')
    ];

    return (
        <div className="keyboard">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row.map(char => (
                        <button
                            key={char}
                            className={`key ${selectedLetter === char ? 'selected' : ''} ${usedLetters.has(char) ? 'used' : ''}`}
                            onClick={() => onSelectLetter(char)}
                        >
                            {char}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Keyboard;
