import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";

import ContentSkeleton from "@/components/Skeletons/Content";

import sal from "sal.js";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";
import { copy } from "clipboard";

const YoutubeAssistant = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTitles, setIsLoadingTitles] = useState(false);
    const [isLoadingDescription, setIsLoadingDescription] = useState(false);
    const [isLoadingTags, setIsLoadingTags] = useState(false);
    const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);

    const [videoId, setVideoId] = useState("");
    const [videoDetails, setVideoDetails] = useState({});
    const [transcript, setTranscript] = useState("");
    
    const [titles, setTitles] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [thumbnails, setThumbnails] = useState([]);

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

    const generate = async (event) => {
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

        setVideoId(youtubeUrl.split("v=")[1] || youtubeUrl.split("be/")[1]);

        setIsLoading(true);
        
        setVideoDetails({});
        setTranscript("");
        setTitles([]);
        setSelectedTitle("");
        setDescription("");
        setTags([]);
        setThumbnails([]);

        try {
            const response = await axios.post("/api/tools/assistants/youtube-assistant", { youtubeUrl }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            await setVideoDetails(response.data.videoDetails);
            await setTranscript(response.data.transcript);
            setIsLoading(false);

            await getTitles();
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

    const getTitles = async () => {
        setIsLoadingTitles(true);

        console.log('video id', videoId)

        try {
            const response = await axios.post("/api/tools/assistants/youtube-assistant-titles", { videoId }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            await setTitles(response.data.titles);
            await setSelectedTitle(response.data.titles[0]);
            setIsLoadingTitles(false);

            getDescription(response.data.titles[0]);
            getThumbnails(response.data.titles[0]);
        } catch (error) {
            console.error(error);
            toast.error("Error generating titles. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingTitles(false);
        }
    };

    const getDescription = async (title = selectedTitle.title) => {
        setIsLoadingDescription(true);
        setDescription("");

        try {
            const response = await axios.post("/api/tools/assistants/youtube-assistant-description", { title }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            await setDescription(response.data.description);
            setIsLoadingDescription(false);

            await getTags();
        } catch (error) {
            console.error(error);
            toast.error("Error generating description. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingDescription(false);
        }
    };

    const getTags = async () => {
        setIsLoadingTags(true);
        setTags([]);

        try {
            const response = await axios.post("/api/tools/assistants/youtube-assistant-tags", { videoId }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            setTags(response.data.tags);
            setIsLoadingTags(false);
        } catch (error) {
            console.error(error);
            toast.error("Error generating tags. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingTags(false);
        }
    };

    const getThumbnails = async (title = selectedTitle.title) => {
        setIsLoadingThumbnails(true);
        setThumbnails([]);

        try {
            const response = await axios.post("/api/tools/assistants/youtube-assistant-thumbnails", { title }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            setThumbnails(response.data.thumbnails);
            setIsLoadingThumbnails(false);
        } catch (error) {
            console.error(error);
            toast.error("Error generating thumbnails. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingThumbnails(false);
        }
    };

    const addTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
          e.preventDefault();
          if (!tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
          }
        }
    };

    const handleRemoveTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
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
                                        Youtube AI Assistant
                                    </h2>

                                    <p className="disc">
                                        Use Cre8teGPT's YouTube AI Assistant to optimize your YouTube videos with algorithm-friendly titles, descriptions, tags, thumbnails and more. Simply paste the URL of your video, and let our AI do the rest!
                                    </p>

                                    <div className="search__generator mt--50">
                                        <div className="tab-content mt--50" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                <div className="searchoptopn-area mb--30">
                                                    <form action="#" onSubmit={generate}>
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
                        
                        {isLoading && <ContentSkeleton number={1} />}
                        {(transcript && transcript.trim() !== "") && (
                        <div className="search__generator mt--50">
                            <div className="tab-content mt--50" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="searchoptopn-area mb--30">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <h4 className="title" data-tooltip-id="transcript-tooltip" data-tooltip-content="Transcripts are pulled from YouTube captions or audio-to-text conversion.">
                                                        Transcript
                                                    </h4>
                                                    <textarea className="form-control" rows="10" defaultValue={transcript} readOnly></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}

                        {isLoadingTitles && <ContentSkeleton number={1} />}
                        {(titles.length > 0) && (
                        <div className="search__generator mt--50">
                            <div className="tab-content mt--50" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="searchoptopn-area mb--30">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <h4 className="title">
                                                        Titles
                                                    </h4>
                                                </div>
                                                <table className="youtube-assistant-table table table-bordered table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Title</th>
                                                            <th scope="col">Viral Score</th>
                                                            <th scope="col">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {titles.map((title, index) => (
                                                        <tr key={index}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td><strong>{title.title}</strong></td>
                                                            <td>{title.viralScore}</td>
                                                            <td>
                                                                <a className="btn btn-primary" onClick={() => setSelectedTitle(title.title)}>Select</a>
                                                            </td>
                                                        </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        
                                        <div className="video-list row mt--20">
                                            {titles.map((title, index) => (
                                            <div className="video-card col-lg-4" key={index}>
                                                <img src={videoDetails.thumbnail} alt={videoDetails.title} className="thumbnail w-100" />
                                                <div className="video-info">
                                                    <h5 className="video-title mb-1 mt-2">{title.title}</h5>
                                                    <p className="video-channel mb-1">{videoDetails.author}</p>
                                                    <p className="video-metrics">
                                                        {Math.floor(Math.random() * 1000)} views • {Math.floor(Math.random() * 100)} days ago
                                                    </p>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}

                        {selectedTitle && (
                        <div className="search__generator mt--50">
                            <div className="tab-content mt--50" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="searchoptopn-area mb--30">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <h4 className="title">
                                                        Selected Title
                                                    </h4>
                                                    <div class="input-group mb-3">
                                                        <input type="text" class="form-control" defaultValue={selectedTitle.title} readOnly aria-describedby="basic-addon2" />
                                                        {/* <div class="input-group-append" style={{ fontSize: "20px", top: "0px", background: "#701dd6", padding: "15px", color: "#fff" }}>
                                                            <span class="input-group-text" id="basic-addon2">
                                                                <i className="fa-solid fa-copy" onClick={() => copy(selectedTitle.title)}></i>
                                                            </span>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}

                        {isLoadingDescription && <ContentSkeleton number={1} />}
                        {(description && description.trim() !== "") && (
                        <div className="search__generator mt--50">
                            <div className="tab-content mt--50" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="searchoptopn-area mb--30">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <h4 className="title">
                                                        Description
                                                    </h4>
                                                    <textarea className="form-control" rows="5" defaultValue={description} readOnly></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <a href="#" className="rts-btn btn-primary" onClick={(e) => { e.preventDefault(); getDescription(); }}>
                                                        Re-optimize Description
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}

                        {isLoadingTags && <ContentSkeleton number={1} />}
                        {(tags.length > 0) && (
                        <div className="search__generator mt--50">
                            <div className="tab-content mt--50" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="searchoptopn-area mb--30">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <h4 className="title">
                                                        Tags
                                                    </h4>
                                                    <div className="tag-input-container mb--20">
                                                        <div className="tag-list">
                                                            {tags.map((tag, index) => (
                                                            <div key={index} className="tag">
                                                                {tag}
                                                                <span className="tag-close-icon" onClick={() => handleRemoveTag(index)}>
                                                                &times;
                                                                </span>
                                                            </div>
                                                            ))}
                                                            <input
                                                                type="text"
                                                                value={tagInput}
                                                                onChange={(e) => setTagInput(e.target.value)}
                                                                onKeyDown={addTag}
                                                                placeholder="Add a tag"
                                                                className="tag-input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <a href="#" className="rts-btn btn-primary" onClick={(e) => { e.preventDefault(); getTags(); }}>
                                                            Re-optimize Tags
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}

                        {isLoadingThumbnails && <ContentSkeleton number={1} />}
                        {(thumbnails.length > 0) && (
                        <div className="search__generator mt--50">
                            <div className="tab-content mt--50" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="searchoptopn-area mb--30">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <h4 className="title">
                                                        Thumbnails
                                                    </h4>
                                                </div>
                                                <div className="video-list row mt--20">
                                                    {thumbnails.map((thumbnail, index) => (
                                                    <div className="video-card col-lg-4" key={index}>
                                                        <img src={thumbnail} alt={selectedTitle.title} className="thumbnail w-100" />
                                                        <div className="video-info">
                                                            <h5 className="video-title mb-1 mt-2">{selectedTitle.title}</h5>
                                                            <p className="video-channel mb-1">{videoDetails.author}</p>
                                                            <p className="video-metrics">
                                                                {Math.floor(Math.random() * 1000)} views • {Math.floor(Math.random() * 100)} days ago
                                                            </p>
                                                        </div>
                                                    </div>
                                                    ))}
                                                </div>
                                                <div className="form-group">
                                                    <a href="#" className="rts-btn btn-primary" onClick={(e) => { e.preventDefault(); getThumbnails(); }}>
                                                        Re-optimize Thumbnails
                                                    </a>
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

export default YoutubeAssistant;