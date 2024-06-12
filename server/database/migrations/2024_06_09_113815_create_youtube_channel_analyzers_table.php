<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('youtube_channel_analyzers', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned();
            $table->string('channel_id');
            $table->string('channel_username')->nullable();
            $table->json('channel_details');
            $table->json('video_titles');
            $table->json('estimated_revenue');
            $table->string('estimated_networth');
            $table->integer('quality_score');
            $table->text('overview')->nullable();
            $table->json('demographics');
            $table->json('psychographics');
            $table->json('online_behaviors');
            $table->json('offline_behaviors');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('youtube_channel_analyzers');
    }
};
