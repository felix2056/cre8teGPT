import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    const { channel, titles } = req.body;

    try {
        const demographics = await getDemographics(channel, titles);

        res.status(200).json({
            demographics
        });
    } catch (error) {
        console.error("Error retrieving channel demographics:", error);
        res.status(500).json({ error: "Error retrieving channel demographics", message: error.message });
    }
}

async function getDemographics(channel, titles) {
    let prompt = `Based on the following channel name, description, and video titles, provide an analysis of the viewer demographics`;
    prompt += `\n\nChannel Name: ${channel.title}`;
    prompt += `\nChannel Description: ${channel.description}`;
    prompt += `\nVideo Titles: ${titles}`;

    prompt += `\n\nUse the following structure to format the response:`;
    prompt += `\n\n- Age Range: [age range]`;
    prompt += `\n\n- Gender: [gender]`;
    prompt += `\n\n- Location: [location]`;
    prompt += `\n\n- Interests: [interests]`;
    prompt += `\n\n- Income Range: [income range]`;
    prompt += `\n\n- Education Level: [education level]`;
    prompt += `\n\n- Language: [language]`;
    prompt += `\n\n- Relationship Status: [relationship status]`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a YouTube channel demographics analyzer. Your aim is to provide an analysis of the viewer demographics based on the given data. Your response should be concise, informative, provide insights into the audience demographics, and follow the specified format." },
            { role: "user", content: prompt }
        ]
    });

    if (!response || !response.choices || response.choices.length === 0) {
        throw new Error("No response from the model");
    }

    const completion = response.choices[0].message.content;

    // Extract demographics from the response
    let demographics = {
        ageRange: extractValue(completion, "Age Range"),
        gender: extractValue(completion, "Gender"),
        location: extractValue(completion, "Location"),
        interests: extractValue(completion, "Interests"),
        incomeRange: extractValue(completion, "Income Range"),
        educationLevel: extractValue(completion, "Education Level"),
        language: extractValue(completion, "Language"),
        relationshipStatus: extractValue(completion, "Relationship Status")
    };

    return demographics;
}

function extractValue(text, key) {
    let startIndex = text.indexOf(key) + key.length + 1;
    let endIndex = text.indexOf("\n", startIndex);
    return text.substring(startIndex, endIndex).trim();
}