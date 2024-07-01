import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";

import Link from "next/link";

import ContentSkeleton from "@/components/Skeletons/Content";
import Separator from "@/pages/separator";
import sal from "sal.js";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

const TextGeneratorLanding = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const prompts = [
        // General Content Prompts:
        "Brainstorm a listicle of productivity tips for beginners.",
        "Create a 'Day in the Life' vlog about your creative process.",
        "Write a blog post debunking common myths about digital marketing.",
        "Design an infographic showcasing statistics on remote work trends.",
        "Record a Q&A video addressing audience questions.",
        "Develop a social media challenge related to your niche.",
        "Write a script for a short explainer video about blockchain technology.",
        "Create a mood board for a new creative project.",
        "Design a logo for a fictional company.",
        "Write a press release announcing a new product launch.",

        // Content for Businesses:
        "Design a social media ad campaign promoting a new software tool.",
        "Write a case study showcasing a successful client story.",
        "Craft customer testimonials for your website.",
        "Develop a white paper on a relevant industry trend.",
        "Create a script for a webinar on a topic related to your expertise.",
        "Write an email sequence nurturing leads towards a sale.",
        "Design a loyalty program for your customers.",
        "Craft compelling social media bios for your brand.",
        "Create a landing page for a new product or service.",
        "Write a sales pitch for a new product launch.",

        // Content for Engagement:
        "Host a live stream discussing a current event in your field.",
        "Write a blog post comparing and contrasting two popular products.",
        "Create a social media poll to gauge audience interest.",
        "Write a guest blog post for a complementary brand.",
        "Run a contest or giveaway to attract new followers.",
        "Collaborate with another creator on a joint project.",
        "Respond to trending topics with your unique perspective.",
        "Write a humorous skit related to your industry.",
        "Design a series of Instagram stories for a product demo.",
        "Create a playlist of music to share with your audience.",
    ];

    return (
        <>
            <ToastContainer />
            <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />

            <div className="youtube-channel-analyzer rainbow-service-area rainbow-section-gap">
                <div className="caase-details-area-start rts-section-gap">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area top-tt">
                                    <span className="pre-title-bg">Content Generators</span>
                                    <h2 className="title">
                                        Text Generator (AI Chat)
                                    </h2>

                                    <p className="disc">
                                        Unlock your creativity. Streamline your process. Enhance your productivity. <br /> 
                                        Designed for content creators. Easy to use. Let Cre8teGPT assist with generating ideas, crafting content, and planning your projects.
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="rts-clients-review-area rts-section-gap bg-tools">
                            <div className="container-tt mt--60">
                                <div className="marquee">
                                    <div className="marquee__item">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="main--wrapper-tt">
                                                    {prompts.slice(0, 9).map((prompt, index) => (
                                                        <div className="single-testimonials-marquree" key={index}>
                                                            <div className="body">
                                                                <Link href={`/dashboard/chat/?q=${prompt.replace(/ /g, "+")}`}>
                                                                    {prompt} <i className="fa fa-external-link"></i>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    
                                <div className="marquee mt--30">
                                    <div className="marquee__item">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="main--wrapper-tt">
                                                    {prompts.slice(10, 20).map((prompt, index) => (
                                                        <div className="single-testimonials-marquree" key={index}>
                                                            <div className="body">
                                                                <Link href={`/dashboard/chat/?q=${prompt.replace(/ /g, "+")}`}>
                                                                    {prompt} <i className="fa fa-external-link"></i>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="marquee mt--30">
                                    <div className="marquee__item-2">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="main--wrapper-tt">
                                                    {prompts.slice(21, 30).map((prompt, index) => (
                                                        <div className="single-testimonials-marquree" key={index}>
                                                            <div className="body">
                                                                <Link href={`/dashboard/chat/?q=${prompt.replace(/ /g, "+")}`}>
                                                                    {prompt} <i className="fa fa-external-link"></i>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator top={true} />

                        <div className="whats-included-section rts-core-feature-area rts-section-gap">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="title-main-center-4">
                                            <h2 className="title">
                                                What’s included
                                            </h2>
                                            <p className="disc">
                                                Unlock the full potential of your YouTube channel with Cre8teGPT's comprehensive analysis features. Here's what you get:
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt--50">
                                    {/* <div className="col-xl-3 col-lg-6">
                                        <div className="left-area-core-feature-image">
                                            <img src="/images/screenshots/youtube-channel-analyzer/09.png" alt="case" loading="lazy" />
                                        </div>
                                    </div> */}
                                    <div className="col-xl-9 col-lg-12">
                                        <div className="d-flex align-items-start">
                                            <div className="tab-content" id="v-pills-tabContent">
                                                <div className="tab-pane fade show active" id="v-pills-1" role="tabpanel" aria-labelledby="v-pills-1-tab">
                                                    <div className="thumbnail-core-feature">
                                                        <img src="/images/screenshots/youtube-channel-analyzer/overview.png" alt="case-thumbnail" loading="lazy" />
                                                    </div>
                                                </div>
                                                <div className="tab-pane fade" id="v-pills-2" role="tabpanel" aria-labelledby="v-pills-2-tab">
                                                    <div className="thumbnail-core-feature">
                                                        <img src="/images/screenshots/youtube-channel-analyzer/demos_psychos.png" alt="case-thumbnail" loading="lazy" />
                                                    </div>
                                                </div>
                                                <div className="tab-pane fade" id="v-pills-3" role="tabpanel" aria-labelledby="v-pills-3-tab">
                                                    <div className="thumbnail-core-feature">
                                                        <img src="/images/screenshots/youtube-channel-analyzer/online_offline.png" alt="case-thumbnail" loading="lazy" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-lg-12 mt_md--30 mt_sm--30">
                                        <div className="nav feature-nav-btn flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                            <div className="nav-link active" id="v-pills-1-tab" data-bs-toggle="pill" data-bs-target="#v-pills-1" role="tab" aria-controls="v-pills-1" aria-selected="true">
                                                <div className="single-core-feature">
                                                    <h6 className="title">Overview Report</h6>
                                                    <p className="disc">YouTube Channel Deep Dive: Analyze, Understand, Grow.</p>
                                                </div>
                                            </div>
                                            <div className="nav-link" id="v-pills-2-tab" data-bs-toggle="pill" data-bs-target="#v-pills-2" role="tab" aria-controls="v-pills-2" aria-selected="false">
                                                <div className="single-core-feature">
                                                    <h6 className="title">Demographs & Psychographs</h6>
                                                    <p className="disc">Uncover audience secrets: Age, values, interests - Craft content that connects.</p>
                                                </div>
                                            </div>
                                            <div className="nav-link" id="v-pills-3-tab" data-bs-toggle="pill" data-bs-target="#v-pills-3" role="tab" aria-controls="v-pills-3" aria-selected="false">
                                                <div className="single-core-feature">
                                                    <h6 className="title">Behavioral Insights</h6>
                                                    <p className="disc">Craft content for how they consume & engage (online & offline).</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator top={false} />

                        <div className="rts-easy-steps-area rts-section-gapTop">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="title-conter-area">
                                            <span className="pre-title-bg">How It Works</span>
                                            <h2 className="title">How To Use the YouTube Channel Analyzer in 3 Steps</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt--20">
                                    <div className="col-lg-12 plr--120 plr_md--60 plr_sm--15">
                                        <div className="easy-steps-area-wrapper bg_image">
                                            <div className="row">
                                                <div className="col-lg-8 offset-lg-2 col-md-12 col-sm-12">
                                                    <div className="easy-steps-main-wrapper">
                                                        <div className="single-steps-area">
                                                            <span className="number active">01</span>
                                                            <div className="icon">
                                                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect width="40" height="40" rx="4" fill="#E6E5FF"></rect>
                                                                    <path d="M30.9688 9.92188C32 10.9531 32 12.5938 30.9688 13.625L29.5625 15.0312L24.9688 10.4375L26.375 9.03125C27.4062 8 29.0469 8 30.0781 9.03125L30.9688 9.92188ZM16.0625 19.3438L23.8906 11.5156L28.4844 16.1094L20.6562 23.9375C20.375 24.2188 20 24.4531 19.625 24.5938L15.4531 25.9531C15.0312 26.0938 14.6094 26 14.3281 25.6719C14 25.3906 13.9062 24.9219 14.0469 24.5469L15.4062 20.375C15.5469 20 15.7812 19.625 16.0625 19.3438ZM17 11C17.7969 11 18.5 11.7031 18.5 12.5C18.5 13.3438 17.7969 14 17 14H12.5C11.6562 14 11 14.7031 11 15.5V27.5C11 28.3438 11.6562 29 12.5 29H24.5C25.2969 29 26 28.3438 26 27.5V23C26 22.2031 26.6562 21.5 27.5 21.5C28.2969 21.5 29 22.2031 29 23V27.5C29 29.9844 26.9844 32 24.5 32H12.5C9.96875 32 8 29.9844 8 27.5V15.5C8 13.0156 9.96875 11 12.5 11H17Z" fill="#3F3EED"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="info-wrapper">
                                                                <h5 className="title">Enter Your Channel Username or URL</h5>
                                                                <p className="disc">Simply copy and paste your YouTube channel username into the designated field. Cre8teGPT will securely access publicly available channel data for analysis.</p>
                                                            </div>
                                                        </div>

                                                        <div className="single-steps-area">
                                                            <span className="number">02</span>
                                                            <div className="icon">
                                                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect width="40" height="40" rx="4" fill="#BDE3FF" fill-opacity="0.4"></rect>
                                                                    <path d="M30.5 9.5C31.2969 9.5 32 10.2031 32 11V27.5C32 29.1875 30.6406 30.5 29 30.5H11C9.3125 30.5 8 29.1875 8 27.5V14C8 13.2031 8.65625 12.5 9.5 12.5H11V26.75C11 27.1719 11.3281 27.5 11.75 27.5C12.125 27.5 12.5 27.1719 12.5 26.75V11C12.5 10.2031 13.1562 9.5 14 9.5H30.5ZM20.75 27.5C21.125 27.5 21.5 27.1719 21.5 26.75C21.5 26.375 21.125 26 20.75 26H16.25C15.8281 26 15.5 26.375 15.5 26.75C15.5 27.1719 15.8281 27.5 16.25 27.5H20.75ZM20.75 23C21.125 23 21.5 22.6719 21.5 22.25C21.5 21.875 21.125 21.5 20.75 21.5H16.25C15.8281 21.5 15.5 21.875 15.5 22.25C15.5 22.6719 15.8281 23 16.25 23H20.75ZM28.25 27.5C28.625 27.5 29 27.1719 29 26.75C29 26.375 28.625 26 28.25 26H23.75C23.3281 26 23 26.375 23 26.75C23 27.1719 23.3281 27.5 23.75 27.5H28.25ZM28.25 23C28.625 23 29 22.6719 29 22.25C29 21.875 28.625 21.5 28.25 21.5H23.75C23.3281 21.5 23 21.875 23 22.25C23 22.6719 23.3281 23 23.75 23H28.25ZM29 17.75V13.25C29 12.875 28.625 12.5 28.25 12.5H16.25C15.8281 12.5 15.5 12.875 15.5 13.25V17.75C15.5 18.1719 15.8281 18.5 16.25 18.5H28.25C28.625 18.5 29 18.1719 29 17.75Z" fill="#083A5E"></path>
                                                                </svg>

                                                            </div>
                                                            <div className="info-wrapper">
                                                                <h5 className="title"> Unleash the Power of AI</h5>
                                                                <p className="disc">Click the "Analyze" button and let Cre8teGPT work its magic. Our advanced AI engine will analyze vast datasets to generate a comprehensive report.</p>
                                                            </div>
                                                        </div>

                                                        <div className="single-steps-area">
                                                            <span className="number">03</span>
                                                            <div className="icon">
                                                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect width="40" height="40" rx="4" fill="#CBF3E7"></rect>
                                                                    <path d="M16 22.625C16 23.2812 16.4688 23.75 17.125 23.75H25V29.75C25 31.0156 23.9688 32 22.75 32H9.25C7.98438 32 7 31.0156 7 29.75V10.25C7 9.03125 7.98438 8 9.25 8H17.5V14C17.5 14.8438 18.1562 15.5 19 15.5H25V21.5H17.125C16.4688 21.5 16 22.0156 16 22.625ZM19 8L25 14H19V8ZM33.625 21.8281C34.0938 22.2969 34.0938 23 33.625 23.4219L29.875 27.1719C29.4531 27.6406 28.75 27.6406 28.3281 27.1719C28.0938 26.9844 28 26.7031 28 26.375C28 26.0938 28.0938 25.8125 28.3281 25.625L30.1562 23.75H25V21.5H30.1562L28.2812 19.6719C27.8125 19.25 27.8125 18.5469 28.2812 18.0781C28.7031 17.6562 29.4062 17.6562 29.875 18.0781L33.625 21.8281Z" fill="#33B89F"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="info-wrapper">
                                                                <h5 className="title">Discover Hidden Insights & Take Action</h5>
                                                                <p className="disc">Explore your detailed channel report, uncovering audience demographics, psychographics, online behavior, and even offline habits. Leverage actionable recommendations to optimize your content strategy and skyrocket engagement!</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-12 col-sm-12">
                                                    {/* <div className="right-image-steps">
                                                        <img src="images/02_13.jpg" alt="steps" loading="lazy" />
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TextGeneratorLanding;