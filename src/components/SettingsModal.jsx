import React from 'react';

function SettingsModal({ isOpen, onClose, isHardMode, onToggleHardMode, showTimer, onToggleTimer }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Security Settings</h2>
                <div className="setting-option">
                    <label className="toggle-label">
                        <span>Hard Mode (Security Lockdown)</span>
                        <input
                            type="checkbox"
                            checked={isHardMode}
                            onChange={(e) => onToggleHardMode(e.target.checked)}
                        />
                        <span className="toggle-switch"></span>
                    </label>
                    <p className="setting-description">
                        Top 2 most frequent letters are LOCKED until all other letters are deciphered correctly.
                    </p>
                </div>

                <div className="setting-option">
                    <label className="toggle-label">
                        <span>Show Timer</span>
                        <input
                            type="checkbox"
                            checked={showTimer}
                            onChange={(e) => onToggleTimer(e.target.checked)}
                        />
                        <span className="toggle-switch"></span>
                    </label>
                    <p className="setting-description">
                        Display the time elapsed while solving the puzzle.
                    </p>
                </div>
                <button onClick={onClose} className="primary">Close Vault</button>
            </div>
        </div>
    );
}

export default SettingsModal;
