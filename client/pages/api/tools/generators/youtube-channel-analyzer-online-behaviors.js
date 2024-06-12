import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    const { channel, titles } = req.body;

    try {
        const onlineBehaviors = await getOnlineBehaviors(channel, titles);

        res.status(200).json({
            onlineBehaviors
        });
    } catch (error) {
        console.error("Error retrieving channel onlineBehaviors:", error);
        res.status(500).json({ error: "Error retrieving channel onlineBehaviors", message: error.message });
    }
}

async function getOnlineBehaviors(channel, titles) {
    let prompt = `Based on the following channel name, description, and video titles provide an analysis of the viewer's online behaviors`;
    prompt += `\n\nChannel Name: ${channel.title}`;
    prompt += `\nChannel Description: ${channel.description}`;
    prompt += `\nVideo Titles: ${titles}`;

    prompt += `\n\nUse the following structure to format the response:`;
    prompt += `\n\n- Media Content Consumed: [media content consumed]`;
    prompt += `\n\n- Entertainment Content Consumed: [entertainment content consumed]`;
    prompt += `\n\n- Personal Content: [personal content]`;
    prompt += `\n\n- Channels They Subscribe To: [channels they subscribe to]`;
    prompt += `\n\n- Social Media Usage: [social media usage]`;
    prompt += `\n\n- Online Shopping Habits: [online shopping habits]`;
    prompt += `\n\n- Preferred Devices: [preferred devices]`;
    prompt += `\n\n- Time Spent Online: [time spent online]`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }]
    });
    
    if (!response || !response.choices || response.choices.length === 0) {
        throw new Error("No response from the model");
    }

    const completion = response.choices[0].message.content;

    const onlineBehaviors = {
        mediaContentConsumed: extractValue(completion, "Media Content Consumed"),
        entertainmentContentConsumed: extractValue(completion, "Entertainment Content Consumed"),
        personalContent: extractValue(completion, "Personal Content"),
        channelsTheySubscribeTo: extractValue(completion, "Channels They Subscribe To"),
        socialMediaUsage: extractValue(completion, "Social Media Usage"),
        onlineShoppingHabits: extractValue(completion, "Online Shopping Habits"),
        preferredDevices: extractValue(completion, "Preferred Devices"),
        timeSpentOnline: extractValue(completion, "Time Spent Online")
    };

    return onlineBehaviors;
}

function extractValue(text, key) {
    let startIndex = text.indexOf(key) + key.length + 1;
    let endIndex = text.indexOf("\n", startIndex);
    return text.substring(startIndex, endIndex).trim();
}