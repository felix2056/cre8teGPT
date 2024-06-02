import fs from "fs";
import path from "path";
import { createReadStream } from 'fs';

const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

import { YoutubeTranscript } from 'youtube-transcript';

import axios from 'axios';
import { google } from 'googleapis';

import { cleanText } from '../../../../utils/textCleaner';
// import { segmentText } from '../../../../utils/textSegmenter';
// const { analyzeSegments } = require('../../../../utils/textAnalyzer');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});


export default async function handler(req, res) {
    const user_id = req.headers['x-user-id'];

    const { youtubeUrl } = req.body;
    const videoId = youtubeUrl.split('v=')[1] || youtubeUrl.split('be/')[1];

    try {
        const videoDetails = await getVideoDetails(videoId);
        // console.log(videoDetails);
        
        let transcript = await getVideoTranscript(videoId);
        // console.log(transcript);

        if (!transcript) {
            console.log('Transcript not found, downloading audio');
            const audioPath = await downloadYoutubeAudio(videoId, user_id);

            if (!audioPath) {
                return res.status(500).json({ error: 'Error downloading video audio' });
            }

            console.log('Transcribing audio');
            transcript = await transcribeYoutubeAudio(audioPath);
        }

        if (!transcript) {
            return res.status(500).json({ error: 'Error transcribing video audio' });
        }

        transcript = preprocessTranscript(transcript);
        
        let summary = await summarizeTranscript(transcript);
        summary = await segmentSummary(videoDetails, summary);

        res.status(200).json({
            videoDetails: videoDetails,
            summary: summary,
        });
    } catch (error) {
        console.error("Error generating blog post:", error);
        res.status(500).json({ error: "Error generating blog post" });
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

async function getVideoTranscript(videoId) {
    const res = await youtube.captions.list({
        part: 'snippet',
        videoId: videoId,
    });

    const captions = res.data.items;
    if (captions.length === 0) {
        return getVideoTranscript2(videoId);
    }

    const caption = captions[0];
    if (!caption.snippet.url) {
        return getVideoTranscript2(videoId);
    }

    const captionUrl = caption.snippet.url;
    const response = await axios.get(captionUrl);
    return response.data;
}

async function getVideoTranscript2(videoId) {
    YoutubeTranscript.fetchTranscript(videoId).then(transcript => {
        return transcript;
    }).catch(error => {
        console.error('Error fetching transcript:', error);
        return null;
    });
}

async function downloadYoutube(videoId, user_id) {
    try {
        videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // public/video/user_id/[youtube.mp4]
        const videoDir = path.join(process.cwd(), 'public', 'youtube', user_id);

        // Get video info
        const info = await ytdl.getInfo(videoUrl);
        const videoTitle = info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const outputFilePath = path.join(videoDir, `${videoTitle}.mp4`);

        // Ensure output directory exists
        fs.mkdirSync(videoDir, { recursive: true });

        // Create a write stream and pipe the download into it
        const videoStream = ytdl(videoUrl, { quality: 'highestvideo' });
        const fileStream = fs.createWriteStream(outputFilePath);

        videoStream.pipe(fileStream);

        fileStream.on('finish', () => {
            console.log(`Video downloaded successfully: ${outputFilePath}`);
            return outputFilePath;
        });

        fileStream.on('error', (error) => {
            console.error(`Error writing video to file: ${error.message}`);
            return null;
        });

    } catch (error) {
        console.error(`Error downloading video: ${error.message}`);
        return null;
    }
}

async function downloadYoutubeAudio(videoId, user_id) {
    // check if audio is already downloaded
    const videoPath = path.join(process.cwd(), 'public', 'youtube', user_id, 'audio', `${videoId}.mp3`);
    if (fs.existsSync(videoPath)) {
        console.log('Audio already downloaded');
        return videoPath;
    }

    return new Promise((resolve, reject) => {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        // public/youtube/user_id/audio/[videoId.mp3]
        const outputDir = path.join(process.cwd(), 'public', 'youtube', user_id, 'audio');
        
        // const outputFileName = `${new Date().toISOString().split('T')[0].replace(/-/g, '')}_` + videoId + '.mp3';
        const outputFileName = `${videoId}.mp3`;
        const outputFilePath = path.join(outputDir, outputFileName);

        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Stream the video
        const videoStream = ytdl(videoUrl, {
            quality: 'highestaudio',
            filter: 'audioonly',
        });

        // Convert to audio and save
        ffmpeg(videoStream)
        .audioBitrate(128)
        .save(outputFilePath)
        .on('end', () => {
            console.log('Audio download and conversion complete');
            resolve(outputFilePath);
        })
        .on('error', (error) => {
            console.error('Error during download and conversion:', error);
            reject(error);
        });
    });
}

async function transcribeYoutubeAudio(audioPath) {
    const audioStream = createReadStream(audioPath);

    // check if audio is already transcribed
    const transcriptPath = audioPath.replace('audio', 'transcripts').replace('.mp3', '.txt');
    if (fs.existsSync(transcriptPath)) {
        console.log('Transcript already exists');
        return fs.readFileSync(transcriptPath, 'utf-8');
    }

    const transcription = await openai.audio.transcriptions.create({
        file: audioStream,
        model: "whisper-1",
        response_format: 'json',
    });

    if (!transcription.text) return null;

    fs.writeFileSync(transcriptPath, transcription.text);
    return transcription.text;
}

async function preprocessTranscript(transcript) {
    return cleanText(transcript, {
        removeTimestamps: true,
        removeFillerWords: true,
        removeGreetings: true,
    });
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
    let conclusion = `<p>This summary was generated from the <a href="https://www.youtube.com/watch?v=${videoDetails.videoId}">YouTube video</a>.</p>`;
    
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

function generateBlogPost(title, videoDetails, summaries) {
    let blogPost = `# ${title}\n\n`;
    blogPost += `## Introduction\n\n${videoDetails.description}\n\n`;
    blogPost += `## Key Points\n\n`;

    summaries.forEach((summary, index) => {
        blogPost += `### Segment ${index + 1}\n\n${summary}\n\n`;
    });

    blogPost += `## Conclusion\n\n`;
    blogPost += `This blog post was generated from the [YouTube video](https://www.youtube.com/watch?v=${videoDetails.videoId}).\n`;

    return blogPost;
}


