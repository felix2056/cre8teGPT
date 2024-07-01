<?php

namespace App\Http\Controllers\Generators;

use App\Http\Controllers\Controller;
use App\Models\Generators\YoutubeChannelAnalyzer;
use Illuminate\Http\Request;

class YoutubeChannelAnalyzerController extends Controller
{
    public function index(Request $request)
    {
        $youtubeChannelAnalyzer = YoutubeChannelAnalyzer::inRandomOrder()->get();

        if ($request->has('limit')) {
            $youtubeChannelAnalyzer = YoutubeChannelAnalyzer::inRandomOrder()->limit($request->limit)->get();
        }

        foreach ($youtubeChannelAnalyzer as $key => $value) {
            $youtubeChannelAnalyzer[$key]->channel_details = json_decode($value->channel_details);
            $youtubeChannelAnalyzer[$key]->video_titles = json_decode($value->video_titles);
            $youtubeChannelAnalyzer[$key]->estimated_revenue = json_decode($value->estimated_revenue);
            $youtubeChannelAnalyzer[$key]->demographics = json_decode($value->demographics);
            $youtubeChannelAnalyzer[$key]->psychographics = json_decode($value->psychographics);
            $youtubeChannelAnalyzer[$key]->online_behaviors = json_decode($value->online_behaviors);
            $youtubeChannelAnalyzer[$key]->offline_behaviors = json_decode($value->offline_behaviors);
        }

        return response()->json([
            'channels' => $youtubeChannelAnalyzer,
        ]);
    }

    public function show($channel_id)
    {
        $channel_id = str_replace('@', '', $channel_id);
        $youtubeChannelAnalyzer = YoutubeChannelAnalyzer::where('channel_id', $channel_id)->orWhere('channel_username', $channel_id)->first();

        if (empty($youtubeChannelAnalyzer)) {
            return response()->json([
                'message' => 'Youtube channel analyzer not found',
            ], 404);
        }

        return response()->json([
            'channel_username' => $youtubeChannelAnalyzer->channel_username,
            'channel' => $youtubeChannelAnalyzer->channel_details,
            'videoTitles' => $youtubeChannelAnalyzer->video_titles,
            'estimatedRevenue' => $youtubeChannelAnalyzer->estimated_revenue,
            'estimatedNetworth' => $youtubeChannelAnalyzer->estimated_networth,
            'qualityScore' => $youtubeChannelAnalyzer->quality_score,
            'overview' => $youtubeChannelAnalyzer->overview,
            'demographics' => $youtubeChannelAnalyzer->demographics,
            'psychographics' => $youtubeChannelAnalyzer->psychographics,
            'onlineBehaviors' => $youtubeChannelAnalyzer->online_behaviors,
            'offlineBehaviors' => $youtubeChannelAnalyzer->offline_behaviors,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'channel' => 'required|array',
            'videoTitles' => 'required|array',
            'estimatedRevenue' => 'required|array',
            'estimatedNetworth' => 'required|string',
            'qualityScore' => 'required|integer',
            'overview' => 'nullable|string',
            'demographics' => 'required|array',
            'psychographics' => 'required|array',
            'onlineBehaviors' => 'required|array',
            'offlineBehaviors' => 'required|array',
        ]);

        $channel_id = $request->channel['id'];
        $channel_username = str_replace('@', '', $request->channel['username']);

        $youtubeChannelAnalyzer = YoutubeChannelAnalyzer::where('channel_id', $channel_id)->orWhere('channel_username', $channel_username)->first();

        if (empty($youtubeChannelAnalyzer)) {
            $youtubeChannelAnalyzer = new YoutubeChannelAnalyzer();
        }

        $youtubeChannelAnalyzer->channel_id = $channel_id;
        $youtubeChannelAnalyzer->channel_username = $channel_username;
        $youtubeChannelAnalyzer->channel_details = json_encode($request->channel);
        $youtubeChannelAnalyzer->video_titles = json_encode($request->videoTitles);
        $youtubeChannelAnalyzer->estimated_revenue = json_encode($request->estimatedRevenue);
        $youtubeChannelAnalyzer->estimated_networth = $request->estimatedNetworth;
        $youtubeChannelAnalyzer->quality_score = $request->qualityScore;
        $youtubeChannelAnalyzer->overview = $request->overview;
        $youtubeChannelAnalyzer->demographics = json_encode($request->demographics);
        $youtubeChannelAnalyzer->psychographics = json_encode($request->psychographics);
        $youtubeChannelAnalyzer->online_behaviors = json_encode($request->onlineBehaviors);
        $youtubeChannelAnalyzer->offline_behaviors = json_encode($request->offlineBehaviors);
        $youtubeChannelAnalyzer->save();

        return response()->json([
            'message' => 'Youtube channel analyzer saved successfully',
            'data' => $youtubeChannelAnalyzer,
        ]);
    }
}
