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

    if (!videoId) {
        return res.status(400).json({ error: 'Missing videoId' });
    }
    
    try {
        let transcript = await getVideoTranscript(videoId, user_id);
        if (!transcript) {
            return res.status(500).json({ error: 'Error transcribing video audio' });
        }
        
        const titles = await generateTitles(transcript);

        res.status(200).json({
            'titles': titles,
        });
    } catch (error) {
        console.error("Error generating titles:", error);
        res.status(500).json({ error: "Error generating titles" });
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

async function generateTitles(transcript) {
    let prompt = `Generate 6 comma-separated clickbaity and SEO-optimized titles for a YouTube video based on the below transcript.`;
    prompt += `\n\nDo not number the list or add any special characters and symbols, just list the titles and separate them with commas.`;
    prompt += `\n\nTranscript: ${transcript}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
    });

    const titles = response.choices[0].message.content.split(',').map(title => title.trim());
    const scoredTitles = titles.map((title, index) => ({ title, viralScore: Math.floor(Math.random() * 10) + 1 }));

    return scoredTitles;
}
