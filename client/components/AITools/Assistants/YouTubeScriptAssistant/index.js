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
import { copy } from "clipboard";

const YouTubeScriptAssistant = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isPopulating, setIsPopulating] = useState(false);
    const [isLoadingOverview, setIsLoadingOverview] = useState(false);
    const [isLoadingDemographics, setIsLoadingDemographics] = useState(false);
    const [isLoadingPsychographics, setIsLoadingPsychographics] = useState(false);
    const [isLoadingOnlineBehaviors, setIsLoadingOnlineBehaviors] = useState(false);
    const [isLoadingOfflineBehaviors, setIsLoadingOfflineBehaviors] = useState(false);
    const [isDBSaved, setIsDBSaved] = useState(false);

    const [showPopulateErr, setShowPopulateErr] = useState(false);

    const [input, setInput] = useState("");
    const [channel, setChannel] = useState({});
    const [videoTitles, setVideoTitles] = useState([]);
    const [estimatedRevenue, setEstimatedRevenue] = useState({});
    const [estimatedNetworth, setEstimatedNetworth] = useState("");
    const [qualityScore, setQualityScore] = useState(0);

    const [topic, setTopic] = useState("");
    const [angle, setAngle] = useState("");
    const [audience, setAudience] = useState("");
    const [goal, setGoal] = useState("");
    const [scriptNumber, setScriptNumber] = useState(1);
    const [language, setLanguage] = useState("English");
    const [length, setLength] = useState(800);
    const [format, setFormat] = useState("Other");
    const [research, setResearch] = useState("basic");

    const [overview, setOverview] = useState("");
    const [demographics, setDemographics] = useState({})
    const [psychographics, setPsychographics] = useState({});
    const [onlineBehaviors, setOnlineBehaviors] = useState({});
    const [offlineBehaviors, setOfflineBehaviors] = useState({});

    const languageOptions = [
        "English",
        "French",
        "Spanish",
        "German",
        "Italian",
        "Portuguese",
    ];

    const lengthOptions = [
        { value: 800, label: "800 words (~5 minutes)" },
        { value: 1300, label: "1,300 words (~8 minutes)" },
        { value: 1600, label: "1,600 words (~10 minutes)" },
        { value: 2000, label: "2,000 words (~12 minutes)" },
        { value: 2500, label: "2,500 words (~15 minutes)" },
        { value: 3200, label: "3,200 words (~20 minutes)" },
        { value: 4000, label: "4,000 words (~25 minutes)" },
        { value: 4800, label: "4,800 words (~30 minutes)" },
        { value: 6400, label: "6,400 words (~40 minutes)" },
        { value: 8000, label: "8,000 words (~50 minutes)" },
        { value: 9600, label: "9,600 words (~60 minutes)" },
    ];

    const formatOptions = [
        "Compilation",
        "Documentary",
        "Educational",
        "Instructional",
        "Other",
        "Review",
        "Story",
        "Tutorial",
        "Video Sales Letter (VSL)",
        "Vlog",
    ];

    const [cart, setCart] = useState({
        researchOption: {
            name: "Basic Research",
            cre8dits: 1,
        },
        lengthOption: {
            name: "800 words (~5 minutes)",
            cre8dits: 2,
        },
        cre8ditsRequired: 3,
        cre8ditsAvailable: 0,
        cre8ditsRemaining: 0,
    });

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
        if (router.query.channel_id) {
            getFromDatabase(router.query.channel_id);
        }
    }, [router.query.channel_id]);

    useEffect(() => {
        if (research == "basic") {
            setCart({
                ...cart,
                researchOption: { name: "Basic Research", cre8dits: 1 },
            });
        } else if (research == "intermediate") {
            setCart({
                ...cart,
                researchOption: { name: "Intermediate Research", cre8dits: 2 },
            });
        } else if (research == "comprehensive") {
            setCart({
                ...cart,
                researchOption: { name: "Comprehensive Research", cre8dits: 3 },
            });
        } else if (research == "exhaustive") {
            setCart({
                ...cart,
                researchOption: { name: "Exhaustive Research", cre8dits: 6 },
            });
        }
    }, [research]);

    useEffect(() => {
        if (length == 800) {
            setCart({
                ...cart,
                lengthOption: { name: "800 words (~5 minutes)", cre8dits: 2 },
            });
        } else if (length == 1300) {
            setCart({
                ...cart,
                lengthOption: { name: "1,300 words (~8 minutes)", cre8dits: 4 },
            });
        } else if (length == 1600) {
            setCart({
                ...cart,
                lengthOption: { name: "1,600 words (~10 minutes)", cre8dits: 6 },
            });
        } else if (length == 2000) {
            setCart({
                ...cart,
                lengthOption: { name: "2,000 words (~12 minutes)", cre8dits: 8 },
            });
        } else if (length == 2500) {
            setCart({
                ...cart,
                lengthOption: { name: "2,500 words (~15 minutes)", cre8dits: 10 },
            });
        } else if (length == 3200) {
            setCart({
                ...cart,
                lengthOption: { name: "3,200 words (~20 minutes)", cre8dits: 12 },
            });
        } else if (length == 4000) {
            setCart({
                ...cart,
                lengthOption: { name: "4,000 words (~25 minutes)", cre8dits: 14 },
            });
        } else if (length == 4800) {
            setCart({
                ...cart,
                lengthOption: { name: "4,800 words (~30 minutes)", cre8dits: 16 },
            });
        } else if (length == 6400) {
            setCart({
                ...cart,
                lengthOption: { name: "6,400 words (~40 minutes)", cre8dits: 24 },
            });
        }
    }, [length]);


    // useEffect(() => {
    //     const cre8ditsRequired = cart.researchOption.cre8dits + cart.lengthOption.cre8dits;
    //     const cre8ditsRemaining = cart.cre8ditsAvailable - cre8ditsRequired;

    //     setCart({
    //         ...cart,
    //         cre8ditsRequired,
    //         cre8ditsRemaining
    //     });
    // }, [cart]);

    const populateForm = async () => {
        setIsPopulating(true);

        if (!channel || !videoTitles || videoTitles.length < 1) {
            setIsDBSaved(false);
            setShowPopulateErr(true);

            setTimeout(() => {
                return router.push("/tools/generators/youtube-channel-analyzer");
            }, 6000);
        }

        try {
            const data = {
                "channel": channel,
                "demographics": demographics,
                "psychographics": psychographics
            };

            const response = await axios.post("/api/tools/assistants/youtube-script-assistant-populate", data, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            if (!response || !response.data) {
                throw new Error("No response from the server");
            }

            await setTopic(response.data.inputs.topic);
            await setAngle(response.data.inputs.angle);
            await setAudience(response.data.inputs.audience);
            await setGoal(response.data.inputs.goal);

            setIsPopulating(false);
        } catch (error) {
            console.error(error);
            toast.error("Error populating the form. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsPopulating(false);
        }
    };

    const cre8te = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        if (!session) {
            router.push("/auth/signin/?redirect=/tools/assistants/youtube-script-assistant");
        }

        if (topic.trim() === "" || angle.trim() === "" || audience.trim() === "" || goal.trim() === "") {
            setIsLoading(false);
            return toast.error("Please fill in all the required fields.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }

        try {
            const channel_id = router.query.channel_id || null;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/assistants/youtube-script-assistant/save`, {
                channel_id,
                topic,
                angle,
                audience,
                goal,
                scriptNumber,
                language,
                length,
                format,
                research
            }, {
                headers: {
                    "Authorization": `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            setIsLoading(false);

            if (response && response.data) {
                toast.success("Script created successfully!");
                // router.push(`/tools/assistants/youtube-script-assistant/${response.data.script_id}/show`);
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            
            // if (error.response.status === 401) {
            //     signOut({ callbackUrl: "/auth/signin?redirect=/tools/assistants/youtube-script-assistant" });
            // }
                
            toast.error("Error creating the script. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    const getFromDatabase = async (channelId) => {
        setIsLoading(true);

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/generators/youtube-channel-analyzer/${channelId}/show`);

            if (!response || !response.data) {
                throw new Error("No response from the server");
            }

            await setInput(response.data.channel_username);
            await setChannel(JSON.parse(response.data.channel));
            await setVideoTitles(JSON.parse(response.data.videoTitles));
            await setEstimatedRevenue(JSON.parse(response.data.estimatedRevenue));
            await setEstimatedNetworth(response.data.estimatedNetworth);
            await setQualityScore(response.data.qualityScore);

            await setOverview(response.data.overview);
            await setDemographics(JSON.parse(response.data.demographics));
            await setPsychographics(JSON.parse(response.data.psychographics));
            await setOnlineBehaviors(JSON.parse(response.data.onlineBehaviors));
            await setOfflineBehaviors(JSON.parse(response.data.offlineBehaviors));

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
                                    <span className="pre-title-bg">Content Assistants</span>
                                    <h2 className="title">
                                        YouTube Script AI Assistant
                                    </h2>

                                    <p className="disc">
                                        Cre8te engaging YouTube video scripts with our AI assistant in seconds.
                                    </p>

                                    <div className="youtube-script-assistant search__generator mt--50">
                                        <div className="tab-content mt--50" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                <div className="searchoptopn-area mb--30">
                                                    <form onSubmit={cre8te}>
                                                        <div className="form-group">
                                                            <button onClick={populateForm} type="button" className="generate-btn position-relative" style={{ display: "block", maxWidth: "100%", left: "0", right: "0", transform: "none", background: "#7419e4" }} disabled={!isDBSaved}>
                                                                {isPopulating ? "" : "Click here to automatically populate the form based on YouTube channel analysis"}
                                                                {isPopulating ? (
                                                                    <i className="fa-solid fa-spinner-third fa-spin"></i>
                                                                ) : ("")}
                                                            </button>
                                                            {showPopulateErr && (
                                                                <p className="alert badge-info mt--10">Looks like you haven't analyzed a YouTube channel yet. You will be redirected to the YouTube Channel Analyzer tool to process any channel of your choice.</p>
                                                            )}
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="text-left h5">Topic</label>
                                                            <textarea name="topic" required placeholder="What do you to make a video about?" defaultValue={topic} onChange={(e) => setTopic(e.target.value)}></textarea>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="text-left h5">Unique Angle</label>
                                                            <textarea name="angle" required placeholder="What makes your video unique?" defaultValue={angle} onChange={(e) => setAngle(e.target.value)}></textarea>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="text-left h5">Audience</label>
                                                            <textarea name="reference" required placeholder="Who is the intended viewer? Be as specific as possible." defaultValue={audience} onChange={(e) => setAudience(e.target.value)}></textarea>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="text-left h5">Audience Goal</label>
                                                            <textarea name="goal" required placeholder="What do you want your audience to take away from the video? This is the grand payoff for watching" defaultValue={goal} onChange={(e) => setGoal(e.target.value)}></textarea>
                                                            <span className="text-muted">e.g., Give the viewer all the information they need to decide which of these smartphones is the best. But don't make the answer obvious - include a surprise twist at the end to introduce a killer feature that makes the Google Pixel the best.</span>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="text-left h5">Script Number</label>
                                                            <input type="number" name="number" required placeholder="The number of scripts you want to generate" defaultValue={scriptNumber} onChange={(e) => setScriptNumber(e.target.value)} />
                                                        </div>

                                                        <div className="form-group nice-select-wrap">
                                                            <label className="text-left h5">Language</label>
                                                            <select className="nice-select" name="language" onChange={(e) => setLanguage(e.target.value)} defaultValue={language}>
                                                                {languageOptions.map((option, index) => (
                                                                    <option key={index} value={option}>{option}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="text-left h5">Target Length</label>
                                                            <select className="nice-select" name="length" onChange={(e) => setLength(e.target.value)} defaultValue={length}>
                                                                {lengthOptions.map((option, index) => (
                                                                    <option key={index} value={option.value}>{option.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="form-group nice-select-wrap">
                                                            <label className="text-left h5">Format</label>
                                                            <select className="nice-select" name="format" onChange={(e) => setFormat(e.target.value)} defaultValue={format}>
                                                                {formatOptions.map((option, index) => (
                                                                    <option key={index} value={option}>{option}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="form-group">
                                                            <div className="row">
                                                                <div className="col-lg-6">
                                                                    <div className="research-options mb-5" style={{ padding: "20px" }}>
                                                                        <p className="disk">Background research is essential for creating a detailed and accurate script, especially when explaining complex topics, giving personal recommendations, or covering current events. It helps break down intricate subjects, lends credibility to recommendations, and ensures information is timely and relevant. Primary sources for research include individual YouTube video links and website URLs, which offer diverse perspectives and media types. This multifaceted approach enriches the script and engages the audience by catering to various learning preferences.</p>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6">
                                                                    <div className="research-options">
                                                                        <div onClick={() => setResearch("basic")} className={`option basic ${research === "basic" ? "selected" : ""}`}>
                                                                            <div className="title">Basic</div>
                                                                            <div className="description">Add up to <strong>1,500 words</strong> of background research</div>
                                                                            <div className="cre8dits">-1 cre8dit</div>
                                                                        </div>
                                                                        <div onClick={() => setResearch("intermediate")} className={`option intermediate ${research === "intermediate" ? "selected" : ""}`}>
                                                                            <div className="title">Intermediate</div>
                                                                            <div className="description">Add up to <strong>5,000 words</strong> of background research</div>
                                                                            <div className="cre8dits">-2 cre8dits</div>
                                                                        </div>
                                                                        <div onClick={() => setResearch("comprehensive")} className={`option comprehensive ${research === "comprehensive" ? "selected" : ""}`}>
                                                                            <div className="title">Comprehensive</div>
                                                                            <div className="description">Add up to <strong>15,000 words</strong> of background research</div>
                                                                            <div className="cre8dits">-3 cre8dits</div>
                                                                        </div>
                                                                        <div onClick={() => setResearch("exhaustive")} className={`option exhaustive ${research === "exhaustive" ? "selected" : ""}`}>
                                                                            <div className="title">Exhaustive</div>
                                                                            <div className="description">Add up to <strong>30,000 words</strong> of background research</div>
                                                                            <div className="cre8dits">-6 cre8dits</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className="research-summary">
                                                                        <table className="table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className="description-header">
                                                                                        <p className="disk m-0">Description</p>
                                                                                    </th>
                                                                                    <th className="cre8dits-header text-right">
                                                                                        <p className="disk m-0">Cre8dits</p>
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>

                                                                            <tbody>
                                                                                {cart.researchOption && (
                                                                                <tr>
                                                                                    {cart.researchOption.name && (
                                                                                        <td className="description-content">
                                                                                            <p className="disk m-0">{cart.researchOption.name}</p>
                                                                                        </td>
                                                                                    )}

                                                                                    {cart.researchOption.cre8dits && (
                                                                                        <td className="cre8dits-content">
                                                                                            <p className="disk m-0">{cart.researchOption.cre8dits}</p>
                                                                                        </td>
                                                                                    )}
                                                                                </tr>
                                                                                )}

                                                                                {cart.lengthOption && (
                                                                                <tr>
                                                                                    {cart.lengthOption.name && (
                                                                                        <td className="description-content">
                                                                                            <p className="disk m-0">{cart.lengthOption.name}</p>
                                                                                        </td>
                                                                                    )}

                                                                                    {cart.lengthOption.cre8dits && (
                                                                                        <td className="cre8dits-content">
                                                                                            <p className="disk m-0">{cart.lengthOption.cre8dits}</p>
                                                                                        </td>
                                                                                    )}
                                                                                </tr>
                                                                                )}
                                                                            </tbody>

                                                                            <tfoot>
                                                                                <tr>
                                                                                    <td className="cre8dits-required text-left">Cre8dits Required:</td>
                                                                                    <td className="cre8dits-value text-right">{cart.cre8ditsRequired}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="cre8dits-available text-left">Cre8dits Available:</td>
                                                                                    <td className="cre8dits-value text-right">{cart.cre8ditsAvailable}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="cre8dits-remaining text-left">Cre8dits Remaining After:</td>
                                                                                    <td className="cre8dits-value text-right">{cart.cre8ditsRemaining}</td>
                                                                                </tr>
                                                                            </tfoot>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <button type="submit" className="generate-btn position-relative" style={{ width: "100%", left: "0", right: "0", transform: "none" }}>
                                                                {isLoading ? ("Cre8ting") : ("Cre8te")}
                                                                {isLoading ? (
                                                                    <i className="fa-solid fa-spinner-third fa-spin"></i>
                                                                ) : (
                                                                    <img src="/images/icons/13.png" alt="" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </form>
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

export default YouTubeScriptAssistant;