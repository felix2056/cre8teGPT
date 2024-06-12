import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

import axios from 'axios';
import { google } from 'googleapis';

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});

export default async function handler(req, res) {
    const { channelId } = req.body;

    try {
        // Fetch channel details
        const channelDetails = await getChannelDetails(channelId);
        if (!channelDetails) throw new Error("Channel not found");
        
        // Fetch videos
        const videos = await getChannelVideos(channelDetails.id);
        const videoTitles = videos.map(video => video.snippet.title);
        
        // Fetch estimated revenue and net worth (dummy data)
        const estimatedRevenue = estimateRevenue(videos);
        const estimatedNetworth = estimateNetworth(videos);

        // quality score from 0 to 100 based on subscriber count, views, and other factors
        const qualityScore = Math.min(100, Math.floor(channelDetails.subscriberCount / 1000) + Math.floor(channelDetails.viewCount / 1000000));
        
        res.status(200).json({
            channelDetails,
            videoTitles,
            estimatedNetworth,
            estimatedRevenue,
            qualityScore,
        });
    } catch (error) {
        console.error("Error analyzing channel:", error);
        res.status(500).json({ error: "Error analyzing channel", message: error.message });
    }
}

async function getChannelDetails(channelId) {
    let response = null;

    if (channelId.startsWith('UC')) {
        response = await youtube.channels.list({
            part: 'snippet,statistics',
            id: channelId
        });
    } else if (channelId.startsWith('@')) {
        response = await youtube.channels.list({
            part: 'snippet,statistics',
            forHandle: channelId.substring(1)
        });
    } else if (channelId.startsWith('http') || channelId.startsWith('www') || channelId.includes('youtube.com')) {
        const url = new URL(channelId);
        const lastPart = url.pathname.split('/').pop();

        if (lastPart.startsWith('@')) {
            response = await youtube.channels.list({
                part: 'snippet,statistics',
                forHandle: lastPart.substring(1)
            });
        } else {
            response = await youtube.channels.list({
                part: 'snippet,statistics',
                id: lastPart
            });
        }
    } else {
        response = await youtube.channels.list({
            part: 'snippet,statistics',
            forHandle: channelId
        });
    }

    console.log("response", response);
    if (!response || !response.data || !response.data.items || response.data.items.length === 0) {
        throw new Error("Channel not found");
    }

    const channel = response.data.items[0];

    return {
        id: channel.id,
        username: channel.snippet.customUrl,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.high.url,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
        viewCount: channel.statistics.viewCount
    };
}

async function getChannelVideos(channelId) {
    const response = await youtube.search.list({
        part: 'id,snippet',
        channelId: channelId,
        order: 'viewCount',
        maxResults: 50
    });

    // loop through videos and fetch statistics
    const videos = response.data.items;
    const videoIds = videos.map(video => video.id.videoId).join(',');
    const videoStats = await youtube.videos.list({
        part: 'statistics',
        id: videoIds
    });

    // merge statistics with videos
    videos.forEach((video, index) => {
        video.statistics = videoStats.data.items[index].statistics;
    });

    // console.log("videos", videos);

    return videos;
}

function estimateRevenue(videos) {
    // Dummy estimation logic based on views and other factors
    const totalViews = videos.reduce((sum, video) => sum + parseInt(video.statistics.viewCount), 0);
    const dailyRevenue = (totalViews / 1000) * 1.5; // CPM estimation
    return {
        daily: (dailyRevenue).toFixed(2),
        weekly: (dailyRevenue * 7).toFixed(2),
        monthly: (dailyRevenue * 30).toFixed(2),
    };
}

function estimateNetworth(videos) {
    // Dummy networth estimation
    const totalViews = videos.reduce((sum, video) => sum + parseInt(video.statistics.viewCount), 0);
    const totalRevenue = (totalViews / 1000) * 1.5; // CPM estimation
    const networth = totalRevenue * 36; // 3 years worth of revenue
    return networth.toFixed(2);
}
