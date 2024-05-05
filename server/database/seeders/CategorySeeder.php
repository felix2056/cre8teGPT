<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $categories = [
            [
                'name' => 'Content Generators',
                'slug' => 'content-generators',
                'description' => 'These tools generate various types of content, such as text, images, videos, and more, based on user input or predefined parameters. They are designed to assist users in quickly creating high-quality and relevant content for a variety of purposes, including marketing, communication, and creative projects.',
                'icon' => '/images/generator-icon/generator_line.png',
            ],
            [
                'name' => 'Content Editors',
                'slug' => 'content-editors',
                'description' => 'These tools allow users to modify and enhance existing content, such as photos, videos, and artworks. They provide features like cropping, resizing, color correction, and special effects to help users achieve the desired aesthetic and visual impact.',
                'icon' => '/images/generator-icon/edit_line.png',
            ],
            [
                'name' => 'Content Planners',
                'slug' => 'content-planners',
                'description' => 'These tools assist users in planning and organizing their content creation efforts. They may include features like generating outlines, creating content calendars, and scheduling posts or events. By providing structure and guidance, these tools help users stay on track and meet their content creation goals.',
                'icon' => '/images/generator-icon/calendar_line.png',
            ],
            [
                'name' => 'Content Analytics',
                'slug' => 'content-analytics',
                'description' => 'These tools help users evaluate the quality, effectiveness, and impact of their content. They may include tools for analyzing writing style, assessing visual compositions, and soliciting feedback from peers or audiences. By providing insights and feedback, these tools enable users to improve their content and achieve better results.',
                'icon' => '/images/generator-icon/analytics_line.png',
            ],
            [
                'name' => 'Content Distribution',
                'slug' => 'content-distribution',
                'description' => 'These tools facilitate the distribution and management of content across various channels and platforms. They may include social media management tools, content management systems (CMS), and project management tools. By streamlining content distribution and collaboration processes, these tools help users effectively manage their content workflows and reach their target audience.',
                'icon' => '/images/generator-icon/distribution_line.png',
            ],
            [
                'name' => 'Content Collaboration',
                'slug' => 'content-collaboration',
                'description' => 'These tools enable users to collaborate with others on content creation projects. They may include features like real-time editing, version control, and commenting to facilitate communication and coordination among team members. By promoting collaboration and teamwork, these tools help users create high-quality content more efficiently.',
                'icon' => '/images/generator-icon/collaboration_line.png',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        } 
    }
}
