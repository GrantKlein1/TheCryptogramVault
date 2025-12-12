// URL for fetching multiple quotes. DummyJSON provides a stable API.
const QUOTE_API_URL = "https://dummyjson.com/quotes?limit=30";

// Fallback data in case the API is down or user is offline
const FALLBACK_QUOTES = [
    {
        id: 1,
        text: "THE ONLY WAY TO DO GREAT WORK IS TO LOVE WHAT YOU DO",
        author: "Steve Jobs"
    },
    {
        id: 2,
        text: "LIFE IS WHAT HAPPENS WHEN YOU ARE BUSY MAKING OTHER PLANS",
        author: "John Lennon"
    },
    {
        id: 3,
        text: "IN THE MIDDLE OF DIFFICULTY LIES OPPORTUNITY",
        author: "Albert Einstein"
    },
    {
        id: 4,
        text: "SUCCESS IS NOT FINAL FAILURE IS NOT FATAL IT IS THE COURAGE TO CONTINUE THAT COUNTS",
        author: "Winston Churchill"
    },
    {
        id: 5,
        text: "HAPPINESS DEPENDS UPON OURSELVES",
        author: "Aristotle"
    },
    {
        id: 6,
        text: "TURN YOUR WOUNDS INTO WISDOM",
        author: "Oprah Winfrey"
    },
    {
        id: 7,
        text: "IT ALWAYS SEEMS IMPOSSIBLE UNTIL IT IS DONE",
        author: "Nelson Mandela"
    },
    {
        id: 8,
        text: "BE YOURSELF EVERYONE ELSE IS ALREADY TAKEN",
        author: "Oscar Wilde"
    },
    {
        id: 9,
        text: "THE UNEXAMINED LIFE IS NOT WORTH LIVING",
        author: "Socrates"
    },
    {
        id: 10,
        text: "EVERYTHING YOU CAN IMAGINE IS REAL",
        author: "Pablo Picasso"
    }
];

/**
 * Fetches quotes from the API or returns fallback data on error.
 * Returns a Promise that resolves to an array of formatted quote objects.
 */
export const fetchGameQuotes = async () => {
    try {
        const response = await fetch(QUOTE_API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch quotes");
        }
        const data = await response.json();

        // Transform API data to game format
        // DummyJSON returns { quotes: [ { id, quote, author }, ... ] }
        return data.quotes.map((quote) => ({
            id: quote.id,
            text: formatTextForCryptogram(quote.quote),
            author: quote.author
        }));
    } catch (error) {
        console.warn("API request failed, loading fallback quotes:", error);
        return FALLBACK_QUOTES;
    }
};

/**
 * Helper to clean text:
 * 1. Uppercase
 * 2. Remove all characters that are NOT A-Z or Space
 */
const formatTextForCryptogram = (rawText) => {
    return rawText
        .toUpperCase()
        .replace(/\s+/g, " ") // Normalize whitespace to single spaces
        .trim();
};
