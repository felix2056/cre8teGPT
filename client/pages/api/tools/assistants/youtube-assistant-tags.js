import fs from "fs";
import path from "path";

import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
ffmpeg.setFfmpegPath(ffmpegPath);

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    const user_id = req.headers['x-user-id'];
    
    const { videoId } = req.body;
    
    try {
        let transcript = await getVideoTranscript(videoId, user_id);
        if (!transcript) {
            return res.status(500).json({ error: 'Error generating tags: could not retrieve video transcript' });
        }
        
        const tags = await generateTags(transcript);

        res.status(200).json({
            'tags': tags,
        });
    } catch (error) {
        console.error("Error generating tags:", error);
        res.status(500).json({ error: "Error generating tags" });
    }
}

async function getVideoTranscript(videoId, user_id) {
    // get transcript txt file from /public/youtube/user_id/transcripts/videoId.txt
    const transcriptPath = path.join(process.cwd(), 'public', 'youtube', user_id, 'transcripts', `${videoId}.txt`);
    
    if (!fs.existsSync(transcriptPath)) {
        return null;
    }

    return fs.readFileSync(transcriptPath, 'utf8');
}

async function generateTags(transcript) {
    const prompt = `Generate a list of comma-separated hashtags optimized for YouTube video performance based on the following transcript:\n\n${transcript}`;
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content.split(',').map(tag => tag.trim().replace(/^#/, ''));
}
