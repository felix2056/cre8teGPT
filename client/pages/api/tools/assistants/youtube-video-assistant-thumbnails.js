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
        const thumbnails = await generateThumbnails(title);

        res.status(200).json({
            'thumbnails': thumbnails,
        });
    } catch (error) {
        console.error("Error generating thumbnails:", error);
        res.status(500).json({ error: "Error generating thumbnails" });
    }
}

async function generateThumbnails(title) {
    const thumbnails = [];
    for (let i = 0; i < 3; i++) {
        const prompt = `Generate a clickbaity thumbnail image suitable for a YouTube thumbnail for the following video title: "${title}"`;
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        thumbnails.push(response.data[0].url);
    }
    
    return thumbnails;
}

async function generateThumbnailVariants(thumbnail_url) {
    const variants = [];
    for (let i = 0; i < 5; i++) {
        const response = await openai.images.createVariation({
            model: "dall-e-2",
            image: thumbnail_url,
            n: 1,
            size: "1024x1024",
        });

        variants.push(response.data[0].url);
    }
}
