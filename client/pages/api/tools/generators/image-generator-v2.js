import { getSession } from "next-auth/react";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { input, style } = req.body;

    try {
        if (!input) {
            throw new Error("Input is required");
        }

        const images = await getImages(input, style);
        return res.status(200).json({ images });
    } catch (error) {
        console.error("Error generating images:", error);
        res.status(500).json({ title: "Error generating images", message: error.message });
    }
}

async function getImages(input, style = null) {
    let images = [];
    for (let i = 0; i < 2; i++) {
        let prompt = `Generate an image of "${input}". The images should be high-quality, visually appealing, and relevant to the input.`;
        if (style) {
            prompt += ` The style of the image should be ${style}.`;
        }
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        images.push(response.data[0].url);
    }

    return images;
}
