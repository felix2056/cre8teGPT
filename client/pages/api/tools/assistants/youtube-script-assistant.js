import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    const { channel, demographics, psychographics } = req.body;

    try {
        const inputs = await getScriptInputs(channel, demographics, psychographics);

        res.status(200).json({
            inputs
        });
    } catch (error) {
        console.error("Error retrieving script inputs:", error);
        res.status(500).json({ error: "Error retrieving script inputs", message: error.message });
    }
}

async function getScriptInputs(channel, demographics, psychographics) {
    let prompt = `Based on the following channel name, description, demographics, and psychographics, generate data that can be used to fill out the given inputs required for writing a script that resonates with the target audience. Your job is not to write the script but to simply generate the inputs needed.`;
    prompt += `\n\nChannel Name: ${channel.title}`;
    prompt += `\nChannel Description: ${channel.description}`;
    
    prompt += `\n\nDemographics Data:`;
    delete demographics["relationshipStatus"];
    for (let key in demographics) {
        prompt += `\n${key}: ${demographics[key]}`;
    }

    prompt += `\n\nPsychographics Data:`;
    delete psychographics["fears"];
    for (let key in psychographics) {
        prompt += `\n${key}: ${psychographics[key]}`;
    }

    prompt += `\n\nUse the following structure to format the response and do not make multiple examples. Only a single set of inputs is required:`;
    prompt += `\n- Topic: [topic]`;
    prompt += `\n- Unique Angle: [angle]`;
    prompt += `\n- Audience: [audience]`;
    prompt += `\n- Audience Goal: [goal]`;
    prompt += `\n- Tone: [tone]`;

    // console.log(prompt);

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a YouTube script assistant. Your aim is to generate data that can be used to fill out the given inputs required for writing a script that resonates with the target audience. Your response should be concise, informative, and provide insights into the scriptwriting process." },
            { role: "user", content: prompt }
        ]
    });

    if (!response || !response.choices || response.choices.length === 0) {
        throw new Error("No response from the model");
    }

    const completion = response.choices[0].message.content;

    let inputs = {
        topic: extractValue(completion, "Topic"),
        angle: extractValue(completion, "Unique Angle"),
        audience: extractValue(completion, "Audience"),
        goal: extractValue(completion, "Audience Goal"),
        tone: extractValue(completion, "Tone")
    };

    return inputs;
}

function extractValue(text, key) {
    let startIndex = text.indexOf(key) + key.length + 1;
    let endIndex = text.indexOf("\n", startIndex);
    return text.substring(startIndex, endIndex).trim();
}