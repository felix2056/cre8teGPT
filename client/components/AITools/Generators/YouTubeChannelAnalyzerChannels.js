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

const YouTubeChannelAnalyzerChannels = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [isLoadingChannels, setIsLoadingChannels] = useState(false);
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

    const getChannels = async () => {
        setIsLoadingChannels(true);

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/generators/youtube-channel-analyzer`);

            if (response && response.data) {
                await setChannels(response.data.channels);
                setIsLoadingChannels(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoadingChannels(false);
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
                                    <span className="pre-title-bg">Samples</span>
                                    <h2 className="title">
                                        Explore Real-World Channel Analyses
                                    </h2>

                                    <p className="disc">
                                        See how others are crushing YouTube with Cre8teGPT! Explore real-world channel analyses and discover insights to propel your own success.
                                    </p>

                                    <div className="button-group mt--50 text-center">
                                        <Link href="/tools/generators/youtube-channel-analyzer" className="btn-default btn-large">
                                            Analyze Your Channel Now
                                            <i className="fa-solid fa-arrow-right ml--10"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator top={true} />

                        <div className="rts-blog-area rts-section-gapTop">
                            <div className="container">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default YouTubeChannelAnalyzerChannels;