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
import { segmentText } from '../../../../utils/textSegmenter';
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

        transcript = await preprocessTranscript(transcript);
        transcript = await segmentTranscriptLight(transcript);
        // transcript = await segmentTranscript(transcript);
        // transcript = await analyzeSegments(transcript);

        res.status(200).json({
            videoDetails: videoDetails,
            transcript: transcript,
        });
    } catch (error) {
        console.error("Error transcribing youtube video:", error);
        res.status(500).json({ error: "Error transcribing youtube video" });
    }
}

async function getVideoDetails(videoId) {
    const response = await youtube.videos.list({
        part: 'snippet,contentDetails',
        id: videoId,
    });
    const video = response.data.items[0];
    return {
        id: video.id,
        title: video.snippet.title,
        author: video.snippet.channelTitle,
        // description: video.snippet.description,
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
    return YoutubeTranscript.fetchTranscript(videoId, { country: "US", lang: "en" })
    .then(transcript => {
        // {
        //     text: 'you obviously didn&amp;#39;t know as a kid that you would \n' + 'be worth 10 million dollars one day I knew for a  ',
        //     duration: 5.64,
        //     offset: 0,
        //     lang: 'en'
        // },
        
        // return only the text
        let trans = transcript.map(segment => segment.text).join('\n');
        return trans;
    }).catch(error => {
        console.error('Error fetching transcript:', error);
        return null;
    });
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

async function segmentTranscript(transcript) {
    return segmentText(transcript, {
        segmentBy: 'sceneChanges',  //'speakerTransitions', 'sceneChanges'
    });
}

async function segmentTranscriptLight(transcript) {
    // split the transcript into paragraphs after the 4th sentence
    const sentences = transcript.split('. ');
    const paragraphs = [];
    let paragraph = '';

    for (let i = 0; i < sentences.length; i++) {
        paragraph += sentences[i] + '. ';
        if ((i + 1) % 4 === 0) {
            paragraphs.push(paragraph);
            paragraph = '';
        }
    }

    if (paragraph) paragraphs.push(paragraph);

    return paragraphs;
}



