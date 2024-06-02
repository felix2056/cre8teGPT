import fs from "fs";
import path from "path";
import { createReadStream } from 'fs';

const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

import axios from 'axios';
import { google } from 'googleapis';

// import { cleanText } from '../../../../utils/textCleaner';
// import { segmentText } from '../../../../utils/textSegmenter';
// const { analyzeSegments } = require('../../../../utils/textAnalyzer');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});

export default async function handler(req, res) {
    const user_id = req.headers['x-user-id'];

    const { videoId } = req.body;
    
    try {
        const videoDetails = await getVideoDetails(videoId);
        // console.log(videoDetails);
        
        let transcript = await getVideoTranscript(videoId, user_id);
        // console.log(transcript);

        if (!transcript) {
            return res.status(500).json({ error: 'Error: could not retrieve video transcript' });
        }
        
        let summary = await summarizeTranscript(transcript);
        summary = await segmentSummary(videoDetails, summary);

        res.status(200).json({
            summary: summary,
        });
    } catch (error) {
        console.error("Error generating summary", error);
        res.status(500).json({ error: "Error generating summary" });
    }
}

async function getVideoDetails(videoId) {
    const response = await youtube.videos.list({
        part: 'snippet,contentDetails',
        id: videoId,
    });
    const video = response.data.items[0];
    return {
        title: video.snippet.title,
        author: video.snippet.channelTitle,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
    };
}

async function getVideoTranscript(videoId, user_id) {
    // get transcript txt file from /public/youtube/user_id/transcripts/videoId.txt
    const transcriptPath = path.join(process.cwd(), 'public', 'youtube', user_id, 'transcripts', `${videoId}.txt`);
    
    if (!fs.existsSync(transcriptPath)) {
        return null;
    }

    return fs.readFileSync(transcriptPath, 'utf8');
}

async function summarizeTranscript(transcript) {
    let prompt = `Below is a transcript of a YouTube video. Please write an article summarizing the key points.`;
    prompt += `\n\nTranscript:\n${transcript}`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    return response.choices[0].message.content;
}

async function segmentSummary(videoDetails, summary) {
    let title = `<h3 class="title">${videoDetails.title} | Summary</h3>`;
    let conclusion = `<p>This summary was generated from the following <a href="https://www.youtube.com/watch?v=${videoDetails.id}">YouTube video</a>.</p>`;
    
    // split the summary into paragraphs after the 4th sentence
    const sentences = summary.split('. ');
    const paragraphs = [];
    let paragraph = '';

    for (let i = 0; i < sentences.length; i++) {
        paragraph += '<p>' + sentences[i] + '. </p>';
        if ((i + 1) % 4 === 0) {
            paragraphs.push(paragraph);
            paragraph = '';
        }
    }

    if (paragraph) paragraphs.push(paragraph);

    return title + paragraphs.join('') + conclusion;
}


