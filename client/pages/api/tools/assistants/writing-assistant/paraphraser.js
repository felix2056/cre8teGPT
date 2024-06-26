import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#FF69B4', '#8A2BE2', '#FF4500'];
let colorIndex = 0;

const tone_prompts = {
    'fluent': "Rephrase this text in a fluent style: ",
    'natural': "Rephrase this text to sound natural: ",
    'formal': "Rephrase this text in a formal tone: ",
    'casual': "Rephrase this text in a casual tone: ",
    'academic': "Rephrase this text in an academic tone: ",
    'simple': "Rephrase this text in a simple manner: ",
    'creative': "Rephrase this text in a creative way: ",
};

export default async function handler(req, res) {
    const { input, tone } = req.body;

    try {
        let output = "";
        output = await split(input);
        output = await paraphraser(output, tone);

        if (!output || output.length === 0) {
            throw new Error("No response from the model");
        }

        res.status(200).json({
            output
        });
    } catch (error) {
        console.error("Error retrieving paraphrased text:", error);
        res.status(500).json({ error: "Error retrieving paraphrased text", message: error.message });
    }
}

async function split(text) {
    const sentenceRegex = /([^.!?]*[.!?])/g;
    let match;
    let start = 0;
    const sentences = [];

    while ((match = sentenceRegex.exec(text)) !== null) {
        const end = sentenceRegex.lastIndex;
        sentences.push({
            text: match[0],
            start: start,
            end: end
        });
        start = end;
    }

    return sentences;
}

async function highlight(original, paraphrased) {
    const originalWords = original.split(' ');
    const paraphrasedWords = paraphrased.split(' ');

    console.log(originalWords);
    console.log(paraphrasedWords);

    const highlightedParaphrasedWords = paraphrasedWords.map((word, index) => {
        if (originalWords[index] && originalWords[index] !== word) {
            return `<span style="color: ${colors[0]};">${word}</span>`;  // Apply color to differing words
        }
        return word;
    });

    return highlightedParaphrasedWords.join(' ');
}

async function highlightThesaurusWords(original, paraphrased) {
    const originalWords = original.split(/\s+/);
    const paraphrasedWords = paraphrased.split(/\s+/);
    const highlightedWords = [];

    for (let i = 0; i < paraphrasedWords.length; i++) {
        if (originalWords[i] !== paraphrasedWords[i]) {
            highlightedWords.push(`<span style="color: ${colors[0]};">${paraphrasedWords[i]}</span>`);
        } else {
            highlightedWords.push(paraphrasedWords[i]);
        }
    }

    return highlightedWords.join(' ');
};

async function paraphraser(input, tone = 'natural') {
    const tone_prompt = tone_prompts[tone.toLowerCase()] || "Rephrase this text: ";

    const paraphrasedSentences = [];

    for (let i = 0; i < input.length; i++) {
        const sentence = input[i].text;
        const prompt = tone_prompt + sentence;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            max_tokens: 100,
            n: 1,
            stop: ["\n"],
            messages: [
                { role: "system", content: "You are a writing assistant. Your aim is to paraphrase the given text. Your response should be concise, informative, and provide a rephrased version of the input." },
                { role: "user", content: prompt }
            ]
        });

        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error("No response from the model");
        }

        const completion = response.choices[0].message.content;
        // const highlighted = await highlight(sentence, completion);
        const highlighted = await highlightThesaurusWords(sentence, completion);

        paraphrasedSentences.push({
            original: sentence,
            paraphrased: highlighted,
            start: input[i].start,
            end: input[i].end
        });
    }

    return paraphrasedSentences;
}