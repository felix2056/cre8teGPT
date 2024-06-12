import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    const { channel, titles } = req.body;

    try {
        const overview = await getOverview(channel, titles);

        res.status(200).json({
            overview
        });
    } catch (error) {
        console.error("Error retrieving channel overview:", error);
        res.status(500).json({ error: "Error retrieving channel overview", message: error.message });
    }
}

async function getOverview(channel, titles) {
    if (!channel || !titles) {
        throw new Error("Invalid request data");
    }

    let prompt = `Based on the following channel name, description, and list of video titles, provide an accurate summary and overview on what the channel is all about:`;
    prompt += `\n\nChannel Name: ${channel.title}`;
    prompt += `\nChannel Description: ${channel.description}`;
    prompt += `\nVideo Titles: ${titles}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a YouTube channel analyzer. Your aim is to provide accurate summaries of YouTube channels based on the given data. Your response should be concise, informative, and greater than 3 paragraphs." },
            { role: "user", content: prompt }
        ]
    });

    return response.choices[0].message.content;
}

function convertToHtml(text) {
    return text.split("\n").map((line) => `<p>${line}</p>`).join("");
}