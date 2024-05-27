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
        Schema::create('assistants', function (Blueprint $table) {
            $table->id();
            $table->string('identifier');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('alias')->nullable()->default('Cre8teGPT');
            $table->string('badge')->nullable()->default('bot');
            $table->string('loader')->nullable()->default('/images/icons/loader-one.gif');
            $table->string('avatar')->nullable()->default('/images/team/avater.webp');
            $table->text('instructions')->nullable();
            $table->string('model')->nullable()->default('gpt-3.5-turbo');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assistants');
    }
};
