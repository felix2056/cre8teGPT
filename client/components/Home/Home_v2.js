import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import "venobox/dist/venobox.min.css";

import bannerImg from "../../public/images/banner/banner-image-03.webp";
import separator from "../../public/images/separator/separator-top.svg";

const Home = () => {
    useEffect(() => {
        import("venobox/dist/venobox.min.js").then((venobox) => {
            new venobox.default({
                selector: ".popup-video",
                maxWidth: window.innerWidth >= 992 ? "50%" : "100%",
            });
        });
    }, []);

    return (
        <>
            <div
                className="slider-area slider-style-1 variation-default slider-bg-image bg-banner1"
                data-black-overlay="1"
            >
                {/* v2 class: rts-banner-area-one bg_image--1 bg_image rts-section-gap */}
                <div className="slider-area slider-style-1 variation-default slider-bg-image bg-banner1">
                    <div className="container mt--50">
                        <div className="row justify-content-center">
                            <div className="col-lg-12">
                                <div className="content-main-wrapper">
                                    <h1 className="title">
                                        Unlock Your Inner Cre8tive Powerhouse with  <br />
                                        <span className="wrap">Cre8teGPT AI</span>
                                    </h1>

                                    <p className="disc">
                                        Your <strong>All-in-One AI-Powered Game Changer</strong> designed to empower content creators, marketers, students and businesses of all sizes. <br /><strong>Discover 100+ AI Tools In 1 Place!</strong>
                                    </p>

                                    <div className="button-group">
                                        <form>
                                            <div className="small-search search-section mb--20 m-0-auto w-sm-95 w-50">
                                                <input className="text-md-center w-100" type="search" placeholder="Tell me your goal, I'll list the AI tools you need to make it happen." />
                                                <i className="feather-search"></i>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="button-area">
                                        <Link href="/dashboard" className="rts-btn btn-primary text-white">Start Cre8ting for Free</Link>
                                        <a href="contact.html" className="rts-btn btn-blur">Request demo</a>
                                    </div>

                                    <div className="user-area">
                                        <p>10,000+ Cre8tors saving 100s of hours</p>
                                        <div className="image-wrapper">
                                            <img className="one" src="/images/banner/user/01.png" alt="user" loading="lazy" />
                                            <img className="two" src="/images/banner/user/02.png" alt="user" loading="lazy" />
                                            <img className="three" src="/images/banner/user/04.png" alt="user" loading="lazy" />
                                            <img className="four" src="/images/banner/user/03.png" alt="user" loading="lazy" />
                                            <img className="five" src="/images/banner/user/05.png" alt="user" loading="lazy" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-10 col-xl-10 order-1 order-lg-2">
                                <div className="frame-image frame-image-bottom bg-flashlight video-popup icon-center">
                                    <Image src={bannerImg} alt="Banner Images" />
                                    <div className="video-icon">
                                    <Link
                                        className="btn-default rounded-player popup-video border bg-white-dropshadow"
                                        href="https://youtu.be/ThRYF96HIzA?si=Yz-Yc5HSf8uLPv-G"
                                        data-vbtype="video"
                                    >
                                        <span>
                                        <i className="feather-play"></i>
                                        </span>
                                    </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="cre8tegpt-separator has-position-bottom">
                        <Image className="w-100" src={separator} alt="" />
                    </div>

                    {/* <div className="bottom-mid-img">
                        <img src="/images/banner/01.png" alt="banenr mimage" loading="lazy" />
                    </div> */}

                    <div className="usefull-for-ani">
                        <div className="single">
                            <img src="/images/banner/user/06.png" alt="img" loading="lazy" />
                            <span>Influencers</span>
                        </div>
                        <div className="single blog">
                            <img src="/images/banner/user/05.png" alt="img" loading="lazy" />
                            <span>Content Cre8tors</span>
                        </div>
                        <div className="single copy">
                            <img src="/images/banner/user/03.png" alt="img" loading="lazy" />
                            <span>Startups</span>
                        </div>
                        <div className="single freelancer">
                            <img src="/images/banner/user/04.png" alt="img" loading="lazy" />
                            <span>Students</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
