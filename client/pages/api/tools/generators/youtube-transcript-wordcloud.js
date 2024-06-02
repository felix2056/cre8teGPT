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
        let transcript = await getVideoTranscript(videoId, user_id);
        // console.log(transcript);

        if (!transcript) {
            return res.status(500).json({ error: 'Error: could not retrieve video transcript' });
        }
        
        // let wordcloud = await wordCloudTranscript(transcript);

        res.status(200).json({
            wordcloud: transcript,
            // wordcloud: wordcloud,
        });
    } catch (error) {
        console.error("Error generating wordcloud", error);
        res.status(500).json({ error: "Error generating wordcloud" });
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

async function wordCloudTranscript(transcript) {
    // organize transcript into word frequency
    const words = transcript.split(/\s+/);
    const wordFreq = {};
    for (let word of words) {
        if (wordFreq[word]) {
            wordFreq[word]++;
        } else {
            wordFreq[word] = 1;
        }
    }

    // remove common words
    const commonWords = ['i', 'he', 'his', 'he\'s', 'she', 'her', 'her\'s', 'you', 'yours', 'don\'t', 'out', 'and', 'the', 'and', 'to', 'of', 'a', 'in', 'that', 'is', 'it', 'was', 'for', 'on', 'be', 'with', 'as', 'by', 'at', 'are', 'this', 'have', 'from', 'or', 'one', 'had', 'not', 'but', 'what', 'all', 'were', 'when', 'we', 'there', 'can', 'an', 'your', 'which', 'their', 'said', 'if', 'do', 'don\'t', 'will', 'each', 'how', 'them', 'then', 'many', 'some', 'so', 'these', 'would', 'into', 'has', 'more', 'two', 'see', 'could', 'no', 'make', 'than', 'been', 'its', 'now', 'my', 'made', 'did', 'us', 'over', 'down', 'only', 'way', 'find', 'use', 'may', 'water', 'long', 'little', 'very', 'after', 'words', 'called', 'just', 'where', 'most', 'know', 'name', 'between', 'through', 'back', 'much', 'before', 'any', 'same', 'show', 'try', 'such', 'take', 'help', 'turn', 'here', 'why', 'off', 'light', 'never', 'ever', 'old', 'give', 'keep', 'thought', 'let', 'live', 'again', 'air', 'also', 'point', 'end', 'put', 'home', 'read', 'hand', 'port', 'large', 'spell', 'add', 'even', 'land', 'here', 'must', 'big', 'high', 'ask', 'able', 'about', 'above', 'across', 'act', 'addition', 'adjustment', 'adult', 'advertisement', 'after', 'again', 'against', 'age', 'ago', 'agree', 'air', 'all', 'allow', 'almost', 'alone', 'along', 'already', 'also', 'always', 'am', 'among', 'amount', 'an', 'and', 'angle', 'angry', 'animal', 'another', 'answer', 'ant', 'any', 'appear', 'apple', 'are', 'area', 'arm', 'army', 'around', 'arrive', 'art', 'as', 'ask', 'at', 'attack', 'attention', 'automatic', 'awake', 'away', 'baby', 'back', 'bad', 'bag', 'ball', 'band', 'bank', 'base', 'basket', 'bath', 'be', 'bean', 'bear', 'beat', 'beauty', 'because', 'become', 'bed', 'bee', 'before', 'begin', 'behind', 'believe', 'bell', 'belong', 'below', 'beside', 'best', 'better', 'between', 'big', 'bird', 'birth', 'bit', 'bite', 'black', 'bleed', 'blind', 'block', 'blood', 'blow', 'blue', 'board', 'boat', 'body', 'bone', 'book', 'boot', 'born', 'both', 'bottom', 'bowl', 'box'];
    for (let word of commonWords) {
        delete wordFreq[word];
        delete wordFreq[word.toLowerCase()];
        delete wordFreq[word.toUpperCase()];
        delete wordFreq[word.charAt(0).toUpperCase() + word.slice(1)];
    }

    // sort word frequency by count
    const sortedWordFreq = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]);

    // create word cloud
    const wordcloud = sortedWordFreq.slice(0, 100).map(([word, count]) => ({ text: word, value: count }));
    return wordcloud;
}