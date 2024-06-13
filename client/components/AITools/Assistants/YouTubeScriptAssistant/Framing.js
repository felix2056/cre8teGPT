import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";

import Link from "next/link";

import ContentSkeleton from "@/components/Skeletons/Content";

import sal from "sal.js";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

const YouTubeScriptAssistantFraming = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDBSaved, setIsDBSaved] = useState(false);

    const [topic, setTopic] = useState("");
    const [angle, setAngle] = useState("");
    const [audience, setAudience] = useState("");
    const [goal, setGoal] = useState("");
    const [scriptNumber, setScriptNumber] = useState(1);
    const [language, setLanguage] = useState("English");
    const [length, setLength] = useState(800);
    const [format, setFormat] = useState("Other");
    const [research, setResearch] = useState("basic");
    const [links, setLinks] = useState([]);

    const [titles, setTitles] = useState([]);

    useEffect(() => {
        // Apply class to body
        document.body.classList.add("case-details-2");
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

    useEffect(() => {
        if (router.query.script_id) {
            setLinks([
                {
                    name: "Summary",
                    url: `/tools/assistants/youtube-script-assistant/summary/${router.query.script_id}`,
                    icon: "fa fa-list-alt",
                },
                {
                    name: "Framing",
                    url: `/tools/assistants/youtube-script-assistant/framing/${router.query.script_id}`,
                    icon: "fa fa-question-circle",
                },
                {
                    name: "Research",
                    url: `/tools/assistants/youtube-script-assistant/research/${router.query.script_id}`,
                    icon: "fa fa-book-open",
                },
                {
                    name: "Title",
                    url: `/tools/assistants/youtube-script-assistant/title/${router.query.script_id}`,
                    icon: "fa fa-heading",
                },
                {
                    name: "Thumbnail",
                    url: `/tools/assistants/youtube-script-assistant/thumbnail/${router.query.script_id}`,
                    icon: "fa fa-picture-o",
                },
                {
                    name: "Hooks",
                    url: `/tools/assistants/youtube-script-assistant/hooks/${router.query.script_id}`,
                    icon: "fa fa-fishing-rod",
                },
                {
                    name: "Script",
                    url: `/tools/assistants/youtube-script-assistant/script/${router.query.script_id}`,
                    icon: "fa fa-file-text-o",
                },
                {
                    name: "Review",
                    url: `/tools/assistants/youtube-script-assistant/review/${router.query.script_id}`,
                    icon: "fa fa-check-square-o",
                },
            ]);

            getFromDatabase(router.query.script_id);
            getTitlesFromDatabase(router.query.script_id);
        }
    }, [router.query.script_id]);

    const getFromDatabase = async (scriptId) => {
        setIsLoading(true);

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/assistants/youtube-script-assistant/${scriptId}/show`);

            if (!response || !response.data) {
                throw new Error("No response from the server");
            }

            await setTopic(response.data.topic);
            await setAngle(response.data.angle);
            await setAudience(response.data.audience);
            await setGoal(response.data.goal);
            await setScriptNumber(response.data.scriptNumber);
            await setLanguage(response.data.language);
            await setLength(response.data.length);
            await setFormat(response.data.format);
            await setResearch(response.data.research);

            setIsDBSaved(true);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoading(false);
        }
    };
    
    const getTitlesFromDatabase = async (scriptId) => {
        setIsLoading(true);

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/assistants/youtube-script-assistant/${scriptId}/framing`);

            if (!response || !response.data) {
                throw new Error("No response from the server");
            }

            if (!response.data.titles || response.data.titles.length === 0) await generateTitles();
            else await setTitles(response.data.titles);

            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoading(false);
        }
    };

    const generateTitles = async () => {
        setIsGenerating(true);

        try {
            const response = await axios.post("/api/tools/assistants/youtube-script-assistant-titles", {
                topic,
                angle,
                audience,
                goal,
                format,
            }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            if (!response || !response.data) {
                throw new Error("No response from the server");
            }

            await setTitles(response.data.titles);
            setIsGenerating(false);

            await saveToDatabase(response.data.titles);
        } catch (error) {
            console.error(error);
        }
    };

    const saveToDatabase = async (titles) => {
        setIsLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/assistants/youtube-script-assistant/${router.query.script_id}/framing`, {
                titles
            });

            if (!response || !response.data) {
                throw new Error("No response from the server");
            }

            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };


    const goToNextStep = (step) => () => {
        if (router.query.script_id) {
            router.push(`/tools/assistants/youtube-script-assistant/${router.query.script_id}/${step}`);
        }
    };

    return (
        <>
            <ToastContainer />
            <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />

            <div className="rainbow-service-area rainbow-section-gap">
                <div className="caase-details-area-start rts-section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area top-tt">
                                    <div className="youtube-script-assistant search__generator mt--50">
                                        <div className="tab-content mt--50" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                <div className="card text-center">
                                                    <div className="card-header">
                                                        <nav className="cre8tegpt-tab">
                                                            <div
                                                                className="tab-btn-grp nav nav-tabs mb-3 text-center justify-content-center"
                                                                id="nav-tab"
                                                                role="tablist"
                                                            >
                                                                {links.map((link, index) => (
                                                                    <Link key={index} href={link.url} className={`nav-link ${index === 0 ? "active" : ""}`}>
                                                                        <i className={`${link.icon} mr--10`}></i>
                                                                        {link.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </nav>
                                                    </div>

                                                    <div className="card-body">
                                                        <div className="framing-container">
                                                            <div className="framing-header">
                                                                <h2 className="title">Framing</h2>
                                                                <p className="disk">Refine your topic by choosing which viewer questions the script should answer. For best results choose 3-5 questions per 10 minutes of video.</p>
                                                                <button className="btn-default btn-small round refresh-button">
                                                                    <i className="fas fa-sync-alt"></i>
                                                                </button>
                                                            </div>

                                                            <div className="framing-content">
                                                                {titles.map((title, index) => (
                                                                    <div className="question-row" key={index}>
                                                                        <div className="question-number">{index + 1}</div>
                                                                        <div className="question-text">{title}</div>
                                                                        <div className="question-actions">
                                                                            <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />
                                                                            <button className="action-button choose" data-tooltip-id="my-tooltip" data-tooltip-content="Choose">
                                                                                <i className="fas fa-check"></i>
                                                                            </button>
                                                                            <button className="action-button edit" data-tooltip-id="my-tooltip" data-tooltip-content="Edit">
                                                                                <i className="fas fa-pencil-alt"></i>
                                                                            </button>
                                                                            <button className="action-button remove" data-tooltip-id="my-tooltip" data-tooltip-content="Remove">
                                                                                <i className="fas fa-trash-alt"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <button className="more-button">More</button>
                                                        </div>


                                                        <div className="framing-footer" style={{ textAlign: "right" }}>
                                                            <button type="button" className="btn-default btn-small round" onClick={goToNextStep("framing")}>
                                                                Framing <i className="fas fa-arrow-right ml--10"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="feature-area-start rts-section-gapTop bg-smooth-2">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="title-center-feature text-center">
                                            <h2 className="title">What is YouTube Summarizer AI?</h2>
                                            <p className="disc">
                                                Are you tired of spending hours watching lengthy YouTube videos only to extract the key information? Introducing YouTube Summarizer AI – your ultimate solution for efficient video summarization!
                                                YouTube Summarizer AI is an advanced tool that uses cutting-edge artificial intelligence to summarize YouTube videos accurately and efficiently. Say goodbye to the hassle of manually sifting through hours of content. With our AI-powered summarization technology, you can extract the most important points from any YouTube video in minutes!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rts-easy-steps-area rts-section-gapTop">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="title-conter-area">
                                            <h2 className="title">How to Summarize YouTube Videos?</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt--20">
                                    <div className="col-lg-12 plr--120 plr_md--60 plr_sm--15">
                                        <div className="easy-steps-area-wrapper bg_image">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-12 col-sm-12">
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
                                                                <h5 className="title">Get YouTube Video Link</h5>
                                                                <p className="disc">Copy the URL of the YouTube video you want to summarize and paste it into the designated field on the YouTube Summarizer AI platform. Our AI will then analyze the video content to extract the key information.</p>
                                                            </div>
                                                        </div>

                                                        <div className="single-steps-area">
                                                            <span className="number">02</span>
                                                            <div className="icon">
                                                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect width="40" height="40" rx="4" fill="#BDE3FF" fillOpacity="0.4"></rect>
                                                                    <path d="M30.5 9.5C31.2969 9.5 32 10.2031 32 11V27.5C32 29.1875 30.6406 30.5 29 30.5H11C9.3125 30.5 8 29.1875 8 27.5V14C8 13.2031 8.65625 12.5 9.5 12.5H11V26.75C11 27.1719 11.3281 27.5 11.75 27.5C12.125 27.5 12.5 27.1719 12.5 26.75V11C12.5 10.2031 13.1562 9.5 14 9.5H30.5ZM20.75 27.5C21.125 27.5 21.5 27.1719 21.5 26.75C21.5 26.375 21.125 26 20.75 26H16.25C15.8281 26 15.5 26.375 15.5 26.75C15.5 27.1719 15.8281 27.5 16.25 27.5H20.75ZM20.75 23C21.125 23 21.5 22.6719 21.5 22.25C21.5 21.875 21.125 21.5 20.75 21.5H16.25C15.8281 21.5 15.5 21.875 15.5 22.25C15.5 22.6719 15.8281 23 16.25 23H20.75ZM28.25 27.5C28.625 27.5 29 27.1719 29 26.75C29 26.375 28.625 26 28.25 26H23.75C23.3281 26 23 26.375 23 26.75C23 27.1719 23.3281 27.5 23.75 27.5H28.25ZM28.25 23C28.625 23 29 22.6719 29 22.25C29 21.875 28.625 21.5 28.25 21.5H23.75C23.3281 21.5 23 21.875 23 22.25C23 22.6719 23.3281 23 23.75 23H28.25ZM29 17.75V13.25C29 12.875 28.625 12.5 28.25 12.5H16.25C15.8281 12.5 15.5 12.875 15.5 13.25V17.75C15.5 18.1719 15.8281 18.5 16.25 18.5H28.25C28.625 18.5 29 18.1719 29 17.75Z" fill="#083A5E"></path>
                                                                </svg>

                                                            </div>
                                                            <div className="info-wrapper">
                                                                <h5 className="title">Generate Summary</h5>
                                                                <p className="disc">Click the "Generate Summary" button to initiate the summarization process. Within minutes, our AI will compile a concise summary of the YouTube video, highlighting the most important points and key takeaways. Review the summary to ensure accuracy and completeness before sharing or downloading.</p>
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
                                                                <h5 className="title">Edit and Export</h5>
                                                                <p className="disc">Edit the summary as needed to ensure clarity and coherence. Once you are satisfied with the summary, you can export it in various formats, such as text, PDF, or Word document. Share the summary with your audience or use it as a reference for future content creation.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-12 col-sm-12">
                                                    <div className="right-image-steps">
                                                        <img src="images/02_13.jpg" alt="steps" loading="lazy" />
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

                <div className="rts-feature-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area">
                                    <h2 className="title">
                                        Let Our AI Create <br />
                                        Your Next Recipe
                                    </h2>
                                    <p className="disc">
                                        Discover delicious recipes tailored to your available ingredients with Cre8teGPT's AI-powered recipe generator.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row mt--50">
                            <div className="col-lg-12">
                                <div className="single-feature-area-start">
                                    <div className="image-area">
                                        <img src="/images/feature/01.png" alt="feature_image" />
                                    </div>
                                    <div className="featue-content-area">
                                        <span className="pre">01</span>
                                        <h2 className="title">Search by <br /> Ingredients</h2>
                                        <p className="disc">
                                            Do you have limited ingredients and don't know what to cook? Input the ingredients and let Cre8teGPT generate recipes tailored to your pantry.
                                        </p>
                                        <a href="#" className="rts-btn btn-primary">Get Started Free</a>
                                    </div>
                                </div>

                                <div className="single-feature-area-start bg-red-l">
                                    <div className="featue-content-area">
                                        <span className="pre">02</span>
                                        <h2 className="title">Search by <br /> Food Image</h2>
                                        <p className="disc">
                                            Do you have an image of a delicious looking dish and want to try it out but don't know where to start? Upload the image and Cre8teGPT will identify the dish and provide you with the recipe.
                                        </p>
                                        <a href="#" className="rts-btn btn-primary">Get Started Free</a>
                                    </div>
                                    <div className="image-area">
                                        <img src="/images/feature/02.png" alt="feature_image" />
                                    </div>
                                </div>

                                <div className="single-feature-area-start bg-blue-l">
                                    <div className="image-area">
                                        <img src="/images/feature/03.png" alt="feature_image" />
                                    </div>
                                    <div className="featue-content-area">
                                        <span className="pre">03</span>
                                        <h2 className="title">Search by <br /> Cuisine</h2>
                                        <p className="disc">
                                            Do you want to try different recipes for your favorite cuisine? Select the cuisine and let Cre8teGPT generate a list of recipes for you to try.
                                        </p>
                                        <a href="#" className="rts-btn btn-primary">Get Started Free</a>
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

export default YouTubeScriptAssistantFraming;