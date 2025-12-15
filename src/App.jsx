import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PuzzleBoard from './components/PuzzleBoard';
import Keyboard from './components/Keyboard';
import Controls from './components/Controls';
import SettingsModal from './components/SettingsModal';
import { fetchGameQuotes } from './lib/quoteService';
import { generateCipher, encryptText, checkWin, ALPHABET, getMostFrequentEncryptedChars } from './lib/gameLogic';

function App() {
    const [gameQuotes, setGameQuotes] = useState([]);
    const [currentQuote, setCurrentQuote] = useState(null);
    const [encryptedQuote, setEncryptedQuote] = useState('');
    const [cipher, setCipher] = useState({});
    const [reverseCipher, setReverseCipher] = useState({});
    const [userGuesses, setUserGuesses] = useState({}); // EncryptedChar -> GuessedChar
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [conflictIndex, setConflictIndex] = useState(null);
    const [history, setHistory] = useState([]);
    const [isWon, setIsWon] = useState(false);
    const [usedLetters, setUsedLetters] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);

    // Timer State
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHardMode, setIsHardMode] = useState(false);
    const [showTimer, setShowTimer] = useState(true);
    const [blockedChars, setBlockedChars] = useState(new Set()); // Set of encrypted chars that are currently blocked

    // Initialize quotes on mount
    useEffect(() => {
        const loadQuotes = async () => {
            setIsLoading(true);
            const quotes = await fetchGameQuotes();
            setGameQuotes(quotes);
            setIsLoading(false);
        };
        loadQuotes();
    }, []);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else if (!isTimerRunning && timer !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startNewGame = useCallback(() => {
        if (gameQuotes.length === 0) return;

        const randomQuote = gameQuotes[Math.floor(Math.random() * gameQuotes.length)];
        const { cipher: newCipher, reverseCipher: newReverseCipher } = generateCipher();
        const encrypted = encryptText(randomQuote.text, newCipher);

        setCurrentQuote(randomQuote);
        setCipher(newCipher);
        setReverseCipher(newReverseCipher);
        setEncryptedQuote(encrypted);
        setUserGuesses({});
        setHistory([]);
        setIsWon(false);
        setUsedLetters(new Set());
        setConflictIndex(null);

        // Reset and start timer
        setTimer(0);
        setIsTimerRunning(true);

        // Hard Mode Logic
        if (isHardMode) {
            const frequentChars = getMostFrequentEncryptedChars(encrypted, 2);
            setBlockedChars(new Set(frequentChars));
        } else {
            setBlockedChars(new Set());
        }

        // Find first letter index to focus
        const firstLetterIdx = encrypted.split('').findIndex(c => ALPHABET.includes(c));
        setFocusedIndex(firstLetterIdx !== -1 ? firstLetterIdx : null);
    }, [gameQuotes, isHardMode]);

    // Start game when quotes are loaded
    useEffect(() => {
        if (!currentQuote && gameQuotes.length > 0) {
            startNewGame();
        }
    }, [gameQuotes, currentQuote, startNewGame]);

    useEffect(() => {
        // Update used letters
        const used = new Set(Object.values(userGuesses));
        setUsedLetters(used);

        // Check win
        if (currentQuote && checkWin(encryptedQuote, userGuesses, currentQuote.text)) {
            setIsWon(true);
            setIsTimerRunning(false); // Stop timer
        }

        // Check Hard Mode Unlock Condition
        if (isHardMode && blockedChars.size > 0 && currentQuote) {
            // Check if all NON-blocked letters are correct
            const allNonBlockedCorrect = encryptedQuote.split('').every(char => {
                if (!ALPHABET.includes(char)) return true; // Ignore punctuation
                if (blockedChars.has(char)) return true; // Ignore blocked chars for this check

                // Check if user guess matches the correct letter
                return userGuesses[char] === reverseCipher[char];
            });

            if (allNonBlockedCorrect) {
                // Unlock!
                setBlockedChars(new Set());
            }
        }

    }, [userGuesses, currentQuote, encryptedQuote, isHardMode, blockedChars, reverseCipher]);

    const handleCellClick = (index) => {
        if (isWon) return;
        setFocusedIndex(index);
    };

    const handleSelectLetter = useCallback((letter) => {
        if (isWon || focusedIndex === null) return;

        const encryptedChar = encryptedQuote[focusedIndex];
        if (!ALPHABET.includes(encryptedChar)) return;

        // Hard Mode Block Check
        if (blockedChars.has(encryptedChar)) {
            // Shake or indicate blocked
            setConflictIndex(focusedIndex);
            setTimeout(() => setConflictIndex(null), 500);
            return;
        }

        // Check if letter is already used by a DIFFERENT encrypted char
        const existingEncryptedChar = Object.keys(userGuesses).find(key => userGuesses[key] === letter);
        if (existingEncryptedChar && existingEncryptedChar !== encryptedChar) {
            // Trigger conflict visualization
            setConflictIndex(focusedIndex);
            setTimeout(() => setConflictIndex(null), 500);
            return; // Block the input
        }

        // Save history
        setHistory(prev => [...prev, { ...userGuesses }]);

        setUserGuesses(prev => ({
            ...prev,
            [encryptedChar]: letter
        }));

        // Auto-advance to next empty slot
        let nextIndex = focusedIndex + 1;
        let found = false;
        // Loop once through the string to find the next empty spot
        for (let i = 0; i < encryptedQuote.length; i++) {
            const idx = (focusedIndex + 1 + i) % encryptedQuote.length;
            const char = encryptedQuote[idx];
            if (ALPHABET.includes(char)) {
                const isTargetChar = char === encryptedChar;
                const hasGuess = userGuesses[char] !== undefined;
                const isBlocked = blockedChars.has(char);

                if (!isTargetChar && !hasGuess && !isBlocked) {
                    setFocusedIndex(idx);
                    found = true;
                    break;
                }
            }
        }
    }, [isWon, focusedIndex, encryptedQuote, userGuesses, blockedChars]);

    const handleDelete = useCallback(() => {
        if (isWon || focusedIndex === null) return;
        const encryptedChar = encryptedQuote[focusedIndex];
        if (!ALPHABET.includes(encryptedChar)) return;

        if (blockedChars.has(encryptedChar)) return; // Can't delete blocked

        setHistory(prev => [...prev, { ...userGuesses }]);
        const newGuesses = { ...userGuesses };
        delete newGuesses[encryptedChar];
        setUserGuesses(newGuesses);
    }, [isWon, focusedIndex, encryptedQuote, userGuesses, blockedChars]);

    // Keyboard listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isWon) return;

            const key = e.key.toUpperCase();
            if (ALPHABET.includes(key) && key.length === 1) {
                handleSelectLetter(key);
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                handleDelete();
            } else if (e.key === 'ArrowRight') {
                let next = focusedIndex + 1;
                while (next < encryptedQuote.length && !ALPHABET.includes(encryptedQuote[next])) next++;
                if (next < encryptedQuote.length) setFocusedIndex(next);
            } else if (e.key === 'ArrowLeft') {
                let prev = focusedIndex - 1;
                while (prev >= 0 && !ALPHABET.includes(encryptedQuote[prev])) prev--;
                if (prev >= 0) setFocusedIndex(prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isWon, handleSelectLetter, handleDelete, focusedIndex, encryptedQuote]);


    const handleUndo = () => {
        if (history.length === 0 || isWon) return;
        const previous = history[history.length - 1];
        setUserGuesses(previous);
        setHistory(prev => prev.slice(0, -1));
    };

    const handleReset = () => {
        if (isWon) return;
        setHistory(prev => [...prev, { ...userGuesses }]);
        setUserGuesses({});
    };

    const handleHint = () => {
        if (isWon) return;
        // Find an un-guessed or incorrectly guessed letter
        const encryptedChars = encryptedQuote.split('').filter(c => ALPHABET.includes(c));
        // Filter for ones that are not correct yet AND not blocked
        const incorrect = encryptedChars.filter(c =>
            userGuesses[c] !== reverseCipher[c] && !blockedChars.has(c)
        );

        if (incorrect.length === 0) return;

        const randomChar = incorrect[Math.floor(Math.random() * incorrect.length)];
        const correctLetter = reverseCipher[randomChar];

        setHistory(prev => [...prev, { ...userGuesses }]);
        setUserGuesses(prev => ({
            ...prev,
            [randomChar]: correctLetter
        }));
    };

    const handleGiveUp = () => {
        // Fill all correct letters
        const solved = {};
        encryptedQuote.split('').forEach(char => {
            if (ALPHABET.includes(char)) {
                solved[char] = reverseCipher[char];
            }
        });
        setUserGuesses(solved);
        setIsWon(true); // Technically solved, but maybe mark as "given up"? For now, just show solution.
        setIsTimerRunning(false);
    };

    if (isLoading) {
        return <div className="app-container"><Header /><div>Loading quotes...</div></div>;
    }

    return (
        <div className="app-container">
            <Header />

            <div className="top-bar">
                {showTimer && (
                    <div className="timer-display">
                        ⏱️ {formatTime(timer)}
                    </div>
                )}
                <button className="settings-btn" onClick={() => setIsSettingsOpen(true)}>⚙️ Settings</button>
            </div>

            {isWon && (
                <div className="win-message">
                    <h2>🎉 Puzzle Solved! 🎉</h2>
                    <p>"{currentQuote?.text}" - {currentQuote?.author}</p>
                    <p className="final-time">Time: {formatTime(timer)}</p>
                    <button onClick={startNewGame} className="primary">Play Again</button>
                </div>
            )}

            <div className="game-area">
                <PuzzleBoard
                    encryptedText={encryptedQuote}
                    userGuesses={userGuesses}
                    focusedIndex={focusedIndex}
                    conflictIndex={conflictIndex}
                    blockedChars={blockedChars}
                    onCellClick={handleCellClick}
                />
            </div>

            <div className="interaction-area">
                <Controls
                    onUndo={handleUndo}
                    onReset={handleReset}
                    onHint={handleHint}
                    onNewGame={startNewGame}
                    onGiveUp={handleGiveUp}
                />
                <Keyboard
                    onSelectLetter={handleSelectLetter}
                    selectedLetter={null}
                    usedLetters={usedLetters}
                />
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                isHardMode={isHardMode}
                onToggleHardMode={setIsHardMode}
                showTimer={showTimer}
                onToggleTimer={setShowTimer}
            />
        </div>
    );
}

export default App;
