import fs from "fs";
import path from "path";

import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
ffmpeg.setFfmpegPath(ffmpegPath);

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    const user_id = req.headers['x-user-id'];
    
    const { title } = req.body;
    
    try {
        const description = await generateDescription(title);

        res.status(200).json({
            'description': description,
        });
    } catch (error) {
        console.error("Error generating description:", error);
        res.status(500).json({ error: "Error generating description" });
    }
}

async function generateDescription(title) {
    const prompt = `Generate a video description for the following title to optimize YouTube performance: "${title}"`;
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
}
