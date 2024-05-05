<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Category;
use App\Models\Tool;

class ToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $generators = Category::where('slug', 'content-generators')->first();
        $generators_tools = [
            [
                'name' => 'Text Generator',
                'description' => 'Generate text for your website or project.',
                'slug' => 'text-generator',
                'icon' => '/images/generator-icon/text_line.png',
            ],
            [
                'name' => 'Image Generator',
                'description' => 'Generate images for your website or project.',
                'slug' => 'image-generator',
                'icon' => '/images/generator-icon/photo_line.png',
            ],
            [
                'name' => 'Video Generator',
                'description' => 'Generate videos for your website or project.',
                'slug' => 'video-generator',
                'icon' => '/images/generator-icon/video-camera_line.png',
            ],
            [
                'name' => 'HTML Generator',
                'description' => 'Generate HTML code for your website or project.',
                'slug' => 'html-generator',
                'icon' => '/images/generator-icon/code-editor_line.png',
            ],
            [
                'name' => 'Lyrics Generator',
                'description' => 'Generate lyrics for your website or project.',
                'slug' => 'lyrics-generator',
                'icon' => '/images/generator-icon/lyrics_line.png',
            ],
            [
                'name' => 'Speech to text',
                'description' => 'Convert speech to text for your website or project.',
                'slug' => 'speech-to-text',
                'icon' => '/images/generator-icon/voice_line.png',
            ],
            [
                'name' => 'Website Generator',
                'description' => 'Generate websites for your website or project.',
                'slug' => 'website-generator',
                'icon' => '/images/generator-icon/website-design_line.png',
            ],
            [
                'name' => 'Logo Generator',
                'description' => 'Generate logos for your website or project.',
                'slug' => 'logo-generator',
                'icon' => '/images/logo/favicon.png',
            ],
            [
                'name' => 'Recipe Generator',
                'description' => 'Generate recipes for your website or project.',
                'slug' => 'recipe-generator',
                'icon' => '/images/generator-icon/recipe_line.png',
            ],
            [
                'name' => 'Code Generator',
                'description' => 'Generate code for your website or project.',
                'slug' => 'code-generator',
                'icon' => '/images/generator-icon/code-editor_line.png',
            ],
            [
                'name' => 'Email Writer',
                'description' => 'Write emails for your website or project.',
                'slug' => 'email-writer',
                'icon' => '/images/generator-icon/email_line.png',
            ],
            [
                'name' => 'Text to speech',
                'description' => 'Convert text to speech for your website or project.',
                'slug' => 'text-to-speech',
                'icon' => '/images/generator-icon/text-voice_line.png',
            ],
            [
                'name' => 'Chat with Documents',
                'description' => 'Chat with documents for your website or project.',
                'slug' => 'chat-with-documents',
                'icon' => '/images/generator-icon/document_line.png',
            ],
        ];
        
        if ($generators) {
            foreach ($generators_tools as $tool) {
                $this->command->info('Creating tool: ' . $tool['name']);
                $generators->tools()->create($tool);
            }
        }

        $editors = Category::where('slug', 'content-editors')->first();
        $editors_tools = [
            [
                'name' => 'Photo Editor',
                'description' => 'Edit photos for your website or project.',
                'slug' => 'photo-editor',
                'icon' => '/images/generator-icon/photo-editor_line.png',
            ],
            [
                'name' => 'Video Editor',
                'description' => 'Edit videos for your website or project.',
                'slug' => 'video-editor',
                'icon' => '/images/generator-icon/video-editor_line.png',
            ]
        ];

        if ($editors) {
            foreach ($editors_tools as $tool) {
                $editors->tools()->create($tool);
            }
        }

        $this->command->info('Tools seeded!');
    }
}