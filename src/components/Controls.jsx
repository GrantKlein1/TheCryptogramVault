import React from 'react';

function Controls({ onUndo, onReset, onHint, onCheck, onNewGame, onGiveUp, isHintDisabled, isCheckDisabled }) {
    return (
        <div className="controls">
            <button onClick={onHint} disabled={isHintDisabled} title={isHintDisabled ? "Hint disabled" : "Reveal one letter"}>Hint</button>
            <button onClick={onUndo} title="Undo last move">Undo</button>
            <button onClick={onCheck} disabled={isCheckDisabled} title={isCheckDisabled ? "Check disabled in Hard Mode" : "Highlight incorrect letters"}>Check</button>
            <button onClick={onReset} title="Clear all guesses">Reset</button>
            <button onClick={onGiveUp} className="secondary">Give Up</button>
            <button onClick={onNewGame} className="primary">New Game</button>
        </div>
    );
}

export default Controls;
