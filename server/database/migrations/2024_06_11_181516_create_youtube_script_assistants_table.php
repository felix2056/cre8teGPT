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
        Schema::create('youtube_script_assistants', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned();
            $table->string('channel')->nullable();
            $table->string('topic');
            $table->text('angle');
            $table->text('audience');
            $table->text('goal');
            $table->integer('number');
            $table->string('language');
            $table->integer('length')->default(800);
            $table->string('format');
            $table->enum('research', ['basic', 'intermediate', 'comprehensive', 'exhaustive'])->default('basic');
            $table->json('titles')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('youtube_script_assistants');
    }
};
