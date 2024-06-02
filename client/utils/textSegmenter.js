// utils/textSegmenter.js

import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { cosineSimilarity } from './cosineSimilarity';

async function segmentText(transcript, options) {
    const { segmentBy } = options;
    const sentences = transcript.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/);  // Split transcript into sentences

    // Load Universal Sentence Encoder model
    const model = await use.load();

    // Encode sentences
    const embeddings = await model.embed(sentences);
    const embeddingsArray = embeddings.arraySync();

    if (segmentBy === 'sceneChanges') {
        return segmentBySceneChanges(sentences, embeddingsArray);
    } else if (segmentBy === 'speakerTransitions') {
        return segmentBySpeakerTransitions(sentences, embeddingsArray);
    } else {
        throw new Error('Invalid segmentBy option');
    }
}

function segmentBySceneChanges(sentences, embeddings) {
    // Calculate cosine similarity between consecutive sentence embeddings
    const similarities = [];
    for (let i = 0; i < embeddings.length - 1; i++) {
        similarities.push(cosineSimilarity(embeddings[i], embeddings[i + 1]));
    }

    // Use a threshold to identify scene changes
    const threshold = 0.7;  // Adjust as needed
    const segments = [];
    let currentSegment = [];

    for (let i = 0; i < sentences.length; i++) {
        if (i > 0 && similarities[i - 1] < threshold) {
            segments.push(currentSegment.join(' '));
            currentSegment = [];
        }
        currentSegment.push(sentences[i]);
    }
    if (currentSegment.length > 0) {
        segments.push(currentSegment.join(' '));
    }

    return segments;
}

function segmentBySpeakerTransitions(sentences, embeddings) {
    // Placeholder: implement speaker change detection using a suitable method
    // This is a complex task usually requiring speaker diarization, which can be done using specialized libraries/models
    // For simplicity, let's assume each paragraph indicates a speaker change

    const segments = [];
    let currentSegment = [];
    for (const sentence of sentences) {
        if (isSpeakerChange(sentence)) {  // Replace this with actual speaker change detection logic
            if (currentSegment.length > 0) {
                segments.push(currentSegment.join(' '));
                currentSegment = [];
            }
        }
        currentSegment.push(sentence);
    }
    if (currentSegment.length > 0) {
        segments.push(currentSegment.join(' '));
    }

    return segments;
}

function isSpeakerChange(sentence) {
    // Placeholder: implement actual speaker change detection logic
    // For simplicity, let's assume that a new paragraph or specific markers indicate a speaker change
    return sentence.startsWith('\n') || sentence.includes(':');  // Example logic
}

export { segmentText };
