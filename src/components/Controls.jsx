import React from 'react';

function Controls({ onUndo, onReset, onHint, onNewGame, onGiveUp }) {
    return (
        <div className="controls">
            <button onClick={onUndo} title="Undo last move">Undo</button>
            <button onClick={onHint} title="Reveal one letter">Hint</button>
            <button onClick={onReset} title="Clear all guesses">Reset</button>
            <button onClick={onGiveUp} className="secondary">Give Up</button>
            <button onClick={onNewGame} className="primary">New Game</button>
        </div>
    );
}

export default Controls;
