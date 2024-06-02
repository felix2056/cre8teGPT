const fillerWords = [
    'um', 'uh', 'like', 'you know', 'sort of', 'kind of', 'basically',
    'actually', 'literally', 'seriously', 'right', 'well', 'so', 'okay',
    'just', 'i mean', 'you see', 'you get', 'yeah', 'no', 'hmm'
];

const greetings = [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
    'welcome', 'thanks for tuning in', 'thank you for joining', 'what\'s up',
    'how are you', 'how is it going', 'nice to meet you'
];

function removeTimestamps(text) {
    return text.replace(/\b(\d{1,2}:\d{2}(?::\d{2})?)\b/g, '');
}

function removeFillerWords(text) {
    const fillerWordRegex = new RegExp(`\\b(${fillerWords.join('|')})\\b`, 'gi');
    return text.replace(fillerWordRegex, '');
}

function removeGreetings(text) {
    const greetingRegex = new RegExp(`\\b(${greetings.join('|')})\\b`, 'gi');
    return text.replace(greetingRegex, '');
}

function cleanText(text, options = {}) {
    let cleanedText = text;

    if (options.removeTimestamps) {
        cleanedText = removeTimestamps(cleanedText);
    }

    if (options.removeFillerWords) {
        cleanedText = removeFillerWords(cleanedText);
    }

    if (options.removeGreetings) {
        cleanedText = removeGreetings(cleanedText);
    }

    // Additional cleaning steps can be added here if needed

    return cleanedText.trim();
}

export { cleanText };
