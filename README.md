# The Cryptogram Vault 🔐

**The Cryptogram Vault** is an interactive web-based cryptogram puzzle game. Players must decipher quotes by substituting encrypted letters to reveal the hidden wisdom. The game features a sleek, high-security vault theme, hard mode for extra challenge, and a built-in timer.

![Game Icon Placeholder](https://via.placeholder.com/150?text=Vault+Icon)

## Features

*   **Infinite Puzzles:** Fetches random quotes from the DummyJSON API.
*   **Vault Theme:** Immersive dark aesthetic with metallic textures and gold accents.
*   **Hard Mode:** A security lockdown mode that **locks the top 2 most frequent letters**. You must solve the rest of the puzzle to unlock them!
*   **Speed Run Timer:** Track your solve time (toggleable in settings).
*   **Smart Input:**
    *   Physical keyboard support.
    *   Auto-advance cursor.
    *   Duplicate letter detection (flashes red on conflict).
*   **Responsive Design:** Play on desktop or mobile.

## Tech Stack

*   **React** (v18)
*   **Vite** (Build Tool)
*   **Vanilla CSS** (No external UI libraries)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/cryptogram-vault.git
    cd cryptogram-vault
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

## Deployment

This project is ready for deployment on **Netlify**, **Vercel**, or **GitHub Pages**.
Simply connect your repository or drag-and-drop the `dist` folder after building.

## License

MIT License
