import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    const { topic, angle, audience, goal, format } = req.body;

    try {
        const framing = await getFraming(topic, angle, audience, goal, format);

        res.status(200).json({
            framing
        });
    } catch (error) {
        console.error("Error retrieving script framing:", error);
        res.status(500).json({ error: "Error retrieving script framing", message: error.message });
    }
}

async function getFraming(topic, angle, audience, goal, format) {
    let prompt = `Using the below inputs provided, create a list of questions separated by commas that will engage the target audience and should be addressed by the YouTube video script. Your task is solely to generate the questions, not to write the script. Only use commas to separate the questions, avoid using commas within the questions themselves and do not number them.`;
    prompt += `\n\nInputs:`;
    prompt += `\nTopic: ${topic}`;
    prompt += `\nUnique Angle: ${angle}`;
    prompt += `\nAudience: ${audience}`;
    prompt += `\nAudience Goal: ${goal}`;
    prompt += `\nFormat: ${format}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a YouTube script assistant. Your aim is to generate questions that will engage the target audience and should be addressed by the YouTube video script. Your response should be concise, informative, and provide insights into the scriptwriting process." },
            { role: "user", content: prompt }
        ]
    });

    if (!response || !response.choices || response.choices.length === 0) {
        throw new Error("No response from the model");
    }

    const completion = response.choices[0].message.content;

    let framing = completion.split(",").map(frame => frame.trim());

    for (let i = 0; i < framing.length; i++) {
        framing[i] = { value: framing[i], selected: false };
    }

    return framing;
}