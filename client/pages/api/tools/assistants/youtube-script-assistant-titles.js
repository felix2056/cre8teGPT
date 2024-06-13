import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    const { topic, angle, audience, goal, format } = req.body;

    try {
        const titles = await getTitles(topic, angle, audience, goal, format);

        res.status(200).json({
            titles
        });
    } catch (error) {
        console.error("Error retrieving script titles:", error);
        res.status(500).json({ error: "Error retrieving script titles", message: error.message });
    }
}

async function getTitles(topic, angle, audience, goal, format) {
    let prompt = `Based on the following inputs, generate a list of comma-separated titles for a YouTube video script that resonates with the target audience. Your job is not to write the script but to simply generate the titles needed. Only use commas to separate the titles, DO NOT include commas within the titles themselves.`;
    prompt += `\n\nTopic: ${topic}`;
    prompt += `\nUnique Angle: ${angle}`;
    prompt += `\nAudience: ${audience}`;
    prompt += `\nAudience Goal: ${goal}`;
    prompt += `\nFormat: ${format}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a YouTube script assistant. Your aim is to generate titles for YouTube video scripts that resonates with the target audience and align with the given inputs. Your response should be concise, informative, accurate, and appealing to the target audience." },
            { role: "user", content: prompt }
        ]
    });

    if (!response || !response.choices || response.choices.length === 0) {
        throw new Error("No response from the model");
    }

    const completion = response.choices[0].message.content;

    let titles = completion.split(",").map(title => title.trim());
    return titles;
}