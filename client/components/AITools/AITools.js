import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import sal from "sal.js";

import axios from "axios";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

import AIToolsItem from "./AIToolsItem";

const AITools = () => {
    let [categories, setCategories] = useState([]);
    
    const generators = [
        {
            name: "AI Chat",
            description: "Running GPT-4o, our AI chat tool can help you generate human-like text responses to any prompt or question you provide.",
            slug: "/dashboard/chat",
            icon: "/images/generator-icon/text_line.png",
            badge: "",
        },
        {
            name: "Image Generator",
            description: "Create stunning images for your website, social media, or marketing campaigns with our AI-powered image generator.",
            slug: "/dashboard/image-generator",
            icon: "/images/generator-icon/photo_line.png",
            badge: "",
        },
        {
            name: "Image Generator V2",
            description: "Create stunning images for your website, social media, or marketing campaigns with our AI-powered image generator.",
            slug: "/tools/generators/image-generator",
            icon: "/images/generator-icon/photo_line.png",
            badge: "new",
        },
        {
            name: "Video Generator",
            description: "Quickly create engaging videos for your business, blog, or social media with our AI-powered video generator.",
            slug: "/dashboard/video-generator",
            icon: "/images/generator-icon/video-camera_line.png",
            badge: "coming",
        },
        {
            name: "Article Generator",
            description: "Stop staring at a blank page. Generate high-quality, SEO-friendly articles from keywords, domains, or URLs.",
            slug: "/tools/generators/article-generator",
            icon: "/images/generator-icon/article_line.png",
            badge: "",
        },
        {
            name: "Lyrics Generator",
            description: "Generate song lyrics for your music project, podcast, or video content with our AI-powered lyrics generator.",
            slug: "/dashboard/lyrics-generator",
            icon: "/images/generator-icon/lyrics_line.png",
            badge: "",
        },
        {
            name: "Ad Copy Generator",
            description: "Create compelling ad copy for your marketing campaigns with our AI-powered ad copy generator.",
            slug: "/dashboard/tools/ad-copy-generator",
            icon: "/images/generator-icon/ad-copy_line.png",
            badge: "",
        },
        {
            name: "Marketing Email Generator",
            description: "Generate marketing emails for your business or brand with our AI-powered email generator.",
            slug: "/tools/generators/marketing-email-generator",
            icon: "/images/generator-icon/email_line.png",
            badge: "",
        },
        {
            name: "Website Generator",
            description: "Create a professional website in minutes with our AI-powered website generator. No coding or design skills required.",
            slug: "/tools/generators/website-generator",
            icon: "/images/generator-icon/website-design_line.png",
            badge: "coming",
        },
        {
            name: "Logo Generator",
            description: "Design a unique logo for your brand or business with our AI-powered logo generator.",
            slug: "/tools/generators/logo-generator",
            icon: "/images/logo/favicon.png",
            badge: "coming",
        },
        {
            name: "Recipe Generator",
            description: "Our recipe generator suggests delicious dishes based on your available ingredients, helping you cook with what you have at home.",
            slug: "/tools/generators/recipe-generator",
            icon: "/images/generator-icon/recipe_line.png",
            badge: "",
        },
        {
            name: "Code Generator",
            description: "Generate code snippets, scripts, or templates for your programming projects with our AI-powered code generator.",
            slug: "/tools/generators/code-generator",
            icon: "/images/generator-icon/code-editor_line.png",
            badge: "coming",
        },
        {
            name: "XML Sitemap Generator",
            description: "Create an XML sitemap for your website to improve search engine optimization (SEO) with our AI-powered sitemap generator.",
            slug: "/tools/generators/xml-sitemap-generator",
            icon: "/images/generator-icon/xml-sitemap_line.png",
            badge: "coming",
        },
        {
            name: "Text to speech",
            description: "Convert any text into a human-like voice with our AI-powered text-to-speech generator.",
            slug: "/dashboard/text-to-speech",
            icon: "/images/generator-icon/text-voice_line.png",
            badge: "",
        },
        {
            name: "Speech to text",
            description: "Convert any recording or audio file into text with our AI-powered speech-to-text generator.",
            slug: "/dashboard/speech-to-text",
            icon: "/images/generator-icon/voice_line.png",
            badge: "",
        },
        {
            name: "YouTube Summarizer",
            description: "Summarize any YouTube video into a concise text summary with our AI-powered YouTube video summarizer.",
            slug: "/tools/generators/youtube-summarizer",
            icon: "/images/generator-icon/youtube-summarizer_line.png",
            badge: "",
        },
        {
            name: "YouTube Channel Analyzer",
            description: "Analyze any YouTube channel, video, or playlist with our AI-powered YouTube channel analyzer.",
            slug: "/tools/generators/youtube-channel-analyzer",
            icon: "/images/generator-icon/youtube-channel-analyzer_line.png",
            badge: "",
        },
        {
            name: "YouTube Thumbnail Generator",
            description: "Create eye-catching thumbnails for your YouTube videos with our AI-powered YouTube thumbnail generator.",
            slug: "/tools/generators/youtube-thumbnail-generator",
            icon: "/images/generator-icon/youtube-thumbnail-generator_line.png",
            badge: "coming",
        }
    ];

    const editors = [
        {
            name: "'Photo Editor",
            description: "Edit and enhance your photos with our AI-powered photo editor. Remove backgrounds, retouch images, and more.",
            slug: "/dashboard/photo-editor",
            icon: "/images/editor-icon/photo-editor_line.png",
            badge: "",
        },
        {
            name: "Video Editor",
            description: "Edit and enhance your videos with our AI-powered video editor. Add effects, trim clips, and more.",
            slug: "/tools/editors/video-editor",
            icon: "/images/editor-icon/video-editor_line.png",
            badge: "coming",
        }
    ];

    const assistants = [
        {
            name: "Research Assistant",
            description: "Get help with your research projects, papers, or articles with our AI-powered research assistant.",
            slug: "/tools/assistants/research-assistant",
            icon: "/images/assistant-icon/research-assistant_line.png",
            badge: "coming",
        },
        {
            name: "Writing Assistant",
            description: "Improve your writing with our AI-powered writing assistant. Get suggestions for grammar, style, and more.",
            slug: "/tools/assistants/writing-assistant",
            icon: "/images/assistant-icon/writing-assistant_line.png",
            badge: "coming",
        },
        {
            name: "YouTube Video Assistant",
            description: "Get help with your YouTube video ideas, titles, descriptions, tags, and more with our AI-powered YouTube video assistant.",
            slug: "/tools/assistants/youtube-video-assistant",
            icon: "/images/assistant-icon/youtube-assistant_line.png",
            badge: "",
        },
        {
            name: "YouTube Script Assistant",
            description: "Generate video scripts, outlines, or ideas for your YouTube channel with our AI-powered YouTube script assistant.",
            slug: "/tools/assistants/youtube-script-assistant",
            icon: "/images/assistant-icon/youtube-script_line.png",
            badge: "",
        }
    ];

    useEffect(() => {
        // fetch all AI tools
        // axios.get("/api/tools").then((res) => {
        //     setCategories(res.data.categories);
        // }).catch((err) => {
        // });

        sal();

        const cards = document.querySelectorAll(".bg-flashlight");

        cards.forEach((bgflashlight) => {
            bgflashlight.onmousemove = function (e) {
                let x = e.pageX - bgflashlight.offsetLeft;
                let y = e.pageY - bgflashlight.offsetTop;

                bgflashlight.style.setProperty("--x", x + "px");
                bgflashlight.style.setProperty("--y", y + "px");
            };
        });
    }, []);

    return (
        <>
            <div className="rainbow-service-area rainbow-section-gap">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div
                                className="section-title text-center"
                                data-sal="slide-up"
                                data-sal-duration="700"
                                data-sal-delay="100"
                            >
                                <h4 className="subtitle">
                                    <span className="theme-gradient">BROWSE 50+ AI TOOLS</span>
                                </h4>
                                <h2 className="title w-600 mb--20">
                                    Unlock the Power of AI with Our Extensive Collection of Tools
                                </h2>
                                <p className="description b1">
                                    Welcome to our comprehensive directory of AI tools – your one-stop destination for discovering the latest and most innovative AI-powered solutions for content creation, marketing, productivity, and more. Whether you're a seasoned professional or just starting out, our curated collection of 50+ AI tools has something for everyone.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="tool-genearate-section">
                        {categories && categories.map((category, cat_index) => (
                        <div className="container">
                            <h3 className="title text-capitalize w-600 mb--20">{category.name}</h3>
                            <span className="theme-gradient">{category.description}</span>
                            
                            <div className="separator-animated animated-true mt--50 mb--50"></div>
                            
                            {[...Array(Math.ceil(category.tools.length / 4))].map((_, index) => (
                                <div className="genarator-section mb-4">
                                    <AIToolsItem key={index} AIToolsItem={category.tools.slice(index * 4, (index + 1) * 4)} />
                                </div>
                            ))}
                        </div>
                        ))}
                    </div> */}

                    <div className="tool-genearate-section">
                        <div className="container rts-section-gap">
                            <h3 className="title text-capitalize w-600 mb--20">Content Generators</h3>
                            <span className="theme-gradient">These tools generate various types of content, such as text, images, videos, and more, based on user input or predefined parameters. They are designed to assist users in quickly creating high-quality and relevant content for a variety of purposes, including marketing, communication, and creative projects.</span>
                            
                            <div className="separator-animated animated-true mt--50 mb--50"></div>
                            
                            {[...Array(Math.ceil(generators.length / 4))].map((_, index) => (
                            <div className="genarator-section mb-4" key={index}>
                                <AIToolsItem key={index} AIToolsItem={generators.slice(index * 4, (index + 1) * 4)} />
                            </div>
                            ))}
                        </div>

                        <div className="container rts-section-gap">
                            <h3 className="title text-capitalize w-600 mb--20">Content Editors</h3>
                            <span className="theme-gradient">These tools allow users to modify and enhance existing content, such as photos, videos, and artworks. They provide features like cropping, resizing, color correction, and special effects to help users achieve the desired aesthetic and visual impact.</span>
                            
                            <div className="separator-animated animated-true mt--50 mb--50"></div>
                            
                            {[...Array(Math.ceil(editors.length / 4))].map((_, index) => (
                            <div className="genarator-section mb-4" key={index}>
                                <AIToolsItem key={index} AIToolsItem={editors.slice(index * 4, (index + 1) * 4)} />
                            </div>
                            ))}
                        </div>

                        <div className="container rts-section-gap">
                            <h3 className="title text-capitalize w-600 mb--20">Content Assistants</h3>
                            <span className="theme-gradient">These tools provide suggestions, recommendations, and guidance to help users create better content. They may include features like grammar and spell checkers, keyword suggestions, and content templates. By offering assistance and feedback, these tools help users improve the quality and effectiveness of their content.</span>
                            
                            <div className="separator-animated animated-true mt--50 mb--50"></div>
                            
                            {[...Array(Math.ceil(assistants.length / 4))].map((_, index) => (
                            <div className="genarator-section mb-4" key={index}>
                                <AIToolsItem key={index} AIToolsItem={assistants.slice(index * 4, (index + 1) * 4)} />
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AITools;
