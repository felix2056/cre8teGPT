import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    const { channel, titles } = req.body;

    try {
        const offlineBehaviors = await getOfflineBehaviors(channel, titles);

        res.status(200).json({
            offlineBehaviors
        });
    } catch (error) {
        console.error("Error retrieving channel offlineBehaviors:", error);
        res.status(500).json({ error: "Error retrieving channel offlineBehaviors", message: error.message });
    }
}

async function getOfflineBehaviors(channel, titles) {
    let prompt = `Based on the following channel name, description, and video titles, provide an analysis of the viewer's offline behaviors.`;
    prompt += `\n\nChannel Name: ${channel.title}`;
    prompt += `\nChannel Description: ${channel.description}`;
    prompt += `\nVideo Titles: ${titles}`;

    prompt += `\n\nUse the following structure to format the response:`;
    prompt += `\n\n- Buying Behavior: [buying behavior]`;
    prompt += `\n\n- Social Behavior: [social behavior]`;
    prompt += `\n\n- Habits: [habits]`;
    prompt += `\n\n- Hobbies: [hobbies]`;
    prompt += `\n\n- Interests: [interests]`;
    prompt += `\n\n- Lifestyle: [lifestyle]`;
    prompt += `\n\n- Offline Activities: [offline activities]`;
    prompt += `\n\n- Establishments Visited: [establishments visited]`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a YouTube channel offline behaviors analyzer. Your aim is to provide an analysis of the viewer's offline behaviors based on the given data. Your response should be concise, informative, provide insights into the audience's offline behaviors, and follow the specified format."},
            { role: "user", content: prompt }
        ]
    });

    if (!response || !response.choices || response.choices.length === 0) {
        throw new Error("No response from the model");
    }

    const completion = response.choices[0].message.content;

    const offlineBehaviors = {
        buyingBehavior: extractValue(completion, "Buying Behavior"),
        socialBehavior: extractValue(completion, "Social Behavior"),
        habits: extractValue(completion, "Habits"),
        hobbies: extractValue(completion, "Hobbies"),
        interests: extractValue(completion, "Interests"),
        lifestyle: extractValue(completion, "Lifestyle"),
        offlineActivities: extractValue(completion, "Offline Activities"),
        establishmentsVisited: extractValue(completion, "Establishments Visited")
    };

    return offlineBehaviors;
}

function extractValue(text, key) {
    let startIndex = text.indexOf(key) + key.length + 1;
    let endIndex = text.indexOf("\n", startIndex);
    return text.substring(startIndex, endIndex).trim();
}