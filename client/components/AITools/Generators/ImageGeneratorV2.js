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
import { copy } from "clipboard";

const ImageGeneratorV2 = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOverview, setIsLoadingOverview] = useState(false);
    const [isLoadingDemographics, setIsLoadingDemographics] = useState(false);
    const [isLoadingPsychographics, setIsLoadingPsychographics] = useState(false);
    const [isLoadingOnlineBehaviors, setIsLoadingOnlineBehaviors] = useState(false);
    const [isLoadingOfflineBehaviors, setIsLoadingOfflineBehaviors] = useState(false);
    const [isLoadingChannels, setIsLoadingChannels] = useState(false);
    const [isDBSaved, setIsDBSaved] = useState(false);

    const [input, setInput] = useState("");
    const [channel, setChannel] = useState({});
    const [videoTitles, setVideoTitles] = useState([]);
    const [estimatedRevenue, setEstimatedRevenue] = useState({});
    const [estimatedNetworth, setEstimatedNetworth] = useState("");
    const [qualityScore, setQualityScore] = useState(0);

    const [overview, setOverview] = useState("");
    const [demographics, setDemographics] = useState({})
    const [psychographics, setPsychographics] = useState({});
    const [onlineBehaviors, setOnlineBehaviors] = useState({});
    const [offlineBehaviors, setOfflineBehaviors] = useState({});

    const [channels, setChannels] = useState([]);

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

        getChannels();
    }, []);

    useEffect(() => {
        if (router.query.channel_id) {
            getFromDatabase(router.query.channel_id);
        }
    }, [router.query.channel_id]);

    useEffect(() => {
        if (!channel || !channel.title) return;
        if (!videoTitles || videoTitles.length === 0) return;

        // if no changes, don't re-run
        if (overview && overview.trim() !== "") return;

        getOverview();
    }, [channel, videoTitles]);

    useEffect(() => {
        if (!channel || !channel.title) return;
        if (!overview || overview.trim() === "") return;

        // if no changes, don't re-run
        if (demographics && Object.keys(demographics).length > 0) return;

        getDemographics();
    }, [overview]);

    useEffect(() => {
        if (!channel || !channel.title) return;
        if (!demographics || Object.keys(demographics).length === 0) return;

        // if no changes, don't re-run
        if (psychographics && Object.keys(psychographics).length > 0) return;

        getPsychographics();
    }, [demographics]);

    useEffect(() => {
        if (!channel || !channel.title) return;
        if (!psychographics || Object.keys(psychographics).length === 0) return;

        // if no changes, don't re-run
        if (onlineBehaviors && Object.keys(onlineBehaviors).length > 0) return;

        getOnlineBehaviors();
    }, [psychographics]);

    useEffect(() => {
        if (!channel || !channel.title) return;
        if (!onlineBehaviors || Object.keys(onlineBehaviors).length === 0) return;

        // if no changes, don't re-run
        if (offlineBehaviors && Object.keys(offlineBehaviors).length > 0) return;

        getOfflineBehaviors();
    }, [onlineBehaviors]);

    useEffect(() => {
        if (!channel || !channel.title) return;
        if (!videoTitles || videoTitles.length === 0) return;
        if (!estimatedRevenue || Object.keys(estimatedRevenue).length === 0) return;
        if (!estimatedNetworth || estimatedNetworth.trim() === "") return;
        if (qualityScore === 0) return;

        if (!overview || overview.trim() === "") return;
        if (!demographics || Object.keys(demographics).length === 0) return;
        if (!psychographics || Object.keys(psychographics).length === 0) return;
        if (!onlineBehaviors || Object.keys(onlineBehaviors).length === 0) return;
        if (!offlineBehaviors || Object.keys(offlineBehaviors).length === 0) return;

        // if (router.query.channel_id) return;

        // saveToDatabase();
    }, [offlineBehaviors]);

    const getChannels = async () => {
        setIsLoadingChannels(true);

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/generators/youtube-channel-analyzer/?limit=9`);

            if (response && response.data) {
                await setChannels(response.data.channels);
                setIsLoadingChannels(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoadingChannels(false);
        }
    };

    const analyze = async (event) => {
        event.preventDefault();
        // const formData = new FormData(event.target);
        // let input = formData.get("input");

        if (!input || input.trim() === "") {
            toast.error("Please enter a valid YouTube channel username or URL.", {
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

        setChannel({});
        setVideoTitles([]);
        setEstimatedRevenue({});
        setEstimatedNetworth("");
        setQualityScore(0);

        setOverview("");
        setDemographics({});
        setPsychographics({});
        setOnlineBehaviors({})
        setOfflineBehaviors({});

        try {
            const response = await axios.post("/api/tools/generators/youtube-channel-analyzer", { channelId: input }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            await setChannel(response.data.channelDetails);
            await setVideoTitles(response.data.videoTitles);
            await setEstimatedRevenue(response.data.estimatedRevenue);
            await setEstimatedNetworth(response.data.estimatedNetworth);
            await setQualityScore(response.data.qualityScore);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Error retrieving channel analysis. Please try again later.", {
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

    const getOverview = async () => {
        setIsLoadingOverview(true);

        try {
            // comma separated titles, only first 10
            const titles = videoTitles.slice(0, 10).map((title) => title).join(", ");
            const response = await axios.post("/api/tools/generators/youtube-channel-analyzer-overview", { channel, titles }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            if (!response || !response.data) {
                throw new Error("No response from the server");
            }

            await setOverview(response.data.overview);
            setIsLoadingOverview(false);
        } catch (error) {
            console.error(error);
            toast.error("Error retrieving channel overview. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingOverview(false);
        }
    };

    const getDemographics = async () => {
        setIsLoadingDemographics(true);

        try {
            const titles = videoTitles.slice(0, 10).map((title) => title).join(", ");
            const response = await axios.post("/api/tools/generators/youtube-channel-analyzer-demographics", { channel, titles }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            if (!response || !response.data) {
                throw new Error("No response from the server");
            }

            await setDemographics(response.data.demographics);
            setIsLoadingDemographics(false);
        } catch (error) {
            console.error(error);
            toast.error("Error retrieving channel demographics. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingDemographics(false);
        }
    };

    const getPsychographics = async () => {
        setIsLoadingPsychographics(true);

        try {
            const titles = videoTitles.slice(0, 10).map((title) => title).join(", ");
            const response = await axios.post("/api/tools/generators/youtube-channel-analyzer-psychographics", { channel, titles }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            if (!response || !response.data) {
                throw new Error("No response from the server");
            }

            await setPsychographics(response.data.psychographics);
            setIsLoadingPsychographics(false);
        } catch (error) {
            console.error(error);
            toast.error("Error retrieving channel psychographics. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingPsychographics(false);
        }
    };

    const getOnlineBehaviors = async () => {
        setIsLoadingOnlineBehaviors(true);

        try {
            const titles = videoTitles.slice(0, 10).map((title) => title).join(", ");
            const response = await axios.post("/api/tools/generators/youtube-channel-analyzer-online-behaviors", { channel, titles }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            if (!response || !response.data) {
                throw new Error("No response from the server");
            }

            await setOnlineBehaviors(response.data.onlineBehaviors);
            setIsLoadingOnlineBehaviors(false);
        } catch (error) {
            console.error(error);
            toast.error("Error retrieving channel online behaviors. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingOnlineBehaviors(false);
        }
    };

    const getOfflineBehaviors = async () => {
        setIsLoadingOfflineBehaviors(true);

        try {
            const titles = videoTitles.slice(0, 10).map((title) => title).join(", ");
            const response = await axios.post("/api/tools/generators/youtube-channel-analyzer-offline-behaviors", { channel, titles }, {
                headers: {
                    'x-user-id': 'user_' + session.user.id
                }
            });

            if (!response || !response.data) {
                throw new Error("No response from the server");
            }

            await setOfflineBehaviors(response.data.offlineBehaviors);
            setIsLoadingOfflineBehaviors(false);
        } catch (error) {
            console.error(error);
            toast.error("Error retrieving channel offline behaviors. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingOfflineBehaviors(false);
        }
    };

    const saveToDatabase = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/generators/youtube-channel-analyzer/save`, {
                channel,
                videoTitles,
                estimatedRevenue,
                estimatedNetworth,
                qualityScore,
                overview,
                demographics,
                psychographics,
                onlineBehaviors,
                offlineBehaviors
            }, {
                headers: {
                    "Authorization": `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            if (response && response.data) {
                setIsDBSaved(true);
                // router.push(`/tools/generators/youtube-channel-analyzer/${response.data.channel_id}/show`);
            }
        } catch (error) {
            console.error(error);
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

    const convertToK = (number) => {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + "M";
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + "K";
        } else {
            return number;
        }
    };

    const convertToHTML = (text) => {
        if (!text || text.trim() === "") return "";

        const lines = text.split("\n\n"); // Split text by double newlines
        let html = "";

        for (const line of lines) {
            // handle starting and ending tags
            if (line.startsWith("### ")) {
                html += `<li className="mb-4">${line.slice(4)}</li>`;
            } else if (line.startsWith("- ") || line.match(/^\d+\. /)) {
                html += `<li className="mb-4">${line.slice(2)}</li>`;
            } else if (line.startsWith("**") && line.endsWith("**")) {
                html += `<strong>${line.slice(2, -2)}</strong>`;
            } else if (line.startsWith("*") && line.endsWith("*")) {
                html += `<em>${line.slice(1, -1)}</em>`;
            } else if (line.startsWith("```")) {
                html += `<pre>${line.slice(3)}</pre>`;
            } else if (line.startsWith("![") && line.endsWith(")")) {
                html += `<img src="${line.slice(2, -1)}" alt="Image" />`;
            } else {
                html += `<p className="mb-4">${line}</p>`;
            }

            // handle inline tags
            html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // **bold**
            html = html.replace(/\*(.*?)\*/g, "<em>$1</em>"); // *italic*
            html = html.replace(/`(.*?)`/g, "<code>$1</code>"); // `code`
            html = html.replace(/~~(.*?)~~/g, "<del>$1</del>"); // ~~strikethrough~~
            html = html.replace(/__(.*?)__/g, "<u>$1</u>"); // __underline__
            html = html.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>"); // [link](url)
            html = html.replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>"); // blockquote
        }

        // restart scroll animations
        setTimeout(() => {
            sal();
        }, 1000);

        return html;
    }

    const scrollTo = (id) => {
        document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <ToastContainer />
            <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />

            <div className="youtube-channel-analyzer rainbow-service-area rainbow-section-gap">
                <div className="caase-details-area-start rts-section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area top-tt">
                                    <span className="pre-title-bg">Content Generators</span>
                                    <h2 className="title">
                                        YouTube Channel Analyzer
                                    </h2>

                                    <p className="disc">
                                        Analyze YouTube channels and videos to optimize your content strategy and boost engagement, views, and subscribers.
                                    </p>

                                    <div className="search__generator mt--50">
                                        <div className="tab-content mt--50" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                <div className="searchoptopn-area mb--30">
                                                    <form action="#" onSubmit={analyze}>
                                                        <input type="text" name="input" id="input" placeholder="Paste YouTube channel username or URL" required defaultValue={input} onChange={(e) => setInput(e.target.value)} />
                                                        <button type="submit">
                                                            {isLoading ? ("Analyzing") : ("Analyze")}
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
                        {(channel && channel.title) && (
                            <div className="search__generator mt--50">
                                <div className="tab-content mt--50" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                        <div className="mb--30">
                                            <div className="row">
                                                <div className="col-lg-8">
                                                    <div className="tool-wrapper">
                                                        <div className="yt-audit__result">
                                                            <div className="card result-base">
                                                                <div>
                                                                    {isLoadingOverview && <ContentSkeleton number={1} />}
                                                                    {(overview && overview.trim() !== "") && (
                                                                        <div className="rainbow-accordion-area rainbow-section-gap p-0">
                                                                            <div className="rainbow-accordion-style  accordion">
                                                                                <div className="accordion" id="accordionExamplea">
                                                                                    <div className="accordion-item card bg-flashlight">
                                                                                        <h2 className="accordion-header card-header">
                                                                                            <span>Overview</span>
                                                                                        </h2>
                                                                                        <div className="accordion-collapse collapse show">
                                                                                            <div className="accordion-body card-body">
                                                                                                <span className="text-white" dangerouslySetInnerHTML={{ __html: convertToHTML(overview) }}></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="tool-wrapper">
                                                        <div className="yt-audit__result">
                                                            <div className="card result-base">
                                                                <div>
                                                                    <div className="result-base-top">
                                                                        <div className="result-base-top-background">
                                                                            <div className="result-base-top-background__image" style={{ '--image-background': `url(${channel.thumbnail})` }}></div>
                                                                            <div className="result-base-top-background__fogging"></div>
                                                                        </div>

                                                                        <div className="result-base-top-header">
                                                                            <div className="result-base-top-avatar">
                                                                                <div className="avatar --circle" style={{ minWidth: '48px', width: '48px', height: '48px' }}>
                                                                                    <img src={channel.thumbnail} width="48px" height="48px" alt="" loading="lazy" className="avatar__img --circle" />

                                                                                    <div className="social-icon fab avatar__social --youtube" style={{ minWidth: '16px', height: '16px', lineHeight: '16px', fontSize: '10px', bottom: '0px', right: '0px' }}></div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="result-base-top-username ml-12">{channel.title}</div>
                                                                            <div className="share result-base-top-share dark">
                                                                                <div className="share__title mr--10">Share</div>
                                                                                <a href="javascript:void(0)" className="share-network-linkedin">
                                                                                    <button className="button button--theme-secondary button--size-md">
                                                                                        <div className="button__content">
                                                                                            <div className="button__icon button__icon--no-margin fab"></div>
                                                                                        </div>
                                                                                    </button>
                                                                                </a>

                                                                                <a href="javascript:void(0)" className="share-network-twitter">
                                                                                    <button className="button button--theme-secondary button--size-md">
                                                                                        <div className="button__content">
                                                                                            <div className="button__icon button__icon--no-margin fab"></div>
                                                                                        </div>
                                                                                    </button>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="result-base-content">
                                                                        <div className="content-value result-base-content-mainValue">
                                                                            <div className="content-value__title">Channel Quality Score</div>
                                                                            <div className="space content-value-main --items-center" style={{ gap: '8px' }}>
                                                                                <div className="content-value-main__value">{qualityScore}</div>

                                                                                <div className="result-base-content-mainValue-labels">
                                                                                    <div className="label result-base-content-mainValue-labels-item label__theme-white label__size-md --type-average">
                                                                                        <div className="label__icon-before">
                                                                                            <div className="result-base-content-mainValue-labels-item__dot"></div>
                                                                                        </div>
                                                                                        <div className="label__text">
                                                                                            <span className={qualityScore >= 70 ? "badge badge-success" : qualityScore >= 50 ? "badge badge-warning" : "badge badge-danger"}>
                                                                                                {qualityScore >= 70 ? "High" : qualityScore >= 50 ? "Average" : "Low"}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="free-report-audit">
                                                                            <div className="free-report-audit__item">
                                                                                <i className="free-report-audit__icon far"></i>
                                                                                <span className="free-report-audit__title text --size-m --weight-regular --theme-default">
                                                                                    <div className="v-popper v-popper--theme-indigo-500">
                                                                                        <div className="tooltip__container --disabled">
                                                                                            Subscribers count
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                                <span className="free-report-audit__metric text --size-m --weight-regular --theme-default">{convertToK(channel.subscriberCount)}</span>
                                                                            </div>

                                                                            <div className="free-report-audit__item">
                                                                                <i className="free-report-audit__icon far"></i>
                                                                                <span className="free-report-audit__title text --size-m --weight-regular --theme-default">
                                                                                    <div className="v-popper v-popper--theme-indigo-500">
                                                                                        <div className="tooltip__container">
                                                                                            Total views
                                                                                            <i className="far tooltip__icon"></i>
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                                <span className="free-report-audit__metric text --size-m --weight-regular --theme-default">{convertToK(channel.viewCount)}</span>
                                                                            </div>

                                                                            <div className="free-report-audit__item">
                                                                                <i className="free-report-audit__icon far"></i>
                                                                                <span className="free-report-audit__title text --size-m --weight-regular --theme-default">
                                                                                    <div className="v-popper v-popper--theme-indigo-500">
                                                                                        <div className="tooltip__container --disabled">
                                                                                            Total videos
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                                <span className="free-report-audit__metric text --size-m --weight-regular --theme-default">{convertToK(channel.videoCount)}</span>
                                                                            </div>

                                                                            <div className="free-report-audit__item">
                                                                                <i className="free-report-audit__icon far fa-dollar-sign"></i>
                                                                                <span className="free-report-audit__title text --size-m --weight-regular --theme-default">
                                                                                    <div className="v-popper v-popper--theme-indigo-500">
                                                                                        <div className="tooltip__container --disabled">
                                                                                            Estimated Networth
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                                <span className="free-report-audit__metric text --size-m --weight-regular --theme-default">${convertToK(estimatedNetworth)}</span>
                                                                            </div>

                                                                            <div className="free-report-audit__item">
                                                                                <i className="free-report-audit__icon far fa-dollar-sign"></i>
                                                                                <span className="free-report-audit__title text --size-m --weight-regular --theme-default">
                                                                                    <div className="v-popper v-popper--theme-indigo-500">
                                                                                        <div className="tooltip__container --disabled">
                                                                                            Estimated Daily Revenue
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                                <span className="free-report-audit__metric text --size-m --weight-regular --theme-default">${convertToK(estimatedRevenue.daily)}</span>
                                                                            </div>

                                                                            <div className="free-report-audit__item">
                                                                                <i className="free-report-audit__icon far fa-dollar-sign"></i>
                                                                                <span className="free-report-audit__title text --size-m --weight-regular --theme-default">
                                                                                    <div className="v-popper v-popper--theme-indigo-500">
                                                                                        <div className="tooltip__container --disabled">
                                                                                            Estimated Weekly Revenue
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                                <span className="free-report-audit__metric text --size-m --weight-regular --theme-default">${convertToK(estimatedRevenue.weekly)}</span>
                                                                            </div>

                                                                            <div className="free-report-audit__item">
                                                                                <i className="free-report-audit__icon far fa-dollar-sign"></i>
                                                                                <span className="free-report-audit__title text --size-m --weight-regular --theme-default">
                                                                                    <div className="v-popper v-popper--theme-indigo-500">
                                                                                        <div className="tooltip__container --disabled">
                                                                                            Estimated Monthly Revenue
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                                <span className="free-report-audit__metric text --size-m --weight-regular --theme-default">${convertToK(estimatedRevenue.monthly)}</span>
                                                                            </div>
                                                                        </div>

                                                                        {isDBSaved && (
                                                                            <div className="free-report-audit">
                                                                                <div className="free-report-audit__item">
                                                                                    <Link href={`/tools/generators/youtube-script-writer/${channel.username}`} className="btn-default btn-large w-100">
                                                                                        Cre8te Script
                                                                                        <i className="fas fa-external-link-alt ml--5"></i>
                                                                                    </Link>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mt-5">
                                                <div className="col-lg-12">
                                                    {isLoadingDemographics && <ContentSkeleton number={1} />}
                                                    {(demographics && Object.keys(demographics).length > 0) && (
                                                        <div className="rainbow-accordion-area rainbow-section-gap p-0">
                                                            <div className="rainbow-accordion-style accordion">
                                                                <div className="accordion" id="accordionExamplea">
                                                                    <div className="accordion-item card bg-flashlight">
                                                                        <h2 className="accordion-header card-header">
                                                                            <span>Demographics</span>
                                                                        </h2>
                                                                        <div className="accordion-collapse collapse show">
                                                                            <div className="accordion-body card-body">
                                                                                <div className="nav feature-nav-btn row">
                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Age Range</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(demographics.ageRange) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Gender</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(demographics.gender) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Location</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(demographics.location) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Interests</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(demographics.interests) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Income Range</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(demographics.incomeRange) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Education</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(demographics.educationLevel) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Language</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(demographics.language) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Relationship Status</h6>
                                                                                            <p className="disc">Single or In a relationship</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isLoadingPsychographics && <ContentSkeleton number={1} />}
                                                    {(psychographics && Object.keys(psychographics).length > 0) && (
                                                        <div className="rainbow-accordion-area rainbow-section-gap p-0">
                                                            <div className="rainbow-accordion-style accordion">
                                                                <div className="accordion" id="accordionExamplea">
                                                                    <div className="accordion-item card bg-flashlight">
                                                                        <h2 className="accordion-header card-header">
                                                                            <span>Psychographics</span>
                                                                        </h2>
                                                                        <div className="accordion-collapse collapse show">
                                                                            <div className="accordion-body card-body">
                                                                                <div className="nav feature-nav-btn row">
                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Motivators</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(psychographics.motivators) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Values</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(psychographics.values) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Attitudes</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(psychographics.attitudes) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Lifestyle</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(psychographics.lifestyle) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Personality</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(psychographics.personalityTraits) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Behavior</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(psychographics.behavior) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Goals</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(psychographics.goals) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Fears</h6>
                                                                                            <p className="disc">N\A</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isLoadingOnlineBehaviors && <ContentSkeleton number={1} />}
                                                    {(onlineBehaviors && Object.keys(onlineBehaviors).length > 0) && (
                                                        <div className="rainbow-accordion-area rainbow-section-gap p-0">
                                                            <div className="rainbow-accordion-style accordion">
                                                                <div className="accordion" id="accordionExamplea">
                                                                    <div className="accordion-item card bg-flashlight">
                                                                        <h2 className="accordion-header card-header">
                                                                            <span>Online Behaviors</span>
                                                                        </h2>
                                                                        <div className="accordion-collapse collapse show">
                                                                            <div className="accordion-body card-body">
                                                                                <div className="nav feature-nav-btn row">
                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Media Content Consumed</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(onlineBehaviors.mediaContentConsumed) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Entertainment Content Consumed</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(onlineBehaviors.entertainmentContentConsumed) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Personal Content</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(onlineBehaviors.personalContent) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Channels They Subscribe To</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(onlineBehaviors.channelsTheySubscribeTo) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Social Media Usage</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(onlineBehaviors.socialMediaUsage) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Online Shopping Habits</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(onlineBehaviors.onlineShoppingHabits) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Preferred Devices</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(onlineBehaviors.preferredDevices) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Time Spent Online</h6>
                                                                                            <p className="disc">Between 1-8 hours daily</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isLoadingOfflineBehaviors && <ContentSkeleton number={1} />}
                                                    {(offlineBehaviors && Object.keys(offlineBehaviors).length > 0) && (
                                                        <div className="rainbow-accordion-area rainbow-section-gap p-0">
                                                            <div className="rainbow-accordion-style accordion">
                                                                <div className="accordion" id="accordionExamplea">
                                                                    <div className="accordion-item card bg-flashlight">
                                                                        <h2 className="accordion-header card-header">
                                                                            <span>Offline Behaviors</span>
                                                                        </h2>
                                                                        <div className="accordion-collapse collapse show">
                                                                            <div className="accordion-body card-body">
                                                                                <div className="nav feature-nav-btn row">
                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Buying Behavior</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(offlineBehaviors.buyingBehavior) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Social Behavior</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(offlineBehaviors.socialBehavior) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Habits</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(offlineBehaviors.habits) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Hobbies</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(offlineBehaviors.hobbies) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Interests</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(offlineBehaviors.interests) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-12 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Lifestyle</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(offlineBehaviors.lifestyle) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Offline Activities</h6>
                                                                                            <p className="disc" dangerouslySetInnerHTML={{ __html: convertToHTML(offlineBehaviors.offlineActivities) }}></p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-lg-3 col-md-6 nav-link">
                                                                                        <div className="single-core-feature">
                                                                                            <h6 className="title">Establishments Visited</h6>
                                                                                            <p className="disc">N\A</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
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
                                            <h2 className="title">Unlock Your YouTube Growth Potential</h2>
                                            <p className="disc">
                                                Optimize your YouTube content strategy and boost engagement, views, and subscribers with Cre8teGPT's YouTube Channel Analyzer. Enter your channel username and receive a comprehensive analysis of your channel in seconds. Discover valuable insights into your audience's demographics, psychographics, online and offline behavior, and more. Transform your YouTube channel with data-driven strategies designed to maximize your impact and growth.
                                            </p>

                                            <div className="button-group mt--50 text-center">
                                                <button className="btn-default btn-large" onClick={() => scrollTo('.pre-title-bg')}>
                                                    Analyze Your Channel Now
                                                    <i className="fa-solid fa-arrow-right ml--10"></i>
                                                </button>
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

                        <Separator top={true} />

                        <div className="rts-blog-area rts-section-gapTop">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="title-conter-area">
                                            <span className="pre-title-bg">Samples</span>
                                            <h2 className="title">
                                                AI-powered YouTube Channel Reports
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-5 mt--5">
                                    {isLoadingChannels && <ContentSkeleton number={3} />}
                                    {channels && channels.map((channel, index) => (
                                        <div className="col-lg-4 col-md-6 col-sm-12 col-12" key={index}>
                                            <div className="single-blog-area-wrapper">
                                                <Link href={'/tools/generators/youtube-channel-analyzer/' + channel.channel_details.username} className="thumbnail">
                                                    <img src={channel.channel_details.thumbnail} alt={channel.channel_details.title + '| Cre8teGPT'} width={420} height={244} />
                                                </Link>
                                                <div className="inner-content">
                                                    <div className="head">
                                                        <span className="tag">{convertToK(channel.channel_details.subscriberCount)} Subscribers</span>
                                                        <span className="time">{convertToK(channel.channel_details.viewCount)} Views</span>
                                                    </div>
                                                    <div className="body">
                                                        <a href={'/tools/generators/youtube-channel-analyzer/' + channel.channel_details.username}>
                                                            <h5 className="title">{channel.channel_details.title}</h5>
                                                        </a>
                                                        <div className="author-area">
                                                            <div className="author">
                                                                <img src={channel.channel_details.thumbnail} alt={channel.channel_details.title + '| Cre8teGPT'} width={40} height={40} />
                                                                <div className="info">
                                                                    <p className="text-capitalize">{channel.channel_details.username}</p>
                                                                    <span>Channel</span>
                                                                </div>
                                                            </div>
                                                            <a href={'/tools/generators/youtube-channel-analyzer/' + channel.channel_details.username}>
                                                                View Report 
                                                                <i className="fa-solid fa-arrow-right"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="col-lg-12">
                                        <div className="button-group mt--50 text-center">
                                            <Link href="/tools/generators/youtube-channel-analyzer/channels" className="btn-default btn-large">
                                                View More
                                                <i className="fa-solid fa-arrow-right ml--10"></i>
                                            </Link>
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

export default ImageGeneratorV2;