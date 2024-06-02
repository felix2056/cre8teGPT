import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

import WordCloud from "@/components/AITools/Utils/WordCloud";

import sal from "sal.js";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";
import { copy } from "clipboard";

const YouTubeSummarizer = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isActiveTab, setIsActiveTab] = useState("transcript");
    const [isSummaryFetched, setIsSummaryFetched] = useState(false);
    const [isMindMapFetched, setIsMindMapFetched] = useState(false);
    const [isWordCloudFetched, setIsWordCloudFetched] = useState(false);

    const [videoDetails, setVideoDetails] = useState({});
    const [transcript, setTranscript] = useState("");
    const [summary, setSummary] = useState("");
    const [mindMap, setMindMap] = useState("");
    const [wordCloud, setWordCloud] = useState("");

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
        if (isActiveTab === "summary") generateSummary();
        if (isActiveTab === "mindmap") generateMindMap();
        if (isActiveTab === "wordcloud") generateWordCloud();
    }, [isActiveTab]);

    const generateTranscript = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const youtubeUrl = formData.get("youtubeUrl");

        if (!youtubeUrl || youtubeUrl.trim() === "") {
            toast.error("Please enter a valid YouTube video URL 📹✒️.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("/api/tools/generators/youtube-transcriber", { youtubeUrl }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });
            
            setVideoDetails(response.data.videoDetails);
            setTranscript(response.data.transcript);
            
            setIsSummaryFetched(false);
            setIsMindMapFetched(false);
            setIsWordCloudFetched(false);

            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Error generating transcript. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setTranscript("");
            setIsLoading(false);
        }
    };

    const generateSummary = async () => {
        if (isSummaryFetched)  return;

        setIsLoading(true);

        try {
            const videoId = videoDetails.id;
            const response = await axios.post("/api/tools/generators/youtube-transcript-summarizer", { videoId }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            setSummary(response.data.summary);
            setIsSummaryFetched(true);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Error generating summary. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setSummary("");
            setIsLoading(false);
        }
    };

    const generateMindMap = async () => {
        if (isMindMapFetched) return;

        setIsLoading(true);

        try {
            const response = await axios.post("/api/tools/generators/youtube-mindmap", { transcript }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            setMindMap(response.data.mindmap)
            setIsMindMapFetched(true);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Error generating mind map. Please try again later.", {
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

    const generateWordCloud = async () => {
        if (isWordCloudFetched) return;

        setIsLoading(true);

        try {
            const videoId = videoDetails.id;
            const response = await axios.post("/api/tools/generators/youtube-transcript-wordcloud", { videoId }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            setWordCloud(response.data.wordcloud)
            
            setIsWordCloudFetched(true);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Error generating word cloud. Please try again later.", {
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

    const getReadTime = (text) => {
        const wordsPerMinute = 200;

        if (typeof text === "string") {
            const numberOfWords = text.split(/\s/g).length;
            return Math.ceil(numberOfWords / wordsPerMinute);
        }

        if (Array.isArray(text)) {
            const numberOfWords = text.join(" ").split(/\s/g).length;
            return Math.ceil(numberOfWords / wordsPerMinute);
        }

        return 0;
    };

    const getDuration = (duration) => {
        const hours = duration.match(/(\d+)H/);
        const minutes = duration.match(/(\d+)M/);
        const seconds = duration.match(/(\d+)S/);

        let durationString = "";
        if (hours) {
            durationString += `${hours[1]}h `;
        }

        if (minutes) {
            durationString += `${minutes[1]}m `;
        }

        if (seconds) {
            durationString += `${seconds[1]}s`;
        }

        return durationString;
    };

    const saveAsTxt = () => {
        const element = document.createElement("a");
        const file = new Blob([transcript], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "transcript.txt";
        document.body.appendChild(element);
        element.click();
    };

    const copyToClipboard = (text) => {
        copy(text);
        toast.success("Copied", {
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

    return (
        <>
            <ToastContainer />
            
            <div className="rainbow-service-area rainbow-section-gap">
                <div className="caase-details-area-start rts-section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area top-tt">
                                    <span className="pre-title-bg">Content Generators</span>
                                    <h2 className="title">
                                        Youtube Summarizer AI
                                    </h2>

                                    <p className="disc">
                                        Use Cre8teGPT's AI-powered YouTube video summarizer to generate high quality, SEO-friendly summaries of your favorite youtube videos in seconds.
                                    </p>

                                    <div className="search__generator mt--50">
                                        <div className="tab-content mt--50" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                <div className="searchoptopn-area mb--30">
                                                    <form action="#" onSubmit={generateTranscript}>
                                                        <input type="url" name="youtubeUrl" placeholder="Paste YouTube video URL" required />
                                                        <button type="submit">
                                                            {isLoading ? ("Generating") : ("Generate")}
                                                            {isLoading ? (
                                                                <i className="fa-solid fa-spinner-third fa-spin"></i>
                                                            ) : (
                                                                <img src="/images/icons/13.png" alt="" />
                                                            )}
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {((transcript) && (videoDetails && Object.keys(videoDetails).length > 0)) && (
                        <div className="row mt--20">
                            <div className="col-lg-12 plr--120 plr_md--60 plr_sm--15">
                                <div className="yt-wrapper easy-freature-area-wrapper bg_image">
                                    <div className="row">
                                        <div className="col-xl-4 col-lg-5 col-md-12 col-sm-12 col-12">
                                            <div className="image-area-tab-content">
                                                <div className="d-flex align-items-start">
                                                    <div className="tab-content" id="v-pills-tabContent">
                                                        <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                            <div className="imge-thumb-vedio">
                                                                <iframe className="w-100" width="1024" height="320" src={`https://www.youtube.com/embed/${videoDetails.id}`} title={videoDetails.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                                <div className="youtube-info">
                                                                    <h4 className="title">{videoDetails.title}</h4>

                                                                    <div className="row">
                                                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                                                            <div className="single-info">
                                                                                <h5 className="title">Author</h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                                                            <div className="single-info">
                                                                                <h5 className="title">{videoDetails.author}</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                                                            <div className="single-info">
                                                                                <h5 className="title">Video Duration</h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                                                            <div className="single-info">
                                                                                <h5 className="title">{getDuration(videoDetails.duration)}</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                                                            <div className="single-info">
                                                                                <h5 className="title">Read Time</h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                                                            <div className="single-info">
                                                                                <h5 className="title">{ getReadTime(transcript) } mins</h5>
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
                                        
                                        <div className="col-xl-8 col-lg-7 col-md-12 col-sm-12 col-12">
                                            <div className="tab-button-area bg-white p-5">
                                                <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                    <div className="yt-tabs">
                                                        <div className="left-tabs">
                                                            <div className={isActiveTab === "transcript" ? "yt-tabs-div yt-tabs-active" : "yt-tabs-div"} onClick={() => { setIsActiveTab("transcript") }}>
                                                                Transcript 
                                                            </div>
                                                            <div className={isActiveTab === "summary" ? "yt-tabs-div yt-tabs-active" : "yt-tabs-div"} onClick={() => { setIsActiveTab("summary") }}>
                                                                Summary
                                                            </div>
                                                            <div className={isActiveTab === "mindmap" ? "yt-tabs-div yt-tabs-active" : "yt-tabs-div"} onClick={() => { setIsActiveTab("mindmap") }}>
                                                                MindMap
                                                            </div>
                                                            <div className={isActiveTab === "wordcloud" ? "yt-tabs-div yt-tabs-active" : "yt-tabs-div"} onClick={() => { setIsActiveTab("wordcloud") }}>
                                                                WordCloud
                                                            </div>
                                                            {/* <div className="yt-tabs-div" style={{ position: "relative"}}> AI Chat </div> */}
                                                        </div>

                                                        <div className="right-tabs">
                                                            <div className="btns">
                                                                <button type="button" className="el-button btn-share el-button--default mb-0 mr--10" onClick={() => { saveAsTxt() }}>
                                                                    <span>
                                                                        Save
                                                                        {/* <i className="fa-solid fa-file-download"></i> */}
                                                                    </span>
                                                                </button>

                                                                <button type="button" className="el-button btn-share el-button--default mb-0" onClick={() => { copyToClipboard(transcript) }}>
                                                                    <span>
                                                                        Copy
                                                                        {/* <i className="fa-solid fa-clipboard"></i> */}
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="yt-transcript h-500px w-100 overflow-y-scroll">
                                                        {isActiveTab === "transcript" && (
                                                        <div className="transcript mt--10">
                                                            <div role="group">
                                                                <div className="listItem">
                                                                    {Array.isArray(transcript) && transcript.map((text, index) => (
                                                                        <div className="yt-transcript-item">
                                                                            {/* <div className="yt-transcript-item-time">
                                                                                <div className="yt-transcript-item-time-a"> 00:01 </div>
                                                                            </div> */}

                                                                            <div className="yt-transcript-item-text">
                                                                                <div>
                                                                                    <span>{text}</span>
                                                                                </div>

                                                                                <div className="yt-transcript-item-text-tool">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="20" height="20" viewBox="0 0 20 20" style={{ marginLeft: "12px", cursor: "pointer" }} onClick={() => { copyToClipboard(text) }}>
                                                                                        <defs>
                                                                                            <clipPath id="master_svg0_12_1997">
                                                                                                <rect x="0" y="0" width="20" height="20" rx="0"></rect>
                                                                                            </clipPath>
                                                                                        </defs>
                                                                                        <g clip-path="url(#master_svg0_12_1997)">
                                                                                            <g>
                                                                                                <path d="M5.140625625,14.869178125L2.8398456249999997,14.869178125C1.951171625,14.869178125,1.228515625,14.146478125,1.228515625,13.257778125L1.228515625,2.9414081249999997C1.228515625,2.0527341249999997,1.951171625,1.330078125,2.8398456249999997,1.330078125L12.388715625,1.330078125C13.277315625,1.330078125,14.000015625,2.0527341249999997,14.000015625,2.9414081249999997L14.000015625,4.310548125C14.000015625,4.525388125,13.824215625,4.701168125000001,13.609415625,4.701168125000001C13.394515625,4.701168125000001,13.218715625,4.525388125,13.218715625,4.310548125L13.218715625,2.9414081249999997C13.218715625,2.484378125,12.847615625,2.111328125,12.388715625,2.111328125L2.8398456249999997,2.111328125C2.382815625,2.111328125,2.009765625,2.4824181249999997,2.009765625,2.9414081249999997L2.009765625,13.259778125C2.009765625,13.716778125,2.3808556249999997,14.089878125,2.8398456249999997,14.089878125L5.140625625,14.089878125C5.355465625,14.089878125,5.531245625,14.265578125,5.531245625,14.480478125C5.531245625,14.695278125,5.357425625,14.869178125,5.140625625,14.869178125Z" fill="#212427" fill-opacity="0.6000000238418579"></path>
                                                                                            </g>
                                                                                            <g>
                                                                                                <path d="M17.523465625,18.966787500000002L7.830075625,18.966787500000002C6.999999625,18.966787500000002,6.322265625,18.2909875,6.322265625,17.4589875L6.322265625,6.9999975C6.322265625,6.1699215,6.998046625,5.4921875,7.830075625,5.4921875L17.525365625,5.4921875C18.355465625,5.4921875,19.033165625000002,6.1679685,19.033165625000002,6.9999975L19.033165625000002,17.4609875C19.031265625,18.2909875,18.355465625,18.966787500000002,17.523465625,18.966787500000002ZM7.830075625,6.2734375C7.429685625,6.2734375,7.103514625,6.5996075,7.103514625,6.9999975L7.103514625,17.4609875C7.103514625,17.8612875,7.429685625,18.1874875,7.830075625,18.1874875L17.525365625,18.1874875C17.925765625,18.1874875,18.251965625,17.8612875,18.251965625,17.4609875L18.251965625,6.9999975C18.251965625,6.5996075,17.925765625,6.2734365,17.525365625,6.2734365L7.830075625,6.2734375Z" fill="#212427" fill-opacity="0.6000000238418579"></path>
                                                                                            </g>
                                                                                        </g>
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        )}

                                                        {isActiveTab === "summary" && (
                                                        <div className="summary mt--10">
                                                            {isLoading && (
                                                            <div className="text-center">
                                                                <div className="spinner-border text-primary" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            </div>
                                                            )}

                                                            {summary && (
                                                            <div className="summary-content">
                                                                <span dangerouslySetInnerHTML={{__html: summary}}></span>

                                                                <div className="yt-transcript-item-text-tool">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="20" height="20" viewBox="0 0 20 20" style={{ marginLeft: "12px", cursor: "pointer" }} onClick={() => { copyToClipboard(text) }}>
                                                                        <defs>
                                                                            <clipPath id="master_svg0_12_1997">
                                                                                <rect x="0" y="0" width="20" height="20" rx="0"></rect>
                                                                            </clipPath>
                                                                        </defs>
                                                                        <g clip-path="url(#master_svg0_12_1997)">
                                                                            <g>
                                                                                <path d="M5.140625625,14.869178125L2.8398456249999997,14.869178125C1.951171625,14.869178125,1.228515625,14.146478125,1.228515625,13.257778125L1.228515625,2.9414081249999997C1.228515625,2.0527341249999997,1.951171625,1.330078125,2.8398456249999997,1.330078125L12.388715625,1.330078125C13.277315625,1.330078125,14.000015625,2.0527341249999997,14.000015625,2.9414081249999997L14.000015625,4.310548125C14.000015625,4.525388125,13.824215625,4.701168125000001,13.609415625,4.701168125000001C13.394515625,4.701168125000001,13.218715625,4.525388125,13.218715625,4.310548125L13.218715625,2.9414081249999997C13.218715625,2.484378125,12.847615625,2.111328125,12.388715625,2.111328125L2.8398456249999997,2.111328125C2.382815625,2.111328125,2.009765625,2.4824181249999997,2.009765625,2.9414081249999997L2.009765625,13.259778125C2.009765625,13.716778125,2.3808556249999997,14.089878125,2.8398456249999997,14.089878125L5.140625625,14.089878125C5.355465625,14.089878125,5.531245625,14.265578125,5.531245625,14.480478125C5.531245625,14.695278125,5.357425625,14.869178125,5.140625625,14.869178125Z" fill="#212427" fill-opacity="0.6000000238418579"></path>
                                                                            </g>
                                                                            <g>
                                                                                <path d="M17.523465625,18.966787500000002L7.830075625,18.966787500000002C6.999999625,18.966787500000002,6.322265625,18.2909875,6.322265625,17.4589875L6.322265625,6.9999975C6.322265625,6.1699215,6.998046625,5.4921875,7.830075625,5.4921875L17.525365625,5.4921875C18.355465625,5.4921875,19.033165625000002,6.1679685,19.033165625000002,6.9999975L19.033165625000002,17.4609875C19.031265625,18.2909875,18.355465625,18.966787500000002,17.523465625,18.966787500000002ZM7.830075625,6.2734375C7.429685625,6.2734375,7.103514625,6.5996075,7.103514625,6.9999975L7.103514625,17.4609875C7.103514625,17.8612875,7.429685625,18.1874875,7.830075625,18.1874875L17.525365625,18.1874875C17.925765625,18.1874875,18.251965625,17.8612875,18.251965625,17.4609875L18.251965625,6.9999975C18.251965625,6.5996075,17.925765625,6.2734365,17.525365625,6.2734365L7.830075625,6.2734375Z" fill="#212427" fill-opacity="0.6000000238418579"></path>
                                                                            </g>
                                                                        </g>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                        )}

                                                        {isActiveTab === "mindmap" && (
                                                        <div className="mindmap mt--10">
                                                            {isLoading && (
                                                            <div className="text-center">
                                                                <div className="spinner-border text-primary" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            </div>
                                                            )}

                                                            {mindMap && (
                                                            <div className="mindmap-content">
                                                                <img src={`data:image/png;base64,${mindMap}`} alt="Mind Map" className="w-100" />
                                                            </div>
                                                            )}  
                                                        </div>    
                                                        )}

                                                        {isActiveTab === "wordcloud" && (
                                                        <div className="wordcloud mt--10">
                                                            {isLoading && (
                                                            <div className="text-center">
                                                                <div className="spinner-border text-primary" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            </div>
                                                            )}

                                                            {wordCloud && (
                                                            <div className="wordcloud-content">
                                                                <WordCloud transcript={wordCloud} width={800} height={400} showControls={false} />
                                                            </div>
                                                            )}  
                                                        </div>    
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}

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
                                                                    <rect width="40" height="40" rx="4" fill="#BDE3FF" fill-opacity="0.4"></rect>
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

                        <div className="row case-lg-img-w">
                            <div className="share-mid">
                                <img src="/images/case/06.png" alt="" />
                            </div>

                            <div className="col-lg-6 mt--150 mt_sm--50">
                                <div className="use-case-left-thumb">
                                    <h3 className="title">Input Ingredients</h3>
                                    <p className="disc">Enter the ingredients you have available in your kitchen.</p>
                                    <img src="/images/case/05.jpg" alt="case-images" />
                                </div>
                            </div>

                            <div className="col-lg-6 mt--20">
                                <div className="use-case-right-thumb">
                                    <div className="inner">
                                        <h3 className="title">Generate Recipes</h3>
                                        <p className="disc">Let Cre8teGPT analyze your ingredients and generate a list of delicious recipes.</p>
                                        <img src="/images/case/04.jpg" alt="case-images" />
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

export default YouTubeSummarizer;