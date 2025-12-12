export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateCipher() {
    const chars = ALPHABET.split('');
    const shuffled = [...chars];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Ensure no character maps to itself
    // If any char maps to itself, just regenerate (simple approach for small set)
    // Or swap with next one
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === shuffled[i]) {
            // Swap with next, or previous if last
            const swapIdx = i === chars.length - 1 ? 0 : i + 1;
            [shuffled[i], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[i]];
        }
    }

    // Create map: Real Letter -> Encrypted Letter
    const cipher = {};
    // Create reverse map: Encrypted Letter -> Real Letter (for checking)
    const reverseCipher = {};

    for (let i = 0; i < chars.length; i++) {
        cipher[chars[i]] = shuffled[i];
        reverseCipher[shuffled[i]] = chars[i];
    }

    return { cipher, reverseCipher };
}

export function encryptText(text, cipher) {
    return text.toUpperCase().split('').map(char => {
        if (ALPHABET.includes(char)) {
            return cipher[char];
        }
        return char;
    }).join('');
}

export function isGameWon(originalText, userGuesses, reverseCipher) {
    const cleanText = originalText.toUpperCase();
    for (let char of cleanText) {
        if (ALPHABET.includes(char)) {
            // The encrypted char for this real char
            // We need to find what the encrypted char is.
            // Wait, userGuesses maps Encrypted -> Guessed.
            // We need to know the encrypted version of 'char'.
            // But we don't have the forward cipher here easily unless passed.
            // Easier: Iterate the encrypted text?
            // Let's pass the encrypted text instead?
            // Or just iterate the original text and check if the guess for the corresponding encrypted char is correct.

            // Actually, let's just check if the decoded text matches the original.
            // But we need the cipher to know what the encrypted char was.
            // Let's rely on the caller to pass the necessary info or restructure.

            // Let's assume we check if every letter is correctly guessed.
            // We can iterate the alphabet.
            // For every letter in the quote, check if userGuesses[encryptedChar] === realChar.
        }
    }
    return true; // Placeholder, logic needs refinement in context
}

export function checkWin(encryptedText, userGuesses, originalText) {
    const decrypted = encryptedText.split('').map(char => {
        if (ALPHABET.includes(char)) {
            return userGuesses[char] || '_';
        }
        return char;
    }).join('');

    return decrypted === originalText.toUpperCase();
}

export function getMostFrequentEncryptedChars(encryptedText, count = 3) {
    const frequency = {};
    for (const char of encryptedText) {
        if (ALPHABET.includes(char)) {
            frequency[char] = (frequency[char] || 0) + 1;
        }
    }

    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1]) // Sort by count descending
        .slice(0, count) // Take top N
        .map(entry => entry[0]); // Return just the chars
}
