import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    const { channel, titles } = req.body;

    try {
        const psychographics = await getPsychographics(channel, titles);

        res.status(200).json({
            psychographics
        });
    } catch (error) {
        console.error("Error retrieving channel psychographics:", error);
        res.status(500).json({ error: "Error retrieving channel psychographics", message: error.message });
    }
}

async function getPsychographics(channel, titles) {
    let prompt = `Based on the following channel name, description, and video titles, provide an analysis of the viewer psychographics.`;
    prompt += `\n\nChannel Name: ${channel.title}`;
    prompt += `\nChannel Description: ${channel.description}`;
    prompt += `\nVideo Titles: ${titles}`;

    prompt += `\n\nUse the following structure to format the response:`;
    prompt += `\n\n- Motivators: [motivators]`;
    prompt += `\n\n- Values: [values]`;
    prompt += `\n\n- Attitudes: [attitudes]`;
    prompt += `\n\n- Lifestyle: [lifestyle]`;
    prompt += `\n\n- Personality Traits: [personality traits]`;
    prompt += `\n\n- Behavior: [behavior]`;
    prompt += `\n\n- Goals: [goals]`;
    prompt += `\n\n- Fears: [fears]`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a YouTube channel psychographics analyzer. Your aim is to provide an analysis of the viewer psychographics based on the given data. Your response should be concise, informative, provide insights into the audience psychographics, and follow the specified format." },
            { role: "user", content: prompt }
        ]
    });
    
    if (!response || !response.choices || response.choices.length === 0) {
        throw new Error("No response from the model");
    }

    const completion = response.choices[0].message.content;
    
    const psychographics = {
        motivators: extractValue(completion, "Motivators"),
        values: extractValue(completion, "Values"),
        attitudes: extractValue(completion, "Attitudes"),
        lifestyle: extractValue(completion, "Lifestyle"),
        personalityTraits: extractValue(completion, "Personality Traits"),
        behavior: extractValue(completion, "Behavior"),
        goals: extractValue(completion, "Goals"),
        fears: extractValue(completion, "Fears")
    };

    return psychographics;
}

function extractValue(text, key) {
    let startIndex = text.indexOf(key) + key.length + 1;
    let endIndex = text.indexOf("\n", startIndex);
    return text.substring(startIndex, endIndex).trim();
}