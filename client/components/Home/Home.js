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
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="inner text-center mt--60">
                <h1 className="title display-one">
                  Unlock Your Inner Creative Powerhouse with 
                  <br />
                  <span className="theme-gradient">Cre8teGPT AI</span>
                  {/* <br />
                  <span className="color-off">Discover 100+ AI Tools In 1 Place!</span> */}
                </h1>

                <p className="b1 desc-text">
                  AI-Powered Game Changer designed to empower content creators, marketers, students and businesses of all sizes. <br /> Your All-in-One AI Assistant — <span className="theme-gradient">Discover 100+ AI Tools In 1 Place.</span>
                </p>

                <div className="button-group">
                  <form>
                    <div class="small-search search-section mb--20 m-0-auto w-sm-95 w-75">
                      <input className="text-left" type="search" placeholder="Tell me your goal, I'll list the AI tools you need to make it happen." />
                      <i class="feather-search"></i>
                    </div>
                  </form>
                </div>
                
                <div className="button-group">
                  <Link
                    className="btn-default bg-light-gradient btn-large"
                    href="/text-generator"
                  >
                    <div className="has-bg-light"></div>
                    <span>Start Cre8ting for Free</span>
                  </Link>
                </div>
                <p className="color-gray mt--5">💳 No credit card required!</p>
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
      </div>
    </>
  );
};

export default Home;
